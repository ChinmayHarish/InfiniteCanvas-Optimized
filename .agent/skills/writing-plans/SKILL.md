---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview
Write comprehensive implementation plans assuming the engineer has zero context for our codebase. Document everything: files to touch, sample code, testing strategy, and documentation updates.

## Plan Structure
1. **Goal**: High-level objective.
2. **Proposed Changes**: Grouped by component.
   - [NEW] or [MODIFY] tags.
3. **Verification Plan**:
   - Automated tests.
   - Manual verification steps.

## Principles
- **Bite-sized**: Tasks should be small enough to verify independently.
- **TDD-First**: Plan the tests before the implementation.
- **Atomic**: Ensure each task leaves the codebase in a building state.
- **No Fluff**: Get straight to the technical details.
