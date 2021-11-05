import { IMainOptions } from ".";

export type Types = "N/A" | string[];
export type Language = "typescript" | "javascript";
export type Implementaion = "gql" | "rest";

interface IAllowedTypes {
  arrayTypes: string[];
  primitiveTypes: string[];
  objectTypes: string[];
  customTypes: string[];
}
interface IBaseConfig {
  opts: Omit<IMainOptions, "databaseUri">;
  plugins: string[];
  allowedTypes: IAllowedTypes;
}

export interface IGqlConfig extends IBaseConfig {
  resolvers: string[];
  typeDefs: string[];
}
export interface IRestConfig extends IBaseConfig {
  routes: string[];
  middlewares: string[];
}

export interface IRestTracker {
  config: IRestConfig;
}

export interface IDB {
  database: string;
  schemas: string[];
}

export interface IGQLTracker {
  config: IGqlConfig;
}

export interface ITrackerHistory {
  history: Function;
  get: Function;
  goBack: Function;
}
