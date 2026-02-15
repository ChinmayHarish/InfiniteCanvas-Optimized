---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment
---

# Writing Skills

## Structure of a Skill
Every skill must reside in `.agent/skills/[name]/` and contain:
1. `SKILL.md`: The main entry point with YAML frontmatter.
2. `resources/`: (Optional) Supporting documents or prompts.
3. `examples/`: (Optional) Usage examples.
4. `scripts/`: (Optional) Automation scripts.

## Principles of "The Claude Way"
- **Conciseness**: Avoid redundant words.
- **Progressive Disclosure**: Reveal complexity only when needed.
- **Forward Slashes**: Use `topic/subtopic` for organization.
- **Degrees of Freedom**: Give the agent enough room to be smart.

## Testing Your Skill
Follow the TDD cycle for skills:
1. **RED**: Run a scenario without the skill; observe failure/bad output.
2. **GREEN**: Apply the skill; observe success.
3. **REFACTOR**: Tighten instructions to close loopholes.

## References
- [anthropic-best-practices.md](resources/anthropic-best-practices.md)
- [persuasion-principles.md](resources/persuasion-principles.md)
