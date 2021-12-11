export const databaseSchemaQuestions = {
  uniqueProp: {
    type: "confirm",
    name: "uniqueProp",
    message: "Do you need a unique constraint for this schema?",
    default: false,
  },
  chooseUniqueProp: (schemaProps: string[]) => {
    return {
      type: "list",
      name: "chosenUniqueProperty",
      message: "Choose a property to be unique",
      choices: schemaProps,
    };
  },
  chooseRequiredProps: (schemaProps: string[]) => {
    return {
      type: "checkbox",
      name: "requiredProps",
      message:
        "Please select required properties for this schema (can select none)",
      choices: schemaProps,
      loop: true,
    };
  },
};
