# Defense in Depth

## The Pattern

When a bug finds a way through your checks, add checks at **every layer**.

## Example

**Bug:** Empty string passed to `git init`.

**Fix Layers:**
1. **Entry:** API validation (Joi/Zod)
2. **Business:** Service logic check (`if (!path) throw`)
3. **Infrastructure:** File system guard (`if (path == '/') throw`)
4. **Debug:** Logging before action

**Why:** Each layer catches different bugs (e.g., mocks skipping API layer, internal calls skipping business layer).
