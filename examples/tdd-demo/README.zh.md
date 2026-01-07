# TDD 演示: 构建 Todo API

> **语言 (Language)**: [English](README.md) | 简体中文

这是一个**完整的测试驱动开发（TDD）演示**，展示如何使用红-绿-重构循环从零开始构建生产质量的 Todo API。

## 你将学到什么

- **TDD 工作流**: 先编写测试，然后实现功能
- **红-绿-重构**: 实践中的核心 TDD 循环
- **Jest 测试**: 单元和集成测试，覆盖率 >90%
- **整洁架构**: 关注点分离和可维护性
- **Git 工作流**: 提交历史显示 TDD 进展

## 前置要求

- Node.js >= 18.0.0
- 基本的 JavaScript/ES6 知识
- 熟悉 REST API

## 快速开始

```bash
# 安装依赖
npm install

# 运行所有测试
npm test

# 在监视模式下运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 启动 API 服务器
npm start
```

## API 端点

| 方法   | 端点                    | 描述           |
| ------ | ----------------------- | -------------- |
| POST   | /todos                  | 创建新的 todo  |
| GET    | /todos                  | 列出所有 todos |
| GET    | /todos/:id              | 获取特定 todo  |
| PUT    | /todos/:id              | 更新 todo      |
| DELETE | /todos/:id              | 删除 todo      |
| PATCH  | /todos/:id/complete     | 标记 todo 完成 |

## 演示的 TDD 工作流

### 阶段 1: RED - 编写一个失败的测试

每个功能都从一个定义预期行为的失败测试开始：

```javascript
// tests/todoService.test.js
it("should create a new todo with title and description", () => {
  const todo = createTodo("Buy groceries", "Milk, eggs, bread");

  expect(todo).toBeDefined();
  expect(todo.id).toBeDefined();
  expect(todo.title).toBe("Buy groceries");
  expect(todo.description).toBe("Milk, eggs, bread");
  expect(todo.completed).toBe(false);
});
```

运行测试：**失败**，因为函数还不存在。

### 阶段 2: GREEN - 使其通过

编写使测试通过的最少代码：

```javascript
// src/services/todoService.js
import { v4 as uuidv4 } from "uuid";

export function createTodo(title, description) {
  return {
    id: uuidv4(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}
```

运行测试：**通过** ✅

### 阶段 3: REFACTOR - 改进代码

现在测试已经通过，改进实现：

```javascript
// src/models/Todo.js
export class Todo {
  constructor(title, description) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  complete() {
    this.completed = true;
    this.updatedAt = new Date().toISOString();
  }
}
```

再次运行测试：**仍然通过** ✅

## 项目结构

```
tdd-demo/
├── src/
│   ├── models/
│   │   └── Todo.js           # Todo 领域模型
│   ├── services/
│   │   └── todoService.js    # 业务逻辑
│   ├── routes/
│   │   └── todoRoutes.js     # Express 路由
│   ├── middleware/
│   │   └── validation.js     # 输入验证
│   └── index.js              # 应用程序入口点
├── tests/
│   ├── models/
│   │   └── Todo.test.js      # 模型测试
│   ├── services/
│   │   └── todoService.test.js  # 服务测试
│   └── integration/
│       └── api.test.js       # 集成测试
├── package.json
└── README.md (本文件)
```

## 测试策略

### 1. 单元测试

单独测试各个函数和类：

```javascript
// 测试 Todo 模型
describe("Todo", () => {
  it("should create todo with default completed=false", () => {
    const todo = new Todo("Test", "Description");
    expect(todo.completed).toBe(false);
  });

  it("should mark todo as complete", () => {
    const todo = new Todo("Test", "Description");
    todo.complete();
    expect(todo.completed).toBe(true);
  });
});
```

### 2. 集成测试

端到端测试 API 端点：

```javascript
// 测试 POST /todos 端点
describe("POST /todos", () => {
  it("should create and return new todo", async () => {
    const response = await request(app)
      .post("/todos")
      .send({ title: "Test Todo", description: "Test Description" })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe("Test Todo");
  });
});
```

### 3. 边缘情况

测试验证和错误处理：

```javascript
it("should return 400 when title is missing", async () => {
  await request(app)
    .post("/todos")
    .send({ description: "No title" })
    .expect(400);
});

it("should return 404 when todo not found", async () => {
  await request(app).get("/todos/nonexistent-id").expect(404);
});
```

## 覆盖率目标

该项目保持 >90% 的代码覆盖率：

```bash
npm run test:coverage
```

```
-----------------|---------|----------|---------|---------│
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------│
All files        |   92.5  |   91.2   |   93.8  |   92.5  |
 models/         |   100   |   100    |   100   |   100   |
  Todo.js        |   100   |   100    |   100   |   100   |
 services/       |   95.8  |   90.0   |   100   |   95.8  |
  todoService.js |   95.8  |   90.0   |   100   |   95.8  |
-----------------|---------|----------|---------|---------│
```

## Git 提交历史

提交历史演示了 TDD 工作流：

```
feat(todo): add Todo model with tests [GREEN]
test(todo): add failing test for createTodo [RED]
feat(todo): implement createTodo function [GREEN]
refactor(todo): extract Todo class from createTodo [REFACTOR]
test(todo): add failing test for getTodoById [RED]
feat(todo): implement getTodoById function [GREEN]
...
```

每个提交都遵循[约定式提交](https://www.conventionalcommits.org/)规范。

## 演示的关键 TDD 原则

### 1. 先编写测试

在没有失败测试的情况下永远不要编写生产代码。

### 2. 最小实现

只编写足够使测试通过的代码。

### 3. 有信心地重构

测试确保重构不会破坏功能。

### 4. 快速反馈循环

经常运行测试（使用监视模式）。

### 5. 测试行为，而非实现

关注代码做什么，而不是如何做。

## 常见模式

### Arrange-Act-Assert (AAA)

```javascript
it("should update todo title", () => {
  // Arrange: 设置测试数据
  const todo = new Todo("Original", "Description");

  // Act: 执行被测代码
  todo.updateTitle("Updated Title");

  // Assert: 验证结果
  expect(todo.title).toBe("Updated Title");
});
```

### 测试隔离

```javascript
describe("TodoService", () => {
  let service;

  beforeEach(() => {
    // 每个测试的新实例
    service = new TodoService();
  });

  afterEach(() => {
    // 清理
    service = null;
  });
});
```

## 验证规则

API 根据以下规则验证输入：

- **标题**: 必需，1-200 个字符
- **描述**: 可选，最多 1000 个字符
- **ID**: 必须是有效的 UUID v4 格式

## 错误处理

所有端点返回一致的错误响应：

```javascript
{
  "error": "Todo not found",
  "message": "No todo exists with id: 123e4567-e89b-12d3-a456-426614174000",
  "statusCode": 404
}
```

## 演示的最佳实践

✅ 在实现前编写测试
✅ 保持测试简单和专注
✅ 使用描述性的测试名称
✅ 测试边缘情况和错误条件
✅ 保持高测试覆盖率
✅ 频繁提交并使用清晰的消息
✅ 持续重构
✅ 分离关注点（模型、服务、路由）

## 下一步

完成此演示后，尝试：

1. 向 GET /todos 添加过滤/排序
2. 添加分页支持
3. 实现 todo 类别/标签
4. 添加截止日期和优先级
5. 构建数据库层（而不是内存）
6. 添加认证和授权
7. 创建前端客户端

## 资源

- [Jest 文档](https://jestjs.io/)
- [测试驱动开发：实例教程](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Kent Beck
- [测试驱动的面向对象软件开发](https://www.amazon.com/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627)
- [Martin Fowler 关于 TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

## 许可证

MIT - 请参阅项目根目录中的 LICENSE 文件

---

**使用测试驱动开发构建** ✨

_此示例是 [Claude Code 最佳实践](../../README.md) 项目的一部分。_
