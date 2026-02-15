---
name: requesting-code-review
description: Dispatches a sub-agent to review code quality and process compliance. Use before marking a task as complete.
---

# Requesting Code Review

## Overview

Get a fresh set of eyes on your code BEFORE you report success.

**You cannot review your own code effectively.** You have "context blindness" - you see what you meant to write, not what's actually there.

## The Workflow

### 1. Identify Context

Gather the info the reviewer needs:
- **Base Commit:** What you started from (`git rev-parse HEAD~1`)
- **Head Commit:** What you did (`git rev-parse HEAD`)
- **Plan Item:** Which task from the plan this covers

### 2. Dispatch Reviewer

Start a subagent specifically for review:

```text
/agent run "Review my changes for Task [N].
Skill: superpowers:code-reviewer (Use the template at resources/code-reviewer.md)
Base: [hash]
Head: [hash]
Plan: [Task Name]"
```

### 3. Handle Feedback

The reviewer returns three categories:
- **Critical:** Must fix immediately. (Security, broken logic, missing requirements)
- **Important:** Should fix. (Architecture, bad names, missing tests)
- **Minor:** Fix if easy. (Typos, style)

**Action:**
1. Fix Critical/Important issues.
2. Commit fixes.
3. Self-verify fixes.
4. (Optional) Request re-review if changes were complex.

## Rules

- **Don't skip review** because "it's just a small change." Small changes break production.
- **Don't argue** with the reviewer unless they are factually wrong about requirements.
- **Don't ignore** Critical issues.

## Integration

**Used by:** `subagent-driven-development` (automatically calls this).
**Standalone:** Call manually when working solo.
