import express from "express";
import customTypeRouter from "./customType/customType.create";

const api = express.Router();

api.use("/customType", customTypeRouter);

export default api;
