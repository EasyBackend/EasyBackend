import { Router } from "express";

import customTypeCreateR from "./customType.create";

const customTypeRouter = Router();

customTypeRouter.use("/create", customTypeCreateR);

export default customTypeRouter;
