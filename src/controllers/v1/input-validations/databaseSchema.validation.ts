import { ISchemaCreationParams } from "../../../types";
import { ValidationRes } from "../../../utils";

export const validateSchemaBeforeCreation = async (
  schemaCreationParams: ISchemaCreationParams
): Promise<{ isValid: ValidationRes; message: string }> => {
  return { isValid: ValidationRes.VALID, message: "yay" };
};
