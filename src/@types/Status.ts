import type { StatusEffect } from "#enums/status-effect";

export interface Status {
  effect: StatusEffect;
  toxicTurnCount: number;
  sleepTurnsRemaining: number;
}
