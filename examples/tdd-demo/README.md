# TDD Demo: Building a Todo API

This is a **complete Test-Driven Development (TDD) demonstration** showing how to build a production-quality Todo API from scratch using the Red-Green-Refactor cycle.

## What You'll Learn

- **TDD Workflow**: Write tests first, then implement features
- **Red-Green-Refactor**: The core TDD cycle in practice
- **Jest Testing**: Unit and integration tests with >90% coverage
- **Clean Architecture**: Separation of concerns and maintainability
- **Git Workflow**: Commit history shows TDD progression

## Prerequisites

- Node.js >= 18.0.0
- Basic JavaScript/ES6 knowledge
- Familiarity with REST APIs

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Start the API server
npm start
```

## API Endpoints

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| POST   | /todos              | Create a new todo     |
| GET    | /todos              | List all todos        |
| GET    | /todos/:id          | Get a specific todo   |
| PUT    | /todos/:id          | Update a todo         |
| DELETE | /todos/:id          | Delete a todo         |
| PATCH  | /todos/:id/complete | Mark todo as complete |

## TDD Workflow Demonstrated

### Phase 1: RED - Write a Failing Test

Each feature starts with a failing test that defines the expected behavior:

```javascript
// tests/todoService.test.js
it("should create a new todo with title and description", () => {
  const todo = createTodo("Buy groceries", "Milk, eggs, bread");

  expect(todo).toBeDefined();
  expect(todo.id).toBeDefined();
  expect(todo.title).toBe("Buy groceries");
  expect(todo.description).toBe("Milk, eggs, bread");
  expect(todo.completed).toBe(false);
});
```

Run the test: **It fails** because the function doesn't exist yet.

### Phase 2: GREEN - Make It Pass

Write the minimal code to make the test pass:

```javascript
// src/services/todoService.js
import { v4 as uuidv4 } from "uuid";

export function createTodo(title, description) {
  return {
    id: uuidv4(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}
```

Run the test: **It passes** ✅

### Phase 3: REFACTOR - Improve the Code

Now that tests pass, improve the implementation:

```javascript
// src/models/Todo.js
export class Todo {
  constructor(title, description) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  complete() {
    this.completed = true;
    this.updatedAt = new Date().toISOString();
  }
}
```

Run tests again: **Still passing** ✅

## Project Structure

```
tdd-demo/
├── src/
│   ├── models/
│   │   └── Todo.js           # Todo domain model
│   ├── services/
│   │   └── todoService.js    # Business logic
│   ├── routes/
│   │   └── todoRoutes.js     # Express routes
│   ├── middleware/
│   │   └── validation.js     # Input validation
│   └── index.js              # Application entry point
├── tests/
│   ├── models/
│   │   └── Todo.test.js      # Model tests
│   ├── services/
│   │   └── todoService.test.js  # Service tests
│   └── integration/
│       └── api.test.js       # Integration tests
├── package.json
└── README.md (this file)
```

## Testing Strategy

### 1. Unit Tests

Test individual functions and classes in isolation:

```javascript
// Testing the Todo model
describe("Todo", () => {
  it("should create todo with default completed=false", () => {
    const todo = new Todo("Test", "Description");
    expect(todo.completed).toBe(false);
  });

  it("should mark todo as complete", () => {
    const todo = new Todo("Test", "Description");
    todo.complete();
    expect(todo.completed).toBe(true);
  });
});
```

### 2. Integration Tests

Test the API endpoints end-to-end:

```javascript
// Testing POST /todos endpoint
describe("POST /todos", () => {
  it("should create and return new todo", async () => {
    const response = await request(app)
      .post("/todos")
      .send({ title: "Test Todo", description: "Test Description" })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe("Test Todo");
  });
});
```

### 3. Edge Cases

Test validation and error handling:

```javascript
it("should return 400 when title is missing", async () => {
  await request(app)
    .post("/todos")
    .send({ description: "No title" })
    .expect(400);
});

it("should return 404 when todo not found", async () => {
  await request(app).get("/todos/nonexistent-id").expect(404);
});
```

## Coverage Goals

This project maintains >90% code coverage:

```bash
npm run test:coverage
```

```
-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |   92.5  |   91.2   |   93.8  |   92.5  |
 models/         |   100   |   100    |   100   |   100   |
  Todo.js        |   100   |   100    |   100   |   100   |
 services/       |   95.8  |   90.0   |   100   |   95.8  |
  todoService.js |   95.8  |   90.0   |   100   |   95.8  |
-----------------|---------|----------|---------|---------|
```

## Git Commit History

The commit history demonstrates the TDD workflow:

```
feat(todo): add Todo model with tests [GREEN]
test(todo): add failing test for createTodo [RED]
feat(todo): implement createTodo function [GREEN]
refactor(todo): extract Todo class from createTodo [REFACTOR]
test(todo): add failing test for getTodoById [RED]
feat(todo): implement getTodoById function [GREEN]
...
```

Each commit follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Key TDD Principles Demonstrated

### 1. Write Tests First

Never write production code without a failing test.

### 2. Minimal Implementation

Write only enough code to make the test pass.

### 3. Refactor with Confidence

Tests ensure refactoring doesn't break functionality.

### 4. Fast Feedback Loop

Run tests frequently (use watch mode).

### 5. Test Behavior, Not Implementation

Focus on what the code does, not how it does it.

## Common Patterns

### Arrange-Act-Assert (AAA)

```javascript
it("should update todo title", () => {
  // Arrange: Set up test data
  const todo = new Todo("Original", "Description");

  // Act: Execute the code under test
  todo.updateTitle("Updated Title");

  // Assert: Verify the results
  expect(todo.title).toBe("Updated Title");
});
```

### Test Isolation

```javascript
describe("TodoService", () => {
  let service;

  beforeEach(() => {
    // Fresh instance for each test
    service = new TodoService();
  });

  afterEach(() => {
    // Clean up
    service = null;
  });
});
```

## Validation Rules

The API validates input according to these rules:

- **Title**: Required, 1-200 characters
- **Description**: Optional, max 1000 characters
- **ID**: Must be valid UUID v4 format

## Error Handling

All endpoints return consistent error responses:

```javascript
{
  "error": "Todo not found",
  "message": "No todo exists with id: 123e4567-e89b-12d3-a456-426614174000",
  "statusCode": 404
}
```

## Best Practices Demonstrated

✅ Write tests before implementation
✅ Keep tests simple and focused
✅ Use descriptive test names
✅ Test edge cases and error conditions
✅ Maintain high test coverage
✅ Commit frequently with clear messages
✅ Refactor continuously
✅ Separate concerns (models, services, routes)

## Next Steps

After completing this demo, try:

1. Add filtering/sorting to GET /todos
2. Add pagination support
3. Implement todo categories/tags
4. Add due dates and priorities
5. Build a database layer (instead of in-memory)
6. Add authentication and authorization
7. Create a frontend client

## Resources

- [Jest Documentation](https://jestjs.io/)
- [TDD by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Kent Beck
- [Growing Object-Oriented Software, Guided by Tests](https://www.amazon.com/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627)
- [Martin Fowler on TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## License

MIT - See LICENSE file in project root

---

**Built with Test-Driven Development** ✨

_This example is part of the [Claude Code Best Practices](../../README.md) project._
