import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/database/db.database.js";
import { generateInterviewReport } from "./src/services/ai.service.js";
import {jobDescription, resume, selfDescription} from "./src/services/temp.js";

dotenv.config({
    path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`server on running port : http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("FAILED MongoDB connection : ", error);
        process.exit(1);
    });
