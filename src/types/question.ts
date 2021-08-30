export interface IQuestion {
  type?: string;
  name?: string;
  message?: string;
  choices?: (string | number)[];
  default?: string | number | boolean;
}
export interface IMainOptions {
  git?: boolean;
  template?: string;
  runInstall?: boolean;
  targetDirectory?: string;
  templateDirectory?: string;
  databaseTemplateDir?: string;
  database?: string;
  env?: string;
  restGQL?: string;
}
