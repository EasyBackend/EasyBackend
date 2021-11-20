import fs from "fs";
import path from "path";
import { promisify } from "util";

import Logger from "../logger/logger";

import { restTracker, gqlTracker } from ".";

const read = promisify(fs.readFile);
const exists = promisify(fs.exists);

const loadProjectTrackerData = async () => {
  // TODO: Make this function able to run though folders backwards until it finds the root folder.
  // TODO: I"M HERE IM HERE IM HERE!
  const currentFileUrl = process.cwd();
  const configFileUrl = path.join(`${currentFileUrl}`, "eb.json");
  const doesExist = await exists(configFileUrl);
  if (!doesExist) return;
  const config = await read(configFileUrl, "utf8");
  return config;
};
export const getTracker = async () => {
  const rawProjectData = await loadProjectTrackerData();
  if (!rawProjectData) {
    Logger.error(
      "Could not load project config file, aborting (load.ts, getTracker())"
    );
    return;
  }
  const projectConfig = JSON.parse(rawProjectData);
  const {
    opts: { implementation },
  } = projectConfig;
  const tracker = implementation === "Restful API" ? restTracker : gqlTracker;
  tracker.config = projectConfig;
  return tracker;
};
