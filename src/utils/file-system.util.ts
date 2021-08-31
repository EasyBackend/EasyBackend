import ncp from "ncp";
import fs from "fs";
import { promisify } from "util";

import { IMainOptions } from "../types";

const write = promisify(fs.writeFile);
const copy = promisify(ncp);

const detemineFilesToCopy = (options: IMainOptions) => {
  const { level, userauth, errorlogging, socket } = options;
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
  if (userauth) {
    copyOptions.push("extras/userauth");
  }
  if (errorlogging) {
    copyOptions.push("extras/errorlogging");
  }
  if (socket) {
    copyOptions.push("extras/socket");
  }
  return copyOptions;
};

export const copyTemplateFiles = async (options: IMainOptions) => {
  const { templateDirectory, targetDirectory } = options;
  console.log("LALALA:", targetDirectory);
  const copyOptions = detemineFilesToCopy(options);
  console.log(targetDirectory + "\\example");
  Promise.all(
    copyOptions.map((option: string) => {
      if (!templateDirectory || !targetDirectory) return;
      copy(
        `${templateDirectory}/${option}`,
        `${targetDirectory}\\example`, // copies the template into the relevant location without overwriting anything
        {
          clobber: false,
        }
      );
    })
  );
  if (!templateDirectory || !targetDirectory) return;
  copy(
    `${templateDirectory}/basics`,
    targetDirectory, // copies the template into the relevant location without overwriting anything
    {
      clobber: false,
    }
  );
};

export const writeToEnv = async (options: IMainOptions) => {
  if (!options.env || typeof options.env !== "string") return;
  await write(`${options.targetDirectory}/.env`, `MONGO_URI="${options.env}"`);
};
