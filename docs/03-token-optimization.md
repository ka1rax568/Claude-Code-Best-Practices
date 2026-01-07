# Token Optimization for Claude Code

Strategies to maximize efficiency and minimize costs when using Claude Code in large codebases.

## Table of Contents

- [Understanding Token Usage](#understanding-token-usage)
- [Context Window Management](#context-window-management)
- [Efficient Prompting](#efficient-prompting)
- [Large Codebase Strategies](#large-codebase-strategies)
- [Caching and Reuse](#caching-and-reuse)
- [Measurement and Monitoring](#measurement-and-monitoring)
- [Cost Optimization](#cost-optimization)

---

## Understanding Token Usage

### What Are Tokens?

Tokens are the basic units of text that Claude processes:

```
"Hello, world!" ≈ 4 tokens
"function getUserById(id) { }" ≈ 9 tokens
```

**Approximate Conversions:**

- 1 token ≈ 0.75 words (English)
- 1 token ≈ 4 characters
- 100 tokens ≈ 75 words ≈ 1-2 sentences of code

### Token Costs

**Input Tokens** (what you send to Claude):

- Reading files
- Your prompts
- Conversation history
- CLAUDE.md context

**Output Tokens** (what Claude generates):

- Code Claude writes
- Explanations
- Responses

**Cost Ratio:**

- Output tokens typically cost 3-5x more than input tokens
- Focus optimization on reducing unnecessary inputs

### Where Tokens Are Consumed

**High Token Usage:**

```
❌ "Please read all files in src/ and refactor them"
   → Reads 50 files × 500 tokens = 25,000 tokens

❌ "Rewrite this entire 1000-line file"
   → Input: 1,000 lines × 10 tokens = 10,000 tokens
   → Output: 1,000 lines × 10 tokens = 10,000 tokens
   → Total: 20,000 tokens (output costs more!)
```

**Low Token Usage:**

```
✅ "In src/auth.js line 45, change validateUser to validateEmail"
   → Input: Specific file + line + instruction = ~100 tokens
   → Output: Modified line only = ~20 tokens
   → Total: 120 tokens
```

**Token Usage Formula:**

```
Total Tokens = Context + Prompt + History + Output
Where:
- Context = CLAUDE.md + other config files
- Prompt = Your request
- History = Previous conversation messages
- Output = Claude's response
```

---

## Context Window Management

### The 200K Token Window

Claude Code has a 200,000 token context window:

```
┌─────────────────────────────────────┐
│ Total: 200,000 tokens               │
├─────────────────────────────────────┤
│ CLAUDE.md: ~5,000 tokens            │
│ Conversation history: ~20,000       │
│ Current request: ~10,000            │
│ Available for response: ~165,000    │
└─────────────────────────────────────┘
```

### Automatic Summarization

Configure in `.claude/settings.json`:

```json
{
  "context": {
    "maxTokens": 100000,
    "summarizeOldMessages": true,
    "summarizeThreshold": 50000
  }
}
```

**How it Works:**

```
1. Conversation reaches 50,000 tokens
2. Oldest messages automatically summarized
3. Summaries replace full messages
4. Context window stays under limit
5. Recent messages remain fully detailed
```

**Example Summarization:**

```
Before (5,000 tokens):
User: "Create a user authentication system with JWT..."
Assistant: "I'll create a comprehensive authentication system...
[Full 4,000 token response with code]"

After (500 tokens):
Summary: "Created JWT-based authentication system with
login, logout, and token refresh endpoints in src/auth/"
```

### Incremental Edits vs. Full Rewrites

**❌ Inefficient - Full File Rewrite:**

```
User: "Add error handling to getUserById"

Claude reads entire 500-line file (5,000 tokens)
Claude rewrites entire file (5,000 tokens output)
Total: 10,000 tokens
```

**✅ Efficient - Incremental Edit:**

```
User: "In src/users.js line 45, add try-catch around the
database query in getUserById"

Claude reads specific function (100 tokens)
Claude outputs only the modified section (50 tokens)
Total: 150 tokens
```

**Best Practice:**

```javascript
// Instead of: "Rewrite this file with better error handling"
// Say: "Add try-catch to the getUserById function at line 45"

// Claude uses Edit tool:
Edit(
  file: "src/users.js",
  old_string: "const user = await db.query('SELECT...')",
  new_string: "try {\n  const user = await db.query('SELECT...')\n} catch (error) {\n  logger.error('Database error', error);\n  throw error;\n}"
)

// Tokens used: ~100 (vs 10,000 for full rewrite)
```

### Selective File Reading

**❌ Reading Entire Directory:**

```
User: "Review all code in src/"

Claude reads:
- src/users.js (5,000 tokens)
- src/posts.js (3,000 tokens)
- src/comments.js (4,000 tokens)
- src/auth.js (6,000 tokens)
Total: 18,000 tokens (before even starting review!)
```

**✅ Targeted Reading:**

```
User: "Review the authentication logic in src/auth.js,
specifically the validateToken function"

Claude reads:
- src/auth.js (6,000 tokens)
- Focuses on validateToken function
Total: 6,000 tokens (67% reduction)
```

**Use Grep First:**

```
User: "Find all files that use the deprecated oldApi function,
then show me the first occurrence"

1. Claude runs grep (50 tokens)
2. Finds 5 files
3. Reads only the first file (1,000 tokens)
Total: 1,050 tokens

vs. reading all 5 files = 5,000+ tokens
```

---

## Efficient Prompting

### Be Specific, Not Verbose

**❌ Verbose (500 tokens):**

```
I would like you to please help me with creating a function that
can handle user authentication. The function should be able to
accept a username and password, and then it should check if these
credentials are valid by querying the database. If they are valid,
it should return a success message, but if they're not valid, it
should return an error message. Also, please make sure to handle
any potential errors that might occur during the database query,
and use async/await syntax because we're using that throughout
the project. Oh, and it would be great if you could also add some
comments to explain what the code is doing.
```

**✅ Concise (50 tokens):**

```
Create an async validateUser(username, password) function that:
1. Queries database for credentials
2. Returns true if valid, false if not
3. Handles database errors
4. Uses async/await
```

**Token Savings: 90%**

### Use References Instead of Repetition

**❌ Repetitive:**

```
User: "In src/users.js, the getUserById function..."
[Claude responds]

User: "Now in src/users.js, the getUserById function, add validation..."
[Repeats context every time]
```

**✅ Use References:**

```
User: "In src/users.js, the getUserById function..."
[Claude responds]

User: "In that same function, add validation..."
[Claude knows context]
```

### Leverage CLAUDE.md Context

**❌ Repeating Standards:**

```
User: "Create a user model. Use camelCase for variables,
PascalCase for classes, add JSDoc comments, handle errors
with try-catch, and write tests first using Jest..."
[Repeating standards every time = 200+ tokens per request]
```

**✅ Reference CLAUDE.md:**

```
User: "Create a user model following our standards"
[Claude reads CLAUDE.md once = 5,000 tokens]
[Subsequent requests = 10 tokens: "following our standards"]
```

**One-Time Context Load:**

```
CLAUDE.md loaded: 5,000 tokens (one time)
100 requests × 10 tokens = 1,000 tokens

vs.

100 requests × 200 tokens = 20,000 tokens
Savings: 14,000 tokens (70% reduction)
```

### Batch Related Operations

**❌ Sequential Individual Requests:**

```
User: "Add userId field to Post model"
[Claude reads Post model: 1,000 tokens]

User: "Add createdAt field to Post model"
[Claude reads Post model again: 1,000 tokens]

User: "Add updatedAt field to Post model"
[Claude reads Post model again: 1,000 tokens]

Total: 3,000 tokens for file reading alone
```

**✅ Batched Request:**

```
User: "Add these fields to Post model: userId, createdAt, updatedAt"
[Claude reads Post model once: 1,000 tokens]

Total: 1,000 tokens (67% reduction)
```

---

## Large Codebase Strategies

### Modular Architecture

**Organize by Feature:**

```
src/
├── users/
│   ├── users.controller.js
│   ├── users.service.js
│   ├── users.model.js
│   └── users.test.js
├── posts/
│   ├── posts.controller.js
│   ├── posts.service.js
│   ├── posts.model.js
│   └── posts.test.js
```

**Benefits for Token Usage:**

- Work on one feature at a time
- Related files grouped together
- Smaller, focused contexts
- Less cross-referencing needed

**Example:**

```
❌ "Review the entire application"
   → Reads all files: 100,000+ tokens

✅ "Review the users feature"
   → Reads users/ directory only: 5,000 tokens
```

### Agent Specialization

**Use Multiple Specialized Agents:**

```
┌─────────────────────────────────────┐
│ Main Agent                          │
│ - Coordination                      │
│ - High-level decisions              │
│ - Delegates to specialists          │
└─────────────────────────────────────┘
         │
         ├──> Security Agent (focused on auth code)
         ├──> Performance Agent (focused on queries)
         └──> Test Agent (focused on test files)
```

**Token Efficiency:**

```
Single agent reviewing entire codebase:
- Loads all files: 50,000 tokens
- Reviews everything: 20,000 tokens output
- Total: 70,000 tokens

Three specialized agents:
- Each loads relevant files: 3 × 5,000 = 15,000 tokens
- Each reviews their area: 3 × 2,000 = 6,000 tokens
- Total: 21,000 tokens (70% reduction)
```

### Summary Files

**Create Module Summaries:**

```javascript
// src/users/README.md
/**
 * Users Module
 *
 * Handles user management including:
 * - Registration (users.controller.js:createUser)
 * - Authentication (users.service.js:validateCredentials)
 * - Profile updates (users.controller.js:updateUser)
 *
 * Database: users table (users.model.js)
 * Tests: users.test.js (95% coverage)
 */
```

**Usage:**

```
❌ "How does user registration work?"
   → Reads entire users module: 10,000 tokens

✅ "Read users/README.md then explain registration"
   → Reads summary (200 tokens) + specific function (500 tokens)
   → Total: 700 tokens (93% reduction)
```

### Lazy Loading Pattern

**Load Files Only When Needed:**

```
User: "Review the application architecture"

Claude:
1. Reads directory structure (100 tokens)
2. Reads README.md (500 tokens)
3. Reads package.json (200 tokens)
Total so far: 800 tokens

User: "Now look at the authentication implementation"

Claude:
4. Reads src/auth/ files (5,000 tokens)
Total: 5,800 tokens

vs. reading everything upfront: 50,000 tokens
```

---

## Caching and Reuse

### Session Persistence

**Reuse Context Across Sessions:**

```
Session 1:
- Load CLAUDE.md: 5,000 tokens
- Work on users feature: 10,000 tokens
- Total: 15,000 tokens

Session 2 (same project):
- CLAUDE.md cached from Session 1: 0 tokens
- Work on posts feature: 10,000 tokens
- Total: 10,000 tokens (33% savings)
```

**Enable Caching:**

```json
{
  "context": {
    "cacheEnabled": true,
    "cacheExpiry": 86400 // 24 hours
  }
}
```

### Template Reuse

**Create Reusable Prompts:**

```javascript
// .claude/templates/create-endpoint.md
Create a new {METHOD} {ENDPOINT} endpoint:

1. Add route to {ROUTER_FILE}
2. Create controller function in {CONTROLLER_FILE}
3. Add validation for {FIELDS}
4. Write tests in {TEST_FILE}
5. Update API documentation

Follow TDD workflow from CLAUDE.md.
```

**Usage:**

```
❌ Writing full instructions each time: 200 tokens × 10 endpoints = 2,000 tokens

✅ Using template: 50 tokens × 10 endpoints = 500 tokens
```

### Code Generation Templates

**Use Snippets for Common Patterns:**

```
User: "Create CRUD endpoints for Product model using template"

Claude:
1. Reads template (100 tokens)
2. Generates all 5 endpoints (500 tokens output)
Total: 600 tokens

vs. explaining each endpoint individually: 2,000+ tokens
```

---

## Measurement and Monitoring

### Tracking Token Usage

**Add to .claude/settings.json:**

```json
{
  "monitoring": {
    "logTokenUsage": true,
    "logFile": ".claude/token-usage.log"
  }
}
```

**Log Format:**

```json
{
  "timestamp": "2026-01-07T01:00:00Z",
  "request": "Create user endpoint",
  "inputTokens": 1500,
  "outputTokens": 800,
  "totalTokens": 2300,
  "cost": 0.0023
}
```

### Analyzing Usage Patterns

**Find High-Usage Operations:**

```bash
# Top 10 most expensive requests
cat .claude/token-usage.log | jq -s 'sort_by(.totalTokens) | reverse | .[0:10]'

# Average tokens per request type
cat .claude/token-usage.log | jq -s 'group_by(.request) | map({request: .[0].request, avg: (map(.totalTokens) | add / length)})'

# Daily token usage
cat .claude/token-usage.log | jq -s 'group_by(.timestamp | split("T")[0]) | map({date: .[0].timestamp | split("T")[0], total: (map(.totalTokens) | add)})'
```

### Setting Budgets

**Per-Session Limits:**

```json
{
  "budget": {
    "maxTokensPerSession": 50000,
    "maxTokensPerRequest": 10000,
    "alertThreshold": 40000
  }
}
```

**Alert When Approaching Limit:**

```
⚠️  Token Usage Alert
─────────────────────────────
Current session: 42,000 / 50,000 tokens (84%)
Approaching limit. Consider:
- Starting new session
- Using more targeted requests
- Clearing conversation history
```

---

## Cost Optimization

### Cost Calculation

**Pricing (example):**

```
Input tokens:  $3 / million tokens
Output tokens: $15 / million tokens
```

**Example Request:**

```
Input: 10,000 tokens × $3/M = $0.03
Output: 2,000 tokens × $15/M = $0.03
Total: $0.06 per request
```

**Monthly Usage:**

```
100 requests/day × 30 days = 3,000 requests
3,000 × $0.06 = $180/month
```

### Optimization Strategies

**1. Reduce Output Generation:**

```
❌ "Rewrite this 500-line file"
   Cost: $0.15 (mostly output tokens)

✅ "Show me the changes needed for this file"
   Cost: $0.03 (explanation vs full code)
```

**2. Use Diffs Instead of Full Files:**

```
❌ Generate full file: 5,000 output tokens
✅ Generate diff: 200 output tokens
Savings: 96%
```

**3. Batch Operations:**

```
❌ 10 separate requests: 10 × $0.06 = $0.60
✅ 1 batched request: 1 × $0.10 = $0.10
Savings: 83%
```

**4. Cache Frequently Used Context:**

```
CLAUDE.md loaded 100 times:
100 × 5,000 tokens = 500,000 input tokens = $1.50

CLAUDE.md cached:
1 × 5,000 tokens = 5,000 input tokens = $0.015
Savings: 99%
```

### ROI Calculation

**Developer Time Saved:**

```
Manual code review: 2 hours × $100/hour = $200
Automated /review: 2 minutes + $0.10 = $0.10

ROI: (200 - 0.10) / 0.10 = 1,999x return
```

**Quality Improvement:**

```
Bugs caught by /review: 5
Cost to fix in production: 5 × $500 = $2,500
Cost of /review: $0.10

ROI: $2,500 / $0.10 = 25,000x return
```

---

## Best Practices Summary

### Do's ✅

1. **Be Specific**: Target exact files and line numbers
2. **Use Incremental Edits**: Edit tool > full rewrites
3. **Batch Operations**: Combine related requests
4. **Leverage CLAUDE.md**: Write standards once, reference forever
5. **Use References**: "that function" vs repeating context
6. **Grep First**: Find before reading
7. **Monitor Usage**: Track and analyze token consumption
8. **Enable Caching**: Reuse context across sessions

### Don'ts ❌

1. **Don't Read Entire Directories**: Be selective
2. **Don't Repeat Instructions**: Use CLAUDE.md
3. **Don't Generate Full Files**: Use diffs and edits
4. **Don't Load Unnecessary Context**: Lazy load
5. **Don't Ignore Token Costs**: Monitor and optimize
6. **Don't Skip Summarization**: Let old context summarize

### Quick Wins

**Easy optimizations with big impact:**

1. **Add CLAUDE.md** → 70% reduction in repeated instructions
2. **Use Edit tool** → 95% reduction vs full file rewrites
3. **Enable caching** → 99% reduction on repeated context
4. **Batch requests** → 50-80% reduction in total tokens
5. **Target specific files** → 90% reduction vs directory reads

---

## Example: Before and After

### Before Optimization

```
User: "I want to add error handling to the getUserById function.
The function should handle cases where the user is not found,
database errors, and invalid input. Use try-catch blocks and
return appropriate error messages. Follow our coding standards
for error handling which include logging errors, throwing custom
error types, and using async/await."

Claude:
- Reads entire users.js file: 5,000 tokens
- Generates entire file with changes: 5,000 tokens
- Total: 10,000 tokens
- Cost: $0.105
```

### After Optimization

```
User: "Add error handling to getUserById (users.js:45) per CLAUDE.md standards"

Claude:
- Reads getUserById function only: 200 tokens
- Uses Edit tool for changes: 100 tokens
- References CLAUDE.md (cached): 0 tokens
- Total: 300 tokens
- Cost: $0.003
```

**Results:**

- Token reduction: 97%
- Cost reduction: 97%
- Time savings: Same output quality, faster response

---

**Next**: [Git Workflow Integration](04-git-workflow.md) →

**Previous**: [Security Best Practices](02-security-best-practices.md) ←
