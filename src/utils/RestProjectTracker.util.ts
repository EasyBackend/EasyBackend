import fs from "fs";
import { promisify } from "util";

import { IMainOptions, IRestConfig, IRestTracker } from "../types";
import { BaseTracker } from "./BaseTracker.util";
const write = promisify(fs.writeFile);

export class RestProjectTracker extends BaseTracker implements IRestTracker {
  config = {} as IRestConfig;

  constructor() {
    super();
    this.writeToBottomBar = this.writeToBottomBar.bind(this);
    this.init = this.init.bind(this);
  }

  async validateConfig(config: IRestConfig) {}

  async init(opts: IMainOptions) {
    const toCreate = {
      opts,
      routes: [],
      middlewares: [],
      plugins: [],
    };
    delete toCreate.opts.databaseUri;
    this.config = toCreate;
    await write(`${opts.targetDirectory}/eb.json`, JSON.stringify(toCreate));
  }

  async writeRoute() {}
}

export const restTracker = new RestProjectTracker();
