import fs from "fs/promises";
import { join } from "path";
import replaceAll from "../../../../helpers/replace-all";
import slugify from "../../../../helpers/slugify";
import BobLogger from "../../../BobLogger";
import { StuartGenerateDefinition, StuartGenerateOptions, StuartSchematic } from "../types";

export default abstract class BaseSchematicGenerator {
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
    const schematicDir = join(BaseSchematicGenerator.SCHEMATICS_DIR, this.type + ".md");
    let template = await fs.readFile(schematicDir, "utf8");
    template = replaceAll(template, replaceValues);
    return template;
  }

  protected abstract verifyCategory(category: string | undefined): Promise<void>;
}
