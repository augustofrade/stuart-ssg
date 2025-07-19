import yargs from "yargs";
import { hideBin } from "yargs/helpers";
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
        .positional("directory", {
          describe: "Directory to create the project in. Defaults to current directory.",
          type: "string",
        });
    },
    newCommand
  )
  .version(true)
  .help(true).argv;
