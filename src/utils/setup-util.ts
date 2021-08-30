import fs from "fs";
import ncp from "ncp";
import path from "path";
import execa from "execa";
import { promisify } from "util";

import { writeToEnv } from ".";
import { IMainOptions } from "../types";
import Logger from "../logger/logger";

const copy = promisify(ncp);
const write = promisify(fs.writeFile);

const copyDatabaseFiles = async (options: IMainOptions) => {
  try {
    await write(
      `${options.targetDirectory}/eb.config.json`,
      `{"database": "${options.database?.toLowerCase()}"}`
    );
  } catch ({ message }) {
    Logger.error(
      "FAIL at setup-util.js at ~line 16 trying to insert DB type to eb.config.json, KOREN I TOLD YOU TO CHECK THIS"
    );
  }
  const currentFileUrl = import.meta.url;
  const databaseTemplateDir = path
    .resolve(
      new URL(currentFileUrl).pathname,
      "./templates/dbtemplates",
      `${options.database?.toLowerCase()}${`\\${
        options.templateDirectory?.split("templates")[1]
      }`}`
    )
    .slice(3)
    .replace("setup-util.js\\", "");

  options.databaseTemplateDir = databaseTemplateDir;
  return copy(databaseTemplateDir, `${options.targetDirectory}/db`, {
    clobber: false,
  });
};
export const databaseSetup = async (options: IMainOptions) => {
  await copyDatabaseFiles(options);
  //   options.template === "typescript"
  //     ? await install(tsMongo, { cwd: options.targetDirectory })
  //     : await install(jsMongo, { cwd: options.targetDirectory });
  return await writeToEnv(options);
};

export const initGit = async (options: IMainOptions) => {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(Logger.error("Failed to initialize Git"));
  }
  return;
};
