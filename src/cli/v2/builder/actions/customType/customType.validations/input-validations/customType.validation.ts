import { ICustomTypeProp, StorageType } from "../../../../../../../types";

import {
  RestProjectTracker,
  GqlProjectTracker,
  getAllAllowedTypes,
  ValidationRes,
} from "../../../../../../../utils";
import { getKeysAndTypes } from "../../customType.utils";

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
  return allowedTypes.includes(typeName) // does type name already exist?
    ? ValidationRes.INVALID
    : ValidationRes.OK;
};

export const validateCustomTypeProp = (
  tracker: RestProjectTracker | GqlProjectTracker,
  typeProp: string
): { valid: ValidationRes; message?: string } => {
  // TODO: add validation for when the type is an array-type,
  // TODO: for example string[], but the user enters something like string[[[]] or [[]string, etc.
  const splatType = typeProp.split(":");
  const typeName = splatType[0]?.trim();
  const typing = splatType[1]?.trim();
  const currentTypeProps: string[] | undefined = tracker.getFromStorage(
    StorageType.typeCreationProps
  );
  if (!typing || checkForSpecialChars(typing, true) === ValidationRes.INVALID) {
    return {
      valid: ValidationRes.INVALID,
      message: "Invalid type, type cannot contain special characters",
    };
  }
  if (!typeName || checkForSpecialChars(typeName) === ValidationRes.INVALID) {
    return {
      valid: ValidationRes.INVALID,
      message: "Invalid type name, type name cannot contain special characters",
    };
  }
  if (
    currentTypeProps &&
    validateDuplicateKeys(currentTypeProps, typeProp) === ValidationRes.INVALID
  ) {
    return {
      valid: ValidationRes.INVALID,
      message:
        "Type property name already exists - no duplicate type props allowed.",
    };
  }
  const validTypes = getAllAllowedTypes(tracker);
  return validTypes.includes(typing)
    ? { valid: ValidationRes.OK }
    : {
        valid: ValidationRes.INVALID,
        message: `${typing} is not a valid type.`,
      };
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
  const keysAndTypes: ICustomTypeProp[] = getKeysAndTypes(typeProps);
  // const allKeys = keysAndTypes.map((keyType) => keyType?.key);
  // check if there are duplicate keys for this type, and if there are, prompt the user to change them.
  // returns { validationRes: ValidationRes, duplicates: string[] }
};

const checkForSpecialChars = (string: string, withSqrBrackets?: boolean) => {
  const specialChars = withSqrBrackets
    ? /[!@#$%^`&*()_+\-=\\{};':"\\|,.<>\/?1234567890]+/
    : /[!@#$%^`&*()_+\-=\[\]{};':"\\|,.<>\/?1234567890]+/;
  return specialChars.test(string) ? ValidationRes.INVALID : ValidationRes.OK;
};

export const validateDuplicateKeys = (props: string[], newProp: string) => {
  const keysAndTypes: ICustomTypeProp[] = getKeysAndTypes(props);
  const newPropKey = newProp.split(":")[0].trim();
  const keys = keysAndTypes.map((customTypeProp) => customTypeProp.key);
  return keys.includes(newPropKey) ? ValidationRes.INVALID : ValidationRes.OK;
};
