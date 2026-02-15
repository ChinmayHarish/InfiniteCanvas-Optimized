# Root Cause Tracing

## Algorithm

1. **Locate the Symptom:** Where exactly does the error crash?
2. **Identify the Data:** What variable held the bad value?
3. **Trace Up:** Who passed that variable?
4. **Repeat:** Who passed the bad value to THEM?
5. **Stop:** When you find a function that received GOOD data but passed BAD data.

**That function is the Root Cause.**
