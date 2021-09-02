import chalk from "chalk";
import { IQuestion } from "../../types";
const serverLevelChoices = [
  "Full: includes eslint, husky, commitlint, changelog, logger, and github workflows",
  "Medium: includes husky and logger",
  "Basic: includes only a logger",
  //   "Custom",
];
export const longAssLine =
  "============================================================================================================";
export const restOrGql = {
  rest: {
    language: {
      typescript: {
        dependencies: [],
      },
      javascript: {
        dependencies: [],
      },
    },
  },
  gql: {
    language: {
      typescript: {
        dependencies: [],
      },
      javascript: {
        dependencies: [],
      },
    },
  },
};

export const questions: IQuestion[] = [
  {
    type: "list",
    name: "database",
    message: "Please choose a database to work with",
    choices: ["MongoDB"],
    default: "MongoDB",
  },
  {
    type: "input",
    name: "databaseUri",
    message: "Database URI?",
  },
  {
    type: "list",
    name: "implementation",
    message:
      "Would you like to use GraphQL or build a Restful API? (default: Restful API)",
    choices: ["Restful API", "GraphQL"],
    default: "Restful API",
  },
  {
    type: "list",
    name: "level",
    message: "How rich would you like your server to be? (default: Full)",
    choices: serverLevelChoices,
    default: "Full",
  },
  // {
  //   type: "confirm",
  //   name: "userauth",
  //   message: "Initialize with basic user-auth?",
  //   default: false,
  // },
  // {
  //   type: "confirm",
  //   name: "errorlogging",
  //   message: "Initialize with basic error logging?",
  //   default: false,
  // },
  // {
  //   type: "confirm",
  //   name: "socket",
  //   message: "Initialize with socket.io?",
  //   default: false,
  // },
];

export const actionOptions = [
  {
    action: "Prebuilt actions",
    description: "CRUD ops, Socket.io, User auth -- within minutes",
  },
  {
    action: "Custom type",
    description:
      "Create a custom type definition (for TS/GQL) or for your database",
  },
  {
    action: "Custom action",
    description: "Create a custom action (REST endpoint/GQL resolver)",
  },
];

export const builderCLINavQuestion = {
  type: "list",
  name: "nav",
  message: "Where do you want to go?",
  choices: [
    "Prebuilt actions",
    "Create a custom type",
    "Create a custom action",
  ],
  default: "Prebuilt actions",
};
export const prebuiltActionsAvailable = [
  {
    action: "User Authentication",
    description:
      "'User' db model and type, JWT auth with registration, login, logout, and more.",
  },
  {
    action: "Socket.io",
    description:
      "Connect your Node.js app with Socket.io in a matter of seconds",
  },
  {
    action: "Error handling system",
    description: "'Error' db model and type, save errors to database.",
  },
  {
    action: "CRUD operations",
    description: "CRUD operations for your database",
  },
];

export const prebuiltActionsQuestion = {
  type: "list",
  name: "chosenAction",
  message: "What do you want to do?",
  choices: [
    "User Authentication",
    "Socket.io",
    "Error handling system",
    "CRUD operations",
  ],
  default: "Prebuilt actions",
};

export const customTypeQuestons = {
  typeName: {
    type: "input",
    name: "typeName",
    message: `What will be the name of the type? (example: tvShow, book, etc..)\n ${chalk.bold.cyan(
      "Type name: "
    )}`,
  },
  typeProp: {
    type: "input",
    name: "typeProp",
    message: `Please enter a property in the form of 'name:type'\n ${chalk.bold.cyan(
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
};
