/**
 * TodoService Tests
 *
 * Testing the business logic layer for todo operations.
 * Demonstrates TDD with service layer testing.
 */

import { TodoService } from "../../src/services/todoService.js";
import { Todo } from "../../src/models/Todo.js";

describe("TodoService", () => {
  let service;

  beforeEach(() => {
    service = new TodoService();
  });

  describe("createTodo", () => {
    it("should create and store a new todo", () => {
      const todo = service.createTodo("Buy milk", "From the store");

      expect(todo).toBeInstanceOf(Todo);
      expect(todo.id).toBeDefined();
      expect(todo.title).toBe("Buy milk");
      expect(todo.description).toBe("From the store");
    });

    it("should store created todo in memory", () => {
      const todo = service.createTodo("Test", "Description");

      const retrieved = service.getTodoById(todo.id);
      expect(retrieved).toBe(todo);
    });

    it("should throw error when title is missing", () => {
      expect(() => service.createTodo()).toThrow("Title is required");
    });
  });

  describe("getAllTodos", () => {
    it("should return empty array when no todos exist", () => {
      const todos = service.getAllTodos();

      expect(todos).toEqual([]);
    });

    it("should return all created todos", () => {
      const todo1 = service.createTodo("Task 1", "Description 1");
      const todo2 = service.createTodo("Task 2", "Description 2");
      const todo3 = service.createTodo("Task 3", "Description 3");

      const todos = service.getAllTodos();

      expect(todos).toHaveLength(3);
      expect(todos).toContain(todo1);
      expect(todos).toContain(todo2);
      expect(todos).toContain(todo3);
    });

    it("should return todos in creation order", () => {
      const todo1 = service.createTodo("First", "Description");
      const todo2 = service.createTodo("Second", "Description");
      const todo3 = service.createTodo("Third", "Description");

      const todos = service.getAllTodos();

      expect(todos[0]).toBe(todo1);
      expect(todos[1]).toBe(todo2);
      expect(todos[2]).toBe(todo3);
    });
  });

  describe("getTodoById", () => {
    it("should return todo when it exists", () => {
      const created = service.createTodo("Test", "Description");

      const found = service.getTodoById(created.id);

      expect(found).toBe(created);
    });

    it("should return null when todo does not exist", () => {
      const found = service.getTodoById("nonexistent-id");

      expect(found).toBeNull();
    });

    it("should return null when id is null or undefined", () => {
      expect(service.getTodoById(null)).toBeNull();
      expect(service.getTodoById(undefined)).toBeNull();
    });
  });

  describe("updateTodo", () => {
    it("should update todo title", () => {
      const todo = service.createTodo("Original", "Description");

      const updated = service.updateTodo(todo.id, { title: "Updated" });

      expect(updated.title).toBe("Updated");
      expect(updated.description).toBe("Description");
    });

    it("should update todo description", () => {
      const todo = service.createTodo("Title", "Original");

      const updated = service.updateTodo(todo.id, {
        description: "Updated",
      });

      expect(updated.title).toBe("Title");
      expect(updated.description).toBe("Updated");
    });

    it("should update both title and description", () => {
      const todo = service.createTodo("Old Title", "Old Description");

      const updated = service.updateTodo(todo.id, {
        title: "New Title",
        description: "New Description",
      });

      expect(updated.title).toBe("New Title");
      expect(updated.description).toBe("New Description");
    });

    it("should return null when todo does not exist", () => {
      const result = service.updateTodo("nonexistent-id", {
        title: "Test",
      });

      expect(result).toBeNull();
    });

    it("should throw error when update validation fails", () => {
      const todo = service.createTodo("Title", "Description");
      const longTitle = "a".repeat(201);

      expect(() => service.updateTodo(todo.id, { title: longTitle })).toThrow();
    });
  });

  describe("deleteTodo", () => {
    it("should delete todo and return true", () => {
      const todo = service.createTodo("To Delete", "Description");

      const result = service.deleteTodo(todo.id);

      expect(result).toBe(true);
      expect(service.getTodoById(todo.id)).toBeNull();
    });

    it("should return false when todo does not exist", () => {
      const result = service.deleteTodo("nonexistent-id");

      expect(result).toBe(false);
    });

    it("should not affect other todos", () => {
      const todo1 = service.createTodo("Task 1", "Description");
      const todo2 = service.createTodo("Task 2", "Description");
      const todo3 = service.createTodo("Task 3", "Description");

      service.deleteTodo(todo2.id);

      expect(service.getTodoById(todo1.id)).toBe(todo1);
      expect(service.getTodoById(todo2.id)).toBeNull();
      expect(service.getTodoById(todo3.id)).toBe(todo3);
      expect(service.getAllTodos()).toHaveLength(2);
    });
  });

  describe("completeTodo", () => {
    it("should mark todo as completed", () => {
      const todo = service.createTodo("Task", "Description");
      expect(todo.completed).toBe(false);

      const completed = service.completeTodo(todo.id);

      expect(completed.completed).toBe(true);
    });

    it("should return null when todo does not exist", () => {
      const result = service.completeTodo("nonexistent-id");

      expect(result).toBeNull();
    });

    it("should be idempotent", () => {
      const todo = service.createTodo("Task", "Description");

      service.completeTodo(todo.id);
      const result = service.completeTodo(todo.id);

      expect(result.completed).toBe(true);
    });
  });

  describe("getStats", () => {
    it("should return stats with zero counts when no todos", () => {
      const stats = service.getStats();

      expect(stats).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
      });
    });

    it("should count total todos", () => {
      service.createTodo("Task 1", "Description");
      service.createTodo("Task 2", "Description");
      service.createTodo("Task 3", "Description");

      const stats = service.getStats();

      expect(stats.total).toBe(3);
    });

    it("should count completed and pending todos", () => {
      const todo1 = service.createTodo("Task 1", "Description");
      service.createTodo("Task 2", "Description");
      const todo3 = service.createTodo("Task 3", "Description");
      service.createTodo("Task 4", "Description");

      service.completeTodo(todo1.id);
      service.completeTodo(todo3.id);

      const stats = service.getStats();

      expect(stats.total).toBe(4);
      expect(stats.completed).toBe(2);
      expect(stats.pending).toBe(2);
    });
  });
});
