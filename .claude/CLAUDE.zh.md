# Claude Code Best Practices - 项目上下文

> **语言 (Language)**: [English](CLAUDE.md) | 简体中文

本文档为 Claude Code 在此项目中工作提供全面的上下文。它定义了我们的编码标准、开发工作流程和最佳实践。

---

## 📋 项目概览

**项目名称**: Claude Code Best Practices
**技术栈**: Node.js >= 18.0.0, JavaScript/TypeScript, Jest, ESLint, Prettier
**目的**: 在专业软件开发中掌握 Claude Code 的生产级指南和工具包

### 项目目标

1. **教育**: 教导开发者如何在生产环境中有效使用 Claude Code
2. **标准化**: 为常见工作流程提供可复用的配置和模板
3. **自动化**: 提供自定义命令和代理来自动化重复任务
4. **安全**: 演示使用 AI 助手时保护敏感数据的最佳实践
5. **效率**: 为大型代码库优化 token 使用和上下文管理

### 架构

```
Claude-Code-Best-Practices/
├── .claude/           # Claude Code 配置(本目录)
├── docs/              # 综合文档
├── examples/          # 真实示例(TDD 演示、重构)
├── templates/         # 可复用模板
├── PLAN.md            # 开发路线图
└── CONTRIBUTING.md    # 贡献指南
```

### 开发哲学

- **安全优先**: 保护敏感数据,验证输入,遵循 OWASP 指南
- **测试驱动开发**: 在实现之前编写测试
- **简单胜于巧妙**: 清晰、可维护的代码优于过早优化
- **文档即代码**: 保持文档与实现同步
- **渐进式披露**: 为初学者提供简单示例,为专家提供高级模式

---

## 💻 编码标准

### JavaScript/TypeScript 风格指南

#### 命名约定

```javascript
// 变量和函数: camelCase
const userName = "John";
function getUserById(id) {}

// 类和构造函数: PascalCase
class UserRepository {}
const myDate = new Date();

// 常量: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";

// 私有属性: 使用 # 实现真正的私有性(ES2022+)或使用 _ 作为约定
class ModernService {
  #privateField = "secret"; // 真正的私有
  #privateMethod() {} // 真正的私有
}

class LegacyService {
  _privateField = "convention"; // 仅作为约定,仍可访问
  _privateMethod() {} // 仅作为约定,仍可访问
}

// 布尔变量: 使用 is/has/should 前缀
const isActive = true;
const hasPermission = false;
const shouldValidate = true;
```

#### 代码风格

```javascript
// ✅ 好: 2 空格缩进,分号,单引号
const greeting = "Hello, world";
if (condition) {
  doSomething();
}

// ❌ 坏: 制表符,无分号,双引号
const greeting = "Hello, world";
if (condition) {
  doSomething();
}

// ✅ 好: 多行结构中的尾随逗号
const config = {
  name: "app",
  version: "1.0.0",
  author: "Team",
};

// ✅ 好: 解构以提高清晰度
const { id, name, email } = user;

// ✅ 好: 回调使用箭头函数
items.map((item) => item.id);

// ✅ 好: 字符串插值使用模板字面量
const message = `Hello, ${userName}!`;
```

#### 文件组织

```javascript
// 1. 导入: 内置 → 外部 → 内部
import fs from "fs";
import path from "path";
import express from "express";
import lodash from "lodash";
import { getUserById } from "./services/userService.js";
import { logger } from "./utils/logger.js";

// 2. 常量
const PORT = 3000;

// 3. 主代码
class Application {
  // ...
}

// 4. 导出放在底部
export { Application };
export default Application;
```

#### 错误处理

```javascript
// ✅ 好: 具体的错误类型,描述性消息
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError("Email is required");
  }
  // 验证邮箱格式等
}

// ✅ 好: async/await 配合 try-catch
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    logger.error("Failed to fetch user", { id, error });
    throw error;
  }
}
```

### 导入排序规则

1. Node.js 内置模块 (fs, path, http)
2. 外部包 (express, lodash, jest)
3. 内部模块 (utilities, services, models)
4. 组之间空一行

### TypeScript 最佳实践

#### 类型注解

```typescript
// ✅ 好: 为公共 API 明确返回类型
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 好: 对象形状使用 interface
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// ✅ 好: 联合类型和基本类型使用 type
type Status = "pending" | "active" | "completed";
type ID = string | number;

// ✅ 好: 可复用函数使用泛型类型
function findById<T extends { id: string }>(
  items: T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id);
}
```

#### 现代 JavaScript 特性

```typescript
// ✅ 好: 使用 # 的私有字段(ES2022+)
class UserService {
  #database: Database; // 真正的私有,不仅仅是约定

  constructor(database: Database) {
    this.#database = database;
  }

  async #hashPassword(password: string): Promise<string> {
    // 私有方法 - 类外部无法访问
    return bcrypt.hash(password, 10);
  }
}

// ⚠️ 可接受: 下划线约定用于向后兼容
class LegacyService {
  private _database: Database; // TypeScript private(仅编译时)

  private _internalMethod(): void {
    // 标记为私有但运行时可访问
  }
}
```

#### 类型守卫和收窄

```typescript
// ✅ 好: 运行时检查的类型守卫
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" && obj !== null && "id" in obj && "email" in obj
  );
}

// 用法
if (isUser(data)) {
  console.log(data.email); // TypeScript 知道这是安全的
}

// ✅ 好: 可辨识联合
type Result<T> = { success: true; data: T } | { success: false; error: string };

function handleResult<T>(result: Result<T>): void {
  if (result.success) {
    console.log(result.data); // TypeScript 知道 data 存在
  } else {
    console.error(result.error); // TypeScript 知道 error 存在
  }
}
```

#### 工具类型

```typescript
// ✅ 好: 利用内置工具类型
type PartialUser = Partial<User>; // 所有属性可选
type RequiredUser = Required<User>; // 所有属性必需
type UserKeys = keyof User; // 'id' | 'email' | 'createdAt'
type UserEmail = Pick<User, "email">; // { email: string }
type UserWithoutId = Omit<User, "id">; // { email: string; createdAt: Date }
```

## 🔧 常用 Bash 命令

### Git 工作流

```bash
# 功能开发工作流
git checkout main
git pull origin main
git checkout -b feat/feature-name
# ... 进行更改 ...
git add .
git commit -m "feat(scope): description"
git push origin feat/feature-name

# 错误修复工作流
git checkout -b fix/bug-description
# ... 修复错误 ...
git commit -m "fix(scope): description"

# 使用最新 main 更新分支
git checkout main
git pull origin main
git checkout feat/feature-name
git rebase main

# 合并前压缩提交
git rebase -i HEAD~3  # 交互式变基最后 3 个提交

# 撤销最后一次提交(保留更改)
git reset --soft HEAD~1

# 撤销最后一次提交(丢弃更改)
git reset --hard HEAD~1

# 查看提交历史
git log --oneline --graph --all --decorate
```

### npm/yarn 命令

```bash
# 安装依赖
npm install

# 运行测试
npm test
npm run test:watch      # 监视模式
npm run test:coverage   # 带覆盖率

# 代码检查和格式化
npm run lint            # 检查问题
npm run lint:fix        # 自动修复问题
npm run format          # 格式化所有文件
npm run format:check    # 检查格式

# 开发
npm run dev             # 启动开发服务器(如果适用)

# 构建
npm run build           # 生产构建

# 清理(注意: 需要手动执行,因为 rm -rf 受限)
rm -r node_modules
rm package-lock.json
npm install
```

### 测试命令

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- path/to/test.spec.js

# 运行匹配模式的测试
npm test -- --testNamePattern="UserService"

# 运行带覆盖率的测试
npm run test:coverage

# 更新快照
npm test -- -u

# 调试测试
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 🧪 测试驱动开发 (TDD)

### TDD 工作流: Red-Green-Refactor

#### 阶段 1: RED - 编写失败的测试

**提示模板:**

```
我想实现 [功能]。遵循 TDD,请:

1. 为 [特定行为] 编写失败的测试
2. 测试应验证 [预期结果]
3. 使用遵循以下模式的描述性测试名称: "should [behavior] when [condition]"
4. 包括正常路径和边缘情况

暂时不要实现功能 - 只编写测试。
```

**示例:**

```javascript
// tests/userService.spec.js
describe("UserService", () => {
  describe("getUserById", () => {
    it("should return user when valid ID is provided", async () => {
      const userId = "123";
      const user = await getUserById(userId);

      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
    });

    it("should throw error when user not found", async () => {
      const invalidId = "nonexistent";

      await expect(getUserById(invalidId)).rejects.toThrow("User not found");
    });

    it("should throw error when ID is null or undefined", async () => {
      await expect(getUserById(null)).rejects.toThrow();
      await expect(getUserById(undefined)).rejects.toThrow();
    });
  });
});
```

#### 阶段 2: GREEN - 使测试通过

**提示模板:**

```
测试现在失败了(符合预期)。请实现使此测试通过所需的最少代码。

要求:
- 仅专注于使测试通过
- 不要添加额外功能或优化
- 使用最简单的可行解决方案
- 必要时在此阶段可以硬编码值
```

**示例:**

```javascript
// src/services/userService.js
export async function getUserById(id) {
  if (!id) {
    throw new Error("User ID is required");
  }

  // 最小实现 - 从数据源获取
  const user = await database.users.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
```

#### 阶段 3: REFACTOR - 改进代码

**提示模板:**

```
测试通过了。现在让我们重构以改进:

1. 代码结构和组织
2. 消除重复(DRY 原则)
3. 改进命名和清晰度
4. 添加适当的错误处理
5. 提取可复用的函数/类

确保重构后所有测试仍然通过。
```

**示例:**

```javascript
// src/services/userService.js
import { validateId } from "../utils/validation.js";
import { UserNotFoundError } from "../errors/UserErrors.js";

export class UserService {
  constructor(database) {
    this.db = database;
  }

  async getUserById(id) {
    validateId(id); // 提取的验证

    const user = await this.db.users.findById(id);

    if (!user) {
      throw new UserNotFoundError(id); // 特定错误类型
    }

    return user;
  }
}
```

### 测试结构最佳实践

```javascript
describe("FeatureName", () => {
  // 设置: 在每个测试之前运行
  beforeEach(() => {
    // 初始化测试数据
  });

  // 清理: 在每个测试之后运行
  afterEach(() => {
    // 清理
  });

  describe("methodName", () => {
    it("should [expected behavior] when [condition]", () => {
      // 准备: 设置测试数据和依赖
      const input = "test data";
      const expected = "expected result";

      // 执行: 执行被测试的代码
      const actual = functionUnderTest(input);

      // 断言: 验证结果
      expect(actual).toBe(expected);
    });
  });
});
```

### 测试命名约定

```javascript
// ✅ 好: 描述性的,关注行为
it("should return 404 when user does not exist", () => {});
it("should create user with hashed password", () => {});
it("should throw ValidationError when email is invalid", () => {});

// ❌ 坏: 模糊的,关注实现
it("works", () => {});
it("test user creation", () => {});
it("calls the database", () => {});
```

---

## 🔄 开发工作流

### 功能开发工作流

1. **理解需求**
   - 仔细阅读功能请求
   - 如有需要提出澄清性问题
   - 确定验收标准

2. **计划实现**
   - 确定受影响的文件
   - 考虑边缘情况
   - 计划测试策略

3. **编写测试 (TDD)**
   - 首先编写失败的测试
   - 覆盖正常路径和边缘情况
   - 运行测试确认它们失败

4. **实现功能**
   - 编写通过测试的最少代码
   - 遵循编码标准
   - 保持提交专注

5. **重构**
   - 改进代码质量
   - 消除重复
   - 确保测试仍然通过

6. **文档**
   - 为复杂逻辑添加内联注释
   - 更新相关文档
   - 如适用添加示例

7. **审查**
   - 自我审查更改
   - 运行检查工具和格式化工具
   - 确保所有测试通过

### 错误修复工作流

1. **重现错误**
   - 创建演示错误的失败测试
   - 记录重现步骤
   - 确定根本原因

2. **修复错误**
   - 做最小的更改来修复问题
   - 确保测试现在通过
   - 验证其他测试没有回归

3. **添加回归测试**
   - 确保错误被测试覆盖
   - 测试与错误相关的边缘情况

4. **记录修复**
   - 解释错误的原因
   - 描述解决方案
   - 在提交中引用问题编号

### 代码审查工作流

**审查代码时:**

1. **功能性**
   - 是否满足需求?
   - 是否有未处理的边缘情况?
   - 错误处理是否适当?

2. **测试**
   - 新代码是否有测试?
   - 测试是否覆盖边缘情况?
   - 覆盖率是否超过 80%?

3. **代码质量**
   - 是否遵循编码标准?
   - 是否清晰可维护?
   - 是否没有不必要的复杂性?

4. **安全性**
   - 是否存在输入验证?
   - 是否没有硬编码的密钥?
   - 是否防止 SQL 注入?
   - 是否防止 XSS?

5. **性能**
   - 是否没有明显的性能问题?
   - 数据库查询是否优化?
   - 是否没有不必要的循环?

---

## 🔐 安全指南

### 输入验证

```javascript
// ✅ 好: 验证所有用户输入
function createUser(data) {
  if (!data.email || !isValidEmail(data.email)) {
    throw new ValidationError("Invalid email");
  }
  if (!data.password || data.password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters");
  }
  // ... 创建用户
}

// ❌ 坏: 信任用户输入
function createUser(data) {
  database.insert(data); // SQL 注入风险!
}
```

### 密钥管理

```javascript
// ✅ 好: 使用环境变量
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

// ❌ 坏: 硬编码密钥
const apiKey = "sk-1234567890abcdef"; // 永远不要这样做
```

### SQL 注入防护

```javascript
// ✅ 好: 使用参数化查询
const user = await db.query("SELECT * FROM users WHERE id = ?", [userId]);

// ❌ 坏: 字符串拼接
const user = await db.query(
  `SELECT * FROM users WHERE id = '${userId}'`, // 有漏洞!
);
```

---

## 📝 文档标准

### 内联注释

```javascript
// ✅ 好: 解释为什么,而不是什么
// 使用指数退避避免在中断期间压倒 API
const delay = Math.pow(2, retryCount) * 1000;

// ❌ 坏: 陈述显而易见的内容
// 将 2 的 retryCount 次方乘以 1000
const delay = Math.pow(2, retryCount) * 1000;
```

### JSDoc 注释

```javascript
/**
 * 通过 ID 从数据库获取用户
 * @param {string} userId - 用户的唯一标识符
 * @returns {Promise<User>} 用户对象
 * @throws {UserNotFoundError} 当用户不存在时
 * @throws {ValidationError} 当 userId 无效时
 */
async function getUserById(userId) {
  // 实现
}
```

---

## 🎯 Claude Code 使用技巧

### 有效的提示

**具体明确:**

```
❌ "添加验证"
✅ "使用正则表达式模式为 createUser 函数添加邮箱验证。
   如果验证失败,抛出带有消息 'Invalid email format' 的 ValidationError。"
```

**提供上下文:**

```
❌ "修复错误"
✅ "getUserById 函数对有效的用户 ID 返回 null。
   查看代码,我认为问题出在第 45 行的数据库查询中。
   你能调查并修复它吗?"
```

**分解复杂任务:**

```
❌ "构建完整的认证系统"
✅ "让我们一步步构建认证:
   1. 首先,创建带有邮箱和哈希密码的 User 模型
   2. 然后,使用 bcrypt 实现密码哈希
   3. 接下来,创建带有 JWT token 生成的登录端点
   4. 最后,添加认证中间件"
```

### 利用 CLAUDE.md

此文件会被 Claude Code 自动读取。引用此文件的部分:

```
"遵循我们在 CLAUDE.md 中定义的 TDD 工作流,请先为登录功能编写测试"

"使用编码标准部分的错误处理模式"

"遵循功能开发工作流来实现这个"
```

---

## 📦 项目特定说明

### Token 优化

- 使用增量编辑(Edit 工具)而不是重写整个文件
- 讨论代码时引用行号
- 让 Claude 读取特定文件而不是口头描述代码
- 将大任务分解为更小、更专注的子任务

### 文件排除

Claude Code 不应访问:

- `.env` 文件(包含密钥)
- `node_modules/` (第三方代码)
- `coverage/` (生成的报告)
- `.git/` (版本控制内部)

完整列表见 `.claudeignore`。

---

**最后更新**: 2026-01-06
**维护者**: Claude Code Best Practices Contributors
