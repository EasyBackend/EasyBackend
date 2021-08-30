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
  level?: string;
}
