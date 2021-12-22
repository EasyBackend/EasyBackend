import chalk from "chalk";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { projectInstall } from "pkg-install";
import Listr from "listr";

import { gqlTracker, restTracker } from "eb-lib";
import Logger from "./logger/logger";
import { IMainOptions } from "./types";
import { copyTemplateFiles, createError, databaseSetup } from "./utils";
import { initGit } from "./cli/v2/init/shared/init-git";

const access = promisify(fs.access);

export const createProject = async (options: Partial<IMainOptions>) => {
  // creates project
  const { template, implementation } = options;
  const restfulOrGQL = implementation === "Restful API" ? "rest" : "gql"; // restful or graph ql
  const currentFileUrl = import.meta.url; // current file url helps us get the template's directory path

  if (!template) {
    createError(`${chalk.red.bold("ERROR")}, Invalid template name`); // no template no money
    return;
  }
  const templateDir = path
    .resolve(
      new URL(currentFileUrl).pathname,
      `./templates/${restfulOrGQL}`, // pick templates from either gql folder or restfulAPI folder.
      template.toLowerCase()
    )
    .slice(3)
    .replace("create-project.js\\", "");
  const targetDirectory = process.cwd();

  options = {
    ...options,
    targetDirectory,
    templateDirectory: templateDir,
  };

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch ({ message }) {
    // makes sure folder is there
    Logger.error(
      `${chalk.red.bold("ERROR")}, Invalid template name, ${message}`
    );
    process.exit(1);
  }

  const tasks = new Listr([
    // starts the process of creating the server
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Set up database",
      task: () => databaseSetup(options),
    },
    {
      title: "Initialize git",
      task: () => initGit(options),
      enabled: () => options.git || false,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.runInstall
          ? "Pass --install to automatically install dependencies."
          : undefined,
    },
    {
      title: "Creating config file",
      task: () =>
        (options.implementation === "gql" ? gqlTracker : restTracker).init(
          options as IMainOptions
        ),
    },
  ]);

  await tasks.run();
  Logger.info(`${chalk.green.bold("DONE")} Project ready.`);
  return true;
};
