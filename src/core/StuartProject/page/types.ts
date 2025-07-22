import { ResourceConfigSection } from "../../../types/resource-config.type";

export interface StuartPageDefinition extends ResourceConfigSection {
  page_name: string;
  page_description: string;
}

export type StuartPageType = "page" | "single" | "archive";

export interface StuartPageFile {
  parentPath: string;
  fileName: string;
  pageType: StuartPageType;
}
