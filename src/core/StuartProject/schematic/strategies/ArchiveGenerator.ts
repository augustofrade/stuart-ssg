import fs from "fs/promises";
import { join } from "path";
import StuartProject from "../..";
import getArgvString from "../../../../helpers/get-argv-string";
import { StuartGenerateDefinition, StuartSchematic } from "../types";
import StuartBaseGenerator from "./StuartBaseGenerator";

export default class ArchiveGenerator extends StuartBaseGenerator {
  protected type: StuartSchematic = "archive";

  public async handle(definition: StuartGenerateDefinition): Promise<string> {
    await this.verifyCategory(definition.category);

    const newCategoryName = this.slugify(definition.title);
    const filePath = join(definition.category ?? "", newCategoryName, "index.md");
    await this.verifyPageExists(filePath);

    const template = await this.handleSchematicContent({
      page_title: definition.title.toUpperCase(),
      page_description: definition.description ?? "No description provided",
      page_category: newCategoryName,
      generation_command: getArgvString(),
    });

    let dir = join("pages", filePath);

    const newCategoryProjectPath = join(definition.category ?? "", newCategoryName);
    // TODO: make a better way to handle directories as this wont handle nested directories
    if (!(await StuartProject.Instance.getCategories()).includes(newCategoryProjectPath)) {
      await fs.mkdir(join(StuartProject.Instance.paths.pages, newCategoryProjectPath), {
        recursive: true,
      });
    }

    dir = join(StuartProject.Instance.paths.root, dir);
    await fs.writeFile(dir, template, "utf8");

    return filePath;
  }
}
