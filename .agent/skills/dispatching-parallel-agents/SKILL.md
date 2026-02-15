---
name: dispatching-parallel-agents
description: Dispatches multiple sub-agents to execute independent tasks in parallel. Use when a plan has multiple independent tasks.
---

# Dispatching Parallel Agents

## Overview

Execute multiple independent tasks simultaneously by spawning parallel subagents.

**Goal:** Reduce total wall-clock time for multi-file or multi-task operations.
**Constraint:** Tasks MUST be independent (files don't touch same lines, logic doesn't depend on each other).

## When to Use

- **Good:** "Create 5 new independent tools"
- **Good:** "Write tests for these 3 separate modules"
- **Good:** "Refactor 4 different files that don't import each other"
- **Bad:** "Step 1 creates file, Step 2 interprets it" (Sequential dependency)
- **Bad:** "Refactor function used by all 5 files" (Merge conflict risk)

## The Workflow

### 1. Identify Independent Groups

Look at the plan. Group tasks that define *disjoint sets* of files.

### 2. Dispatch Pattern

For EACH independent task, start a new subagent session:

```text
/agent run "Implement Task 1: [Task Name] from plan docs/plans/xxx.md.
Context: You are a subagent working on ONE distinct task.
1. Read the plan.
2. Implement ONLY Task 1.
3. Verify your specific changes.
4. Do NOT verify other tasks.
5. Exit when done."
```

### 3. Monitor Progress

- Check on agents periodically.
- See which ones finish/fail.

### 4. Review & Merge

**Crucial Step:** When a subagent finishes, they might have pushed code or left it in a worktree/branch.

- If in worktree: Merge their changes back to main branch.
- If in same dir: `git pull` or verify file state.

**Verify Integration:**
Run the full test suite to ensure no hidden interactions caused regressions.

## Rules

1. **Isolation:** Give each agent CLEAR boundaries. "Touch file A only."
2. **Context:** Pass the full plan path so they see the big picture.
3. **No Overlap:** If two agents touch `utils.py`, you WILL get conflicts. Don't do it.
4. **Integration Test:** Parallel execution works, but integration fails. Always test ALL together at end.

## Common Mistakes

- Spawning 10 agents on same file -> Merge Hell.
- Spawning agents without plan -> They drift and hallucinate requirements.
- Spawning agents on dependent tasks -> Agent B fails because Agent A isn't done.
- Forgetting to merge results -> Work is lost.

## Integration

**Preceded by:** `writing-plans` (to generate the task list).
**Alternate:** `subagent-driven-development` (sequential execution for dependent tasks).
