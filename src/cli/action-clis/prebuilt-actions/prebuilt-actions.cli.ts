#!/usr/bin/env node
import inquirer from "inquirer";
import {
  prebuiltActionsQuestion,
  prebuiltActionsAvailable,
} from "../../cli-utils";

export const prebuiltActions = async () => {
  // TODO: get rid of this "any"
  console.table(
    prebuiltActionsAvailable.reduce((acc: any, { action, ...x }) => {
      acc[action] = x;
      return acc;
    }, {})
  );
  const { nav } = await inquirer.prompt([prebuiltActionsQuestion]);
  switch (nav) {
    case "Prebuilt actions":
      break;
    case "Custom type":
      break;
    case "Custom action":
      break;
    default:
      break;
  }
};
