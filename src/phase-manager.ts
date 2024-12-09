import {
  type SpeciesFormChangeTrigger,
  pokemonFormChanges,
  type SpeciesFormChange,
  FormChangeItem,
} from "#app/data/pokemon-forms";
import type { PokemonAnimType } from "#enums/pokemon-anim-type";
import { Species } from "#enums/species";
import type Pokemon from "#app/field/pokemon";
import { PlayerPokemon } from "#app/field/pokemon";
import { PokemonFormChangeItemModifier } from "#app/modifier/modifier";
import type { Phase } from "#app/phase";
import { FormChangePhase } from "#app/phases/form-change-phase";
import { MessagePhase } from "#app/phases/message-phase";
import { PokemonAnimPhase } from "#app/phases/pokemon-anim-phase";
import { QuietFormChangePhase } from "#app/phases/quiet-form-change-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";
import type { Constructor } from "#app/utils";

export class PhaseManager {
  /** PhaseQueue: dequeue/remove the first element to get the next phase */
  public readonly phaseQueue: Phase[] = [];
  public readonly conditionalQueue: Array<[() => boolean, Phase]> = [];
  /** PhaseQueuePrepend: is a temp storage of what will be added to PhaseQueue */
  private phaseQueuePrepend: Phase[] = [];

  /** overrides default of inserting phases to end of phaseQueuePrepend array, useful for inserting Phases "out of order" */
  private phaseQueuePrependSpliceIndex: number = -1;
  private nextCommandPhaseQueue: Phase[] = [];

  private currentPhase: Phase | null = null;
  private standbyPhase: Phase | null = null;
  constructor() {}

  getCurrentPhase(): Phase | null {
    return this.currentPhase;
  }

  getStandbyPhase(): Phase | null {
    return this.standbyPhase;
  }

  /**
   * Pushes the given Phase into the phase queue.
   * @param phase the {@linkcode Phase} to add
   * @param defer if `true`, this pushes to `nextCommandPhaseQueue` instead
   */
  public pushPhase(phase: Phase, defer: boolean = false): void {
    (!defer ? this.phaseQueue : this.nextCommandPhaseQueue).push(phase);
  }

  /**
   * Adds Phase to the end of phaseQueuePrepend, or at phaseQueuePrependSpliceIndex
   * @param phase {@linkcode Phase} the phase to add
   */
  public unshiftPhase(phase: Phase): void {
    if (this.phaseQueuePrependSpliceIndex === -1) {
      this.phaseQueuePrepend.push(phase);
    } else {
      this.phaseQueuePrepend.splice(this.phaseQueuePrependSpliceIndex, 0, phase);
    }
  }

  /**
   * Adds a phase to the conditional queue and ensures it is executed only when the specified condition is met.
   *
   * This method allows deferring the execution of a phase until certain conditions are met, which is useful for handling
   * situations like abilities and entry hazards that depend on specific game states.
   *
   * @param phase - The {@linkcode Phase} to be added to the conditional queue.
   * @param condition - A function that returns a boolean indicating whether the phase should be executed.
   *
   */
  public pushConditionalPhase(phase: Phase, condition: () => boolean): void {
    this.conditionalQueue.push([condition, phase]);
  }

  /** Clears the phase queue */
  public clearPhaseQueue(): void {
    this.phaseQueue.splice(0, this.phaseQueue.length);
  }

  /** Clears the conditional phase queue */
  public clearConditionalPhaseQueue(): void {
    this.conditionalQueue.splice(0, this.conditionalQueue.length);
  }

  /**
   * Used by function unshiftPhase(), sets index to start inserting at current length instead of the end of the array, useful if phaseQueuePrepend gets longer with Phases
   */
  public setPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = this.phaseQueuePrepend.length;
  }

  /**
   * Resets phaseQueuePrependSpliceIndex to -1, implies that calls to unshiftPhase will insert at end of phaseQueuePrepend
   */
  public clearPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = -1;
  }

  /**
   * Is called by each Phase implementations "end()" by default
   * We dump everything from phaseQueuePrepend to the start of of phaseQueue
   * then removes first Phase and starts it
   */
  public shiftPhase(): void {
    if (this.standbyPhase) {
      this.currentPhase = this.standbyPhase;
      this.standbyPhase = null;
      return;
    }

    if (this.phaseQueuePrependSpliceIndex > -1) {
      this.clearPhaseQueueSplice();
    }
    if (this.phaseQueuePrepend.length) {
      while (this.phaseQueuePrepend.length) {
        const poppedPhase = this.phaseQueuePrepend.pop();
        if (poppedPhase) {
          this.phaseQueue.unshift(poppedPhase);
        }
      }
    }
    if (!this.phaseQueue.length) {
      this.populatePhaseQueue();
      this.clearConditionalPhaseQueue();
    }

    this.currentPhase = this.phaseQueue.shift() ?? null;

    if (this.conditionalQueue?.length) {
      const conditionalPhase = this.conditionalQueue.shift();
      // Evaluate the condition associated with the phase
      if (conditionalPhase?.[0]()) {
        this.pushPhase(conditionalPhase[1]);
      } else if (conditionalPhase) {
        this.conditionalQueue.unshift(conditionalPhase);
      } else {
        console.warn("condition phase is undefined/null!", conditionalPhase);
      }
    }

    if (this.currentPhase) {
      console.log(`%cStart Phase ${this.currentPhase.constructor.name}`, "color:green;");
      this.currentPhase.start();
    }
  }

  public overridePhase(phase: Phase): boolean {
    if (this.standbyPhase) {
      return false;
    }

    this.standbyPhase = this.currentPhase;
    this.currentPhase = phase;
    console.log(`%cStart Phase ${phase.constructor.name}`, "color:green;");
    phase.start();

    return true;
  }

  /**
   * Find a specific {@linkcode Phase} in the phase queue.
   *
   * @param phaseFilter filter function to use to find the wanted phase
   * @returns the found phase or undefined if none found
   */
  public findPhase<P extends Phase = Phase>(phaseFilter: (phase: P) => boolean): P | undefined {
    return this.phaseQueue.find(phaseFilter) as P;
  }

  public tryReplacePhase(phaseFilter: (phase: Phase) => boolean, phase: Phase): boolean {
    const phaseIndex = this.phaseQueue.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueue[phaseIndex] = phase;
      return true;
    }
    return false;
  }

  public tryRemovePhase(phaseFilter: (phase: Phase) => boolean): boolean {
    const phaseIndex = this.phaseQueue.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueue.splice(phaseIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * Will search for a specific phase in {@linkcode phaseQueuePrepend} via filter, and remove the first result if a match is found.
   * @param phaseFilter filter function
   */
  public tryRemoveUnshiftedPhase(phaseFilter: (phase: Phase) => boolean): boolean {
    const phaseIndex = this.phaseQueuePrepend.findIndex(phaseFilter);
    if (phaseIndex > -1) {
      this.phaseQueuePrepend.splice(phaseIndex, 1);
      return true;
    }
    return false;
  }

  /**
   * Tries to add the input phase to index before target phase in the phaseQueue, else simply calls unshiftPhase()
   * @param phase {@linkcode Phase} the phase to be added
   * @param targetPhase {@linkcode Phase} the type of phase to search for in phaseQueue
   * @returns boolean if a targetPhase was found and added
   */
  public prependToPhase(phase: Phase, targetPhase: Constructor<Phase>): boolean {
    const targetIndex = this.phaseQueue.findIndex((ph) => ph instanceof targetPhase);

    if (targetIndex !== -1) {
      this.phaseQueue.splice(targetIndex, 0, phase);
      return true;
    } else {
      this.unshiftPhase(phase);
      return false;
    }
  }

  /**
   * Tries to add the input phase to index after target phase in the {@linkcode phaseQueue}, else simply calls {@linkcode unshiftPhase()}
   * @param phase {@linkcode Phase} the phase to be added
   * @param targetPhase {@linkcode Phase} the type of phase to search for in {@linkcode phaseQueue}
   * @returns `true` if a `targetPhase` was found to append to
   */
  public appendToPhase(phase: Phase, targetPhase: Constructor<Phase>): boolean {
    const targetIndex = this.phaseQueue.findIndex((ph) => ph instanceof targetPhase);

    if (targetIndex !== -1 && this.phaseQueue.length > targetIndex) {
      this.phaseQueue.splice(targetIndex + 1, 0, phase);
      return true;
    } else {
      this.unshiftPhase(phase);
      return false;
    }
  }

  /**
   * Moves everything from nextCommandPhaseQueue to phaseQueue (keeping order)
   */
  private populatePhaseQueue(): void {
    if (this.nextCommandPhaseQueue.length) {
      this.phaseQueue.push(...this.nextCommandPhaseQueue);
      this.nextCommandPhaseQueue.splice(0, this.nextCommandPhaseQueue.length);
    }
    this.phaseQueue.push(new TurnInitPhase());
  }
}

export const phaseManager = new PhaseManager();

/**
 * Adds a MessagePhase, either to PhaseQueuePrepend or nextCommandPhaseQueue
 * @param message string for MessagePhase
 * @param callbackDelay optional param for MessagePhase constructor
 * @param prompt optional param for MessagePhase constructor
 * @param promptDelay optional param for MessagePhase constructor
 * @param defer boolean for which queue to add it to, false -> add to PhaseQueuePrepend, true -> nextCommandPhaseQueue
 */
export function queueMessage(
  message: string,
  callbackDelay?: integer | null,
  prompt?: boolean | null,
  promptDelay?: integer | null,
  defer?: boolean | null,
) {
  const phase = new MessagePhase(message, callbackDelay, prompt, promptDelay);
  if (!defer) {
    // adds to the end of PhaseQueuePrepend
    phaseManager.unshiftPhase(phase);
  } else {
    //remember that pushPhase adds it to nextCommandPhaseQueue
    phaseManager.pushPhase(phase);
  }
}

export function triggerPokemonFormChange(
  pokemon: Pokemon,
  formChangeTriggerType: Constructor<SpeciesFormChangeTrigger>,
  delayed: boolean = false,
  modal: boolean = false,
): boolean {
  if (pokemonFormChanges.hasOwnProperty(pokemon.species.speciesId)) {
    // in case this is NECROZMA, determine which forms this
    const matchingFormChangeOpts = pokemonFormChanges[pokemon.species.speciesId].filter(
      (fc) => fc.findTrigger(formChangeTriggerType) && fc.canChange(pokemon),
    );
    let matchingFormChange: SpeciesFormChange | null;
    if (pokemon.species.speciesId === Species.NECROZMA && matchingFormChangeOpts.length > 1) {
      // Ultra Necrozma is changing its form back, so we need to figure out into which form it devolves.
      const formChangeItemModifiers = (
        this.findModifiers(
          (m) => m instanceof PokemonFormChangeItemModifier && m.pokemonId === pokemon.id,
        ) as PokemonFormChangeItemModifier[]
      )
        .filter((m) => m.active)
        .map((m) => m.formChangeItem);

      matchingFormChange = formChangeItemModifiers.includes(FormChangeItem.N_LUNARIZER)
        ? matchingFormChangeOpts[0]
        : formChangeItemModifiers.includes(FormChangeItem.N_SOLARIZER)
          ? matchingFormChangeOpts[1]
          : null;
    } else {
      matchingFormChange = matchingFormChangeOpts[0];
    }
    if (matchingFormChange) {
      let phase: Phase;
      if (pokemon instanceof PlayerPokemon && !matchingFormChange.quiet) {
        phase = new FormChangePhase(pokemon, matchingFormChange, modal);
      } else {
        phase = new QuietFormChangePhase(pokemon, matchingFormChange);
      }
      if (pokemon instanceof PlayerPokemon && !matchingFormChange.quiet && modal) {
        phaseManager.overridePhase(phase);
      } else if (delayed) {
        phaseManager.pushPhase(phase);
      } else {
        phaseManager.unshiftPhase(phase);
      }
      return true;
    }
  }

  return false;
}

export function triggerPokemonBattleAnim(
  pokemon: Pokemon,
  battleAnimType: PokemonAnimType,
  fieldAssets?: Phaser.GameObjects.Sprite[],
  delayed: boolean = false,
): boolean {
  const phase: Phase = new PokemonAnimPhase(battleAnimType, pokemon, fieldAssets);
  if (delayed) {
    phaseManager.pushPhase(phase);
  } else {
    phaseManager.unshiftPhase(phase);
  }
  return true;
}
