#!/usr/bin/env node
import inquirer from "inquirer";
import {
  actionOptions,
  builderCLINavQuestion,
  getTracker,
  parseArgs,
} from "./cli-utils";
import { customType, prebuiltActions } from "./action-clis";

export const builder_cli = async (rawArgs: string[]) => {
  const tracker = await getTracker();
  // TODO: Decide what to do with flags vv vv vv
  const spec = {
    "--prebuilt": Boolean,
    "--type": Boolean,
    "--caction": Boolean,
    "-p": "--prebuilt",
    "-t": "--type",
    "-c": "--caction",
  };
  const args = parseArgs(rawArgs, spec);
  const goto = args._[0];
  // TODO: add auto-linking to relevant parts of CLI
  if (goto) {
  }
  // TODO: get rid of this "any"
  console.table(
    actionOptions.reduce((acc: any, { action, ...x }) => {
      acc[action] = x;
      return acc;
    }, {})
  );
  const { nav } = await inquirer.prompt([builderCLINavQuestion]);
  switch (nav) {
    case "Prebuilt actions":
      await prebuiltActions(tracker);
      break;
    case "Create a custom type":
      await customType(tracker);
      break;
    case "Custom action":
      break;
    default:
      break;
  }
};
