import Logger from "../../../logger/logger";
import { ISchemaCreationParams } from "../../../types";
import { ValidationRes } from "../../../utils";
import { validateSchemaBeforeCreation } from "../../input-validations";
import { createTextDatabaseSchema } from "./databaseSchema.util";

/**
 * @param { ISchemaCreationParams } IDatabaseSchemaCreationParams
 * {
  schemaProps: string[];
  schemaName: string;
  uniqueProperty: string;
  requiredProps: string[];
} 
 */
export const createDatabaseSchema = async (
  schemaCreationParams: ISchemaCreationParams
) => {
  const { isValid, message } = await validateSchemaBeforeCreation(
    schemaCreationParams
  );
  if (isValid === ValidationRes.VALID) {
    await doCreateDatabaseSchema(schemaCreationParams);
  } else {
    Array.isArray(message)
      ? message.forEach((message) => {
          Logger.error(message);
        })
      : Logger.error(message);
  }
};

const doCreateDatabaseSchema = async (
  schemaCreationParams: ISchemaCreationParams
) => {
  Logger.info("Creating a new custom type interface");

  const textDBSchema = createTextDatabaseSchema(schemaCreationParams);

  console.log("CREATED, text DB Schema: ", textDBSchema);
};
