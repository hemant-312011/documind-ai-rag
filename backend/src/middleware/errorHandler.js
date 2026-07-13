import multer from "multer";

export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

export function errorHandler(error, request, response, next) {
  console.error(error);

  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      response.status(400).json({
        success: false,
        message: "Each PDF must be smaller than 10 MB.",
      });

      return;
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      response.status(400).json({
        success: false,
        message: "You can upload a maximum of 5 PDFs at one time.",
      });

      return;
    }

    response.status(400).json({
      success: false,
      message: error.message,
    });

    return;
  }

  response.status(error.statusCode ?? 500).json({
    success: false,
    message: error.message ?? "Internal server error.",
  });
}
