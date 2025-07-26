import { StuartSchematic, StuartSchematicCollection } from "./types";

const schematicsList: StuartSchematicCollection = Object.freeze({
  page: {
    alias: "p",
    description: "Generates a new page",
  },
  archive: {
    alias: "a",
    description:
      "Generates a new archive page. Archives can be used to list multiple single pages, such as blog posts or portfolio items.",
  },
  single: {
    alias: "s",
    description: "Generates a new single page to be used in an archive.",
  },
});

export const availableSchematics = Object.keys(schematicsList) as Array<StuartSchematic>;

export default schematicsList;
