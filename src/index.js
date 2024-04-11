// require('dotenv').config({path: './env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
// import mongoose, { mongo } from "mongoose";
// import { DB_NAME } from "./constants";

dotenv.config({
    path: './env',
})

connectDB()

/* 
import { express } from "express";
const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`APP IS LISTENING ON PORT: ${process.env.PORT}`);
        })

    } catch (error) {
        console.log("ERROR: ", error)
        throw error
    }
})()
*/