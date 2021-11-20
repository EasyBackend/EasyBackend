import Logger from "../../../logger/logger";

import { createCustomType } from "../../../controllers";

export const createCustomTypeFromAPI = async (req: Request, res: Response) => {
  Logger.http("I AM HERE HERE HEREEE");
  // TODO: FIX ANY
  const customTypeCreationParams: any = req.body;
  await createCustomType(customTypeCreationParams);
};

export const createCustomTypeFromJSON = async () => {};
