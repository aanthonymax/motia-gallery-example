import type { ApiRouteConfig, Handlers } from "motia";

export const config: ApiRouteConfig = {
  name: "ImagesAPI",
  type: "api",
  path: "/images",
  method: "POST",
  description: "Returns paginated gallery images as HTML",
  emits: [],
  flows: ["gallery-flow"],
};

const imagePaths = [
  "http://localhost:3000/images/img1.jpg",
  "http://localhost:3000/images/img2.jpg",
  "http://localhost:3000/images/img3.jpg",
  "http://localhost:3000/images/img4.jpg",
  "http://localhost:3000/images/img5.jpg",
  "http://localhost:3000/images/img6.jpg",
  "http://localhost:3000/images/img7.jpg",
  "http://localhost:3000/images/img8.jpg",
  "http://localhost:3000/images/img9.jpg",
  "http://localhost:3000/images/img10.jpg",
];

export const handler: Handlers["ImagesAPI"] = async (req, { logger }) => {
  try {
    const body = req.body as { page?: number | string };
    let page: number;

    // Parse page number
    if (typeof body.page === "string") {
      page = parseInt(body.page, 10);
    } else if (typeof body.page === "number") {
      page = body.page;
    } else {
      logger.warn("Invalid page number in request", { body: req.body });
      return {
        status: 400,
        body: "Page number error",
      };
    }

    if (isNaN(page) || page < 1) {
      logger.warn("Invalid page number in request", { body: req.body });
      return {
        status: 400,
        body: "Page number error",
      };
    }

    const itemsPerPage = 5;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (startIndex >= imagePaths.length || page < 1) {
      logger.warn("Page not found", { page, totalImages: imagePaths.length });
      return {
        status: 404,
        body: "Page not found",
      };
    }

    const imagesForPage = imagePaths.slice(startIndex, endIndex);
    const htmlResponse = imagesForPage
      .map((img, index) => `<img src="${img}" alt="Image${index}"/>`)
      .join("\n");

    logger.info("Images page requested", {
      page,
      imagesCount: imagesForPage.length,
    });

    return {
      status: 200,
      body: htmlResponse,
    };
  } catch (error) {
    logger.error("Failed to process images request", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      status: 500,
      body: "Internal server error",
    };
  }
};
