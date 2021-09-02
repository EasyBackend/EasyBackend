import fs from "fs";
import { promisify } from "util";

import { IMainOptions } from "../types";
import ncp from "ncp";

const copy = promisify(ncp);
const write = promisify(fs.writeFile);

export const writeToEnv = async (options: Partial<IMainOptions>) => {
  if (!options.databaseUri || typeof options.databaseUri !== "string") {
    options.databaseUri = "__";
  }
  await write(`${process.cwd()}/.env`, `MONGO_URI="${options.databaseUri}"`);
};

export const copyTemplateFiles = async (options: Partial<IMainOptions>) => {
  const { templateDirectory, targetDirectory } = options;
  const copyOptions = detemineFilesToCopy(options);

  if (!templateDirectory || !targetDirectory) return;
  await Promise.all(
    copyOptions.map((option: string) => {
      copy(
        `${templateDirectory}/${option}`,
        targetDirectory, // copies the template into the relevant location without overwriting anything
        {
          clobber: false,
        }
      );
    })
  );
  console.log("TEMPLATE DIRECTORY: ", templateDirectory);
  console.log("TARGET DIRECTORY: ", targetDirectory);
  await copy(
    `${templateDirectory}/basics`,
    targetDirectory, // copies the template into the relevant location without overwriting anything
    {
      clobber: false,
    }
  );
  console.log("INSIDE copytemplatefiles()");
};

export const detemineFilesToCopy = (options: Partial<IMainOptions>) => {
  const { level } = options;
  const copyOptions: string[] = [];
  if (level?.includes("Full")) {
    copyOptions.push("full");
  }
  if (level?.includes("Medium")) {
    copyOptions.push("medium");
  }
  if (level?.includes("Basic")) {
    copyOptions.push("basics");
  }
  return copyOptions;
};
