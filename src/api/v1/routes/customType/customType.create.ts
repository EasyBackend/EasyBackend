import { Router } from "express";

import { withTryCatch } from "../../../../utils";

import { createCustomTypeFromAPI } from "../../controllers";

const customTypeCreateR = Router();

customTypeCreateR.get("/", (req, res) =>
  withTryCatch(req, res, createCustomTypeFromAPI)
);

export default customTypeCreateR;
