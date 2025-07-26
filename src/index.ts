#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import buildCommand from "./commands/build.command";
import generateCommand from "./commands/generate.command";
import newCommand from "./commands/new.command";

yargs(hideBin(process.argv))
  .scriptName("stuart")
  .usage("Usage: $0 <command> [options]")
  .command(
    "new [project_name] [directory]",
    "Create a new project",
    (yargs) => {
      return yargs
        .positional("project_name", {
          describe: "Name of the new project",
          type: "string",
        })
        .option("directory", {
          alias: "d",
          describe: "Directory to create the project in. Defaults to current directory.",
          type: "string",
        })
        .option("blueprint", {
          alias: "b",
          describe: "Blueprint to be used to create the new project",
          type: "string",
          default: "default",
        })
        .option("theme", {
          alias: "t",
          describe: "Theme to be set on the new project",
          type: "string",
          default: "stuart",
        });
    },
    newCommand
  )
  .command(
    "build [project_directory]",
    "Build a Stuart project",
    (yargs) => {
      return yargs
        .positional("project_directory", {
          describe: "Directory of the project to build. Defaults to current directory.",
          type: "string",
        })
        .option("output", {
          alias: "o",
          describe: "Output directory for the build files. Defaults to 'dist'.",
          type: "string",
        });
    },
    buildCommand
  )
  .command({
    command: "generate [schematic] [title]",
    aliases: ["g"],
    describe: "Generates a new Stuart file based on a schematic",
    builder: (yargs) => {
      return yargs
        .positional("schematic", {
          describe: "The schematic to use for generation",
          type: "string",
        })
        .positional("title", {
          describe:
            "The title of the file to generate. If not provided, an interactive prompt will be shown.",
          type: "string",
        })
        .option("description", {
          alias: "d",
          describe: "A description for the generated file",
          type: "string",
        })
        .option("category", {
          alias: "c",
          describe:
            "The category of the generated file (e.g., 'blog', 'portfolio'). This will determine the directory structure.\n" +
            "If not provided, the default category will be used, meaning that the page will be saved in the root pages folder.",
          type: "string",
        });
    },
    handler: generateCommand,
  })
  .version(true)
  .help(true).argv;

// stu generate page "Awesome Page" --description "This is an awesome page" --dir website
