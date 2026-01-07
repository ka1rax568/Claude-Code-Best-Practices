# TDD 工作流文档

> **语言 (Language)**: [English](WORKFLOW.md) | 简体中文

本文档解释了用于构建 Todo API 的测试驱动开发工作流，为将 TDD 应用于您自己的项目提供分步指南。

## 目录

- [概述](#概述)
- [红-绿-重构循环](#红-绿-重构循环)
- [分步实现](#分步实现)
- [测试策略](#测试策略)
- [经验教训](#经验教训)

---

## 概述

测试驱动开发（TDD）是一种软件开发方法，在编写实际代码**之前**先编写测试。这确保了：

- **明确需求**: 测试定义代码应该做什么
- **更好的设计**: 先编写测试导致更模块化、可测试的代码
- **对更改的信心**: 全面的测试可以捕获回归
- **活文档**: 测试作为代码应如何使用的示例

### TDD 的三定律

1. **在有一个失败的测试之前不要编写生产代码**
2. **只编写足够演示失败的测试**
3. **只编写足够使失败测试通过的生产代码**

---

## 红-绿-重构循环

### 🔴 RED: 编写一个失败的测试

首先编写一个描述您想要实现的行为的测试。

**示例：测试 Todo 创建**

```javascript
it("should create a todo with title and description", () => {
  const todo = new Todo("Buy groceries", "Milk, eggs, bread");

  expect(todo).toBeDefined();
  expect(todo.id).toBeDefined();
  expect(todo.title).toBe("Buy groceries");
  expect(todo.description).toBe("Milk, eggs, bread");
  expect(todo.completed).toBe(false);
});
```

**运行测试**: 失败，因为 `Todo` 类还不存在。❌

### ✅ GREEN: 使其通过

编写使测试通过所需的最少代码。

```javascript
export class Todo {
  constructor(title, description = "") {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}
```

**运行测试**: 通过！✅

### ♻️ REFACTOR: 改进代码

现在测试已经通过，在不改变行为的情况下改进代码质量。

```javascript
export class Todo {
  constructor(title, description = "") {
    this.#validateTitle(title);
    this.#validateDescription(description);

    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  #validateTitle(title) {
    if (!title || title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (title.length > 200) {
      throw new Error("Title must be between 1 and 200 characters");
    }
  }

  #validateDescription(description) {
    if (description && description.length > 1000) {
      throw new Error("Description must not exceed 1000 characters");
    }
  }
}
```

**运行测试**: 仍然通过！✅

---

## 分步实现

### 阶段 1: 领域模型（Todo 类）

#### 迭代 1: 基本 Todo 创建

1. **RED**: 为创建 todo 编写测试
2. **GREEN**: 实现 Todo 构造函数
3. **REFACTOR**: 提取验证方法
4. **COMMIT**: `feat(todo): add Todo model with validation`

#### 迭代 2: Todo 完成

1. **RED**: 为标记 todo 完成编写测试
2. **GREEN**: 实现 `complete()` 方法
3. **REFACTOR**: 更新 `updatedAt` 时间戳
4. **COMMIT**: `feat(todo): add complete method`

#### 迭代 3: Todo 更新

1. **RED**: 为更新 todo 字段编写测试
2. **GREEN**: 实现 `update()` 方法
3. **REFACTOR**: 重用验证逻辑
4. **COMMIT**: `feat(todo): add update method`

### 阶段 2: 业务逻辑（TodoService）

#### 迭代 4: 创建 Todo

1. **RED**: 为 `createTodo()` 编写测试
2. **GREEN**: 使用内存存储实现服务
3. **REFACTOR**: 使用 Map 进行高效查找
4. **COMMIT**: `feat(service): implement createTodo`

#### 迭代 5: 读取 Todos

1. **RED**: 为 `getAllTodos()` 和 `getTodoById()` 编写测试
2. **GREEN**: 实现读取操作
3. **REFACTOR**: 添加 null 检查和边缘情况
4. **COMMIT**: `feat(service): implement read operations`

#### 迭代 6: 更新和删除

1. **RED**: 为更新和删除编写测试
2. **GREEN**: 实现方法
3. **REFACTOR**: 一致地处理未找到的情况
4. **COMMIT**: `feat(service): implement update and delete`

### 阶段 3: API 层（Express 路由）

#### 迭代 7: POST /todos

1. **RED**: 为通过 API 创建 todo 编写集成测试
2. **GREEN**: 实现 Express 路由
3. **REFACTOR**: 提取验证中间件
4. **COMMIT**: `feat(api): add POST /todos endpoint`

#### 迭代 8: GET /todos

1. **RED**: 为列出 todos 编写集成测试
2. **GREEN**: 实现路由
3. **REFACTOR**: 提取 JSON 序列化
4. **COMMIT**: `feat(api): add GET /todos endpoint`

#### 迭代 9: 其余端点

为以下重复：

- GET /todos/:id
- PUT /todos/:id
- DELETE /todos/:id
- PATCH /todos/:id/complete

---

## 测试策略

### 测试金字塔

```
       /\
      /E2E\          集成测试（API 端点）
     /------\
    / Unit  \        单元测试（模型、服务）
   /________\
```

### 单元测试

单独测试各个类和函数。

**位置**: `tests/models/`, `tests/services/`

**目的**:

- 验证业务逻辑
- 测试边缘情况
- 快速执行

**示例**:

```javascript
describe("Todo Model", () => {
  it("should throw error when title exceeds 200 characters", () => {
    const longTitle = "a".repeat(201);
    expect(() => new Todo(longTitle)).toThrow();
  });
});
```

### 集成测试

通过 API 测试完整的请求/响应周期。

**位置**: `tests/integration/`

**目的**:

- 验证端点端到端工作
- 测试 HTTP 状态码和响应
- 确保组件协同工作

**示例**:

```javascript
describe("POST /todos", () => {
  it("should create and return new todo", async () => {
    const response = await request(app)
      .post("/todos")
      .send({ title: "Test Todo" })
      .expect(201);

    expect(response.body.id).toBeDefined();
  });
});
```

### 测试隔离

每个测试应该是独立的：

```javascript
beforeEach(() => {
  app = createApp(); // 每个测试的新实例
});
```

这确保测试不会互相影响，可以以任何顺序运行。

---

## 经验教训

### 1. 从简单开始

从最简单的测试用例（正常路径）开始，然后添加复杂性：

```javascript
// 从这开始
it("should create todo", () => {
  const todo = new Todo("Title", "Description");
  expect(todo.title).toBe("Title");
});

// 然后添加边缘情况
it("should throw when title is empty", () => {
  expect(() => new Todo("")).toThrow();
});
```

### 2. 测试行为，而非实现

关注代码**做什么**，而不是**如何做**：

```javascript
// ✅ 正确：测试行为
it("should mark todo as completed", () => {
  todo.complete();
  expect(todo.completed).toBe(true);
});

// ❌ 错误：测试实现细节
it("should set completed property to true", () => {
  todo.completed = true; // 直接访问内部
  expect(todo.completed).toBe(true);
});
```

### 3. 每个概念一个断言

每个测试应该验证一个特定的行为：

```javascript
// ✅ 正确：专注的测试
it("should set default completed to false", () => {
  const todo = new Todo("Title");
  expect(todo.completed).toBe(false);
});

// ❌ 错误：测试多个事情
it("should create todo with correct defaults", () => {
  const todo = new Todo("Title");
  expect(todo.completed).toBe(false);
  expect(todo.title).toBe("Title");
  expect(todo.id).toBeDefined();
  // 太多不相关的断言
});
```

### 4. 使用描述性的测试名称

测试名称应该描述预期的行为：

```javascript
// ✅ 正确
it("should return 404 when todo does not exist", () => {});

// ❌ 错误
it("test get todo", () => {});
```

### 5. 有信心地重构

一旦测试通过，自由重构，知道测试会捕获错误：

```javascript
// 初始实现
function createTodo(title, description) {
  if (!title) throw new Error("Title required");
  if (title.length > 200) throw new Error("Title too long");
  return { id: uuidv4(), title, description };
}

// 重构后（测试仍然通过！）
class Todo {
  constructor(title, description) {
    this.#validateTitle(title);
    this.id = uuidv4();
    this.title = title;
    this.description = description;
  }

  #validateTitle(title) {
    if (!title) throw new Error("Title required");
    if (title.length > 200) throw new Error("Title too long");
  }
}
```

### 6. 测试覆盖率是指南，而非目标

- 追求 >90% 覆盖率，但专注于有意义的测试
- 100% 覆盖率不意味着无错误代码
- 某些代码（如错误日志记录）可能不需要测试

### 7. 为边缘情况编写测试

不要只测试正常路径：

```javascript
describe("updateTodo", () => {
  it("should update existing todo", () => {}); // 正常路径
  it("should return null when todo not found", () => {}); // 边缘情况
  it("should validate updated title length", () => {}); // 边缘情况
  it("should handle empty updates", () => {}); // 边缘情况
});
```

---

## TDD 的 Git 工作流

### 每个循环后提交

每个红-绿-重构循环应该产生一个提交：

```bash
# RED
git add tests/
git commit -m "test(todo): add failing test for complete method [RED]"

# GREEN
git add src/
git commit -m "feat(todo): implement complete method [GREEN]"

# REFACTOR
git add src/
git commit -m "refactor(todo): extract timestamp update logic [REFACTOR]"
```

### 约定式提交

使用有意义的提交消息：

- `test(scope): description [RED]` - 失败的测试
- `feat(scope): description [GREEN]` - 实现
- `refactor(scope): description [REFACTOR]` - 代码改进

---

## 运行测试

```bash
# 运行所有测试
npm test

# 在监视模式下运行（文件更改时自动重新运行）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm test -- tests/models/Todo.test.js

# 运行匹配模式的测试
npm test -- --testNamePattern="should create"
```

---

## 覆盖率报告

我们的最终覆盖率：

```
-----------------|---------|----------|---------|---------│
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------│
All files        |   93.27 |      100 |     100 |   93.04 |
 middleware      |   92.3  |      100 |     100 |   92.3  |
 models          |    100  |      100 |     100 |    100  |
 routes          |  88.13  |      100 |     100 |   87.5  |
 services        |    100  |      100 |     100 |    100  |
-----------------|---------|----------|---------|---------│
```

**76 个测试，全部通过！** ✅

---

## 下一步

练习 TDD：

1. **添加新功能**（例如 todo 优先级）
   - 首先编写失败的测试
   - 实现最少的代码
   - 重构

2. **使用 TDD 修复错误**：
   - 编写重现错误的测试
   - 修复代码
   - 验证测试通过

3. **重构现有代码**：
   - 测试提供安全网
   - 有信心地进行改进
   - 确保测试仍然通过

---

**记住**: TDD 是一门随着实践而提高的学科。从小处开始，保持耐心，相信这个过程！

---

_最后更新: 2026-01-07_
