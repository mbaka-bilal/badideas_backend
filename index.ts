import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import responseModel from "./models/models/response_model";
import authRoute from "./routes/auth_route";
import Helpers from "./utils/helpers";

dotenv.config();
const PORT = process.env.PORT || 5212;

const app = express();

app.use(urlencoded({ "extended": true }));
app.use(express.json());
app.use(cookieParser());


//TODO add a logger to logs all incoming requests.

//routes
app.use("/api/v1", authRoute);

app.all("/", (req, res) => {
    res.status(404).send({ "status": false, "message": "Unknown route" });
});

app.use((req, res) => {
    Helpers.printAndAddToLog("Api Request handeled by no middleware", req.body);

    res.status(404).send(responseModel({
        "status": false,
        "message": "Uknown path"
    }));
});


app.listen(PORT, () => {
    console.log("listening on port", PORT);
});