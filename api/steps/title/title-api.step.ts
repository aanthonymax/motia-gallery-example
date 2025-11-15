import type { ApiRouteConfig, Handlers } from "motia";
import { readFile } from "fs/promises";
import { join } from "path";

export const config: ApiRouteConfig = {
  name: "TitleAPI",
  type: "api",
  path: "/title",
  method: "GET",
  description: "Returns title HTML component",
  emits: [],
  flows: ["gallery-flow"],
  includeFiles: ["../../components/GET/title.html"],
};

export const handler: Handlers["TitleAPI"] = async (req, { logger }) => {
  try {
    const titlePath = join(__dirname, "../../components/GET/title.html");
    const htmlContent = await readFile(titlePath, "utf-8");

    logger.info("Title component requested");

    return {
      status: 200,
      body: htmlContent,
    };
  } catch (error) {
    logger.error("Failed to read title component", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      status: 500,
      body: "Internal server error",
    };
  }
};
