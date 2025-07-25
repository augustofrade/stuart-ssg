import fs from "fs/promises";
import { ResourceConfig } from "../types/resource-config.type";

export default class ConfigFile {
  private constructor() {}

  public static async read(filePath: string): Promise<ResourceConfig> {
    const data = await fs.readFile(filePath, "utf-8");
    return this.parse(data);
  }

  public static parse(content: string): ResourceConfig {
    const data = content.split("\n");
    const config: Record<string, Record<string, string | number | boolean>> = {};
    let currentSection = "";

    for (let line of data) {
      line = line.trim();

      if (line === "" || line.startsWith("#")) continue;

      if (line.startsWith("[")) {
        const section = new RegExp(/\[([a-z_]+)\]/i).exec(line);
        if (section != null) {
          currentSection = section.slice(1)[0].toLowerCase();
          if (config[currentSection] === undefined) config[currentSection] = {};
        }
      }

      let lineMatches = new RegExp(/^([a-z_]+)[=\s]?(.*)/).exec(line);
      if (lineMatches === null) continue;

      let [key, value] = lineMatches.slice(1) as [string, any];
      key = key.trim();
      value = value.trim();

      if (value === "" || value === "true") value = true;
      else if (value === "false") value = false;
      else if (!isNaN(value)) value = Number(value);

      config[currentSection][key] = value;
    }

    return config as ResourceConfig;
  }

  public static async write(filePath: string, config: ResourceConfig): Promise<void> {
    const lines: Array<string> = [];

    Object.entries(config).forEach(([section, data]) => {
      lines.push("\n[" + section.toUpperCase() + "]");

      Object.entries(data).forEach(([key, value]) => {
        lines.push(key + "=" + value);
      });
    });

    await fs.writeFile(filePath, lines.join("\n").slice(1), "utf-8");
  }
}
