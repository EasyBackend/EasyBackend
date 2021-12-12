import inquirer from "inquirer";
import { DatabaseStorageType } from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";
import { databaseSchemaQuestions } from "../databaseShema.questions";

export const chooseUniqueProp = async (
  tracker: RestProjectTracker | GqlProjectTracker
): Promise<string | void> => {
  const { uniqueProp } = await inquirer.prompt([
    databaseSchemaQuestions.uniqueProp,
  ]);

  if (uniqueProp) {
    const typeProps = tracker.getFromStorage(DatabaseStorageType.schemaProps);

    const { chosenUniqueProperty } = await inquirer.prompt([
      databaseSchemaQuestions.chooseUniqueProp(typeProps),
    ]);

    if (chosenUniqueProperty)
      tracker.addToStorage({
        key: DatabaseStorageType.uniqueProperty,
        value: chosenUniqueProperty,
      });
  }
};