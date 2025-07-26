import chalk from "chalk";
import inquirer from "inquirer";
import { ArgumentsCamelCase } from "yargs";
import BobLogger from "../core/BobLogger";
import schematicsList, {
  availableSchematics,
} from "../core/StuartProject/schematic/schematics-list";
import StuartSchematicGenerator from "../core/StuartProject/schematic/StuartSchematicGenerator";
import { CreateSchematicOptions, StuartSchematic } from "../core/StuartProject/schematic/types";
import StuartProjectManager from "../core/StuartProject/StuartProjectManager";
import getAbsolutePath from "../helpers/get-absolute-path";

interface PageDetailsPromptResponse {
  title: string;
  description: string;
}

export interface GenerateCommandArgs {
  schematic?: string;
  title?: string;
  description?: string;
  category?: string;
}

export default async function generateCommand(args: ArgumentsCamelCase<GenerateCommandArgs>) {
  const logger = BobLogger.Instance;

  const projectDirectory = getAbsolutePath("website");
  const validDirectory = await StuartProjectManager.loadProject(projectDirectory);
  if (!validDirectory) {
    console.log(chalk.red("This command can only be used in a valid Stuart Project directory.\n"));
    process.exit(1);
  }

  if (validateSchematic(args.schematic) == false) {
    process.exit(1);
  }

  let pageDetails: PageDetailsPromptResponse;
  try {
    pageDetails = await promptPageDetails(args);
  } catch (error) {
    console.log(chalk.red("Failed to get page details."));
    process.exit(1);
  }

  const options: CreateSchematicOptions = {
    title: pageDetails.title,
    description: pageDetails.description,
    category: args.category,
  };

  logger.logInfo(`Generating schematic: ${args.schematic} with options`);
  Object.entries(options).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ?? chalk.italic("not provided")}`);
  });
  console.log("\n");

  try {
    await StuartSchematicGenerator.generate(args.schematic as StuartSchematic, options);
  } catch (error) {
    console.log(chalk.red(`Failed to generate schematic.\n\n${(error as Error).message}`));
    process.exit(1);
  }
}

function validateSchematic(schematic: string | undefined): schematic is StuartSchematic {
  if (availableSchematics.includes(schematic as StuartSchematic)) {
    return true;
  }

  const msg =
    schematic === undefined ? "No schematic provided" : `Invalid schematic: ${schematic}.`;
  console.log(chalk.red(msg));

  const COLUMN_WIDTH = 30;
  console.log(chalk.cyan("\nAvailable schematics:"));
  Object.entries(schematicsList).forEach(([key, schematic]) => {
    const { alias, description } = schematic;

    const usage = `stuart generate ${key}`;
    const paddedUsage = usage.padEnd(COLUMN_WIDTH, " ");
    console.log(`  ${paddedUsage} [alias: ${alias}]  ${description}`);
  });

  return false;
}

function promptOrSkipIfProvided<T>(
  expectedValue: T | undefined,
  message: string,
  required = false
): Promise<T> {
  if (expectedValue !== undefined) {
    return Promise.resolve(expectedValue);
  }
  return inquirer
    .prompt([
      {
        type: "input",
        name: "value",
        required,
        message,
      },
    ])
    .then((answers) => answers.value);
}

async function promptPageDetails(
  args: ArgumentsCamelCase<GenerateCommandArgs>
): Promise<PageDetailsPromptResponse> {
  const pageTitle = await promptOrSkipIfProvided<string>(
    args.title,
    "Enter the title of the new page",
    true
  );
  const pageDescription = await promptOrSkipIfProvided<string>(
    args.description,
    "Enter a description for the new page"
  );

  return {
    title: pageTitle,
    description: pageDescription,
  };
}
