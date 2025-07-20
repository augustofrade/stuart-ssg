import path from "path";
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

  const index = path.join(projectDirectory, "pages", "index.md");
  console.log(await StuartProjectManager.buildSinglePage(index));

  logger.logInfo(`Building project in directory: ${projectDirectory}`);
  logger.logInfo(`Output will be saved to: ${outputDirectory}`);
}
