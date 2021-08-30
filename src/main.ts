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

const access = promisify(fs.access);
const copy = promisify(ncp);

const copyTemplateFiles = async (options: IMainOptions) => {
  return copy(options.templateDirectory, options.targetDirectory, {
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
export const createProject = async (options: any) => {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };
  const currentFileUrl = import.meta.url;
  const templateDir = path
    .resolve(
      new URL(currentFileUrl).pathname,
      "./templates",
      options.template.toLowerCase()
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
      enabled: () => options.git,
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
