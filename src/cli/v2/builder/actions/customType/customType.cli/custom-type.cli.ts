#!/usr/bin/env node
import {
  promptForTypeName,
  collectTypeProps,
  navigateFromConfirm,
} from "../customType.utils";
import {
  GqlProjectTracker,
  RestProjectTracker,
  getTracker,
} from "../../../../../../utils";
import Logger from "../../../../../../logger/logger";
import { StorageType } from "../../../../../../types";

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
  await navigateFromConfirm(tracker);
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
