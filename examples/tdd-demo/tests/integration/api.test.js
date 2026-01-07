/**
 * API Integration Tests
 *
 * End-to-end tests for all API endpoints.
 * Tests the full request/response cycle.
 */

import request from "supertest";
import { createApp } from "../../src/index.js";

describe("Todo API Integration Tests", () => {
  let app;

  // Create a fresh app instance before each test to ensure isolation
  beforeEach(() => {
    app = createApp();
  });
  describe("POST /todos", () => {
    it("should create a new todo and return 201", async () => {
      const response = await request(app)
        .post("/todos")
        .send({
          title: "Buy groceries",
          description: "Milk, eggs, bread",
        })
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Buy groceries");
      expect(response.body.description).toBe("Milk, eggs, bread");
      expect(response.body.completed).toBe(false);
      expect(response.body.createdAt).toBeDefined();
    });

    it("should create todo without description", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "Simple task" })
        .expect(201);

      expect(response.body.title).toBe("Simple task");
      expect(response.body.description).toBe("");
    });

    it("should return 400 when title is missing", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ description: "No title" })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 when title is empty", async () => {
      await request(app).post("/todos").send({ title: "" }).expect(400);
    });

    it("should return 400 when title exceeds 200 characters", async () => {
      const longTitle = "a".repeat(201);

      await request(app).post("/todos").send({ title: longTitle }).expect(400);
    });

    it("should return 400 when description exceeds 1000 characters", async () => {
      const longDescription = "a".repeat(1001);

      await request(app)
        .post("/todos")
        .send({
          title: "Valid title",
          description: longDescription,
        })
        .expect(400);
    });
  });

  describe("GET /todos", () => {
    it("should return empty array when no todos exist", async () => {
      const response = await request(app)
        .get("/todos")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual([]);
    });

    it("should return all todos", async () => {
      // Create some todos
      await request(app)
        .post("/todos")
        .send({ title: "Task 1", description: "Description 1" });
      await request(app)
        .post("/todos")
        .send({ title: "Task 2", description: "Description 2" });
      await request(app)
        .post("/todos")
        .send({ title: "Task 3", description: "Description 3" });

      const response = await request(app).get("/todos").expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].title).toBe("Task 1");
      expect(response.body[1].title).toBe("Task 2");
      expect(response.body[2].title).toBe("Task 3");
    });
  });

  describe("GET /todos/:id", () => {
    it("should return todo when it exists", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Test Todo", description: "Test Description" });

      const todoId = createResponse.body.id;

      const response = await request(app).get(`/todos/${todoId}`).expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe("Test Todo");
    });

    it("should return 404 when todo does not exist", async () => {
      const response = await request(app)
        .get("/todos/nonexistent-id")
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /todos/:id", () => {
    it("should update todo title", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Original Title", description: "Description" });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .send({ title: "Updated Title" })
        .expect(200);

      expect(response.body.title).toBe("Updated Title");
      expect(response.body.description).toBe("Description");
    });

    it("should update todo description", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Title", description: "Original Description" });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .send({ description: "Updated Description" })
        .expect(200);

      expect(response.body.title).toBe("Title");
      expect(response.body.description).toBe("Updated Description");
    });

    it("should update both title and description", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Old Title", description: "Old Description" });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .send({
          title: "New Title",
          description: "New Description",
        })
        .expect(200);

      expect(response.body.title).toBe("New Title");
      expect(response.body.description).toBe("New Description");
    });

    it("should return 404 when todo does not exist", async () => {
      await request(app)
        .put("/todos/nonexistent-id")
        .send({ title: "Updated" })
        .expect(404);
    });

    it("should return 400 when validation fails", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Title", description: "Description" });

      const todoId = createResponse.body.id;
      const longTitle = "a".repeat(201);

      await request(app)
        .put(`/todos/${todoId}`)
        .send({ title: longTitle })
        .expect(400);
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should delete todo and return 204", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "To Delete", description: "Description" });

      const todoId = createResponse.body.id;

      await request(app).delete(`/todos/${todoId}`).expect(204);

      // Verify it's deleted
      await request(app).get(`/todos/${todoId}`).expect(404);
    });

    it("should return 404 when todo does not exist", async () => {
      await request(app).delete("/todos/nonexistent-id").expect(404);
    });

    it("should not affect other todos", async () => {
      const response1 = await request(app)
        .post("/todos")
        .send({ title: "Task 1" });
      const response2 = await request(app)
        .post("/todos")
        .send({ title: "Task 2" });
      const response3 = await request(app)
        .post("/todos")
        .send({ title: "Task 3" });

      await request(app).delete(`/todos/${response2.body.id}`).expect(204);

      const allTodos = await request(app).get("/todos").expect(200);
      expect(allTodos.body).toHaveLength(2);
      expect(
        allTodos.body.find((t) => t.id === response1.body.id),
      ).toBeDefined();
      expect(
        allTodos.body.find((t) => t.id === response3.body.id),
      ).toBeDefined();
    });
  });

  describe("PATCH /todos/:id/complete", () => {
    it("should mark todo as completed", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Task to Complete", description: "Description" });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .patch(`/todos/${todoId}/complete`)
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it("should return 404 when todo does not exist", async () => {
      await request(app).patch("/todos/nonexistent-id/complete").expect(404);
    });

    it("should be idempotent", async () => {
      const createResponse = await request(app)
        .post("/todos")
        .send({ title: "Task", description: "Description" });

      const todoId = createResponse.body.id;

      await request(app).patch(`/todos/${todoId}/complete`).expect(200);
      const response = await request(app)
        .patch(`/todos/${todoId}/complete`)
        .expect(200);

      expect(response.body.completed).toBe(true);
    });
  });

  describe("GET /todos/stats", () => {
    it("should return stats with zero counts when no todos", async () => {
      const response = await request(app).get("/todos/stats").expect(200);

      expect(response.body).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
      });
    });

    it("should return accurate stats", async () => {
      const todo1 = await request(app).post("/todos").send({ title: "Task 1" });
      await request(app).post("/todos").send({ title: "Task 2" });
      const todo3 = await request(app).post("/todos").send({ title: "Task 3" });
      await request(app).post("/todos").send({ title: "Task 4" });

      await request(app).patch(`/todos/${todo1.body.id}/complete`);
      await request(app).patch(`/todos/${todo3.body.id}/complete`);

      const response = await request(app).get("/todos/stats").expect(200);

      expect(response.body.total).toBe(4);
      expect(response.body.completed).toBe(2);
      expect(response.body.pending).toBe(2);
    });
  });
});
