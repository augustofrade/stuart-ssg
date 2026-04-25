import { Token } from "./token";

export class InvalidQueryError extends Error {
  constructor(part: string, currentContext: string, fullQuery: string, expectedType = "undefined") {
    super(
      `Cannot access '${part}' property on '${currentContext}' in query '${fullQuery}'. Expected Record, found ${expectedType}`
    );
    this.name = "InvalidQueryError";
  }
}

export class IllegalOutOfScopeAccess extends Error {
  constructor(foundScopedPath: string) {
    super(
      `Illegal out of scope access found in value '${foundScopedPath}'. If you need to reference static project-wide paths, use the root path prefix '${Token.prefixes.rootPath}'`
    );
    this.name = "IllegalOutOfScopeAccess";
  }
}

export class IllegalOutOfProjectScopeAccess extends Error {
  constructor(foundScopedPath: string) {
    super(
      `Illegal out of project scope access found in value '${foundScopedPath}'. Contents may not reference paths outside of the Stuart Project directory`
    );
    this.name = "IllegalOutOfProjectScopeAccess";
  }
}

export class InvalidContentInterpolationPipe extends Error {
  constructor(pipe: string, interpolationValue: string) {
    super(`Invalid '${pipe}' pipe found in '{ ${interpolationValue} }'`);
    this.name = "InvalidContentInterpolationPipe";
  }
}
