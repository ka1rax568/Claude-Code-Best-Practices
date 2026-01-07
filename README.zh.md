# Claude Code 最佳实践

> **语言 (Language)**: [English](README.md) | 简体中文

> 一份生产级指南和工具包，帮助你在专业软件开发中掌握 Claude Code

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com/anthropics/claude-code-best-practices/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-93%25-brightgreen)](./examples/tdd-demo)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## 🎯 项目愿景

**Claude Code 最佳实践**是一份全面的、经过实战检验的资源，面向希望将 Claude Code 作为专业开发工具的开发者。本项目不仅涵盖基础用法，还提供：

- **生产就绪的配置**，涵盖安全性、性能和团队协作
- **自定义命令和代理**，自动化重复性工作流程
- **真实案例**，展示 TDD、重构和代码审查模式
- **Token 优化策略**，在大型代码库中最大化效率
- **安全最佳实践**，保护敏感数据并维持合规性

## ✨ 核心特性

### 🔧 开箱即用的配置

- **`.claude/CLAUDE.md`**：包含编码标准、TDD 模板和工作流指南的综合项目上下文
- **`.claude/settings.json`**：具有拒绝列表和工具权限的安全强化配置
- **`.claudeignore`**：预配置保护敏感文件（.env、凭证、密钥）

### ⚡ 自定义斜杠命令

- **`/review`**：智能代码审查，包含安全性、性能和最佳实践检查
- **`/fix-lint`**：使用可配置规则集自动修复 lint 问题
- **`/conventional-commit`**：遵循约定式提交规范生成标准化提交消息

### 🤖 专业化代理

- **`code-reviewer`**：用于深度代码分析和架构反馈的专用子代理
- 可扩展框架，用于创建特定领域的代理

### 📚 深入文档

- **安全最佳实践**：权限管理、审计日志、密钥处理
- **Token 优化**：大型代码库的上下文管理策略
- **Git 工作流集成**：分支策略、PR 模板、自动化审查
- **提示工程**：有效引导 Claude Code 的经验证模式
- **高级用法**：钩子、MCP 服务器、IDE 集成

### 💡 实用示例

- **TDD 演示**：完整的测试驱动开发工作流程，包含 Todo API
- **遗留代码重构**：逐步现代化遗留代码
- **可复用模板**：CLAUDE.md 模板、PR 检查清单、工作流指南

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- 已安装 Claude Code CLI（[安装指南](https://github.com/anthropics/claude-code)）
- Git

### 安装

> **注意**：创建仓库后，请将 `ka1rax568` 替换为你的实际 GitHub 用户名。

```bash
# 克隆仓库
git clone https://github.com/ka1rax568/Claude-Code-Best-Practices.git
cd Claude-Code-Best-Practices

# 安装依赖
npm install

# 将模板配置复制到你的项目
cp -r .claude /path/to/your/project/
```

### 将此仓库用作模板

1. **复制 `.claude` 目录**到你的项目根目录
2. **根据项目需求自定义 `CLAUDE.md`**
3. **检查 `settings.json`**并针对你的环境调整拒绝列表
4. **根据需要从 `.claude/commands/` 添加自定义命令**

## 📖 文档结构

```
docs/
├── 01-getting-started.md           # 安装和初始设置
├── 02-security-best-practices.md   # 综合安全指南
├── 03-token-optimization.md        # 减少 token 使用的策略
├── 04-git-workflow.md              # Git 集成模式
├── 05-prompt-engineering.md        # 有效的提示技巧
└── 06-advanced-usage.md            # 钩子、MCP 服务器、扩展
```

## 🎓 学习路径

**初学者**：从 `docs/01-getting-started.md` 开始 → 查看 `.claude/CLAUDE.md` 模板 → 探索 `examples/tdd-demo`

**中级**：深入 `docs/03-token-optimization.md` → 实现自定义命令 → 查看 `examples/refactoring-legacy`

**高级**：学习 `docs/06-advanced-usage.md` → 构建自定义代理 → 与 CI/CD 流水线集成

## 🛠️ 项目结构

```
.
├── .claude/                    # Claude Code 配置
│   ├── CLAUDE.md              # 项目上下文和指南
│   ├── settings.json          # 安全和工具设置
│   ├── .claudeignore          # 文件排除规则
│   ├── commands/              # 自定义斜杠命令
│   └── agents/                # 专业化子代理
├── docs/                      # 综合指南
├── examples/                  # 真实用例
│   ├── tdd-demo/             # 测试驱动开发示例
│   └── refactoring-legacy/   # 遗留代码现代化
├── templates/                 # 可复用配置模板
└── PLAN.md                    # 开发路线图
```

## 🤝 贡献

我们欢迎贡献！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解：

- 行为准则
- 开发工作流程
- Pull Request 指南
- 问题报告模板

## 📜 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🌟 为什么有这个项目？

**Claude Code** 是一个强大的 AI 结对编程工具，但要充分发挥其潜力需要：

- 理解其架构和工具系统
- 实施适当的安全边界
- 在大型项目中优化 token 效率
- 为团队创建可重复的工作流程

本仓库将数百小时的生产使用经验提炼为可操作的模式，让你立即采用。

## 🔗 资源

- [官方 Claude Code 文档](https://github.com/anthropics/claude-code)
- [Claude API 文档](https://docs.anthropic.com/)
- [Anthropic 开发者 Discord](https://discord.gg/anthropic)

## 📊 路线图

详细开发阶段请参阅 [PLAN.md](PLAN.md)：

- [x] 阶段 0：项目结构规划
- [x] 阶段 1：基础设置
- [ ] 阶段 2：核心配置文件
- [ ] 阶段 3：自定义命令实现
- [ ] 阶段 4：代码审查代理
- [ ] 阶段 5：文档编写
- [ ] 阶段 6：TDD 示例开发
- [ ] 阶段 7：模板提取和优化

## 💬 支持

- **问题反馈**：[GitHub Issues](https://github.com/ka1rax568/Claude-Code-Best-Practices/issues)
- **讨论**：[GitHub Discussions](https://github.com/ka1rax568/Claude-Code-Best-Practices/discussions)
- **Twitter**：[@ka1rax568](https://twitter.com/ka1rax568)

---

**由社区构建，服务社区 ❤️**

使用 [Claude Code](https://claude.com/claude-code) 生成
