# Gemini Image Generation (Nano Banana) Reference

**Models:**
- `gemini-2.5-flash-image` (Nano Banana): Speed, efficiency, high-volume.
- `gemini-3-pro-image-preview` (Nano Banana Pro): Professional asset production, advanced reasoning, high-fidelity text.

## Capabilities

### 1. Text-to-Image
Generate images from text prompts.

```python
# Python Example
from google import genai
client = genai.Client()
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=["Create a picture of a nano banana dish..."]
)
image = response.parts[0].as_image()
image.save("generated.png")
```

### 2. Image Editing (Text+Image to Image)
Add, remove, or modify elements in an existing image.

```python
# Python Example
image = Image.open("cat.png")
prompt = "Add a wizard hat"
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt, image]
)
```

### 3. Multi-turn Editing
Iteratively refine images using chat (best with `gemini-3-pro-image-preview`).

```python
# Python Example
chat = client.chats.create(model="gemini-3-pro-image-preview")
response = chat.send_message("Create an infographic...")
response = chat.send_message("Update to Spanish...")
```

### 4. Grounding with Google Search
Generate images based on real-time data.

```python
# Python Example
config = types.GenerateContentConfig(tools=[{"google_search": {}}])
response = client.models.generate_content(..., config=config)
```

### 5. Subject Consistency (Reference Images)
Use up to 14 reference images (6 objects, 5 humans) to maintain consistency.

```python
# Python Example
contents = [prompt, img1, img2, ...]
response = client.models.generate_content(model="gemini-3-pro-image-preview", contents=contents)
```

## Configuration
- **Aspect Ratio**: `1:1`, `16:9`, `9:16`, `3:4`, `4:3`, etc.
- **Resolution**: `1K` (default), `2K`, `4K` (only `gemini-3-pro-image-preview`).
- **Safety**: Watermarked with SynthID.

## Prompting Best Practices
- **Photorealistic**: Use photography terms (lens, lighting, angle).
- **Stylized**: Define style, line work, shading, sticker look.
- **Text Rendering**: Specify font style, text content explicitly.
- **Composition**: Describe negative space, positioning.

## Supported Languages
- Python
- JavaScript (Node.js)
- Go
- Java
- REST (cURL)
