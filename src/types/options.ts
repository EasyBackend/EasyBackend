export interface IMainOptions {
  git: boolean;
  template: string;
  runInstall: boolean;
  targetDirectory: string;
  templateDirectory: string;
  databaseTemplateDir: string;
  database: string;
  databaseUri?: string;
  implementation: string;
  level: string;
}
