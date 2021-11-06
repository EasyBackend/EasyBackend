import { ICustomTypeProp } from "../../../types";
import { ValidationRes } from "../../cli-utils";
import { getKeysAndTypes } from "../custom-type/custom-type.util";

export const checkForSpecialChars = (
  string: string,
  withSqrBrackets?: boolean
) => {
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

// export const validateDuplicateKeys = (keys: string[]) => {
//   const duplicates: string[] = [];
//   keys.forEach((key) => {
//     if (key && keys.includes(key)) {
//       duplicates.push(key);
//     }
//   });
//   return { validationRes: ValidationRes.INVALID, duplicates };
// };
// export const getDuplicateKeys = (arr: ICustomTypeProp[]) => {
//   // TODO: make this function more efficient
//   const allKeys = arr.map((customTypeProp) => customTypeProp.key);
//   const sortedKeys = allKeys.slice().sort();
//   const duplicateKeys: string[] = [];
//   for (let i = 0; i < sortedKeys.length - 1; i++) {
//     if (sortedKeys[i + 1] == sortedKeys[i]) {
//       duplicateKeys.push(sortedKeys[i]);
//     }
//   }
//   return Array.from(new Set(duplicateKeys));
// };
// export const handleDuplicateKeysInCustomType = async (
//   tracker: RestProjectTracker | GqlProjectTracker,
//   duplicates: string[]
// ) => {
//   console.log(
//     chalk.redBright(
//       `The following duplicate property keys were found:\n${duplicates.join(
//         ", "
//       )}`
//     )
//   );
//   const { deleteOrRename } = await inquirer.prompt([
//     customTypeValidationQuestions.duplicates,
//   ]);
//   switch (deleteOrRename) {
//     case "Select duplicates to delete":
//       const afterDeletion = await deleteFromListCLI(
//         tracker.getFromStorage(StorageType.typeCreationProps)
//       );
//       tracker.addToStorage(
//         {
//           as: StorageType.typeCreationProps,
//           value: afterDeletion,
//         },
//         true
//       );
//       await validateCustomTypeBeforeCreation(tracker);
//       break;
//     case "Select duplicates to rename":
//       break;
//     case "none":
//       break;
//     default:
//       break;
//   }
//   // TODO: handleDuplicateKeysInCustomType should prompt the user to change those duplicates,
//   // TODO: then save them in the tracker's storage, and finally, continue the type creation validation process.
// };
