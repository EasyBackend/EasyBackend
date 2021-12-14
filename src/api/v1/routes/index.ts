import express from "express";
import customTypeRouter from "./custom-type/custom-type-create";

const api = express.Router();

api.use("/customType", customTypeRouter);

export default api;
