---
name: polishing-prompts
description: Transforms crude prompt ideas into polished, production-ready prompts using Google's Prompt Engineering methodology. Use when the user says "give me the prompt for this", "polish this prompt", or "create a prompt for".
---
# Polishing Prompts

Transforms crude ideas into polished, ready-to-use prompts based on Google's methodology.

## Triggers
- "Give me the prompt for this"
- "Create a prompt for [task]"
- "Polish this prompt"
- User describes a need and requests a prompt

## Polishing Workflow

### 1. Plan-Validate-Execute
Before generating a prompt:
1. **Plan**: Identify the task type and the optimal prompting technique.
2. **Validate**: Review the objective against the [google-techniques.md](references/google-techniques.md) reference.
3. **Execute**: Generate the structured prompt.

### 2. Implementation Steps

#### Step 1: Clarify the Objective
Identify:
- **Task type**: Generation, classification, extraction, reasoning, conversation
- **Input**: What will be provided to the prompt?
- **Output**: What format/structure is expected?
- **Constraints**: Length, tone, style, safety requirements

#### Step 2: Select Prompting Technique
| Situation | Technique |
|-----------|-----------|
| Simple, well-defined task | Zero-shot |
| Need consistent format/pattern | Few-shot (2-5 examples) |
| Complex reasoning required | Chain-of-Thought |
| High-stakes accuracy needed | Self-consistency |
| Multiple valid approaches exist | Tree of Thoughts |
| External tool/API integration | ReAct |

#### Step 3: Add Structure
**For system prompts, include:**
```
[Role/Persona - who the AI should be]
[Task - what to do]
[Context - background information]
[Constraints - rules and limitations]
[Output format - how to structure response]
```

**For user prompts, include:**
```
[Clear instruction]
[Input data]
[Expected output format]
```

#### Step 4: Incorporate Examples (if few-shot)
- Use 2-5 diverse, high-quality examples.
- Include edge cases.
- Show exact input → output format.

#### Step 5: Specify Output Format
Be explicit (e.g., "Return valid JSON", "Output as a numbered list").

#### Step 6: Add Safety (if needed)
- Set boundaries for unsure results ("say 'I don't know'").
- Enforce respectful tone.

#### Step 7: Recommend Configuration
- Recommend temperature (0 for factual, 0.7+ for creative).

## Output Format

**ALWAYS output the polished prompt in a clearly marked code block:**

```
[The complete, copy-pasteable prompt goes here]
```

**Then provide:**
- Technique used and why.
- Recommended temperature.
- How to customize/adapt.

## Quality Checklist
Before delivering, the agent must verify:
- [ ] Task is clearly defined and unambiguous.
- [ ] Output format is explicitly specified.
- [ ] Most effective prompting technique (e.g., CoT, Few-shot) is selected.
- [ ] Prompt is complete and copy-pasteable as-is.
- [ ] Recommended configuration settings are provided.

## References
- [See Google Techniques Reference](references/google-techniques.md)
