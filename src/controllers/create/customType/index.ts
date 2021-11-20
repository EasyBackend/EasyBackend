import path from "path";

import Logger from "../../../logger/logger";
import { ICustomTypeCreationParams } from "../../../types";

import { validateCustomTypeBeforeCreation } from "../../../cli/v2/builder/actions/customType/customType.validations/input-validations";
import { ValidationRes } from "../../../utils";
import { isConstructorDeclaration } from "typescript";

/**
 * @param { ICustomTypeCreationParams } ICustomTypeCreationParams
 * {
  typeProps: string[ ];
  typeName: string;
} 
 */
export const createCustomType = async (
  customTypeCreationParams: ICustomTypeCreationParams
) => {
  const { isValid, message } = await validateCustomTypeBeforeCreation(
    customTypeCreationParams
  );
  if (isValid === ValidationRes.VALID) {
    console.log("LOCATION: ", process.cwd());
    console.log("RESOLVED: ", path.resolve(process.cwd(), "./src/types"));
  } else {
    Array.isArray(message)
      ? message.forEach((message) => {
          Logger.error(message);
        })
      : Logger.error(message);
  }
};
