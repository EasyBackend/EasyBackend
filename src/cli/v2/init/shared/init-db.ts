import { IMainOptions } from "../../../../types";
import { writeToEnv } from "./init-file";

export const databaseSetup = async (options: Partial<IMainOptions>) => {
  await writeToEnv(options);
  // * for now, because we only suppport mongoDB,
  // * databseSetup() only writes the URI if there is one, to the .env file.
  // TODO: create a proper databse setup, so it'll be easier to add support for different kinds of databases.
  /*
    await copyDatabaseFiles(options);
    options.template === "typescript"
      ? await install(tsMongo, { cwd: options.targetDirectory })
      : await install(jsMongo, { cwd: options.targetDirectory });
    return await writeToEnv(options);
  */
};
