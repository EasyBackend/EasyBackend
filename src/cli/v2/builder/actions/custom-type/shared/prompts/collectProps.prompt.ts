import * as chalk from "chalk";
import {
  RestProjectTracker,
  GqlProjectTracker,
  ValidationRes,
  validateCustomTypeProp,
} from "eb-lib";
import * as inquirer from "inquirer";
import Logger from "../../../../../../../logger/logger";
import {
  promptForTypePropReturn,
  InterfaceStorageType,
} from "../../../../../../../types";
import { logAllValidTypes } from "../custom-type-print";
import { customTypeQuestions } from "../custom-type-questions";

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

    // eslint-disable-next-line no-await-in-loop
    const { typeProp } = await inquirer.prompt([customTypeQuestions.typeProp]);

    if (!typeProp || typeProp.length === 0) {
      abort = true;

      return { abort, typeProp };
    }

    const { isValid, message } = validateCustomTypeProp(tracker, typeProp);

    if (isValid === ValidationRes.INVALID) {
      Logger.error(message);

      return promptForTypeProp(tracker, true);
    }
    return { abort, typeProp };
  };

  let typeProperties: string[] = [];

  const trackerStorageProps = tracker.getFromStorage(
    InterfaceStorageType.typeCreationProps
  );

  if (trackerStorageProps && trackerStorageProps.length) {
    typeProperties = trackerStorageProps;
  }

  let addMorePropertiesFlag = false;

  while (addMorePropertiesFlag === false) {
    logAllValidTypes(tracker, typeProperties);

    // eslint-disable-next-line no-await-in-loop
    const { abort, typeProp } = await promptForTypeProp(tracker);

    if (abort) {
      tracker.addToStorage({
        key: InterfaceStorageType.typeCreationProps,
        value: typeProperties,
      });
      addMorePropertiesFlag = true;
      break;
    }

    typeProperties.push(typeProp);

    tracker.addToStorage({
      key: InterfaceStorageType.typeCreationProps,
      value: typeProperties,
    });

    process.removeAllListeners();

    tracker.writeToBottomBar(
      `${chalk.green(`Properties:`)} ${typeProperties.join(", ")}`,
      true
    );

    // eslint-disable-next-line no-await-in-loop
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
