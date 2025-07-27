import { availableSchematics } from "./schematics-list";
import ArchiveGenerator from "./strategies/ArchiveGenerator";
import PageGenerator from "./strategies/PageGenerator";
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
      return new ArchiveGenerator(options).handle(definition);
    }

    return new PageGenerator(options).handle(definition);
  }
}
