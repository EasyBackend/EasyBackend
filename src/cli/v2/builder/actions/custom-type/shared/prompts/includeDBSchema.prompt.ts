import inquirer from "inquirer";
import {
  InterfaceStorageType,
  DatabaseStorageType,
} from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";
import { chooseUniqueProp } from "../../../database-schema/shared/prompts";
import { customTypeQuestions } from "../custom-type-questions";

export const shouldIncludeDBSchema = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const { dbSchema } = await inquirer.prompt([
    customTypeQuestions.includeDBSchema,
  ]);

  tracker.addToStorage(
    { key: InterfaceStorageType.includeDBSchema, value: dbSchema },
    true
  );

  if (dbSchema) {
    const schemaProps: string[] = tracker.getFromStorage(
      InterfaceStorageType.typeCreationProps
    );

    const schemaName: string = tracker.getFromStorage(
      InterfaceStorageType.typeName
    );

    tracker.addToStorage({
      key: DatabaseStorageType.schemaProps,
      value: schemaProps,
    });

    tracker.addToStorage({
      key: DatabaseStorageType.schemaName,
      value: schemaName,
    });

    await chooseUniqueProp(tracker);
  }
};
