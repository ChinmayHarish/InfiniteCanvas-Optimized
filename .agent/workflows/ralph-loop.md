---
description: Autonomous execution loop for GSD projects
---

# Ralph Loop Workflow

This workflow automates the GSD process of Planning -> Executing -> Verifying.

1.  **Check Status**
    - Run `/progress` to see the current state of the project.

2.  **Analyze & Plan**
    - Identify the current active phase from the roadmap.
    - If a plan is missing or outdated, run `/plan [phase_number]`.

3.  **Execute Phase**
    - Run `/execute [phase_number]` to implement the planned tasks.

4.  **Verify Results**
    - Run `/verify [phase_number]` to confirm the implementation meets requirements.

5.  **Loop or Complete**
    - If verification passes, proceed to the next phase or mark milestone as complete.
    - If verification fails, create a fix plan and execute again.

**Usage**: Run `/ralph-loop` to start the autonomous cycle.
// turbo
