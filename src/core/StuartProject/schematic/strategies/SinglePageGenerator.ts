import fs from "fs/promises";
import { join } from "path";
import StuartProject from "../..";
import getArgvString from "../../../../helpers/get-argv-string";
import { StuartGenerateDefinition, StuartSchematic } from "../types";
import StuartBaseGenerator from "./StuartBaseGenerator";

export default class SinglePageGenerator extends StuartBaseGenerator {
  protected type: StuartSchematic = "single";

  public async handle(definition: StuartGenerateDefinition): Promise<string> {
    await this.verifyCategory(definition.category, true);
    const category = definition.category!.replace(/-\//g, " ").toLocaleUpperCase();

    const template = await this.handleSchematicContent({
      page_title: definition.title.toUpperCase(),
      page_description: definition.description ?? "Made with Stuart",
      page_category: category,
      generation_command: getArgvString(),
    });

    const filename = this.slugify(definition.title);
    const filePath = join(
      StuartProject.Instance.paths.pages,
      definition.category ?? "",
      filename + ".md"
    );

    await fs.writeFile(filePath, template, "utf8");
    return filePath;
  }
}
