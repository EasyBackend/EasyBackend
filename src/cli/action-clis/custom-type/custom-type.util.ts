import inquirer from "inquirer";
import { customTypeQuestons, deleteFromListCLI } from "../../cli-utils";
import { GqlProjectTracker, RestProjectTracker } from "../../../utils";
import chalk from "chalk";

// prompt user for type name and save it to tracker storage
export const promptForTypeName = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const { typeName } = await inquirer.prompt([customTypeQuestons.typeName]);
  tracker.addToStorage({ as: "typeName", value: typeName });
  return typeName;
};
// prompt user for type props and save them to tracker storage
export const promptForTypeProps = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeProperties: string[] = [];
  let addMorePropertiesFlag = false;
  while (addMorePropertiesFlag === false) {
    tracker.writeToBottomBar(
      `Accepted types: ${chalk.yellowBright(tracker.acceptedTypes)}\n${
        typeProperties.length ? `Properties: ${typeProperties}}` : ""
      }`,
      true
    );
    const { typeProp } = await inquirer.prompt([customTypeQuestons.typeProp]);
    // TODO: add type validation here
    typeProperties.push(typeProp);
    process.removeAllListeners();
    tracker.writeToBottomBar(`Properties: ${typeProperties}}`, true);
    const { moreProps } = await inquirer.prompt([
      customTypeQuestons.morePropsQuestions,
    ]);
    if (!moreProps) addMorePropertiesFlag = true;
  }
  tracker.addToStorage({ as: "typeCreationProps", value: typeProperties });
  return typeProperties;
};

export const printCustomTypeDetails = (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeName = tracker.getFromStorage("typeName");
  const typeProperties = tracker.getFromStorage("typeCreationProps");
  tracker.writeToBottomBar(
    `${chalk.green.bold("Type name: ")}${typeName}\n\n${chalk.yellow.bold(
      "Properties: "
    )}${typeProperties} \n`,
    true
  );
};

export const confirmTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
): Promise<string> => {
  const { confirmType } = await inquirer.prompt([
    customTypeQuestons.confirmType,
  ]);
  tracker.addToStorage({ as: "confirmTypeCreation", value: confirmType }, true);
  return confirmType;
};

// Delete props from custom type
export const handleCustomTypePropsDeletion = async (
  tracker: RestProjectTracker | GqlProjectTracker,
  navigationFunc: Function
) => {
  const typeProperties: string[] = tracker.getFromStorage("typeCreationProps"); // array of properties of the custom type
  const afterDeletion: string[] = await deleteFromListCLI(typeProperties); // array of props after deletion of selected props..
  tracker.addToStorage({ as: "typeCreationProps", value: afterDeletion }, true); // save props to storage, replace old props in storage
  printCustomTypeDetails(tracker);
  await confirmTypeCreation(tracker); // confirm type creation
  await navigationFunc(tracker);
};
