#!/usr/bin/env node
import Logger from "../../../../../../logger/logger";
import { StorageType } from "../../../../../../types";

import { createCustomType } from "../../../../../../api/v1/controllers";

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

/*
? Eventually we want to be able to create a custom type (or anything else for that matter) with one singular function.
? This is what we have the API's controllers for. Any other function, like the functions working at createCustomTypeFromCLI(),
? is only here for collecting the necessary params from the user - we don't want to have multiple functions doing the same thing'
*/

// This whole function's flow should be UI-related only -
// this should definitely have nothing to do with creating the custom type itself.
export const createCustomTypeFromCLI = async (
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

// This is the function that extracts the params from Tracker and sends it to createCustomType()
export const handleCustomTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeProps = tracker.getFromStorage(StorageType.typeCreationProps);
  const typeName = tracker.getFromStorage(StorageType.typeCreationName);

  const customTypeParams = { typeProps, typeName };

  await createCustomType(customTypeParams);
};
