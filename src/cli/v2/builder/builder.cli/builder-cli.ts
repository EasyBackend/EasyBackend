#!/usr/bin/env node
import inquirer from "inquirer";

import {
  RestProjectTracker,
  GqlProjectTracker,
  getNavigation,
  printAsTable,
  getTracker,
} from "../../../../utils";
import { actionOptions, builderCLINavQuestion } from "../builder.util";
import { createCustomTypeFromCLI } from "../actions/customType/customType.cli";

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
  const goto = getNavigation(spec, rawArgs);
  if (goto) {
    // TODO: add auto-linking to relevant parts of CLI
  }
  printAsTable(actionOptions);
  const tracker = await getTracker();
  if (tracker) await builder_navigate(tracker);
};

const builder_navigate = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const { nav } = await inquirer.prompt([builderCLINavQuestion]);
  switch (nav) {
    case "Prebuilt actions":
      break;
    case "Create a custom type":
      tracker.setHistory(builder_navigate);
      await createCustomTypeFromCLI(tracker);
      process.removeAllListeners();
      break;
    case "Custom action":
      break;
    default:
      break;
  }
};
