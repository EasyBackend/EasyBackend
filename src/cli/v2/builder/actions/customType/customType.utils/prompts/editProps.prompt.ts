import chalk from "chalk";
import inquirer from "inquirer";

import { StorageType } from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";

const editPropsQuestions = {
  edit: (props: string[]) => {
    return { type: "checkbox", name: "toEdit", choices: props, loop: true };
  },
  confirm: {
    type: "confirm",
    name: "confirmEdit",
  },
  editAProp: { type: "input", name: "edited" },
};

export const editTypePropsWithUser = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const editProp = async (prop: string): Promise<void | string> => {
    tracker.writeToBottomBar(`${chalk.green("Now editing property:")} ${prop}`);

    let { edited } = await inquirer.prompt([editPropsQuestions.editAProp]);

    if (!edited) edited = prop;

    tracker.writeToBottomBar(
      `${chalk.green(prop)} ==> ${chalk.yellow(edited)}`
    );

    const { confirmEdit } = await inquirer.prompt([editPropsQuestions.confirm]);

    if (confirmEdit) {
      return edited;
    } else {
      return editProp(prop);
    }
  };

  const typeProperties: string[] = tracker.getFromStorage(
    StorageType.typeCreationProps
  );

  let { toEdit } = await inquirer.prompt([
    editPropsQuestions.edit(typeProperties),
  ]);

  if (!Array.isArray(toEdit)) {
    toEdit = [toEdit];
  }

  for (let i = 0; i < toEdit.length; i++) {
    const prop = toEdit[i];

    const edited = (await editProp(prop)) as string;

    typeProperties[typeProperties.findIndex((p) => p === prop)] = edited;
  }

  tracker.addToStorage(
    { key: StorageType.typeCreationProps, value: typeProperties },
    true
  );

  tracker.history.goBack(tracker);
};
