# Getting Started with Claude Code Best Practices

Welcome! This guide will help you get up and running with Claude Code in your projects using production-grade configurations and best practices.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [First Project Setup](#first-project-setup)
- [Running Your First Command](#running-your-first-command)
- [Understanding Claude Code Workflow](#understanding-claude-code-workflow)
- [Common Issues and Solutions](#common-issues-and-solutions)
- [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

### Required

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))

  ```bash
  node --version  # Should show v18.0.0 or higher
  ```

- **npm** >= 9.0.0 (comes with Node.js)

  ```bash
  npm --version  # Should show 9.0.0 or higher
  ```

- **Git** (for version control)

  ```bash
  git --version  # Any recent version works
  ```

- **Claude Code CLI** ([Installation Guide](https://github.com/anthropics/claude-code))
  ```bash
  claude-code --version
  ```

### Optional but Recommended

- **ESLint** and **Prettier** (for code quality)
- **Jest** (for testing)
- **TypeScript** (if using TypeScript)
- A code editor with Claude Code integration (VS Code, Cursor, etc.)

---

## Installation

### Step 1: Clone This Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/Claude-Code-Best-Practices.git

# Navigate to the directory
cd Claude-Code-Best-Practices

# Install dependencies
npm install
```

### Step 2: Verify Installation

```bash
# Check that all files are present
ls -la .claude/

# You should see:
# - CLAUDE.md
# - settings.json
# - .claudeignore
# - commands/
# - agents/
```

### Step 3: Make Commands Executable

```bash
# Make all custom commands executable
chmod +x .claude/commands/*.sh

# Verify
ls -l .claude/commands/
```

---

## Quick Start

### Option A: Use This Repository as a Template

The fastest way to get started is to copy the `.claude` directory to your existing project:

```bash
# From your project directory
cp -r /path/to/Claude-Code-Best-Practices/.claude ./

# Customize CLAUDE.md for your project
# Edit .claude/CLAUDE.md and update:
# - Project name
# - Tech stack
# - Specific coding standards
```

### Option B: Start From Scratch

If you prefer to build your own configuration:

1. **Create `.claude` directory**

   ```bash
   mkdir -p .claude/commands .claude/agents
   ```

2. **Copy individual files you need**

   ```bash
   # Copy CLAUDE.md template
   cp /path/to/Claude-Code-Best-Practices/.claude/CLAUDE.md ./.claude/

   # Copy settings.json
   cp /path/to/Claude-Code-Best-Practices/.claude/settings.json ./.claude/

   # Copy commands you want
   cp /path/to/Claude-Code-Best-Practices/.claude/commands/review.sh ./.claude/commands/
   ```

3. **Customize for your project**

---

## First Project Setup

Let's set up Claude Code for a new Node.js project step-by-step.

### 1. Initialize Your Project

```bash
# Create project directory
mkdir my-awesome-project
cd my-awesome-project

# Initialize npm
npm init -y

# Initialize git
git init

# Create basic structure
mkdir src tests
touch src/index.js tests/index.test.js
```

### 2. Copy Claude Code Configuration

```bash
# Copy the entire .claude directory
cp -r /path/to/Claude-Code-Best-Practices/.claude ./

# Or copy individual files
mkdir -p .claude/commands .claude/agents
cp /path/to/Claude-Code-Best-Practices/.claude/CLAUDE.md ./.claude/
cp /path/to/Claude-Code-Best-Practices/.claude/settings.json ./.claude/
cp /path/to/Claude-Code-Best-Practices/.claude/.claudeignore ./.claude/
```

### 3. Customize CLAUDE.md

Open `.claude/CLAUDE.md` and update the project-specific sections:

```markdown
# My Awesome Project - Claude Code Context

**Project Name**: My Awesome Project
**Tech Stack**: Node.js, Express, PostgreSQL, Jest
**Purpose**: RESTful API for task management

### Project Goals

1. Build scalable REST API
2. Achieve 90%+ test coverage
3. Follow RESTful best practices
4. Implement JWT authentication

[Keep the rest of the template...]
```

### 4. Configure settings.json

Review `.claude/settings.json` and adjust for your needs:

```json
{
  "version": "1.0.0",
  "denyList": [
    ".env",
    ".env.*",
    "*.pem",
    "*.key",
    // Add project-specific patterns
    "config/secrets.yml",
    "database.credentials.json"
  ]
  // ... rest of configuration
}
```

### 5. Set Up .gitignore

Ensure your `.gitignore` excludes sensitive files:

```bash
# Copy the comprehensive .gitignore
cp /path/to/Claude-Code-Best-Practices/.gitignore ./

# Or add to your existing .gitignore:
cat >> .gitignore << 'EOF'

# Claude Code
.claude/settings.local.json
.claude/temp/
EOF
```

### 6. Install Development Dependencies

```bash
# Install linting and formatting
npm install --save-dev eslint prettier eslint-config-prettier

# Install testing framework
npm install --save-dev jest

# Install TypeScript (if needed)
npm install --save-dev typescript @types/node
```

### 7. Configure Package Scripts

Add helpful scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .js,.ts",
    "lint:fix": "eslint . --ext .js,.ts --fix",
    "format": "prettier --write \"**/*.{js,ts,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,ts,json,md}\""
  }
}
```

---

## Running Your First Command

Now that your project is set up, let's try the custom commands.

### 1. Run Code Review

```bash
# Review entire project
./.claude/commands/review.sh

# Review specific directory
./.claude/commands/review.sh src/

# Example output:
# === Code Review Starting ===
# Target: src/
#
# ## Security Analysis
# [CRITICAL] src/auth.js:23 - Potential hardcoded API key detected
#
# ## Performance Analysis
# [MEDIUM] src/utils.js:45 - Nested loop detected
#
# ## Code Quality Analysis
# [INFO] src/index.js:12 - TODO/FIXME comment found
```

### 2. Fix Linting Issues

```bash
# Preview changes without applying
./.claude/commands/fix-lint.sh --dry-run

# Apply fixes
./.claude/commands/fix-lint.sh

# Fix only staged files (useful in pre-commit hooks)
./.claude/commands/fix-lint.sh --staged

# Strict mode (fail on warnings)
./.claude/commands/fix-lint.sh --strict
```

### 3. Create a Commit

```bash
# Stage your changes
git add src/index.js tests/index.test.js

# Generate conventional commit message
./.claude/commands/conventional-commit.sh

# Example interaction:
# === Conventional Commit Generator ===
# Staged changes detected
#
# Analyzing 2 staged file(s)...
#
# Generated commit message:
# feat(src): add index
#
# Use this commit message? [Y/n/e(dit)]
```

---

## Understanding Claude Code Workflow

### The Development Cycle

Claude Code works best when integrated into your development workflow:

```
1. Write Code
   ↓
2. Use Claude Code for assistance
   - Ask questions
   - Generate code
   - Refactor
   ↓
3. Run /review command
   - Catch security issues
   - Identify performance problems
   - Find code quality issues
   ↓
4. Run /fix-lint
   - Auto-fix style issues
   - Format code
   ↓
5. Write/Run Tests
   - Follow TDD practices from CLAUDE.md
   ↓
6. Run /conventional-commit
   - Create properly formatted commit
   ↓
7. Push & Create PR
```

### How Claude Code Uses Your Configuration

When you interact with Claude Code, it automatically:

1. **Reads `.claude/CLAUDE.md`**
   - Understands your project context
   - Follows your coding standards
   - Uses your TDD templates

2. **Respects `.claude/settings.json`**
   - Won't access denied files
   - Uses only allowed tools
   - Applies security rules

3. **Honors `.claude/.claudeignore`**
   - Skips ignored files completely
   - Protects sensitive data

### Example Session

```
You: "Create a user authentication endpoint following our standards"

Claude Code:
1. Reads .claude/CLAUDE.md for coding standards
2. Sees TDD workflow requirement
3. Writes test first (Red phase)
4. Implements minimal code to pass (Green phase)
5. Refactors for quality (Refactor phase)
6. Follows security guidelines from CLAUDE.md
7. Uses proper error handling patterns
```

---

## Common Issues and Solutions

### Issue 1: Commands Not Executable

**Symptom:**

```bash
./claude/commands/review.sh
-bash: ./.claude/commands/review.sh: Permission denied
```

**Solution:**

```bash
chmod +x .claude/commands/*.sh
```

### Issue 2: Claude Code Not Reading CLAUDE.md

**Symptom:** Claude doesn't seem to follow your coding standards

**Solution:**

1. Verify file location: `.claude/CLAUDE.md` (not `.claude/claude.md`)
2. Check file permissions: `ls -l .claude/CLAUDE.md`
3. Restart Claude Code session
4. Explicitly reference it: "Following the standards in .claude/CLAUDE.md..."

### Issue 3: ESLint/Prettier Not Found

**Symptom:**

```bash
./.claude/commands/fix-lint.sh
ESLint configuration found but eslint command not available
```

**Solution:**

```bash
# Install locally
npm install --save-dev eslint prettier

# Or globally
npm install -g eslint prettier
```

### Issue 4: Git Commands Fail

**Symptom:**

```bash
./.claude/commands/conventional-commit.sh
Error: Not a git repository
```

**Solution:**

```bash
# Initialize git if not already done
git init

# Or run from repository root
cd $(git rev-parse --show-toplevel)
./.claude/commands/conventional-commit.sh
```

### Issue 5: Settings Not Applied

**Symptom:** Claude Code accesses files it shouldn't

**Solution:**

1. Check `.claude/settings.json` syntax (must be valid JSON)
2. Verify deny list patterns match your files
3. Remember: `.claudeignore` takes precedence over `settings.json`
4. Check for typos in file patterns

### Issue 6: Commands Run Slowly

**Symptom:** `/review` command takes minutes to complete

**Solution:**

```bash
# Review specific directories instead of entire project
./.claude/commands/review.sh src/

# Exclude large directories
# Add to .claudeignore:
vendor/
node_modules/
dist/
```

---

## Next Steps

### Beginner Track

1. **Explore CLAUDE.md**
   - Read the coding standards
   - Review the TDD templates
   - Understand the workflows

2. **Try the Commands**
   - Run `/review` on a small file
   - Use `/fix-lint` to clean up code
   - Create a commit with `/conventional-commit`

3. **Read More Documentation**
   - [Security Best Practices](02-security-best-practices.md)
   - [Prompt Engineering](05-prompt-engineering.md)

### Intermediate Track

1. **Customize Your Configuration**
   - Adapt CLAUDE.md to your team's standards
   - Add project-specific deny list patterns
   - Create custom commands for your workflow

2. **Integrate with CI/CD**
   - Add `/review` to pre-commit hooks
   - Run `/fix-lint --strict` in CI pipeline
   - Enforce conventional commits

3. **Read Advanced Topics**
   - [Token Optimization](03-token-optimization.md)
   - [Git Workflow Integration](04-git-workflow.md)
   - [Advanced Usage](06-advanced-usage.md)

### Advanced Track

1. **Create Custom Agents**
   - Study the code-reviewer agent
   - Build domain-specific agents
   - Integrate with your tooling

2. **Optimize Performance**
   - Fine-tune token usage
   - Implement caching strategies
   - Use agent specialization

3. **Contribute Back**
   - Share your custom commands
   - Improve documentation
   - Report issues and suggest enhancements

---

## Resources

### Official Documentation

- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Anthropic Documentation](https://docs.anthropic.com/)

### Community

- [GitHub Discussions](https://github.com/yourusername/Claude-Code-Best-Practices/discussions)
- [GitHub Issues](https://github.com/yourusername/Claude-Code-Best-Practices/issues)

### Learning Resources

- [TDD Demo Example](../examples/tdd-demo/) (coming in Stage 6)
- [Code Review Examples](../examples/refactoring-legacy/) (coming in Stage 6)

---

## Quick Reference Card

```bash
# Review code
./.claude/commands/review.sh [path]

# Fix linting
./.claude/commands/fix-lint.sh [--dry-run] [--strict] [--staged]

# Create commit
git add <files>
./.claude/commands/conventional-commit.sh

# Update configuration
vim .claude/CLAUDE.md        # Edit project context
vim .claude/settings.json    # Edit security settings
vim .claude/.claudeignore    # Edit file exclusions
```

---

**Next**: [Security Best Practices](02-security-best-practices.md) →

**Need help?** Open an issue on [GitHub](https://github.com/yourusername/Claude-Code-Best-Practices/issues)
