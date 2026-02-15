---
name: generating-gemini-images
description: Generates code and prompts for Gemini's native image generation models (Nano Banana). Use when the user mentions image generation, editing, or specific Gemini image models like gemini-2.5-flash-image or gemini-3-pro-image-preview.
---
# Generating Gemini Images (Nano Banana)

Mastery of Gemini's `gemini-2.5-flash-image` and `gemini-3-pro-image-preview` models.

## Usage Triggers
Use this skill when the user asks to:
- "Generate images with Gemini"
- "Write code for Gemini image generation"
- "Edit images using Gemini API"
- "Create an infographic with Gemini"
- "How to use Nano Banana models"

## Workflow

### 1. Plan-Validate-Execute
Before generating code or prompts:
1. **Plan**: Select the correct model based on the [Model Selection Guide](#model-selection-guide).
2. **Validate**: Ensure any generated code imports `google.genai` and handles model thinking for Pro.
3. **Execute**: Generate the code or descriptive prompt.

## Instructions

### Model Selection Guide
| Feature | `gemini-2.5-flash-image` | `gemini-3-pro-image-preview` |
| :--- | :--- | :--- |
| **Best For** | Speed, efficiency, high volume | Professional assets, complex reasoning, text |
| **Thinking** | No | Yes (Advanced reasoning process) |
| **Max Res** | - | 4K |
| **Ref Images**| Standard | Up to 14 (Mixed types) |

### Code Generation Rules
1. **Always** import `google.genai`.
2. **Always** specify the model name correctly.
3. **Always** handle the response parts to check for `text` vs `inline_data` (images).
4. Use `gemini-3-pro-image-preview` for tasks requiring text rendering or complex logic.

## Quality Checklist
Before final delivery, verify:
- [ ] Correct model selected for the task complexity.
- [ ] Code includes `google.genai` import and proper client initialization.
- [ ] Response handling correctly distinguishes between image data and text.
- [ ] Prompt (if generated) includes lighting, texture, and composition details.

## References
- [See Detailed Patterns and Examples](references/usage-guide.md)
