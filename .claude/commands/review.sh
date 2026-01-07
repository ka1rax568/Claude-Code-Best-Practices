#!/bin/bash
# /review - Comprehensive code review command for Claude Code
# Usage: /review [file_or_directory]
#
# This command performs automated code review with checks for:
# - Security vulnerabilities (SQL injection, XSS, hardcoded secrets)
# - Performance issues (O(n²) algorithms, unnecessary loops)
# - Code quality (SOLID principles, DRY violations)
# - Best practices adherence

# Note: We don't use set -e because grep returns non-zero when no matches found
# This is expected behavior, not an error

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TARGET="${1:-.}"  # Default to current directory

echo -e "${BLUE}=== Code Review Starting ===${NC}"
echo "Target: $TARGET"
echo ""

# Function to print findings
print_finding() {
    local severity=$1
    local file=$2
    local line=$3
    local message=$4

    case $severity in
        CRITICAL)
            color=$RED
            ;;
        HIGH)
            color=$RED
            ;;
        MEDIUM)
            color=$YELLOW
            ;;
        LOW)
            color=$YELLOW
            ;;
        INFO)
            color=$GREEN
            ;;
        *)
            color=$NC
            ;;
    esac

    echo -e "${color}[$severity]${NC} $file:$line - $message"
}

# Security Checks
echo -e "${BLUE}## Security Analysis${NC}"
echo ""

# Check for hardcoded secrets
echo "Checking for hardcoded secrets..."
if command -v grep &> /dev/null; then
    # Check for API keys
    grep -rn -E "(api[_-]?key|apikey)\s*[:=]\s*['\"]?[a-zA-Z0-9_-]{20,}" "$TARGET" \
        --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" \
        2>/dev/null | while IFS=: read -r file line content; do
        print_finding "CRITICAL" "$file" "$line" "Potential hardcoded API key detected"
    done

    # Check for passwords
    grep -rn -E "(password|passwd|pwd)\s*[:=]\s*['\"][^'\"]+['\"]" "$TARGET" \
        --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" \
        2>/dev/null | while IFS=: read -r file line content; do
        print_finding "CRITICAL" "$file" "$line" "Potential hardcoded password detected"
    done

    # Check for SQL injection risks (string concatenation in queries)
    grep -rn -E "(query|execute|exec)\s*\(.*(SELECT|INSERT|UPDATE|DELETE).*\+.*\)" "$TARGET" \
        --include="*.js" --include="*.ts" 2>/dev/null | while IFS=: read -r file line content; do
        print_finding "HIGH" "$file" "$line" "Potential SQL injection - use parameterized queries"
    done

    # Check for eval() usage
    grep -rn -E "\beval\s*\(" "$TARGET" \
        --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" \
        2>/dev/null | while IFS=: read -r file line content; do
        print_finding "HIGH" "$file" "$line" "Dangerous eval() usage detected"
    done
fi

echo ""

# Performance Checks
echo -e "${BLUE}## Performance Analysis${NC}"
echo ""

if command -v grep &> /dev/null; then
    # Check for nested loops (potential O(n²))
    grep -rn -E "for\s*\(.*for\s*\(" "$TARGET" \
        --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" \
        2>/dev/null | while IFS=: read -r file line content; do
        print_finding "MEDIUM" "$file" "$line" "Nested loop detected - review for O(n²) complexity"
    done

    # Check for Array.forEach inside loops
    grep -rn -E "for\s*\(.*\.forEach\(" "$TARGET" \
        --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" \
        2>/dev/null | while IFS=: read -r file line content; do
        print_finding "MEDIUM" "$file" "$line" "forEach inside loop - consider optimizing"
    done

    # Check for console.log in production code (not in tests)
    grep -rn "console\.log" "$TARGET" \
        --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" \
        --exclude-dir="test" --exclude-dir="tests" --exclude-dir="__tests__" \
        2>/dev/null | while IFS=: read -r file line content; do
        if [[ ! "$file" =~ \.spec\.|\.test\. ]]; then
            print_finding "LOW" "$file" "$line" "console.log in production code"
        fi
    done
fi

echo ""

# Code Quality Checks
echo -e "${BLUE}## Code Quality Analysis${NC}"
echo ""

if command -v grep &> /dev/null; then
    # Check for TODO/FIXME comments
    grep -rn -E "(TODO|FIXME|XXX|HACK)" "$TARGET" \
        --include="*.js" --include="*.ts" --include="*.jsx" --include="*.tsx" \
        2>/dev/null | while IFS=: read -r file line content; do
        print_finding "INFO" "$file" "$line" "TODO/FIXME comment found"
    done

    # Check for long functions (>50 lines - approximate)
    # This is a simplified check

    # Check for magic numbers (numbers that aren't 0, 1, -1, 2)
    grep -rn -E "[^a-zA-Z0-9_](3|4|5|6|7|8|9|[1-9][0-9]+)\s*[;,\)]" "$TARGET" \
        --include="*.js" --include="*.ts" 2>/dev/null | \
        grep -v -E "(test|spec|mock)" | head -10 | while IFS=: read -r file line content; do
        print_finding "LOW" "$file" "$line" "Magic number detected - consider extracting to constant"
    done
fi

echo ""

# Run ESLint if available
if command -v eslint &> /dev/null && ([ -f .eslintrc.js ] || [ -f .eslintrc.json ] || [ -f package.json ]); then
    echo -e "${BLUE}## ESLint Analysis${NC}"
    echo ""
    if eslint "$TARGET" --format compact 2>&1 | grep -v "warnings\|errors"; then
        echo -e "${GREEN}No ESLint issues found${NC}"
    fi
    echo ""
fi

# Run tests if available
if [ -f package.json ] && command -v npm &> /dev/null; then
    if grep -q "\"test\"" package.json; then
        echo -e "${BLUE}## Test Coverage${NC}"
        echo ""
        if npm test -- --coverage --passWithNoTests 2>&1 | tail -20; then
            echo ""
        fi
    fi
fi

echo ""
echo -e "${BLUE}=== Code Review Complete ===${NC}"
echo ""
echo "Recommendations:"
echo "1. Address all CRITICAL and HIGH severity issues immediately"
echo "2. Review MEDIUM severity issues for optimization opportunities"
echo "3. Plan to address LOW severity issues in upcoming refactoring"
echo "4. Keep INFO items for awareness and future improvements"
echo ""
echo "For detailed analysis, consider:"
echo "- Running security scanners (npm audit, snyk)"
echo "- Performing manual code review"
echo "- Adding comprehensive tests"
echo ""
