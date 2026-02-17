import * as THREE from "three";

/**
 * Organic Gradient ShaderMaterial factory.
 * Creates a flowing, animated gradient background for each card.
 *
 * Adapted from J0SUKE/organic-gradients-shader
 * Uses simplex noise for organic color movement.
 */

// Simplex 2D Noise (by Ian McEwan, Stefan Gustavson)
const SNOISE_GLSL = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  vUv = uv;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform float uOpacity;
uniform float uSeed;
uniform float uRedFactor;
uniform float uGreenFactor;
uniform float uBlueFactor;
uniform sampler2D uTexture;

${SNOISE_GLSL}

void main() {
  vec2 uv = vUv;

  // Organic noise (2D is faster than 3D)
  float noise = snoise(uv * 2.0 + uSeed + uTime * 0.05);
  float waves = sin(noise * 4.0 + uTime * 0.4);

  // Color mixing
  vec3 color = vec3(
    0.5 + waves * uRedFactor * 0.5 + uv.x * 0.1,
    0.6 + waves * uGreenFactor * 0.5,
    0.8 + waves * uBlueFactor * 0.5 - uv.y * 0.1
  );

  // Faster vignette
  float dist = length(uv - 0.5);
  color *= 1.1 - dist * 0.4;

  // Simplified rounded corner mask
  vec2 q = abs(uv - 0.5) - 0.46 + 0.04;
  float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - 0.04;
  float cardAlpha = 1.0 - smoothstep(0.0, 0.01, d);

  // Sample the label texture
  vec4 label = texture2D(uTexture, uv);
  color = mix(color, label.rgb, label.a);

  gl_FragColor = vec4(color, cardAlpha * uOpacity);
}
`;

// Color palette presets — Refined "Nature-Inspired" palettes
// Each palette avoids "muddy midpoints" by choosing hue-compatible factors
const PALETTES: [number, number, number][] = [
  [0.9, 0.3, 0.6],   // Tropical Sunset (Orange-Magenta)
  [0.2, 0.7, 0.9],   // Azure Sky (Bright Blue)
  [0.6, 0.2, 0.9],   // Twilight (Deep Purple)
  [0.1, 0.8, 0.5],   // Crystal Ocean (Emerald-Teal)
  [0.9, 0.6, 0.1],   // Desert Dusk (Gold-Amber)
  [0.4, 0.9, 0.2],   // Aurora (Neon Green)
  [0.8, 0.1, 0.3],   // Berry Nebula (Red-Violet)
  [0.3, 0.4, 0.9],   // Deep Sea (Indigo-Royal Blue)
  [0.9, 0.8, 0.2],   // Summer Moon (Saffron)
  [0.2, 0.9, 0.7],   // Bio-luminescence (Aqua)
  [0.7, 0.4, 0.9],   // Orchid Sky (Lavender)
  [0.9, 0.2, 0.1],   // Magma (Bright Red)
];

/**
 * Create a ShaderMaterial for a card's organic gradient background.
 * @param rank - Card rank (used to pick palette + seed the noise)
 */
export function createOrganicGradientMaterial(rank: number): THREE.ShaderMaterial {
  const palette = PALETTES[rank % PALETTES.length];
  // Deterministic seed from rank so each card gets a unique noise pattern
  const seed = (rank * 1.618033988749) % 100;

  return new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1.0 },
      uSeed: { value: seed },
      uRedFactor: { value: palette[0] },
      uGreenFactor: { value: palette[1] },
      uBlueFactor: { value: palette[2] },
      uTexture: { value: null },
    },
    transparent: true,
    depthWrite: true,
    side: THREE.FrontSide,
  });
}
