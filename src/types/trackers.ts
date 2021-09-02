import { IMainOptions } from ".";

export type Types = "N/A" | string[];
export type Language = "typescript" | "javascript";
export type Implementaion = "gql" | "rest";

interface IBaseConfig {
  opts: Omit<IMainOptions, "databaseUri">;
  plugins: string[];
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
