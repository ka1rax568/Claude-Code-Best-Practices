# Git 工作流指南

> **语言 (Language)**: [English](04-git-workflow.md) | 简体中文

**掌握使用 Claude Code 进行专业版本控制的 Git 工作流**

---

## 目录

1. [简介](#简介)
2. [基本 Git 操作](#基本-git-操作)
3. [分支管理](#分支管理)
4. [提交最佳实践](#提交最佳实践)
5. [Pull Request 工作流](#pull-request-工作流)
6. [冲突解决](#冲突解决)
7. [Git Hooks 集成](#git-hooks-集成)
8. [高级 Git 操作](#高级-git-操作)
9. [故障排除](#故障排除)

---

## 简介

本指南演示如何利用 Claude Code 进行高效的 Git 操作,从基本提交到复杂的合并策略。遵循这些模式将帮助你维护干净的 Git 历史并简化协作。

### 为什么 Git 工作流很重要

- **干净的历史**: 使代码审查和调试更容易
- **团队协作**: 标准化实践提高团队效率
- **代码质量**: 预提交钩子在代码到达仓库前捕获问题
- **可追溯性**: 清晰的提交消息能够更好地跟踪项目

---

## 基本 Git 操作

### 检查仓库状态

**提示:**

```
检查当前 git 状态并显示哪些文件已更改
```

**Claude Code 响应:**

```bash
git status
```

**示例输出:**

```
On branch feat/user-auth
Your branch is up to date with 'origin/feat/user-auth'.

Changes not staged for commit:
  modified:   src/services/userService.js
  modified:   tests/userService.spec.js

Untracked files:
  src/utils/validation.js
```

### 查看更改

**提示:**

```
显示 userService.js 的差异以查看更改了什么
```

**Claude Code 响应:**

```bash
git diff src/services/userService.js
```

**对于暂存的更改:**

```
显示已暂存待提交的更改
```

```bash
git diff --staged
```

### 暂存文件

**提示:**

```
暂存 userService.js 和 userService.spec.js 文件以供提交
```

**Claude Code 响应:**

```bash
git add src/services/userService.js tests/userService.spec.js
```

**暂存所有更改:**

```
暂存所有修改和新文件
```

```bash
git add .
```

---

## 分支管理

### 创建功能分支

**提示:**

```
为实现用户认证创建一个新的功能分支
```

**Claude Code 响应:**

```bash
git checkout -b feat/user-authentication
```

**分支命名约定:**

```
feat/feature-name       # 新功能
fix/bug-description     # Bug 修复
refactor/description    # 代码重构
docs/description        # 文档更新
test/description        # 测试添加/修复
chore/description       # 维护任务
```

### 切换分支

**提示:**

```
切换到主分支
```

**Claude Code 响应:**

```bash
git checkout main
```

### 列出分支

**提示:**

```
显示所有分支,包括远程分支
```

**Claude Code 响应:**

```bash
git branch -a
```

### 删除分支

**提示:**

```
删除 feat/old-feature 分支(它已被合并)
```

**Claude Code 响应:**

```bash
# 删除本地分支
git branch -d feat/old-feature

# 删除远程分支
git push origin --delete feat/old-feature
```

**强制删除未合并分支:**

```
强制删除 experimental-feature 分支
```

```bash
git branch -D experimental-feature
```

---

## 提交最佳实践

### 约定式提交

Claude Code 遵循 [约定式提交](https://www.conventionalcommits.org/) 规范:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**类型:**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更改
- `style`: 代码样式更改(格式化、分号等)
- `refactor`: 代码重构
- `test`: 添加或更新测试
- `chore`: 维护任务

### 使用 Claude Code 创建提交

**提示:**

```
为我刚实现的用户认证功能创建提交
```

**Claude Code 工作流:**

1. **审查更改:**

```bash
git status
git diff
```

2. **分析上下文:**

- 读取最近的提交: `git log --oneline -5`
- 理解项目提交风格
- 识别范围和类型

3. **暂存文件:**

```bash
git add src/services/authService.js tests/authService.spec.js
```

4. **创建提交:**

```bash
git commit -m "feat(auth): implement user authentication service

- Add JWT token generation
- Implement password hashing with bcrypt
- Add login and logout functionality
- Include comprehensive unit tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 交互式提交创建

**对于复杂更改:**

**提示:**

```
我做了几处更改。帮我创建多个专注的提交,而不是一个大提交。
```

**Claude Code 响应:**

```bash
# 审查所有更改
git status
git diff

# 分别暂存和提交相关更改
git add src/services/userService.js tests/userService.spec.js
git commit -m "feat(user): add getUserById method"

git add src/services/authService.js tests/authService.spec.js
git commit -m "feat(auth): implement JWT authentication"

git add docs/api.md
git commit -m "docs(api): document user and auth endpoints"
```

### 修改提交

**提示:**

```
我忘记在最后一次提交中包含一个文件。添加 validation.js 并修改提交。
```

**Claude Code 响应:**

```bash
git add src/utils/validation.js
git commit --amend --no-edit
```

**更改提交消息:**

```
更新最后一次提交消息使其更具描述性
```

```bash
git commit --amend -m "feat(auth): implement user authentication with JWT

- Add JWT token generation and validation
- Implement password hashing with bcrypt
- Add email validation utility
- Include comprehensive unit tests"
```

⚠️ **警告:** 永远不要修改已推送到共享分支的提交!

---

## Pull Request 工作流

### 使用 Claude Code 创建 Pull Request

**提示:**

```
为我的用户认证功能创建 pull request
```

**Claude Code 工作流:**

1. **分析分支历史:**

```bash
git log main..HEAD
git diff main...HEAD
```

2. **确保分支已更新:**

```bash
git fetch origin
git rebase origin/main
```

3. **推送到远程:**

```bash
git push origin feat/user-authentication
```

4. **创建 PR (使用 GitHub CLI):**

```bash
gh pr create --title "feat: Implement user authentication" --body "## Summary
- Implemented JWT-based authentication
- Added password hashing with bcrypt
- Created login/logout endpoints
- Comprehensive test coverage (95%)

## Test Plan
- [ ] All unit tests pass
- [ ] Manual testing of login flow
- [ ] Verify JWT token generation
- [ ] Test password hashing

## Breaking Changes
None

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

### 更新 Pull Request

**提示:**

```
我收到了代码审查反馈。帮我处理评论并更新 PR。
```

**Claude Code 响应:**

1. **进行请求的更改**
2. **创建新提交:**

```bash
git add .
git commit -m "refactor(auth): address code review feedback

- Extract token generation to separate function
- Add JSDoc comments
- Improve error handling"
```

3. **推送更新:**

```bash
git push origin feat/user-authentication
```

### 合并前压缩提交

**提示:**

```
在合并之前将我的功能分支提交压缩成单个提交
```

**Claude Code 响应:**

```bash
# 交互式 rebase 以压缩提交
git rebase -i main

# 在交互式编辑器中,Claude Code 建议:
# pick abc1234 feat(auth): initial implementation
# squash def5678 fix(auth): fix token expiry
# squash ghi9012 refactor(auth): improve error handling
```

---

## 冲突解决

### 识别冲突

**提示:**

```
我正在尝试将 main 合并到我的功能分支,但有冲突。帮我解决它们。
```

**Claude Code 响应:**

1. **识别冲突文件:**

```bash
git merge main
# 输出显示冲突

git status
# 显示冲突文件
```

2. **显示冲突详情:**

```bash
git diff --name-only --diff-filter=U
```

### 解决冲突

**提示:**

```
显示 src/services/userService.js 中的冲突并帮我解决
```

**Claude Code 响应:**

1. **读取冲突文件:**

```javascript
<<<<<<< HEAD
export async function getUserById(id) {
  validateId(id);
  const user = await database.users.findById(id);
  if (!user) throw new UserNotFoundError(id);
  return user;
}
=======
export async function getUserById(id) {
  if (!id) throw new Error('Invalid ID');
  const user = await db.findUser(id);
  return user || null;
}
>>>>>>> main
```

2. **分析两个版本:**

- 你的版本: 使用 `validateId`,抛出 `UserNotFoundError`
- Main 版本: 简单验证,返回 null

3. **建议解决方案:**

```javascript
export async function getUserById(id) {
  validateId(id); // 你的分支的更好验证
  const user = await database.users.findById(id); // 一致的数据库访问
  if (!user) throw new UserNotFoundError(id); // 你的分支的特定错误
  return user;
}
```

4. **完成合并:**

```bash
git add src/services/userService.js
git commit -m "merge: resolve conflicts in userService"
```

### 使用合并工具

**提示:**

```
启动可视化合并工具来帮助解决这些冲突
```

**Claude Code 响应:**

```bash
git mergetool
```

---

## Git Hooks 集成

### 预提交钩子

Git 钩子在提交前自动运行。Claude Code 与常见的预提交框架无缝配合。

**设置 Husky (流行的 Git Hooks 框架):**

**提示:**

```
设置 Husky 与预提交钩子来运行 linting 和测试
```

**Claude Code 响应:**

1. **安装 Husky:**

```bash
npm install --save-dev husky
npx husky init
```

2. **创建预提交钩子:**

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test
```

3. **使钩子可执行:**

```bash
chmod +x .husky/pre-commit
```

### 提交消息钩子

**提示:**

```
添加提交消息钩子以强制执行约定式提交格式
```

**Claude Code 响应:**

1. **安装 commitlint:**

```bash
npm install --save-dev @commitlint/{cli,config-conventional}
```

2. **创建配置:**

```javascript
// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

3. **创建提交消息钩子:**

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### Claude Code 钩子行为

当配置了钩子时,Claude Code:

1. **检测钩子失败:**

```
❌ 预提交钩子失败: 发现 ESLint 错误
```

2. **修复问题:**

```bash
npm run lint:fix
```

3. **重试提交:**

```bash
git add .
git commit -m "feat(auth): implement login"
```

---

## 高级 Git 操作

### 变基

**交互式变基:**

**提示:**

```
帮我使用交互式 rebase 清理我最后的 5 个提交
```

**Claude Code 响应:**

```bash
git rebase -i HEAD~5

# Claude 建议操作:
# pick abc1234 feat(auth): initial implementation
# squash def5678 fix typo
# squash ghi9012 add missing test
# reword jkl3456 feat(auth): add login
# pick mno7890 docs: update API docs
```

**变基到 Main:**

**提示:**

```
将我的功能分支变基到最新的 main
```

**Claude Code 响应:**

```bash
git fetch origin
git rebase origin/main
```

### Cherry-picking

**提示:**

```
从 experimental 分支 cherry-pick 提交 abc1234 到我当前的分支
```

**Claude Code 响应:**

```bash
git cherry-pick abc1234
```

**Cherry-pick 多个提交:**

```bash
git cherry-pick abc1234 def5678 ghi9012
```

### 暂存

**提示:**

```
我需要切换分支但有未提交的更改。暂时存储它们。
```

**Claude Code 响应:**

```bash
git stash push -m "WIP: authentication feature"
```

**应用暂存的更改:**

```
应用我最近的暂存
```

```bash
git stash pop
```

**列出所有暂存:**

```
显示我所有的暂存更改
```

```bash
git stash list
```

### Reflog

**提示:**

```
我不小心重置了我的分支。帮我恢复丢失的提交。
```

**Claude Code 响应:**

1. **查看 Reflog:**

```bash
git reflog
```

2. **识别丢失的提交:**

```
abc1234 HEAD@{1}: reset: moving to HEAD~3
def5678 HEAD@{2}: commit: feat(auth): implement login
```

3. **恢复提交:**

```bash
git reset --hard def5678
```

### 子模块

**添加子模块:**

**提示:**

```
将 shared-utils 仓库作为 git 子模块添加到 lib/ 目录
```

**Claude Code 响应:**

```bash
git submodule add https://github.com/org/shared-utils.git lib/shared-utils
git commit -m "chore: add shared-utils submodule"
```

**更新子模块:**

```bash
git submodule update --init --recursive
```

---

## 故障排除

### 撤销更改

**丢弃未提交的更改:**

**提示:**

```
丢弃我工作目录中的所有未提交更改
```

**Claude Code 响应:**

```bash
git restore .
```

**丢弃特定文件:**

```bash
git restore src/services/userService.js
```

**取消暂存文件:**

```
取消暂存所有文件但保留更改
```

```bash
git restore --staged .
```

### 撤销提交

**撤销最后一次提交(保留更改):**

**提示:**

```
撤销我最后一次提交但在工作目录中保留更改
```

**Claude Code 响应:**

```bash
git reset --soft HEAD~1
```

**撤销最后一次提交(丢弃更改):**

```bash
git reset --hard HEAD~1
```

⚠️ **警告:** `--hard` 标志会永久删除更改!

**撤销已推送的提交(创建还原提交):**

```
还原已经推送的提交 abc1234
```

```bash
git revert abc1234
```

### 大文件问题

**提示:**

```
我不小心提交了一个大文件。从历史中删除它。
```

**Claude Code 响应:**

```bash
# 使用 filter-branch 从历史中删除文件
git filter-branch --tree-filter 'rm -f path/to/large-file' HEAD

# 或使用 BFG Repo-Cleaner (更快)
bfg --delete-files large-file.zip
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 分离的 HEAD 状态

**提示:**

```
我处于分离的 HEAD 状态。如何回到我的分支?
```

**Claude Code 响应:**

1. **如果想保留更改:**

```bash
git branch temp-branch
git checkout main
git merge temp-branch
```

2. **如果想丢弃更改:**

```bash
git checkout main
```

---

## 最佳实践总结

### ✅ 要做的

1. **写描述性的提交消息**
   - 使用约定式提交格式
   - 解释为什么,而不仅仅是什么

2. **经常提交,策略性推送**
   - 进行小而专注的提交
   - 在合并到 main 前压缩

3. **保持分支短期存在**
   - 在几天而非几周内合并功能分支
   - 减少合并冲突

4. **使用功能分支**
   - 永远不要直接提交到 main
   - 使用描述性分支名称

5. **合并前变基**
   - 保持线性历史
   - 更容易理解项目演变

6. **利用 Git Hooks**
   - 在到达仓库前捕获问题
   - 强制执行代码质量标准

### ❌ 不要做的

1. **不要提交密钥**
   - 永远不要提交 API 密钥、密码或令牌
   - 使用 `.gitignore` 和 `.env` 文件

2. **不要重写公开历史**
   - 永远不要强制推送到共享分支
   - 不要修改其他人已拉取的提交

3. **不要提交生成的文件**
   - 排除 `node_modules/`、`dist/`、`coverage/`
   - 保持仓库大小可管理

4. **不要在提交中混合关注点**
   - 一个提交 = 一个逻辑更改
   - 使 cherry-picking 和还原更容易

5. **不要忽视冲突**
   - 仔细解决冲突
   - 解决后彻底测试

---

## 高级工作流

### GitFlow

**初始化 GitFlow:**

**提示:**

```
为这个仓库设置 GitFlow
```

**Claude Code 响应:**

```bash
git flow init
```

**创建功能:**

```bash
git flow feature start user-authentication
```

**完成功能:**

```bash
git flow feature finish user-authentication
```

**创建发布:**

```bash
git flow release start 1.0.0
git flow release finish 1.0.0
```

### 基于主干的开发

**提示:**

```
我想使用基于主干的开发。我应该如何构建工作流?
```

**Claude Code 响应:**

1. **短期功能分支**
   - 从 main 创建分支
   - 最多工作 1-2 天
   - 频繁合并回 main

2. **功能标志**
   - 在标志后隐藏不完整的功能
   - 安全部署到生产环境

3. **持续集成**
   - 每次提交自动化测试
   - 快速反馈循环

**示例:**

```bash
git checkout main
git pull origin main
git checkout -b feat/quick-fix
# ... 进行更改 ...
git add .
git commit -m "feat: add quick feature"
git push origin feat/quick-fix
# ... 在几小时内创建 PR 并合并 ...
```

---

## 结论

掌握使用 Claude Code 的 Git 工作流可以实现:

- **更快的开发**: 自动化重复的 Git 任务
- **更好的协作**: 标准化的提交消息和 PR 描述
- **更高的质量**: 预提交钩子及早捕获问题
- **干净的历史**: 轻松进行代码考古和调试

**下一步:**

1. 在项目中设置 git hooks
2. 练习约定式提交
3. 尝试高级 Git 操作
4. 探索 [提示工程指南](./05-prompt-engineering.zh.md)

---

**相关文档:**

- [入门指南](./01-getting-started.zh.md)
- [安全最佳实践](./02-security-best-practices.zh.md)
- [提示工程](./05-prompt-engineering.zh.md)

**外部资源:**

- [约定式提交](https://www.conventionalcommits.org/)
- [Git 文档](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
