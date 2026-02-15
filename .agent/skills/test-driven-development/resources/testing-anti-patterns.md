# Testing Anti-Patterns

Avoid these common mistakes when writing tests:

1. **Testing Implementation Details**: Tests should verify *what* the code does, not *how* it does it.
2. **Logic in Tests**: Tests should be simple. If you have loops or complex logic in a test, the test itself might have bugs.
3. **Fragile Selectors**: (Frontend) Avoid using CSS classes for tests. Use `data-testid`.
4. **Mocking Everything**: Don't mock your own logic. Mock external dependencies (APIs, DBs).
5. **Slow Tests**: If a unit test takes >100ms, it's probably an integration test.
6. **Flaky Tests**: Tests that fail randomly are worse than no tests. Find the source of non-determinism (usually timing or shared state).
