# Prompt Engineering Guide

**Master the art of communicating with Claude Code for maximum productivity**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prompt Anatomy](#prompt-anatomy)
3. [Effective Prompting Techniques](#effective-prompting-techniques)
4. [Task-Specific Prompts](#task-specific-prompts)
5. [Context Management](#context-management)
6. [Multi-Step Workflows](#multi-step-workflows)
7. [Error Handling](#error-handling)
8. [Advanced Patterns](#advanced-patterns)
9. [Common Pitfalls](#common-pitfalls)

---

## Introduction

Effective prompt engineering is the key to unlocking Claude Code's full potential. This guide teaches you how to communicate your intent clearly, provide the right context, and structure complex tasks for optimal results.

### Why Prompt Engineering Matters

- **Efficiency**: Get accurate results on the first try
- **Quality**: Receive well-structured, maintainable code
- **Context Control**: Minimize token usage while providing necessary information
- **Predictability**: Understand how Claude Code will interpret your requests

---

## Prompt Anatomy

### Basic Structure

Every effective prompt has three components:

```
[INTENT] + [CONTEXT] + [CONSTRAINTS]
```

**Example:**

```
INTENT: "Implement user authentication"
CONTEXT: "Using JWT tokens with bcrypt for password hashing"
CONSTRAINTS: "Follow the existing auth pattern in src/middleware/auth.js"
```

**Complete Prompt:**

```
Implement user authentication using JWT tokens with bcrypt for password hashing.
Follow the existing auth pattern in src/middleware/auth.js.
```

### Components Breakdown

#### 1. Intent (The "What")

Be specific about what you want to achieve:

```
❌ "Fix the bug"
✅ "Fix the null pointer exception in getUserById when user doesn't exist"

❌ "Add validation"
✅ "Add email format validation to the user registration form"

❌ "Improve performance"
✅ "Optimize the database query in getUsersByRole to reduce execution time"
```

#### 2. Context (The "Why" and "Where")

Provide relevant background information:

```
✅ "The login function is failing for users with special characters in passwords.
   The issue appears to be in src/auth/login.js around line 45."

✅ "I need to add a new API endpoint for user profile updates.
   The existing user endpoints are in src/routes/users.js."

✅ "Following our TDD workflow, I want to add tests before implementing
   the password reset feature."
```

#### 3. Constraints (The "How")

Specify requirements, patterns, or limitations:

```
✅ "Use the existing error handling pattern with try-catch blocks"
✅ "Follow the conventional commit message format"
✅ "Ensure backward compatibility with the v1 API"
✅ "Keep changes minimal - only modify the necessary files"
```

---

## Effective Prompting Techniques

### 1. Be Specific

**Vague vs. Specific:**

| ❌ Vague         | ✅ Specific                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| "Add tests"      | "Add unit tests for the getUserById function covering success, not found, and invalid ID cases" |
| "Make it faster" | "Optimize the product search query by adding an index on the category column"                   |
| "Fix styling"    | "Align the submit button to the right and change its color to #007bff"                          |

### 2. Provide Examples

**Example-Driven Prompts:**

```
Create a new API endpoint for deleting users. Follow the same pattern as the
existing POST /users endpoint in src/routes/users.js:

- Use Express router
- Add input validation middleware
- Return 204 status on success
- Include error handling
```

### 3. Use Incremental Refinement

Break complex tasks into steps:

```
Step 1: "First, show me all the places where user passwords are currently handled"

Step 2: "Now, create a utility function for password hashing using bcrypt"

Step 3: "Update the registration endpoint to use the new password hashing function"

Step 4: "Add tests for the password hashing utility"
```

### 4. Reference Project Standards

Leverage your CLAUDE.md file:

```
✅ "Following our TDD workflow defined in CLAUDE.md, write tests first"
✅ "Use the error handling pattern from the Coding Standards section"
✅ "Follow the conventional commit format specified in our documentation"
```

### 5. Ask for Explanations

Request Claude Code to explain its reasoning:

```
"Explain why getUserById is returning null for valid IDs, then propose a fix"

"Analyze the performance bottleneck in the search function and suggest
 optimizations with trade-offs"

"Review the security implications of storing user tokens in localStorage
 vs. cookies"
```

---

## Task-Specific Prompts

### Debugging

**Pattern:**

```
[SYMPTOM] + [EXPECTED BEHAVIOR] + [RELEVANT CODE LOCATION]
```

**Examples:**

```
"The login endpoint returns 500 instead of 401 for invalid credentials.
 Expected: 401 status with error message 'Invalid credentials'
 Location: src/routes/auth.js line 23-45"
```

```
"User profile images aren't displaying after upload.
 Expected: Image URL should be returned and image should be accessible
 Relevant files: src/controllers/uploadController.js, src/services/storage.js"
```

### Feature Implementation

**Pattern:**

```
[FEATURE DESCRIPTION] + [ACCEPTANCE CRITERIA] + [IMPLEMENTATION APPROACH]
```

**Examples:**

```
"Implement user password reset functionality.

Acceptance criteria:
- User requests reset by providing email
- System sends reset token via email
- Token expires after 1 hour
- User can set new password using valid token

Approach:
- Follow existing email service pattern
- Use crypto for secure token generation
- Store tokens in database with expiry"
```

### Code Review

**Pattern:**

```
[REQUEST TYPE] + [FOCUS AREAS] + [CODE LOCATION]
```

**Examples:**

```
"Review the authentication middleware in src/middleware/auth.js for:
- Security vulnerabilities
- Error handling completeness
- Performance issues
- Code style consistency"
```

### Refactoring

**Pattern:**

```
[CURRENT PROBLEM] + [DESIRED STATE] + [CONSTRAINTS]
```

**Examples:**

```
"The UserService class has grown to 500 lines and handles too many responsibilities.

Desired state:
- Split into UserService, UserValidator, and UserRepository
- Each class has a single responsibility
- Maintain existing API compatibility

Constraints:
- Don't break existing tests
- Keep changes in the src/services/ directory"
```

### Testing

**Pattern:**

```
[TEST TYPE] + [COVERAGE REQUIREMENTS] + [SCENARIOS]
```

**Examples:**

```
"Write unit tests for the getUserById function.

Coverage requirements:
- Happy path: user exists
- Error cases: user not found, invalid ID, database error
- Edge cases: null/undefined ID

Use Jest with the existing test setup in tests/services/userService.spec.js"
```

---

## Context Management

### When to Provide Context

**Always Include:**

- Error messages and stack traces
- Relevant file paths
- Expected vs. actual behavior

**Sometimes Include:**

- Related code snippets (if not already in the file)
- Project structure overview
- Dependencies and versions

**Avoid:**

- Entire file dumps (let Claude read the file instead)
- Unrelated historical information
- Obvious context already in the conversation

### Efficient Context Provision

**❌ Inefficient:**

```
"Here's my entire userService.js file: [paste 500 lines of code]
Can you fix the bug?"
```

**✅ Efficient:**

```
"There's a bug in getUserById in src/services/userService.js around line 45.
When a user doesn't exist, it returns null instead of throwing UserNotFoundError.
Can you read the file and fix it?"
```

### File References

**Absolute Paths:**

```
✅ "Read src/services/userService.js"
❌ "Read the user service file"
```

**Line Numbers:**

```
✅ "The issue is in src/auth/login.js:23-45"
✅ "Update the validation logic at src/utils/validation.js:67"
```

### Leveraging Tool Memory

Claude Code remembers tool results within the session:

```
"Read src/services/userService.js"
[Claude reads the file]

"Now add error handling to the getUserById function"
[Claude has context from the previous read]

"Also add similar error handling to getUserByEmail"
[Claude still has the file context]
```

---

## Multi-Step Workflows

### Sequential Tasks

**Pattern:**

```
Task 1: [Description]
Then Task 2: [Description]
Finally Task 3: [Description]
```

**Example:**

```
Task 1: Read the existing authentication code in src/auth/
Task 2: Identify security vulnerabilities
Task 3: Create a plan to fix them with minimal breaking changes
```

### Conditional Workflows

**Pattern:**

```
If [CONDITION], then [ACTION A], otherwise [ACTION B]
```

**Example:**

```
"Check if we have a UserRepository class.
If yes, refactor UserService to use it.
If no, first create a UserRepository following the repository pattern,
then refactor UserService."
```

### Iterative Refinement

**Pattern:**

```
Initial Request → Review → Feedback → Refinement
```

**Example:**

```
You: "Create a user validation function"
Claude: [Creates basic validation]

You: "Add email format validation using regex"
Claude: [Updates function]

You: "Also validate password strength: min 8 chars, 1 uppercase, 1 number"
Claude: [Enhances validation]

You: "Extract validation rules to constants for reusability"
Claude: [Refactors with constants]
```

---

## Error Handling

### When Errors Occur

**Report Errors with Context:**

```
❌ "It didn't work"

✅ "The test failed with: 'TypeError: Cannot read property 'id' of null'
   in tests/userService.spec.js:23
   This happened after you added the getUserById function"
```

### Debugging Prompts

**Pattern:**

```
[ERROR MESSAGE] + [WHEN IT OCCURS] + [WHAT YOU TRIED]
```

**Example:**

```
"Error: 'Module not found: cannot resolve ./userService'

This occurs when running npm test after adding the new UserService class.

I tried:
- Checking the import path (looks correct)
- Verifying the file exists (it does at src/services/userService.js)

What's wrong?"
```

### Requesting Fixes

**Be Specific About Desired Outcome:**

```
❌ "Fix this"

✅ "Fix the null pointer error by adding a null check before accessing user.id"

✅ "Fix the failing test by mocking the database call in the test setup"
```

---

## Advanced Patterns

### Constraint-Based Prompts

**Define What NOT to Do:**

```
"Refactor the authentication system to use JWT tokens.

Constraints:
- Do NOT change the database schema
- Do NOT break existing API endpoints
- Do NOT introduce new dependencies
- Maintain backward compatibility with session-based auth"
```

### Comparison Prompts

**Ask for Trade-off Analysis:**

```
"Compare two approaches for implementing real-time notifications:

Approach A: WebSockets with Socket.io
Approach B: Server-Sent Events (SSE)

Analyze:
- Performance implications
- Browser compatibility
- Implementation complexity
- Scalability

Recommend one with justification."
```

### Template-Based Prompts

**Provide Structure:**

```
"Create a new API endpoint using this template:

Route: POST /api/[RESOURCE]
Validation: [LIST REQUIRED FIELDS]
Business Logic: [DESCRIBE OPERATION]
Response: [DEFINE SUCCESS/ERROR RESPONSES]
Tests: [LIST TEST SCENARIOS]

Fill in for creating a new blog post."
```

### Exploratory Prompts

**For Learning Codebases:**

```
"Explore how user authentication works in this codebase.

Questions to answer:
1. What authentication strategy is used? (JWT, sessions, OAuth, etc.)
2. Where are credentials validated?
3. How are routes protected?
4. Where is user session data stored?

Start by examining the auth middleware and routes."
```

---

## Common Pitfalls

### ❌ Pitfall 1: Over-Explaining

**Problem:**

```
"I want to add a function that takes a user ID as input, which is a string,
and then queries the database, which is PostgreSQL running on port 5432,
using the Sequelize ORM version 6.x, and returns the user object, which
should have id, name, email, and createdAt fields..."
```

**Solution:**

```
"Add a getUserById function that queries the database and returns the user object.
Follow the existing pattern in UserService."
```

### ❌ Pitfall 2: Under-Specifying

**Problem:**

```
"Add validation"
```

**Solution:**

```
"Add email and password validation to the user registration endpoint:
- Email: must be valid format
- Password: min 8 characters, 1 uppercase, 1 number, 1 special char"
```

### ❌ Pitfall 3: Assuming Context

**Problem:**

```
"Fix the bug in that function we discussed earlier"
```

**Solution:**

```
"Fix the null pointer bug in the getUserById function (src/services/userService.js:45)"
```

### ❌ Pitfall 4: Multiple Unrelated Requests

**Problem:**

```
"Add user authentication, fix the styling on the homepage, update the README,
and optimize database queries"
```

**Solution:**

```
Request 1: "Add user authentication using JWT tokens"
[Complete]

Request 2: "Fix the homepage styling: center the hero section and use #007bff for buttons"
[Complete]

Request 3: "Update README with installation instructions"
[Complete]
```

### ❌ Pitfall 5: Not Leveraging Tool Memory

**Problem:**

```
"Here's the content of userService.js: [paste entire file]
Now add a function"
```

**Solution:**

```
"Read src/services/userService.js"
[Claude reads]

"Now add a getUsersByRole function following the existing pattern"
[Claude has context]
```

---

## Prompt Templates

### Template: Bug Fix

```
BUG: [Description of unexpected behavior]
EXPECTED: [What should happen]
LOCATION: [File path and line numbers if known]
ERROR: [Error message if applicable]
CONTEXT: [When does it occur? What triggers it?]

Please:
1. Investigate the cause
2. Propose a fix
3. Explain why the bug occurred
```

### Template: Feature Implementation

```
FEATURE: [Feature name and description]

REQUIREMENTS:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

APPROACH:
- [Implementation detail 1]
- [Implementation detail 2]

CONSTRAINTS:
- [Constraint 1]
- [Constraint 2]

Follow [reference pattern/file] for consistency.
```

### Template: Code Review

```
REVIEW: [File or function name]

FOCUS AREAS:
- Security vulnerabilities
- Performance issues
- Code style and maintainability
- Test coverage
- Error handling

Provide:
1. Issues found (with severity: critical/major/minor)
2. Specific recommendations
3. Code examples for fixes
```

### Template: Refactoring

```
REFACTOR: [Component/file to refactor]

CURRENT PROBLEMS:
- [Problem 1]
- [Problem 2]

DESIRED STATE:
- [Goal 1]
- [Goal 2]

CONSTRAINTS:
- [Constraint 1]
- [Constraint 2]

Create a refactoring plan before making changes.
```

### Template: Testing

```
TEST: [Function/component to test]

TEST TYPE: [Unit/Integration/E2E]

SCENARIOS:
- Happy path: [describe]
- Error cases: [list]
- Edge cases: [list]

COVERAGE TARGET: [percentage or specific lines]

Use [testing framework and existing patterns].
```

---

## Best Practices Summary

### ✅ Do's

1. **Be Specific and Clear**
   - State exactly what you want
   - Provide relevant context
   - Define success criteria

2. **Use File References**
   - Reference files by path
   - Include line numbers when relevant
   - Let Claude read files instead of pasting content

3. **Break Down Complex Tasks**
   - One task at a time
   - Sequential steps for dependencies
   - Iterate and refine

4. **Leverage Project Context**
   - Reference CLAUDE.md standards
   - Point to existing patterns
   - Use consistent terminology

5. **Provide Feedback**
   - Confirm when results are correct
   - Specify what needs adjustment
   - Explain your reasoning

### ❌ Don'ts

1. **Don't Paste Large Code Blocks**
   - Use file references instead
   - Let Claude read the files
   - Focus on relevant sections

2. **Don't Assume Unstated Context**
   - Claude doesn't read your mind
   - Explicitly state requirements
   - Reference previous conversation if needed

3. **Don't Mix Multiple Tasks**
   - One request at a time
   - Complete each before moving on
   - Group related subtasks

4. **Don't Over-Constrain**
   - Specify outcomes, not implementation details
   - Trust Claude's judgment on "how"
   - Focus on "what" and "why"

5. **Don't Ignore Errors**
   - Report issues immediately
   - Provide full error messages
   - Include context about when they occur

---

## Real-World Examples

### Example 1: Implementing Authentication

**❌ Poor Prompt:**

```
"Add authentication"
```

**✅ Good Prompt:**

```
"Implement JWT-based authentication for the REST API.

Requirements:
- Login endpoint: POST /api/auth/login (accepts email/password)
- Returns JWT token valid for 24 hours
- Password hashing with bcrypt (10 rounds)
- Middleware to protect routes requiring authentication

Follow the error handling pattern in src/middleware/errorHandler.js.
Use the existing User model at src/models/User.js.

Following our TDD workflow, write tests first."
```

### Example 2: Debugging Performance

**❌ Poor Prompt:**

```
"The app is slow"
```

**✅ Good Prompt:**

```
"The /api/products search endpoint is taking 5-8 seconds to respond
when searching by category.

Expected: < 500ms response time

Relevant code: src/controllers/productController.js:45-78

I suspect it's doing a full table scan. Can you:
1. Analyze the current query
2. Identify the bottleneck
3. Propose optimization (indexing, query changes, caching)
4. Estimate performance improvement"
```

### Example 3: Code Refactoring

**❌ Poor Prompt:**

```
"Clean up the code"
```

**✅ Good Prompt:**

```
"Refactor the UserController class (src/controllers/UserController.js)
to improve maintainability.

Current problems:
- 400+ lines in single file
- Mixes business logic with HTTP handling
- Database queries directly in controller
- No separation of concerns

Desired state:
- Extract business logic to UserService
- Extract database operations to UserRepository
- Controller only handles HTTP (validation, response formatting)
- Follow the repository pattern used in ProductRepository

Constraints:
- Maintain existing API contract
- Don't break existing tests (update tests if needed)
- Complete one extraction at a time for review"
```

---

## Interactive Prompt Refinement

### Technique: Progressive Disclosure

Start broad, then refine based on Claude's questions:

```
You: "I need to add user authentication"

Claude: "I can help with that. A few questions:
1. What authentication method? (JWT, sessions, OAuth)
2. Where should tokens be stored? (localStorage, cookies, headers)
3. What routes need protection?
4. Any specific security requirements?"

You: "JWT tokens, stored in HTTP-only cookies, protect all /api/users/* routes,
     tokens should expire after 24 hours"

Claude: [Implements based on refined requirements]
```

### Technique: Clarification Loop

```
You: "The login is broken"

Claude: "I need more details to help:
- What error message do you see?
- What are the steps to reproduce?
- What's the expected behavior?
- Any relevant files or line numbers?"

You: "Error: 'Invalid credentials' for valid username/password.
     Steps: Go to /login, enter test@example.com / password123
     Expected: Should log in successfully
     File: src/controllers/authController.js"

Claude: [Investigates and fixes]
```

---

## Conclusion

Effective prompt engineering transforms Claude Code from a helpful assistant into a powerful development partner. Key takeaways:

1. **Clarity is King**: Specific, well-structured prompts yield better results
2. **Context Matters**: Provide just enough context, not too much
3. **Iterate and Refine**: Break complex tasks into manageable steps
4. **Learn from Examples**: Use templates and real-world patterns
5. **Leverage Tool Memory**: Let Claude read files instead of pasting content

**Practice Makes Perfect:**

Start with simple prompts and progressively experiment with advanced techniques. Over time, you'll develop intuition for how to communicate effectively with Claude Code.

---

**Next Steps:**

1. Review the [prompt templates](#prompt-templates) section
2. Practice with your current project
3. Explore [Advanced Usage Guide](./06-advanced-usage.md)
4. Share your own effective prompts with the community

---

**Related Documentation:**

- [Getting Started](./01-getting-started.md)
- [Git Workflow Guide](./04-git-workflow.md)
- [Advanced Usage](./06-advanced-usage.md)

**External Resources:**

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)
