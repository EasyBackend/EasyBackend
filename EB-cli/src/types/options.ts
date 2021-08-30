export interface IOptions {
  template: string;
  git: boolean;
  database?: string;
  env?: string;
  runInstall: boolean;
  skipPrompts?: boolean | undefined;
}
