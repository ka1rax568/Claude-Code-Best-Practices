#!/bin/bash
# /fix-lint - Auto-fix linting and formatting issues
# Usage: /fix-lint [options] [path]
#
# Options:
#   --dry-run    Preview changes without applying them
#   --strict     Fail on warnings (not just errors)
#   --staged     Only lint staged files
#
# This command automatically fixes linting and formatting issues using:
# - ESLint for JavaScript/TypeScript
# - Prettier for code formatting

# Note: set -e only for critical failures, allow linters to fail gracefully

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Parse arguments
DRY_RUN=false
STRICT=false
STAGED=false
TARGET="."

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --strict)
            STRICT=true
            shift
            ;;
        --staged)
            STAGED=true
            shift
            ;;
        *)
            TARGET="$1"
            shift
            ;;
    esac
done

echo -e "${BLUE}=== Lint & Format Fixer ===${NC}"
echo ""

# Check for package.json
if [ ! -f package.json ]; then
    echo -e "${YELLOW}Warning: package.json not found${NC}"
    echo "This command works best in a Node.js project"
    echo ""
fi

# Function to get files to lint
get_files_to_lint() {
    if [ "$STAGED" = true ]; then
        git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|json|md)$' || true
    else
        find "$TARGET" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" \) \
            ! -path "*/node_modules/*" \
            ! -path "*/dist/*" \
            ! -path "*/build/*" \
            ! -path "*/coverage/*" || true
    fi
}

FILES=$(get_files_to_lint)

if [ -z "$FILES" ]; then
    echo -e "${GREEN}No files to lint${NC}"
    exit 0
fi

FILE_COUNT=$(echo "$FILES" | wc -l)
echo "Found $FILE_COUNT file(s) to process"
echo ""

# ESLint
if command -v eslint &> /dev/null; then
    echo -e "${BLUE}## Running ESLint${NC}"
    echo ""

    if [ "$DRY_RUN" = true ]; then
        echo "Dry run mode - showing issues without fixing"
        if [ "$STAGED" = true ]; then
            git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' | xargs -r eslint || true
        else
            eslint "$TARGET" --ext .js,.jsx,.ts,.tsx || true
        fi
    else
        echo "Fixing ESLint issues..."
        if [ "$STAGED" = true ]; then
            git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' | xargs -r eslint --fix || true
        else
            eslint "$TARGET" --ext .js,.jsx,.ts,.tsx --fix || true
        fi
        echo -e "${GREEN}ESLint fixes applied${NC}"
    fi

    # Check for remaining issues
    if [ "$STRICT" = true ]; then
        echo ""
        echo "Running strict check..."
        if [ "$STAGED" = true ]; then
            if git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$' | xargs -r eslint --max-warnings 0; then
                echo -e "${GREEN}No warnings or errors remaining${NC}"
            else
                echo -e "${RED}Strict mode: Warnings detected${NC}"
                exit 1
            fi
        else
            if eslint "$TARGET" --ext .js,.jsx,.ts,.tsx --max-warnings 0; then
                echo -e "${GREEN}No warnings or errors remaining${NC}"
            else
                echo -e "${RED}Strict mode: Warnings detected${NC}"
                exit 1
            fi
        fi
    fi

    echo ""
elif [ -f .eslintrc.js ] || [ -f .eslintrc.json ] || grep -q "eslintConfig" package.json 2>/dev/null; then
    echo -e "${YELLOW}ESLint configuration found but eslint command not available${NC}"
    echo "Run: npm install"
    echo ""
fi

# Prettier
if command -v prettier &> /dev/null; then
    echo -e "${BLUE}## Running Prettier${NC}"
    echo ""

    if [ "$DRY_RUN" = true ]; then
        echo "Dry run mode - checking formatting"
        if [ "$STAGED" = true ]; then
            git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|json|md)$' | xargs -r prettier --check || true
        else
            prettier --check "$TARGET/**/*.{js,jsx,ts,tsx,json,md}" 2>/dev/null || true
        fi
    else
        echo "Formatting files..."
        if [ "$STAGED" = true ]; then
            git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|json|md)$' | xargs -r prettier --write || true
        else
            prettier --write "$TARGET/**/*.{js,jsx,ts,tsx,json,md}" 2>/dev/null || true
        fi
        echo -e "${GREEN}Prettier formatting applied${NC}"
    fi

    echo ""
elif [ -f .prettierrc ] || [ -f .prettierrc.json ] || [ -f prettier.config.js ] || grep -q "prettier" package.json 2>/dev/null; then
    echo -e "${YELLOW}Prettier configuration found but prettier command not available${NC}"
    echo "Run: npm install"
    echo ""
fi

# TypeScript compilation check (if tsconfig.json exists)
if [ -f tsconfig.json ] && command -v tsc &> /dev/null; then
    echo -e "${BLUE}## TypeScript Check${NC}"
    echo ""

    if [ "$DRY_RUN" = false ]; then
        echo "Checking TypeScript compilation..."
        if tsc --noEmit; then
            echo -e "${GREEN}TypeScript check passed${NC}"
        else
            echo -e "${YELLOW}TypeScript compilation errors detected${NC}"
            echo "Fix these errors manually or adjust tsconfig.json"
        fi
        echo ""
    fi
fi

# Summary
echo -e "${BLUE}=== Summary ===${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo "Dry run completed - no changes were made"
    echo "Remove --dry-run flag to apply fixes"
else
    echo -e "${GREEN}Linting and formatting complete!${NC}"
    echo ""
    echo "Changes applied:"
    echo "- ESLint auto-fixes"
    echo "- Prettier formatting"
    echo ""

    if [ "$STAGED" = true ]; then
        echo "Staged files have been fixed."
        echo "Review changes with: git diff"
        echo "Re-stage if needed: git add -u"
    else
        echo "Review changes with: git diff"
        echo "Commit when ready: git add . && git commit"
    fi
fi

echo ""
echo "For manual review of remaining issues:"
echo "  npm run lint         # Check for issues"
echo "  npm run format:check # Check formatting"
echo ""
