import inquirer from "inquirer";
import { InterfaceStorageType } from "../../../../../../../types";
import {
  RestProjectTracker,
  GqlProjectTracker,
} from "../../../../../../../utils";
import { customTypeQuestions } from "..";

export const shouldIncludeDBSchema = async (
  tracker: RestProjectTracker | GqlProjectTracker
) => {
  const { dbSchema } = await inquirer.prompt([
    customTypeQuestions.includeDBSchema,
  ]);

  tracker.addToStorage(
    { key: InterfaceStorageType.includeDBSchema, value: dbSchema },
    true
  );

  if (dbSchema) {
    await chooseUniqueProp(tracker);
  }
};

const chooseUniqueProp = async (
  tracker: RestProjectTracker | GqlProjectTracker
): Promise<string | void> => {
  const { uniqueProp } = await inquirer.prompt([
    customTypeQuestions.uniqueProp,
  ]);

  if (uniqueProp) {
    const typeProps = tracker.getFromStorage(
      InterfaceStorageType.typeCreationProps
    );

    const { chosenUniqueProperty } = await inquirer.prompt([
      customTypeQuestions.chooseUniqueProp(typeProps),
    ]);

    if (chosenUniqueProperty)
      tracker.addToStorage(
        // TODO: this fuckin bug - I don't know why we get this error, I changed trackerStorage.ts and now this happened.
        // TODO: check out other instances for this occurance, maybe introduced more bugs?
        // imhere look at todo
        InterfaceStorageType.uniqueProperty,
        chosenUniqueProperty
      );
  }
};
