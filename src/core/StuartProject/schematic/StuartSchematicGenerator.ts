import fs from "fs/promises";
import { join } from "path";
import StuartProject from "..";
import getArgvString from "../../../helpers/get-argv-string";
import replaceAll from "../../../helpers/replace-all";
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
        archive: this.handleArchiveSchematic,
        single: this.handlePageSchematic,
      };

    return handlers[schematic](options);
  }

  private static async handlePageSchematic(options: CreateSchematicOptions): Promise<string> {
    await StuartSchematicGenerator.verifyCategory(options.category);

    const template = await StuartSchematicGenerator.handleSchematicContent("page", options);

    const filename = slugify(options.title);
    const filePath = join("pages", options.category ?? "", filename + ".md");

    await fs.writeFile(join(StuartProject.Instance.projectDirectory, filePath), template, "utf8");
    return filePath;
  }

  private static async handleArchiveSchematic(options: CreateSchematicOptions): Promise<string> {
    await StuartSchematicGenerator.verifyCategory(options.category);
    const newCategoryName = slugify(options.title);

    const template = await StuartSchematicGenerator.handleSchematicContent("archive", {
      page_title: options.title.toUpperCase(),
      page_description: options.description ?? "No description provided",
      page_type: "archive",
      page_category: newCategoryName,
      generation_command: getArgvString(),
    });

    let dir = join("pages", options.category ?? "", newCategoryName);
    const fullPath = join(StuartProject.Instance.projectDirectory, dir);

    await fs.mkdir(fullPath, { recursive: true });

    const filePath = join(dir, "index.md");
    dir = join(StuartProject.Instance.projectDirectory, filePath);
    await fs.writeFile(dir, template, "utf8");

    return filePath;
  }

  private static async handleSchematicContent(
    schematic: StuartSchematic,
    replaceValues: Record<string, any>
  ) {
    const schematicDir = join(StuartSchematicGenerator.SCHEMATICS_DIR, schematic + ".md");
    let template = await fs.readFile(schematicDir, "utf8");
    template = replaceAll(template, replaceValues);
    return template;
  }

  private static async verifyCategory(category: string | undefined): Promise<void> {
    if (!category) {
      return;
    }

    // TODO: return boolean and throw errors on caller side
    const categories = await StuartProjectManager.getCategories();
    if (!categories.includes(category)) {
      throw new Error(
        `Invalid category: ${category}.\nAvailable categories: ${categories.join(", ")}`
      );
    }
  }
}
