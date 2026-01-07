/**
 * TodoService
 *
 * Business logic layer for managing todos.
 * Handles CRUD operations and maintains in-memory storage.
 */

import { Todo } from "../models/Todo.js";

export class TodoService {
  constructor() {
    this.todos = new Map();
  }

  /**
   * Creates a new todo
   * @param {string} title - Todo title
   * @param {string} description - Todo description
   * @returns {Todo} The created todo
   */
  createTodo(title, description = "") {
    const todo = new Todo(title, description);
    this.todos.set(todo.id, todo);
    return todo;
  }

  /**
   * Gets all todos
   * @returns {Todo[]} Array of all todos
   */
  getAllTodos() {
    return Array.from(this.todos.values());
  }

  /**
   * Gets a todo by ID
   * @param {string} id - Todo ID
   * @returns {Todo|null} The todo or null if not found
   */
  getTodoById(id) {
    if (!id) {
      return null;
    }
    return this.todos.get(id) || null;
  }

  /**
   * Updates a todo
   * @param {string} id - Todo ID
   * @param {Object} updates - Updates to apply
   * @returns {Todo|null} Updated todo or null if not found
   */
  updateTodo(id, updates) {
    const todo = this.getTodoById(id);
    if (!todo) {
      return null;
    }

    todo.update(updates);
    return todo;
  }

  /**
   * Deletes a todo
   * @param {string} id - Todo ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteTodo(id) {
    return this.todos.delete(id);
  }

  /**
   * Marks a todo as completed
   * @param {string} id - Todo ID
   * @returns {Todo|null} Completed todo or null if not found
   */
  completeTodo(id) {
    const todo = this.getTodoById(id);
    if (!todo) {
      return null;
    }

    todo.complete();
    return todo;
  }

  /**
   * Gets statistics about todos
   * @returns {Object} Statistics object with total, completed, and pending counts
   */
  getStats() {
    const todos = this.getAllTodos();
    const completed = todos.filter((todo) => todo.completed).length;

    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
    };
  }
}
