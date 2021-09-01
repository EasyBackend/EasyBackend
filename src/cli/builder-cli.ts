#!/usr/bin/env node
import inquirer from "inquirer";
import { actionOptions, builderCLINavQuestion, parseArgs } from "./cli-utils";
import { prebuiltActions } from "./action-clis";

export const builder_cli = async (rawArgs: string[]) => {
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
      await prebuiltActions();
      break;
    case "Custom type":
      break;
    case "Custom action":
      break;
    default:
      break;
  }
};
