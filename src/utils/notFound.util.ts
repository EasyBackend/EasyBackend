import { Response, Request } from "express";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: "route not found" });
};
