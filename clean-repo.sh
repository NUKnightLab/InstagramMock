#!/bin/bash

# Clean repository of large files

# First, make sure git filter-repo is installed
if ! command -v git-filter-repo &> /dev/null; then
    echo "git-filter-repo is not installed. Please install it first with:"
    echo "brew install git-filter-repo"
    exit 1
fi

# Make sure we're in the root of the repository
if [ ! -d ".git" ]; then
    echo "Please run this script from the root of the repository"
    exit 1
fi

# Create a backup of the repository
echo "Creating backup..."
cp -r .git .git.bak

# Remove node_modules from git history
echo "Removing node_modules from git history..."
git filter-repo --path node_modules/ --invert-paths --force

# Remove any files larger than 50MB
echo "Removing files larger than 50MB from git history..."
git filter-repo --strip-blobs-bigger-than 50M --force

# Update all refs
echo "Cleaning up..."
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# Optimize repository
echo "Optimizing repository..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "Repository has been cleaned."
echo "You will need to force push with: git push origin main --force"
echo "WARNING: This will overwrite the remote history!" 