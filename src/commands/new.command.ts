import chalk from "chalk";
import inquirer from "inquirer";
import { ArgumentsCamelCase } from "yargs";
import StuartProjectManager from "../core/StuartProject/StuartProjectManager";
import getAbsolutePath from "../helpers/get-absolute-path";
import sanitizeDirName from "../helpers/sanitize-dir-name";

interface NewCommandArgs {
  project_name?: string;
  directory?: string;
}

export default async function newCommand(args: ArgumentsCamelCase<NewCommandArgs>) {
  const projectName = await getProjectName(args);
  const projectDirectory = args.directory
    ? getAbsolutePath(args.directory)
    : getAbsolutePath(sanitizeDirName(projectName));

  const success = await StuartProjectManager.create({
    projectName,
    projectDirectory,
    theme: "stuart",
  });

  if (!success) {
    return console.log(chalk.red("Failed to create project."));
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
