import type { StatusEffect } from "#enums/status-effect";

/** Contains fields related to {@linkcode StatusEffect}s */
export interface Status {
  /** @see {@linkcode StatusEffect} */
  readonly effect: StatusEffect;
  /**
   * Toxic damage is `1/16 max HP * toxicTurnCount`; increases by 1 per turn.
   * Ignored if the effect is not {@linkcode StatusEffect.TOXIC}
   * @defaultValue 0
   */
  toxicTurnCount: number;
  /**
   * The pokemon wakes up when this is `0` and the {@linkcode effect} is {@linkcode StatusEffect.SLEEP}.
   * Ignored if the effect is not sleep.
   * @defaultValue 0
   */
  sleepTurnsRemaining: number;
}
