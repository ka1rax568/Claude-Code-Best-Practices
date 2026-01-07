/**
 * Todo Routes
 *
 * Express router handling all todo-related endpoints.
 */

import express from "express";
import { validateTodoInput } from "../middleware/validation.js";

export function createTodoRoutes(todoService) {
  const router = express.Router();

  /**
   * POST /todos
   * Create a new todo
   */
  router.post("/", validateTodoInput, (req, res, next) => {
    try {
      const { title, description = "" } = req.body;

      if (!title) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Title is required",
        });
      }

      const todo = todoService.createTodo(title, description);
      res.status(201).json(todo.toJSON());
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /todos
   * Get all todos
   */
  router.get("/", (req, res, next) => {
    try {
      const todos = todoService.getAllTodos();
      res.json(todos.map((todo) => todo.toJSON()));
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /todos/stats
   * Get todo statistics
   * Note: This must come before /:id route to avoid matching "stats" as an ID
   */
  router.get("/stats", (req, res, next) => {
    try {
      const stats = todoService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /todos/:id
   * Get a specific todo by ID
   */
  router.get("/:id", (req, res, next) => {
    try {
      const { id } = req.params;
      const todo = todoService.getTodoById(id);

      if (!todo) {
        return res.status(404).json({
          error: "Not Found",
          message: `Todo with id ${id} not found`,
        });
      }

      res.json(todo.toJSON());
    } catch (error) {
      next(error);
    }
  });

  /**
   * PUT /todos/:id
   * Update a todo
   */
  router.put("/:id", validateTodoInput, (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const updates = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;

      const todo = todoService.updateTodo(id, updates);

      if (!todo) {
        return res.status(404).json({
          error: "Not Found",
          message: `Todo with id ${id} not found`,
        });
      }

      res.json(todo.toJSON());
    } catch (error) {
      next(error);
    }
  });

  /**
   * DELETE /todos/:id
   * Delete a todo
   */
  router.delete("/:id", (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = todoService.deleteTodo(id);

      if (!deleted) {
        return res.status(404).json({
          error: "Not Found",
          message: `Todo with id ${id} not found`,
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  /**
   * PATCH /todos/:id/complete
   * Mark a todo as completed
   */
  router.patch("/:id/complete", (req, res, next) => {
    try {
      const { id } = req.params;
      const todo = todoService.completeTodo(id);

      if (!todo) {
        return res.status(404).json({
          error: "Not Found",
          message: `Todo with id ${id} not found`,
        });
      }

      res.json(todo.toJSON());
    } catch (error) {
      next(error);
    }
  });

  return router;
}
