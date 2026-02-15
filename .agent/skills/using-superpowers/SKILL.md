---
name: using-superpowers
description: Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions
---

# Using Superpowers

## Rule #1: Skill First
Before answering a user or taking action, you must check if a specialized skill exists for the task.

## Process
1. **Search**: `ls .agent/skills/`
2. **Scan**: Read `SKILL.md` for the most relevant skill.
3. **Invoke**: Follow the instructions in the skill strictly.

## Type of Skills
- **Workflow Skills**: Define *how* to do work (e.g., `writing-plans`).
- **Domain Skills**: Provide *knowledge* for specific areas (e.g., `brand-identity`).
- **Tool Skills**: Integration with specific platforms (e.g., `super-design`).

## Red Flags
- Skipping the planning phase.
- Using generic approaches when a specific skill exists.
- Writing code without following the project's preferred workflow.
