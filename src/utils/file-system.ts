import ncp from "ncp";
import fs from "fs";
import { promisify } from "util";

import { IMainOptions } from "../types";
import Logger from "../logger/logger";

const write = promisify(fs.writeFile);
const copy = promisify(ncp);

export const copyTemplateFiles = async (options: IMainOptions) => {
  const { templateDirectory, targetDirectory } = options;
  if (!templateDirectory) return;
  Logger.error(targetDirectory);
  return copy(
    templateDirectory,
    "C:/Users/Koren/Documents/EasyBackend/example",
    {
      clobber: false,
    }
  );
};

export const writeToEnv = async (options: IMainOptions) => {
  if (!options.env || typeof options.env !== "string") return;
  await write(`${options.targetDirectory}/.env`, `MONGO_URI="${options.env}"`);
};
