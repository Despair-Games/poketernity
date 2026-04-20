import { globalScene } from "#app/global-scene";
import { applyPeerCommands, type SerializedTurnCommand, serializeTurnCommand } from "./mp-command-serialization";
import type { MpCommandSync } from "./mp-command-sync";
import type { MpDesyncGuard } from "./mp-desync-guard";
import type { MpSession } from "./mp-session";
import { hideWaitingOverlay, showWaitingOverlay } from "./mp-waiting-overlay";

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
   *
   * For TurnStartPhase, this also kicks off the command sync flow
   * (serialize → submit → wait for peer → apply → release).
   */
  async gate(phaseName: string): Promise<void> {
    this._gated = true;
    this._gatedPhaseName = phaseName;

    if (phaseName === "TurnStartPhase") {
      this.syncTurnCommands().catch((err) => {
        console.error("[MP] Turn command sync failed:", err);
        // Release the gate on error so the game doesn't freeze
        this.release();
      });
    } else {
      // For non-turn sync phases (SelectModifier, SelectBiome, EggHatch),
      // both clients produce identical results from the shared seed.
      // Auto-release after a microtask to maintain the gating contract.
      queueMicrotask(() => this.release());
    }

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

  /**
   * Serializes local turn commands, submits them to the server,
   * waits for the peer's commands, applies them, and releases the gate.
   */
  private async syncTurnCommands(): Promise<void> {
    const turnManager = globalScene.currentBattle.turnManager;
    const localUserId = this.session.localUserId;

    // Serialize only player-owned commands (not enemy commands).
    // Enemy commands are generated identically on both clients from the shared seed.
    const localCommands: SerializedTurnCommand[] = [];
    turnManager.forEachCommand((cmd) => {
      if (cmd.pokemon.isPlayer() && cmd.pokemon.mpOwnerUserId === localUserId) {
        localCommands.push(serializeTurnCommand(cmd));
      }
    });
    const localCommandJson = JSON.stringify(localCommands);

    console.log(
      `[MP] Submitting ${localCommands.length} player commands for turn ${this.session.currentTurn}, wave ${this.session.currentWave}`,
    );

    showWaitingOverlay();

    // Finalize the desync hash for this turn
    const stateHash = this._desyncGuard.finalizeTurn(this.session.currentTurn);

    // Submit to server and wait for the peer's commands
    const peerCommands = await this._commandSync.submitAndWaitForPeer(
      this.session.currentTurn,
      this.session.currentWave,
      localCommandJson,
      stateHash,
    );

    hideWaitingOverlay();

    // Apply peer commands to the turn queue
    applyPeerCommands(peerCommands);

    console.log(`[MP] Turn ${this.session.currentTurn} synced — applied ${peerCommands.length} peer command sets`);

    // Advance the session turn counter
    this.session.advanceTurn();

    // Release the gate so TurnStartPhase can proceed
    this.release();
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
