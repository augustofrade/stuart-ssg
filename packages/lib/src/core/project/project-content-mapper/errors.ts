import { Files } from "../../files";

export class ConflictingContentTypeMismatchError extends Error {
  constructor(directory: string) {
    super(
      `Conflicting ${Files.CATEGORY_ROOT} and ${Files.PAGE} definitions found in ${directory}.\nA Project Content can only be either a Page or a Category.`
    );
    this.name = "ConflictingContentTypeMismatchError";
  }
}
