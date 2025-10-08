import type { PhaseConditionFunc, PhaseKey } from "#app/@types/phase-types";
import type { Phase } from "#app/phase";
import { PokemonPhasePriorityQueue } from "#app/queues/pokemon-phase-priority-queue";
import type { ShuffledPriorityQueue } from "#app/queues/shuffled-priority-queue";
import type { PokemonPhase } from "#phases/base/pokemon-phase";

/**
 * The {@linkcode PhaseKey | PhaseKeys} of Phases that are *always* scheduled
 * dynamically
 * @todo Add dynamic scheduling support for `StatStageChangePhase`
 */
export const dynamicPhaseKeys: readonly PhaseKey[] = ["ObtainStatusEffectPhase", "PostSummonPhase"] as const;

/**
 * The dynamic queue manager holds priority queues for phases which are queued as dynamic.
 *
 * Dynamic phases are generally those which hold a pokemon and are unshifted, not pushed. \
 * Queues work by sorting their entries in speed order (and possibly with more complex ordering) before each time a phase is popped.
 */
export class DynamicPhaseManager {
  /** Maps phase types to their corresponding queues */
  private readonly dynamicPhaseMap: Map<PhaseKey, ShuffledPriorityQueue<Phase>> = new Map();

  /** Removes all phases from the manager */
  public clearQueues(): void {
    for (const queue of this.dynamicPhaseMap.values()) {
      queue.clear();
    }
  }

  /**
   * Adds a new phase to the manager and creates the priority queue for it if one does not exist.
   * @param phase - The {@linkcode Phase} to add
   * @returns `true` if the phase was added, or `false` if it is not dynamic
   */
  public add<T extends PokemonPhase>(phase: T): boolean {
    if (!dynamicPhaseKeys.includes(phase.phaseName)) {
      console.warn(`DynamicPhaseManager: ${phase.phaseName} is not dynamic!`);
      return false;
    }
    if (!this.dynamicPhaseMap.has(phase.phaseName)) {
      this.dynamicPhaseMap.set(
        phase.phaseName,
        new PokemonPhasePriorityQueue() as unknown as ShuffledPriorityQueue<Phase>,
      );
    }
    this.dynamicPhaseMap.get(phase.phaseName)?.push(phase);
    return true;
  }

  /**
   * Returns the highest-priority (generally by speed) Phase of the specified type
   * @param phaseType - The {@linkcode PhaseKey | type} to pop
   * @returns The popped {@linkcode Phase}, or `undefined` if none of the specified type exist
   */
  public popNextPhase(phaseType: PhaseKey): Phase | undefined {
    return this.dynamicPhaseMap.get(phaseType)?.pop();
  }

  /**
   * Determines if there is a queued dynamic {@linkcode Phase} meeting the conditions
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param condition - A {@linkcode PhaseConditionFunc} to add conditions to the search
   * @returns Whether a matching phase exists
   */
  public has<T extends PhaseKey>(phaseType: T, condition: PhaseConditionFunc<T>): boolean {
    return !!this.dynamicPhaseMap.get(phaseType)?.has(condition as (t: Phase) => boolean);
  }

  /**
   * Finds and removes a single queued {@linkcode Phase}
   * @param phaseType - The {@linkcode PhaseKey | type} of phase to search for
   * @param phaseFilter - A {@linkcode PhaseConditionFunc} to specify conditions for the phase
   * @returns Whether a removal occurred
   */
  public remove<T extends PhaseKey>(phaseType: T, condition: PhaseConditionFunc<T>): boolean {
    return !!this.dynamicPhaseMap.get(phaseType)?.remove(condition as (t: Phase) => boolean);
  }
}
