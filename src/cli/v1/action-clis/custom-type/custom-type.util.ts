import inquirer from "inquirer";
import {
  customTypeQuestons,
  deleteFromListCLI,
  logAllValidTypes,
  ValidationRes,
} from "../../cli-utils";
import { GqlProjectTracker, RestProjectTracker } from "../../../../utils";
import chalk from "chalk";
import {
  validateCustomTypeName,
  validateCustomTypeProp,
  validateDuplicateKeys,
} from "../input-validations";
import Logger from "../../../../logger/logger";
import { ICustomTypeProp, StorageType } from "../../../../types";

// prompt user for type name and save it to tracker storage
export const promptForTypeName = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  invalid?: boolean
) => {
  if (invalid) Logger.error("Invalid type name, please try again.");
  const { typeName } = await inquirer.prompt([customTypeQuestons.typeName]);
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
  const { typeProp } = await inquirer.prompt([customTypeQuestons.typeProp]);
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
      customTypeQuestons.morePropsQuestions,
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

export const printCustomTypeDetails = (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeName = tracker.getFromStorage(StorageType.typeCreationName);
  const typeProperties = tracker.getFromStorage(StorageType.typeCreationProps);
  console.clear();
  tracker.writeToBottomBar(
    `${chalk.green("Type name: ")}${typeName}\n\n${chalk.yellow(
      "Properties: "
    )}${typeProperties.join(", ")}`,
    true
  );
};

export const confirmTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  printCustomTypeDetails(tracker); // print the details of the custom type for the user
  const { confirmType } = await inquirer.prompt([
    customTypeQuestons.confirmType,
  ]);
  tracker.addToStorage(
    { as: StorageType.confirmTypeCreation, value: confirmType },
    true
  );
};

// Delete props from custom type.
// @navigationFunc is for returning the user to the appropriate point in the flow
export const handleCustomTypePropsDeletion = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  navigationFunc: Function
) => {
  // array of properties of the custom type
  const typeProperties: string[] = tracker.getFromStorage(
    StorageType.typeCreationProps
  );
  // array of props after deletion of selected props..
  const afterDeletion: string[] = await deleteFromListCLI(typeProperties);
  // save props to storage, replace old props in storage
  tracker.addToStorage(
    { as: StorageType.typeCreationProps, value: afterDeletion },
    true
  );
  printCustomTypeDetails(tracker);
  // confirm type creation
  await confirmTypeCreation(tracker);
  await navigationFunc(tracker);
};

// take a string[] of strings that look like 'name:type' and return : ( { "key": string, "type": string }[] )
export const getKeysAndTypes = (typeProps: string[]): ICustomTypeProp[] => {
  const keysAndTypes = typeProps.map((prop: string) => {
    let splat = prop.split(":");
    const key = splat[0].trim();
    const type = splat[1].trim();
    return { key, type };
  });
  return keysAndTypes;
};

// If the custom type is valid, create it.
// @navigationFunc to return the user to the correct place in case of error.
export const handleCustomTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  navigationFunc: Function
) => {
  console.log("CREATED CUSTOM TYPE");
  const typeProps = tracker.getFromStorage(StorageType.typeCreationProps);
};
