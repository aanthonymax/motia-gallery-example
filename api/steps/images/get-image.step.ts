import type { ApiRouteConfig, Handlers } from "motia";
import { readFile } from "fs/promises";
import { join } from "path";

export const config: ApiRouteConfig = {
  name: "GetImage",
  type: "api",
  path: "/images/:filename",
  method: "GET",
  description: "Serves image files",
  emits: [],
  flows: ["gallery-flow"],
  includeFiles: [
    "../../images/img1.jpg",
    "../../images/img2.jpg",
    "../../images/img3.jpg",
    "../../images/img4.jpg",
    "../../images/img5.jpg",
    "../../images/img6.jpg",
    "../../images/img7.jpg",
    "../../images/img8.jpg",
    "../../images/img9.jpg",
    "../../images/img10.jpg",
  ],
};

export const handler: Handlers["GetImage"] = async (req, { logger }) => {
  try {
    const { filename } = req.pathParams;

    // Security: Only allow image files
    if (!filename.match(/^img\d+\.jpg$/)) {
      logger.warn("Invalid filename requested", { filename });
      return {
        status: 404,
        body: "File not found",
      };
    }

    const imagePath = join(__dirname, "../../images", filename);

    try {
      const imageBuffer = await readFile(imagePath);

      logger.info("Image served", { filename });

      // Return image as binary data
      return {
        status: 200,
        body: imageBuffer,
        headers: {
          "Content-Type": "image/jpeg",
        },
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        logger.warn("Image file not found", { filename, path: imagePath });
        return {
          status: 404,
          body: "File not found",
        };
      }
      throw error;
    }
  } catch (error) {
    logger.error("Failed to serve image", {
      error: error instanceof Error ? error.message : String(error),
      filename: req.pathParams.filename,
    });
    return {
      status: 500,
      body: "Internal server error",
    };
  }
};
