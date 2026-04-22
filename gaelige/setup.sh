#!/bin/bash
# Foghlaim Gaeilge — GitHub + Netlify setup script
# Run this from your Gaelige folder in Terminal

set -e

REPO_NAME="gaelige-learner"
GITHUB_USER=$(gh api user --jq '.login' 2>/dev/null || echo "")

echo "🇮🇪 Setting up Foghlaim Gaeilge..."

# Clean up any stale git state and reinitialize
rm -rf .git
git init
git checkout -b main
git config user.name "Nick (Weilbacher) McCarthy-Yates"
git config user.email "n626@proton.me"

# Stage only the app files (not .eml class notes etc.)
git add index.html netlify.toml .gitignore irish-learner.jsx
git commit -m "Add Foghlaim Gaeilge — interactive Irish learning web app

Self-contained HTML app with flashcards, quiz mode, pronunciation
guide, and background on the Irish language. Netlify-ready."

echo "✅ Git commit done."

# Create GitHub repo and push
if command -v gh &>/dev/null; then
  echo "Creating GitHub repo: $REPO_NAME..."
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
  echo ""
  echo "✅ Pushed to GitHub!"
  echo "   → https://github.com/$GITHUB_USER/$REPO_NAME"
  echo ""
  echo "Next: Go to https://app.netlify.com → Add new site → Import from Git"
  echo "      Select the '$REPO_NAME' repo and deploy."
  echo "      Then point your custom domain (driftcode.dev or subdomain) at it."
else
  echo ""
  echo "⚠️  gh CLI not found. Install it first: brew install gh"
  echo "    Then run: gh auth login"
  echo "    Then re-run this script."
fi
