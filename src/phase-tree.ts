import type { DynamicPhaseKey } from "#app/dynamic-phase-manager";
import type { Phase } from "#app/phase";
import type { PhaseConditionFunc, PhaseKey, PhaseMap } from "#types/phase-types";

/**
 * Type representing the stubs used for dynamically scheduled {@linkcode Phase | Phases}.
 * The {@linkcode PhaseManager} defers to its {@linkcode DynamicPhaseManager}
 * to schedule a dynamic Phase upon receiving this from its Tree.
 */
type DynamicPhaseMarker = {
  phaseType: DynamicPhaseKey;
};

/**
 * The Phase Tree accepts both {@linkcode Phase | Phases} and {@linkcode DynamicPhaseMarker | DynamicPhaseMarkers} as entries.
 * When the {@linkcode PhaseManager} receives a Phase from its Tree, it runs the Phase immediately.
 * When it receives a DynamicPhaseMarker, it retrieves a matching Phase from its
 * {@linkcode DynamicPhaseManager} and runs that Phase.
 */
type PhaseEntry = Phase | DynamicPhaseMarker;

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
   * True if a "deferred" level exists
   * @see {@linkcode addPhase}
   */
  private deferredActive = false;

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

  private isPhase(entry: PhaseEntry): entry is Phase {
    return typeof entry["start"] === "function";
  }

  /**
   * Adds a {@linkcode PhaseEntry} to the specified level
   * @param entry - The entry to add
   * @param level - The numeric level to add the phase
   * @throws Error if `level` is out of legal bounds
   */
  private add(entry: PhaseEntry, level: number): void {
    const addLevel = this.levels[level];
    if (addLevel == null) {
      throw new Error(
        "Attempted to add a phase or marker to a nonexistent level of the PhaseTree!\nLevel: " + level.toString(),
      );
    }
    this.levels[level].push(entry);
  }

  /**
   * Used by the {@linkcode PhaseManager} to add phases to the Tree
   * @param entry - The {@linkcode PhaseEntry} to be added
   * @param defer - Whether to defer the execution of this phase by allowing subsequently-added phases to run before it
   *
   * @privateRemarks
   * Deferral is implemented by moving the queue at {@linkcode topLevel} up one level and inserting the new phase below it.
   * {@linkcode deferredActive} is set until the moved queue (and anything added to it) is exhausted.
   *
   * If {@linkcode deferredActive} is `true` when a deferred phase is added, the phase will be pushed to the second-highest level queue.
   * That is, it will execute after the originally deferred phase, but there is no possibility for nesting with deferral.
   *
   * @todo `setPhaseQueueSplice` had strange behavior. This is simpler, but there are probably some remnant edge cases with the current implementation
   */
  public addEntry(entry: PhaseEntry, defer: boolean = false): void {
    if (defer && !this.deferredActive) {
      this.deferredActive = true;
      this.levels.splice(-1, 0, []);
    }
    this.add(entry, this.levels.length - 1 - +defer);
  }

  /**
   * Adds a {@linkcode PhaseEntry} after the first occurence of the given type, or to the top of the Tree if no such phase exists
   * @param phase - The {@linkcode PhaseEntry} to be added
   * @param type - A {@linkcode PhaseKey} representing the type to search for
   * @todo Dynamic phase markers are not recognized as their internal phase type
   */
  public addAfter(entry: PhaseEntry, type: PhaseKey): void {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      const insertIdx = this.levels[i].findIndex((p) => this.isPhase(p) && p.is(type)) + 1;
      if (insertIdx !== 0) {
        this.levels[i].splice(insertIdx, 0, entry);
        return;
      }
    }

    this.addEntry(entry);
  }

  /**
   * Unshifts a {@linkcode PhaseEntry} to the current level.
   * This is effectively the same as if the phase were added immediately after the currently-running phase, before it started.
   * @param entry - The {@linkcode PhaseEntry} to be added
   */
  public unshiftToCurrent(entry: PhaseEntry): void {
    this.topLevel.unshift(entry);
  }

  /**
   * Pushes a {@linkcode PhaseEntry} to the root level of the queue. It will run only after all previously queued phases have been executed.
   * @param entry - The {@linkcode PhaseEntry} to be added
   */
  public pushPhase(entry: PhaseEntry): void {
    this.add(entry, 0);
  }

  /**
   * Removes and returns the first {@linkcode PhaseEntry} from the topmost level of the tree
   * @returns - The next {@linkcode PhaseEntry}, or `undefined` if the Tree is empty
   */
  public getNextPhase(): PhaseEntry | undefined {
    while (this.levels.length > 1 && this.topLevel.length === 0) {
      this.deferredActive = false;
      this.levels.pop();
    }

    return this.topLevel.shift();
  }

  /**
   * Finds a particular {@linkcode Phase} in the Tree by searching in pop order
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - A {@linkcode PhaseConditionFunc} to specify conditions for the phase
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
   * Finds all {@linkcode Phase | Phases} in the Tree that are of the given
   * phase type and meet the condition (if one is given)
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - A {@linkcode PhaseConditionFunc} to specify conditions for the phase
   * @returns The matching {@linkcode Phase | Phases} in pop order, or `undefined` if none exist
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

  /**
   * Clears the Tree
   * @param leaveFirstLevel - If `true`, leaves the top level of the tree intact
   *
   * @privateremarks
   * The parameter on this method exists because {@linkcode PhaseManager.clearPhaseQueue} previously (probably by mistake) ignored `phaseQueuePrepend`.
   *
   * This is (probably by mistake) relied upon by certain ME functions.
   */
  public clear(leaveFirstLevel = false) {
    this.levels = [leaveFirstLevel ? (this.levels.at(-1) ?? []) : []];
  }

  /**
   * Finds and removes a single {@linkcode Phase} from the Tree
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - A {@linkcode PhaseConditionFunc} to specify conditions for the phase
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
   * @param phaseFilter - A {@linkcode PhaseConditionFunc} to specify conditions for the phase
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
