import inquirer from "inquirer";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";
import { DatabaseStorageType } from "./../../../../../../../types/trackerStorage";
import { databaseSchemaQuestions } from "../databaseShema.questions";

export const chooseRequiredProps = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeProps = tracker.getFromStorage(DatabaseStorageType.schemaProps);

  const { requiredProps } = await inquirer.prompt([
    databaseSchemaQuestions.chooseRequiredProps(typeProps),
  ]);

  tracker.addToStorage({
    key: DatabaseStorageType.requiredProps,
    value: requiredProps,
  });
};
