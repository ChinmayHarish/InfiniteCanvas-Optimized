---
name: executing-plans
description: Executes a completed plan systematically, maintaining task state and context. Use when a comprehensive plan has been created.
---

# Executing Plans

## Overview

Systematically execute a saved implementation plan. Be the project manager and the engineer.

**Input:** A markdown plan file (from `writing-plans`).
**Output:** Completed, verified feature.

## The Loop

Run this loop until the plan is done:

### 1. Read State

- Read the plan file.
- Find the first unchecked `[ ]` task.
- **Update Plan:** Mark it as `[/]` (in progress).

### 2. Context Loading

- Read the specific layout/context for THIS task.
- "What files do I need?" -> `view_file` them.

### 3. Execution (The Work)

- **Write Test:** creating failing test first.
- **Implement:** Write the minimal code.
- **Verify:** Run the test.
- **Refactor:** Clean up if needed.

### 4. Checkpoint (Commit)

- `git add <files>`
- `git commit -m "feat: [Task Name]"`
- **Update Plan:** Mark it as `[x]` (done).

### 5. Loop or Finish

- If more tasks: Go to Step 1.
- If done: Run FULL suite (`pytest`).
- If pass: Proceed to `finishing-a-development-branch`.

## Handling Deviation

**If a step turns out to be wrong/impossible:**

1. **Stop.** Don't blindly hack.
2. **Update Plan:** Edit the markdown file to reflect the new reality.
   - "Discovered API X is deprecated, switching to Y."
   - Add new sub-tasks if specific task was too big.
3. **Resume:** Execute the UPDATED plan.

## Context Management

- **Don't** read all files in the project. Read only what the task needs.
- **Don't** rely on memory. The plan file is your external memory. Update it.

## Common Mistakes

- **Skipping plan updates:** "I know what I'm doing." (Then you get lost).
- **Big Bang Testing:** Waiting until end to run tests. (Fail early).
- **Drift:** Implementing things not in the plan. (Stick to the spec).

## Integration

**Preceded by:** `writing-plans`.
**Followed by:** `finishing-a-development-branch`.
