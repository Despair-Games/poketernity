import type { MpCommandSync } from "./mp-command-sync";
import type { MpDesyncGuard } from "./mp-desync-guard";
import type { MpSession } from "./mp-session";

/**
 * Phase gate names where multiplayer synchronization must occur.
 * At these points, the game blocks until both players have submitted
 * their decisions and the server has resolved them.
 */
export const MP_SYNC_PHASES = ["TurnStartPhase", "SelectModifierPhase", "SelectBiomePhase", "EggHatchPhase"] as const;

export type MpSyncPhase = (typeof MP_SYNC_PHASES)[number];

/**
 * Determines whether a given phase requires multiplayer synchronization.
 */
export function isMpSyncPhase(phaseName: string): phaseName is MpSyncPhase {
  return (MP_SYNC_PHASES as readonly string[]).includes(phaseName);
}

/**
 * The MpPhaseGate is responsible for blocking phase execution at sync boundaries
 * until the multiplayer command sync has resolved.
 *
 * Integration: PhaseManager checks `shouldGate()` before executing a phase.
 * If gated, the phase is deferred until `release()` is called.
 */
export class MpPhaseGate {
  private _gated: boolean = false;
  private _gatedPhaseName: string | null = null;
  private _releaseCallback: (() => void) | null = null;

  private readonly session: MpSession;
  readonly _commandSync: MpCommandSync;
  readonly _desyncGuard: MpDesyncGuard;

  constructor(session: MpSession, commandSync: MpCommandSync, desyncGuard: MpDesyncGuard) {
    this.session = session;
    this._commandSync = commandSync;
    this._desyncGuard = desyncGuard;
  }

  /**
   * Check whether the given phase should be gated for MP sync.
   */
  shouldGate(phaseName: string): boolean {
    if (!this.session.isActive) {
      return false;
    }
    return isMpSyncPhase(phaseName);
  }

  /**
   * Gate a phase — blocks execution until release() is called.
   * Returns a promise that resolves when the gate is released.
   */
  async gate(phaseName: string): Promise<void> {
    this._gated = true;
    this._gatedPhaseName = phaseName;

    return new Promise<void>((resolve) => {
      this._releaseCallback = resolve;
    });
  }

  /**
   * Release the gate, allowing the gated phase to proceed.
   */
  release(): void {
    this._gated = false;
    this._gatedPhaseName = null;
    if (this._releaseCallback) {
      const cb = this._releaseCallback;
      this._releaseCallback = null;
      cb();
    }
  }

  get isGated(): boolean {
    return this._gated;
  }

  get gatedPhaseName(): string | null {
    return this._gatedPhaseName;
  }

  reset(): void {
    this._gated = false;
    this._gatedPhaseName = null;
    if (this._releaseCallback) {
      this._releaseCallback();
    }
    this._releaseCallback = null;
  }
}
