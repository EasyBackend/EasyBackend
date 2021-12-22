import { IMainOptions } from "../types";
import { writeToEnv } from ".";

// const copyDatabaseFiles = async (options: IMainOptions) => {
//   try {
//     await write(`${options.targetDirectory}/eb.config.json`, `{"database": "${options.database?.toLowerCase()}"}`)
//   } catch ({ message }) {
//     Logger.error(`at copyDatabaseFiles, at setup.util.ts: ${message}`)
//   }

//   const currentFileUrl = import.meta.url
//   const databaseTemplateDir = path
//     .resolve(
//       new URL(currentFileUrl).pathname,
//       './templates/dbtemplates',
//       `${options.database?.toLowerCase()}${`\\${options.templateDirectory?.split('templates')[1]}`}`
//     )
//     .slice(3)
//     .replace('setup-util.js\\', '')

//   options.databaseTemplateDir = databaseTemplateDir
//   return copy(databaseTemplateDir, `${options.targetDirectory}/db`, {
//     clobber: false,
//   })
// }

export const databaseSetup = async (options: Partial<IMainOptions>) => {
  await writeToEnv(options);
  // * for now, because we only suppport mongoDB,
  // * databseSetup() only writes the URI if there is one, to the .env file.
  /*
    await copyDatabaseFiles(options);
    options.template === "typescript"
      ? await install(tsMongo, { cwd: options.targetDirectory })
      : await install(jsMongo, { cwd: options.targetDirectory });
    return await writeToEnv(options);
  */
};
