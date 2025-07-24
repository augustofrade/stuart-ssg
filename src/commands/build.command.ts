import chalk from "chalk";
import { join } from "path";
import { ArgumentsCamelCase } from "yargs";
import BobLogger from "../core/BobLogger";
import StuartProjectManager from "../core/StuartProject/StuartProjectManager";
import getAbsolutePath from "../helpers/get-absolute-path";

interface BuildCommandArgs {
  project_directory?: string;
  output?: string;
}

export default async function buildCommand(args: ArgumentsCamelCase<BuildCommandArgs>) {
  const projectDirectory = getAbsolutePath(args.project_directory ?? "");
  const outputDirectory = args.output ?? join(projectDirectory, "dist");

  const logger = BobLogger.Instance.setLogLevel(0);

  const validProject = await StuartProjectManager.loadProject(projectDirectory);
  if (!validProject) {
    logger.logError(
      `Project not found in directory: ${projectDirectory}. Looked for 'stuart.conf' file.`
    );
    process.exit(1);
  }

  logger.logInfo(`Building project in directory: ${projectDirectory}`);
  logger.logInfo(`Output will be saved to: ${outputDirectory}\n`);

  const results = await StuartProjectManager.buildProject(outputDirectory);
  if (!results.finished) {
    return logger.logError(`Failed to build page.`);
  }

  console.log(chalk.green(`Project built successfully!`));

  // console.log(result);
}
