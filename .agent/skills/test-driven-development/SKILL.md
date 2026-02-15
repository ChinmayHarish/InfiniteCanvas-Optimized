---
name: test-driven-development
description: Enforces Test-Driven Development (TDD) workflow. Use when writing code to ensure correctness and prevent regressions.
---

# Test-Driven Development (TDD)

## The Cycle: Red-Green-Refactor

1. **RED**: Write a failing test for the next small bit of functionality.
2. **GREEN**: Write the minimal code needed to make the test pass.
3. **REFACTOR**: Clean up the code while keeping the test passing.

## Why TDD?
- Prevents regressions.
- Forces better design (code must be testable).
- Provides living documentation.
- Increases confidence in changes.

## Best Practices
- **Bite-sized**: One test at a time.
- **Fail First**: Never write implementation before the test fails.
- **Minimal Implementation**: Don't build for the future in the GREEN phase.
- **Comprehensive**: Cover edge cases early.

## References
- [testing-anti-patterns.md](resources/testing-anti-patterns.md)
