import { eventBus } from "#app/event-bus";
import type { PeerCommandData, SubmitCommandRequest, TurnResolvedMessage } from "./mp-protocol";

export type CommandSyncStatus = "idle" | "waiting_for_peer" | "resolved" | "error";

/**
 * Synchronizes turn commands between local player and peer via SignalR.
 *
 * Flow:
 * 1. Local player submits commands → serialized and sent to server
 * 2. Wait for peer to submit commands
 * 3. Server resolves turn → sends both sets of commands
 * 4. Both clients apply peer commands and proceed
 */
export class MpCommandSync {
  private _status: CommandSyncStatus = "idle";
  private _pendingResolve: ((commands: PeerCommandData[]) => void) | null = null;
  private _pendingReject: ((reason: string) => void) | null = null;

  get status(): CommandSyncStatus {
    return this._status;
  }

  /**
   * Serialize and submit local commands, then wait for peer commands.
   * Returns the peer's commands once the turn is resolved.
   */
  async submitAndWaitForPeer(
    turnIndex: number,
    waveIndex: number,
    localCommandJson: string,
    stateHash: string,
  ): Promise<PeerCommandData[]> {
    this._status = "waiting_for_peer";

    const request: SubmitCommandRequest = {
      turnIndex,
      waveIndex,
      commandJson: localCommandJson,
      stateHash,
    };

    // Send to server via event bus (mp-client listens and forwards to SignalR)
    eventBus.emit("mp:submit-command" as any, request);

    // Wait for the turn to be resolved
    return new Promise<PeerCommandData[]>((resolve, reject) => {
      this._pendingResolve = resolve;
      this._pendingReject = reject;
    });
  }

  /**
   * Called when the server resolves a turn and sends back all peer commands.
   */
  onTurnResolved(msg: TurnResolvedMessage): void {
    if (this._pendingResolve) {
      this._status = "resolved";
      const resolve = this._pendingResolve;
      this._pendingResolve = null;
      this._pendingReject = null;
      resolve(msg.peerCommands);
    }
  }

  /**
   * Called on error (disconnect, desync, session end).
   */
  onError(reason: string): void {
    if (this._pendingReject) {
      this._status = "error";
      const reject = this._pendingReject;
      this._pendingResolve = null;
      this._pendingReject = null;
      reject(reason);
    }
  }

  reset(): void {
    this._status = "idle";
    if (this._pendingReject) {
      this._pendingReject("reset");
    }
    this._pendingResolve = null;
    this._pendingReject = null;
  }
}
