import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';


import { Constants } from "../utils/constants";
import { UserRecordsDBService } from '../controllers/services/db_service/user_records_db_service';


export class VerifyToken {
    userRecordsDBService: UserRecordsDBService;

    constructor(userRecordsDBService: UserRecordsDBService) {
        this.userRecordsDBService = userRecordsDBService;
        this.verifyAccessToken = this.verifyAccessToken.bind(this);
    }

    async verifyAccessToken(request: Request, response: Response, next: NextFunction): Promise<void> {



        try {
            console.log("request.headers", request.headers.authorization);


            const accessToken: string = request.headers.authorization!.split(" ")[1];

            if (!accessToken) {
                response.status(401).send({ "status": false, "message": Constants.kUnauthorized });
                return;
            }



            const accessTokenSecret: string = process.env.ACCESSTOKENSECRET!;

            const decodedToken = jwt.verify(accessToken, accessTokenSecret);


            const user = await this.userRecordsDBService.fetchUser({ id: (decodedToken as jwt.JwtPayload).uid });

            if (user == null || user.accessToken != accessToken) throw new Error(Constants.kUnauthorized);

            // Attach the decoded token to the request object
            request.app.locals.decodedToken = decodedToken;

            next();

        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                response.status(419).send({ "status": false, "message": Constants.kTokenExpired });
                return;
            }

            response.status(401).send({ "status": false, "message": Constants.kUnauthorized });
            return;
        }
    };
}


