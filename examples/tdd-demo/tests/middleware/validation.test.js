/**
 * Validation Middleware Tests
 *
 * Testing request validation logic.
 */

import {
  validateTodoInput,
  errorHandler,
} from "../../src/middleware/validation.js";

describe("Validation Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.jsonData = data;
      },
    };
    next = () => {
      next.called = true;
    };
    next.called = false;
  });

  describe("validateTodoInput", () => {
    it("should call next when validation passes", () => {
      req.body = { title: "Valid Title", description: "Valid Description" };

      validateTodoInput(req, res, next);

      expect(next.called).toBe(true);
      expect(res.statusCode).toBe(200);
    });

    it("should return 400 when title is empty", () => {
      req.body = { title: "" };

      validateTodoInput(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toEqual({
        error: "Validation Error",
        message: "Title is required",
      });
      expect(next.called).toBe(false);
    });

    it("should return 400 when title is whitespace only", () => {
      req.body = { title: "   " };

      validateTodoInput(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(next.called).toBe(false);
    });

    it("should return 400 when title exceeds 200 characters", () => {
      req.body = { title: "a".repeat(201) };

      validateTodoInput(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toEqual({
        error: "Validation Error",
        message: "Title must be between 1 and 200 characters",
      });
      expect(next.called).toBe(false);
    });

    it("should return 400 when description exceeds 1000 characters", () => {
      req.body = {
        title: "Valid Title",
        description: "a".repeat(1001),
      };

      validateTodoInput(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData).toEqual({
        error: "Validation Error",
        message: "Description must not exceed 1000 characters",
      });
      expect(next.called).toBe(false);
    });

    it("should allow undefined title when updating", () => {
      req.body = { description: "Just updating description" };

      validateTodoInput(req, res, next);

      expect(next.called).toBe(true);
      expect(res.statusCode).toBe(200);
    });

    it("should allow undefined description", () => {
      req.body = { title: "Title only" };

      validateTodoInput(req, res, next);

      expect(next.called).toBe(true);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("errorHandler", () => {
    it("should return error response with status code", () => {
      const error = new Error("Test error");
      error.statusCode = 404;
      error.name = "NotFoundError";

      errorHandler(error, req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res.jsonData).toEqual({
        error: "NotFoundError",
        message: "Test error",
      });
    });

    it("should default to 500 status code", () => {
      const error = new Error("Internal error");

      errorHandler(error, req, res, next);

      expect(res.statusCode).toBe(500);
    });

    it("should use default error name and message", () => {
      const error = {};

      errorHandler(error, req, res, next);

      expect(res.jsonData).toEqual({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      });
    });
  });
});
