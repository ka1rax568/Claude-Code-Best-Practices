> **语言 (Language)**: [English](02-security-best-practices.md) | 简体中文

# Claude Code 安全最佳实践

使用 AI 辅助编码工具时保护开发工作流的综合指南。

## 目录

- [安全模型概述](#安全模型概述)
- [拒绝列表配置](#拒绝列表配置)
- [密钥管理](#密钥管理)
- [文件访问控制](#文件访问控制)
- [工具限制](#工具限制)
- [审计日志](#审计日志)
- [CI/CD 安全集成](#cicd-安全集成)
- [事件响应](#事件响应)
- [合规性考虑](#合规性考虑)

---

## 安全模型概述

### 深度防御

Claude Code 安全使用多层保护:

```
第 1 层: .claudeignore     → 完全阻止文件访问
第 2 层: settings.json     → 使用模式的拒绝列表
第 3 层: 正则扫描          → 检测输出中的密钥
第 4 层: 工具限制          → 限制危险命令
第 5 层: 审计日志          → 跟踪所有操作
```

### 威胁模型

**我们防护的内容:**

- ✅ 意外凭证暴露
- ✅ 对敏感文件的未授权访问
- ✅ 破坏性命令的执行
- ✅ 专有代码/数据泄漏
- ✅ 通过依赖项的供应链攻击

**我们不防护的内容:**

- ❌ 具有直接文件系统访问权限的恶意行为者
- ❌ 受感染的开发人员机器
- ❌ 社会工程攻击
- ❌ Claude Code 本身的零日漏洞

### 安全原则

1. **最小权限原则**: 仅授予必要的访问权限
2. **安全失败**: 有疑问时拒绝访问
3. **深度防御**: 多个独立的安全层
4. **审计一切**: 记录所有安全相关操作
5. **假设违规**: 为安全事件做好计划

---

## 拒绝列表配置

### 理解拒绝列表

`.claude/settings.json` 中的拒绝列表防止 Claude Code 访问特定文件:

```json
{
  "denyList": [
    ".env", // 精确匹配
    ".env.*", // 通配符模式
    "*.pem", // 基于扩展名
    "secrets/", // 基于目录
    "!.env.example" // 否定(允许这个)
  ]
}
```

### 要拒绝的关键文件

**环境变量:**

```json
".env",
".env.local",
".env.development",
".env.production",
".env.*.local"
```

**凭证:**

```json
"credentials.json",
"secrets.json",
"secrets.yml",
"auth.json",
"serviceAccount.json",
".aws/credentials",
".aws/config",
".gcloud/keyfile.json"
```

**私钥:**

```json
"*.pem",
"*.key",
"*.p12",
"*.pfx",
"*.keystore",
"id_rsa",
"id_dsa",
"*.ppk",
"*.crt",
"*.der"
```

**包管理器身份验证:**

```json
".npmrc",
".yarnrc",
".yarnrc.yml",
".pypirc",
"pip.conf"
```

### 模式匹配规则

**通配符:**

```json
"*.key"        // 匹配任何目录中的任何 .key 文件
"keys/*.pem"   // 仅匹配 keys/ 目录中的 .pem 文件
"**/*.secret"  // 匹配任何子目录中的 .secret 文件
```

**否定:**

```json
[
  ".env*", // 阻止所有 .env 文件
  "!.env.example" // 除了 .env.example
]
```

**目录匹配:**

```json
"secrets/"      // 阻止整个目录
"secrets/*"     // 阻止目录中的文件(不包括子目录)
"secrets/**/*"  // 递归阻止所有文件
```

### 特定于项目的模式

**对于 Django 项目:**

```json
"db.sqlite3",
"local_settings.py",
"*/settings/local.py"
```

**对于 Rails 项目:**

```json
"config/database.yml",
"config/secrets.yml",
"config/master.key"
```

**对于 Docker 项目:**

```json
"docker-compose.override.yml",
".env.docker"
```

### 测试您的拒绝列表

```bash
# 创建测试文件
echo "SECRET_KEY=test123" > .env

# 尝试让 Claude Code 读取它(应该失败)
# 在 Claude Code 会话中:
# "请读取 .env 文件"

# 预期响应:
# "我无法访问 .env,因为它在拒绝列表中"
```

---

## 密钥管理

### 永远不要提交密钥

**不良实践:**

```javascript
// ❌ 永远不要这样做
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "MyP@ssw0rd123";
```

**良好实践:**

```javascript
// ✅ 使用环境变量
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// ✅ 带验证
if (!API_KEY) {
  throw new Error("API_KEY environment variable is required");
}
```

### 环境变量最佳实践

**1. 使用 .env.example 作为模板:**

```bash
# .env.example (提交到 git)
API_KEY=your_api_key_here
DB_PASSWORD=your_database_password
REDIS_URL=redis://localhost:6379

# .env (永不提交,在 .gitignore 中)
API_KEY=sk-actual-secret-key
DB_PASSWORD=actual_password_123
REDIS_URL=redis://prod-server:6379
```

**2. 记录所需变量:**

```markdown
# README.md

## 环境变量

必需:

- `API_KEY`: Anthropic API 密钥(从 console.anthropic.com 获取)
- `DB_PASSWORD`: PostgreSQL 密码(最少 12 个字符)

可选:

- `LOG_LEVEL`: 日志详细程度(默认: 'info')
- `PORT`: 服务器端口(默认: 3000)
```

**3. 启动时验证:**

```javascript
// src/config/env.js
const requiredEnvVars = ["API_KEY", "DB_PASSWORD", "DB_HOST"];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});
```

### 密钥扫描

**安装密钥扫描器:**

```bash
# 安装 git-secrets
brew install git-secrets  # macOS
# 或
apt-get install git-secrets  # Linux

# 设置钩子
cd your-repo
git secrets --install
git secrets --register-aws
```

**添加自定义模式:**

```bash
# 检测 API 密钥
git secrets --add 'api[_-]?key.*[=:]\\s*["\']?[a-zA-Z0-9]{20,}["\']?'

# 检测私钥
git secrets --add 'BEGIN.*PRIVATE KEY'

# 检测密码
git secrets --add 'password.*[=:]\\s*["\'][^"\']{8,}["\']'
```

**扫描现有仓库:**

```bash
# 扫描所有文件
git secrets --scan

# 扫描特定文件
git secrets --scan path/to/file.js

# 扫描所有历史记录(警告: 大型仓库速度慢)
git secrets --scan-history
```

### 密钥轮换策略

**何时轮换:**

- ✅ 如果提交到 git 立即轮换
- ✅ 每 90 天(计划轮换)
- ✅ 团队成员离开时
- ✅ 安全事件后
- ✅ 更改环境时(dev → staging → prod)

**如何轮换:**

```bash
# 1. 生成新密钥
NEW_API_KEY=$(openssl rand -hex 32)

# 2. 在密钥管理器中更新
aws secretsmanager update-secret \
  --secret-id prod/api-key \
  --secret-string "$NEW_API_KEY"

# 3. 更新应用程序(零停机时间)
kubectl set env deployment/app API_KEY="$NEW_API_KEY"

# 4. 验证新密钥工作
curl -H "Authorization: Bearer $NEW_API_KEY" https://api.example.com/health

# 5. 撤销旧密钥
# (仅在确认新密钥工作后)
```

### 使用密钥管理器

**AWS Secrets Manager:**

```javascript
const AWS = require("aws-sdk");
const client = new AWS.SecretsManager({ region: "us-east-1" });

async function getSecret(secretName) {
  const data = await client.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(data.SecretString);
}

// 使用
const secrets = await getSecret("prod/database");
const db = connectToDatabase(secrets.password);
```

**HashiCorp Vault:**

```javascript
const vault = require("node-vault")({
  endpoint: "http://vault.example.com:8200",
  token: process.env.VAULT_TOKEN,
});

async function getSecret(path) {
  const result = await vault.read(path);
  return result.data;
}

// 使用
const secrets = await getSecret("secret/data/database");
```

**Doppler:**

```bash
# 安装 Doppler CLI
brew install dopplerhq/tap/doppler

# 登录
doppler login

# 使用密钥运行应用程序
doppler run -- npm start

# 密钥自动注入为环境变量
```

---

## 文件访问控制

### .claudeignore 最佳实践

**按类别组织:**

```bash
# =============================================================================
# 安全敏感文件
# =============================================================================
.env
.env.*
!.env.example
*.pem
*.key

# =============================================================================
# 专有代码
# =============================================================================
src/algorithms/proprietary/
lib/internal/

# =============================================================================
# 第三方代码
# =============================================================================
node_modules/
vendor/

# =============================================================================
# 构建产物
# =============================================================================
dist/
build/
*.min.js
```

**选择性包含:**

```bash
# 阻止整个目录
.vscode/

# 但允许特定文件
!.vscode/settings.json
!.vscode/extensions.json
```

**性能优化:**

```bash
# 在文件早期阻止大目录
node_modules/
.git/
dist/
coverage/

# 稍后特定模式
*.log
*.tmp
```

### 测试文件访问

```bash
# 创建测试脚本
cat > test-access.sh << 'EOF'
#!/bin/bash
echo "Testing Claude Code file access..."

# 创建测试文件
echo "secret=12345" > .env
echo "PUBLIC_URL=example.com" > .env.example

# 测试(手动验证 Claude 无法读取 .env 但可以读取 .env.example)
echo "Created .env and .env.example"
echo "Ask Claude to read both files and verify access control"
EOF

chmod +x test-access.sh
./test-access.sh
```

---

## 工具限制

### Bash 命令限制

**在 settings.json 中配置:**

```json
{
  "tools": {
    "bash": {
      "enabled": true,
      "allowedCommands": [
        "git",
        "npm",
        "node",
        "jest",
        "eslint",
        "prettier",
        "find",
        "grep",
        "ls",
        "cat"
      ],
      "deniedCommands": [
        "rm -rf /",
        "sudo",
        "dd",
        "mkfs",
        "> /dev/",
        "curl",
        "wget",
        "chmod 777"
      ]
    }
  }
}
```

**为什么限制命令:**

**允许(安全):**

- `git`: 版本控制操作
- `npm/yarn`: 包管理
- `node`: 运行 JavaScript
- `jest`: 运行测试
- `eslint/prettier`: 代码质量

**拒绝(危险):**

- `sudo`: 权限提升
- `rm -rf /`: 破坏性文件操作
- `dd`: 直接磁盘访问
- `curl/wget`: 网络请求(可能泄露数据)
- `chmod 777`: 不安全的权限

### 网络访问控制

**禁用 Web 访问:**

```json
{
  "tools": {
    "web": {
      "enabled": false
    }
  }
}
```

**为什么禁用:**

- 防止数据泄露
- 阻止恶意 URL
- 确保离线能力
- 减少攻击面

**何时启用:**

- API 文档查找
- 包注册表访问
- 外部资源获取

**如果启用,使用白名单:**

```json
{
  "tools": {
    "web": {
      "enabled": true,
      "allowedDomains": ["docs.anthropic.com", "nodejs.org", "npmjs.com"],
      "deniedDomains": ["*"]
    }
  }
}
```

---

## 审计日志

### 要记录的内容

**文件操作:**

```json
{
  "timestamp": "2026-01-07T00:30:00Z",
  "operation": "read",
  "file": "src/auth/login.js",
  "user": "developer@example.com",
  "success": true
}
```

**拒绝的访问尝试:**

```json
{
  "timestamp": "2026-01-07T00:31:15Z",
  "operation": "read",
  "file": ".env",
  "user": "developer@example.com",
  "success": false,
  "reason": "File in deny list"
}
```

**命令执行:**

```json
{
  "timestamp": "2026-01-07T00:32:00Z",
  "operation": "bash",
  "command": "npm install express",
  "user": "developer@example.com",
  "success": true,
  "exitCode": 0
}
```

### 日志分析

**检测可疑模式:**

```bash
# 多次拒绝访问尝试
cat claude-audit.log | grep '"success":false' | jq -r '.file' | sort | uniq -c | sort -rn

# 执行的命令
cat claude-audit.log | grep '"operation":"bash"' | jq -r '.command' | sort | uniq -c

# 用户访问的文件
cat claude-audit.log | jq -r 'select(.user=="developer@example.com") | .file' | sort | uniq
```

**警报规则:**

```bash
# 在多次拒绝访问尝试时发出警报(可能的攻击)
if [ $(grep '"success":false' claude-audit.log | wc -l) -gt 10 ]; then
  echo "ALERT: Multiple access denials detected"
  # 发送通知
fi

# 在敏感文件访问时发出警报
if grep -q '".env"' claude-audit.log; then
  echo "ALERT: .env file access attempted"
fi
```

---

## CI/CD 安全集成

### 预提交钩子

**安装 Husky:**

```bash
npm install --save-dev husky
npx husky install
```

**添加安全检查:**

```bash
# .husky/pre-commit
#!/bin/bash

# 运行密钥扫描器
git secrets --scan || {
  echo "❌ Secret detected in commit!"
  exit 1
}

# 在严格模式下运行代码检查器
./.claude/commands/fix-lint.sh --strict || {
  echo "❌ Linting failed!"
  exit 1
}

# 运行安全审查
./.claude/commands/review.sh --exit-on-critical || {
  echo "❌ Critical security issues found!"
  exit 1
}

echo "✅ Pre-commit checks passed"
```

### CI 管道安全

**GitHub Actions 示例:**

```yaml
name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Secret Scan
        run: |
          npm install -g @secretlint/secretlint
          secretlint "**/*"

      - name: Run Dependency Audit
        run: npm audit --audit-level=moderate

      - name: Run Security Review
        run: ./.claude/commands/review.sh

      - name: Check for High Severity Issues
        run: |
          if grep -q "\\[CRITICAL\\]" review-output.txt; then
            echo "Critical security issues found!"
            exit 1
          fi
```

---

## 事件响应

### 如果密钥被提交

**立即行动:**

1. **立即撤销受感染的密钥**
2. **轮换到新密钥**
3. **从 git 历史记录中删除**
4. **通知安全团队**

**从 Git 历史记录中删除:**

```bash
# 使用 BFG Repo-Cleaner(更快)
brew install bfg
bfg --replace-text passwords.txt your-repo.git
cd your-repo
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 或使用 git-filter-branch
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送(警告: 重写历史记录)
git push origin --force --all
```

**验证删除:**

```bash
# 检查当前状态
git grep "SECRET_KEY"

# 检查所有历史记录
git log -p -S "SECRET_KEY"

# 如果仍然找到,重复删除过程
```

### 事件报告模板

```markdown
# 安全事件报告

**日期**: 2026-01-07
**严重性**: HIGH
**状态**: RESOLVED

## 事件摘要

开发人员意外将包含 API 密钥的 .env 文件提交到 GitHub。

## 时间线

- 10:00: .env 文件提交到功能分支
- 10:15: 收到 GitHub 密钥扫描警报
- 10:20: 启动事件响应
- 10:25: 撤销 API 密钥
- 10:30: 生成并部署新密钥
- 10:45: 从历史记录中删除提交
- 11:00: 事件解决

## 影响

- API 密钥暴露 15 分钟
- 未检测到未授权使用
- 未发生数据泄露

## 根本原因

- .gitignore 未正确配置
- 开发人员绕过了预提交钩子

## 补救措施

- ✅ 撤销受感染的密钥
- ✅ 从 git 历史记录中删除
- ✅ 更新 .gitignore
- ✅ 安装强制预提交钩子
- ✅ 团队密钥管理培训

## 预防

- [ ] 在所有仓库上实施 git-secrets
- [ ] 启用 GitHub 密钥扫描
- [ ] 季度安全培训
```

---

## 合规性考虑

### GDPR 合规性

**数据最小化:**

```javascript
// ❌ 不要向 Claude Code 发送 PII
const user = await User.findById(id);
console.log(user); // 可能包含电子邮件、姓名、地址

// ✅ 屏蔽 PII
const user = await User.findById(id);
const masked = {
  id: user.id,
  email: maskEmail(user.email), // "j***@example.com"
  role: user.role,
};
console.log(masked);
```

**删除权:**

- 确保审计日志可以清除用户数据
- 不要不必要地持久化敏感数据

### SOC 2 合规性

**访问控制:**

- ✅ 实施拒绝列表
- ✅ 审计所有文件访问
- ✅ 基于角色的访问(如适用)

**审计日志:**

- ✅ 记录所有操作
- ✅ 在所需期间保留日志
- ✅ 保护日志完整性

**事件响应:**

- ✅ 记录的程序
- ✅ 定义的 SLA
- ✅ 定期演练

---

## 安全检查清单

**使用 Claude Code 之前:**

- [ ] `.claudeignore` 配置所有敏感文件
- [ ] `settings.json` 拒绝列表已填充
- [ ] `.gitignore` 排除 `.env` 和密钥
- [ ] 密钥扫描器已安装和配置
- [ ] 预提交钩子已启用
- [ ] 团队接受安全实践培训

**定期审查(每月):**

- [ ] 审计日志审查异常
- [ ] 使用新模式更新拒绝列表
- [ ] 密钥轮换
- [ ] 依赖项审计(`npm audit`)
- [ ] 访问权限审查

**事件后:**

- [ ] 创建事件报告
- [ ] 确定根本原因
- [ ] 完成补救措施
- [ ] 实施预防措施
- [ ] 通知并培训团队

---

**下一步**: [Token 优化](03-token-optimization.zh.md) →

**上一步**: [入门指南](01-getting-started.zh.md) ←
