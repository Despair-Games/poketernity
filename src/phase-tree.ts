// biome-ignore lint/correctness/noUnusedImports: suppression needed until Biome 2.3.8 update PR is merged
import type { DynamicPhaseManager } from "#app/dynamic-phase-manager";
import type { Phase } from "#app/phase";
// biome-ignore lint/correctness/noUnusedImports: suppression needed until Biome 2.3.8 update PR is merged
import type { PhaseConditionFunc, PhaseKey, PhaseManager, PhaseMap } from "#types/phase-types";
import type { NonEmptyArray } from "#types/utility-types";

/**
 * Type representing the stubs used for dynamically scheduled {@linkcode Phase | Phases}.
 * The {@linkcode PhaseManager} defers to its {@linkcode DynamicPhaseManager}
 * to schedule a dynamic Phase upon receiving this from its Tree.
 */
export type DynamicPhaseMarker = {
  phaseType: PhaseKey;
};

/**
 * The Phase Tree accepts both {@linkcode Phase}s and {@linkcode DynamicPhaseMarker}s as entries. \
 * When the {@linkcode PhaseManager} receives a Phase from its Tree, it runs the Phase immediately. \
 * When it receives a `DynamicPhaseMarker`, it retrieves a matching Phase from its
 * {@linkcode DynamicPhaseManager} and runs that Phase.
 */
export type PhaseEntry = Phase | DynamicPhaseMarker;
export type PhaseEntryInput = NonEmptyArray<PhaseEntry>;

/**
 * The PhaseTree is the central storage location for {@linkcode Phase}s by the {@linkcode PhaseManager}.
 *
 * It has a tiered structure, where unshifted phases are added one level above the currently running Phase. Phases are generally popped from the Tree in FIFO order.
 *
 * Dynamically ordered phases are queued into the Tree only as {@linkcode DynamicPhaseMarker | Marker}s and as such are not guaranteed to run FIFO (otherwise, they would not be dynamic)
 */
export class PhaseTree {
  /** Storage for all levels in the tree. This is a simple 2-D array because only one Phase may have "children" at a time. */
  private levels: PhaseEntry[][] = [[]];
  /**
   * True if an "unshifted" level exists for the current cycle.
   * @see {@linkcode unshift}
   *
   * @remarks
   * A "cycle" may be defined as the interval between {@linkcode getNextEntry} calls, which is
   * roughly analogous to the runtime of a single Phase.
   */
  private unshifted = false;
  /**
   * True if a "deferred" level exists for the current cycle.
   * @see {@linkcode defer}
   *
   * @remarks
   * A "cycle" may be defined as the interval between {@linkcode getNextEntry} calls, which is
   * roughly analogous to the runtime of a single Phase.
   */
  private deferred = false;

  /**
   * @returns The last level in the tree. The {@linkcode PhaseManager}
   * always schedules Phases from this level first.
   */
  private get topLevel(): PhaseEntry[] {
    // Failsafe in case the root level of the tree was accidentally
    // removed prior to this call
    if (this.levels.length === 0) {
      this.levels.push([]);
    }
    return this.levels.at(-1)!;
  }

  /**
   * @returns Whether the input is a {@linkcode Phase} or a
   * {@linkcode DynamicPhaseMarker} based on whether it has a `start` method or not.
   */
  public isPhase(entry: PhaseEntry): entry is Phase {
    return typeof entry["start"] === "function";
  }

  /**
   * Adds one or more {@linkcode PhaseEntries} to the specified level
   * @param level - The numeric level to add the given entries.
   * @param entries - The {@linkcode PhaseEntry | PhaseEntries} to add
   * @throws Error if `level` is out of legal bounds
   */
  private addToLevel(level: number, ...entries: PhaseEntryInput): void {
    if (this.levels[level] == null) {
      throw new Error(`Attempted to add a phase or marker to a nonexistent level of the PhaseTree!\nLevel: ${level}`);
    }
    this.levels[level].push(...entries);
  }

  /**
   * Pushes one or more {@linkcode PhaseEntry}s to the root level of the queue. \
   * They will run only after all previously queued phases have been executed.
   * @param entries - The {@linkcode PhaseEntry}s to be added
   */
  public push(...entries: PhaseEntryInput): void {
    this.addToLevel(0, ...entries);
  }

  /**
   * Used by the {@linkcode PhaseManager} to add phases to the Tree
   * @param entries - The {@linkcode PhaseEntry | PhaseEntries} to add
   */
  public unshift(...entries: PhaseEntryInput): void {
    if (!this.unshifted) {
      this.unshifted = true;
      this.levels.push([]);
    }
    this.topLevel.push(...entries);
  }

  /**
   * Adds one or more `PhaseEntries` to the Tree,
   * deferring them to execute only after unshifted Phases are exhausted.
   * @param entries - The {@linkcode PhaseEntry | PhaseEntries} to add and defer
   *
   * @privateRemarks
   * Deferral is implemented by moving the queue at {@linkcode topLevel} up one level and inserting the new phase below it. \
   * Then {@linkcode deferred} is set until a Phase is shifted from the tree.
   *
   * If `deferred` is `true` when a deferred phase is added, the phase will be pushed to the second-highest level queue. \
   * That is, it will execute after the originally deferred phase, but there is no possibility for nesting with deferral.
   */
  public defer(...entries: PhaseEntryInput): void {
    if (!this.unshifted) {
      this.unshifted = true;
      this.levels.push([]);
    }
    if (!this.deferred) {
      this.deferred = true;
      this.levels.splice(-1, 0, []);
    }
    this.addToLevel(this.levels.length - 2, ...entries);
  }

  /**
   * Helper method to prepend or append phase(s) to another phase.
   * @param after - Whether to add the phase after or before the target phase
   * @param phaseType - The {@linkcode PhaseKey | type of phase} to search for
   * @param entries - The {@linkcode PhaseEntry | phase(s)} to be added
   */
  private addBeforeAfter(after: boolean, type: PhaseKey, ...entries: PhaseEntryInput): boolean {
    const indexOffset = after ? 1 : 0;
    for (let i = this.levels.length - 1; i >= 0; i--) {
      const insertIdx = this.levels[i].findIndex((p) => this.isPhase(p) && p.is(type)) + indexOffset;
      if (insertIdx !== -1 + indexOffset) {
        this.levels[i].splice(insertIdx, 0, ...entries);
        return true;
      }
    }
    this.unshift(...entries);
    return false;
  }

  /**
   * Adds a `PhaseEntry` before the first occurrence of the given type, or to the top of the Tree if no such phase exists
   * @param phaseType - The {@linkcode PhaseKey | type of phase} to search for
   * @param entries - The {@linkcode PhaseEntry | phase(s)} to be added
   * @todo Dynamic phase markers are not recognized as their internal phase type
   */
  public addBefore(phaseType: PhaseKey, ...entries: PhaseEntryInput): boolean {
    return this.addBeforeAfter(false, phaseType, ...entries);
  }

  /**
   * Adds a `PhaseEntry` after the first occurrence of the given type, or to the top of the Tree if no such phase exists
   * @param phaseType - The {@linkcode PhaseKey | type of phase} to search for
   * @param entries - The {@linkcode PhaseEntry | phase(s)} to be added
   * @todo Dynamic phase markers are not recognized as their internal phase type
   */
  public addAfter(phaseType: PhaseKey, ...entries: PhaseEntryInput): boolean {
    return this.addBeforeAfter(true, phaseType, ...entries);
  }

  /**
   * Removes and returns the first {@linkcode PhaseEntry} from the topmost level of the tree
   * @returns The next {@linkcode PhaseEntry}, or `undefined` if the Tree is empty
   */
  public getNextEntry(): PhaseEntry | undefined {
    this.unshifted = false;
    this.deferred = false;

    while (this.levels.length > 1 && this.topLevel.length === 0) {
      this.levels.pop();
    }

    return this.topLevel.shift();
  }

  /**
   * Finds a particular `Phase` in the Tree by searching in pop order
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - (Optional) A {@linkcode PhaseConditionFunc} to specify conditions for the phase
   * @returns The matching {@linkcode Phase}, or `undefined` if none exists
   */
  public find<P extends PhaseKey>(
    phaseType: P,
    phaseFilter: PhaseConditionFunc<P> = () => true,
  ): PhaseMap[P] | undefined {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      const level = this.levels[i];
      const phase = level.find((p): p is PhaseMap[P] => this.isPhase(p) && p.is(phaseType) && phaseFilter(p));
      if (phase) {
        return phase;
      }
    }
  }

  /**
   * Finds all Phases in the Tree that are of the given
   * phase type and meet the condition (if one is given)
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - (Optional) A {@linkcode PhaseConditionFunc} to specify conditions for the phase
   * @returns The matching {@linkcode Phase}s in pop order, or `undefined` if none exist
   */
  public findAll<P extends PhaseKey>(phaseType: P, phaseFilter: PhaseConditionFunc<P> = () => true): PhaseMap[P][] {
    const phases: PhaseMap[P][] = [];
    for (let i = this.levels.length - 1; i >= 0; i--) {
      const level = this.levels[i];
      const levelPhases = level.filter((p): p is PhaseMap[P] => this.isPhase(p) && p.is(phaseType) && phaseFilter(p));
      phases.push(...levelPhases);
    }
    return phases;
  }

  /** Clears the Tree of all Phases. */
  public clear() {
    this.levels = [[]];
  }

  /**
   * Finds and removes a single {@linkcode Phase} from the Tree
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - (Optional) A {@linkcode PhaseConditionFunc} to specify conditions for the phase
   * @returns Whether a removal occurred
   */
  public remove<P extends PhaseKey>(phaseType: P, phaseFilter: PhaseConditionFunc<P> = () => true): boolean {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      const level = this.levels[i];
      const phaseIndex = level.findIndex((p) => this.isPhase(p) && p.is(phaseType) && phaseFilter(p));
      if (phaseIndex !== -1) {
        level.splice(phaseIndex, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Removes all occurrences of {@linkcode Phase}s of the given type
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   */
  public removeAll(phaseType: PhaseKey): void {
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i].filter((p) => this.isPhase(p) && !p.is(phaseType));
      this.levels[i] = level;
    }
  }

  /**
   * Determines if a particular phase exists in the Tree
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - (Optional) A {@linkcode PhaseConditionFunc} to specify conditions for the phase
   * @returns Whether a matching phase exists
   */
  public has<P extends PhaseKey>(phaseType: P, phaseFilter: PhaseConditionFunc<P> = () => true): boolean {
    for (const level of this.levels) {
      for (const entry of level) {
        if (this.isPhase(entry) && entry.is(phaseType) && phaseFilter(entry)) {
          return true;
        }
      }
    }
    return false;
  }
}
