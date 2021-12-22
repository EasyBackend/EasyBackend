#!/usr/bin/env node
import {
  getTracker,
  GqlProjectTracker,
  restAPICreators,
  RestProjectTracker,
} from "eb-lib";
import Logger from "../../../../../../logger/logger";
import {
  InterfaceStorageType,
  ICustomTypeCreationParams,
  DatabaseStorageType,
  ISchemaCreationParams,
} from "../../../../../../types";
import { chooseRequiredProps } from "../../database-schema/shared/prompts";
import {
  promptForTypeName,
  collectTypePropsFromUser,
  shouldIncludeDBSchema,
  confirmWithUserAndNavigate,
} from "./prompts";

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
  await shouldIncludeDBSchema(tracker);

  const includeDBSchema = tracker.getFromStorage(
    InterfaceStorageType.includeDBSchema
  );

  if (includeDBSchema) {
    await chooseRequiredProps(tracker);
  }

  await confirmWithUserAndNavigate(tracker);
};

// This is the function that extracts the params from Tracker and sends it to createCustomType()
export const handleCustomTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeProps = tracker.getFromStorage(
    InterfaceStorageType.typeCreationProps
  );

  const typeName = tracker.getFromStorage(InterfaceStorageType.typeName);

  const customTypeParams: ICustomTypeCreationParams = {
    typeProps,
    typeName,
  };

  await restAPICreators.validateAndCreateCustomType(customTypeParams);

  const includeDBSchema = tracker.getFromStorage(
    InterfaceStorageType.includeDBSchema
  );

  if (includeDBSchema) {
    const schemaProps = tracker.getFromStorage(DatabaseStorageType.schemaProps);

    const schemaName = tracker.getFromStorage(DatabaseStorageType.schemaName);

    const uniqueProperty = tracker.getFromStorage(
      DatabaseStorageType.uniqueProperty
    );

    const requiredProps = tracker.getFromStorage(
      DatabaseStorageType.requiredProps
    );

    const dbSchemaParams: ISchemaCreationParams = {
      schemaProps,
      schemaName,
      uniqueProperty,
      requiredProps,
    };
    console.log("HERE");
    await restAPICreators.validateAndCreateDatabaseSchema(dbSchemaParams);
  }
};
