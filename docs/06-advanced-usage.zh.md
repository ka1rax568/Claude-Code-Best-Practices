# 高级使用指南

> **语言 (Language)**: [English](06-advanced-usage.md) | 简体中文

**通过高级技术和工作流程释放 Claude Code 的全部潜力**

---

## 目录

1. [简介](#简介)
2. [自定义 Agent](#自定义-agent)
3. [MCP 服务器](#mcp-服务器)
4. [自定义命令](#自定义命令)
5. [钩子与自动化](#钩子与自动化)
6. [IDE 集成](#ide-集成)
7. [性能优化](#性能优化)
8. [高级 Git 工作流](#高级-git-工作流)
9. [CI/CD 集成](#cicd-集成)
10. [故障排除](#故障排除)

---

## 简介

本指南涵盖了面向高级用户和希望最大化生产力的团队的 Claude Code 高级功能。主题包括自定义 agent、自动化、集成和优化技术。

### 前置要求

- 熟悉 Claude Code 的基本使用
- 理解 Git 工作流
- 具备命令行工具经验
- 已安装 Node.js 和 npm

---

## 自定义 Agent

自定义 agent 是专门的 AI 助手，可自动化复杂的多步骤任务。它们为项目特定的工作流扩展了 Claude Code 的能力。

### 理解 Agent

**什么是 Agent？**

Agent 是一个专注的 AI 子进程，可自主处理特定任务：

- **代码审查 Agent**：分析代码的错误、安全问题、风格违规
- **测试生成 Agent**：创建全面的测试套件
- **文档 Agent**：生成和维护文档
- **重构 Agent**：系统地改进代码结构

**何时使用 Agent：**

- 重复性的多文件操作
- 需要深入理解代码库的复杂分析
- 需要专业领域知识的任务
- 自动化质量检查

### 创建自定义 Agent

**目录结构：**

```
.claude/
└── agents/
    └── your-agent-name/
        ├── AGENT.md          # Agent 定义
        ├── prompt.txt        # 系统提示词
        └── config.json       # 配置（可选）
```

**步骤 1：创建 Agent 目录**

**提示词：**

```
创建一个自定义 agent，用于从代码注释生成 API 文档。
将其命名为 "api-doc-generator"
```

**Claude Code 响应：**

```bash
mkdir -p .claude/agents/api-doc-generator
```

**步骤 2：定义 Agent 元数据**

创建 `.claude/agents/api-doc-generator/AGENT.md`：

```markdown
# API Documentation Generator

**Purpose**: 从 JSDoc 注释自动生成 API 文档

**When to Use**: 在添加新的 API 端点或更新现有端点后

**Capabilities**:
- 扫描路由定义
- 提取 JSDoc 注释
- 生成 markdown 文档
- 更新 API 参考文档

**Usage**:
```

/agent api-doc-generator

```

**Options**:
- `--output`: 输出文件路径（默认：docs/api-reference.md）
- `--format`: 输出格式（markdown、html、json）
```

**步骤 3：创建 Agent 提示词**

创建 `.claude/agents/api-doc-generator/prompt.txt`：

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

**步骤 4：使用 Agent**

**提示词：**

```
运行 api-doc-generator agent 以更新 API 文档
```

**Claude Code：**

```bash
# Agent 自动执行已定义的工作流
```

### Agent 最佳实践

**✅ 应该做的：**

1. **单一职责**：一个 agent，一个任务
2. **明确目的**：记录何时以及如何使用
3. **幂等性**：可以安全地多次运行
4. **错误处理**：优雅地处理边缘情况
5. **输出格式**：一致、可预测的结果

**❌ 不应该做的：**

1. **过于宽泛**：不要创建"万能" agent
2. **副作用**：避免意外的文件修改
3. **硬编码路径**：使用配置以提高灵活性
4. **无验证**：始终验证输入

---

## MCP 服务器

模型上下文协议（MCP）服务器通过外部数据源和工具扩展 Claude Code。

### 什么是 MCP？

MCP 是一个允许 Claude Code 进行以下操作的协议：

- 访问外部 API
- 查询数据库
- 与第三方服务集成
- 获取实时数据

### 安装 MCP 服务器

**示例：GitHub MCP 服务器**

**提示词：**

```
安装并配置 GitHub MCP 服务器以访问仓库数据
```

**Claude Code 响应：**

1. **安装 MCP 包：**

```bash
npm install -g @anthropic-ai/mcp-server-github
```

2. **在 Claude Code 中配置：**

创建/更新 `~/.config/claude-code/config.json`：

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

3. **设置环境变量：**

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

4. **验证安装：**

**提示词：**

```
列出此仓库中所有未关闭的 pull request
```

**Claude Code：**

```bash
# 使用 GitHub MCP 服务器获取 PR
gh pr list --state open
```

### 创建自定义 MCP 服务器

**用例：**

- 公司特定的 API 集成
- 内部工具访问
- 数据库查询接口
- 自定义数据源

**示例：数据库 MCP 服务器**

**提示词：**

```
创建一个用于查询我们 PostgreSQL 数据库的自定义 MCP 服务器
```

**文件：mcp-servers/postgres-server.js**

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

**配置：**

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

**使用方法：**

**提示词：**

```
查询邮箱包含 "example.com" 的用户
```

**Claude Code：**

```
# 使用自定义 MCP 服务器
[使用 email 过滤器执行 query_users 工具]
```

---

## 自定义命令

自定义命令是扩展 Claude Code 功能的 shell 脚本。

### 创建自定义命令

**目录结构：**

```
.claude/
└── commands/
    ├── conventional-commit.sh
    ├── run-tests.sh
    └── deploy.sh
```

### 示例：测试运行器命令

**文件：`.claude/commands/run-tests.sh`**

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

**使其可执行：**

```bash
chmod +x .claude/commands/run-tests.sh
```

**使用方法：**

**提示词：**

```
运行带覆盖率的测试
```

**Claude Code：**

```bash
.claude/commands/run-tests.sh --coverage
```

### 示例：数据库迁移命令

**文件：`.claude/commands/db-migrate.sh`**

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

### 命令最佳实践

1. **包含使用文档**：在注释中添加帮助文本
2. **错误处理**：使用 `set -e` 在出错时退出
3. **参数解析**：支持标志和选项
4. **用户反馈**：输出进度和结果
5. **使其可执行**：为所有命令执行 `chmod +x`

---

## 钩子与自动化

钩子在响应 Claude Code 事件时触发操作。

### 可用钩子

- `pre-tool-call`：任何工具执行之前
- `post-tool-call`：工具执行之后
- `pre-commit`：git 提交之前（通过 git 钩子）
- `post-commit`：git 提交之后
- `user-prompt-submit`：用户提交提示词之后

### 创建钩子

**文件：`.claude/hooks/pre-tool-call.sh`**

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

### 示例：自动格式化钩子

**文件：`.claude/hooks/pre-commit.sh`**

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

### 示例：安全检查钩子

**文件：`.claude/hooks/user-prompt-submit.sh`**

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

## IDE 集成

将 Claude Code 与您的开发环境集成。

### VS Code 集成

**设置：**

1. **安装扩展**（如果可用）
2. **配置设置：**

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

### 终端集成

**快速访问别名：**

添加到 `.bashrc` 或 `.zshrc`：

```bash
alias cc="claude-code"
alias ccr="claude-code --resume"  # Resume last session
alias ccc="claude-code --config"  # Open config
```

**上下文感知命令函数：**

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

## 性能优化

### Token 优化策略

**1. 增量编辑**

**❌ 低效：**

```
"用更好的错误处理重写整个 userService.js 文件"
[Claude 重写 500 行]
```

**✅ 高效：**

```
"在 userService.js 中，为第 45 行的 getUserById 函数添加错误处理"
[Claude 编辑特定行]
```

**2. 有针对性的文件读取**

**❌ 低效：**

```
"读取 src/ 中的所有文件并找出用户验证发生的位置"
```

**✅ 高效：**

```
"在 src/ 中搜索 'validateUser' 函数定义"
[使用 grep 查找特定文件]
"读取 src/utils/validation.js"
[仅读取相关文件]
```

**3. 读取前使用 Grep**

**❌ 低效：**

```
"读取所有 TypeScript 文件并找到 User 接口"
```

**✅ 高效：**

```
"在 TypeScript 文件中搜索 'interface User'"
[返回：src/types/user.ts:15]
"从第 10 行开始读取 src/types/user.ts"
[仅读取相关部分]
```

### 缓存策略

**利用对话上下文：**

```
会话开始：
"读取 src/services/userService.js"
[Claude 读取并记住]

"添加 getUserById 函数"
[使用缓存的文件内容]

"现在添加 getUserByEmail"
[仍在使用缓存内容]

"为两个函数添加错误处理"
[仍在使用缓存内容]
```

### 并行操作

**顺序（慢）：**

```
"读取 file1.js"
[等待]
"读取 file2.js"
[等待]
"读取 file3.js"
```

**并行（快）：**

```
"并行读取这些文件：
- src/services/userService.js
- src/services/authService.js
- src/models/User.js"

[Claude 使用并行工具调用]
```

---

## 高级 Git 工作流

### Git Worktrees

**用例**：无需暂存即可同时处理多个分支。

**提示词：**

```
为 hotfix/critical-bug 分支在 ../hotfix 目录中创建一个 git worktree
```

**Claude Code：**

```bash
git worktree add ../hotfix hotfix/critical-bug
```

**好处：**

- 无需分支切换
- 并行开发
- 独立的工作目录

### Git Bisect 自动化

**用例**：自动找到引入 bug 的提交。

**提示词：**

```
使用 git bisect 查找哪个提交引入了登录 bug。
测试脚本：npm test -- login.spec.js
```

**Claude Code：**

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.0.0

git bisect run npm test -- login.spec.js
```

### 子树合并

**用例**：将外部仓库作为子目录包含。

**提示词：**

```
将 shared-components 仓库作为子树添加到 src/shared/ 中
```

**Claude Code：**

```bash
git remote add shared-components https://github.com/org/shared-components.git
git fetch shared-components
git read-tree --prefix=src/shared/ -u shared-components/main
git commit -m "chore: add shared-components via subtree"
```

---

## CI/CD 集成

### GitHub Actions 集成

**示例：使用 Claude Code 自动审查 PR**

**文件：`.github/workflows/claude-review.yml`**

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

### Pre-commit CI 集成

**文件：`.github/workflows/pre-commit.yml`**

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

## 故障排除

### 常见问题和解决方案

#### 问题："Tool call timeout"

**症状**：长时间运行的命令超时

**解决方案**：

```
"使用增加的超时时间运行构建"
```

**Claude Code：**

```bash
timeout 600 npm run build  # 10 分钟超时
```

#### 问题："Out of context tokens"

**症状**："Maximum context length exceeded"

**解决方案**：

1. **拆分成更小的任务**
2. **使用有针对性的文件读取**
3. **清除对话历史**（开始新会话）

#### 问题："Permission denied"

**症状**：无法执行脚本

**解决方案**：

```
"使脚本可执行并运行它"
```

```bash
chmod +x .claude/commands/my-script.sh
.claude/commands/my-script.sh
```

#### 问题："MCP server not responding"

**症状**：MCP 工具不可用

**调试步骤**：

```bash
# Check MCP server status
claude-code --mcp-status

# Restart MCP servers
claude-code --mcp-restart

# Check logs
cat ~/.config/claude-code/mcp-logs.txt
```

---

## 最佳实践总结

### ✅ 应该做的

1. **为重复性任务使用 Agent**：自动化复杂的多步骤工作流
2. **利用 MCP 获取外部数据**：与 API 和数据库集成
3. **创建自定义命令**：标准化团队工作流
4. **设置钩子**：自动化质量检查并强制执行标准
5. **优化性能**：使用有针对性的操作、并行调用
6. **与 CI/CD 集成**：自动化审查和检查
7. **记录自定义工具**：帮助团队成员理解和使用工具

### ❌ 不应该做的

1. **不要过度复杂化**：简单的解决方案通常是最好的
2. **不要忽视安全性**：验证输入，保护密钥
3. **不要硬编码值**：使用配置和环境变量
4. **不要跳过错误处理**：优雅地处理边缘情况
5. **不要忘记测试**：测试自定义 agent、命令、钩子

---

## 结论

Claude Code 的高级功能实现了：

- **自动化**：减少手动、重复性工作
- **定制化**：根据您的工作流定制 Claude Code
- **集成**：与现有工具和服务连接
- **效率**：通过优化最大化生产力
- **质量**：自动化检查和审查

**下一步：**

1. 创建您的第一个自定义 agent
2. 为您的项目设置 git 钩子
3. 探索 MCP 服务器集成
4. 将 Claude Code 集成到您的 CI/CD 管道中

---

**相关文档：**

- [入门指南](./01-getting-started.zh.md)
- [安全最佳实践](./02-security-best-practices.zh.md)
- [Token 优化](./03-token-optimization.zh.md)
- [Git 工作流指南](./04-git-workflow.zh.md)
- [提示词工程](./05-prompt-engineering.md)

**外部资源：**

- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [MCP 协议规范](https://modelcontextprotocol.io/)
- [Claude Agent SDK 文档](https://github.com/anthropics/claude-agent-sdk)
