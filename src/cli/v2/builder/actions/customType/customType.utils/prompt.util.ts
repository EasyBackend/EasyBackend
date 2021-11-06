import inquirer from "inquirer";

import Logger from "../../../../../../logger/logger";
import { StorageType } from "../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
  ValidationRes,
} from "../../../../../../utils";
import {
  validateCustomTypeBeforeCreation,
  validateCustomTypeName,
  validateCustomTypeProp,
  validateDuplicateKeys,
} from "../customType.validations/input-validations";
import {
  customTypeQuestions,
  handleCustomTypePropsDeletion,
  logAllValidTypes,
  printCustomTypeDetails,
} from ".";
import { handleCustomTypeCreation } from "../customType.cli";
import chalk from "chalk";

// prompt user for type name and save it to tracker storage
export const promptForTypeName = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  invalid?: boolean
) => {
  if (invalid) Logger.error("Invalid type name, please try again.");
  const { typeName } = await inquirer.prompt([customTypeQuestions.typeName]);
  const validationRes = validateCustomTypeName(tracker, typeName);
  validationRes === ValidationRes.OK
    ? tracker.addToStorage({
        as: StorageType.typeCreationName,
        value: typeName,
      })
    : await promptForTypeName(tracker, true);
};
// prompt user for type props and save them to tracker storage
const promptForTypeProp = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  invalid?: boolean
): Promise<{ abort: boolean; typeProp: string }> => {
  let abort: boolean = false;
  // if the user entered an invalid type, prompt him again, but this time with an error message.
  if (invalid)
    Logger.error(
      "Invalid type prop entered, please try again or leave blank to abort."
    );
  // prompt user for next prop.
  const { typeProp } = await inquirer.prompt([customTypeQuestions.typeProp]);
  // if the user entered an empty string, return him to last point in history.
  if (!typeProp || typeProp.length === 0) {
    abort = true;
    return { abort, typeProp };
  }
  // validate the user's next prop.
  const validationRes = validateCustomTypeProp(tracker, typeProp);
  return validationRes === ValidationRes.INVALID
    ? promptForTypeProp(tracker, true)
    : { abort, typeProp };
};
export const navigateFromConfirm = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  process.removeAllListeners(); // avoid memory leaks
  await confirmTypeCreation(tracker); // confirm if it's OK or not
  const confirmType = tracker.getFromStorage(StorageType.confirmTypeCreation); // check confirm
  if (confirmType) {
    // ? if "OK", validate custom type
    await validateCustomTypeBeforeCreation(tracker);
    // ? if validated, create the custom type.
    await handleCustomTypeCreation(tracker, navigateFromConfirm);
  } else {
    // if user answered 'NO":
    const { notOK } = await inquirer.prompt([customTypeQuestions.typeNotOK]); // asks user what they want to do. options are:
    // [Delete properties, Add more properties, Edit properties, default-"none"]
    switch (notOK) {
      case "Delete properties": // TODO: BUG: When deleting properties, the "Is this OK?" question pops up twice.
        tracker.setHistory(navigateFromConfirm);
        // do the requested action then return user to this point in history - navigateFromConfirm()
        await handleCustomTypePropsDeletion(tracker, navigateFromConfirm); // user can delete props
        break;
      case "Add more properties":
        tracker.setHistory(navigateFromConfirm);
        // do the requested action then return user to this point in history - navigateFromConfirm()
        await collectTypeProps(tracker, true); // ask the user for type properties
        break;
      case "Edit properties":
        tracker.setHistory(navigateFromConfirm);
        // do the requested action then return user to this point in history - navigateFromConfirm()
        break;
      case "none":
        break;
      default:
        break;
    }
  }
};
export const confirmTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  printCustomTypeDetails(tracker); // print the details of the custom type for the user
  const { confirmType } = await inquirer.prompt([
    customTypeQuestions.confirmType,
  ]);
  tracker.addToStorage(
    { as: StorageType.confirmTypeCreation, value: confirmType },
    true
  );
};
// ? this calls promptForTypeProp() and more to collect a string[] of all the type props for the user.
export const collectTypeProps = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  fromHistory?: boolean
) => {
  // the type properties as an array of "name: type" strings.
  let typeProperties: string[] = [];
  // get typeProps from storage, if there are any..
  const trackerStorageProps = tracker.getFromStorage(
    StorageType.typeCreationProps
  );
  // if storage does have typeprops: load them to variable typeProperties
  if (trackerStorageProps && trackerStorageProps.length) {
    typeProperties = trackerStorageProps;
  }
  // while false, keep asking for props.
  let addMorePropertiesFlag = false;
  while (addMorePropertiesFlag === false) {
    logAllValidTypes(tracker, typeProperties);
    const { abort, typeProp } = await promptForTypeProp(tracker);
    if (abort) {
      tracker.addToStorage({
        as: StorageType.typeCreationProps,
        value: typeProperties,
      });
      addMorePropertiesFlag = true;
      break;
    }
    // add new prop to prop list - unless prop already exists in list, in which case print an error message and skip
    if (
      validateDuplicateKeys(typeProperties, typeProp) === ValidationRes.INVALID
    )
      Logger.error(
        "Type property name already exists - no duplicate type props allowed, skipping.."
      );
    // avoid memory leaks
    process.removeAllListeners();
    tracker.writeToBottomBar(
      // show user list of props
      `${chalk.green(`Properties:`)} ${typeProperties.join(", ")}`,
      true
    );
    const { moreProps } = await inquirer.prompt([
      // ask the user if they want to add more props.
      customTypeQuestions.morePropsQuestions,
    ]);
    // if not, switch the flag and exit the while loop.
    if (!moreProps) addMorePropertiesFlag = true;
  }
  // save current prop list in storage.
  tracker.addToStorage({
    as: StorageType.typeCreationProps,
    value: typeProperties,
  });
  if (fromHistory) {
    // if this prompt was launched "from history", as in, from a point the user needs to return to, then return the user to that point.
    // usually it will return user to their last nav
    tracker.history.goBack(tracker);
  }
};
