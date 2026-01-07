# TDD Workflow Documentation

This document explains the Test-Driven Development workflow used to build the Todo API, providing a step-by-step guide for applying TDD to your own projects.

## Table of Contents

- [Overview](#overview)
- [The Red-Green-Refactor Cycle](#the-red-green-refactor-cycle)
- [Step-by-Step Implementation](#step-by-step-implementation)
- [Testing Strategy](#testing-strategy)
- [Lessons Learned](#lessons-learned)

---

## Overview

Test-Driven Development (TDD) is a software development approach where you write tests **before** writing the actual code. This ensures:

- **Clear requirements**: Tests define what the code should do
- **Better design**: Writing tests first leads to more modular, testable code
- **Confidence in changes**: Comprehensive tests catch regressions
- **Living documentation**: Tests serve as examples of how code should be used

### The Three Laws of TDD

1. **Write no production code** until you have a failing test
2. **Write only enough of a test** to demonstrate a failure
3. **Write only enough production code** to make the failing test pass

---

## The Red-Green-Refactor Cycle

### 🔴 RED: Write a Failing Test

Start by writing a test that describes the behavior you want to implement.

**Example: Testing Todo Creation**

```javascript
it("should create a todo with title and description", () => {
  const todo = new Todo("Buy groceries", "Milk, eggs, bread");

  expect(todo).toBeDefined();
  expect(todo.id).toBeDefined();
  expect(todo.title).toBe("Buy groceries");
  expect(todo.description).toBe("Milk, eggs, bread");
  expect(todo.completed).toBe(false);
});
```

**Run the test**: It fails because `Todo` class doesn't exist yet. ❌

### ✅ GREEN: Make It Pass

Write the minimal code required to make the test pass.

```javascript
export class Todo {
  constructor(title, description = "") {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
```

**Run the test**: It passes! ✅

### ♻️ REFACTOR: Improve the Code

Now that tests are passing, improve code quality without changing behavior.

```javascript
export class Todo {
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

  #validateTitle(title) {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (title.length > 200) {
      throw new Error("Title must be between 1 and 200 characters");
    }
  }

  #validateDescription(description) {
    if (description && description.length > 1000) {
      throw new Error("Description must not exceed 1000 characters");
    }
  }
}
```

**Run the test**: Still passing! ✅

---

## Step-by-Step Implementation

### Phase 1: Domain Model (Todo class)

#### Iteration 1: Basic Todo Creation

1. **RED**: Write test for creating a todo
2. **GREEN**: Implement Todo constructor
3. **REFACTOR**: Extract validation methods
4. **COMMIT**: `feat(todo): add Todo model with validation`

#### Iteration 2: Todo Completion

1. **RED**: Write test for marking todo as complete
2. **GREEN**: Implement `complete()` method
3. **REFACTOR**: Update `updatedAt` timestamp
4. **COMMIT**: `feat(todo): add complete method`

#### Iteration 3: Todo Updates

1. **RED**: Write test for updating todo fields
2. **GREEN**: Implement `update()` method
3. **REFACTOR**: Reuse validation logic
4. **COMMIT**: `feat(todo): add update method`

### Phase 2: Business Logic (TodoService)

#### Iteration 4: Create Todo

1. **RED**: Write test for `createTodo()`
2. **GREEN**: Implement service with in-memory storage
3. **REFACTOR**: Use Map for efficient lookups
4. **COMMIT**: `feat(service): implement createTodo`

#### Iteration 5: Read Todos

1. **RED**: Write tests for `getAllTodos()` and `getTodoById()`
2. **GREEN**: Implement read operations
3. **REFACTOR**: Add null checks and edge cases
4. **COMMIT**: `feat(service): implement read operations`

#### Iteration 6: Update and Delete

1. **RED**: Write tests for update and delete
2. **GREEN**: Implement methods
3. **REFACTOR**: Handle not-found cases consistently
4. **COMMIT**: `feat(service): implement update and delete`

### Phase 3: API Layer (Express Routes)

#### Iteration 7: POST /todos

1. **RED**: Write integration test for creating todo via API
2. **GREEN**: Implement Express route
3. **REFACTOR**: Extract validation middleware
4. **COMMIT**: `feat(api): add POST /todos endpoint`

#### Iteration 8: GET /todos

1. **RED**: Write integration test for listing todos
2. **GREEN**: Implement route
3. **REFACTOR**: Extract JSON serialization
4. **COMMIT**: `feat(api): add GET /todos endpoint`

#### Iteration 9: Remaining Endpoints

Repeat for:

- GET /todos/:id
- PUT /todos/:id
- DELETE /todos/:id
- PATCH /todos/:id/complete

---

## Testing Strategy

### Test Pyramid

```
       /\
      /E2E\          Integration Tests (API endpoints)
     /------\
    / Unit  \        Unit Tests (models, services)
   /________\
```

### Unit Tests

Test individual classes and functions in isolation.

**Location**: `tests/models/`, `tests/services/`

**Purpose**:

- Verify business logic
- Test edge cases
- Fast execution

**Example**:

```javascript
describe("Todo Model", () => {
  it("should throw error when title exceeds 200 characters", () => {
    const longTitle = "a".repeat(201);
    expect(() => new Todo(longTitle)).toThrow();
  });
});
```

### Integration Tests

Test the full request/response cycle through the API.

**Location**: `tests/integration/`

**Purpose**:

- Verify endpoints work end-to-end
- Test HTTP status codes and responses
- Ensure components work together

**Example**:

```javascript
describe("POST /todos", () => {
  it("should create and return new todo", async () => {
    const response = await request(app)
      .post("/todos")
      .send({ title: "Test Todo" })
      .expect(201);

    expect(response.body.id).toBeDefined();
  });
});
```

### Test Isolation

Each test should be independent:

```javascript
beforeEach(() => {
  app = createApp(); // Fresh instance for each test
});
```

This ensures tests don't affect each other and can run in any order.

---

## Lessons Learned

### 1. Start Simple

Begin with the simplest test case (happy path), then add complexity:

```javascript
// Start with this
it("should create todo", () => {
  const todo = new Todo("Title", "Description");
  expect(todo.title).toBe("Title");
});

// Then add edge cases
it("should throw when title is empty", () => {
  expect(() => new Todo("")).toThrow();
});
```

### 2. Test Behavior, Not Implementation

Focus on **what** the code does, not **how** it does it:

```javascript
// ✅ Good: Tests behavior
it("should mark todo as completed", () => {
  todo.complete();
  expect(todo.completed).toBe(true);
});

// ❌ Bad: Tests implementation details
it("should set completed property to true", () => {
  todo.completed = true; // Directly accessing internals
  expect(todo.completed).toBe(true);
});
```

### 3. One Assertion Per Concept

Each test should verify one specific behavior:

```javascript
// ✅ Good: Focused test
it("should set default completed to false", () => {
  const todo = new Todo("Title");
  expect(todo.completed).toBe(false);
});

// ❌ Bad: Testing multiple things
it("should create todo with correct defaults", () => {
  const todo = new Todo("Title");
  expect(todo.completed).toBe(false);
  expect(todo.title).toBe("Title");
  expect(todo.id).toBeDefined();
  // Too many unrelated assertions
});
```

### 4. Use Descriptive Test Names

Test names should describe the expected behavior:

```javascript
// ✅ Good
it("should return 404 when todo does not exist", () => {});

// ❌ Bad
it("test get todo", () => {});
```

### 5. Refactor with Confidence

Once tests pass, refactor freely knowing tests will catch mistakes:

```javascript
// Initial implementation
function createTodo(title, description) {
  if (!title) throw new Error("Title required");
  if (title.length > 200) throw new Error("Title too long");
  return { id: uuidv4(), title, description };
}

// Refactored (tests still pass!)
class Todo {
  constructor(title, description) {
    this.#validateTitle(title);
    this.id = uuidv4();
    this.title = title;
    this.description = description;
  }

  #validateTitle(title) {
    if (!title) throw new Error("Title required");
    if (title.length > 200) throw new Error("Title too long");
  }
}
```

### 6. Test Coverage is a Guide, Not a Goal

- Aim for >90% coverage but focus on meaningful tests
- 100% coverage doesn't mean bug-free code
- Some code (like error logging) may not need tests

### 7. Write Tests for Edge Cases

Don't just test the happy path:

```javascript
describe("updateTodo", () => {
  it("should update existing todo", () => {}); // Happy path
  it("should return null when todo not found", () => {}); // Edge case
  it("should validate updated title length", () => {}); // Edge case
  it("should handle empty updates", () => {}); // Edge case
});
```

---

## Git Workflow with TDD

### Commit After Each Cycle

Each Red-Green-Refactor cycle should result in a commit:

```bash
# RED
git add tests/
git commit -m "test(todo): add failing test for complete method [RED]"

# GREEN
git add src/
git commit -m "feat(todo): implement complete method [GREEN]"

# REFACTOR
git add src/
git commit -m "refactor(todo): extract timestamp update logic [REFACTOR]"
```

### Conventional Commits

Use meaningful commit messages:

- `test(scope): description [RED]` - Failing test
- `feat(scope): description [GREEN]` - Implementation
- `refactor(scope): description [REFACTOR]` - Code improvement

---

## Running the Tests

```bash
# Run all tests
npm test

# Run in watch mode (automatic re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/models/Todo.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should create"
```

---

## Coverage Report

Our final coverage:

```
-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |   93.27 |      100 |     100 |   93.04 |
 middleware      |   92.3  |      100 |     100 |   92.3  |
 models          |    100  |      100 |     100 |    100  |
 routes          |  88.13  |      100 |     100 |   87.5  |
 services        |    100  |      100 |     100 |    100  |
-----------------|---------|----------|---------|---------|
```

**76 tests, all passing!** ✅

---

## Next Steps

To practice TDD:

1. **Add a new feature** (e.g., todo priorities)
   - Write failing tests first
   - Implement minimal code
   - Refactor

2. **Fix a bug** using TDD:
   - Write test that reproduces bug
   - Fix the code
   - Verify test passes

3. **Refactor existing code**:
   - Tests provide safety net
   - Make improvements confidently
   - Ensure tests still pass

---

**Remember**: TDD is a discipline that improves with practice. Start small, be patient, and trust the process!

---

_Last Updated: 2026-01-07_
