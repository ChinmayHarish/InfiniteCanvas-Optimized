import type * as THREE from "three";

export type CardItem = {
  id: string;
  name: string;
  title: string;
  subscribers: number;
  description: string;
  url: string;
  rank: number;
};

export type InfiniteCanvasProps = {
  cards: CardItem[];
  showFps?: boolean;
  showControls?: boolean;
  cameraFov?: number;
  cameraNear?: number;
  cameraFar?: number;
  fogNear?: number;
  fogFar?: number;
  backgroundColor?: string;
  fogColor?: string;
};

export type ChunkData = {
  key: string;
  cx: number;
  cy: number;
  cz: number;
};

export type PlaneData = {
  id: string;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  cardIndex: number;
};

export type MediaItem = {
  url: string;
};
