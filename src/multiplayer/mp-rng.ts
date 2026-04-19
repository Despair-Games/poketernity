/**
 * MP-specific RNG seed management.
 * In multiplayer, the seed comes from the server rather than being generated locally.
 * This module provides helpers to inject the server-provided seed into the game's RNG.
 */

import { globalScene } from "#app/global-scene";

let mpSeedOverride: string | null = null;

/**
 * Set the server-provided seed for the MP run.
 * Must be called before the run starts (before first battle seed generation).
 */
export function setMpSeed(seed: string): void {
  mpSeedOverride = seed;
}

/**
 * Get the current MP seed override, if any.
 * Returns null if not in an MP run.
 */
export function getMpSeed(): string | null {
  return mpSeedOverride;
}

/**
 * Apply the MP seed to the global scene's RNG.
 * Should be called when the run starts.
 */
export function applyMpSeed(): void {
  if (mpSeedOverride) {
    globalScene.rngSeedOverride = mpSeedOverride;
  }
}

/**
 * Clear the MP seed override (on run end or disconnect).
 */
export function clearMpSeed(): void {
  mpSeedOverride = null;
}
