import inquirer from "inquirer";

import { StorageType } from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";
import {
  customTypeQuestions,
  handleCustomTypePropsDeletion,
  printCustomTypeDetails,
} from "..";
import { handleCustomTypeCreation } from "../../customType.cli";
import { collectTypePropsFromUser } from "./collectProps.prompt";
import { editTypePropsWithUser } from "./editProps.prompt";

export const confirmWithUserAndNavigate = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  skipConfirm?: boolean
) => {
  process.removeAllListeners();
  if (!skipConfirm) await confirmTypeCreationWithUser(tracker);
  const confirmType = tracker.getFromStorage(StorageType.confirmTypeCreation);
  if (confirmType) {
    await handleCustomTypeCreation(tracker);
  } else {
    const { notOK } = await inquirer.prompt([customTypeQuestions.typeNotOK]);
    tracker.setHistory(confirmWithUserAndNavigate);
    // [Delete properties, Add more properties, Edit properties, default-"none"]
    switch (notOK) {
      // do the requested action then return user to this point in history
      case "Delete properties": // TODO: BUG: When deleting properties, the "Is this OK?" question pops up twice.
        await handleCustomTypePropsDeletion(tracker);
        break;
      case "Add more properties":
        await collectTypePropsFromUser(tracker, true);
        break;
      case "Edit properties":
        await editTypePropsWithUser(tracker);
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
