#!/usr/bin/env node
import inquirer from "inquirer";
import {
  prebuiltActionsQuestion,
  prebuiltActionsAvailable,
  getTracker,
} from "../../cli-utils";
import { RestProjectTracker, GqlProjectTracker } from "../../../utils";

const prebuilt_navigate = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const { nav } = await inquirer.prompt([prebuiltActionsQuestion]);
  switch (nav) {
    case "Prebuilt actions":
      tracker.setHistory(prebuilt_navigate);
      break;
    case "Custom type":
      tracker.setHistory(prebuilt_navigate);
      break;
    case "Custom action":
      tracker.setHistory(prebuilt_navigate);
      break;
    case "Back":
      await tracker.history.goBack(tracker);
      break;
    default:
      break;
  }
};

export const prebuiltActions = async (
  tracker?: RestProjectTracker | GqlProjectTracker
) => {
  if (!tracker) tracker = await getTracker();
  // TODO: get rid of this "any"
  console.table(
    prebuiltActionsAvailable.reduce((acc: any, { action, ...x }) => {
      acc[action] = x;
      return acc;
    }, {})
  );
  if (tracker) await prebuilt_navigate(tracker);
};
