/* eslint-disable no-await-in-loop */
import * as chalk from "chalk";
import {
  RestProjectTracker,
  GqlProjectTracker,
  ValidationRes,
  validateCustomTypeProp,
} from "eb-lib";
import * as inquirer from "inquirer";
import Logger from "../../../../../../../logger/logger";
import { InterfaceStorageType } from "../../../../../../../types";

const editPropsQuestions = {
  edit: (props: string[]) => ({
    type: "checkbox",
    name: "toEdit",
    choices: props,
    loop: true,
  }),
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

    const { isValid, message } = validateCustomTypeProp(tracker, edited);

    if (isValid !== ValidationRes.VALID) {
      Logger.error(message);

      return editProp(prop);
    }

    const { confirmEdit } = await inquirer.prompt([editPropsQuestions.confirm]);

    if (confirmEdit) {
      return edited;
    }
    return editProp(prop);
  };

  const typeProperties: string[] = tracker.getFromStorage(
    InterfaceStorageType.typeCreationProps
  );

  let { toEdit } = await inquirer.prompt([
    editPropsQuestions.edit(typeProperties),
  ]);

  if (!Array.isArray(toEdit)) {
    toEdit = [toEdit];
  }

  // eslint-disable-next-line no-await-in-loop
  for (let i = 0; i < toEdit.length; i += 1) {
    const prop = toEdit[i];

    const edited = (await editProp(prop)) as string;

    typeProperties[typeProperties.findIndex((p) => p === prop)] = edited;
  }

  tracker.addToStorage(
    { key: InterfaceStorageType.typeCreationProps, value: typeProperties },
    true
  );

  tracker.history.goBack(tracker);
};
