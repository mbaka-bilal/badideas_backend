import express from 'express';
import DareController from '../controllers/controllers/dare_controller';
import DareServiceImpl from '../controllers/services/dare_service/dare_service_impl';
import DareDBServiceImpl from '../controllers/services/db_service/dare_db_service/dare_db_service_impl';
import { UserRecordsDBServiceImpl } from '../controllers/services/db_service/user_records/user_records_db_service_impl';
import { VerifyToken } from '../middleware/verify_token';

const dareRoute = express.Router();

const dareController = new DareController(new DareServiceImpl(new DareDBServiceImpl()));
const verifyToken = new VerifyToken(new UserRecordsDBServiceImpl());

dareRoute.get("/randomDare", verifyToken.verifyAccessToken, dareController.getRandomDare);
dareRoute.post("/addNewDare", verifyToken.verifyAccessToken, dareController.addNewDare);
dareRoute.delete("/removeDare", verifyToken.verifyAccessToken, dareController.removeDare);
dareRoute.patch("/editDare", verifyToken.verifyAccessToken, dareController.editDare);
dareRoute.get("/filterDares", verifyToken.verifyAccessToken, dareController.filterDares);
dareRoute.get("/allDares", verifyToken.verifyAccessToken, dareController.getAllDares);

export default dareRoute;