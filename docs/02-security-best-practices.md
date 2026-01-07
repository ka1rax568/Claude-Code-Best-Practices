# Security Best Practices for Claude Code

Comprehensive guide to securing your development workflow when using AI-assisted coding tools.

## Table of Contents

- [Security Model Overview](#security-model-overview)
- [Deny List Configuration](#deny-list-configuration)
- [Secrets Management](#secrets-management)
- [File Access Controls](#file-access-controls)
- [Tool Restrictions](#tool-restrictions)
- [Audit Logging](#audit-logging)
- [CI/CD Security Integration](#cicd-security-integration)
- [Incident Response](#incident-response)
- [Compliance Considerations](#compliance-considerations)

---

## Security Model Overview

### Defense in Depth

Claude Code security uses multiple layers of protection:

```
Layer 1: .claudeignore     → Completely blocks file access
Layer 2: settings.json     → Deny list with patterns
Layer 3: Regex scanning    → Detects secrets in output
Layer 4: Tool restrictions → Limits dangerous commands
Layer 5: Audit logging     → Tracks all operations
```

### Threat Model

**What we're protecting against:**

- ✅ Accidental credential exposure
- ✅ Unauthorized access to sensitive files
- ✅ Execution of destructive commands
- ✅ Leakage of proprietary code/data
- ✅ Supply chain attacks through dependencies

**What we're NOT protecting against:**

- ❌ Malicious actors with direct file system access
- ❌ Compromised developer machines
- ❌ Social engineering attacks
- ❌ Zero-day vulnerabilities in Claude Code itself

### Security Principles

1. **Principle of Least Privilege**: Only grant access to what's necessary
2. **Fail Secure**: When in doubt, deny access
3. **Defense in Depth**: Multiple independent security layers
4. **Audit Everything**: Log all security-relevant operations
5. **Assume Breach**: Plan for security incidents

---

## Deny List Configuration

### Understanding the Deny List

The deny list in `.claude/settings.json` prevents Claude Code from accessing specific files:

```json
{
  "denyList": [
    ".env", // Exact match
    ".env.*", // Wildcard pattern
    "*.pem", // Extension-based
    "secrets/", // Directory-based
    "!.env.example" // Negation (allow this one)
  ]
}
```

### Critical Files to Deny

**Environment Variables:**

```json
".env",
".env.local",
".env.development",
".env.production",
".env.*.local"
```

**Credentials:**

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

**Private Keys:**

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

**Package Manager Auth:**

```json
".npmrc",
".yarnrc",
".yarnrc.yml",
".pypirc",
"pip.conf"
```

### Pattern Matching Rules

**Wildcards:**

```json
"*.key"        // Matches any .key file in any directory
"keys/*.pem"   // Matches .pem files in keys/ directory only
"**/*.secret"  // Matches .secret files in any subdirectory
```

**Negation:**

```json
[
  ".env*", // Block all .env files
  "!.env.example" // EXCEPT .env.example
]
```

**Directory Matching:**

```json
"secrets/"      // Blocks entire directory
"secrets/*"     // Blocks files in directory (not subdirs)
"secrets/**/*"  // Blocks all files recursively
```

### Project-Specific Patterns

**For Django Projects:**

```json
"db.sqlite3",
"local_settings.py",
"*/settings/local.py"
```

**For Rails Projects:**

```json
"config/database.yml",
"config/secrets.yml",
"config/master.key"
```

**For Docker Projects:**

```json
"docker-compose.override.yml",
".env.docker"
```

### Testing Your Deny List

```bash
# Create test file
echo "SECRET_KEY=test123" > .env

# Try to have Claude Code read it (should fail)
# In Claude Code session:
# "Please read the .env file"

# Expected response:
# "I cannot access .env as it's in the deny list"
```

---

## Secrets Management

### Never Commit Secrets

**Bad Practice:**

```javascript
// ❌ NEVER DO THIS
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "MyP@ssw0rd123";
```

**Good Practice:**

```javascript
// ✅ Use environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// ✅ With validation
if (!API_KEY) {
  throw new Error("API_KEY environment variable is required");
}
```

### Environment Variable Best Practices

**1. Use .env.example as Template:**

```bash
# .env.example (committed to git)
API_KEY=your_api_key_here
DB_PASSWORD=your_database_password
REDIS_URL=redis://localhost:6379

# .env (never committed, in .gitignore)
API_KEY=sk-actual-secret-key
DB_PASSWORD=actual_password_123
REDIS_URL=redis://prod-server:6379
```

**2. Document Required Variables:**

```markdown
# README.md

## Environment Variables

Required:

- `API_KEY`: Anthropic API key (get from console.anthropic.com)
- `DB_PASSWORD`: PostgreSQL password (minimum 12 characters)

Optional:

- `LOG_LEVEL`: Logging verbosity (default: 'info')
- `PORT`: Server port (default: 3000)
```

**3. Validate on Startup:**

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

### Secret Scanning

**Install Secret Scanner:**

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux

# Set up hooks
cd your-repo
git secrets --install
git secrets --register-aws
```

**Add Custom Patterns:**

```bash
# Detect API keys
git secrets --add 'api[_-]?key.*[=:]\s*["\']?[a-zA-Z0-9]{20,}["\']?'

# Detect private keys
git secrets --add 'BEGIN.*PRIVATE KEY'

# Detect passwords
git secrets --add 'password.*[=:]\s*["\'][^"\']{8,}["\']'
```

**Scan Existing Repository:**

```bash
# Scan all files
git secrets --scan

# Scan specific file
git secrets --scan path/to/file.js

# Scan all history (WARNING: slow on large repos)
git secrets --scan-history
```

### Secret Rotation Policy

**When to Rotate:**

- ✅ Immediately if committed to git
- ✅ Every 90 days (scheduled rotation)
- ✅ When team member leaves
- ✅ After security incident
- ✅ When changing environments (dev → staging → prod)

**How to Rotate:**

```bash
# 1. Generate new secret
NEW_API_KEY=$(openssl rand -hex 32)

# 2. Update in secret manager
aws secretsmanager update-secret \
  --secret-id prod/api-key \
  --secret-string "$NEW_API_KEY"

# 3. Update application (zero-downtime)
kubectl set env deployment/app API_KEY="$NEW_API_KEY"

# 4. Verify new secret works
curl -H "Authorization: Bearer $NEW_API_KEY" https://api.example.com/health

# 5. Revoke old secret
# (only after confirming new one works)
```

### Using Secret Managers

**AWS Secrets Manager:**

```javascript
const AWS = require("aws-sdk");
const client = new AWS.SecretsManager({ region: "us-east-1" });

async function getSecret(secretName) {
  const data = await client.getSecretValue({ SecretId: secretName }).promise();
  return JSON.parse(data.SecretString);
}

// Usage
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

// Usage
const secrets = await getSecret("secret/data/database");
```

**Doppler:**

```bash
# Install Doppler CLI
brew install dopplerhq/tap/doppler

# Login
doppler login

# Run application with secrets
doppler run -- npm start

# Secrets are automatically injected as environment variables
```

---

## File Access Controls

### .claudeignore Best Practices

**Organize by Category:**

```bash
# =============================================================================
# SECURITY-SENSITIVE FILES
# =============================================================================
.env
.env.*
!.env.example
*.pem
*.key

# =============================================================================
# PROPRIETARY CODE
# =============================================================================
src/algorithms/proprietary/
lib/internal/

# =============================================================================
# THIRD-PARTY CODE
# =============================================================================
node_modules/
vendor/

# =============================================================================
# BUILD ARTIFACTS
# =============================================================================
dist/
build/
*.min.js
```

**Selective Inclusion:**

```bash
# Block entire directory
.vscode/

# But allow specific files
!.vscode/settings.json
!.vscode/extensions.json
```

**Performance Optimization:**

```bash
# Block large directories early in the file
node_modules/
.git/
dist/
coverage/

# Specific patterns later
*.log
*.tmp
```

### Testing File Access

```bash
# Create test script
cat > test-access.sh << 'EOF'
#!/bin/bash
echo "Testing Claude Code file access..."

# Create test files
echo "secret=12345" > .env
echo "PUBLIC_URL=example.com" > .env.example

# Test (manually verify Claude can't read .env but can read .env.example)
echo "Created .env and .env.example"
echo "Ask Claude to read both files and verify access control"
EOF

chmod +x test-access.sh
./test-access.sh
```

---

## Tool Restrictions

### Bash Command Restrictions

**Configure in settings.json:**

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

**Why Restrict Commands:**

**Allowed (Safe):**

- `git`: Version control operations
- `npm/yarn`: Package management
- `node`: Run JavaScript
- `jest`: Run tests
- `eslint/prettier`: Code quality

**Denied (Dangerous):**

- `sudo`: Privilege escalation
- `rm -rf /`: Destructive file operations
- `dd`: Direct disk access
- `curl/wget`: Network requests (could exfiltrate data)
- `chmod 777`: Insecure permissions

### Network Access Control

**Disable Web Access:**

```json
{
  "tools": {
    "web": {
      "enabled": false
    }
  }
}
```

**Why Disable:**

- Prevents data exfiltration
- Blocks malicious URLs
- Ensures offline capability
- Reduces attack surface

**When to Enable:**

- API documentation lookup
- Package registry access
- External resource fetching

**If Enabled, Use Allowlist:**

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

## Audit Logging

### What to Log

**File Operations:**

```json
{
  "timestamp": "2026-01-07T00:30:00Z",
  "operation": "read",
  "file": "src/auth/login.js",
  "user": "developer@example.com",
  "success": true
}
```

**Denied Access Attempts:**

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

**Command Executions:**

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

### Log Analysis

**Detect Suspicious Patterns:**

```bash
# Multiple denied access attempts
cat claude-audit.log | grep '"success":false' | jq -r '.file' | sort | uniq -c | sort -rn

# Commands executed
cat claude-audit.log | grep '"operation":"bash"' | jq -r '.command' | sort | uniq -c

# Files accessed by user
cat claude-audit.log | jq -r 'select(.user=="developer@example.com") | .file' | sort | uniq
```

**Alerting Rules:**

```bash
# Alert on multiple denied access attempts (possible attack)
if [ $(grep '"success":false' claude-audit.log | wc -l) -gt 10 ]; then
  echo "ALERT: Multiple access denials detected"
  # Send notification
fi

# Alert on sensitive file access
if grep -q '".env"' claude-audit.log; then
  echo "ALERT: .env file access attempted"
fi
```

---

## CI/CD Security Integration

### Pre-Commit Hooks

**Install Husky:**

```bash
npm install --save-dev husky
npx husky install
```

**Add Security Checks:**

```bash
# .husky/pre-commit
#!/bin/bash

# Run secret scanner
git secrets --scan || {
  echo "❌ Secret detected in commit!"
  exit 1
}

# Run linter in strict mode
./.claude/commands/fix-lint.sh --strict || {
  echo "❌ Linting failed!"
  exit 1
}

# Run security review
./.claude/commands/review.sh --exit-on-critical || {
  echo "❌ Critical security issues found!"
  exit 1
}

echo "✅ Pre-commit checks passed"
```

### CI Pipeline Security

**GitHub Actions Example:**

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
          if grep -q "\[CRITICAL\]" review-output.txt; then
            echo "Critical security issues found!"
            exit 1
          fi
```

---

## Incident Response

### If Secrets Are Committed

**Immediate Actions:**

1. **Revoke the compromised secret immediately**
2. **Rotate to new secret**
3. **Remove from git history**
4. **Notify security team**

**Remove from Git History:**

```bash
# Using BFG Repo-Cleaner (faster)
brew install bfg
bfg --replace-text passwords.txt your-repo.git
cd your-repo
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Or using git-filter-branch
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: rewrites history)
git push origin --force --all
```

**Verify Removal:**

```bash
# Check current state
git grep "SECRET_KEY"

# Check all history
git log -p -S "SECRET_KEY"

# If still found, repeat removal process
```

### Incident Report Template

```markdown
# Security Incident Report

**Date**: 2026-01-07
**Severity**: HIGH
**Status**: RESOLVED

## Incident Summary

Developer accidentally committed .env file containing API keys to GitHub.

## Timeline

- 10:00: .env file committed to feature branch
- 10:15: GitHub secret scanning alert received
- 10:20: Incident response initiated
- 10:25: API keys revoked
- 10:30: New keys generated and deployed
- 10:45: Commit removed from history
- 11:00: Incident resolved

## Impact

- API keys exposed for 15 minutes
- No unauthorized usage detected
- No data breach occurred

## Root Cause

- .gitignore was not properly configured
- Developer bypassed pre-commit hooks

## Remediation

- ✅ Revoked compromised keys
- ✅ Removed from git history
- ✅ Updated .gitignore
- ✅ Installed mandatory pre-commit hooks
- ✅ Team training on secret management

## Prevention

- [ ] Implement git-secrets on all repos
- [ ] Enable GitHub secret scanning
- [ ] Quarterly security training
```

---

## Compliance Considerations

### GDPR Compliance

**Data Minimization:**

```javascript
// ❌ Don't send PII to Claude Code
const user = await User.findById(id);
console.log(user); // Might contain email, name, address

// ✅ Mask PII
const user = await User.findById(id);
const masked = {
  id: user.id,
  email: maskEmail(user.email), // "j***@example.com"
  role: user.role,
};
console.log(masked);
```

**Right to Erasure:**

- Ensure audit logs can purge user data
- Don't persist sensitive data unnecessarily

### SOC 2 Compliance

**Access Control:**

- ✅ Implement deny lists
- ✅ Audit all file access
- ✅ Role-based access (if applicable)

**Audit Logging:**

- ✅ Log all operations
- ✅ Retain logs for required period
- ✅ Protect log integrity

**Incident Response:**

- ✅ Documented procedures
- ✅ Defined SLAs
- ✅ Regular drills

---

## Security Checklist

**Before Using Claude Code:**

- [ ] `.claudeignore` configured with all sensitive files
- [ ] `settings.json` deny list populated
- [ ] `.gitignore` excludes `.env` and secrets
- [ ] Secret scanner installed and configured
- [ ] Pre-commit hooks enabled
- [ ] Team trained on security practices

**Periodic Reviews (Monthly):**

- [ ] Audit logs reviewed for anomalies
- [ ] Deny list updated with new patterns
- [ ] Secrets rotated
- [ ] Dependencies audited (`npm audit`)
- [ ] Access permissions reviewed

**After Incidents:**

- [ ] Incident report created
- [ ] Root cause identified
- [ ] Remediation completed
- [ ] Prevention measures implemented
- [ ] Team notified and trained

---

**Next**: [Token Optimization](03-token-optimization.md) →

**Previous**: [Getting Started](01-getting-started.md) ←
