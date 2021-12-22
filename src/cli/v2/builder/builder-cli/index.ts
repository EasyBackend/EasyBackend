#!/usr/bin/env node
import { RestProjectTracker, GqlProjectTracker, getTracker } from "eb-lib";
import * as inquirer from "inquirer";
import { getNavigation, printAsTable } from "../../../../utils";

import { createCustomTypeFromCLI } from "../actions/custom-type/shared";
import { builderCLINavQuestion } from "./builder-questions";
import { actionOptions } from "./consts";

export const builderCli = async (rawArgs: string[]) => {
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
    // add linking to relevant parts of CLI
  }
  printAsTable(actionOptions);
  const tracker = await getTracker();
  if (tracker) await buiilderNavigate(tracker);
};

const buiilderNavigate = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const { nav } = await inquirer.prompt([builderCLINavQuestion]);
  switch (nav) {
    case "Prebuilt actions":
      break;
    case "Create a custom type":
      tracker.setHistory(buiilderNavigate);
      await createCustomTypeFromCLI(tracker);
      process.removeAllListeners();
      break;
    case "Custom action":
      break;
    default:
      break;
  }
};
