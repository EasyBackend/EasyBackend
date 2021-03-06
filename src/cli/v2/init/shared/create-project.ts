import chalk from "chalk";
import path from "path";
import fs from "fs";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import { promisify } from "util";
import { gqlTracker, restTracker } from "eb-lib";
import { databaseSetup } from "./init-db";
import { copyTemplateFiles } from "./init-file";
import { initGit } from "./init-git";
import Logger from "../../../../logger/logger";
import { IMainOptions } from "../../../../types";

const access = promisify(fs.access);

export const createProject = async (options: Partial<IMainOptions>) => {
  // creates project
  const { template, implementation, projectName } = options;

  const restfulOrGQL = implementation === "Restful API" ? "rest" : "gql"; // restful or graph ql

  const currentFileUrl = import.meta.url; // current file url helps us get the template's directory path

  if (!template) {
    Logger.error(`Invalid template name`); // no template no money
    return;
  }

  const targetDirectory = `${process.cwd()}\\${projectName}`;

  const templateDir = path
    .resolve(
      new URL(currentFileUrl).pathname,
      `../../../../../../templates/${restfulOrGQL}`, // pick templates from either gql folder or restfulAPI folder.
      template.toLowerCase()
    )
    .slice(3)
    .replace("create-project.js\\", "");

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
