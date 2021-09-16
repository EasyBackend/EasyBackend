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
  tracker: RestProjectTracker | GqlProjectTracker,
  fromHistory?: boolean
) => {
  let typeProperties: string[] = []; // the type properties as an array of "name: type" strings.
  const trackerStorageProps = tracker.getFromStorage("typeCreationProps"); // get typeProps from storage, if there are any..
  if (trackerStorageProps && trackerStorageProps.length) {
    // if storage does have typeprops: load them to variable typeProperties
    typeProperties = trackerStorageProps;
  }
  let addMorePropertiesFlag = false; // while false, keep asking for props.
  while (addMorePropertiesFlag === false) {
    tracker.writeToBottomBar(
      `${chalk.yellowBright(`=== Allowed Types List ===\n`)}
      ${chalk.yellow(
        "Primitive types: "
      )}${tracker.config.allowedTypes.primitiveTypes.join(", ")}\n
      ${chalk.yellow(
        "Object types: "
      )}${tracker.config.allowedTypes.objectTypes.join(", ")}\n
      ${chalk.yellow(
        "Array types: "
      )}${tracker.config.allowedTypes.arrayTypes.join(", ")}
      ${
        // show user an array of the allowed types.
        typeProperties.length
          ? `\n${chalk.green(`\ \ Properties:`)} ${typeProperties.join(", ")}` // current properties for the type user is creating.
          : ""
      }`,
      true
    );
    const { typeProp } = await inquirer.prompt([customTypeQuestons.typeProp]); // prompt user for next prop.
    // TODO: add option for user to cancel the prompt for the next prop.
    // TODO: add type validation here
    typeProperties.push(typeProp); // add new prop to prop list
    process.removeAllListeners(); // avoid memory leaks
    tracker.writeToBottomBar(
      `${chalk.green(`Properties:`)} ${typeProperties.join(", ")}`, // show user list of props
      true
    );
    const { moreProps } = await inquirer.prompt([
      customTypeQuestons.morePropsQuestions, // ask the user if they want to add more props.
    ]);
    if (!moreProps) addMorePropertiesFlag = true; // if not, switch the flag and exit the while loop.
  }
  tracker.addToStorage({ as: "typeCreationProps", value: typeProperties }); // save current prop list in storage.
  if (fromHistory) {
    // if this prompt was launched "from history", as in, from a point the user needs to return to, then return the user to that point.
    tracker.history.goBack(tracker); // usually it will return user to their last nav
  }
  return typeProperties;
};

export const printCustomTypeDetails = (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeName = tracker.getFromStorage("typeName");
  const typeProperties = tracker.getFromStorage("typeCreationProps");
  console.clear();
  tracker.writeToBottomBar(
    `${chalk.green("Type name: ")}${typeName}\n\n${chalk.yellow(
      "Properties: "
    )}${typeProperties.join(", ")}`,
    true
  );
};

export const confirmTypeCreation = async (
  tracker: RestProjectTracker | GqlProjectTracker
): Promise<string> => {
  printCustomTypeDetails(tracker); // print the details of the custom type for the user
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
