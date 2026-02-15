import * as THREE from "three";
import { CARD_TEX_WIDTH, CARD_TEX_HEIGHT } from "./constants";
import type { CardItem } from "./types";

const textureCache = new Map<string, THREE.CanvasTexture>();
const MAX_CACHE = 512;

const formatSubscribers = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
};

const truncate = (text: string, maxLen: number): string => {
    if (!text) return "";
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
};

// --- Theme Constants ---
const THEME = {
    bgGradientStart: "#0a0a0f", // Deep void black
    bgGradientEnd: "#1a1a24",   // Subtle dark blue-grey
    accentColor: "#00f3ff",     // Cyan neon for stats
    titleColor: "#ffffff",      // Pure white for title
    descColor: "#8b8b99",       // Muted grey for description
    rankColor: "#ffd700",       // Gold for rank
    glowColor: "rgba(0, 243, 255, 0.15)", // Subtle cyan glow
    borderColor: "#2a2a35",     // Dark border
};

export const renderCardTexture = (card: CardItem): THREE.CanvasTexture => {
    const cacheKey = card.id;
    if (textureCache.has(cacheKey)) {
        return textureCache.get(cacheKey)!;
    }

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = CARD_TEX_WIDTH;
    canvas.height = CARD_TEX_HEIGHT;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return new THREE.CanvasTexture(canvas);
    }

    const w = CARD_TEX_WIDTH;
    const h = CARD_TEX_HEIGHT;
    const padding = 48;

    // --- 1. Background (Dark Gradient) ---
    const grim = ctx.createLinearGradient(0, 0, 0, h);
    grim.addColorStop(0, THEME.bgGradientStart);
    grim.addColorStop(1, THEME.bgGradientEnd);
    ctx.fillStyle = grim;
    ctx.fillRect(0, 0, w, h);

    // --- 2. Subtle Glow / vignette ---
    const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
    glow.addColorStop(0, "rgba(255, 255, 255, 0.02)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0.6)"); // Stronger vignette
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // --- 3. Border ---
    ctx.strokeStyle = THEME.borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, w, h);

    // --- 4. Rank Badge (Top Right) ---
    const rankText = `#${card.rank}`;
    // Using generic sans-serif that looks clean; system fonts are fine
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = THEME.rankColor;
    ctx.shadowColor = "rgba(255, 215, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.fillText(rankText, w - padding, padding + 24);
    ctx.shadowBlur = 0; // Reset shadow

    // --- 5. Subreddit Title (Center-ish) ---
    const name = `r/${card.name}`;
    // Large, bold title
    ctx.font = "800 64px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = THEME.titleColor;

    // White Title Glow
    ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
    ctx.shadowBlur = 20;
    ctx.fillText(name, padding, h / 2 - 20);
    ctx.shadowBlur = 0;

    // --- 6. Stats (Subscribers) ---
    const subs = formatSubscribers(card.subscribers);
    ctx.font = "500 36px monospace"; // Monospace for numbers looks techy
    ctx.fillStyle = THEME.accentColor;
    ctx.shadowColor = THEME.glowColor;
    ctx.shadowBlur = 15;
    ctx.fillText(subs + " subscribers", padding, h / 2 + 40);
    ctx.shadowBlur = 0;

    // --- 7. Description (Bottom) ---
    if (card.description) {
        ctx.font = "400 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
        ctx.fillStyle = THEME.descColor;
        const desc = truncate(card.description, 160);

        // Auto-wrap nicely
        const words = desc.split(" ");
        let line = "";
        let y = h - padding - 40;
        const lineHeight = 32;
        const maxWidth = w - (padding * 2);

        // We'll just print 2 lines max
        let linesPrinted = 0;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, padding, y);
                line = words[n] + " ";
                y += lineHeight;
                linesPrinted++;
                if (linesPrinted >= 2) {
                    line = "..."; // Truncate if more than 2 lines
                    break;
                }
            } else {
                line = testLine;
            }
        }
        // Print last line
        if (linesPrinted < 2) {
            ctx.fillText(line, padding, y);
        }
    }

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace; // Ensure correct color space

    // Cache management
    if (textureCache.size >= MAX_CACHE) {
        const firstKey = textureCache.keys().next().value;
        if (firstKey) {
            textureCache.get(firstKey)?.dispose();
            textureCache.delete(firstKey);
        }
    }
    textureCache.set(cacheKey, texture);

    return texture;
};
