import { ResourceConfigSection } from "../../../types/resource-config.type";

export interface StuartPageDefinition extends ResourceConfigSection {
  page_name: string;
  page_description: string;
}

export type StuartPageType = "page" | "single" | "archive";

// TODO: remove this redundant interface
export interface StuartPageFile {
  parentPath: string;
  fileName: string;
  pageType: StuartPageType;
}
