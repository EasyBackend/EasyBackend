import mongoose from "mongoose";
import Logger from "../logger/logger";

require("dotenv").config();
mongoose.set("useFindAndModify", false);
const connectToDb = () =>
  mongoose.connect(
    process.env.MONGO_URI as string,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      Logger.info("connected to database");
    }
  );

export default connectToDb;
