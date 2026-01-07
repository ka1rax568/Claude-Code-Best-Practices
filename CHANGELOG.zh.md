# 变更日志

> **语言 (Language)**: [English](CHANGELOG.md) | 简体中文

本项目的所有重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循[语义化版本](https://semver.org/lang/zh-CN/spec/v2.0.0.html)。

## [未发布]

### 新增

- CLAUDE.md、TDD 工作流程和 PR 审查清单的模板
- Bug、功能和文档的 GitHub 问题模板
- 带有全面检查的 GitHub Actions CI/CD 管道
- README.md 中的徽章集合

## [1.1.0] - 2026-01-08

### 新增

- **完整的中文（简体中文）本地化** - 完全双语支持
  - 翻译了 21 个文档文件（9,915+ 行）
  - 所有指南：入门、安全、令牌优化、Git 工作流程、提示工程、高级用法
  - 根文档：README、CONTRIBUTING、CHANGELOG、PLAN、PROJECT_STATUS
  - 模板：PR 审查清单、TDD 工作流程、CLAUDE.md 模板
  - 示例：TDD 演示文档和工作流程
  - 项目上下文：`.claude/CLAUDE.md` 和模板
- **语言切换器** - 所有文档上的双向导航
- **翻译指南** - 全面的贡献者指南
  - 文件命名约定和标准
  - 翻译内容与保留内容（代码、路径、技术术语）
  - 质量验证检查清单
  - 翻译提交的 PR 模板
  - 技术术语翻译表
  - 推荐的工具和工作流程
- **增强的 README** - 突出的语言支持部分
- **文档更新** - 所有英文文件都更新了语言切换器

### 更改

- README 结构增强了专用的语言支持部分
- CONTRIBUTING.md 扩展了 259 行的翻译指南部分
- 文档结构说明现在指示双语可用性

### 国际化（i18n）

- **总翻译覆盖率**：100% 的文档
- **翻译行数**：9,915+ 行简体中文
- **添加的文件**：21 个 `.zh.md` 文件
- **支持的语言**：英文（主要），简体中文
- **翻译质量**：专业、技术准确、一致的术语
- **维护**：建立了保持翻译同步的指南

## [1.0.0] - 2026-01-07

### 新增

- 初始项目结构和基础
- 全面的 `.claude/CLAUDE.md`，包含编码标准和 TDD 工作流程（18.4KB）
- 生产就绪的 `.claude/settings.json`，带安全配置
- 用于保护敏感文件的 `.claudeignore`
- 自定义斜杠命令：
  - `/review` - 智能代码审查自动化
  - `/fix-lint` - 自动化代码检查修复
  - `/conventional-commit` - 提交消息生成器
- 带有安全和性能分析的代码审查代理
- 完整的文档套件（总计 104KB）：
  - 入门指南
  - 安全最佳实践
  - 令牌优化策略
  - Git 工作流程指南
  - 提示工程技术
  - 高级用法模式
- TDD 演示示例（examples/tdd-demo/）：
  - 带有 7 个 REST 端点的完整 Todo API
  - 76 个通过的测试，覆盖率 93.27%
  - 演示红-绿-重构循环
  - 带验证和错误处理的生产质量代码
  - 全面的 README 和 WORKFLOW 文档
- 项目治理文件：
  - MIT 许可证
  - 贡献指南
  - 开发路线图（PLAN.md）
  - 项目状态跟踪

### 安全

- 带有敏感操作拒绝列表的加固设置
- 贯穿始终的输入验证示例
- 密钥管理最佳实践
- 文档中的 OWASP Top 10 考虑

### 文档

- 6 个全面指南（104KB）
- 带有 JSDoc 的内联代码文档
- 带有快速入门和示例的 README
- 带有 PR 流程的贡献指南
- 带有阶段跟踪的开发计划

## 发布说明

### v1.0.0 - 初始发布

这是 Claude Code 最佳实践的第一个生产版本，提供了专业 Claude Code 使用的完整工具包。

**亮点：**

- ✅ 生产就绪的配置和安全加固
- ✅ 用于常见工作流程的 3 个自定义命令
- ✅ 全面的 104KB 文档套件
- ✅ 93% 测试覆盖率的真实 TDD 示例
- ✅ 带有多方面分析的代码审查代理
- ✅ 大型代码库的令牌优化策略

**目标受众：**

- 专业软件开发人员
- 采用 AI 辅助编码的开发团队
- 需要安全性和合规性的项目
- 实施 TDD 实践的团队

**先决条件：**

- Node.js >= 18.0.0
- 已安装 Claude Code CLI
- 对 Git 工作流程的基本理解

**开始使用：**

```bash
git clone https://github.com/anthropics/claude-code-best-practices.git
cd claude-code-best-practices
cp -r .claude /path/to/your/project/
```

有关详细设置说明，请参见 [docs/01-getting-started.md](docs/01-getting-started.md)。

---

## 版本历史摘要

| 版本  | 日期       | 主要更改                       | 影响 |
| ----- | ---------- | ------------------------------ | ---- |
| 1.1.0 | 2026-01-08 | 完整的中文本地化（21 个文件）  | 重大 |
| 1.0.0 | 2026-01-07 | 带有完整工具包的初始发布       | 重大 |

---

## 迁移指南

### 迁移到 v1.0.0

由于这是初始发布，因此不需要迁移。要在现有项目中采用这些最佳实践：

1. **审查您当前的设置**：与我们的 `.claude/` 配置进行比较
2. **逐步采用**：从 `.claudeignore` 和基本设置开始
3. **自定义模板**：根据您的技术栈调整 `CLAUDE.md`
4. **逐步添加命令**：一次安装一个命令
5. **培训您的团队**：使用文档来引导开发人员

有关集成指南，请参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 已弃用功能

无（初始发布）

---

## 已知问题

无报告

---

## 计划功能

有关开发路线图，请参见 [PLAN.md](PLAN.md)。即将考虑：

- 其他特定语言示例（Python、Go、Java）
- VS Code 扩展集成指南
- 高级代理模式和组合
- 性能基准测试工具
- 多存储库配置管理

---

## 贡献

我们欢迎贡献！有关以下内容，请参见 [CONTRIBUTING.md](CONTRIBUTING.md)：

- 如何报告 Bug
- 功能请求流程
- Pull Request 指南
- 开发设置
- 代码审查标准

---

## 支持

- **文档**：[docs/](docs/)
- **示例**：[examples/](examples/)
- **问题**：[GitHub Issues](https://github.com/anthropics/claude-code-best-practices/issues)
- **讨论**：[GitHub Discussions](https://github.com/anthropics/claude-code-best-practices/discussions)

---

**维护者**：Claude Code 最佳实践贡献者
**许可证**：MIT
