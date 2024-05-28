// require('dotenv').config({path: './env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
// import mongoose, { mongo } from "mongoose";
// import { DB_NAME } from "./constants";

dotenv.config({
    path: "./env",
});

connectDB()
    .then(() => {
        const port_var = process.env.PORT || 8000;
        app.on("error", (err) => {
            console.log(`Error while strating server: ${err}`);
        });
        app.listen(port_var, () => {
            console.log(`Server is running on port ${port_var}`);
        });
    })
    .catch((err) => {
        console.log("MONGO ERROR! =>  ", err);
    });

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
