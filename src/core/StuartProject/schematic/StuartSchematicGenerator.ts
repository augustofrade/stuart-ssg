import fs from "fs/promises";
import { join } from "path";
import StuartProject from "..";
import getArgvString from "../../../helpers/get-argv-string";
import slugify from "../../../helpers/slugify";
import BobLogger from "../../BobLogger";
import StuartProjectManager from "../StuartProjectManager";
import { availableSchematics } from "./schematics-list";
import { CreateSchematicOptions, StuartSchematic } from "./types";

export default class StuartSchematicGenerator {
  private static readonly logger = BobLogger.Instance;
  private static readonly SCHEMATICS_DIR = join(__dirname, "../../../../stuart-data/schematics");

  public static async generate(
    schematic: StuartSchematic,
    options: CreateSchematicOptions
  ): Promise<string> {
    if (availableSchematics.includes(schematic) === false) {
      throw new Error("Invalid schematic.");
    }

    const handlers: Record<StuartSchematic, (options: CreateSchematicOptions) => Promise<string>> =
      {
        page: this.handlePageSchematic,
        archive: this.handlePageSchematic,
        single: this.handlePageSchematic,
      };

    return handlers[schematic](options);
  }

  private static async handlePageSchematic(options: CreateSchematicOptions): Promise<string> {
    await StuartSchematicGenerator.verifyCategory(options.category);

    const template = await StuartSchematicGenerator.handleSchematicContent("page", options);

    const filename = slugify(options.title);
    const pagePath = join("pages", options.category ?? "", filename + ".md");

    await fs.writeFile(join(StuartProject.Instance.projectDirectory, pagePath), template, "utf8");
    return pagePath;
  }

  private static async handleSchematicContent(
    schematic: StuartSchematic,
    options: CreateSchematicOptions
  ) {
    const schematicDir = join(StuartSchematicGenerator.SCHEMATICS_DIR, schematic + ".md");
    let template = await fs.readFile(schematicDir, "utf8");
    template = template
      .replace(new RegExp("%PAGE_TITLE%", "g"), options.title)
      .replace(
        new RegExp("%PAGE_DESCRIPTION%", "g"),
        options.description ?? "No description provided"
      )
      .replace(new RegExp("%COMMAND%", "g"), getArgvString());

    return template;
  }

  private static async verifyCategory(category: string | undefined): Promise<void> {
    if (!category) {
      return;
    }

    const categories = await StuartProjectManager.getCategories();
    if (!categories.includes(category)) {
      throw new Error(
        `Invalid category: ${category}.\nAvailable categories: ${categories.join(", ")}`
      );
    }
  }
}
