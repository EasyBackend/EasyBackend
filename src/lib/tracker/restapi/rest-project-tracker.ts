import * as fs from 'fs'
import { promisify } from 'util'
import { allowedTypes } from '../../../utils'
import { IMainOptions, IRestConfig, IRestTracker } from '../../../types'
import { BaseTracker } from '../base-tracker'

const write = promisify(fs.writeFile)

export class RestProjectTracker extends BaseTracker implements IRestTracker {
  config = {} as IRestConfig

  constructor() {
    super()
    this.writeToBottomBar = this.writeToBottomBar.bind(this)
    this.addToStorage = this.addToStorage.bind(this)
    this.getFromStorage = this.getFromStorage.bind(this)
    this.setHistory = this.setHistory.bind(this)
    this.init = this.init.bind(this)
    // this.writeRoute = this.writeRoute.bind(this);
  }

  // async validateConfig(config: IRestConfig) {}

  async init(opts: IMainOptions) {
    const toCreate = {
      opts,
      routes: [],
      middlewares: [],
      plugins: [],
      allowedTypes,
    }
    delete toCreate.opts.databaseUri
    this.config = toCreate
    await write(`${opts.targetDirectory}/eb.json`, JSON.stringify(toCreate))
  }

  // async writeRoute() {}
}

export const restTracker = new RestProjectTracker()
