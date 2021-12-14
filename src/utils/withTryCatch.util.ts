import { Request, Response } from "express";
import Logger from "../logger/logger";

export const withTryCatch = async (
  req: Request,
  res: Response,
  cb: (
    req: Request,
    res: Response
  ) => Promise<void> | Promise<Response<any, Record<string, any>>>
) => {
  try {
    await cb(req, res);
  } catch (e: any) {
    if (e?.customMessage) {
      return res.status(e?.status || 500).json({ error: e.customMessage });
    }
    Logger.error(e.message);
    return res.status(500).json({ error: "error occurred" });
  }
};
