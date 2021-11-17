import { Request, Response } from "express";

import Logger from "../../../../../logger/logger";
import { ICustomTypeCreationParams } from "../../../../../types";

import { validateCustomTypeBeforeCreation } from "../../../../../cli/v2/builder/actions/customType/customType.validations/input-validations";
import { ValidationRes } from "../../../../../utils";

/**
 * @param { ICustomTypeCreationParams } ICustomTypeCreationParams
 */
export const createCustomType = async (
  customTypeCreationParams: ICustomTypeCreationParams
) => {
  const { isValid, message } = await validateCustomTypeBeforeCreation(
    customTypeCreationParams
  );
  if (isValid === ValidationRes.VALID) {
  } else {
    Array.isArray(message)
      ? message.forEach((message) => {
          Logger.error(message);
        })
      : Logger.error(message);
  }
};
export const createCustomTypeFromAPI = async (req: Request, res: Response) => {
  Logger.http("I AM HERE HERE HEREEE");
  // TODO: FIX ANY
  const customTypeCreationParams: any = req.body;
  await createCustomType(customTypeCreationParams);
};
