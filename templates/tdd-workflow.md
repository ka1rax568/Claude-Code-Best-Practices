# Test-Driven Development Workflow Template

A generic guide for implementing Test-Driven Development (TDD) in any project. Customize this template for your specific technology stack and testing framework.

---

## Overview

Test-Driven Development (TDD) is a software development approach where tests are written **before** the implementation code. This ensures better design, comprehensive test coverage, and confidence in changes.

### Benefits of TDD

- ✅ **Clear Requirements**: Tests define expected behavior upfront
- ✅ **Better Design**: Writing tests first encourages modular, testable code
- ✅ **Confidence**: Comprehensive tests catch regressions early
- ✅ **Documentation**: Tests serve as living examples
- ✅ **Faster Debugging**: Failures pinpoint exact issues

---

## The Red-Green-Refactor Cycle

### 🔴 RED: Write a Failing Test

Write a test that describes the behavior you want to implement.

**Steps:**

1. Identify the next small piece of functionality
2. Write a test that will fail
3. Run the test to confirm it fails
4. Commit: `test([scope]): add failing test for [feature] [RED]`

**Example:**

```[language]
describe('[FeatureName]', () => {
  it('should [expected behavior] when [condition]', () => {
    // Arrange
    const input = [test data];

    // Act
    const result = [functionUnderTest](input);

    // Assert
    expect(result).toBe([expected value]);
  });
});
```

**Run**: Test fails ❌ (expected - code doesn't exist yet)

---

### ✅ GREEN: Make the Test Pass

Write the **minimal** code required to make the test pass.

**Steps:**

1. Write only enough code to pass the test
2. Don't worry about perfect code yet
3. Run tests to confirm they pass
4. Commit: `feat([scope]): implement [feature] [GREEN]`

**Example:**

```[language]
function [functionUnderTest](input) {
  // Minimal implementation
  return [expected value];
}
```

**Run**: Test passes ✅

---

### ♻️ REFACTOR: Improve the Code

Now that tests are passing, improve code quality without changing behavior.

**Steps:**

1. Remove duplication
2. Improve naming and clarity
3. Extract methods/classes
4. Optimize if needed
5. Run tests after each change
6. Commit: `refactor([scope]): improve [aspect] [REFACTOR]`

**Example:**

```[language]
class [ClassName] {
  constructor() {
    this.[property] = [value];
  }

  [methodName](input) {
    this.#validate(input);
    return this.#process(input);
  }

  #validate(input) {
    // Extracted validation logic
  }

  #process(input) {
    // Extracted processing logic
  }
}
```

**Run**: Tests still pass ✅

---

## TDD Workflow Steps

### 1. Start with the Simplest Test

Begin with the most basic, happy-path scenario:

```[language]
it('should [basic behavior]', () => {
  const result = [function]([simple input]);
  expect(result).toBe([expected output]);
});
```

### 2. Add Edge Cases Incrementally

After the basic case works, add tests for edge cases:

```[language]
it('should handle empty input', () => {
  expect(() => [function]('')).toThrow();
});

it('should handle null input', () => {
  expect(() => [function](null)).toThrow();
});

it('should handle maximum length', () => {
  const longInput = 'x'.repeat(1000);
  expect(() => [function](longInput)).toThrow();
});
```

### 3. Refactor When Tests Pass

Only refactor when all tests are green:

**Before Refactoring:**

- ✅ All tests passing
- ✅ Coverage acceptable
- ✅ No pending changes

**During Refactoring:**

- Run tests after each small change
- Keep commits small and focused
- Revert if tests fail

**After Refactoring:**

- ✅ All tests still passing
- ✅ Code is cleaner/simpler
- ✅ No behavior changes

### 4. Repeat the Cycle

For each new feature or behavior:

1. RED: Write failing test
2. GREEN: Make it pass
3. REFACTOR: Clean up code
4. Commit and repeat

---

## Testing Patterns

### Arrange-Act-Assert (AAA)

Structure every test with three clear sections:

```[language]
it('should [behavior]', () => {
  // Arrange: Set up test data and dependencies
  const [input] = [test data];
  const [expected] = [expected result];

  // Act: Execute the code under test
  const [actual] = [functionUnderTest]([input]);

  // Assert: Verify the results
  expect([actual]).toBe([expected]);
});
```

### Test Isolation

Each test should be independent:

```[language]
describe('[TestSuite]', () => {
  let [dependency];

  beforeEach(() => {
    // Fresh setup for each test
    [dependency] = new [Dependency]();
  });

  afterEach(() => {
    // Clean up after each test
    [dependency] = null;
  });

  it('test 1', () => { /* ... */ });
  it('test 2', () => { /* ... */ });
});
```

### Descriptive Test Names

Use clear, behavior-focused names:

```[language]
// ✅ Good
it('should return 404 when resource not found', () => {});
it('should create user with hashed password', () => {});
it('should reject invalid email format', () => {});

// ❌ Bad
it('works', () => {});
it('test getUserById', () => {});
it('should work correctly', () => {});
```

---

## TDD Best Practices

### 1. Write Tests First

**Always** write the test before the implementation:

```
❌ Write code → Write tests
✅ Write test → Write code
```

### 2. Keep Tests Simple

Each test should verify one specific behavior:

```[language]
// ✅ Good: One assertion per concept
it('should set completed to false by default', () => {
  const [object] = new [Class]();
  expect([object].completed).toBe(false);
});

// ❌ Bad: Testing multiple unrelated things
it('should create object correctly', () => {
  const [object] = new [Class]();
  expect([object].id).toBeDefined();
  expect([object].name).toBe('default');
  expect([object].completed).toBe(false);
  // Too many unrelated assertions
});
```

### 3. Test Behavior, Not Implementation

Focus on **what** the code does, not **how**:

```[language]
// ✅ Good: Tests behavior
it('should mark item as complete', () => {
  [object].complete();
  expect([object].isComplete()).toBe(true);
});

// ❌ Bad: Tests implementation details
it('should set internal flag', () => {
  [object]._internalFlag = true;  // Accessing internals
  expect([object]._internalFlag).toBe(true);
});
```

### 4. Maintain Fast Tests

Keep test execution time minimal:

- Use test doubles (mocks, stubs) for external dependencies
- Avoid actual database/network calls in unit tests
- Run slow tests (integration/E2E) separately

### 5. Aim for High Coverage

Target **>80% code coverage**, but focus on meaningful tests:

```bash
# Run coverage report
[test coverage command]

# Aim for:
- Statements: >80%
- Branches: >80%
- Functions: >80%
- Lines: >80%
```

---

## Common TDD Pitfalls

### ❌ Writing Tests After Code

**Problem**: Defeats the purpose of TDD
**Solution**: Commit to RED-GREEN-REFACTOR discipline

### ❌ Testing Implementation Details

**Problem**: Tests break when refactoring
**Solution**: Test public APIs and behavior

### ❌ Large Test Leaps

**Problem**: Writing complex tests that require lots of code
**Solution**: Take smaller steps, simpler tests

### ❌ Skipping Refactor Step

**Problem**: Code becomes messy over time
**Solution**: Always refactor when tests are green

### ❌ Not Running Tests Frequently

**Problem**: Delayed feedback on failures
**Solution**: Run tests after every small change

---

## Git Workflow with TDD

### Commit After Each Phase

```bash
# RED: Failing test
git add tests/
git commit -m "test([scope]): add failing test for [feature] [RED]"

# GREEN: Implementation
git add src/
git commit -m "feat([scope]): implement [feature] [GREEN]"

# REFACTOR: Improvements
git add src/
git commit -m "refactor([scope]): extract [component] [REFACTOR]"
```

### Conventional Commit Format

```
<type>(<scope>): <description> [<phase>]

Types: feat, fix, refactor, test, docs, chore
Phases: [RED], [GREEN], [REFACTOR]
```

**Examples:**

- `test(auth): add failing test for login validation [RED]`
- `feat(auth): implement login validation [GREEN]`
- `refactor(auth): extract validation logic [REFACTOR]`

---

## Testing Tools & Frameworks

### Popular Testing Frameworks

**JavaScript/TypeScript:**

- Jest, Vitest, Mocha, Jasmine

**Python:**

- pytest, unittest, nose2

**Java:**

- JUnit, TestNG, Spock

**Ruby:**

- RSpec, Minitest

**Go:**

- testing package, Ginkgo

**C#:**

- NUnit, xUnit, MSTest

### Test Runners

```bash
# Watch mode (auto-run on changes)
[test watch command]

# Coverage mode
[test coverage command]

# Specific file/pattern
[test specific command]

# Verbose output
[test verbose command]
```

---

## Example TDD Session

### Goal: Implement user email validation

#### Iteration 1: Basic Email Format

**RED:**

```[language]
it('should accept valid email', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
});
```

Test fails ❌ (function doesn't exist)

**GREEN:**

```[language]
function isValidEmail(email) {
  return email.includes('@');
}
```

Test passes ✅

**REFACTOR:**

```[language]
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

Test still passes ✅

#### Iteration 2: Reject Invalid Emails

**RED:**

```[language]
it('should reject email without @', () => {
  expect(isValidEmail('invalid.email.com')).toBe(false);
});
```

**GREEN:**
Already passes due to refactored implementation ✅

#### Iteration 3: Handle Edge Cases

**RED:**

```[language]
it('should reject empty string', () => {
  expect(isValidEmail('')).toBe(false);
});

it('should reject null', () => {
  expect(isValidEmail(null)).toBe(false);
});
```

**GREEN:**

```[language]
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

All tests pass ✅

---

## Resources

### Books

- _Test Driven Development: By Example_ - Kent Beck
- _Growing Object-Oriented Software, Guided by Tests_ - Freeman & Pryce
- _The Art of Unit Testing_ - Roy Osherove

### Articles

- [Martin Fowler on TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Uncle Bob's Three Laws of TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)

### Online Courses

- Test-Driven Development courses on platforms like Pluralsight, Udemy, Coursera

---

## Customization Instructions

To adapt this template:

1. Replace `[language]` with your programming language
2. Replace `[test coverage command]` with your framework's coverage command
3. Add framework-specific syntax examples
4. Include project-specific testing patterns
5. Add links to your testing documentation
6. Update examples to match your codebase style

---

**Remember**: TDD is a discipline that improves with practice. Start small, be patient, and trust the process!
