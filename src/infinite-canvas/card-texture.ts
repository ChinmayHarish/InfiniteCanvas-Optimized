import * as THREE from "three";
import { DESKTOP_TEX_SIZE, MOBILE_TEX_SIZE } from "./constants";
import type { CardItem } from "./types";

const textureCache = new Map<string, THREE.CanvasTexture>();
const MAX_CACHE_SIZE = 128;

/**
 * Renders card text content onto a high-resolution transparent texture.
 * Optimized for organic-gradient background shader.
 */
export function renderCardTexture(card: CardItem, isMobile: boolean): THREE.CanvasTexture {
    const cacheKey = `${card.name}-${card.subscribers}-${isMobile ? "m" : "d"}`;
    if (textureCache.has(cacheKey)) {
        return textureCache.get(cacheKey)!;
    }

    const size = isMobile ? MOBILE_TEX_SIZE : DESKTOP_TEX_SIZE;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const w = size;
    const h = size;
    const padding = w * 0.12;
    // Scale factor based on baseline 1024px size
    const scale = size / 1024;

    // 1. Fully transparent background (shader handles the card body)
    ctx.clearRect(0, 0, w, h);

    // 2. Rank — large watermark, top-right
    const rankText = `#${card.rank}`;
    ctx.font = `800 ${Math.round(180 * scale)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.letterSpacing = `${Math.round(6 * scale)}px`;
    ctx.fillText(rankText, w - padding + Math.round(30 * scale), padding);

    // 3. Title — prominent, center-left
    const name = `r/${card.name}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // Subtle dark glow for legibility
    ctx.shadowBlur = Math.round(10 * scale);
    ctx.shadowColor = "rgba(0,0,0,0.15)";

    let fontSize = Math.round(120 * scale);
    ctx.font = `700 ${fontSize}px 'Outfit', sans-serif`;
    let textWidth = ctx.measureText(name).width;
    const maxTitleWidth = w - padding * 2;

    while (textWidth > maxTitleWidth && fontSize > Math.round(50 * scale)) {
        fontSize -= Math.round(10 * scale);
        ctx.font = `700 ${fontSize}px 'Outfit', sans-serif`;
        textWidth = ctx.measureText(name).width;
    }

    ctx.fillStyle = "#000000";
    ctx.letterSpacing = `${Math.round(-0.8 * scale)}px`;

    const centerY = h * 0.48;
    ctx.fillText(name, padding, centerY);

    // 4. Followers / Subtitle
    ctx.letterSpacing = "0px";
    ctx.font = `500 ${Math.round(60 * scale)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillText(`${(card.subscribers / 1000).toFixed(0)}K members`, padding, centerY + fontSize * 0.72);

    // 5. Action Hint (Bottom Right)
    ctx.font = `600 ${Math.round(40 * scale)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.textAlign = "right";
    ctx.letterSpacing = `${Math.round(1 * scale)}px`;
    ctx.fillText("TAP TO VIEW →", w - padding, h - padding);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    if (textureCache.size >= MAX_CACHE_SIZE) {
        const firstKey = textureCache.keys().next().value;
        if (firstKey) {
            const oldTex = textureCache.get(firstKey);
            oldTex?.dispose();
            textureCache.delete(firstKey);
        }
    }
    textureCache.set(cacheKey, texture);

    return texture;
}
