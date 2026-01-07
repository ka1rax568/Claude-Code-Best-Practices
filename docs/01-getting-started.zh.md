> **语言 (Language)**: [English](01-getting-started.md) | 简体中文

# Claude Code 最佳实践入门指南

欢迎!本指南将帮助您使用生产级配置和最佳实践在项目中启动并运行 Claude Code。

## 目录

- [前置要求](#前置要求)
- [安装](#安装)
- [快速开始](#快速开始)
- [第一个项目设置](#第一个项目设置)
- [运行第一个命令](#运行第一个命令)
- [理解 Claude Code 工作流](#理解-claude-code-工作流)
- [常见问题和解决方案](#常见问题和解决方案)
- [后续步骤](#后续步骤)

---

## 前置要求

开始之前,请确保您具有:

### 必需

- **Node.js** >= 18.0.0 ([下载](https://nodejs.org/))

  ```bash
  node --version  # 应显示 v18.0.0 或更高版本
  ```

- **npm** >= 9.0.0 (随 Node.js 一起提供)

  ```bash
  npm --version  # 应显示 9.0.0 或更高版本
  ```

- **Git** (用于版本控制)

  ```bash
  git --version  # 任何最新版本都可以
  ```

- **Claude Code CLI** ([安装指南](https://github.com/anthropics/claude-code))
  ```bash
  claude-code --version
  ```

### 可选但推荐

- **ESLint** 和 **Prettier** (用于代码质量)
- **Jest** (用于测试)
- **TypeScript** (如果使用 TypeScript)
- 带有 Claude Code 集成的代码编辑器(VS Code、Cursor 等)

---

## 安装

### 步骤 1: 克隆此仓库

```bash
# 克隆仓库
git clone https://github.com/ka1rax568/Claude-Code-Best-Practices.git

# 导航到目录
cd Claude-Code-Best-Practices

# 安装依赖
npm install
```

### 步骤 2: 验证安装

```bash
# 检查所有文件是否存在
ls -la .claude/

# 您应该看到:
# - CLAUDE.md
# - settings.json
# - .claudeignore
# - commands/
# - agents/
```

### 步骤 3: 使命令可执行

```bash
# 使所有自定义命令可执行
chmod +x .claude/commands/*.sh

# 验证
ls -l .claude/commands/
```

---

## 快速开始

### 选项 A: 使用此仓库作为模板

最快的开始方式是将 `.claude` 目录复制到您现有的项目:

```bash
# 从您的项目目录
cp -r /path/to/Claude-Code-Best-Practices/.claude ./

# 为您的项目自定义 CLAUDE.md
# 编辑 .claude/CLAUDE.md 并更新:
# - 项目名称
# - 技术栈
# - 特定编码标准
```

### 选项 B: 从头开始

如果您更喜欢构建自己的配置:

1. **创建 `.claude` 目录**

   ```bash
   mkdir -p .claude/commands .claude/agents
   ```

2. **复制您需要的单个文件**

   ```bash
   # 复制 CLAUDE.md 模板
   cp /path/to/Claude-Code-Best-Practices/.claude/CLAUDE.md ./.claude/

   # 复制 settings.json
   cp /path/to/Claude-Code-Best-Practices/.claude/settings.json ./.claude/

   # 复制您想要的命令
   cp /path/to/Claude-Code-Best-Practices/.claude/commands/review.sh ./.claude/commands/
   ```

3. **为您的项目自定义**

---

## 第一个项目设置

让我们逐步为新的 Node.js 项目设置 Claude Code。

### 1. 初始化您的项目

```bash
# 创建项目目录
mkdir my-awesome-project
cd my-awesome-project

# 初始化 npm
npm init -y

# 初始化 git
git init

# 创建基本结构
mkdir src tests
touch src/index.js tests/index.test.js
```

### 2. 复制 Claude Code 配置

```bash
# 复制整个 .claude 目录
cp -r /path/to/Claude-Code-Best-Practices/.claude ./

# 或复制单个文件
mkdir -p .claude/commands .claude/agents
cp /path/to/Claude-Code-Best-Practices/.claude/CLAUDE.md ./.claude/
cp /path/to/Claude-Code-Best-Practices/.claude/settings.json ./.claude/
cp /path/to/Claude-Code-Best-Practices/.claude/.claudeignore ./.claude/
```

### 3. 自定义 CLAUDE.md

打开 `.claude/CLAUDE.md` 并更新特定于项目的部分:

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

### 4. 配置 settings.json

查看 `.claude/settings.json` 并根据您的需求进行调整:

```json
{
  "version": "1.0.0",
  "denyList": [
    ".env",
    ".env.*",
    "*.pem",
    "*.key",
    // 添加特定于项目的模式
    "config/secrets.yml",
    "database.credentials.json"
  ]
  // ... 其余配置
}
```

### 5. 设置 .gitignore

确保您的 `.gitignore` 排除敏感文件:

```bash
# 复制完整的 .gitignore
cp /path/to/Claude-Code-Best-Practices/.gitignore ./

# 或添加到您现有的 .gitignore:
cat >> .gitignore << 'EOF'

# Claude Code
.claude/settings.local.json
.claude/temp/
EOF
```

### 6. 安装开发依赖项

```bash
# 安装代码检查和格式化
npm install --save-dev eslint prettier eslint-config-prettier

# 安装测试框架
npm install --save-dev jest

# 安装 TypeScript(如果需要)
npm install --save-dev typescript @types/node
```

### 7. 配置 Package 脚本

将有用的脚本添加到 `package.json`:

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

## 运行第一个命令

现在您的项目已设置好,让我们尝试自定义命令。

### 1. 运行代码审查

```bash
# 审查整个项目
./.claude/commands/review.sh

# 审查特定目录
./.claude/commands/review.sh src/

# 示例输出:
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

### 2. 修复代码检查问题

```bash
# 预览更改而不应用
./.claude/commands/fix-lint.sh --dry-run

# 应用修复
./.claude/commands/fix-lint.sh

# 仅修复暂存文件(在预提交钩子中有用)
./.claude/commands/fix-lint.sh --staged

# 严格模式(警告时失败)
./.claude/commands/fix-lint.sh --strict
```

### 3. 创建提交

```bash
# 暂存您的更改
git add src/index.js tests/index.test.js

# 生成约定式提交消息
./.claude/commands/conventional-commit.sh

# 示例交互:
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

## 理解 Claude Code 工作流

### 开发周期

Claude Code 在集成到您的开发工作流时效果最佳:

```
1. 编写代码
   ↓
2. 使用 Claude Code 获取帮助
   - 提问
   - 生成代码
   - 重构
   ↓
3. 运行 /review 命令
   - 捕获安全问题
   - 识别性能问题
   - 发现代码质量问题
   ↓
4. 运行 /fix-lint
   - 自动修复风格问题
   - 格式化代码
   ↓
5. 编写/运行测试
   - 遵循 CLAUDE.md 中的 TDD 实践
   ↓
6. 运行 /conventional-commit
   - 创建格式正确的提交
   ↓
7. 推送并创建 PR
```

### Claude Code 如何使用您的配置

当您与 Claude Code 交互时,它会自动:

1. **读取 `.claude/CLAUDE.md`**
   - 理解您的项目上下文
   - 遵循您的编码标准
   - 使用您的 TDD 模板

2. **尊重 `.claude/settings.json`**
   - 不会访问拒绝的文件
   - 仅使用允许的工具
   - 应用安全规则

3. **遵守 `.claude/.claudeignore`**
   - 完全跳过忽略的文件
   - 保护敏感数据

### 示例会话

```
您: "按照我们的标准创建用户身份验证端点"

Claude Code:
1. 读取 .claude/CLAUDE.md 获取编码标准
2. 看到 TDD 工作流要求
3. 首先编写测试(红色阶段)
4. 实现最少代码以通过测试(绿色阶段)
5. 为质量重构(重构阶段)
6. 遵循 CLAUDE.md 中的安全指南
7. 使用适当的错误处理模式
```

---

## 常见问题和解决方案

### 问题 1: 命令不可执行

**症状:**

```bash
./claude/commands/review.sh
-bash: ./.claude/commands/review.sh: Permission denied
```

**解决方案:**

```bash
chmod +x .claude/commands/*.sh
```

### 问题 2: Claude Code 未读取 CLAUDE.md

**症状:** Claude 似乎没有遵循您的编码标准

**解决方案:**

1. 验证文件位置: `.claude/CLAUDE.md` (不是 `.claude/claude.md`)
2. 检查文件权限: `ls -l .claude/CLAUDE.md`
3. 重启 Claude Code 会话
4. 明确引用它: "遵循 .claude/CLAUDE.md 中的标准..."

### 问题 3: 未找到 ESLint/Prettier

**症状:**

```bash
./.claude/commands/fix-lint.sh
ESLint configuration found but eslint command not available
```

**解决方案:**

```bash
# 本地安装
npm install --save-dev eslint prettier

# 或全局安装
npm install -g eslint prettier
```

### 问题 4: Git 命令失败

**症状:**

```bash
./.claude/commands/conventional-commit.sh
Error: Not a git repository
```

**解决方案:**

```bash
# 如果尚未完成,初始化 git
git init

# 或从仓库根目录运行
cd $(git rev-parse --show-toplevel)
./.claude/commands/conventional-commit.sh
```

### 问题 5: 设置未应用

**症状:** Claude Code 访问不应访问的文件

**解决方案:**

1. 检查 `.claude/settings.json` 语法(必须是有效的 JSON)
2. 验证拒绝列表模式与您的文件匹配
3. 记住: `.claudeignore` 优先于 `settings.json`
4. 检查文件模式中的拼写错误

### 问题 6: 命令运行缓慢

**症状:** `/review` 命令需要几分钟才能完成

**解决方案:**

```bash
# 审查特定目录而不是整个项目
./.claude/commands/review.sh src/

# 排除大目录
# 添加到 .claudeignore:
vendor/
node_modules/
dist/
```

---

## 后续步骤

### 初学者路径

1. **探索 CLAUDE.md**
   - 阅读编码标准
   - 查看 TDD 模板
   - 理解工作流

2. **尝试命令**
   - 在小文件上运行 `/review`
   - 使用 `/fix-lint` 清理代码
   - 使用 `/conventional-commit` 创建提交

3. **阅读更多文档**
   - [安全最佳实践](02-security-best-practices.zh.md)
   - [提示工程](05-prompt-engineering.zh.md)

### 中级路径

1. **自定义您的配置**
   - 将 CLAUDE.md 调整为您团队的标准
   - 添加特定于项目的拒绝列表模式
   - 为您的工作流创建自定义命令

2. **与 CI/CD 集成**
   - 在预提交钩子中添加 `/review`
   - 在 CI 管道中运行 `/fix-lint --strict`
   - 强制执行约定式提交

3. **阅读高级主题**
   - [Token 优化](03-token-optimization.zh.md)
   - [Git 工作流集成](04-git-workflow.zh.md)
   - [高级用法](06-advanced-usage.zh.md)

### 高级路径

1. **创建自定义代理**
   - 研究代码审查器代理
   - 构建特定于领域的代理
   - 与您的工具集成

2. **优化性能**
   - 微调 token 使用
   - 实现缓存策略
   - 使用代理专业化

3. **回馈**
   - 分享您的自定义命令
   - 改进文档
   - 报告问题并提出改进建议

---

## 资源

### 官方文档

- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Anthropic 文档](https://docs.anthropic.com/)

### 社区

- [GitHub 讨论](https://github.com/ka1rax568/Claude-Code-Best-Practices/discussions)
- [GitHub Issues](https://github.com/ka1rax568/Claude-Code-Best-Practices/issues)

### 学习资源

- [TDD 演示示例](../examples/tdd-demo/) (第 6 阶段即将推出)
- [代码审查示例](../examples/refactoring-legacy/) (第 6 阶段即将推出)

---

## 快速参考卡

```bash
# 审查代码
./.claude/commands/review.sh [path]

# 修复代码检查
./.claude/commands/fix-lint.sh [--dry-run] [--strict] [--staged]

# 创建提交
git add <files>
./.claude/commands/conventional-commit.sh

# 更新配置
vim .claude/CLAUDE.md        # 编辑项目上下文
vim .claude/settings.json    # 编辑安全设置
vim .claude/.claudeignore    # 编辑文件排除
```

---

**下一步**: [安全最佳实践](02-security-best-practices.zh.md) →

**需要帮助?** 在 [GitHub](https://github.com/ka1rax568/Claude-Code-Best-Practices/issues) 上提交问题
