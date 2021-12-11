import Logger from "../../../logger/logger";
import { ICustomTypeCreationParams } from "../../../types";
import { validateCustomTypeBeforeCreation } from "../../../cli/v2/builder/actions/customType/customType.validations/input-validations";
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
  customTypePropParams: ICustomTypeCreationParams
) => {
  const { isValid, message } = await validateCustomTypeBeforeCreation(
    customTypePropParams
  );
  if (isValid === ValidationRes.VALID) {
    await doCreateCustomType(customTypePropParams);
  } else {
    Array.isArray(message)
      ? message.forEach((message) => {
          Logger.error(message);
        })
      : Logger.error(message);
  }
};

const doCreateCustomType = async ({
  typeProps,
  typeName,
  dbSchema,
}: ICustomTypeCreationParams) => {
  const textInterface = createTextInterface({ typeProps, typeName });
  // imhere in creating a DB schema
  const textDBSchema = dbSchema ? {} : null;
};
