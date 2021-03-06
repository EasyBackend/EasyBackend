import inquirer from "inquirer";
import { RestProjectTracker, GqlProjectTracker } from "eb-lib";
import { handleCustomTypeCreation } from "..";
import { collectTypePropsFromUser } from "./collectProps.prompt";
import { editTypePropsWithUser } from "./editProps.prompt";
import { handleCustomTypePropsDeletion } from "../custom-type-delete";
import { printCustomTypeDetails } from "../custom-type-print";
import { customTypeQuestions } from "../custom-type-questions";
import { InterfaceStorageType } from "../../../../../../../types";

export const confirmWithUserAndNavigate = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  skipConfirm?: boolean
) => {
  process.removeAllListeners();

  if (!skipConfirm) await confirmTypeCreationWithUser(tracker);

  const confirmType = tracker.getFromStorage(
    InterfaceStorageType.confirmTypeCreation
  );

  if (confirmType) {
    await handleCustomTypeCreation(tracker);
  } else {
    const { notOK } = await inquirer.prompt([customTypeQuestions.typeNotOK]);

    tracker.setHistory(confirmWithUserAndNavigate);
    // [Delete properties, Add more properties, Edit properties, default-"none"]
    switch (notOK) {
      // do the requested action then return user to this point in history
      case "Delete properties":
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
    { key: InterfaceStorageType.confirmTypeCreation, value: confirmType },
    true
  );
};
