import { Request, Response } from "express";
import DareService from "../services/dare_service/dare_service";
import responseModel from "../../models/models/response_model";
import { handleError } from "../../utils/exceptions/exception_handler";
import Helpers from "../../utils/helpers";
import { Constants } from "../../utils/constants";
import { DareInterface } from "../../models/interface/dare_interface";

class DareController {

    constructor(private dareService: DareService) {
        this.dareService = dareService;
        this.getRandomDare = this.getRandomDare.bind(this);
        this.addNewDare = this.addNewDare.bind(this);
        this.removeDare = this.removeDare.bind(this);
        this.editDare = this.editDare.bind(this);
        this.filterDares = this.filterDares.bind(this);
        this.getAllDares = this.getAllDares.bind(this);
    }

    async getRandomDare(req: Request, res: Response): Promise<void> {
        try {
            const randomDare = await this.dareService.getRandomDare();
            res.status(200).send(responseModel({ "status": true, "message": "Dare fetched successfully", "data": Helpers.cleanDareData(randomDare) }));
        } catch (e) {
            return handleError(e, res);
        }
    }

    async getAllDares(req: Request, res: Response): Promise<void> {
        try {
            const randomDare = await this.dareService.getAllDares();
            res.status(200).send(responseModel({ "status": true, "message": "Dare fetched successfully", "data": randomDare.map(dare => Helpers.cleanDareData(dare)) }));
        } catch (e) {
            return handleError(e, res);
        }
    }

    async filterDares(req: Request, res: Response): Promise<void> {
        try {
            if (!req.query.title && !req.query.description) {
                res.status(400).send(responseModel({ "status": false, "message": "Invalid filter request" }));
                return;
            }

            const result = await this.dareService.filterDares(req.query.title as string, req.query.description as string);
            res.status(200).send(responseModel({ "status": true, "message": "Dare fetched successfully", "data": result.map(dare => Helpers.cleanDareData(dare)) }));
        } catch (e) {
            return handleError(e, res);
        }
    }

    async addNewDare(req: Request, res: Response) {
        try {
            const dare = req.body;

            if (Helpers.containsNullOrUndefined([
                dare.title,
                dare.description,
                dare.difficulty
            ])) {
                res.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            const newDare = await this.dareService.addNewDare(dare);
            res.status(200).send(responseModel({ "status": true, "message": "Dare added successfully", "data": Helpers.cleanDareData(newDare) }));
        } catch (e) {
            return handleError(e, res);
        }
    }

    async removeDare(req: Request, res: Response) {
        try {

            if (Helpers.containsNullOrUndefined([
                req.body.id
            ])) {
                res.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            const dareId = await this.dareService.removeDare(req.body.id);
            res.status(200).send(responseModel({ "status": true, "message": "Dare removed successfully", "data": { "id": dareId } }));
        } catch (e) {
            return handleError(e, res);
        }
    }

    async editDare(req: Request, res: Response) {
        try {

            const dare: DareInterface = req.body;

            if (Helpers.containsNullOrUndefined([
                dare.id,
            ])) {
                res.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            const editedDare = await this.dareService.editDare(dare);
            res.status(200).send(responseModel({ "status": true, "message": "Dare edited successfully", "data": Helpers.cleanDareData(editedDare) }));
        } catch (e) {
            return handleError(e, res);
        }
    }
}

export default DareController;