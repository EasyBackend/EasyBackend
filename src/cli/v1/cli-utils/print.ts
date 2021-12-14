import chalk from "chalk";
import { RestProjectTracker, GqlProjectTracker } from "../../../utils";

export const printAsTable = (data: any[]) => {
  // TODO: Get rid of this "any" ^^^^
  console.table(
    // TODO: get rid of this "any" vvvv
    data.reduce((acc: any, { action, ...x }) => {
      acc[action] = x;
      return acc;
    }, {})
  );
};
export const logAllValidTypes = (
  tracker: RestProjectTracker | GqlProjectTracker,
  typeProperties: string[]
) => {
  const { arrayTypes, objectTypes, primitiveTypes, customTypes } =
    tracker.config.allowedTypes;
  tracker.writeToBottomBar(
    `${chalk.yellowBright(`=== Allowed Types List ===\n`)}
    ${chalk.yellow("Primitive types: ")}${primitiveTypes.join(", ")}\n
    ${chalk.yellow("Object types: ")}${objectTypes.join(", ")}\n
    ${chalk.yellow("Array types: ")}${arrayTypes.join(", ")}
    ${
      customTypes.length
        ? chalk.yellow("\nCustom types: ", customTypes.join(", "))
        : ""
    }
    ${
      // show user an array of the allowed types.
      typeProperties.length
        ? `\n${chalk.green(`\ \ Properties:`)} ${typeProperties.join(", ")}` // current properties for the type user is creating.
        : ""
    }`,
    true
  );
};
