import inquirer from "inquirer";
import { RestProjectTracker, GqlProjectTracker } from ".";
import { longAssLine } from "../cli/cli-utils";
import { ITrackerStorage, ITrackerHistory } from "../types";

export class BaseTracker {
  acceptedTypes = [" string", " string[]", " number"];
  history = {} as ITrackerHistory;
  storage: ITrackerStorage[] = [];

  constructor() {}

  writeToBottomBar(content: string, seperator?: boolean) {
    const ui = new inquirer.ui.BottomBar();
    ui.log.write(
      `${
        seperator ? new inquirer.Separator(longAssLine) + "\n" : null
      } ${content}`
    );
  }
  addToStorage(data: ITrackerStorage | ITrackerStorage[], replace?: boolean) {
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
    return this.storage.find((item) => item.as === as)?.value;
  }
  setHistory(history: Function) {
    this.history.history = history;
    this.history.get = () => history.toString();
    this.history.goBack = (tracker?: RestProjectTracker | GqlProjectTracker) =>
      tracker ? tracker.history.history(tracker) : this.history.history();
  }
}
