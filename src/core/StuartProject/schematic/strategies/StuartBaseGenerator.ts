import fs from "fs/promises";
import { join } from "path";
import StuartProject from "../..";
import replaceAll from "../../../../helpers/replace-all";
import slugify from "../../../../helpers/slugify";
import BobLogger from "../../../BobLogger";
import { StuartGenerateDefinition, StuartGenerateOptions, StuartSchematic } from "../types";

export default abstract class StuartBaseGenerator {
  protected readonly logger = BobLogger.Instance;
  protected abstract type: StuartSchematic;

  public constructor(protected readonly options: StuartGenerateOptions) {}

  protected static readonly SCHEMATICS_DIR = join(
    __dirname,
    "../../../../../stuart-data/schematics"
  );

  public abstract handle(definition: StuartGenerateDefinition): Promise<string>;

  protected readonly slugify = slugify;

  protected async handleSchematicContent(replaceValues: Record<string, any>) {
    const schematicDir = join(StuartBaseGenerator.SCHEMATICS_DIR, this.type + ".md");
    let template = await fs.readFile(schematicDir, "utf8");
    template = replaceAll(template, replaceValues);
    return template;
  }

  protected async verifyPageExists(pagePath: string): Promise<void> {
    if (this.options.force) return;

    const fullPath = join(StuartProject.Instance.paths.pages, pagePath);
    this.logger.logDebug(`Looking for page: ${pagePath}`);

    try {
      await fs.stat(fullPath);
      throw new Error(`Page already exists: ${pagePath}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  protected async verifyCategory(
    category: string | undefined,
    required: boolean = false
  ): Promise<void> {
    if (!category) {
      if (required) {
        throw new Error("Category is required. Please provide a valid category for the page.");
      }
      return;
    }

    const categories = await StuartProject.Instance.getCategories();
    if (!categories.includes(category)) {
      throw new Error(
        `Invalid category: ${category}.\nAvailable categories: ${categories.join(", ")}`
      );
    }
  }
}
