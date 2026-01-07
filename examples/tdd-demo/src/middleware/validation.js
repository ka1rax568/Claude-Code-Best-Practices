/**
 * Validation Middleware
 *
 * Request validation for todo endpoints.
 */

/**
 * Validates todo creation/update request body
 */
export function validateTodoInput(req, res, next) {
  const { title, description } = req.body;

  try {
    // Title validation
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Title is required",
        });
      }

      if (title.length > 200) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Title must be between 1 and 200 characters",
        });
      }
    }

    // Description validation
    if (description !== undefined && description.length > 1000) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Description must not exceed 1000 characters",
      });
    }

    next();
  } catch (error) {
    res.status(400).json({
      error: "Validation Error",
      message: error.message,
    });
  }
}

/**
 * Error handler middleware
 */
export function errorHandler(err, req, res, _next) {
  console.error(err);

  res.status(err.statusCode || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred",
  });
}
