import inquirer from "inquirer";
import { RestProjectTracker, GqlProjectTracker } from ".";
import { longAssLine } from "../cli/cli-utils";
import { ITrackerStorage, ITrackerHistory } from "../types";

export class BaseTracker {
  history = {} as ITrackerHistory;
  /*
  ? this object stores the history of the user's flow, 
  ? so we can return the user to a certain point in the CLI workflow when needed. 
  ? For example, when asked if a custom type is OK to create, and the user says no, 
  ? and deletes a prop, user needs to be asked again: is this OK? and to return the user to that point, we use the history object.
  */
  storage: ITrackerStorage[] = []; // TODO: Make sure storage gets cleared after every action.
  // ? The tracker's storage, which keeps temporary data like props during a type creation process, when deleting or editing them.

  constructor() {}

  writeToBottomBar(content: string, clear?: boolean, seperator?: boolean) {
    if (clear) console.clear();
    // writes a big seperator line and then some text in the CLI
    const ui = new inquirer.ui.BottomBar();
    ui.log.write(
      `${
        seperator ? new inquirer.Separator(longAssLine) + "\n" : ""
      } ${content}`
    );
  }
  addToStorage(data: ITrackerStorage | ITrackerStorage[], replace?: boolean) {
    // adds or replaces an item in the temporary storage.
    if (replace && !Array.isArray(data)) {
      const replaceIndex = this.storage.findIndex(
        (item) => item.as === data.as
      );
      if (replaceIndex !== -1) {
        this.storage.splice(replaceIndex, 1, data);
      } else {
        this.storage.push(data);
      }
    }
    if (Array.isArray(data)) {
      this.storage.concat(data);
    } else {
      this.storage.push(data);
    }
  }
  getFromStorage(as: string) {
    // self explanatory.
    return this.storage.find((item) => item.as === as)?.value;
  }
  setHistory(history: Function) {
    //?  sets the history object with all it's methods.
    this.history.history = history;
    this.history.get = () => history.toString();
    this.history.goBack = (tracker?: RestProjectTracker | GqlProjectTracker) =>
      tracker ? tracker.history.history(tracker) : this.history.history();
    // TODO: add comments to explain this weirdness, or make it less weird.
  }
}
