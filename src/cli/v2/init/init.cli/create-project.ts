import chalk from "chalk";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { projectInstall } from "pkg-install";
import Listr from "listr";

import Logger from "../../../../logger/logger";
import { IMainOptions } from "../../../../types";
import { copyTemplateFiles, databaseSetup, initGit } from "../init.util";
import { gqlTracker, restTracker } from "../../../../utils";

const access = promisify(fs.access);

export const createProject = async (options: Partial<IMainOptions>) => {
  // creates project
  const { template, implementation } = options;
  const restfulOrGQL = implementation === "Restful API" ? "rest" : "gql"; // restful or graph ql
  const currentFileUrl = import.meta.url; // current file url helps us get the template's directory path
  if (!template) {
    Logger.error(`Invalid template name`); // no template no money
    return;
  }
  const templateDir = path
    .resolve(
      new URL(currentFileUrl).pathname,
      `../../../../../../templates/${restfulOrGQL}`, // pick templates from either gql folder or restfulAPI folder.
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
    Logger.error(`Invalid template name, ${message}`); // no template no money
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
      // TODO: When at home, add a package.json to the template folders, so dependencies are installed.
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
