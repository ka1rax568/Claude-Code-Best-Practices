/**
 * Todo Model Tests
 *
 * Testing the core Todo domain model following TDD principles.
 * Each test verifies a specific behavior of the Todo entity.
 */

import { Todo } from "../../src/models/Todo.js";

describe("Todo Model", () => {
  describe("constructor", () => {
    it("should create a todo with title and description", () => {
      const todo = new Todo("Buy groceries", "Milk, eggs, bread");

      expect(todo).toBeDefined();
      expect(todo.id).toBeDefined();
      expect(todo.title).toBe("Buy groceries");
      expect(todo.description).toBe("Milk, eggs, bread");
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
    });

    it("should generate unique IDs for each todo", () => {
      const todo1 = new Todo("Task 1", "Description 1");
      const todo2 = new Todo("Task 2", "Description 2");

      expect(todo1.id).not.toBe(todo2.id);
    });

    it("should set createdAt and updatedAt to current time", () => {
      const before = Date.now();
      const todo = new Todo("Test", "Description");
      const after = Date.now();

      const createdAtTime = new Date(todo.createdAt).getTime();
      expect(createdAtTime).toBeGreaterThanOrEqual(before);
      expect(createdAtTime).toBeLessThanOrEqual(after);
      expect(todo.updatedAt).toBe(todo.createdAt);
    });

    it("should handle empty description", () => {
      const todo = new Todo("Title only", "");

      expect(todo.title).toBe("Title only");
      expect(todo.description).toBe("");
    });

    it("should throw error when title is missing", () => {
      expect(() => new Todo()).toThrow("Title is required");
      expect(() => new Todo(null)).toThrow("Title is required");
      expect(() => new Todo("")).toThrow("Title is required");
    });

    it("should throw error when title exceeds 200 characters", () => {
      const longTitle = "a".repeat(201);
      expect(() => new Todo(longTitle, "Description")).toThrow(
        "Title must be between 1 and 200 characters",
      );
    });

    it("should throw error when description exceeds 1000 characters", () => {
      const longDescription = "a".repeat(1001);
      expect(() => new Todo("Title", longDescription)).toThrow(
        "Description must not exceed 1000 characters",
      );
    });
  });

  describe("complete", () => {
    it("should mark todo as completed", () => {
      const todo = new Todo("Test", "Description");
      expect(todo.completed).toBe(false);

      todo.complete();

      expect(todo.completed).toBe(true);
    });

    it("should update updatedAt when completing", () => {
      const todo = new Todo("Test", "Description");
      const originalUpdatedAt = todo.updatedAt;

      // Wait a tiny bit to ensure time difference
      setTimeout(() => {
        todo.complete();
        expect(todo.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    it("should be idempotent - completing twice should work", () => {
      const todo = new Todo("Test", "Description");

      todo.complete();
      todo.complete();

      expect(todo.completed).toBe(true);
    });
  });

  describe("update", () => {
    it("should update title", () => {
      const todo = new Todo("Original", "Description");

      todo.update({ title: "Updated Title" });

      expect(todo.title).toBe("Updated Title");
      expect(todo.description).toBe("Description");
    });

    it("should update description", () => {
      const todo = new Todo("Title", "Original");

      todo.update({ description: "Updated Description" });

      expect(todo.title).toBe("Title");
      expect(todo.description).toBe("Updated Description");
    });

    it("should update both title and description", () => {
      const todo = new Todo("Original Title", "Original Description");

      todo.update({
        title: "New Title",
        description: "New Description",
      });

      expect(todo.title).toBe("New Title");
      expect(todo.description).toBe("New Description");
    });

    it("should update updatedAt timestamp", () => {
      const todo = new Todo("Title", "Description");
      const originalUpdatedAt = todo.updatedAt;

      setTimeout(() => {
        todo.update({ title: "New Title" });
        expect(todo.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    it("should not update createdAt", () => {
      const todo = new Todo("Title", "Description");
      const originalCreatedAt = todo.createdAt;

      todo.update({ title: "New Title" });

      expect(todo.createdAt).toBe(originalCreatedAt);
    });

    it("should validate title length on update", () => {
      const todo = new Todo("Original", "Description");
      const longTitle = "a".repeat(201);

      expect(() => todo.update({ title: longTitle })).toThrow(
        "Title must be between 1 and 200 characters",
      );
    });

    it("should validate description length on update", () => {
      const todo = new Todo("Title", "Original");
      const longDescription = "a".repeat(1001);

      expect(() => todo.update({ description: longDescription })).toThrow(
        "Description must not exceed 1000 characters",
      );
    });

    it("should not allow empty title on update", () => {
      const todo = new Todo("Original", "Description");

      expect(() => todo.update({ title: "" })).toThrow("Title is required");
    });
  });

  describe("toJSON", () => {
    it("should return plain object representation", () => {
      const todo = new Todo("Test Todo", "Test Description");
      const json = todo.toJSON();

      expect(json).toEqual({
        id: todo.id,
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      });
    });

    it("should include completed status when true", () => {
      const todo = new Todo("Test", "Description");
      todo.complete();

      const json = todo.toJSON();

      expect(json.completed).toBe(true);
    });
  });
});
