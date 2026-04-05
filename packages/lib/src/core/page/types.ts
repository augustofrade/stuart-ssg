export interface PageFrontmatterRequiredKeys {
  title: string;
  date: Date;
  author: string;
  description: string;
}

export interface PageFrontmatter extends PageFrontmatterRequiredKeys {}
