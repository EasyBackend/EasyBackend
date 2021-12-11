import chalk from "chalk";
import { InterfaceStorageType } from "../../../../../../types";
import { RestProjectTracker, GqlProjectTracker } from "../../../../../../utils";

export const printCustomTypeDetails = (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const typeName = tracker.getFromStorage(InterfaceStorageType.typeName);
  const typeProperties = tracker.getFromStorage(
    InterfaceStorageType.typeCreationProps
  );
  // console.clear();
  tracker.writeToBottomBar(
    `${chalk.green("Type name: ")}${typeName}\n\n${chalk.yellow(
      "Properties: "
    )}${typeProperties.join(", ")}`,
    true
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
