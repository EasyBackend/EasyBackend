import { RestProjectTracker, GqlProjectTracker } from "../../../utils";
import { ValidationRes } from "../../cli-utils";

export const checkForSpecialChars = (string: string) => {
  const specialChars = /[!@#$%^`&*()_+\-=\[\]{};':"\\|,.<>\/?1234567890]+/;
  return specialChars.test(string) ? ValidationRes.INVALID : ValidationRes.OK;
};

export const validateDuplicateKeys = (keys: string[]) => {
  const duplicates: string[] = [];
  keys.forEach((key) => {
    if (key && keys.includes(key)) {
      duplicates.push(key);
    }
  });
  return { validationRes: ValidationRes.INVALID, duplicates };
};

export const handleDuplicateKeysInCustomType = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  duplicates: string[]
) => {
  // TODO: handleDuplicateKeysInCustomType should prompt the user to change those duplicates,
  // TODO: then save them in the tracker's storage, and finally, continue the type creation validation process.
};
