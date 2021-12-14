import express from "express";
import routes from "./routes";
import connectToDb from "../../db/connection";
import loggerMiddleWare from "../../logger/morgan";
import http from "http";
import { notFound } from "../../utils";

// const { admin } = require("./src/utils/firebase.util");
connectToDb();
const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use(loggerMiddleWare);
app.use("/v1/api", routes);
app.use(notFound);
export default server;
