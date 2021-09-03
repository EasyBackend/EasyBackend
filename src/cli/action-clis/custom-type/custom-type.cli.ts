#!/usr/bin/env node
import inquirer from "inquirer";

import {
  promptForTypeName,
  promptForTypeProps,
  confirmTypeCreation,
  handleCustomTypePropsDeletion,
  printCustomTypeDetails,
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
  printCustomTypeDetails(tracker); // print the details of the custom type for the user
  await confirmTypeCreation(tracker);
  process.removeAllListeners();
  await navigateFromConfirm(tracker);
};

const navigateFromConfirm = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const confirmType = tracker.getFromStorage("confirmTypeCreation");
  if (confirmType) {
  } else {
    const { notOK } = await inquirer.prompt([customTypeQuestons.typeNotOK]);
    switch (notOK) {
      case "Delete properties":
        process.removeAllListeners();
        await handleCustomTypePropsDeletion(tracker, navigateFromConfirm);
        break;
      case "Add more properties":
        process.removeAllListeners();
        break;
      case "Edit properties":
        process.removeAllListeners();
        break;
      case "none":
        break;
      default:
        break;
    }
  }
};
