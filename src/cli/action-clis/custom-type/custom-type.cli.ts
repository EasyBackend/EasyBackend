#!/usr/bin/env node
import inquirer from "inquirer";
import { getTracker, longAssLine } from "../../cli-utils";
import { customTypeQuestons } from "../../cli-utils";
import { GqlProjectTracker, RestProjectTracker } from "../../../utils";
import chalk from "chalk";
import Logger from "../../../logger/logger";

export const customType = async (
  tracker?: RestProjectTracker | GqlProjectTracker
) => {
  if (!tracker) tracker = await getTracker();
  if (!tracker) {
    Logger.error(`No tracker found, aborting..`);
    return;
  }
  const typeProperties: string[] = [];
  let addMorePropertiesFlag = false;
  const { typeName } = await inquirer.prompt([customTypeQuestons.typeName]);
  while (addMorePropertiesFlag === false) {
    tracker.writeToBottomBar(
      `${new inquirer.Separator(
        longAssLine
      )}\nAccepted types: ${chalk.yellowBright(tracker.acceptedTypes)}\n${
        typeProperties.length ? `Properties: ${typeProperties}}` : ""
      }`
    );
    const { typeProp } = await inquirer.prompt([customTypeQuestons.typeProp]);
    // TODO: add type validation here
    typeProperties.push(typeProp);
    5;
    tracker.writeToBottomBar(
      `${new inquirer.Separator(longAssLine)}\nProperties: ${typeProperties}}`
    );
    const { moreProps } = await inquirer.prompt([
      customTypeQuestons.morePropsQuestions,
    ]);
    if (!moreProps) addMorePropertiesFlag = true;
  }
  tracker.writeToBottomBar(
    `${new inquirer.Separator(longAssLine)}\n${chalk.green.bold(
      "Type name: "
    )}${typeName}\n\n${chalk.yellow.bold("Properties: ")}${typeProperties} \n`
  );
  const { confirmType } = await inquirer.prompt([
    customTypeQuestons.confirmType,
  ]);
};
