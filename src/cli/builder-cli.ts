#!/usr/bin/env node
import inquirer from "inquirer";

import {
  actionOptions,
  builderCLINavQuestion,
  getTracker,
  printAsTable,
} from "./cli-utils";
import { customType, prebuiltActions } from "./action-clis";
import { RestProjectTracker, GqlProjectTracker } from "../utils";
import { getNavigation } from "./cli-utils/navigation";

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
  // TODO: add auto-linking to relevant parts of CLI
  if (goto) {
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
      tracker.setHistory(builder_navigate);
      await prebuiltActions(tracker);
      process.removeAllListeners();
      break;
    case "Create a custom type":
      tracker.setHistory(builder_navigate);
      await customType(tracker);
      process.removeAllListeners();
      break;
    case "Custom action":
      tracker.setHistory(builder_navigate);
      process.removeAllListeners();
      break;
    default:
      break;
  }
};
