import CryptoJS from "crypto-js";

/**
 * Tracks phase execution and produces per-turn hashes for desync detection.
 * Each phase's name and serialized arguments are appended to a running hash.
 * At turn boundaries, the hash is finalized and compared with the peer's hash.
 */
export class MpDesyncGuard {
  private _hashState: CryptoJS.lib.WordArray;
  private _phaseCount: number = 0;
  private readonly _turnHashes: Map<number, string> = new Map();

  constructor() {
    this._hashState = CryptoJS.SHA256("");
  }

  /**
   * Record a phase execution for the running hash.
   */
  recordPhase(phaseName: string, args?: Record<string, unknown>): void {
    const payload = args ? `${phaseName}:${JSON.stringify(args)}` : phaseName;
    this._hashState = CryptoJS.SHA256(this._hashState.toString() + payload);
    this._phaseCount++;
  }

  /**
   * Finalize the hash for the current turn and return it.
   */
  finalizeTurn(turnIndex: number): string {
    const hash = this._hashState.toString(CryptoJS.enc.Hex);
    this._turnHashes.set(turnIndex, hash);
    return hash;
  }

  /**
   * Get the hash for a specific turn.
   */
  getTurnHash(turnIndex: number): string | undefined {
    return this._turnHashes.get(turnIndex);
  }

  /**
   * Compare local hash with peer hash for a given turn.
   */
  checkDesync(turnIndex: number, peerHash: string): boolean {
    const localHash = this._turnHashes.get(turnIndex);
    return localHash !== undefined && localHash === peerHash;
  }

  /**
   * Reset the guard for a new run.
   */
  reset(): void {
    this._hashState = CryptoJS.SHA256("");
    this._phaseCount = 0;
    this._turnHashes.clear();
  }

  get phaseCount(): number {
    return this._phaseCount;
  }
}
