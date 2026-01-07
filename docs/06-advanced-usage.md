# Advanced Usage Guide

**Unlock Claude Code's full potential with advanced techniques and workflows**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Custom Agents](#custom-agents)
3. [MCP Servers](#mcp-servers)
4. [Custom Commands](#custom-commands)
5. [Hooks and Automation](#hooks-and-automation)
6. [IDE Integration](#ide-integration)
7. [Performance Optimization](#performance-optimization)
8. [Advanced Git Workflows](#advanced-git-workflows)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

This guide covers advanced Claude Code features for power users and teams seeking to maximize productivity. Topics include custom agents, automation, integrations, and optimization techniques.

### Prerequisites

- Familiarity with basic Claude Code usage
- Understanding of Git workflows
- Experience with command-line tools
- Node.js and npm installed

---

## Custom Agents

Custom agents are specialized AI assistants that automate complex, multi-step tasks. They extend Claude Code's capabilities for project-specific workflows.

### Understanding Agents

**What is an Agent?**

An agent is a focused AI subprocess that autonomously handles specific tasks:

- **Code Review Agent**: Analyzes code for bugs, security issues, style violations
- **Test Generation Agent**: Creates comprehensive test suites
- **Documentation Agent**: Generates and maintains documentation
- **Refactoring Agent**: Systematically improves code structure

**When to Use Agents:**

- Repetitive, multi-file operations
- Complex analysis requiring deep codebase understanding
- Tasks requiring specialized domain knowledge
- Automated quality checks

### Creating a Custom Agent

**Directory Structure:**

```
.claude/
└── agents/
    └── your-agent-name/
        ├── AGENT.md          # Agent definition
        ├── prompt.txt        # System prompt
        └── config.json       # Configuration (optional)
```

**Step 1: Create Agent Directory**

**Prompt:**

```
Create a custom agent for generating API documentation from code comments.
Name it "api-doc-generator"
```

**Claude Code Response:**

```bash
mkdir -p .claude/agents/api-doc-generator
```

**Step 2: Define Agent Metadata**

Create `.claude/agents/api-doc-generator/AGENT.md`:

```markdown
# API Documentation Generator

**Purpose**: Automatically generate API documentation from JSDoc comments

**When to Use**: After adding new API endpoints or updating existing ones

**Capabilities**:

- Scans route definitions
- Extracts JSDoc comments
- Generates markdown documentation
- Updates API reference docs

**Usage**:
```

/agent api-doc-generator

```

**Options**:
- `--output`: Output file path (default: docs/api-reference.md)
- `--format`: Output format (markdown, html, json)
```

**Step 3: Create Agent Prompt**

Create `.claude/agents/api-doc-generator/prompt.txt`:

```
You are an API documentation generator agent.

Your task:
1. Find all route definitions in src/routes/
2. Extract JSDoc comments for each endpoint
3. Generate well-structured API documentation
4. Include request/response examples
5. Document error responses

Output format: Markdown with sections for each API resource.

Follow the documentation style in docs/api-reference.md.
```

**Step 4: Use the Agent**

**Prompt:**

```
Run the api-doc-generator agent to update API documentation
```

**Claude Code:**

```bash
# Agent automatically executes defined workflow
```

### Agent Best Practices

**✅ Do's:**

1. **Single Responsibility**: One agent, one task
2. **Clear Purpose**: Document when and how to use
3. **Idempotent**: Can run multiple times safely
4. **Error Handling**: Gracefully handle edge cases
5. **Output Format**: Consistent, predictable results

**❌ Don'ts:**

1. **Overly Broad**: Don't create "do everything" agents
2. **Side Effects**: Avoid unintended file modifications
3. **Hard-coded Paths**: Use configuration for flexibility
4. **No Validation**: Always validate inputs

---

## MCP Servers

Model Context Protocol (MCP) servers extend Claude Code with external data sources and tools.

### What is MCP?

MCP is a protocol that allows Claude Code to:

- Access external APIs
- Query databases
- Integrate with third-party services
- Fetch real-time data

### Installing MCP Servers

**Example: GitHub MCP Server**

**Prompt:**

```
Install and configure the GitHub MCP server to access repository data
```

**Claude Code Response:**

1. **Install MCP Package:**

```bash
npm install -g @anthropic-ai/mcp-server-github
```

2. **Configure in Claude Code:**

Create/update `~/.config/claude-code/config.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

3. **Set Environment Variable:**

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

4. **Verify Installation:**

**Prompt:**

```
List all open pull requests in this repository
```

**Claude Code:**

```bash
# Uses GitHub MCP server to fetch PRs
gh pr list --state open
```

### Creating Custom MCP Servers

**Use Cases:**

- Company-specific API integrations
- Internal tool access
- Database query interfaces
- Custom data sources

**Example: Database MCP Server**

**Prompt:**

```
Create a custom MCP server for querying our PostgreSQL database
```

**File: mcp-servers/postgres-server.js**

```javascript
import { MCPServer } from "@anthropic-ai/mcp-sdk";
import pg from "pg";

const server = new MCPServer({
  name: "postgres",
  version: "1.0.0",
});

// Database connection
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Define tool: Execute safe query
server.addTool({
  name: "query_users",
  description: "Query users table with filters",
  parameters: {
    type: "object",
    properties: {
      email: { type: "string" },
      limit: { type: "number", default: 10 },
    },
  },
  handler: async ({ email, limit }) => {
    const query =
      "SELECT id, email, created_at FROM users WHERE email LIKE $1 LIMIT $2";
    const result = await pool.query(query, [`%${email}%`, limit]);
    return result.rows;
  },
});

server.start();
```

**Configuration:**

```json
{
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["mcp-servers/postgres-server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "5432",
        "DB_NAME": "myapp",
        "DB_USER": "${DB_USER}",
        "DB_PASSWORD": "${DB_PASSWORD}"
      }
    }
  }
}
```

**Usage:**

**Prompt:**

```
Query users with email containing "example.com"
```

**Claude Code:**

```
# Uses custom MCP server
[Executes query_users tool with email filter]
```

---

## Custom Commands

Custom commands are shell scripts that extend Claude Code's functionality.

### Creating Custom Commands

**Directory Structure:**

```
.claude/
└── commands/
    ├── conventional-commit.sh
    ├── run-tests.sh
    └── deploy.sh
```

### Example: Test Runner Command

**File: `.claude/commands/run-tests.sh`**

```bash
#!/bin/bash

# Run tests with coverage and open report
#
# Usage: /run-tests [--watch] [--coverage]

set -e

WATCH=false
COVERAGE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --watch)
      WATCH=true
      shift
      ;;
    --coverage)
      COVERAGE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "🧪 Running tests..."

if [ "$WATCH" = true ]; then
  npm test -- --watch
elif [ "$COVERAGE" = true ]; then
  npm test -- --coverage
  echo "📊 Opening coverage report..."
  open coverage/lcov-report/index.html
else
  npm test
fi

echo "✅ Tests completed"
```

**Make Executable:**

```bash
chmod +x .claude/commands/run-tests.sh
```

**Usage:**

**Prompt:**

```
Run tests with coverage
```

**Claude Code:**

```bash
.claude/commands/run-tests.sh --coverage
```

### Example: Database Migration Command

**File: `.claude/commands/db-migrate.sh`**

```bash
#!/bin/bash

# Run database migrations
#
# Usage: /db-migrate [up|down|status]

set -e

ACTION=${1:-up}

case $ACTION in
  up)
    echo "📈 Running migrations..."
    npm run migrate:up
    ;;
  down)
    echo "📉 Reverting last migration..."
    npm run migrate:down
    ;;
  status)
    echo "📋 Migration status:"
    npm run migrate:status
    ;;
  *)
    echo "Usage: $0 [up|down|status]"
    exit 1
    ;;
esac

echo "✅ Migration complete"
```

### Command Best Practices

1. **Include Usage Documentation**: Add help text in comments
2. **Error Handling**: Use `set -e` to exit on errors
3. **Argument Parsing**: Support flags and options
4. **User Feedback**: Echo progress and results
5. **Make Executable**: `chmod +x` for all commands

---

## Hooks and Automation

Hooks trigger actions in response to Claude Code events.

### Available Hooks

- `pre-tool-call`: Before any tool execution
- `post-tool-call`: After tool execution
- `pre-commit`: Before git commits (via git hooks)
- `post-commit`: After git commits
- `user-prompt-submit`: After user submits a prompt

### Creating Hooks

**File: `.claude/hooks/pre-tool-call.sh`**

```bash
#!/bin/bash

# Log all tool calls for auditing
#
# Environment variables:
# - TOOL_NAME: Name of the tool being called
# - TOOL_ARGS: Arguments passed to the tool

LOGFILE=".claude/tool-audit.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] Tool: $TOOL_NAME" >> "$LOGFILE"
echo "Arguments: $TOOL_ARGS" >> "$LOGFILE"
echo "---" >> "$LOGFILE"
```

### Example: Auto-Formatting Hook

**File: `.claude/hooks/pre-commit.sh`**

```bash
#!/bin/bash

# Auto-format code before commits

echo "🎨 Formatting code..."

# Format JavaScript/TypeScript files
npm run format

# Add formatted files
git add -u

echo "✅ Code formatted"
```

### Example: Security Check Hook

**File: `.claude/hooks/user-prompt-submit.sh`**

```bash
#!/bin/bash

# Check for secrets in user prompts

PROMPT="$1"

# Detect potential secrets
if echo "$PROMPT" | grep -iE "(api[_-]?key|password|secret|token).*[:=].*['\"]?[A-Za-z0-9]{20,}"; then
  echo "⚠️  WARNING: Potential secret detected in prompt"
  echo "Please use environment variables instead of hardcoding secrets"
  exit 1
fi
```

---

## IDE Integration

Integrate Claude Code with your development environment.

### VS Code Integration

**Setup:**

1. **Install Extension** (if available)
2. **Configure Settings:**

```json
{
  "claude-code.enabled": true,
  "claude-code.autoActivate": true,
  "claude-code.shortcuts": {
    "explain": "Ctrl+Shift+E",
    "refactor": "Ctrl+Shift+R",
    "test": "Ctrl+Shift+T"
  }
}
```

### Terminal Integration

**Alias for Quick Access:**

Add to `.bashrc` or `.zshrc`:

```bash
alias cc="claude-code"
alias ccr="claude-code --resume"  # Resume last session
alias ccc="claude-code --config"  # Open config
```

**Function for Context-Aware Commands:**

```bash
# Quick commit with Claude Code
cccommit() {
  claude-code "Create a commit for the current changes"
}

# Quick test run
cctest() {
  claude-code "Run tests for $1"
}
```

---

## Performance Optimization

### Token Optimization Strategies

**1. Incremental Edits**

**❌ Inefficient:**

```
"Rewrite the entire userService.js file with better error handling"
[Claude rewrites 500 lines]
```

**✅ Efficient:**

```
"In userService.js, add error handling to the getUserById function at line 45"
[Claude edits specific lines]
```

**2. Targeted File Reads**

**❌ Inefficient:**

```
"Read all files in src/ and find where user validation happens"
```

**✅ Efficient:**

```
"Search for 'validateUser' function definition in src/"
[Uses grep to find specific file]
"Read src/utils/validation.js"
[Only reads relevant file]
```

**3. Use Grep Before Reading**

**❌ Inefficient:**

```
"Read all TypeScript files and find the User interface"
```

**✅ Efficient:**

```
"Search for 'interface User' in TypeScript files"
[Returns: src/types/user.ts:15]
"Read src/types/user.ts starting at line 10"
[Reads only relevant section]
```

### Caching Strategies

**Leverage Conversation Context:**

```
Session Start:
"Read src/services/userService.js"
[Claude reads and remembers]

"Add getUserById function"
[Uses cached file content]

"Now add getUserByEmail"
[Still using cached content]

"Add error handling to both functions"
[Still using cached content]
```

### Parallel Operations

**Sequential (Slow):**

```
"Read file1.js"
[waits]
"Read file2.js"
[waits]
"Read file3.js"
```

**Parallel (Fast):**

```
"Read these files in parallel:
- src/services/userService.js
- src/services/authService.js
- src/models/User.js"

[Claude uses parallel tool calls]
```

---

## Advanced Git Workflows

### Git Worktrees

**Use Case**: Work on multiple branches simultaneously without stashing.

**Prompt:**

```
Create a git worktree for the hotfix/critical-bug branch in ../hotfix directory
```

**Claude Code:**

```bash
git worktree add ../hotfix hotfix/critical-bug
```

**Benefits:**

- No branch switching
- Parallel development
- Independent working directories

### Git Bisect Automation

**Use Case**: Find bug-introducing commit automatically.

**Prompt:**

```
Use git bisect to find which commit introduced the login bug.
Test script: npm test -- login.spec.js
```

**Claude Code:**

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

git bisect run npm test -- login.spec.js
```

### Subtree Merging

**Use Case**: Include external repository as subdirectory.

**Prompt:**

```
Add the shared-components repository as a subtree in src/shared/
```

**Claude Code:**

```bash
git remote add shared-components https://github.com/org/shared-components.git
git fetch shared-components
git read-tree --prefix=src/shared/ -u shared-components/main
git commit -m "chore: add shared-components via subtree"
```

---

## CI/CD Integration

### GitHub Actions Integration

**Example: Auto-Review PRs with Claude Code**

**File: `.github/workflows/claude-review.yml`**

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Claude Code
        run: npm install -g claude-code

      - name: Run Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude-code "Review this PR for:
          - Security vulnerabilities
          - Performance issues
          - Code style violations
          - Missing tests

          Output findings as GitHub comment format"

      - name: Post Review Comment
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review-output.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
```

### Pre-commit CI Integration

**File: `.github/workflows/pre-commit.yml`**

```yaml
name: Pre-commit Checks

on: [push, pull_request]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Check coverage
        run: |
          npm run test:coverage
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Tool call timeout"

**Symptom**: Long-running commands timeout

**Solution**:

```
"Run the build with increased timeout"
```

**Claude Code:**

```bash
timeout 600 npm run build  # 10-minute timeout
```

#### Issue: "Out of context tokens"

**Symptom**: "Maximum context length exceeded"

**Solutions**:

1. **Break into smaller tasks**
2. **Use targeted file reads**
3. **Clear conversation history** (start new session)

#### Issue: "Permission denied"

**Symptom**: Cannot execute scripts

**Solution**:

```
"Make the script executable and run it"
```

```bash
chmod +x .claude/commands/my-script.sh
.claude/commands/my-script.sh
```

#### Issue: "MCP server not responding"

**Symptom**: MCP tools not available

**Debug Steps**:

```bash
# Check MCP server status
claude-code --mcp-status

# Restart MCP servers
claude-code --mcp-restart

# Check logs
cat ~/.config/claude-code/mcp-logs.txt
```

---

## Best Practices Summary

### ✅ Do's

1. **Use Agents for Repetitive Tasks**: Automate complex, multi-step workflows
2. **Leverage MCP for External Data**: Integrate with APIs and databases
3. **Create Custom Commands**: Standardize team workflows
4. **Set Up Hooks**: Automate quality checks and enforce standards
5. **Optimize for Performance**: Use targeted operations, parallel calls
6. **Integrate with CI/CD**: Automate reviews and checks
7. **Document Custom Tools**: Help team members understand and use tools

### ❌ Don'ts

1. **Don't Overcomplicate**: Simple solutions often best
2. **Don't Ignore Security**: Validate inputs, protect secrets
3. **Don't Hardcode Values**: Use configuration and environment variables
4. **Don't Skip Error Handling**: Gracefully handle edge cases
5. **Don't Forget Testing**: Test custom agents, commands, hooks

---

## Conclusion

Advanced Claude Code features enable:

- **Automation**: Reduce manual, repetitive work
- **Customization**: Tailor Claude Code to your workflow
- **Integration**: Connect with existing tools and services
- **Efficiency**: Maximize productivity with optimizations
- **Quality**: Automated checks and reviews

**Next Steps:**

1. Create your first custom agent
2. Set up git hooks for your project
3. Explore MCP server integrations
4. Integrate Claude Code into your CI/CD pipeline

---

**Related Documentation:**

- [Getting Started](./01-getting-started.md)
- [Security Best Practices](./02-security-best-practices.md)
- [Token Optimization](./03-token-optimization.md)
- [Git Workflow Guide](./04-git-workflow.md)
- [Prompt Engineering](./05-prompt-engineering.md)

**External Resources:**

- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Agent SDK Documentation](https://github.com/anthropics/claude-agent-sdk)
