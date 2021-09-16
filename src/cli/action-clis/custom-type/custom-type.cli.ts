#!/usr/bin/env node
import inquirer from "inquirer";

import {
  promptForTypeName,
  promptForTypeProps,
  confirmTypeCreation,
  handleCustomTypePropsDeletion,
} from "./custom-type.util";
import { GqlProjectTracker, RestProjectTracker } from "../../../utils";
import { customTypeQuestons, getTracker } from "../../cli-utils";
import Logger from "../../../logger/logger";

export const customType = async (
  tracker?: RestProjectTracker | GqlProjectTracker
) => {
  if (!tracker) tracker = await getTracker();
  if (!tracker) {
    Logger.error(`No tracker found, aborting..`);
    return;
  }
  await promptForTypeName(tracker); // ask the user for a type name
  await promptForTypeProps(tracker); // ask the user for type properties
  await navigateFromConfirm(tracker);
};

const navigateFromConfirm = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  process.removeAllListeners(); // avoid memory leaks
  await confirmTypeCreation(tracker); // confirm if it's OK or not
  const confirmType = tracker.getFromStorage("confirmTypeCreation"); // check confirm
  if (confirmType) {
  } else {
    // if user answered 'NO":
    const { notOK } = await inquirer.prompt([customTypeQuestons.typeNotOK]); // asks user what they want to do. options are:
    // [Delete properties, Add more properties, Edit properties, default-"none"]
    switch (notOK) {
      case "Delete properties":
        tracker.setHistory(navigateFromConfirm);
        // do the requested action then return user to this point in history - navigateFromConfirm()
        await handleCustomTypePropsDeletion(tracker, navigateFromConfirm); // user can delete props
        break;
      case "Add more properties":
        tracker.setHistory(navigateFromConfirm);
        // do the requested action then return user to this point in history - navigateFromConfirm()
        await promptForTypeProps(tracker, true); // ask the user for type properties
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
