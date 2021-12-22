import mongoose from "mongoose";
import Logger from "../logger/logger";

require("dotenv").config();

const connectToDb = () =>
  mongoose.connect(process.env.MONGO_URI as string, () => {
    Logger.info("connected to database");
  });

export default connectToDb;
