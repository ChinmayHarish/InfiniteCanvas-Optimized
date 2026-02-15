---
name: finishing-a-development-branch
description: Handles the completion of a development branch, offering options to merge, create a PR, or discard. Use when a feature is verified and ready for integration.
---

# Finishing a Development Branch

## Overview

Use this when you have completed a plan, all tests pass, and you are ready to wrap up the feature/worktree.

**Goal:** Cleanly integrate work or hand off for review.
**Pre-condition:** All tests pass. `git status` is clean.

## The Workflow

### Step 1: Final Verification

Run the full test suite one last time.
```bash
pytest # or npm test
```
If fail: **STOP**. Fix it. Do not offer to merge broken code.

### Step 2: Check Context

Where are we?
```bash
git branch --show-current
# -> feature/fancy-feature
```

### Step 3: Offer Options

Present these exact 4 options to the user:

**1. Merge locally and delete branch**
   - Good for: Solo work, confident changes, small features.
   - Merges to main/base, deletes feature branch, removes worktree.

**2. Create Pull Request (and keep branch)**
   - Good for: Review needed, large features, unsafe to merge directly.
   - Pushes branch, prints PR link, keeps worktree for feedback.

**3. Do nothing (keep branch active)**
   - Good for: Pausing work, switching context, waiting for feedback.

**4. Discard everything**
   - Good for: Failed experiments, learning spikes.
   - **DANGER:** Requires explicit "type 'discard' to confirm".

### Step 4: Execute Choice

**If Option 1 (Merge):**
```bash
# Verify we are not on main
git checkout main
git merge feature/fancy-feature
git branch -d feature/fancy-feature
# Check for worktree and remove if exists
```

**If Option 2 (PR):**
```bash
git push -u origin feature/fancy-feature
# (If using gh cli)
gh pr create --fill
```

**If Option 4 (Discard):**
```text
Are you sure? This will PERMANENTLY DELETE:
- Branch feature/fancy-feature
- Worktree at <path>

Type 'discard' to confirm.
```

Wait for exact confirmation.

If confirmed:
```bash
git checkout <base-branch>
git branch -D <feature-branch>
```

Then: Cleanup worktree (Step 5)

### Step 5: Cleanup Worktree

**For Options 1, 2, 4:**

Check if in worktree:
```bash
git worktree list | grep $(git branch --show-current)
```

If yes:
```bash
git worktree remove <worktree-path>
```

**For Option 3:** Keep worktree.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Cleanup Branch |
|--------|-------|------|---------------|----------------|
| 1. Merge locally | ✓ | - | - | ✓ |
| 2. Create PR | - | ✓ | ✓ | - |
| 3. Keep as-is | - | - | ✓ | - |
| 4. Discard | - | - | - | ✓ (force) |

## Common Mistakes

**Skipping test verification**
- **Problem:** Merge broken code, create failing PR
- **Fix:** Always verify tests before offering options

**Open-ended questions**
- **Problem:** "What should I do next?" → ambiguous
- **Fix:** Present exactly 4 structured options

**Automatic worktree cleanup**
- **Problem:** Remove worktree when might need it (Option 2, 3)
- **Fix:** Only cleanup for Options 1 and 4

**No confirmation for discard**
- **Problem:** Accidentally delete work
- **Fix:** Require typed "discard" confirmation

## Red Flags

**Never:**
- Proceed with failing tests
- Merge without verifying tests on result
- Delete work without confirmation
- Force-push without explicit request

**Always:**
- Verify tests before offering options
- Present exactly 4 options
- Get typed confirmation for Option 4
- Clean up worktree for Options 1 & 4 only

## Integration

**Called by:**
- **subagent-driven-development** (Step 7) - After all tasks complete
- **executing-plans** (Step 5) - After all batches complete

**Pairs with:**
- **using-git-worktrees** - Cleans up worktree created by that skill
