export type StuartSchematic = "page" | "archive" | "single";

export interface StuartSchematicDetails {
  alias: string;
  description: string;
}

export type StuartSchematicCollection = Record<StuartSchematic, StuartSchematicDetails>;

export type CreateSchematicOptions = {
  title?: string;
  description?: string;
  category?: string;
};
