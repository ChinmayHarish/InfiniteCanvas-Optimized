# Condition-Based Waiting

## The Pattern

**Instead of:**
`await new Promise(r => setTimeout(r, 1000))`

**Use:**
`await waitFor(condition, timeout)`

## Why?

- **Faster:** Resumes immediately when condition met (doesn't wait full 1 second)
- **Reliable:** Doesn't fail if computer is slow and takes 1.1 seconds
- **Explicit:** Documents WHAT you are waiting for

## Implementation

See `examples/condition-based-waiting-example.ts` for full implementation.
