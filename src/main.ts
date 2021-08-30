import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import { promisify } from "util";
import Logger from "./logger/logger";
import { IMainOptions } from "./types";
import { databaseSetup } from "./setup-util";
import * as utils from "./utils";

const access = promisify(fs.access);
const copy = promisify(ncp);

const copyTemplateFiles = async (options: IMainOptions) => {
  const { templateDirectory, targetDirectory } = options;
  if (!templateDirectory) return;
  Logger.error(targetDirectory);
  return copy(templateDirectory, targetDirectory || process.cwd(), {
    clobber: false,
  });
};
const initGit = async (options: IMainOptions) => {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(Logger.error("Failed to initialize Git"));
  }
  return;
};
export const createProject = async (options: IMainOptions) => {
  Logger.error(process.cwd());
  const { targetDirectory, template, restGQL } = options;
  const restfulOrGQL = restGQL === "Restful API" ? "restful" : "gql";
  options = {
    ...options,
    targetDirectory: targetDirectory || process.cwd(),
  };
  const currentFileUrl = import.meta.url;
  if (!template) {
    utils.createError(`${chalk.red.bold("ERROR")}, Invalid template name`);
    return;
  }
  const templateDir = path
    .resolve(
      new URL(currentFileUrl).pathname,
      `./templates/${restfulOrGQL}`,
      template.toLowerCase()
    )
    .slice(3)
    .replace("main.js\\", "");
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch ({ message }) {
    Logger.error(
      `${chalk.red.bold("ERROR")}, Invalid template name, ${message}`
    );
    process.exit(1);
  }

  const tasks = new Listr([
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
  ]);

  await tasks.run();

  Logger.info(`${chalk.green.bold("DONE")} Project ready.`);
  return true;
};
