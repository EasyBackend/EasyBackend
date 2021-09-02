import fs from "fs";
import { promisify } from "util";

import { IMainOptions, IGQLTracker, IGqlConfig } from "../types";
import { BaseTracker } from "./BaseTracker.util";

const write = promisify(fs.writeFile);

export class GqlProjectTracker extends BaseTracker implements IGQLTracker {
  config = {} as IGqlConfig;

  constructor() {
    super();
    this.writeToBottomBar = this.writeToBottomBar.bind(this);
    this.init = this.init.bind(this);
  }

  async init(opts: IMainOptions) {
    const toCreate = {
      opts,
      resolvers: [],
      typeDefs: [],
      plugins: [],
    };
    delete toCreate.opts.databaseUri;
    this.config = toCreate;
    await write(`${opts.targetDirectory}/eb.json`, JSON.stringify(toCreate));
  }

  async writeResolver() {}
  async writeResolverTypedef() {}
}

export const gqlTracker = new GqlProjectTracker();
