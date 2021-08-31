#!/usr/bin/env node
import inquirer from "inquirer";
import { actionOptions, builderCLINavQuestion, parseArgs } from "./cli-utils";

export const builder_cli = async (rawArgs: string[]) => {
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
  // TODO: get rid of any
  console.table(
    actionOptions.reduce((acc: any, { action, ...x }) => {
      acc[action] = x;
      return acc;
    }, {})
  );
  const { nav } = await inquirer.prompt([builderCLINavQuestion]);
  console.log("NAV: ", nav);
};
