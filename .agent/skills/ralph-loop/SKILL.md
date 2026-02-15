---
description: Autonomous planning and execution loop
---

# Ralph Loop

This skill enables the agent to autonomously plan and execute tasks in a loop until a specific goal is achieved or a milestone is complete.

## Capabilities

1.  **Read Progress**: Checks `/progress` to understand the current state.
2.  **Determine Next Step**: Analyzes the roadmap and current state to decide the next logical task.
3.  **Execute**: Runs the necessary GSD commands (e.g., `/plan`, `/execute`, `/verify`) or other tools.
4.  **Loop**: Repeats the process until success or failure threshold.

## Instructions for Use

When the user invokes `/ralph-loop` or asks for autonomous execution:

1.  **Check Progress**: `view_file .gsd/ROADMAP.md` (or run `/progress`).
2.  **Identify Phase**: Determine the current active phase.
3.  **Plan**: If no plan exists for the current phase, run `/plan [phase_number]`.
4.  **Execute**: Run `/execute [phase_number]`.
5.  **Verify**: Run `/verify [phase_number]`.
6.  **Iterate**: If verification fails, fix issues and re-verify. If successful, move to the next phase.

**Note**: This skill relies on the GSD framework being correctly set up.
