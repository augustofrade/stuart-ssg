import fs from "fs/promises";
import { join } from "path";
import StuartProject from "../..";
import getArgvString from "../../../../helpers/get-argv-string";
import StuartProjectManager from "../../StuartProjectManager";
import { StuartGenerateDefinition, StuartSchematic } from "../types";
import BaseSchematicGenerator from "./BaseSchematicGenerator";

export default class ArchiveSchematicGenerator extends BaseSchematicGenerator {
  protected type: StuartSchematic = "archive";

  public async handle(definition: StuartGenerateDefinition): Promise<string> {
    await this.verifyCategory(definition.category);

    const newCategoryName = this.slugify(definition.title);
    this.logger.logDebug(`Looking for page in category: ${newCategoryName}`);

    const template = await this.handleSchematicContent({
      page_title: definition.title.toUpperCase(),
      page_description: definition.description ?? "No description provided",
      page_category: newCategoryName,
      generation_command: getArgvString(),
    });

    let dir = join("pages", definition.category ?? "", newCategoryName);
    const fullPath = join(StuartProject.Instance.projectDirectory, dir);

    await fs.mkdir(fullPath, { recursive: true });

    const filePath = join(dir, "index.md");
    dir = join(StuartProject.Instance.projectDirectory, filePath);
    await fs.writeFile(dir, template, "utf8");

    return filePath;
  }

  protected async verifyCategory(category: string | undefined): Promise<void> {
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
