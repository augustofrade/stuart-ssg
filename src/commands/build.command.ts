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
  const outputDirectory = args.output ?? "dist";

  const logger = BobLogger.Instance;

  const validProject = await StuartProjectManager.loadProject(projectDirectory);
  if (!validProject) {
    logger.logError(
      `Project not found in directory: ${projectDirectory}. Looked for 'stuart.conf' file.`
    );
    return;
  }

  logger.logInfo(`Building project in directory: ${projectDirectory}`);
  logger.logInfo(`Output will be saved to: ${outputDirectory}`);

  const result = await StuartProjectManager.buildSinglePage("index.md");
  if (result == null) {
    return logger.logError(`Failed to build page.`);
  }

  console.log(result);
}
