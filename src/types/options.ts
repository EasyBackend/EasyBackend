export interface IOptions {
  template: string;
  git: boolean;
  database?: string;
  env?: string;
  restGQL: string;
  runInstall: boolean;
  skipPrompts?: boolean | undefined;
}
