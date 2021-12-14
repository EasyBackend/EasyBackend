import execa from "execa";

export const launchServer = async () => {
  await execa.command("npm run eb:server", { cwd: process.cwd() });
};
