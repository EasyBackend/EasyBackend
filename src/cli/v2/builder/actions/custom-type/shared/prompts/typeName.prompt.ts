import {
  RestProjectTracker,
  GqlProjectTracker,
  ValidationRes,
  validateCustomTypeName,
} from "eb-lib";
import inquirer from "inquirer";
import Logger from "../../../../../../../logger/logger";
import { InterfaceStorageType } from "../../../../../../../types";

import { customTypeQuestions } from "../custom-type-questions";

export const promptForTypeName = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  invalid?: boolean
) => {
  // if user enters an invalid type name it becomes recursive and asks the user for a type name again
  if (invalid) Logger.error("Invalid type name, please try again.");

  const { typeName } = await inquirer.prompt([customTypeQuestions.typeName]);

  const { isValid } = await validateCustomTypeName(typeName, tracker);

  isValid === ValidationRes.VALID
    ? tracker.addToStorage({
        key: InterfaceStorageType.typeName,
        value: typeName,
      })
    : await promptForTypeName(tracker, true);
};
