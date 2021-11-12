#!/usr/bin/env node
import Logger from "../../../../../../logger/logger";
import { StorageType } from "../../../../../../types";

import {
  GqlProjectTracker,
  RestProjectTracker,
  getTracker,
} from "../../../../../../utils";

import {
  promptForTypeName,
  collectTypeProps,
  navigateFromConfirm,
  confirmTypeCreationWithUser,
} from "../customType.utils";

export const createCustomType = async (
  tracker?: RestProjectTracker | GqlProjectTracker
) => {
  if (!tracker) tracker = await getTracker();
  if (!tracker) {
    Logger.error(`No tracker found, aborting..`);
    return;
  }
  await promptForTypeName(tracker); // ask the user for a type name
  await collectTypeProps(tracker); // ask the user for type properties
  process.removeAllListeners();
  await confirmTypeCreationWithUser(tracker);
  await navigateFromConfirm(tracker);
};
// If the custom type is valid, create it.
// @navigationFunc to return the user to the correct place in case of error.
export const handleCustomTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  console.log("CREATED CUSTOM TYPE");
  const typeProps = tracker.getFromStorage(StorageType.typeCreationProps);
};
