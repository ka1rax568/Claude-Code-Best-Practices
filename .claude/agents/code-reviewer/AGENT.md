# Code Reviewer Agent

> Specialized AI agent for deep code analysis and architectural feedback

## Agent Purpose

The Code Reviewer agent is a specialized subagent designed to provide comprehensive, production-grade code reviews. It goes beyond surface-level analysis to evaluate code quality, security, performance, architecture, and maintainability.

## Capabilities

This agent can:

- Perform deep security analysis following OWASP Top 10 guidelines
- Evaluate architectural patterns and design decisions
- Identify performance bottlenecks and optimization opportunities
- Assess code maintainability and technical debt
- Provide actionable recommendations with code examples
- Generate structured reports in multiple formats (markdown, JSON)

## When to Use This Agent

Invoke the code-reviewer agent when you need:

- **Pre-merge review**: Before merging significant changes to main branch
- **Architectural review**: Evaluating major architectural decisions or refactorings
- **Security audit**: Comprehensive security assessment of critical code paths
- **Performance optimization**: Identifying and resolving performance issues
- **Technical debt assessment**: Understanding maintainability challenges

## How to Invoke

### From Command Line

```bash
# Using the /review command (automatically invokes this agent)
.claude/commands/review.sh /path/to/code

# Or directly through Claude Code
claude-code agent run code-reviewer --target /path/to/code
```

### From Claude Code Session

```
Please use the code-reviewer agent to analyze the authentication module in src/auth/
```

## Analysis Methodology

The agent follows a systematic four-phase approach:

### Phase 1: Security Analysis

**Objective**: Identify security vulnerabilities and risks

**Checks:**

- **OWASP Top 10 Coverage**
  - SQL Injection (parameterized queries, ORM usage)
  - XSS (input sanitization, output encoding)
  - CSRF (token validation, SameSite cookies)
  - Authentication/Authorization flaws
  - Security misconfiguration
  - Sensitive data exposure
  - XML External Entities (XXE)
  - Broken access control
  - Deserialization vulnerabilities
  - Insufficient logging

- **Dependency Security**
  - Outdated packages with known CVEs
  - Packages from untrusted sources
  - Unnecessary dependencies

- **Secrets Management**
  - Hardcoded credentials
  - API keys in source code
  - Private keys committed to repository
  - Environment variable leakage

- **Input Validation**
  - Unvalidated user input
  - Type coercion issues
  - Regular expression denial of service (ReDoS)
  - File upload vulnerabilities

**Output Format:**

```markdown
### Security Findings

#### CRITICAL: SQL Injection in UserRepository

**File**: `src/repositories/UserRepository.js:45`
**Issue**: String concatenation used in SQL query
**Risk**: Attacker can execute arbitrary SQL commands

**Vulnerable Code:**
\`\`\`javascript
const query = `SELECT * FROM users WHERE id = '${userId}'`;
\`\`\`

**Recommended Fix:**
\`\`\`javascript
const query = 'SELECT \* FROM users WHERE id = ?';
const result = await db.query(query, [userId]);
\`\`\`

**References:**

- OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection
- CWE-89: https://cwe.mitre.org/data/definitions/89.html
```

### Phase 2: Architecture Analysis

**Objective**: Evaluate design patterns and code structure

**Checks:**

- **Design Patterns**
  - Appropriate pattern usage (Factory, Strategy, Observer, etc.)
  - Anti-patterns (God Object, Spaghetti Code, Circular Dependencies)
  - Separation of concerns (SoC)
  - SOLID principles adherence

- **Dependency Management**
  - Circular dependencies
  - Tight coupling between modules
  - Dependency injection usage
  - Interface segregation

- **Code Organization**
  - Layered architecture (presentation, business, data)
  - Module cohesion
  - File and folder structure
  - Naming conventions

- **Scalability**
  - Horizontal scaling readiness
  - Stateless design
  - Caching strategies
  - Database connection pooling

**Output Format:**

```markdown
### Architecture Findings

#### MEDIUM: Circular Dependency Detected

**Files**: `src/services/UserService.js` ↔ `src/services/AuthService.js`
**Issue**: Mutual dependency creates tight coupling

**Current Structure:**
\`\`\`
UserService → AuthService → UserService
\`\`\`

**Recommended Refactoring:**
Extract shared functionality to a separate module:
\`\`\`
UserService → TokenValidator ← AuthService
\`\`\`

**Benefits:**

- Improved testability
- Easier to maintain
- Clearer separation of concerns
```

### Phase 3: Performance Analysis

**Objective**: Identify performance bottlenecks and inefficiencies

**Checks:**

- **Algorithmic Complexity**
  - O(n²) or worse algorithms
  - Unnecessary nested loops
  - Inefficient data structure usage
  - Redundant computations

- **Database Performance**
  - N+1 query problems
  - Missing indexes
  - Inefficient queries
  - Lack of query optimization

- **Resource Management**
  - Memory leaks
  - Unclosed connections
  - Large object retention
  - Excessive object creation

- **Caching Opportunities**
  - Repeated expensive computations
  - Frequently accessed data
  - API response caching
  - Memoization candidates

**Output Format:**

```markdown
### Performance Findings

#### HIGH: N+1 Query Problem

**File**: `src/controllers/PostController.js:78`
**Issue**: Fetching comments in a loop for each post

**Inefficient Code:**
\`\`\`javascript
const posts = await Post.findAll();
for (const post of posts) {
post.comments = await Comment.findByPostId(post.id); // N+1 queries
}
\`\`\`

**Optimized Solution:**
\`\`\`javascript
const posts = await Post.findAll({
include: [{ model: Comment }] // Single query with JOIN
});
\`\`\`

**Impact:**

- Current: 1 + N queries (1001 queries for 1000 posts)
- Optimized: 1 query
- **Performance gain: ~100x faster**
```

### Phase 4: Maintainability Analysis

**Objective**: Assess long-term code health and technical debt

**Checks:**

- **Code Complexity**
  - Cyclomatic complexity (aim for < 10)
  - Cognitive complexity
  - Function length (aim for < 50 lines)
  - File length (aim for < 500 lines)

- **Test Coverage**
  - Unit test coverage (target: > 80%)
  - Integration test coverage
  - Critical path testing
  - Edge case handling

- **Documentation**
  - JSDoc/TypeDoc completeness
  - README clarity
  - API documentation
  - Inline comments for complex logic

- **Code Duplication**
  - DRY principle violations
  - Copy-paste code
  - Similar logic in multiple places
  - Opportunities for abstraction

**Output Format:**

```markdown
### Maintainability Findings

#### MEDIUM: High Cyclomatic Complexity

**File**: `src/utils/validator.js:validateUser`
**Complexity**: 18 (threshold: 10)
**Issue**: Function has too many conditional branches

**Refactoring Strategy:**
\`\`\`javascript
// Before: Single complex function (18 branches)
function validateUser(user) {
if (!user) return false;
if (!user.email) return false;
if (!isValidEmail(user.email)) return false;
// ... 15 more conditions
}

// After: Decomposed into smaller functions
function validateUser(user) {
return validatePresence(user) &&
validateEmail(user.email) &&
validatePassword(user.password) &&
validateProfile(user.profile);
}

function validateEmail(email) {
return email && isValidEmail(email);
}

function validatePassword(password) {
return password && password.length >= 8 && hasSpecialChar(password);
}
```

**Benefits:**

- Easier to test (4 small functions vs 1 large)
- Easier to understand
- Reusable validators

````

## Report Format Specifications

### Markdown Report

```markdown
# Code Review Report

**Generated**: 2026-01-07 00:15:00
**Target**: src/auth/
**Reviewed Files**: 15
**Total Issues**: 23

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2     |
| HIGH     | 5     |
| MEDIUM   | 10    |
| LOW      | 6     |

## Critical Issues

[Detailed findings...]

## Recommendations

1. **Immediate Action Required**
   - Fix SQL injection in UserRepository.js:45
   - Remove hardcoded API key in config.js:12

2. **Short-term Improvements**
   - Add input validation to all API endpoints
   - Implement rate limiting

3. **Long-term Enhancements**
   - Refactor authentication module for better testability
   - Add comprehensive integration tests
````

### JSON Report

```json
{
  "metadata": {
    "timestamp": "2026-01-07T00:15:00Z",
    "target": "src/auth/",
    "filesReviewed": 15,
    "agent": "code-reviewer",
    "version": "1.0.0"
  },
  "summary": {
    "totalIssues": 23,
    "bySeverity": {
      "CRITICAL": 2,
      "HIGH": 5,
      "MEDIUM": 10,
      "LOW": 6
    },
    "byCategory": {
      "security": 8,
      "performance": 6,
      "architecture": 5,
      "maintainability": 4
    }
  },
  "findings": [
    {
      "id": "SEC-001",
      "severity": "CRITICAL",
      "category": "security",
      "title": "SQL Injection in UserRepository",
      "file": "src/repositories/UserRepository.js",
      "line": 45,
      "description": "String concatenation used in SQL query",
      "impact": "Attacker can execute arbitrary SQL commands",
      "recommendation": "Use parameterized queries",
      "codeSnippet": {
        "vulnerable": "const query = `SELECT * FROM users WHERE id = '${userId}'`;",
        "fixed": "const query = 'SELECT * FROM users WHERE id = ?';\nconst result = await db.query(query, [userId]);"
      },
      "references": [
        "https://owasp.org/www-community/attacks/SQL_Injection",
        "https://cwe.mitre.org/data/definitions/89.html"
      ]
    }
  ],
  "recommendations": {
    "immediate": [
      "Fix SQL injection in UserRepository.js:45",
      "Remove hardcoded API key in config.js:12"
    ],
    "shortTerm": [
      "Add input validation to all API endpoints",
      "Implement rate limiting"
    ],
    "longTerm": [
      "Refactor authentication module for better testability",
      "Add comprehensive integration tests"
    ]
  }
}
```

## Configuration

The agent can be configured through `.claude/agents/code-reviewer/config.json`:

```json
{
  "severity": {
    "minLevel": "LOW",
    "failOn": ["CRITICAL", "HIGH"]
  },
  "analysis": {
    "includeSecurityScan": true,
    "includePerformanceScan": true,
    "includeArchitectureScan": true,
    "includeMaintainabilityScan": true
  },
  "thresholds": {
    "cyclomaticComplexity": 10,
    "functionLength": 50,
    "testCoverage": 80
  },
  "output": {
    "format": "markdown",
    "verbosity": "detailed",
    "includeCodeSnippets": true,
    "includeReferences": true
  }
}
```

## Integration with /review Command

The `/review` command automatically invokes this agent for deep analysis. The command acts as a lightweight wrapper that:

1. Runs basic grep-based checks (fast)
2. Invokes this agent for comprehensive analysis (thorough)
3. Combines results into unified report

## Best Practices

When using the code-reviewer agent:

1. **Review scope**: Focus on specific modules or features rather than entire codebase
2. **Iterative reviews**: Run reviews frequently during development, not just before merge
3. **Act on findings**: Prioritize CRITICAL and HIGH severity issues immediately
4. **Track technical debt**: Log MEDIUM and LOW issues for future refactoring
5. **Learn patterns**: Use the agent's recommendations to improve coding practices

## Limitations

This agent:

- Cannot execute code or run tests (relies on static analysis)
- May produce false positives (human review recommended for CRITICAL issues)
- Focuses on code patterns, not business logic correctness
- Works best with JavaScript/TypeScript (other languages have limited support)

## Updates and Maintenance

**Version**: 1.0.0
**Last Updated**: 2026-01-07
**Maintained By**: Claude Code Best Practices Contributors

For issues or enhancement requests, please refer to the main project repository.

---

**Generated with [Claude Code](https://claude.com/claude-code)**
