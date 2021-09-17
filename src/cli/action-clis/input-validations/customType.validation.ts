import {
  checkForSpecialChars,
  handleDuplicateKeysInCustomType,
  validateDuplicateKeys,
} from ".";
import { StorageType } from "../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
  getAllAllowedTypes,
} from "../../../utils";
import { ValidationRes } from "../../cli-utils";
import { getKeysAndTypes } from "../custom-type/custom-type.util";

export const validateCustomTypeName = (
  tracker: RestProjectTracker | GqlProjectTracker,
  typeName: string
) => {
  const allowedTypes: string[] = getAllAllowedTypes(tracker);
  if (
    !typeName ||
    typeName.length === 0 ||
    checkForSpecialChars(typeName) === ValidationRes.INVALID
  )
    return ValidationRes.INVALID;
  return allowedTypes.includes(typeName)
    ? ValidationRes.INVALID
    : ValidationRes.OK;
};
export const validateCustomTypeProp = (
  tracker: RestProjectTracker | GqlProjectTracker,
  type: string
) => {
  const splatType = type.split(":");
  const typeName = splatType[0].trim();
  const typing = splatType[1].trim();
  if (
    !typing ||
    !typeName ||
    checkForSpecialChars(typing) === ValidationRes.INVALID ||
    checkForSpecialChars(typeName) === ValidationRes.INVALID
  ) {
    return ValidationRes.INVALID;
  }
  const validTypes = getAllAllowedTypes(tracker);
  return validTypes.includes(typing) ? ValidationRes.OK : ValidationRes.INVALID;
};

export const validateCustomTypeBeforeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  /*
? validateCustomTypeBeforeCreation() consists of two main "phases":
? 1) validateDuplicateKeys() returns duplicates, if there are any.
? 2) handleDuplicateKeysInCustomType() prompts the user to change the duplicates should they exist,
   ? and saves the new values of the props in tracker storage.

? Finally, validateCustomTypeBeforeCreation() returns ValidationRes.OK or ValidationRes.INVALID if for some reason the operation failed.
*/
  const typeProps = tracker.getFromStorage(StorageType.typeCreationProps);
  // { key: string; type: string; }[]
  const keysAndTypes = getKeysAndTypes(typeProps);
  // string[]
  const allKeys = keysAndTypes.map((keyType) => keyType?.key);
  // check if there are duplicate keys for this type, and if there are, prompt the user to change them.
  // returns { validationRes: ValidationRes, duplicates: string[] }
  const duplicates = validateDuplicateKeys(allKeys);
  if (duplicates.validationRes === ValidationRes.INVALID) {
    await handleDuplicateKeysInCustomType(tracker, duplicates.duplicates);
  }
};
