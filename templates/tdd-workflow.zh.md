# 测试驱动开发工作流模板

> **语言 (Language)**: [English](tdd-workflow.md) | 简体中文

在任何项目中实施测试驱动开发（TDD）的通用指南。根据您的具体技术栈和测试框架自定义此模板。

---

## 概述

测试驱动开发（TDD）是一种软件开发方法，在编写实现代码**之前**先编写测试。这确保了更好的设计、全面的测试覆盖率以及对变更的信心。

### TDD 的优势

- ✅ **明确需求**: 测试提前定义预期行为
- ✅ **更好的设计**: 先编写测试鼓励编写模块化、可测试的代码
- ✅ **信心**: 全面的测试可以及早发现回归
- ✅ **文档**: 测试作为活文档示例
- ✅ **更快的调试**: 失败能精确定位问题

---

## 红-绿-重构循环

### 🔴 RED: 编写一个失败的测试

编写一个描述您想要实现的行为的测试。

**步骤:**

1. 确定下一个小功能片段
2. 编写一个会失败的测试
3. 运行测试以确认它失败
4. 提交：`test([范围]): add failing test for [功能] [RED]`

**示例:**

```[language]
describe('[功能名称]', () => {
  it('should [预期行为] when [条件]', () => {
    // Arrange
    const input = [测试数据];

    // Act
    const result = [被测函数](input);

    // Assert
    expect(result).toBe([预期值]);
  });
});
```

**运行**: 测试失败 ❌（符合预期 - 代码还不存在）

---

### ✅ GREEN: 使测试通过

编写使测试通过所需的**最少**代码。

**步骤:**

1. 只编写足够使测试通过的代码
2. 暂时不要担心完美的代码
3. 运行测试以确认它们通过
4. 提交：`feat([范围]): implement [功能] [GREEN]`

**示例:**

```[language]
function [被测函数](input) {
  // 最小实现
  return [预期值];
}
```

**运行**: 测试通过 ✅

---

### ♻️ REFACTOR: 改进代码

现在测试已经通过，在不改变行为的情况下改进代码质量。

**步骤:**

1. 消除重复
2. 改进命名和清晰度
3. 提取方法/类
4. 如果需要进行优化
5. 每次更改后运行测试
6. 提交：`refactor([范围]): improve [方面] [REFACTOR]`

**示例:**

```[language]
class [类名] {
  constructor() {
    this.[属性] = [值];
  }

  [方法名](input) {
    this.#validate(input);
    return this.#process(input);
  }

  #validate(input) {
    // 提取的验证逻辑
  }

  #process(input) {
    // 提取的处理逻辑
  }
}
```

**运行**: 测试仍然通过 ✅

---

## TDD 工作流步骤

### 1. 从最简单的测试开始

从最基本的正常路径场景开始：

```[language]
it('should [基本行为]', () => {
  const result = [函数]([简单输入]);
  expect(result).toBe([预期输出]);
});
```

### 2. 逐步添加边缘情况

在基本情况工作后，添加边缘情况的测试：

```[language]
it('should handle empty input', () => {
  expect(() => [函数]('')).toThrow();
});

it('should handle null input', () => {
  expect(() => [函数](null)).toThrow();
});

it('should handle maximum length', () => {
  const longInput = 'x'.repeat(1000);
  expect(() => [函数](longInput)).toThrow();
});
```

### 3. 测试通过时重构

只在所有测试都是绿色时重构：

**重构前:**

- ✅ 所有测试通过
- ✅ 覆盖率可接受
- ✅ 没有待处理的更改

**重构期间:**

- 每次小更改后运行测试
- 保持提交小而专注
- 如果测试失败则回滚

**重构后:**

- ✅ 所有测试仍然通过
- ✅ 代码更清晰/更简单
- ✅ 没有行为变更

### 4. 重复循环

对于每个新功能或行为：

1. RED: 编写失败的测试
2. GREEN: 使其通过
3. REFACTOR: 清理代码
4. 提交并重复

---

## 测试模式

### Arrange-Act-Assert (AAA)

用三个清晰的部分构建每个测试：

```[language]
it('should [行为]', () => {
  // Arrange: 设置测试数据和依赖项
  const [输入] = [测试数据];
  const [预期] = [预期结果];

  // Act: 执行被测代码
  const [实际] = [被测函数]([输入]);

  // Assert: 验证结果
  expect([实际]).toBe([预期]);
});
```

### 测试隔离

每个测试应该是独立的：

```[language]
describe('[测试套件]', () => {
  let [依赖项];

  beforeEach(() => {
    // 每个测试的新设置
    [依赖项] = new [依赖项]();
  });

  afterEach(() => {
    // 每个测试后清理
    [依赖项] = null;
  });

  it('test 1', () => { /* ... */ });
  it('test 2', () => { /* ... */ });
});
```

### 描述性测试名称

使用清晰、关注行为的名称：

```[language]
// ✅ 正确
it('should return 404 when resource not found', () => {});
it('should create user with hashed password', () => {});
it('should reject invalid email format', () => {});

// ❌ 错误
it('works', () => {});
it('test getUserById', () => {});
it('should work correctly', () => {});
```

---

## TDD 最佳实践

### 1. 先编写测试

**始终**在实现之前编写测试：

```
❌ 编写代码 → 编写测试
✅ 编写测试 → 编写代码
```

### 2. 保持测试简单

每个测试应该验证一个特定的行为：

```[language]
// ✅ 正确：每个概念一个断言
it('should set completed to false by default', () => {
  const [对象] = new [类]();
  expect([对象].completed).toBe(false);
});

// ❌ 错误：测试多个不相关的事情
it('should create object correctly', () => {
  const [对象] = new [类]();
  expect([对象].id).toBeDefined();
  expect([对象].name).toBe('default');
  expect([对象].completed).toBe(false);
  // 太多不相关的断言
});
```

### 3. 测试行为，而非实现

关注代码**做什么**，而不是**如何做**：

```[language]
// ✅ 正确：测试行为
it('should mark item as complete', () => {
  [对象].complete();
  expect([对象].isComplete()).toBe(true);
});

// ❌ 错误：测试实现细节
it('should set internal flag', () => {
  [对象]._internalFlag = true;  // 访问内部
  expect([对象]._internalFlag).toBe(true);
});
```

### 4. 保持快速测试

保持测试执行时间最小：

- 对外部依赖项使用测试替身（模拟、存根）
- 避免在单元测试中进行实际的数据库/网络调用
- 单独运行慢速测试（集成/E2E）

### 5. 追求高覆盖率

目标**>80% 代码覆盖率**，但专注于有意义的测试：

```bash
# 运行覆盖率报告
[测试覆盖率命令]

# 目标：
- 语句：>80%
- 分支：>80%
- 函数：>80%
- 行：>80%
```

---

## 常见 TDD 陷阱

### ❌ 在代码之后编写测试

**问题**: 违背了 TDD 的目的
**解决方案**: 致力于 RED-GREEN-REFACTOR 纪律

### ❌ 测试实现细节

**问题**: 重构时测试中断
**解决方案**: 测试公共 API 和行为

### ❌ 大的测试跳跃

**问题**: 编写需要大量代码的复杂测试
**解决方案**: 采取更小的步骤，更简单的测试

### ❌ 跳过重构步骤

**问题**: 代码随时间变得混乱
**解决方案**: 总是在测试为绿色时重构

### ❌ 不经常运行测试

**问题**: 延迟反馈失败
**解决方案**: 每次小更改后运行测试

---

## TDD 的 Git 工作流

### 每个阶段后提交

```bash
# RED: 失败的测试
git add tests/
git commit -m "test([范围]): add failing test for [功能] [RED]"

# GREEN: 实现
git add src/
git commit -m "feat([范围]): implement [功能] [GREEN]"

# REFACTOR: 改进
git add src/
git commit -m "refactor([范围]): extract [组件] [REFACTOR]"
```

### 约定式提交格式

```
<类型>(<范围>): <描述> [<阶段>]

类型: feat, fix, refactor, test, docs, chore
阶段: [RED], [GREEN], [REFACTOR]
```

**示例:**

- `test(auth): add failing test for login validation [RED]`
- `feat(auth): implement login validation [GREEN]`
- `refactor(auth): extract validation logic [REFACTOR]`

---

## 测试工具和框架

### 流行的测试框架

**JavaScript/TypeScript:**

- Jest, Vitest, Mocha, Jasmine

**Python:**

- pytest, unittest, nose2

**Java:**

- JUnit, TestNG, Spock

**Ruby:**

- RSpec, Minitest

**Go:**

- testing 包, Ginkgo

**C#:**

- NUnit, xUnit, MSTest

### 测试运行器

```bash
# 监视模式（更改时自动运行）
[测试监视命令]

# 覆盖率模式
[测试覆盖率命令]

# 特定文件/模式
[测试特定命令]

# 详细输出
[测试详细命令]
```

---

## TDD 会话示例

### 目标: 实现用户邮箱验证

#### 迭代 1: 基本邮箱格式

**RED:**

```[language]
it('should accept valid email', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
});
```

测试失败 ❌（函数不存在）

**GREEN:**

```[language]
function isValidEmail(email) {
  return email.includes('@');
}
```

测试通过 ✅

**REFACTOR:**

```[language]
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

测试仍然通过 ✅

#### 迭代 2: 拒绝无效邮箱

**RED:**

```[language]
it('should reject email without @', () => {
  expect(isValidEmail('invalid.email.com')).toBe(false);
});
```

**GREEN:**
由于重构后的实现已经通过 ✅

#### 迭代 3: 处理边缘情况

**RED:**

```[language]
it('should reject empty string', () => {
  expect(isValidEmail('')).toBe(false);
});

it('should reject null', () => {
  expect(isValidEmail(null)).toBe(false);
});
```

**GREEN:**

```[language]
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

所有测试通过 ✅

---

## 资源

### 书籍

- _测试驱动开发：实例教程_ - Kent Beck
- _测试驱动的面向对象软件开发_ - Freeman & Pryce
- _单元测试的艺术_ - Roy Osherove

### 文章

- [Martin Fowler 关于 TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Uncle Bob 的 TDD 三定律](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)

### 在线课程

- Pluralsight、Udemy、Coursera 等平台上的测试驱动开发课程

---

## 自定义说明

要适配此模板：

1. 将 `[language]` 替换为您的编程语言
2. 将 `[测试覆盖率命令]` 替换为您的框架的覆盖率命令
3. 添加框架特定的语法示例
4. 包含项目特定的测试模式
5. 添加指向您的测试文档的链接
6. 更新示例以匹配您的代码库风格

---

**记住**: TDD 是一门随着实践而提高的学科。从小处开始，保持耐心，相信这个过程！
