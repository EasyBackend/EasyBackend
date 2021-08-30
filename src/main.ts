import chalk from "chalk";
import fs from "fs";
import { promisify } from "util";

import path from "path";
import { projectInstall } from "pkg-install";
import Listr from "listr";

import Logger from "./logger/logger";
import { IMainOptions } from "./types";
import { databaseSetup, initGit } from "./utils/setup.util";
import { copyTemplateFiles, createError } from "./utils";

const access = promisify(fs.access);

export const createProject = async (options: IMainOptions) => {
  // creates project
  const { targetDirectory, template, restGQL } = options;

  const restfulOrGQL = restGQL === "Restful API" ? "restful" : "gql"; // restful or graph ql
  options = {
    ...options,
    targetDirectory: targetDirectory || process.cwd(),
  };

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
    .replace("main.js\\", "");
  options.templateDirectory = templateDir;

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
    // {
    //   title: "Set up database",
    //   task: () => databaseSetup(options),
    // },
    // {
    //   title: "Initialize git",
    //   task: () => initGit(options),
    //   enabled: () => options.git || false,
    // },
    // {
    //   title: "Install dependencies",
    //   task: () =>
    //     projectInstall({
    //       cwd: options.targetDirectory,
    //     }),
    //   skip: () =>
    //     !options.runInstall
    //       ? "Pass --install to automatically install dependencies."
    //       : undefined,
    // },
  ]);

  await tasks.run();

  Logger.info(`${chalk.green.bold("DONE")} Project ready.`);
  return true;
};
