# Content Pipeline State Definitions

Professional-grade state machine for automated content production.

## 1. Environment State
Defines the visual world.
- **Rules**: Must be consistent across all scenes in a batch.
- **Variables**: Time of day, weather, architectural style, lighting temperature.

## 2. Object State
Defines the characters.
- **Soul**: The core personality (e.g., Cynical, Anxious, Explosive).
- **Physical**: Accurate material properties (e.g., Brushed Steel, Corroded Iron, Translucent Plastic).
- **State Changes**: How the object reacts to the script (e.g., "Steam whistles on anger").

## 3. Narrative State
Defines the scene.
- **Conflict**: Every scene must have a mini-conflict between characters.
- **Pacing**: Short lines of dialogue to maintain high retention in short-form video.
- **Hooks**: Start with a visual or verbal hook in the first 0.5s.

## 4. Prompt Synthesis State
Transforms the above into agent-ready instructions.
- **Image/Video Prompt**: Combines Environment + Object + Narrative into a high-fidelity prompt.
- **Technical Overrides**: Adds lens and lighting tags (e.g., "Macro 100mm", "Low-key dramatic").
