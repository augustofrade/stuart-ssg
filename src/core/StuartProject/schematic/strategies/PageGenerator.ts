import fs from "fs/promises";
import { join } from "path";
import StuartProject from "../..";
import getArgvString from "../../../../helpers/get-argv-string";
import { StuartGenerateDefinition, StuartSchematic } from "../types";
import StuartBaseGenerator from "./StuartBaseGenerator";

export default class PageGenerator extends StuartBaseGenerator {
  protected type: StuartSchematic = "page";

  public async handle(definition: StuartGenerateDefinition): Promise<string> {
    await this.verifyCategory(definition.category);

    const template = await this.handleSchematicContent({
      page_title: definition.title.toUpperCase(),
      page_description: definition.description ?? "No description provided",
      page_category: this.slugify(definition.category ?? ""),
      generation_command: getArgvString(),
    });

    const filename = this.slugify(definition.title);
    const filePath = join("pages", definition.category ?? "", filename + ".md");

    await fs.writeFile(join(StuartProject.Instance.projectDirectory, filePath), template, "utf8");
    return filePath;
  }
}
