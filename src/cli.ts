#!/usr/bin/env node
import arg from "arg";
import inquirer from "inquirer";
import { IQuestion, IOptions } from "./types";
import { createProject } from "./main";

const parseArgumentsIntoOptions = (rawArgs: string[]) => {
  const args = arg(
    {
      "--git": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
  };
};

const promptForMissingOptions = async (options: {
  git: any;
  template: any;
  runInstall: boolean;
  skipPrompts?: any;
}) => {
  const defaultTemplate = "Typescript";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }
  const questions: IQuestion[] = [
    {
      type: "list",
      name: "database",
      message: "Please choose a database to work with",
      choices: ["MongoDB"],
      default: "MongoDB",
    },
    {
      type: "input",
      name: "env",
      message: "Database URI?",
    },
    {
      type: "list",
      name: "restGQL",
      message: "Would you like to use GraphQL or build a Restful API?",
      choices: ["Restful API", "GraphQL"],
      default: "Restful API",
    },
  ];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["Typescript"],
      default: defaultTemplate,
    });
  }
  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }
  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    database: answers.database,
    env: answers.env,
    restGQL: answers.restGQL,
  };
};

export const cli = async (args: string[]) => {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
};
