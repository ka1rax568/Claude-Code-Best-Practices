# Git Workflow Guide

**Master Git workflows with Claude Code for professional version control practices**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Git Operations](#basic-git-operations)
3. [Branch Management](#branch-management)
4. [Commit Best Practices](#commit-best-practices)
5. [Pull Request Workflow](#pull-request-workflow)
6. [Conflict Resolution](#conflict-resolution)
7. [Git Hooks Integration](#git-hooks-integration)
8. [Advanced Git Operations](#advanced-git-operations)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

This guide demonstrates how to leverage Claude Code for efficient Git operations, from basic commits to complex merge strategies. Following these patterns will help you maintain clean Git history and streamline collaboration.

### Why Git Workflow Matters

- **Clean History**: Makes code reviews and debugging easier
- **Team Collaboration**: Standardized practices improve team efficiency
- **Code Quality**: Pre-commit hooks catch issues before they reach the repo
- **Traceability**: Clear commit messages enable better project tracking

---

## Basic Git Operations

### Checking Repository Status

**Prompt:**

```
Check the current git status and show me what files have changed
```

**Claude Code Response:**

```bash
git status
```

**Example Output:**

```
On branch feat/user-auth
Your branch is up to date with 'origin/feat/user-auth'.

Changes not staged for commit:
  modified:   src/services/userService.js
  modified:   tests/userService.spec.js

Untracked files:
  src/utils/validation.js
```

### Viewing Changes

**Prompt:**

```
Show me the diff for userService.js to see what changed
```

**Claude Code Response:**

```bash
git diff src/services/userService.js
```

**For Staged Changes:**

```
Show me what changes are staged for commit
```

```bash
git diff --staged
```

### Staging Files

**Prompt:**

```
Stage the userService.js and userService.spec.js files for commit
```

**Claude Code Response:**

```bash
git add src/services/userService.js tests/userService.spec.js
```

**Stage All Changes:**

```
Stage all modified and new files
```

```bash
git add .
```

---

## Branch Management

### Creating Feature Branches

**Prompt:**

```
Create a new feature branch for implementing user authentication
```

**Claude Code Response:**

```bash
git checkout -b feat/user-authentication
```

**Branch Naming Conventions:**

```
feat/feature-name       # New features
fix/bug-description     # Bug fixes
refactor/description    # Code refactoring
docs/description        # Documentation updates
test/description        # Test additions/fixes
chore/description       # Maintenance tasks
```

### Switching Branches

**Prompt:**

```
Switch to the main branch
```

**Claude Code Response:**

```bash
git checkout main
```

### Listing Branches

**Prompt:**

```
Show me all branches, including remote branches
```

**Claude Code Response:**

```bash
git branch -a
```

### Deleting Branches

**Prompt:**

```
Delete the feat/old-feature branch (it's been merged)
```

**Claude Code Response:**

```bash
# Delete local branch
git branch -d feat/old-feature

# Delete remote branch
git push origin --delete feat/old-feature
```

**Force Delete Unmerged Branch:**

```
Force delete the experimental-feature branch
```

```bash
git branch -D experimental-feature
```

---

## Commit Best Practices

### Conventional Commits

Claude Code follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Creating Commits with Claude Code

**Prompt:**

```
Create a commit for the user authentication feature I just implemented
```

**Claude Code Workflow:**

1. **Reviews Changes:**

```bash
git status
git diff
```

2. **Analyzes Context:**

- Reads recent commits: `git log --oneline -5`
- Understands project commit style
- Identifies scope and type

3. **Stages Files:**

```bash
git add src/services/authService.js tests/authService.spec.js
```

4. **Creates Commit:**

```bash
git commit -m "feat(auth): implement user authentication service

- Add JWT token generation
- Implement password hashing with bcrypt
- Add login and logout functionality
- Include comprehensive unit tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Interactive Commit Creation

**For Complex Changes:**

**Prompt:**

```
I've made several changes. Help me create multiple focused commits instead of one large commit.
```

**Claude Code Response:**

```bash
# Review all changes
git status
git diff

# Stage and commit related changes separately
git add src/services/userService.js tests/userService.spec.js
git commit -m "feat(user): add getUserById method"

git add src/services/authService.js tests/authService.spec.js
git commit -m "feat(auth): implement JWT authentication"

git add docs/api.md
git commit -m "docs(api): document user and auth endpoints"
```

### Amending Commits

**Prompt:**

```
I forgot to include a file in my last commit. Add validation.js and amend the commit.
```

**Claude Code Response:**

```bash
git add src/utils/validation.js
git commit --amend --no-edit
```

**Change Commit Message:**

```
Update the last commit message to be more descriptive
```

```bash
git commit --amend -m "feat(auth): implement user authentication with JWT

- Add JWT token generation and validation
- Implement password hashing with bcrypt
- Add email validation utility
- Include comprehensive unit tests"
```

⚠️ **Warning:** Never amend commits that have been pushed to a shared branch!

---

## Pull Request Workflow

### Creating Pull Requests with Claude Code

**Prompt:**

```
Create a pull request for my user authentication feature
```

**Claude Code Workflow:**

1. **Analyzes Branch History:**

```bash
git log main..HEAD
git diff main...HEAD
```

2. **Ensures Branch is Updated:**

```bash
git fetch origin
git rebase origin/main
```

3. **Pushes to Remote:**

```bash
git push origin feat/user-authentication
```

4. **Creates PR (using GitHub CLI):**

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

### Updating Pull Requests

**Prompt:**

```
I received code review feedback. Help me address the comments and update the PR.
```

**Claude Code Response:**

1. **Makes Requested Changes**
2. **Creates New Commit:**

```bash
git add .
git commit -m "refactor(auth): address code review feedback

- Extract token generation to separate function
- Add JSDoc comments
- Improve error handling"
```

3. **Pushes Update:**

```bash
git push origin feat/user-authentication
```

### Squashing Commits Before Merge

**Prompt:**

```
Squash my feature branch commits into a single commit before merging
```

**Claude Code Response:**

```bash
# Interactive rebase to squash commits
git rebase -i main

# In the interactive editor, Claude Code suggests:
# pick abc1234 feat(auth): initial implementation
# squash def5678 fix(auth): fix token expiry
# squash ghi9012 refactor(auth): improve error handling
```

---

## Conflict Resolution

### Identifying Conflicts

**Prompt:**

```
I'm trying to merge main into my feature branch but there are conflicts. Help me resolve them.
```

**Claude Code Response:**

1. **Identifies Conflicted Files:**

```bash
git merge main
# Output shows conflicts

git status
# Shows conflicted files
```

2. **Shows Conflict Details:**

```bash
git diff --name-only --diff-filter=U
```

### Resolving Conflicts

**Prompt:**

```
Show me the conflicts in src/services/userService.js and help me resolve them
```

**Claude Code Response:**

1. **Reads the Conflicted File:**

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

2. **Analyzes Both Versions:**

- Your version: Uses `validateId`, throws `UserNotFoundError`
- Main version: Simple validation, returns null

3. **Suggests Resolution:**

```javascript
export async function getUserById(id) {
  validateId(id); // Better validation from your branch
  const user = await database.users.findById(id); // Consistent db access
  if (!user) throw new UserNotFoundError(id); // Specific error from your branch
  return user;
}
```

4. **Completes Merge:**

```bash
git add src/services/userService.js
git commit -m "merge: resolve conflicts in userService"
```

### Using Merge Tools

**Prompt:**

```
Launch a visual merge tool to help resolve these conflicts
```

**Claude Code Response:**

```bash
git mergetool
```

---

## Git Hooks Integration

### Pre-commit Hooks

Git hooks run automatically before commits. Claude Code works seamlessly with common pre-commit frameworks.

**Setup Husky (Popular Git Hooks Framework):**

**Prompt:**

```
Set up Husky with pre-commit hooks to run linting and tests
```

**Claude Code Response:**

1. **Installs Husky:**

```bash
npm install --save-dev husky
npx husky init
```

2. **Creates Pre-commit Hook:**

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test
```

3. **Makes Hook Executable:**

```bash
chmod +x .husky/pre-commit
```

### Commit Message Hooks

**Prompt:**

```
Add a commit message hook to enforce conventional commit format
```

**Claude Code Response:**

1. **Installs commitlint:**

```bash
npm install --save-dev @commitlint/{cli,config-conventional}
```

2. **Creates Config:**

```javascript
// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

3. **Creates Commit-msg Hook:**

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### Claude Code Hook Behavior

When hooks are configured, Claude Code:

1. **Detects Hook Failures:**

```
❌ Pre-commit hook failed: ESLint errors found
```

2. **Fixes Issues:**

```bash
npm run lint:fix
```

3. **Retries Commit:**

```bash
git add .
git commit -m "feat(auth): implement login"
```

---

## Advanced Git Operations

### Rebasing

**Interactive Rebase:**

**Prompt:**

```
Help me clean up my last 5 commits using interactive rebase
```

**Claude Code Response:**

```bash
git rebase -i HEAD~5

# Claude suggests actions:
# pick abc1234 feat(auth): initial implementation
# squash def5678 fix typo
# squash ghi9012 add missing test
# reword jkl3456 feat(auth): add login
# pick mno7890 docs: update API docs
```

**Rebase onto Main:**

**Prompt:**

```
Rebase my feature branch onto the latest main
```

**Claude Code Response:**

```bash
git fetch origin
git rebase origin/main
```

### Cherry-picking

**Prompt:**

```
Cherry-pick commit abc1234 from the experimental branch to my current branch
```

**Claude Code Response:**

```bash
git cherry-pick abc1234
```

**Cherry-pick Multiple Commits:**

```bash
git cherry-pick abc1234 def5678 ghi9012
```

### Stashing

**Prompt:**

```
I need to switch branches but have uncommitted changes. Stash them for now.
```

**Claude Code Response:**

```bash
git stash push -m "WIP: authentication feature"
```

**Apply Stashed Changes:**

```
Apply my most recent stash
```

```bash
git stash pop
```

**List All Stashes:**

```
Show me all my stashed changes
```

```bash
git stash list
```

### Reflog

**Prompt:**

```
I accidentally reset my branch. Help me recover the lost commits.
```

**Claude Code Response:**

1. **Views Reflog:**

```bash
git reflog
```

2. **Identifies Lost Commit:**

```
abc1234 HEAD@{1}: reset: moving to HEAD~3
def5678 HEAD@{2}: commit: feat(auth): implement login
```

3. **Recovers Commit:**

```bash
git reset --hard def5678
```

### Submodules

**Adding Submodules:**

**Prompt:**

```
Add the shared-utils repository as a git submodule in the lib/ directory
```

**Claude Code Response:**

```bash
git submodule add https://github.com/org/shared-utils.git lib/shared-utils
git commit -m "chore: add shared-utils submodule"
```

**Updating Submodules:**

```bash
git submodule update --init --recursive
```

---

## Troubleshooting

### Undoing Changes

**Discard Uncommitted Changes:**

**Prompt:**

```
Discard all uncommitted changes in my working directory
```

**Claude Code Response:**

```bash
git restore .
```

**Discard Specific File:**

```bash
git restore src/services/userService.js
```

**Unstage Files:**

```
Unstage all files but keep the changes
```

```bash
git restore --staged .
```

### Undoing Commits

**Undo Last Commit (Keep Changes):**

**Prompt:**

```
Undo my last commit but keep the changes in my working directory
```

**Claude Code Response:**

```bash
git reset --soft HEAD~1
```

**Undo Last Commit (Discard Changes):**

```bash
git reset --hard HEAD~1
```

⚠️ **Warning:** `--hard` flag permanently deletes changes!

**Undo Pushed Commit (Create Revert Commit):**

```
Revert the commit abc1234 that was already pushed
```

```bash
git revert abc1234
```

### Large File Issues

**Prompt:**

```
I accidentally committed a large file. Remove it from history.
```

**Claude Code Response:**

```bash
# Remove file from history using filter-branch
git filter-branch --tree-filter 'rm -f path/to/large-file' HEAD

# Or use BFG Repo-Cleaner (faster)
bfg --delete-files large-file.zip
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Detached HEAD State

**Prompt:**

```
I'm in a detached HEAD state. How do I get back to my branch?
```

**Claude Code Response:**

1. **If You Want to Keep Changes:**

```bash
git branch temp-branch
git checkout main
git merge temp-branch
```

2. **If You Want to Discard Changes:**

```bash
git checkout main
```

---

## Best Practices Summary

### ✅ Do's

1. **Write Descriptive Commit Messages**
   - Use conventional commit format
   - Explain WHY, not just WHAT

2. **Commit Often, Push Strategically**
   - Make small, focused commits
   - Squash before merging to main

3. **Keep Branches Short-Lived**
   - Merge feature branches within days, not weeks
   - Reduces merge conflicts

4. **Use Feature Branches**
   - Never commit directly to main
   - Use descriptive branch names

5. **Rebase Before Merging**
   - Keep linear history
   - Easier to understand project evolution

6. **Leverage Git Hooks**
   - Catch issues before they reach the repo
   - Enforce code quality standards

### ❌ Don'ts

1. **Don't Commit Secrets**
   - Never commit API keys, passwords, or tokens
   - Use `.gitignore` and `.env` files

2. **Don't Rewrite Public History**
   - Never force push to shared branches
   - Don't amend commits that others have pulled

3. **Don't Commit Generated Files**
   - Exclude `node_modules/`, `dist/`, `coverage/`
   - Keep repo size manageable

4. **Don't Mix Concerns in Commits**
   - One commit = one logical change
   - Makes cherry-picking and reverting easier

5. **Don't Ignore Conflicts**
   - Resolve conflicts carefully
   - Test thoroughly after resolution

---

## Advanced Workflows

### GitFlow

**Initialize GitFlow:**

**Prompt:**

```
Set up GitFlow for this repository
```

**Claude Code Response:**

```bash
git flow init
```

**Create Feature:**

```bash
git flow feature start user-authentication
```

**Finish Feature:**

```bash
git flow feature finish user-authentication
```

**Create Release:**

```bash
git flow release start 1.0.0
git flow release finish 1.0.0
```

### Trunk-Based Development

**Prompt:**

```
I want to use trunk-based development. How should I structure my workflow?
```

**Claude Code Response:**

1. **Short-Lived Feature Branches**
   - Create branch from main
   - Work for 1-2 days maximum
   - Merge back to main frequently

2. **Feature Flags**
   - Hide incomplete features behind flags
   - Deploy to production safely

3. **Continuous Integration**
   - Automated tests on every commit
   - Fast feedback loop

**Example:**

```bash
git checkout main
git pull origin main
git checkout -b feat/quick-fix
# ... make changes ...
git add .
git commit -m "feat: add quick feature"
git push origin feat/quick-fix
# ... create PR and merge within hours ...
```

---

## Conclusion

Mastering Git workflow with Claude Code enables:

- **Faster Development**: Automate repetitive Git tasks
- **Better Collaboration**: Standardized commit messages and PR descriptions
- **Higher Quality**: Pre-commit hooks catch issues early
- **Clean History**: Easy code archaeology and debugging

**Next Steps:**

1. Set up Git hooks in your project
2. Practice conventional commits
3. Experiment with advanced Git operations
4. Explore [Prompt Engineering Guide](./05-prompt-engineering.md)

---

**Related Documentation:**

- [Getting Started](./01-getting-started.md)
- [Security Best Practices](./02-security-best-practices.md)
- [Prompt Engineering](./05-prompt-engineering.md)

**External Resources:**

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
