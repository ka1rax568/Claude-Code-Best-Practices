/**
 * Todo Model
 *
 * Domain model representing a Todo item.
 * Handles validation and business logic for todo operations.
 */

import { v4 as uuidv4 } from "uuid";

export class Todo {
  /**
   * Creates a new Todo instance
   * @param {string} title - The todo title (required, 1-200 chars)
   * @param {string} description - The todo description (optional, max 1000 chars)
   * @throws {Error} When validation fails
   */
  constructor(title, description = "") {
    this.#validateTitle(title);
    this.#validateDescription(description);

    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Marks the todo as completed
   */
  complete() {
    this.completed = true;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Updates the todo with new data
   * @param {Object} updates - Object containing title and/or description
   * @param {string} [updates.title] - New title
   * @param {string} [updates.description] - New description
   * @throws {Error} When validation fails
   */
  update(updates) {
    if (updates.title !== undefined) {
      this.#validateTitle(updates.title);
      this.title = updates.title;
    }

    if (updates.description !== undefined) {
      this.#validateDescription(updates.description);
      this.description = updates.description;
    }

    this.updatedAt = new Date().toISOString();
  }

  /**
   * Returns a plain object representation of the todo
   * @returns {Object} Plain object with all todo properties
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Validates the title field
   * @private
   * @param {string} title - The title to validate
   * @throws {Error} When title is invalid
   */
  #validateTitle(title) {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }

    if (title.length > 200) {
      throw new Error("Title must be between 1 and 200 characters");
    }
  }

  /**
   * Validates the description field
   * @private
   * @param {string} description - The description to validate
   * @throws {Error} When description is invalid
   */
  #validateDescription(description) {
    if (description && description.length > 1000) {
      throw new Error("Description must not exceed 1000 characters");
    }
  }
}
