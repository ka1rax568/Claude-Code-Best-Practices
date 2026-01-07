# Pull Request Review Checklist

Use this checklist to ensure comprehensive code reviews. Check off items as you review them.

---

## Pre-Review

- [ ] PR has a clear, descriptive title
- [ ] PR description explains what and why (not just how)
- [ ] PR is linked to relevant issue(s)
- [ ] PR is reasonably sized (< 400 lines changed preferred)
- [ ] CI/CD checks are passing
- [ ] No merge conflicts with target branch

---

## Code Quality

### Functionality

- [ ] Code does what the PR description claims
- [ ] All acceptance criteria from linked issues are met
- [ ] Edge cases are handled appropriately
- [ ] Error handling is comprehensive and appropriate
- [ ] No obvious bugs or logical errors

### Code Style

- [ ] Follows project coding standards
- [ ] Consistent with existing codebase style
- [ ] No unnecessary code complexity
- [ ] DRY principle followed (no unnecessary duplication)
- [ ] SOLID principles respected where applicable

### Naming & Readability

- [ ] Variables and functions have clear, descriptive names
- [ ] Boolean variables use is/has/should prefixes
- [ ] No magic numbers (constants are named)
- [ ] Code is self-documenting
- [ ] Complex logic has explanatory comments

### Architecture & Design

- [ ] Changes fit well with existing architecture
- [ ] No violation of separation of concerns
- [ ] Dependencies are appropriate and minimal
- [ ] No tight coupling introduced
- [ ] Scalability considerations addressed

---

## Testing

### Test Coverage

- [ ] New code has corresponding tests
- [ ] Tests cover happy paths
- [ ] Tests cover edge cases and error conditions
- [ ] Test coverage meets project threshold (e.g., >80%)
- [ ] No tests were deleted without justification

### Test Quality

- [ ] Tests are clear and well-named
- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Tests are independent (no test interdependencies)
- [ ] No flaky or timing-dependent tests
- [ ] Mock/stub usage is appropriate

### Manual Testing

- [ ] Changes have been manually tested
- [ ] Testing instructions provided (if applicable)
- [ ] Screenshots/videos included for UI changes
- [ ] Tested in multiple environments (if applicable)

---

## Security

### Input Validation

- [ ] All user inputs are validated
- [ ] SQL injection prevention in place
- [ ] XSS prevention for web outputs
- [ ] Command injection prevention
- [ ] Path traversal protection

### Authentication & Authorization

- [ ] Authentication checks are present
- [ ] Authorization checks are correct
- [ ] No privilege escalation vulnerabilities
- [ ] Session management is secure

### Data Protection

- [ ] Sensitive data is not logged
- [ ] Secrets are not hardcoded
- [ ] Encryption is used where appropriate
- [ ] Personal data handling complies with regulations (GDPR, etc.)

### Dependencies

- [ ] No new dependencies with known vulnerabilities
- [ ] Dependencies are from trusted sources
- [ ] Dependency versions are pinned or constrained

---

## Performance

### Efficiency

- [ ] No obvious performance bottlenecks
- [ ] Database queries are optimized
- [ ] No N+1 query problems
- [ ] Appropriate use of caching
- [ ] No unnecessary computations in loops

### Resource Management

- [ ] Memory leaks prevented
- [ ] File handles/connections properly closed
- [ ] Large datasets handled efficiently
- [ ] Async operations used where appropriate

### Scalability

- [ ] Code can handle expected load
- [ ] No hardcoded limits that will cause issues at scale
- [ ] Resource usage is reasonable

---

## Documentation

### Code Documentation

- [ ] Public APIs have doc comments
- [ ] Complex algorithms are explained
- [ ] "Why" comments explain non-obvious decisions
- [ ] No commented-out code (unless with explanation)

### Project Documentation

- [ ] README updated if needed
- [ ] API documentation updated
- [ ] CHANGELOG updated
- [ ] Migration guides provided for breaking changes

### User Documentation

- [ ] User-facing changes documented
- [ ] Help text updated if applicable
- [ ] Release notes prepared

---

## Database & Migrations

- [ ] Migrations are reversible
- [ ] Migrations tested on copy of production data
- [ ] No data loss in migrations
- [ ] Indexes added where appropriate
- [ ] Migration performance acceptable

---

## API Changes

- [ ] Backward compatibility maintained (or breaking changes documented)
- [ ] API versioning used correctly
- [ ] Request/response schemas documented
- [ ] Error responses are consistent
- [ ] Rate limiting considered

---

## UI/UX (if applicable)

- [ ] UI matches design specifications
- [ ] Responsive design works on all target devices
- [ ] Accessibility standards met (WCAG)
- [ ] Loading states are handled
- [ ] Error messages are user-friendly
- [ ] Internationalization considered

---

## Git & Commits

### Commit Quality

- [ ] Commits are logical and atomic
- [ ] Commit messages follow conventions
- [ ] No merge commits (if rebase workflow)
- [ ] No commits that should be squashed

### Branch Management

- [ ] Branch is up-to-date with target
- [ ] No unnecessary files committed
- [ ] .gitignore updated if needed

---

## Deployment

- [ ] Feature flags used for risky changes
- [ ] Deployment plan documented
- [ ] Rollback plan exists
- [ ] Environment variables documented
- [ ] Configuration changes noted

---

## Specific Checks by Language/Framework

### JavaScript/TypeScript

- [ ] TypeScript types are correct (no `any` abuse)
- [ ] Promises handled correctly (no unhandled rejections)
- [ ] async/await used properly
- [ ] Memory leaks from closures avoided

### Python

- [ ] Type hints used (if applicable)
- [ ] Exception handling is appropriate
- [ ] Context managers used for resources
- [ ] PEP 8 compliance

### Java

- [ ] Exceptions handled appropriately
- [ ] Resources closed properly (try-with-resources)
- [ ] Thread safety considered
- [ ] No obvious memory leaks

### Go

- [ ] Error handling follows Go conventions
- [ ] Goroutines don't leak
- [ ] Defer statements used appropriately
- [ ] Context used for cancellation

---

## Final Checks

- [ ] No TODO comments without issues filed
- [ ] No debug code left in
- [ ] No console.log/print statements (unless intentional)
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Linter passes
- [ ] No new warnings introduced

---

## Review Outcome

### Approve ✅

Use when:

- All critical items checked
- Minor suggestions can be addressed in follow-up
- Changes improve codebase quality

### Request Changes 🔄

Use when:

- Critical issues must be fixed
- Security vulnerabilities present
- Tests are insufficient
- Breaking changes not properly documented

### Comment 💬

Use when:

- Just providing feedback
- Not blocking approval
- Asking clarifying questions

---

## Review Comments Best Practices

### Be Constructive

```
❌ "This code is bad"
✅ "Consider extracting this into a separate function for better testability"
```

### Be Specific

```
❌ "Improve error handling"
✅ "Add try-catch around line 45 to handle potential JSON parse errors"
```

### Explain Why

```
❌ "Don't do this"
✅ "This approach could cause N+1 queries. Consider using eager loading instead."
```

### Suggest Solutions

```
❌ "This won't work"
✅ "This might fail when X happens. Consider using Y pattern instead. Example: [code]"
```

### Recognize Good Work

```
✅ "Nice refactoring! This is much more readable."
✅ "Great test coverage on the edge cases."
```

---

## Severity Levels

### 🔴 Critical (Must Fix)

- Security vulnerabilities
- Data loss risks
- Breaking changes without migration path
- Major performance regressions

### 🟡 Important (Should Fix)

- Missing tests
- Code quality issues
- Minor performance concerns
- Unclear documentation

### 🟢 Minor (Nice to Have)

- Style preferences
- Optimization opportunities
- Alternative approaches

### 💡 Suggestion (Optional)

- Future improvements
- Additional features
- Learning resources

---

## Time Guidelines

- **Small PR (<100 lines)**: 10-15 minutes
- **Medium PR (100-400 lines)**: 30-45 minutes
- **Large PR (>400 lines)**: 60+ minutes (or request splitting)

If review takes longer, consider:

- PR is too large (request splitting)
- More context needed (ask questions)
- Pair programming session instead

---

## After Review

### For Reviewers

- [ ] Follow up on requested changes
- [ ] Re-review after changes made
- [ ] Approve when satisfied

### For Authors

- [ ] Address all comments
- [ ] Ask for clarification if needed
- [ ] Mark conversations as resolved
- [ ] Request re-review when ready

---

## Notes

**Remember:**

- Reviews are about the code, not the person
- Ask questions when you don't understand
- It's okay to learn from the PR
- Both reviewer and author are responsible for quality

**Goals of Code Review:**

1. Catch bugs and issues
2. Maintain code quality
3. Share knowledge
4. Ensure consistency
5. Improve team collaboration

---

## Customization Instructions

Adapt this checklist for your project:

1. Remove sections that don't apply
2. Add project-specific checks
3. Adjust severity definitions
4. Update language-specific sections
5. Add company/team policies
6. Include links to style guides

**Save as**: `.github/PULL_REQUEST_TEMPLATE/review-checklist.md` or keep in docs/
