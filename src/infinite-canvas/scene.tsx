import { KeyboardControls, Stats, useKeyboardControls } from "@react-three/drei";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { useIsTouchDevice } from "~/src/use-is-touch-device";
import { clamp, lerp } from "~/src/utils";
import {
  CHUNK_FADE_MARGIN,
  CHUNK_OFFSETS,
  CHUNK_SIZE,
  DEPTH_FADE_END,
  DEPTH_FADE_START,
  INITIAL_CAMERA_Z,
  INVIS_THRESHOLD,
  KEYBOARD_SPEED,
  MAX_VELOCITY,
  MOBILE_TEX_SIZE,
  DESKTOP_TEX_SIZE,
  RENDER_DISTANCE,
  VELOCITY_DECAY,
  VELOCITY_LERP,
} from "./constants";
import styles from "./style.module.css";
import { renderCardTexture } from "./card-texture";
import { createOrganicGradientMaterial } from "./organic-gradient";
import type { ChunkData, InfiniteCanvasProps, CardItem } from "./types";
import { generateChunkPlanesCached, getCardScale, getChunkUpdateThrottleMs, shouldThrottleUpdate } from "./utils";

const KEYBOARD_MAP = [
  { name: "forward", keys: ["w", "W", "ArrowUp"] },
  { name: "backward", keys: ["s", "S", "ArrowDown"] },
  { name: "left", keys: ["a", "A", "ArrowLeft"] },
  { name: "right", keys: ["d", "D", "ArrowRight"] },
  { name: "up", keys: ["e", "E"] },
  { name: "down", keys: ["q", "Q"] },
];

type KeyboardKeys = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

const getTouchDistance = (touches: Touch[]) => {
  if (touches.length < 2) {
    return 0;
  }

  const [t1, t2] = touches;
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

type CameraGridState = {
  cx: number;
  cy: number;
  cz: number;
  camZ: number;
};

// Shared geometry — all cards reuse one PlaneGeometry instance
const SHARED_PLANE_GEO = new THREE.PlaneGeometry(1, 1);

// ShaderMaterial pool — reuse materials to avoid GPU recompilation
const materialPool = new Map<number, THREE.ShaderMaterial>();
function getPooledMaterial(rank: number): THREE.ShaderMaterial {
  const poolKey = rank % 12; // 12 palettes
  let mat = materialPool.get(poolKey);
  if (!mat) {
    mat = createOrganicGradientMaterial(rank);
    materialPool.set(poolKey, mat);
  }
  // Clone reuses compiled program from pool
  return mat.clone();
}

function CardPlane({
  position,
  card,
  chunkCx,
  chunkCy,
  chunkCz,
  cameraGridRef,
  isTouchDevice,
}: {
  position: THREE.Vector3;
  card: CardItem;
  chunkCx: number;
  chunkCy: number;
  chunkCz: number;
  cameraGridRef: React.RefObject<CameraGridState>;
  isTouchDevice: boolean;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  const localState = React.useRef({ opacity: 0, frame: 0 });

  // Create the organic gradient shader material (pooled to avoid recompilation)
  const gradientMaterial = React.useMemo(
    () => getPooledMaterial(card.rank),
    [card.rank]
  );

  // Text overlay texture — dynamic resolution for mobile optimization
  const texture = React.useMemo(() => {
    return renderCardTexture(card, isTouchDevice);
  }, [card, isTouchDevice]);

  // Calculate display scale from card dimensions
  const displayScale = React.useMemo(() => {
    const cardSize = getCardScale(card.subscribers);
    const texW = isTouchDevice ? MOBILE_TEX_SIZE : DESKTOP_TEX_SIZE;
    const texH = isTouchDevice ? MOBILE_TEX_SIZE : DESKTOP_TEX_SIZE;
    const aspect = texW / texH;
    return new THREE.Vector3(cardSize * aspect, cardSize, 1);
  }, [card.subscribers, isTouchDevice]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const state = localState.current;

    if (!group) {
      return;
    }

    state.frame = (state.frame + 1) & 1;

    // Optimization: skip if invisible and fully faded out
    if (state.opacity < INVIS_THRESHOLD && !group.visible && state.frame === 0) {
      return;
    }

    const cam = cameraGridRef.current;
    const dist = Math.max(Math.abs(chunkCx - cam.cx), Math.abs(chunkCy - cam.cy), Math.abs(chunkCz - cam.cz));
    const absDepth = Math.abs(position.z - cam.camZ);

    // Hard cull if too far
    if (absDepth > DEPTH_FADE_END + 50) {
      state.opacity = 0;
      gradientMaterial.uniforms.uOpacity.value = 0;
      group.visible = false;
      return;
    }

    const gridFade =
      dist <= RENDER_DISTANCE ? 1 : Math.max(0, 1 - (dist - RENDER_DISTANCE) / Math.max(CHUNK_FADE_MARGIN, 0.0001));

    const depthFade =
      absDepth <= DEPTH_FADE_START
        ? 1
        : Math.max(0, 1 - (absDepth - DEPTH_FADE_START) / Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 0.0001));

    const target = Math.min(gridFade, depthFade * depthFade);

    state.opacity = target < INVIS_THRESHOLD && state.opacity < INVIS_THRESHOLD ? 0 : lerp(state.opacity, target, 0.35);

    const isVisible = state.opacity > INVIS_THRESHOLD;

    // Only update uniforms and visibility if state changed or is active
    if (group.visible !== isVisible) {
      group.visible = isVisible;
    }

    if (isVisible) {
      // Animate the shader
      gradientMaterial.uniforms.uTime.value += delta;
      gradientMaterial.uniforms.uOpacity.value = state.opacity;
      gradientMaterial.uniforms.uTexture.value = texture;
      // Only enable depthWrite when fully opaque to reduce sorting cost
      gradientMaterial.depthWrite = state.opacity > 0.99;
    }
  });

  // Apply scale on mount/update
  React.useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.scale.copy(displayScale);
  }, [displayScale]);

  return (
    <group ref={groupRef} position={position} scale={displayScale} visible={false}>
      {/* Organic Gradient Background + Text (Single Pass) */}
      {/* No onClick/onPointerOver/onPointerOut — raycasting disabled for performance */}
      <mesh
        geometry={SHARED_PLANE_GEO}
        material={gradientMaterial}
        userData={{ url: card.url }}
      />
    </group>
  );
}

function Chunk({
  cx,
  cy,
  cz,
  cards,
  cameraGridRef,
  isTouchDevice,
}: {
  cx: number;
  cy: number;
  cz: number;
  cards: CardItem[];
  cameraGridRef: React.RefObject<CameraGridState>;
  isTouchDevice: boolean;
}) {
  // Synchronous generation — cached data is cheap, idle callback delays cause visible pop-in
  const planes = React.useMemo(
    () => generateChunkPlanesCached(cx, cy, cz),
    [cx, cy, cz]
  );

  if (!planes) {
    return null;
  }

  return (
    <group>
      {planes.map((plane) => {
        const cardItem = cards[plane.cardIndex % cards.length];
        if (!cardItem) return null;
        return (
          <CardPlane
            key={plane.id}
            position={plane.position}
            card={cardItem}
            chunkCx={cx}
            chunkCy={cy}
            chunkCz={cz}
            cameraGridRef={cameraGridRef}
            isTouchDevice={isTouchDevice}
          />
        );
      })}
    </group>
  );
}

// Memoize Chunk so React skips re-render when cx/cy/cz haven't changed
const MemoChunk = React.memo(Chunk);

type ControllerState = {
  velocity: { x: number; y: number; z: number };
  targetVel: { x: number; y: number; z: number };
  basePos: { x: number; y: number; z: number };
  drift: { x: number; y: number };
  mouse: { x: number; y: number };
  lastMouse: { x: number; y: number };
  scrollAccum: number;
  isDragging: boolean;
  lastTouches: Touch[];
  lastTouchDist: number;
  lastChunkKey: string;
  lastChunkUpdate: number;
  pendingChunk: { cx: number; cy: number; cz: number } | null;
};

const createInitialState = (camZ: number): ControllerState => ({
  velocity: { x: 0, y: 0, z: 0 },
  targetVel: { x: 0, y: 0, z: 0 },
  basePos: { x: 0, y: 0, z: camZ },
  drift: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 },
  lastMouse: { x: 0, y: 0 },
  scrollAccum: 0,
  isDragging: false,
  lastTouches: [],
  lastTouchDist: 0,
  lastChunkKey: "",
  lastChunkUpdate: 0,
  pendingChunk: null,
});

function SceneController({ cards, isTouchDevice }: { cards: CardItem[]; isTouchDevice: boolean }) {
  const { camera, gl } = useThree();
  const [, getKeys] = useKeyboardControls();

  const state = React.useRef<ControllerState>(createInitialState(INITIAL_CAMERA_Z));
  const cameraGridRef = React.useRef<CameraGridState>({ cx: 0, cy: 0, cz: 0, camZ: camera.position.z });

  const [chunks, setChunks] = React.useState<ChunkData[]>([]);

  React.useEffect(() => {
    const canvas = gl.domElement;
    const s = state.current;
    canvas.style.cursor = "grab";

    const setCursor = (cursor: string) => {
      canvas.style.cursor = cursor;
    };

    const onMouseDown = (e: MouseEvent) => {
      s.isDragging = true;
      s.lastMouse = { x: e.clientX, y: e.clientY };
      setCursor("grabbing");
    };

    const onMouseUp = (e: MouseEvent) => {
      s.isDragging = false;
      setCursor("grab");

      // Manual raycast for click detection (performance optimization vs R3F events)
      // Check if it was a click (not a drag)
      const dx = e.clientX - s.lastMouse.x;
      const dy = e.clientY - s.lastMouse.y;
      // Use a strict threshold for "click" vs "drag"
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        const mouse = new THREE.Vector2(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Intersect against chunk meshes
        if (chunksGroupRef.current) {
          const intersects = raycaster.intersectObjects(chunksGroupRef.current.children, true);
          if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.url) {
              window.open(object.userData.url, "_blank");
            }
          }
        }
      }
    };

    const onMouseLeave = () => {
      s.mouse = { x: 0, y: 0 };
      s.isDragging = false;
      setCursor("grab");
    };

    const onMouseMove = (e: MouseEvent) => {
      s.mouse = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };

      if (s.isDragging) {
        s.targetVel.x -= (e.clientX - s.lastMouse.x) * 0.025;
        s.targetVel.y += (e.clientY - s.lastMouse.y) * 0.025;
        s.lastMouse = { x: e.clientX, y: e.clientY }; // Update lastMouse only during drag
      }
      // Note: We don't update lastMouse on passive move if we want strict click detection from mouseDown pos
      // But s.lastMouse is set on MouseDown.
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.scrollAccum += e.deltaY * 0.006;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      s.lastTouches = Array.from(e.touches) as Touch[];
      s.lastTouchDist = getTouchDistance(s.lastTouches);
      setCursor("grabbing");
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touches = Array.from(e.touches) as Touch[];

      if (touches.length === 1 && s.lastTouches.length >= 1) {
        const [touch] = touches;
        const [last] = s.lastTouches;

        if (touch && last) {
          s.targetVel.x -= (touch.clientX - last.clientX) * 0.02;
          s.targetVel.y += (touch.clientY - last.clientY) * 0.02;
        }
      } else if (touches.length === 2 && s.lastTouchDist > 0) {
        const dist = getTouchDistance(touches);
        // Slightly higher sensitivity for pinch zoom
        s.scrollAccum += (s.lastTouchDist - dist) * 0.006;
        s.lastTouchDist = dist;
      }

      s.lastTouches = touches;
    };

    const onTouchEnd = (e: TouchEvent) => {
      s.lastTouches = Array.from(e.touches) as Touch[];
      s.lastTouchDist = getTouchDistance(s.lastTouches);
      setCursor("grab");
    };

    // We need to capture mouseDown position specifically for the click check
    // The current s.lastMouse is improved to track drag deltas.
    // Let's introduce a specific 'clickStart' tracking in the closure.
    let clickStart = { x: 0, y: 0 };

    const onMouseDownWrapper = (e: MouseEvent) => {
      clickStart = { x: e.clientX, y: e.clientY };
      onMouseDown(e);
    };

    const onMouseUpWrapper = (e: MouseEvent) => {
      const dx = e.clientX - clickStart.x;
      const dy = e.clientY - clickStart.y;

      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        // It's a click
        const rect = gl.domElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const mouse = new THREE.Vector2(
          (x / rect.width) * 2 - 1,
          -(y / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        if (chunksGroupRef.current) {
          const intersects = raycaster.intersectObjects(chunksGroupRef.current.children, true);
          if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData && object.userData.url) {
              window.open(object.userData.url, "_blank");
            }
          }
        }
      }
      onMouseUp(e);
    };


    canvas.addEventListener("mousedown", onMouseDownWrapper);
    window.addEventListener("mouseup", onMouseUpWrapper);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDownWrapper);
      window.removeEventListener("mouseup", onMouseUpWrapper);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [gl, camera]); // Added camera dependency

  useFrame(() => {
    const s = state.current;
    const now = performance.now();

    const { forward, backward, left, right, up, down } = getKeys() as KeyboardKeys;
    if (forward) s.targetVel.z -= KEYBOARD_SPEED;
    if (backward) s.targetVel.z += KEYBOARD_SPEED;
    if (left) s.targetVel.x -= KEYBOARD_SPEED;
    if (right) s.targetVel.x += KEYBOARD_SPEED;
    if (down) s.targetVel.y -= KEYBOARD_SPEED;
    if (up) s.targetVel.y += KEYBOARD_SPEED;

    const isZooming = Math.abs(s.velocity.z) > 0.05;
    const zoomFactor = clamp(s.basePos.z / 50, 0.3, 2.0);
    const driftAmount = 8.0 * zoomFactor;
    const driftLerp = isZooming ? 0.2 : 0.12;

    if (s.isDragging) {
      // Freeze drift during drag
    } else if (isTouchDevice) {
      s.drift.x = lerp(s.drift.x, 0, driftLerp);
      s.drift.y = lerp(s.drift.y, 0, driftLerp);
    } else {
      s.drift.x = lerp(s.drift.x, s.mouse.x * driftAmount, driftLerp);
      s.drift.y = lerp(s.drift.y, s.mouse.y * driftAmount, driftLerp);
    }

    s.targetVel.z += s.scrollAccum;
    s.scrollAccum *= 0.8;

    s.targetVel.x = clamp(s.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY);
    s.targetVel.y = clamp(s.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY);
    s.targetVel.z = clamp(s.targetVel.z, -MAX_VELOCITY, MAX_VELOCITY);

    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP);
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP);
    s.velocity.z = lerp(s.velocity.z, s.targetVel.z, VELOCITY_LERP);

    s.basePos.x += s.velocity.x;
    s.basePos.y += s.velocity.y;
    s.basePos.z += s.velocity.z;

    camera.position.set(s.basePos.x + s.drift.x, s.basePos.y + s.drift.y, s.basePos.z);

    s.targetVel.x *= VELOCITY_DECAY;
    s.targetVel.y *= VELOCITY_DECAY;
    s.targetVel.z *= VELOCITY_DECAY;

    const cx = Math.floor(s.basePos.x / CHUNK_SIZE);
    const cy = Math.floor(s.basePos.y / CHUNK_SIZE);
    const cz = Math.floor(s.basePos.z / CHUNK_SIZE);

    cameraGridRef.current = { cx, cy, cz, camZ: s.basePos.z };

    const key = `${cx},${cy},${cz}`;
    if (key !== s.lastChunkKey) {
      s.pendingChunk = { cx, cy, cz };
      s.lastChunkKey = key;
    }

    const throttleMs = getChunkUpdateThrottleMs(isZooming, Math.abs(s.velocity.z));

    if (s.pendingChunk && shouldThrottleUpdate(s.lastChunkUpdate, throttleMs, now)) {
      const { cx: ucx, cy: ucy, cz: ucz } = s.pendingChunk;
      s.pendingChunk = null;
      s.lastChunkUpdate = now;

      setChunks(
        CHUNK_OFFSETS.map((o) => ({
          key: `${ucx + o.dx},${ucy + o.dy},${ucz + o.dz}`,
          cx: ucx + o.dx,
          cy: ucy + o.dy,
          cz: ucz + o.dz,
        }))
      );
    }
  });

  // ... (rest of SceneController)

  // Ref for raycasting
  const chunksGroupRef = React.useRef<THREE.Group>(null);

  // ... (rest of logic)

  return (
    <group ref={chunksGroupRef}>
      {chunks.map((chunk) => (
        <MemoChunk
          key={chunk.key}
          cx={chunk.cx}
          cy={chunk.cy}
          cz={chunk.cz}
          cards={cards} // CardPlane will need to add userData
          cameraGridRef={cameraGridRef}
          isTouchDevice={isTouchDevice}
        />
      ))}
    </group>
  );
}
export function InfiniteCanvasScene({
  cards,
  showFps = false,
  showControls = false,
  cameraFov = 60,
  cameraNear = 1,
  cameraFar = 500,
  fogNear = 120,
  fogFar = 320,
  fogColor = "#0a0a0f",
}: InfiniteCanvasProps) {
  const isTouchDevice = useIsTouchDevice();
  const dpr = Math.min(window.devicePixelRatio || 1, isTouchDevice ? 1.25 : 1.5);

  if (!cards.length) {
    return null;
  }

  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <div className={styles.container}>
        <Canvas
          camera={{ position: [0, 0, INITIAL_CAMERA_Z], fov: cameraFov, near: cameraNear, far: cameraFar }}
          dpr={dpr}
          flat
          gl={{ antialias: false, powerPreference: "high-performance" }}
          className={styles.canvas}

        >
          <color attach="background" args={["#050508"]} />
          <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
          <SceneController cards={cards} isTouchDevice={isTouchDevice} />
          {showFps && <Stats className={styles.stats} />}
        </Canvas>

        {showControls && (
          <div className={styles.controlsPanel}>
            {isTouchDevice ? (
              <>
                <b>Drag</b> Pan · <b>Pinch</b> Zoom
              </>
            ) : (
              <>
                <b>WASD</b> Move · <b>QE</b> Up/Down · <b>Scroll/Space</b> Zoom
              </>
            )}
          </div>
        )}
      </div>
    </KeyboardControls>
  );
}
