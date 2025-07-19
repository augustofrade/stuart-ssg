import chalk from "chalk";
import { existsSync } from "fs";
import inquirer from "inquirer";
import { join } from "path";
import { ArgumentsCamelCase } from "yargs";
import StuartProjectManager from "../core/StuartProject/StuartProjectManager";
import getAbsolutePath from "../helpers/get-absolute-path";
import sanitizeDirName from "../helpers/sanitize-dir-name";

interface NewCommandArgs {
  project_name?: string;
  directory?: string;
  blueprint: string;
  theme: string;
}

export default async function newCommand(args: ArgumentsCamelCase<NewCommandArgs>) {
  const projectName = await getProjectName(args);
  const projectDirectory = args.directory
    ? getAbsolutePath(args.directory)
    : getAbsolutePath(sanitizeDirName(projectName));

  if (existsSync(join(projectDirectory, "stuart.conf"))) {
    console.log(chalk.red(`A project already exists at "${projectDirectory}".`));
    return;
  }

  const success = await StuartProjectManager.create({
    projectName,
    projectDirectory,
    blueprint: args.blueprint,
    theme: args.theme,
  });

  if (!success) {
    return console.log(chalk.red("\nCancelling project creation operation."));
  }

  console.log(chalk.green(`\nProject "${projectName}" created successfully!`));
  console.log(`\nRun your new project by running the following commands:`);
  console.log(chalk.blue("cd " + projectDirectory + "\nstuart dev"));
}

function getProjectName(args: ArgumentsCamelCase<NewCommandArgs>): Promise<string> {
  return new Promise((resolve, reject) => {
    if (args.project_name) {
      return resolve(args.project_name);
    }

    inquirer
      .prompt([
        {
          type: "input",
          name: "project_name",
          message: "Enter the name of the new project:",
          required: true,
          validate: (input) => {
            if (!input.trim()) {
              return "Project name cannot be empty.";
            }
            return true;
          },
        },
      ])
      .then((answers) => resolve(answers.project_name))
      .catch((error) => reject(error));
  });
}
