import Logger from "../../../logger/logger";
import { ICustomTypeCreationParams } from "../../../types";
import { validateCustomTypeBeforeCreation } from "../../input-validations";
import { ValidationRes } from "../../../utils";
import { createTextInterface } from "./customType.util";

/**
 * @param { ICustomTypeCreationParams } ICustomTypeCreationParams
 * {
  typeProps: string[ ];
  typeName: string;
} 
 */
export const createCustomType = async (
  customTypeParams: ICustomTypeCreationParams
) => {
  const { isValid, message } = await validateCustomTypeBeforeCreation(
    customTypeParams
  );
  if (isValid === ValidationRes.VALID) {
    await doCreateCustomType(customTypeParams);
  } else {
    Array.isArray(message)
      ? message.forEach((message) => {
          Logger.error(message);
        })
      : Logger.error(message);
    throw Error("Error creating custom type");
    // TODO: error handling
  }
};

const doCreateCustomType = async (
  customTypePropParams: ICustomTypeCreationParams
) => {
  Logger.info("Creating a new custom type interface");

  const textInterface = createTextInterface(customTypePropParams);

  console.log("CREATED TEXT INTERFACE: ", textInterface);
};
