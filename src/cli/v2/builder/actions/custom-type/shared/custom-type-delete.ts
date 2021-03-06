// Delete props from custom type.

import { RestProjectTracker, GqlProjectTracker } from "eb-lib";
import inquirer from "inquirer";
import { InterfaceStorageType } from "../../../../../../types";
import { printCustomTypeDetails } from "./custom-type-print";

export const handleCustomTypePropsDeletion = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const deleteFromListCLI = async (props: string[]) => {
    const filterArrFromArray = (original: string[], toFilter: string[]) =>
      original.filter((item) => !toFilter.includes(item));

    const deletePropsQuestions = {
      delete: {
        type: "checkbox",
        name: "toDelete",
        choices: props,
        loop: true,
      },
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
    }
    return props.filter((item) => item !== toDelete);
  };

  const typeProperties: string[] = tracker.getFromStorage(
    InterfaceStorageType.typeCreationProps
  );

  const afterDeletion: string[] = await deleteFromListCLI(typeProperties);

  tracker.addToStorage(
    { key: InterfaceStorageType.typeCreationProps, value: afterDeletion },
    true
  );

  printCustomTypeDetails(tracker);

  await tracker.history.goBack(tracker);
};
