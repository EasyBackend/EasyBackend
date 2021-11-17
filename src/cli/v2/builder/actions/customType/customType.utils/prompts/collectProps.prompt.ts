import chalk from "chalk";
import inquirer from "inquirer";

import Logger from "../../../../../../../logger/logger";
import {
  promptForTypePropReturn,
  StorageType,
} from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
  ValidationRes,
} from "../../../../../../../utils";

import { validateCustomTypeProp } from "../../customType.validations/input-validations";
import { customTypeQuestions, logAllValidTypes } from "..";

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

    const { isValid, message } = validateCustomTypeProp(tracker, typeProp);

    if (isValid === ValidationRes.INVALID) {
      Logger.error(message);

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
