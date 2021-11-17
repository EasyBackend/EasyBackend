import { format } from "logform";
import Logger from "../../../../../../../logger/logger";

import {
  ICustomTypeCreationParams,
  ICustomTypeProp,
  StorageType,
} from "../../../../../../../types";

import {
  RestProjectTracker,
  GqlProjectTracker,
  getAllAllowedTypesFromTracker,
  ValidationRes,
  getTracker,
} from "../../../../../../../utils";
import { getKeysAndTypes } from "../../customType.utils";

export const validateCustomTypeName = async (
  typeName: string,
  tracker?: RestProjectTracker | GqlProjectTracker
): Promise<{ isValid: ValidationRes; message?: string }> => {
  if (!tracker) tracker = await getTracker();

  if (!tracker) {
    Logger.error(`No tracker found, aborting..`);
    return { isValid: ValidationRes.ERROR };
  }

  const allowedTypes: string[] = getAllAllowedTypesFromTracker(tracker);

  const specialCharsValid = checkForSpecialChars(typeName);

  if (
    !typeName ||
    typeName.length === 0 ||
    specialCharsValid.isValid !== ValidationRes.VALID
  )
    return {
      isValid: ValidationRes.INVALID,
      message: specialCharsValid.message as string,
    };

  return allowedTypes.includes(typeName) // does type name already exist?
    ? {
        isValid: ValidationRes.INVALID,
        message: `Error: type name already exists for name: ${typeName}`,
      }
    : { isValid: ValidationRes.VALID };
};
export const validateCustomTypeProp = (
  tracker: RestProjectTracker | GqlProjectTracker,
  typeProp: string
): { isValid: ValidationRes; message?: string | string[] } => {
  // TODO: add validation for when the type is an array-type,
  // TODO: for example string[], but the user enters something like string[[[]] or [[]string, etc.

  const splatType = typeProp.split(":");
  const typeName = splatType[0]?.trim();
  const typing = splatType[1]?.trim();

  const currentTypeProps: string[] | undefined = tracker.getFromStorage(
    StorageType.typeCreationProps
  );

  const duplicateKeysValid = currentTypeProps
    ? validateDuplicateKeys(currentTypeProps, typeProp)
    : { isValid: ValidationRes.VALID };
  const specialCharsValidForTyping = checkForSpecialChars(typing, true);
  const specialCharsValidForTypeName = checkForSpecialChars(typeName);

  if (!typing || specialCharsValidForTyping.isValid !== ValidationRes.VALID) {
    return {
      isValid: ValidationRes.INVALID,
      message: specialCharsValidForTyping.message,
    };
  }

  if (
    !typeName ||
    specialCharsValidForTypeName.isValid !== ValidationRes.VALID
  ) {
    return {
      isValid: ValidationRes.INVALID,
      message: specialCharsValidForTypeName.message,
    };
  }

  if (duplicateKeysValid.isValid === ValidationRes.INVALID) {
    return {
      isValid: ValidationRes.INVALID,
      message: duplicateKeysValid.message,
    };
  }

  const validTypes = getAllAllowedTypesFromTracker(tracker);

  return validTypes.includes(typing)
    ? { isValid: ValidationRes.VALID }
    : {
        isValid: ValidationRes.INVALID,
        message: `${typing} is not a valid type.`,
      };
};

const checkForSpecialChars = (
  input: string | string[],
  withSqrBrackets?: boolean
): { isValid: ValidationRes; message?: string | string[] } => {
  const errors: string[] = [];

  if (!Array.isArray(input)) {
    input = [input];
  }

  for (let i = 0; i < input.length; i++) {
    const string = input[i];

    const specialChars = withSqrBrackets
      ? /[!@#$%^`&*()_+\-=\\{};':"\\|,.<>\/?1234567890]+/
      : /[!@#$%^`&*()_+\-=\[\]{};':"\\|,.<>\/?1234567890]+/;

    if (specialChars.test(string)) {
      errors.push(`special characters are not allowed: ${string}`);
    }
  }

  return errors.length
    ? { isValid: ValidationRes.INVALID, message: errors }
    : { isValid: ValidationRes.VALID };
};

export const validateDuplicateKeys = (
  props: string[],
  newProp?: string
): { isValid: ValidationRes; message?: string } => {
  const keysAndTypes: ICustomTypeProp[] = getKeysAndTypes(props);
  const keys = keysAndTypes.map((customTypeProp) => customTypeProp.key);
  const newPropKey = newProp?.split(":")[0].trim();

  if (newPropKey)
    return keys.includes(newPropKey)
      ? {
          isValid: ValidationRes.INVALID,
          message:
            "Type property name already exists - no duplicate type props allowed.",
        }
      : { isValid: ValidationRes.VALID };
  return Array.from(new Set(keys)).length < keys.length
    ? {
        isValid: ValidationRes.INVALID,
        message:
          "Type property name already exists - no duplicate type props allowed.",
      }
    : { isValid: ValidationRes.VALID };
};

/**
 * @param {Object { typeProps: string[], typeName: string } ICustomTypeCreationParams
 * @returns {Object { isValid: ValidationRes, message: string | string[ ] }
 1) validateDuplicateKeys() checks if there are any duplicates
 2) validateCustomTypeName() validates type name (both special chars, and duplicates/custom types)
 3) checkForSpecialChars() validates there aren't any special chars in typeProps.
 */
export const validateCustomTypeBeforeCreation = async (
  customTypeCreationParams: ICustomTypeCreationParams
): Promise<{ isValid: ValidationRes; message?: string | string[] }> => {
  const { typeProps, typeName } = customTypeCreationParams;

  const keysAndTypes: ICustomTypeProp[] = getKeysAndTypes(typeProps);
  const keys = keysAndTypes.map((customTypeProp) => customTypeProp.key);
  const types = keysAndTypes.map((customTypeProp) => customTypeProp.type);

  const duplicateKeysValid = validateDuplicateKeys(typeProps);
  const typeNameValid = await validateCustomTypeName(typeName);
  const typePropsSpecialCharsKeysValid = checkForSpecialChars(keys);
  const typePropsSpecialCharsTypesValid = checkForSpecialChars(types, true);

  if (duplicateKeysValid.isValid !== ValidationRes.VALID) {
    return {
      isValid: ValidationRes.INVALID,
      message: duplicateKeysValid.message,
    };
  }

  if (typeNameValid.isValid !== ValidationRes.VALID) {
    return {
      isValid: ValidationRes.INVALID,
      message: duplicateKeysValid.message,
    };
  }

  if (typePropsSpecialCharsKeysValid.isValid !== ValidationRes.VALID) {
    return {
      isValid: ValidationRes.INVALID,
      message: typePropsSpecialCharsKeysValid.message,
    };
  }

  if (typePropsSpecialCharsTypesValid.isValid !== ValidationRes.VALID) {
    return {
      isValid: ValidationRes.INVALID,
      message: typePropsSpecialCharsTypesValid.message,
    };
  }

  return { isValid: ValidationRes.VALID };
};
