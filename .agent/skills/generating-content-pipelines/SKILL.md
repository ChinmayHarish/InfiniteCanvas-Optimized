---
name: generating-content-pipelines
description: Generates production-grade content pipelines for viral short-form videos. Use when the user wants to automate content creation workflows, generate video prompts based on object personalities, or build viral content machines.
---
# Generating Content Pipelines

Creates automated workflows for viral short-form video production through state-driven generation.

## When to use this skill
- User wants to build a "viral content machine."
- Automated generation of characters, dialogue, and scenes.
- Structured output for multi-agent or batch video production.

## Workflow

### 1. Plan-Validate-Execute
1. **Plan**: Define the "Niche" and "State Machine" rules.
2. **Validate**: Check object personalities against the niche for viral potential.
3. **Execute**: Generate the complete pipeline JSON or Markdown structure.

### 2. Implementation Steps

#### Step 1: Niche & Environment Selection
- Define the setting (e.g., "Hyper-realistic Abandoned Neon City").
- Select 3-5 distinct environments within that niche.

#### Step 2: Object Creation (The "Protagonists")
- Assign a "Soul/Personality" to inanimate objects.
- Define their visual look (materials, wear and tear).
- Establish their dynamic (e.g., "Grumpy Toaster vs. Optimistic Kettle").

#### Step 3: Scene Generation
- **Visual Prompt**: Detailed macro/cinematic description.
- **Dialogue**: Sharp, witty, under 15 words per line.
- **Vibe**: Dark humor, surrealism, or high-energy viral bait.

## Quality Checklist
Before final delivery, verify:
- [ ] Pipeline follows a logical state progression.
- [ ] Object personalities are distinct and high-conflict (good for retention).
- [ ] Image/Video prompts include technical details (lens, lighting, motion).
- [ ] Output is structured for easy parsing by other tools or models.

## Resources
- [See Pipeline State Definitions](references/pipeline-states.md)
- [Example: Anthropomorphic Kitchen Objects](../../../examples/kitchen-objects.json)
