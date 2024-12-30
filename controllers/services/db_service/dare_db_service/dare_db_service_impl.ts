import { Filter, getFirestore } from 'firebase-admin/firestore';
import { app } from '../../../../config/firebase';
import { Constants } from '../../../../utils/constants';

import DareInterface from "../../../../models/interface/dare_interface";
import DareDBService from "./dare_db_service";

class DareDBServiceImpl implements DareDBService {
    private db = getFirestore(app);


    async getAllDares(): Promise<DareInterface[]> {
        try {
            const documents = await this.db.collection(Constants.kDaresCollection).get();
            return documents.docs.map((doc) => doc.data() as DareInterface);
        } catch (e) {
            throw e;
        }
    }

    async filterDares(title?: string | undefined | null, description?: string | undefined | null): Promise<DareInterface[]> {
        try {
            const filters: Filter[] = [];

            if (title) {
                filters.push(Filter.where('titleKeywords', 'array-contains-any', title.split(' ').map((word) => word.toLowerCase())));
            }
            if (description) {
                filters.push(Filter.where('descriptionKeywords', 'array-contains-any', description.split(' ').map((word) => word.toLocaleLowerCase())));
            }


            const documents = await this.db.collection(Constants.kDaresCollection).where(Filter.or(...filters)).get();
            return documents.docs.map((doc) => doc.data() as DareInterface);
        } catch (e) {
            throw e;
        }
    }


    async addNewDare(dare: DareInterface): Promise<DareInterface> {
        try {
            const daresCount = (await this.db.collection(Constants.kDaresCollection).count().get()).data().count;

            dare.index = daresCount
            dare.createdAt = new Date().toISOString();
            dare.deleted = false;
            dare.updatedAt = null;
            dare.deletedAt = null;
            dare.titleKeywords = dare.title.split(' ').map((word) => word.toLowerCase());
            dare.descriptionKeywords = dare.description.split(' ').map((word) => word.toLowerCase());

            const docRef = await this.db.collection(Constants.kDaresCollection).add(dare);
            dare.id = docRef.id;

            return dare;

        } catch (e) {
            throw e;
        }
    }

    async removeDare(dareId: string): Promise<string> {
        try {
            return await this.db.collection(Constants.kDaresCollection).doc(dareId).update(
                {
                    "deleted": true,
                    "deletedAt": new Date().toISOString()
                },

            ).then((_) => dareId);
        } catch (e) {
            throw e;
        }
    }

    async editDare(dare: DareInterface): Promise<DareInterface> {
        try {
            dare.updatedAt = new Date().toISOString();
            return await this.db.collection(Constants.kDaresCollection).doc(dare.id).update(
                { ...dare }

            ).then((_) => dare);
        } catch (e) {
            throw e;
        }
    }

    async getRandomDare(): Promise<DareInterface> {
        try {
            const daresCount = await this.db.collection(Constants.kDaresCollection).count().get();

            const randomField = Math.random() * daresCount.data().count;

            // Query for the first document where random_field >= random value
            const snapshot = await this.db.collection(Constants.kDaresCollection)
                .where(Filter.and(Filter.where('index', '>=', randomField), Filter.where('deleted', '==', false)))
                .orderBy('index')
                .limit(1)
                .get();

            // If no documents found, query for first document where random_field < random value
            if (snapshot.empty) {
                const snapshot2 = await this.db.collection(Constants.kDaresCollection)
                    .where(Filter.and(Filter.where('index', '<=', randomField), Filter.where('deleted', '==', false)))
                    .orderBy('index')
                    .limit(1)
                    .get();

                if (snapshot2.empty) {
                    throw new Error('No dare found');
                }

                const dare = snapshot2.docs[0].data() as DareInterface;
                dare.id = snapshot2.docs[0].id;
                return dare;
            }

            if (snapshot.empty) {
                throw new Error('No dare found');
            }

            const dare = snapshot.docs[0].data() as DareInterface;
            dare.id = snapshot.docs[0].id;
            return dare;
        } catch (e) {
            throw e;
        }
    }
}

export default DareDBServiceImpl;