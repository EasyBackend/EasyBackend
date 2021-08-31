import { IQuestion } from "../../types";
const serverLevelChoices = [
  "Full: includes eslint, husky, commitlint, changelog, logger, and github workflows",
  "Medium: includes husky and logger",
  "Basic: includes only a logger",
  //   "Custom",
];

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
    name: "env",
    message: "Database URI?",
  },
  {
    type: "list",
    name: "restGQL",
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
