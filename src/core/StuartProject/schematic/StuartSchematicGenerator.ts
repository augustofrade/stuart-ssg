import { availableSchematics } from "./schematics-list";
import ArchiveSchematicGenerator from "./strategies/ArchiveSchematicGenerator";
import PageSchematicGenerator from "./strategies/PageSchematicGenerator";
import { StuartGenerateDefinition, StuartGenerateOptions, StuartSchematic } from "./types";

export default class StuartSchematicGenerator {
  public static generate(
    schematic: StuartSchematic,
    definition: StuartGenerateDefinition,
    options: StuartGenerateOptions
  ): Promise<string> {
    if (availableSchematics.includes(schematic) === false) {
      throw new Error("Invalid schematic.");
    }

    if (schematic === "archive") {
      return new ArchiveSchematicGenerator(options).handle(definition);
    }

    return new PageSchematicGenerator(options).handle(definition);
  }
}
