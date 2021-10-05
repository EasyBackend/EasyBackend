import chalk from "chalk";
import inquirer from "inquirer";
import { ICustomTypeProp } from "../../../types";
import { RestProjectTracker, GqlProjectTracker } from "../../../utils";
import { customTypeValidationQuestions, ValidationRes } from "../../cli-utils";

export const checkForSpecialChars = (
  string: string,
  withSqrBrackets?: boolean
) => {
  const specialChars = withSqrBrackets
    ? /[!@#$%^`&*()_+\-=\\{};':"\\|,.<>\/?1234567890]+/
    : /[!@#$%^`&*()_+\-=\[\]{};':"\\|,.<>\/?1234567890]+/;
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

const findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort();
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
};

export const getDuplicateObjects = (arr: ICustomTypeProp[]) => {};

export const handleDuplicateKeysInCustomType = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  duplicates: string[]
) => {
  console.log(
    chalk.redBright(
      `The following duplicate property keys were found:\n${duplicates}`
    )
  );
  const { deleteOrRename } = await inquirer.prompt([
    customTypeValidationQuestions.duplicates,
  ]);
  switch (deleteOrRename) {
    case "Select duplicates to delete":
      break;
    case "Select duplicates to rename":
      break;
    case "none":
      break;
    default:
      break;
  }
  // TODO: handleDuplicateKeysInCustomType should prompt the user to change those duplicates,
  // TODO: then save them in the tracker's storage, and finally, continue the type creation validation process.
};
