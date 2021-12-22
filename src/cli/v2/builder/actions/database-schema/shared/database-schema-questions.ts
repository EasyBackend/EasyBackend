export const databaseSchemaQuestions = {
  uniqueProp: {
    type: "confirm",
    name: "uniqueProp",
    message: "Do you need a unique constraint for this schema?",
    default: false,
  },
  chooseUniqueProp: (typeProps: string[]) => {
    // currently can't support array types as unique props
    const possibleUniqueProps = typeProps.filter(
      (typeProp) => !typeProp.includes("[")
    );

    return {
      type: "list",
      name: "chosenUniqueProperty",
      message: "Choose a property to be unique",
      choices: [...possibleUniqueProps, "--cancel"],
    };
  },
  chooseRequiredProps: (schemaProps: string[]) => ({
    type: "checkbox",
    name: "requiredProps",
    message:
      "Please select required properties for this schema (can select none)",
    choices: [...schemaProps, "--none"],
    loop: true,
  }),
};
