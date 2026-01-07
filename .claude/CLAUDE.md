# Claude Code Best Practices - Project Context

> **Language (语言)**: English | [简体中文](CLAUDE.zh.md)

This document provides comprehensive context for Claude Code when working on this project. It defines our coding standards, development workflows, and best practices.

---

## 📋 Project Overview

**Project Name**: Claude Code Best Practices
**Tech Stack**: Node.js >= 18.0.0, JavaScript/TypeScript, Jest, ESLint, Prettier
**Purpose**: Production-grade guide and toolkit for mastering Claude Code in professional software development

### Project Goals

1. **Education**: Teach developers how to use Claude Code effectively in production environments
2. **Standardization**: Provide reusable configurations and templates for common workflows
3. **Automation**: Deliver custom commands and agents to automate repetitive tasks
4. **Security**: Demonstrate best practices for protecting sensitive data when using AI assistants
5. **Efficiency**: Optimize token usage and context management for large codebases

### Architecture

```
Claude-Code-Best-Practices/
├── .claude/           # Claude Code configurations (this directory)
├── docs/              # Comprehensive documentation
├── examples/          # Real-world examples (TDD demo, refactoring)
├── templates/         # Reusable templates
├── PLAN.md            # Development roadmap
└── CONTRIBUTING.md    # Contribution guidelines
```

### Development Philosophy

- **Security First**: Protect sensitive data, validate inputs, follow OWASP guidelines
- **Test-Driven Development**: Write tests before implementation
- **Simplicity Over Cleverness**: Clear, maintainable code over premature optimization
- **Documentation as Code**: Keep docs in sync with implementation
- **Progressive Disclosure**: Simple examples for beginners, advanced patterns for experts

---

## 💻 Coding Standards

### JavaScript/TypeScript Style Guide

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = "John";
function getUserById(id) {}

// Classes and constructors: PascalCase
class UserRepository {}
const myDate = new Date();

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";

// Private properties: use # for true privacy (ES2022+) or _ for convention
class ModernService {
  #privateField = "secret"; // Truly private
  #privateMethod() {} // Truly private
}

class LegacyService {
  _privateField = "convention"; // Convention only, still accessible
  _privateMethod() {} // Convention only, still accessible
}

// Boolean variables: use is/has/should prefix
const isActive = true;
const hasPermission = false;
const shouldValidate = true;
```

#### Code Style

```javascript
// ✅ Good: 2-space indentation, semicolons, single quotes
const greeting = "Hello, world";
if (condition) {
  doSomething();
}

// ❌ Bad: tabs, no semicolons, double quotes
const greeting = "Hello, world";
if (condition) {
  doSomething();
}

// ✅ Good: trailing commas in multi-line structures
const config = {
  name: "app",
  version: "1.0.0",
  author: "Team",
};

// ✅ Good: destructuring for clarity
const { id, name, email } = user;

// ✅ Good: arrow functions for callbacks
items.map((item) => item.id);

// ✅ Good: template literals for string interpolation
const message = `Hello, ${userName}!`;
```

#### File Organization

```javascript
// 1. Imports: built-in → external → internal
import fs from "fs";
import path from "path";
import express from "express";
import lodash from "lodash";
import { getUserById } from "./services/userService.js";
import { logger } from "./utils/logger.js";

// 2. Constants
const PORT = 3000;

// 3. Main code
class Application {
  // ...
}

// 4. Exports at bottom
export { Application };
export default Application;
```

#### Error Handling

```javascript
// ✅ Good: specific error types, descriptive messages
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError("Email is required");
  }
  // Validate email format, etc.
}

// ✅ Good: async/await with try-catch
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    logger.error("Failed to fetch user", { id, error });
    throw error;
  }
}
```

### Import Ordering Rules

1. Node.js built-in modules (fs, path, http)
2. External packages (express, lodash, jest)
3. Internal modules (utilities, services, models)
4. Blank line between groups

### TypeScript Best Practices

#### Type Annotations

```typescript
// ✅ Good: explicit return types for public APIs
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: interface for object shapes
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// ✅ Good: type for unions and primitives
type Status = "pending" | "active" | "completed";
type ID = string | number;

// ✅ Good: generic types for reusable functions
function findById<T extends { id: string }>(
  items: T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id);
}
```

#### Modern JavaScript Features

```typescript
// ✅ Good: private fields with # (ES2022+)
class UserService {
  #database: Database; // Truly private, not just convention

  constructor(database: Database) {
    this.#database = database;
  }

  async #hashPassword(password: string): Promise<string> {
    // Private method - not accessible outside class
    return bcrypt.hash(password, 10);
  }
}

// ⚠️ Acceptable: underscore convention for backward compatibility
class LegacyService {
  private _database: Database; // TypeScript private (compile-time only)

  private _internalMethod(): void {
    // Marked private but accessible at runtime
  }
}
```

#### Type Guards and Narrowing

```typescript
// ✅ Good: type guards for runtime checks
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" && obj !== null && "id" in obj && "email" in obj
  );
}

// Usage
if (isUser(data)) {
  console.log(data.email); // TypeScript knows this is safe
}

// ✅ Good: discriminated unions
type Result<T> = { success: true; data: T } | { success: false; error: string };

function handleResult<T>(result: Result<T>): void {
  if (result.success) {
    console.log(result.data); // TypeScript knows data exists
  } else {
    console.error(result.error); // TypeScript knows error exists
  }
}
```

#### Utility Types

```typescript
// ✅ Good: leverage built-in utility types
type PartialUser = Partial<User>; // All properties optional
type RequiredUser = Required<User>; // All properties required
type UserKeys = keyof User; // 'id' | 'email' | 'createdAt'
type UserEmail = Pick<User, "email">; // { email: string }
type UserWithoutId = Omit<User, "id">; // { email: string; createdAt: Date }
```

## 🔧 Common Bash Commands

### Git Workflows

```bash
# Feature development workflow
git checkout main
git pull origin main
git checkout -b feat/feature-name
# ... make changes ...
git add .
git commit -m "feat(scope): description"
git push origin feat/feature-name

# Bug fix workflow
git checkout -b fix/bug-description
# ... fix bug ...
git commit -m "fix(scope): description"

# Update branch with latest main
git checkout main
git pull origin main
git checkout feat/feature-name
git rebase main

# Squash commits before merging
git rebase -i HEAD~3  # Interactive rebase last 3 commits

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View commit history
git log --oneline --graph --all --decorate
```

### npm/yarn Commands

```bash
# Install dependencies
npm install

# Run tests
npm test
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage

# Linting and formatting
npm run lint            # Check for issues
npm run lint:fix        # Auto-fix issues
npm run format          # Format all files
npm run format:check    # Check formatting

# Development
npm run dev             # Start dev server (if applicable)

# Build
npm run build           # Production build

# Clean (Note: requires manual execution as rm -rf is restricted)
rm -r node_modules
rm package-lock.json
npm install
```

### Testing Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.spec.js

# Run tests matching pattern
npm test -- --testNamePattern="UserService"

# Run tests with coverage
npm run test:coverage

# Update snapshots
npm test -- -u

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 🧪 Test-Driven Development (TDD)

### TDD Workflow: Red-Green-Refactor

#### Phase 1: RED - Write a Failing Test

**Prompt Template:**

```
I want to implement [FEATURE]. Following TDD, please:

1. Write a failing test for [SPECIFIC BEHAVIOR]
2. The test should verify that [EXPECTED OUTCOME]
3. Use descriptive test names following the pattern: "should [behavior] when [condition]"
4. Include both happy path and edge cases

Do NOT implement the feature yet - just write the test.
```

**Example:**

```javascript
// tests/userService.spec.js
describe("UserService", () => {
  describe("getUserById", () => {
    it("should return user when valid ID is provided", async () => {
      const userId = "123";
      const user = await getUserById(userId);

      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
    });

    it("should throw error when user not found", async () => {
      const invalidId = "nonexistent";

      await expect(getUserById(invalidId)).rejects.toThrow("User not found");
    });

    it("should throw error when ID is null or undefined", async () => {
      await expect(getUserById(null)).rejects.toThrow();
      await expect(getUserById(undefined)).rejects.toThrow();
    });
  });
});
```

#### Phase 2: GREEN - Make the Test Pass

**Prompt Template:**

```
The test is now failing (as expected). Please implement the MINIMUM code required to make this test pass.

Requirements:
- Focus only on making the test pass
- Don't add extra features or optimizations
- Use the simplest solution that works
- Hard-code values if necessary at this stage
```

**Example:**

```javascript
// src/services/userService.js
export async function getUserById(id) {
  if (!id) {
    throw new Error("User ID is required");
  }

  // Minimal implementation - fetch from data source
  const user = await database.users.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
```

#### Phase 3: REFACTOR - Improve the Code

**Prompt Template:**

```
The tests are passing. Now let's refactor to improve:

1. Code structure and organization
2. Remove duplication (DRY principle)
3. Improve naming and clarity
4. Add proper error handling
5. Extract reusable functions/classes

Ensure all tests still pass after refactoring.
```

**Example:**

```javascript
// src/services/userService.js
import { validateId } from "../utils/validation.js";
import { UserNotFoundError } from "../errors/UserErrors.js";

export class UserService {
  constructor(database) {
    this.db = database;
  }

  async getUserById(id) {
    validateId(id); // Extracted validation

    const user = await this.db.users.findById(id);

    if (!user) {
      throw new UserNotFoundError(id); // Specific error type
    }

    return user;
  }
}
```

### Test Structure Best Practices

```javascript
describe("FeatureName", () => {
  // Setup: runs before each test
  beforeEach(() => {
    // Initialize test data
  });

  // Teardown: runs after each test
  afterEach(() => {
    // Clean up
  });

  describe("methodName", () => {
    it("should [expected behavior] when [condition]", () => {
      // Arrange: Set up test data and dependencies
      const input = "test data";
      const expected = "expected result";

      // Act: Execute the code under test
      const actual = functionUnderTest(input);

      // Assert: Verify the results
      expect(actual).toBe(expected);
    });
  });
});
```

### Test Naming Conventions

```javascript
// ✅ Good: descriptive, behavior-focused
it("should return 404 when user does not exist", () => {});
it("should create user with hashed password", () => {});
it("should throw ValidationError when email is invalid", () => {});

// ❌ Bad: vague, implementation-focused
it("works", () => {});
it("test user creation", () => {});
it("calls the database", () => {});
```

---

## 🔄 Development Workflows

### Feature Development Workflow

1. **Understand Requirements**
   - Read the feature request carefully
   - Ask clarifying questions if needed
   - Identify acceptance criteria

2. **Plan Implementation**
   - Identify affected files
   - Consider edge cases
   - Plan test strategy

3. **Write Tests (TDD)**
   - Write failing tests first
   - Cover happy path and edge cases
   - Run tests to confirm they fail

4. **Implement Feature**
   - Write minimal code to pass tests
   - Follow coding standards
   - Keep commits focused

5. **Refactor**
   - Improve code quality
   - Remove duplication
   - Ensure tests still pass

6. **Document**
   - Add inline comments for complex logic
   - Update relevant documentation
   - Add examples if applicable

7. **Review**
   - Self-review changes
   - Run linter and formatter
   - Ensure all tests pass

### Bug Fix Workflow

1. **Reproduce the Bug**
   - Create a failing test that demonstrates the bug
   - Document steps to reproduce
   - Identify root cause

2. **Fix the Bug**
   - Make minimal changes to fix the issue
   - Ensure the test now passes
   - Verify no regression in other tests

3. **Add Regression Test**
   - Ensure the bug is covered by tests
   - Test edge cases related to the bug

4. **Document the Fix**
   - Explain what caused the bug
   - Describe the solution
   - Reference issue number in commit

### Code Review Workflow

**When Reviewing Code:**

1. **Functionality**
   - Does it meet requirements?
   - Are there edge cases not handled?
   - Is error handling appropriate?

2. **Tests**
   - Are there tests for new code?
   - Do tests cover edge cases?
   - Is coverage above 80%?

3. **Code Quality**
   - Follows coding standards?
   - Clear and maintainable?
   - No unnecessary complexity?

4. **Security**
   - Input validation present?
   - No hardcoded secrets?
   - SQL injection prevention?
   - XSS prevention?

5. **Performance**
   - No obvious performance issues?
   - Database queries optimized?
   - No unnecessary loops?

---

## 🔐 Security Guidelines

### Input Validation

```javascript
// ✅ Good: validate all user input
function createUser(data) {
  if (!data.email || !isValidEmail(data.email)) {
    throw new ValidationError("Invalid email");
  }
  if (!data.password || data.password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters");
  }
  // ... create user
}

// ❌ Bad: trust user input
function createUser(data) {
  database.insert(data); // SQL injection risk!
}
```

### Secrets Management

```javascript
// ✅ Good: use environment variables
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

// ❌ Bad: hardcode secrets
const apiKey = "sk-1234567890abcdef"; // NEVER DO THIS
```

### SQL Injection Prevention

```javascript
// ✅ Good: use parameterized queries
const user = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

// ❌ Bad: string concatenation
const user = await db.query(
  `SELECT * FROM users WHERE id = '${userId}'`, // Vulnerable!
);
```

---

## 📝 Documentation Standards

### Inline Comments

```javascript
// ✅ Good: explain WHY, not WHAT
// Use exponential backoff to avoid overwhelming the API during outages
const delay = Math.pow(2, retryCount) * 1000;

// ❌ Bad: state the obvious
// Multiply 2 by retryCount and then multiply by 1000
const delay = Math.pow(2, retryCount) * 1000;
```

### JSDoc Comments

```javascript
/**
 * Fetches a user by ID from the database
 * @param {string} userId - The unique identifier for the user
 * @returns {Promise<User>} The user object
 * @throws {UserNotFoundError} When user doesn't exist
 * @throws {ValidationError} When userId is invalid
 */
async function getUserById(userId) {
  // Implementation
}
```

---

## 🎯 Claude Code Usage Tips

### Effective Prompting

**Be Specific:**

```
❌ "Add validation"
✅ "Add email validation to the createUser function using a regex pattern.
   Throw a ValidationError with message 'Invalid email format' if validation fails."
```

**Provide Context:**

```
❌ "Fix the bug"
✅ "The getUserById function is returning null for valid user IDs.
   Looking at the code, I think the issue is in the database query on line 45.
   Can you investigate and fix it?"
```

**Break Down Complex Tasks:**

```
❌ "Build a complete authentication system"
✅ "Let's build authentication step by step:
   1. First, create a User model with email and hashed password
   2. Then, implement password hashing with bcrypt
   3. Next, create login endpoint with JWT token generation
   4. Finally, add authentication middleware"
```

### Leverage CLAUDE.md

This file is automatically read by Claude Code. Reference sections from this file:

```
"Following our TDD workflow defined in CLAUDE.md, please write tests first for the login functionality"

"Use the error handling pattern from the Coding Standards section"

"Follow the Feature Development Workflow to implement this"
```

---

## 📦 Project-Specific Notes

### Token Optimization

- Use incremental edits (Edit tool) instead of rewriting entire files
- Reference line numbers when discussing code
- Ask Claude to read specific files rather than describing code verbally
- Break large tasks into smaller, focused subtasks

### File Exclusions

Claude Code should NOT access:

- `.env` files (contain secrets)
- `node_modules/` (third-party code)
- `coverage/` (generated reports)
- `.git/` (version control internals)

See `.claudeignore` for complete list.

---

**Last Updated**: 2026-01-06
**Maintained By**: Claude Code Best Practices Contributors
