import arg from "arg";
import execa from "execa";

import { IMainOptions } from "../../../../types";
import Logger from "../../../../logger/logger";

export const initGit = async (options: Partial<IMainOptions>) => {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(Logger.error("Failed to initialize Git"));
  }
  return;
};

export const parseArgs = (rawArgs: string[], spec: arg.Spec) => {
  const args = arg(spec, { argv: rawArgs.slice(2) });
  return args;
};
