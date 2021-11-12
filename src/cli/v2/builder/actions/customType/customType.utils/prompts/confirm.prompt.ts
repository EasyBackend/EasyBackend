import inquirer from "inquirer";

import { StorageType } from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";
import { validateCustomTypeBeforeCreation } from "../../customType.validations/input-validations";
import {
  customTypeQuestions,
  handleCustomTypePropsDeletion,
  printCustomTypeDetails,
} from "..";
import { handleCustomTypeCreation } from "../../customType.cli";
import { collectTypePropsFromUser } from "./collectProps.prompt";

export const confirmWithUserAndNavigate = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  skipConfirm?: boolean
) => {
  process.removeAllListeners();
  if (!skipConfirm) await confirmTypeCreationWithUser(tracker);
  const confirmType = tracker.getFromStorage(StorageType.confirmTypeCreation);
  if (confirmType) {
    await validateCustomTypeBeforeCreation(tracker);
    await handleCustomTypeCreation(tracker);
  } else {
    const { notOK } = await inquirer.prompt([customTypeQuestions.typeNotOK]);
    // [Delete properties, Add more properties, Edit properties, default-"none"]
    switch (notOK) {
      // do the requested action then return user to this point in history
      case "Delete properties": // TODO: BUG: When deleting properties, the "Is this OK?" question pops up twice.
        tracker.setHistory(confirmWithUserAndNavigate);
        await handleCustomTypePropsDeletion(tracker);
        break;
      case "Add more properties":
        tracker.setHistory(confirmWithUserAndNavigate);
        await collectTypePropsFromUser(tracker, true);
        break;
      case "Edit properties":
        tracker.setHistory(confirmWithUserAndNavigate);
        break;
      case "none":
        break;
      default:
        break;
    }
  }
};

export const confirmTypeCreationWithUser = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  printCustomTypeDetails(tracker);
  const { confirmType } = await inquirer.prompt([
    customTypeQuestions.confirmType,
  ]);
  tracker.addToStorage(
    { key: StorageType.confirmTypeCreation, value: confirmType },
    true
  );
};
