#!/bin/bash
# /conventional-commit - Generate Conventional Commits compliant commit messages
# Usage: /conventional-commit
#
# This command analyzes staged changes and generates a properly formatted
# commit message following the Conventional Commits specification:
# https://www.conventionalcommits.org/
#
# Format: <type>(<scope>): <subject>
#
# Types: feat, fix, docs, style, refactor, test, chore

set -e

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Conventional Commit Generator ===${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Check for staged changes
if ! git diff --cached --quiet; then
    echo -e "${GREEN}Staged changes detected${NC}"
else
    echo -e "${YELLOW}No staged changes found${NC}"
    echo "Stage your changes with: git add <files>"
    exit 1
fi

echo ""

# Get staged files
STAGED_FILES=$(git diff --cached --name-only)
FILE_COUNT=$(echo "$STAGED_FILES" | wc -l)

echo "Analyzing $FILE_COUNT staged file(s)..."
echo ""

# Analyze changes to determine type
determine_type() {
    local files="$1"
    local diff_content=$(git diff --cached)

    # Check for new files (features)
    if git diff --cached --diff-filter=A --name-only | grep -q .; then
        echo "feat"
        return
    fi

    # Check for test files
    if echo "$files" | grep -qE '\.(test|spec)\.(js|ts|jsx|tsx)$'; then
        echo "test"
        return
    fi

    # Check for documentation
    if echo "$files" | grep -qE '\.(md|txt)$|^docs/'; then
        echo "docs"
        return
    fi

    # Check for configuration files
    if echo "$files" | grep -qE '\.(json|yml|yaml|toml|ini)$|config|\.rc$'; then
        echo "chore"
        return
    fi

    # Check for style-only changes (whitespace, formatting)
    if echo "$diff_content" | grep -qE '^\+\s*$|^\-\s*$'; then
        # Check if there are substantial changes too
        if echo "$diff_content" | grep -qE '^\+.*[a-zA-Z]'; then
            # Has code changes, check for bug fix keywords
            if echo "$diff_content" | grep -qiE '\b(fix|bug|issue|error|crash)\b'; then
                echo "fix"
                return
            else
                echo "feat"
                return
            fi
        else
            echo "style"
            return
        fi
    fi

    # Check for refactoring (modified files without new functionality)
    if git diff --cached --diff-filter=M --name-only | grep -q .; then
        # Check for bug fix keywords
        if echo "$diff_content" | grep -qiE '\b(fix|bug|resolve|patch)\b'; then
            echo "fix"
            return
        fi
        # Check for refactor keywords
        if echo "$diff_content" | grep -qiE '\b(refactor|restructure|reorganize)\b'; then
            echo "refactor"
            return
        fi
    fi

    # Default to feat for new functionality
    echo "feat"
}

# Determine scope from file paths
determine_scope() {
    local files="$1"

    # Get most common directory
    local scope=$(echo "$files" | xargs dirname | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')

    # Clean up scope
    case "$scope" in
        "src"*)
            echo "$scope" | sed 's|^src/||' | cut -d'/' -f1
            ;;
        "lib"*)
            echo "$scope" | sed 's|^lib/||' | cut -d'/' -f1
            ;;
        "."*)
            echo "root"
            ;;
        *)
            echo "$scope" | cut -d'/' -f1
            ;;
    esac
}

# Generate subject line
generate_subject() {
    local type="$1"
    local files="$2"
    local diff_stats=$(git diff --cached --shortstat)

    # Extract file names without paths
    local file_names=$(echo "$files" | xargs -n1 basename | head -3)
    local file_list=$(echo "$file_names" | tr '\n' ', ' | sed 's/, $//')

    case "$type" in
        feat)
            echo "add $file_list"
            ;;
        fix)
            echo "resolve issue in $file_list"
            ;;
        docs)
            echo "update documentation in $file_list"
            ;;
        style)
            echo "format code in $file_list"
            ;;
        refactor)
            echo "refactor $file_list"
            ;;
        test)
            echo "add tests for $file_list"
            ;;
        chore)
            echo "update configuration files"
            ;;
        *)
            echo "update $file_list"
            ;;
    esac
}

# Analyze changes
TYPE=$(determine_type "$STAGED_FILES")
SCOPE=$(determine_scope "$STAGED_FILES")
SUBJECT=$(generate_subject "$TYPE" "$STAGED_FILES")

# Clean up subject (remove extensions, limit length)
SUBJECT=$(echo "$SUBJECT" | sed -E 's/\.(js|ts|jsx|tsx|md|json)//g' | cut -c1-72)

# Build commit message
COMMIT_TYPE="$TYPE"
COMMIT_SCOPE="$SCOPE"
COMMIT_SUBJECT="$SUBJECT"

# Generate full commit message
COMMIT_MSG="${COMMIT_TYPE}"
if [ -n "$COMMIT_SCOPE" ] && [ "$COMMIT_SCOPE" != "." ]; then
    COMMIT_MSG="${COMMIT_MSG}(${COMMIT_SCOPE})"
fi
COMMIT_MSG="${COMMIT_MSG}: ${COMMIT_SUBJECT}"

# Show preview
echo -e "${BLUE}Generated commit message:${NC}"
echo ""
echo -e "${GREEN}${COMMIT_MSG}${NC}"
echo ""

# Show diff stats
echo -e "${BLUE}Changes summary:${NC}"
git diff --cached --stat
echo ""

# Ask for confirmation
read -p "Use this commit message? [Y/n/e(dit)] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ee]$ ]]; then
    # Edit mode
    echo ""
    echo "Enter your custom commit message:"
    echo "Format: <type>(<scope>): <subject>"
    echo ""
    read -p "Type (feat/fix/docs/style/refactor/test/chore): " CUSTOM_TYPE
    read -p "Scope (optional): " CUSTOM_SCOPE
    read -p "Subject: " CUSTOM_SUBJECT

    COMMIT_MSG="${CUSTOM_TYPE}"
    if [ -n "$CUSTOM_SCOPE" ]; then
        COMMIT_MSG="${COMMIT_MSG}(${CUSTOM_SCOPE})"
    fi
    COMMIT_MSG="${COMMIT_MSG}: ${CUSTOM_SUBJECT}"
elif [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Commit cancelled"
    exit 0
fi

# Add Claude Code attribution
COMMIT_BODY="

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Create commit
echo ""
echo "Creating commit..."

git commit -m "$(cat <<EOF
${COMMIT_MSG}${COMMIT_BODY}
EOF
)"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Commit created successfully!${NC}"
    echo ""
    echo "Latest commit:"
    git log -1 --oneline
    echo ""
    echo "To push: git push origin $(git branch --show-current)"
else
    echo -e "${RED}Commit failed${NC}"
    exit 1
fi
