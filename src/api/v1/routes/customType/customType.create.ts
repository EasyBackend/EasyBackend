import { Router } from "express";

import { withTryCatch } from "../../../../utils";

const customTypeCreateR = Router();

// customTypeCreateR.get("/", (req, res) =>
//   withTryCatch(req, res, createCustomTypeFromAPI)
// );

export default customTypeCreateR;
