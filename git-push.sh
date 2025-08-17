#!/bin/bash

# Git auto-push script for financing project
# Usage: ./git-push.sh "commit message"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    print_error "Not inside a Git repository!"
    exit 1
fi

# Get commit message from parameter or prompt user
if [ -z "$1" ]; then
    echo "Enter commit message:"
    read -r COMMIT_MESSAGE
else
    COMMIT_MESSAGE="$1"
fi

# Check if there are any changes
if git diff-index --quiet HEAD --; then
    print_warning "No changes detected. Nothing to commit."
    exit 0
fi

print_status "Checking current status..."
git status --short

print_status "Adding all changes..."
git add .

print_status "Committing changes with message: \"$COMMIT_MESSAGE\""
git commit -m "$COMMIT_MESSAGE

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
print_status "Pushing to origin/main..."
if git push origin main; then
    print_status "Successfully pushed changes to GitHub!"
    echo ""
    echo "Repository: https://github.com/itamargero/financing.git"
    echo "View changes: https://github.com/itamargero/financing/commits/main"
else
    print_error "Failed to push changes!"
    exit 1
fi