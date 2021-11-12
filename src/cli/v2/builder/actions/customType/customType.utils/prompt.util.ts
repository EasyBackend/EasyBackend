import chalk from "chalk";
import inquirer from "inquirer";

import Logger from "../../../../../../logger/logger";
import { promptForTypePropReturn, StorageType } from "../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
  ValidationRes,
} from "../../../../../../utils";
import {
  validateCustomTypeBeforeCreation,
  validateCustomTypeName,
  validateCustomTypeProp,
} from "../customType.validations/input-validations";
import {
  customTypeQuestions,
  handleCustomTypePropsDeletion,
  logAllValidTypes,
  printCustomTypeDetails,
} from ".";
import { handleCustomTypeCreation } from "../customType.cli";

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

// ? this calls promptForTypeProp() and more to collect a string[] of all the type props for the user.
export const collectTypePropsFromUser = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  fromHistory?: boolean
) => {
  const promptForTypeProp = async (
    tracker: RestProjectTracker | GqlProjectTracker,
    invalid?: boolean
  ): Promise<promptForTypePropReturn> => {
    let abort: boolean = false;
    if (invalid)
      Logger.error(
        "Invalid type prop entered, please try again or leave blank to abort."
      );
    const { typeProp } = await inquirer.prompt([customTypeQuestions.typeProp]);
    if (!typeProp || typeProp.length === 0) {
      abort = true;
      return { abort, typeProp };
    }
    const isPropertyValid = validateCustomTypeProp(tracker, typeProp);
    if (isPropertyValid.valid === ValidationRes.INVALID) {
      Logger.error(isPropertyValid.message);
      return promptForTypeProp(tracker, true);
    } else {
      return { abort, typeProp };
    }
  };

  let typeProperties: string[] = [];

  const trackerStorageProps = tracker.getFromStorage(
    StorageType.typeCreationProps
  );

  if (trackerStorageProps && trackerStorageProps.length) {
    typeProperties = trackerStorageProps;
  }

  let addMorePropertiesFlag = false;

  while (addMorePropertiesFlag === false) {
    logAllValidTypes(tracker, typeProperties);

    const { abort, typeProp } = await promptForTypeProp(tracker);

    if (abort) {
      tracker.addToStorage({
        key: StorageType.typeCreationProps,
        value: typeProperties,
      });
      addMorePropertiesFlag = true;
      break;
    }

    typeProperties.push(typeProp);

    tracker.addToStorage({
      key: StorageType.typeCreationProps,
      value: typeProperties,
    });

    process.removeAllListeners();

    tracker.writeToBottomBar(
      `${chalk.green(`Properties:`)} ${typeProperties.join(", ")}`,
      true
    );

    const { moreProps } = await inquirer.prompt([
      customTypeQuestions.morePropsQuestions,
    ]);

    if (!moreProps) addMorePropertiesFlag = true;
  }
  if (fromHistory) {
    // if this prompt was launched "from history", as in, from a point the user needs to return to, then return the user to that point.
    // usually it will return user to their last nav
    tracker.history.goBack(tracker);
  }
};

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
