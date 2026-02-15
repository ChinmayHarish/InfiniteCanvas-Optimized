---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification
---

# Using Git Worktrees

## Overview
Git worktrees allow you to have multiple branches checked out at the same time in separate directories. This is superior to `git checkout` because it prevents workspace pollution and allows running multiple dev servers or tasks in parallel.

## Workflow

1. **Identify Branch**: Determine the target branch or create a new one.
2. **Create Worktree**:
   ```bash
   git worktree add -b <new-branch> ../worktrees/<branch-name> main
   ```
3. **Initialize Environment**:
   - Install dependencies in the new directory.
   - Setup environment variables.
4. **Execute Work**: All work for the feature stays in this directory.
5. **Cleanup**:
   ```bash
   git worktree remove ../worktrees/<branch-name>
   ```

## Rules
- Never work on a feature in the main repository directory.
- Always use a consistent path for worktrees (e.g., `../worktrees/`).
- Verify the worktree is clean before starting.
