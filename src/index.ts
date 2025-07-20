#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import buildCommand from "./commands/build.command";
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
          default: "dist",
        });
    },
    buildCommand
  )
  .version(true)
  .help(true).argv;
