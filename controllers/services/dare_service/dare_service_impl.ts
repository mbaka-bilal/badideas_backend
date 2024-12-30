import DareInterface from "../../../models/interface/dare_interface";
import DareDBService from "../db_service/dare_db_service/dare_db_service";
import DareService from "./dare_service";

class DareServiceImpl implements DareService {
    dareDBService: DareDBService;


    constructor(dareDBService: DareDBService) {
        this.dareDBService = dareDBService;
        this.getRandomDare = this.getRandomDare.bind(this);
        this.addNewDare = this.addNewDare.bind(this);
        this.removeDare = this.removeDare.bind(this);
        this.editDare = this.editDare.bind(this);
        this.getAllDares = this.getAllDares.bind(this);
        this.filterDares = this.filterDares.bind(this);
    }

    async getAllDares(): Promise<DareInterface[]> {
        try {
            return await this.dareDBService.getAllDares();
        } catch (e) {
            throw e;
        }
    }

    async filterDares(title?: string | undefined | null, description?: string | undefined | null): Promise<DareInterface[]> {
        try {
            return await this.dareDBService.filterDares(title, description);
        } catch (e) {
            throw e;
        }
    }

    async addNewDare(dare: DareInterface): Promise<DareInterface> {
        try {
            return await this.dareDBService.addNewDare(dare);
        } catch (e) {
            throw e;
        }
    }

    async removeDare(dareId: string): Promise<string> {
        try {
            return await this.dareDBService.removeDare(dareId);
        } catch (e) {
            throw e;
        }
    }

    async editDare(dare: DareInterface): Promise<DareInterface> {
        try {
            return await this.dareDBService.editDare(dare);
        } catch (e) {
            throw e;
        }
    }

    async getRandomDare(): Promise<DareInterface> {
        try {
            return await this.dareDBService.getRandomDare();
        } catch (e) {
            throw e;
        }
    }
}

export default DareServiceImpl;