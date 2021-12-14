import chalk from "chalk";

export const customTypeQuestions = {
  typeName: {
    type: "input",
    name: "typeName",
    message: `What will be the name of the type? (example: tvShow, book, etc..)\n${chalk.bold.cyan(
      "Type name: "
    )}`,
  },
  typeProp: {
    type: "input",
    name: "typeProp",
    message: `Please enter a property in the form of 'name:type', or leave empty to cancel.\n ${chalk.bold.cyan(
      "Property:"
    )}`,
  },
  morePropsQuestions: {
    type: "confirm",
    name: "moreProps",
    message: "Do you want to add more properties?",
    default: true,
  },
  confirmType: {
    type: "confirm",
    name: "confirmType",
    message: `Is this OK?`,
    default: false,
  },
  typeNotOK: {
    type: "list",
    name: "notOK",
    message: "What do you want to do?",
    choices: ["Delete properties", "Add more properties", "Edit properties"],
    default: "none",
  },
  includeDBSchema: {
    type: "confirm",
    name: "dbSchema",
    message: "Also create a DB schema for this type?",
    default: false,
  },
  uniqueProp: {
    type: "confirm",
    name: "uniqueProp",
    message: "Do you need a unique constraint for this schema?",
    default: false,
  },
};

export const customTypeValidationQuestions = {
  duplicates: {
    type: "list",
    name: "deleteOrRename",
    message:
      "A single type cannot have duplicate properties. Do you want to delete or rename the duplicates?",
    choices: ["Select duplicates to delete", "Select duplicates to rename"],
    default: "none",
  },
};
