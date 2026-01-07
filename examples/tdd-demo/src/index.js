/**
 * Todo API Application
 *
 * Express application setup and configuration.
 */

import express from "express";
import { TodoService } from "./services/todoService.js";
import { createTodoRoutes } from "./routes/todoRoutes.js";
import { errorHandler } from "./middleware/validation.js";

/**
 * Creates and configures a new Express app instance
 * @returns {express.Application} Configured Express app
 */
export function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());

  // Create service instance
  const todoService = new TodoService();

  // Routes
  app.use("/todos", createTodoRoutes(todoService));

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  // Error handling
  app.use(errorHandler);

  return app;
}

// Create app instance for export
export const app = createApp();

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Todo API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}
