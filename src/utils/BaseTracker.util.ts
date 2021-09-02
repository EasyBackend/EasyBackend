import fs from "fs";
import inquirer from "inquirer";
import { promisify } from "util";

const read = promisify(fs.readFile);

export class BaseTracker {
  acceptedTypes = [" string", " string[]", " number"];

  constructor() {}

  writeToBottomBar(content: string) {
    const ui = new inquirer.ui.BottomBar();
    ui.log.write(content);
  }
}
