# Contributing to Claude Code Best Practices

Thank you for your interest in contributing to this project! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation Guidelines](#documentation-guidelines)
- [Translation Guidelines](#translation-guidelines)
- [Testing Requirements](#testing-requirements)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Our Standards

**Positive behaviors include:**

- Using welcoming and inclusive language
- Respecting differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report:**

- Check the [existing issues](https://github.com/ka1rax568/Claude-Code-Best-Practices/issues) to avoid duplicates
- Collect relevant information (OS, Node.js version, Claude Code version, error messages)

**When submitting a bug report, include:**

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots or error logs if applicable
- Your environment details

### Suggesting Enhancements

**Enhancement suggestions are welcome for:**

- New custom commands or agents
- Documentation improvements
- New examples or use cases
- Tool optimizations

**When suggesting enhancements:**

- Use a clear, descriptive title
- Provide a detailed description of the proposed functionality
- Explain why this enhancement would be useful
- Include examples or mockups if applicable

### Contributing Code

**Good first issues:**

- Documentation typos or clarifications
- Adding code comments
- Writing additional test cases
- Improving error messages

**More involved contributions:**

- New custom commands
- Additional examples
- New documentation sections
- Agent improvements

---

## Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- **Claude Code CLI** ([installation guide](https://github.com/anthropics/claude-code))

### Initial Setup

```bash
# 1. Fork the repository on GitHub (click "Fork" button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Claude-Code-Best-Practices.git
cd Claude-Code-Best-Practices

# 3. Add upstream remote
git remote add upstream https://github.com/anthropics/Claude-Code-Best-Practices.git

# 4. Install root dependencies
npm install

# 5. Install TDD demo dependencies
cd examples/tdd-demo
npm install
cd ../..

# 6. Run tests to verify setup
npm test

# 7. Run TDD example tests
cd examples/tdd-demo && npm test && cd ../..
```

### Development Workflow

#### 1. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feat/your-feature-name

# Or for a bug fix
git checkout -b fix/bug-description
```

#### 2. Make Your Changes

Follow our [Coding Standards](#coding-standards) and:

- Write tests first (TDD approach)
- Keep changes focused and atomic
- Update documentation as needed
- Add examples if introducing new features

#### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Run formatter check
npm run format:check

# Run all tests
npm test

# Run TDD example tests
cd examples/tdd-demo && npm run test:coverage && cd ../..
```

#### 4. Commit Your Changes

Follow [Conventional Commits](#commit-message-guidelines):

```bash
# Stage your changes
git add .

# Commit with conventional message
git commit -m "feat(scope): add new feature"

# Or use our custom command
# (if you've copied .claude/ to this repo)
claude /conventional-commit
```

#### 5. Push and Create PR

```bash
# Push to your fork
git push origin feat/your-feature-name

# Go to GitHub and create a Pull Request
# from your branch to upstream/main
```

### Running Specific Tests

```bash
# Run specific test file
npm test -- path/to/test.spec.js

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run TDD example tests only
cd examples/tdd-demo
npm test
npm run test:watch
npm run test:coverage
```

### Local Development Tips

**Using Claude Code in this project:**

```bash
# The .claude/ directory contains configurations for this project
# You can test changes to commands/agents locally:

# 1. Make changes to .claude/commands/your-command.sh
# 2. Ensure it's executable: chmod +x .claude/commands/your-command.sh
# 3. Test it: claude /your-command

# For agents:
# 1. Edit .claude/agents/your-agent/AGENT.md
# 2. Test by prompting Claude Code to use the agent
```

**Testing Documentation Changes:**

```bash
# Check markdown formatting
npm run lint:markdown

# Check for broken links (requires internet)
npm run check:links

# Spell check
npm run spell:check
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Update your main branch
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main

# Rebase your feature branch (if needed)
git checkout feat/your-feature
git rebase main
```

### Troubleshooting

**Tests failing after setup:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For TDD example
cd examples/tdd-demo
rm -rf node_modules package-lock.json
npm install
cd ../..
```

**Claude Code not recognizing changes:**

```bash
# Restart Claude Code CLI
# Changes to .claude/ files are loaded when CLI starts
```

**Permission issues with commands:**

```bash
# Ensure commands are executable
chmod +x .claude/commands/*.sh
```

---

## Project Structure

```
.
├── .claude/                # Claude Code configurations
│   ├── CLAUDE.md          # Main configuration file
│   ├── settings.json      # Security and tool settings
│   ├── commands/          # Custom slash commands
│   └── agents/            # Specialized subagents
├── docs/                  # Documentation files
├── examples/              # Practical examples
│   └── tdd-demo/         # TDD demonstration project
├── templates/             # Reusable templates
└── tests/                 # Project-level tests
```

**Key files:**

- `.claude/CLAUDE.md`: Project context for Claude Code
- `PLAN.md`: Development roadmap
- `package.json`: Node.js project configuration

---

## Coding Standards

### JavaScript/Node.js Style Guide

We follow a strict style guide enforced by ESLint and Prettier:

**Naming Conventions:**

- `camelCase` for variables and functions
- `PascalCase` for classes and constructors
- `UPPER_SNAKE_CASE` for constants
- Descriptive names (avoid single letters except loop counters)

**Code Style:**

- 2 spaces for indentation (no tabs)
- Semicolons required
- Single quotes for strings (except to avoid escaping)
- Trailing commas in multi-line objects/arrays
- Max line length: 100 characters

**File Organization:**

- One class/module per file
- Group imports: built-in → external → internal
- Export at bottom of file

### Running Linters

```bash
# Check for style issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Check formatting
npm run format:check

# Auto-format files
npm run format
```

### Shell Scripts

For custom commands (`.claude/commands/*.sh`):

- Use `#!/bin/bash` shebang
- Include descriptive comments
- Use meaningful variable names
- Handle errors gracefully
- Exit with appropriate status codes

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build config)

### Examples

```
feat(commands): add /review command for automated code review

Implements comprehensive code review functionality including:
- Security vulnerability detection
- Performance analysis
- Best practice checks

Closes #42
```

```
fix(agent): handle empty file lists in code-reviewer

Previously crashed when no files were provided.
Now returns early with helpful message.

Fixes #58
```

```
docs(security): expand deny list configuration examples

Added examples for:
- Multi-environment setups
- Custom credential patterns
- Large monorepo scenarios
```

### Commit Message Rules

- Use imperative mood ("add feature" not "added feature")
- First line ≤ 72 characters
- Separate subject from body with blank line
- Reference issues/PRs in footer
- Explain _what_ and _why_, not _how_

---

## Pull Request Process

### Before Submitting

1. **Create a feature branch**

   ```bash
   git checkout -b feat/my-new-feature
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation

3. **Run all checks**

   ```bash
   npm run lint
   npm run format:check
   npm test
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/my-new-feature
   ```

### Creating the Pull Request

1. Go to the [original repository](https://github.com/ka1rax568/Claude-Code-Best-Practices)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Related Issues

Closes #123
```

### Review Process

1. **Automated checks**: CI will run tests and linters
2. **Maintainer review**: A maintainer will review your code
3. **Address feedback**: Make requested changes
4. **Approval**: Once approved, a maintainer will merge

### After Merge

- Delete your feature branch
- Update your fork's main branch
- Celebrate! 🎉

---

## Documentation Guidelines

### Writing Style

- **Clear and concise**: Use simple language
- **Active voice**: "Run the command" not "The command should be run"
- **Examples**: Include code examples for complex concepts
- **Structure**: Use headings, lists, and code blocks

### Documentation Types

**Conceptual docs** (`docs/*.md`):

- Explain _why_ and _when_ to use features
- Include diagrams if helpful
- Link to related docs

**Reference docs**:

- Describe _what_ each option does
- List all parameters
- Include examples for each option

**Tutorials** (`examples/*/README.md`):

- Step-by-step instructions
- Explain each step
- Show expected output

### Code Examples

- **Runnable**: All examples should work if copy-pasted
- **Commented**: Explain non-obvious code
- **Complete**: Include imports and setup
- **Tested**: Verify examples work

### Markdown Formatting

```markdown
# Top-level heading (one per document)

## Section heading

### Subsection heading

**Bold** for emphasis, _italic_ for terms

`inline code` for commands, file names, variables

\`\`\`bash

# Code block with language specified

npm install
\`\`\`

> Blockquote for important notes

- Bullet lists
- For items

1. Numbered lists
2. For sequential steps

[Link text](URL)
```

---

## Translation Guidelines

We maintain complete translations of all documentation in multiple languages. Currently supported:

- **English** (primary/source language)
- **简体中文 (Simplified Chinese)**

### Translation Standards

When translating documentation, follow these guidelines to maintain consistency:

#### File Naming Convention

```
English file:  filename.md
Chinese file:  filename.zh.md
```

All translated files should have the `.zh.md` suffix.

#### Language Switcher

**Every translated file must include a language switcher at the top:**

```markdown
> **语言 (Language)**: [English](filename.md) | 简体中文
```

For the English source file:

```markdown
> **Language (语言)**: English | [简体中文](filename.zh.md)
```

#### What to Translate

**DO translate:**

- Headings and subheadings
- Body text and descriptions
- Comments within code blocks (if they explain concepts)
- Image alt text and captions
- Table content (descriptive columns)
- Blockquote content

**DO NOT translate:**

- Code syntax and keywords
- File paths and directory names
- Command-line commands
- URLs (except anchor links)
- Technical terms commonly used in English:
  - Git, npm, Node.js, API, JWT, OAuth
  - Function/variable names in code examples
  - Configuration file names (`.env`, `package.json`)
- Version numbers and dates
- Badge URLs and shields

#### Code Block Guidelines

**Preserve all code blocks exactly:**

```javascript
// ✅ Good: Translate comments, keep code unchanged
// 这是一个示例函数
function getUserById(id) {
  return database.users.find(id);
}
```

**For bash commands, keep commands but translate comments:**

```bash
# 克隆仓库
git clone https://github.com/user/repo.git

# 安装依赖
npm install
```

#### Markdown Formatting

**Preserve exactly:**

- Heading levels (`#`, `##`, `###`)
- Code fence markers (` ``` `)
- List formatting (bullets, numbers, indentation)
- Table structure
- Line breaks and spacing
- HTML comments
- Anchor links (update to Chinese heading anchors)

#### Technical Terminology

Use standard Chinese translations for common technical terms:

| English | Chinese (简体中文) |
|---------|-------------------|
| repository | 仓库 |
| commit | 提交 |
| pull request | Pull Request (keep English) |
| branch | 分支 |
| documentation | 文档 |
| configuration | 配置 |
| security | 安全性 |
| best practices | 最佳实践 |
| workflow | 工作流程 |
| testing | 测试 |

**Keep in English:**
- Product names: Claude Code, GitHub, VS Code
- Technical acronyms: API, CLI, TDD, CI/CD
- File extensions: .js, .md, .json

### Translation Workflow

#### 1. Create Translation

```bash
# Create feature branch
git checkout -b i18n/translate-filename

# Create Chinese version
cp docs/filename.md docs/filename.zh.md

# Translate content following guidelines above
# Add language switcher to both files
```

#### 2. Verify Translation Quality

**Checklist:**

- [ ] Language switcher added to both English and Chinese files
- [ ] All headings translated
- [ ] All body text translated
- [ ] Code blocks preserved exactly (except comments)
- [ ] File paths and commands unchanged
- [ ] Technical terms handled appropriately
- [ ] Markdown formatting identical
- [ ] Anchor links updated for Chinese headings
- [ ] No translation artifacts (e.g., escaped characters)

#### 3. Test Rendering

```bash
# Preview markdown locally
# Check that links work, formatting is correct

# Verify language switcher links work
# - Click English → Chinese link
# - Click Chinese → English link
```

#### 4. Submit Translation PR

```bash
# Commit with clear message
git add docs/filename.md docs/filename.zh.md
git commit -m "feat(i18n): add Chinese translation for filename.md"

# Push and create PR
git push origin i18n/translate-filename
```

**PR Title Format:**
```
feat(i18n): add Chinese translation for [filename]
```

**PR Description Template:**
```markdown
## Translation Summary

Translates `filename.md` to Chinese (简体中文)

### Files Changed
- Added: `docs/filename.zh.md` (XXX lines)
- Modified: `docs/filename.md` (added language switcher)

### Translation Checklist
- [x] Language switcher added
- [x] All content translated
- [x] Code blocks preserved
- [x] Technical terms handled correctly
- [x] Formatting verified
- [x] Links tested

### Review Notes
[Any specific areas that need review or context]
```

### Updating Translations

When English source files are updated:

1. **Track changes**: Note what sections were modified
2. **Update Chinese version**: Apply equivalent changes to `.zh.md` file
3. **Maintain consistency**: Ensure translation style remains consistent
4. **Commit together**: Update both files in same commit

```bash
git add docs/filename.md docs/filename.zh.md
git commit -m "docs: update filename.md and Chinese translation"
```

### Translation Quality Standards

**Professional Quality:**
- Natural, fluent Chinese (not literal word-by-word translation)
- Appropriate technical terminology
- Consistent tone and style
- Grammar and punctuation correct

**Accuracy:**
- Meaning preserved from English source
- Technical accuracy maintained
- No missing or added content
- Context-appropriate translations

**Consistency:**
- Terminology consistent across all documents
- Formatting consistent with English source
- Style consistent with existing translations

### Translation Tools

**Recommended workflow:**
1. Use AI assistance (Claude Code) for initial translation
2. Manual review for technical accuracy
3. Native speaker review (when possible)
4. Test all links and code examples

**Example prompt for Claude Code:**
```
Translate this documentation to simplified Chinese following our guidelines:
1. Keep all code blocks, file paths, and commands in English
2. Translate headings and descriptive text
3. Preserve all markdown formatting
4. Add language switcher at top
5. Use standard technical term translations

[paste English content]
```

### Adding New Languages

To add support for a new language:

1. **Propose the language**: Open a discussion issue
2. **Get approval**: Wait for maintainer approval
3. **Establish conventions**: Define file suffix (e.g., `.fr.md` for French)
4. **Create initial translations**: Start with high-priority docs (README, getting started)
5. **Update language switcher**: Add new language to switcher template
6. **Document standards**: Add language-specific guidelines here

---

## Testing Requirements

### Test Coverage

- **New features**: Must include tests
- **Bug fixes**: Add regression test
- **Minimum coverage**: 80% (enforced by CI)

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Writing Tests

**Structure:**

```javascript
describe("FeatureName", () => {
  describe("methodName", () => {
    it("should do something specific", () => {
      // Arrange: Set up test data
      const input = "test";

      // Act: Execute the code
      const result = myFunction(input);

      // Assert: Verify results
      expect(result).toBe("expected");
    });
  });
});
```

**Best Practices:**

- One assertion per test (when possible)
- Descriptive test names
- Test edge cases and error conditions
- Use meaningful test data
- Avoid test interdependencies

---

## Questions?

- **GitHub Discussions**: [Ask a question](https://github.com/ka1rax568/Claude-Code-Best-Practices/discussions)
- **Issues**: [Report a bug or suggest a feature](https://github.com/ka1rax568/Claude-Code-Best-Practices/issues)

---

**Thank you for contributing to Claude Code Best Practices!** 🙏

Your contributions help developers around the world build better software with AI assistance.
