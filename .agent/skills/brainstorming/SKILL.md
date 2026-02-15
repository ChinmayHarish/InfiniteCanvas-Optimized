---
name: brainstorming
description: Generates a rigorous spec and plan when the user has a vague goal, asks for ideas, or requests a feature with no spec. Use this before coding.
---

# Brainstorming & Spec Generation

## Overview

Turn vague user requests into rigorous technical specifications. Use this skill BEFORE `writing-plans`.

**Why:** Coding without a spec creates "spaghetti code" and endless revisions.
**Goal:** A clear, approved spec that acts as the "contract" for implementation.

## The Process

### 1. Dedicated Worktree

Always start in a dedicated worktree to keep main branch clean.

```bash
# If specifically asked to use a worktree:
git worktree add -b feature/name-of-feature worktrees/name-of-feature
cd worktrees/name-of-feature
```

*(If user didn't ask for worktree, ask if they want one or just use current directory if trivial)*

### 2. The Questions (Gather Requirements)

Don't just say "Okay". Ask specific clarifying questions.

**Common Gaps:**
- "How should errors be handled?"
- "What if the external service is down?"
- "Does this need to persist across restarts?"
- "What are the performance constraints?"
- "Are there security implications?"

### 3. Proposed Spec (The Contract)

Create a document `docs/specs/[feature-name]-spec.md`.

**Structure:**
- **Goal:** One sentence summary.
- **User Story:** "As a [role], I want [feature], so that [benefit]."
- **Non-Goals:** Explicitly what we are NOT doing.
- **API/Interface:** Draft the function signatures, CLI arguments, or HTTP endpoints.
- **Data Model:** JSON schemas, DB tables, or Class attributes.
- **Edge Cases:** List at least 3 things that go wrong.

### 4. User Review Loop

Stop and ask user: "Does this spec look right? What did I miss?"

- If they say "looks good": Proceed to `writing-plans`.
- If they change scope: Update spec, confirm again.

## Output

A finalized markdown file in `docs/specs/` that the `writing-plans` skill can consume.

## Common Mistakes

- **Coding too soon:** Writing implementation code during brainstorming.
- **Assumed requirements:** Guessing instead of asking.
- **No artifact:** Discussing in chat but saving nothing to a file.
- **Skipping edge cases:** Focusing only on the "happy path".

## Integration

**Next Step:** Once spec is approved, call **writing-plans**.
