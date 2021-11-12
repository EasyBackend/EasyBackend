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
  collectTypePropsFromUser,
  confirmWithUserAndNavigate,
} from "../customType.utils";

export const createCustomType = async (
  tracker?: RestProjectTracker | GqlProjectTracker
) => {
  if (!tracker) tracker = await getTracker();
  if (!tracker) {
    Logger.error(`No tracker found, aborting..`);
    return;
  }
  await promptForTypeName(tracker);
  await collectTypePropsFromUser(tracker);
  await confirmWithUserAndNavigate(tracker);
};
// If the custom type is valid, create it.
// @navigationFunc to return the user to the correct place in case of error.
export const handleCustomTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  console.log("CREATED CUSTOM TYPE");
  const typeProps = tracker.getFromStorage(StorageType.typeCreationProps);
};
