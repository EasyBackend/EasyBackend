import inquirer from "inquirer";

import Logger from "../../../../../../../logger/logger";
import { StorageType } from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
  ValidationRes,
} from "../../../../../../../utils";

import { validateCustomTypeName } from "../../customType.validations/input-validations";
import { customTypeQuestions } from "..";

export const promptForTypeName = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  invalid?: boolean
) => {
  // if user enters an invalid type name it becomes recursive and asks the user for a type name again
  if (invalid) Logger.error("Invalid type name, please try again.");
  const { typeName } = await inquirer.prompt([customTypeQuestions.typeName]);
  validateCustomTypeName(tracker, typeName) === ValidationRes.OK
    ? tracker.addToStorage({
        key: StorageType.typeCreationName,
        value: typeName,
      })
    : await promptForTypeName(tracker, true);
};
