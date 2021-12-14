import { serverLevelChoices } from ".";
import { IQuestion } from "../../../../types";

export const createServerQuestions: IQuestion[] = [
  {
    type: "input",
    name: "projectName",
    message: "Project name? (default: server)",
    default: "server",
  },
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
];
