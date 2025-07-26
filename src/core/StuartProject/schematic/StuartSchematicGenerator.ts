import BobLogger from "../../BobLogger";
import StuartProjectManager from "../StuartProjectManager";
import { availableSchematics } from "./schematics-list";
import { CreateSchematicOptions, StuartSchematic } from "./types";

export default class StuartSchematicGenerator {
  private static readonly logger = BobLogger.Instance;

  public static async generate(schematic: StuartSchematic, options: CreateSchematicOptions) {
    if (availableSchematics.includes(schematic) === false) {
      throw new Error("Invalid schematic.");
    }

    const handlers: Record<StuartSchematic, (options: CreateSchematicOptions) => Promise<void>> = {
      page: this.handlePageSchematic,
      archive: this.handlePageSchematic,
      single: this.handlePageSchematic,
    };

    await handlers[schematic](options);
  }

  private static async handlePageSchematic(options: CreateSchematicOptions) {
    await StuartSchematicGenerator.verifyCategory(options.category);
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
