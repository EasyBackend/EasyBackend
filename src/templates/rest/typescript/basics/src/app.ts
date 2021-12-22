import express from "express";
import http from "http";
import routes from "./routes";
import connectToDb from "./db/connection";
import loggerMiddleWare from "./logger/morgan";
import { notFound } from "./utils";

// const { admin } = require("./src/utils/firebase.util");
connectToDb();
const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use(loggerMiddleWare);
app.use("/api", routes);
app.use(notFound);
export default server;
