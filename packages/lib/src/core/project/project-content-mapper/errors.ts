import { Directories } from "../../directories";
import { Files } from "../../files";

export class ConflictingContentTypeMismatchError extends Error {
  constructor(directory: string) {
    super(
      `Conflicting ${Files.CATEGORY_ROOT} and ${Files.PAGE} definitions found in '${directory}'.\nA Project Content can only be either a Page or a Category.`
    );
    this.name = "ConflictingContentTypeMismatchError";
  }
}

export class IllegalContentTreeRootStaticContent extends Error {
  constructor(illegalDirentPath: string) {
    super(
      `Illegal static content found in Project Content Root: '${illegalDirentPath}'.\nStatic content must be placed inside the '${Directories.STATIC}' directory of a Stuart Project`
    );
    this.name = "IllegalContentTreeRootStaticContent";
  }
}
