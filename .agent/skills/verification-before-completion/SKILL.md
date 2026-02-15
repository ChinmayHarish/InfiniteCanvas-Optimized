---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always
---

# Verification Before Completion

## The Law of Evidence
Never say "I'm done" or "The tests are passing" based on assumption. You must have terminal output or browser screenshots as proof.

## Workflow
1. **Identify Success Criteria**: What defines "done" for this task?
2. **Run Tests**: Execute all relevant automated tests.
3. **Manual Check**: Perform the user flow or visual check.
4. **Document Proof**: Save logs or evidence to an artifact (e.g., `walkthrough.md`).
5. **Confirm**: Only now, announce completion.

## Red Flags
- "The code looks correct, so it should work."
- "I've fixed the bug" without showing the reproduction failing *before* and passing *after*.
- Skipping edge cases during verification.
