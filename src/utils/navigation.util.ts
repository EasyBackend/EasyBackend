import arg from "arg";
import { parseArgs } from ".";

export const getNavigation = (spec: arg.Spec, rawArgs: string[]) => {
  const args = parseArgs(rawArgs, spec);
  const goto = args._[0];
  return goto;
};
