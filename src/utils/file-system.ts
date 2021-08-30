import ncp from "ncp";
import fs from "fs";
import { promisify } from "util";

import { IMainOptions } from "../types";
import { allFilesToCopy } from "../utils";

const write = promisify(fs.writeFile);
const copy = promisify(ncp);

export const copyTemplateFiles = async (options: IMainOptions) => {
  let { templateDirectory, level, restGQL } = options;
  if (!restGQL) restGQL = "rest";

  let copyOptions: string[] = [];
  if (level?.includes("Full")) {
    copyOptions = allFilesToCopy;
  }
  if (level?.includes("Medium")) {
    copyOptions = ["husky", "logger"];
  }
  if (level?.includes("Light")) {
    copyOptions = ["logger"];
  }

  await Promise.all(
    copyOptions.map((option: string) => {
      if (!templateDirectory) return;
      copy(
        `${templateDirectory}/${option}`,
        "C:/Users/Koren/Documents/EasyBackend/example", // copies the template into the relevant location without overwriting anything
        {
          clobber: false,
        }
      );
    })
  );
};

export const writeToEnv = async (options: IMainOptions) => {
  if (!options.env || typeof options.env !== "string") return;
  await write(`${options.targetDirectory}/.env`, `MONGO_URI="${options.env}"`);
};
