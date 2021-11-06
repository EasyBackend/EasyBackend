// Delete props from custom type.

import inquirer from "inquirer";
import { printCustomTypeDetails } from ".";
import { StorageType } from "../../../../../../types";
import { RestProjectTracker, GqlProjectTracker } from "../../../../../../utils";
import { confirmTypeCreation } from "./custom-type.util";

// @navigationFunc is for returning the user to the appropriate point in the flow
export const handleCustomTypePropsDeletion = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  navigationFunc: Function
) => {
  // array of properties of the custom type
  const typeProperties: string[] = tracker.getFromStorage(
    StorageType.typeCreationProps
  );
  // array of props after deletion of selected props..
  const afterDeletion: string[] = await deleteFromListCLI(typeProperties);
  // save props to storage, replace old props in storage
  tracker.addToStorage(
    { as: StorageType.typeCreationProps, value: afterDeletion },
    true
  );
  printCustomTypeDetails(tracker);
  // confirm type creation
  await confirmTypeCreation(tracker);
  await navigationFunc(tracker);
};

export const deleteFromListCLI = async (props: string[]) => {
  const filterArrFromArray = (original: string[], toFilter: string[]) => {
    return original.filter((item) => !toFilter.includes(item));
  };
  const deletePropsQuestions = {
    delete: { type: "checkbox", name: "toDelete", choices: props, loop: true },
    confirm: {
      type: "confirm",
      name: "confirmDelete",
    },
  };
  const { toDelete } = await inquirer.prompt([deletePropsQuestions.delete]);
  const { confirmDelete } = await inquirer.prompt([
    deletePropsQuestions.confirm,
  ]);
  if (!confirmDelete) {
    return props;
  }
  if (Array.isArray(toDelete)) {
    return filterArrFromArray(props, toDelete);
  } else return props.filter((item) => item !== toDelete);
};
