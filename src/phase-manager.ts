// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";
import type { VictoryPhase } from "#app/phases/victory-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { MoveChargeAnim } from "#app/data/animations/move-charge-anim";
import type { DestinyBondTag } from "#app/data/battler-tags/destiny-bond-tag";
import type { GrudgeTag } from "#app/data/battler-tags/grudge-tag";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon-move";
import type { Phase } from "#app/phase";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { FaintPhase } from "#app/phases/faint-phase";
import { GameOverPhase } from "#app/phases/game-over-phase";
import { LoginPhase } from "#app/phases/login-phase";
import { MessagePhase } from "#app/phases/message-phase";
import { MoveAnimPhase } from "#app/phases/move-anim-phase";
import { MoveChargePhase } from "#app/phases/move-charge-phase";
import { MovePhase } from "#app/phases/move-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { SelectTargetPhase } from "#app/phases/select-target-phase";
import { TitlePhase } from "#app/phases/title-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";
import type { BattlerIndex } from "#enums/battler-index";
import type { ChargeAnim } from "#enums/charge-anim";
import type { MoveId } from "#enums/move-id";
import type { PhaseId } from "#enums/phase-id";

interface UseMoveInit {
  pokemon: Pokemon;
  targets: BattlerIndex[];
  move: PokemonMove | MoveId;
  /** Whether to add the {@linkcode MovePhase} to the front of the phase queue or defer it. */
  when: "eager" | "defer" | "before" | "after";
  phaseId?: PhaseId;
  followUp?: boolean;
  ignorePp?: boolean;
  reflected?: boolean;
  snatched?: boolean;
}

interface GameOverInit {
  isVictory?: boolean;
  clearPhaseQueue?: boolean;
}

interface ToTitleScreenInit {
  /** Whether to clear the phase queue before adding the {@linkcode TitlePhase}. */
  clearPhaseQueue?: boolean;
  /** Whether to add the {@linkcode TitlePhase} to the front of the phase queue or defer it. */
  eager?: boolean;
}

interface ToLoginScreenInit {
  /** Whether to show text. @default true */
  showText?: boolean;
  /** Whether to add the {@linkcode LoginPhase} to the front of the phase queue or defer it. */
  eager?: boolean;
}

interface PokemonFaintInit {
  preventEndure?: boolean;
  destinyTag?: DestinyBondTag | null;
  grudgeTag?: GrudgeTag | null;
  source?: Pokemon;
}

/**
 * This is responsible for managing the game's {@linkcode Phase | phases}.
 */
export class PhaseManager {
  /** dequeue/remove the first element to get the next phase */
  private phaseQueue: Phase[] = [];
  /** A temporary storage of what will be added to the front of {@linkcode phaseQueue} */
  private phaseQueuePrepend: Phase[] = [];
  /** overrides default of inserting phases to end of phaseQueuePrepend array, useful for inserting Phases "out of order" */
  private phaseQueuePrependSpliceIndex: number = -1;
  private conditionalQueue: Array<[() => boolean, Phase]> = [];
  private nextCommandPhaseQueue: Phase[] = [];

  private currentPhase: Phase | null = null;
  private standbyPhase: Phase | null = null;

  public getCurrentPhase<P extends Phase = Phase>(): P | null {
    return this.currentPhase as P;
  }

  public getStandbyPhase<P extends Phase = Phase>(): P | null {
    return this.standbyPhase as P;
  }

  /**
   * Adds a phase to the conditional queue and ensures it is executed only when the specified condition is met.
   *
   * This method allows deferring the execution of a phase until certain conditions are met, which is useful for handling
   * situations like abilities and entry hazards that depend on specific game states.
   *
   * @param phase - The {@linkcode Phase} to be added to the conditional queue.
   * @param condition - A function that returns a boolean indicating whether the phase should be executed.
   * @todo conditional queue in general should be deprecated, see {@link https://github.com/Despair-Games/poketernity/pull/910#discussion_r2029764830}
   *
   */
  public pushConditionalPhase(phase: Phase, condition: () => boolean): void {
    this.conditionalQueue.push([condition, phase]);
  }

  /**
   * Queues a phase to be run at a future point in time.
   * @param phase - The {@linkcode Phase} to add
   * @param defer - If `false`, adds the phase to `phaseQueue`. If `true`, adds the phase to `nextCommandPhaseQueue`. Default `false`.
   * @todo replace with a factory function for Phases based on `PhaseId`, ex: `public pushPhase<P extends Phase>(phase: PhaseId, ...params: ConstructorParameters<P>)`
   */
  public pushPhase(phase: Phase, defer: boolean = false): void {
    (!defer ? this.phaseQueue : this.nextCommandPhaseQueue).push(phase);
  }

  /**
   * Adds a phase to the end of {@linkcode phaseQueuePrepend},
   * or at {@linkcode phaseQueuePrependSpliceIndex} if it's set.
   * @param phase - The {@linkcode Phase} to add
   */
  public unshiftPhase(phase: Phase): void {
    if (this.phaseQueuePrependSpliceIndex === -1) {
      this.phaseQueuePrepend.push(phase);
    } else {
      this.phaseQueuePrepend.splice(this.phaseQueuePrependSpliceIndex, 0, phase);
    }
  }

  /**
   * Clears the {@linkcode phaseQueue}, but does not clear any other phase-related stuff.
   *
   * @todo Should this function be replaced by {@linkcode clearAllPhases}?
   */
  clearPhaseQueue(): void {
    this.phaseQueue.splice(0, this.phaseQueue.length);
  }

  /**
   * Clears all phase-related stuff, including all phase queues, the current and standby phases, and a splice index.
   */
  public clearAllPhases(): void {
    for (const queue of [this.phaseQueue, this.phaseQueuePrepend, this.conditionalQueue, this.nextCommandPhaseQueue]) {
      queue.splice(0, queue.length);
    }
    this.currentPhase = null;
    this.standbyPhase = null;
    this.clearPhaseQueueSplice();
  }

  /**
   * Used by {@linkcode unshiftPhase} and sets the index to start inserting at current length instead of the end of the array.
   * Useful if {@linkcode phaseQueuePrepend} contains many phases.
   */
  setPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = this.phaseQueuePrepend.length;
  }

  /**
   * Resets {@linkcode phaseQueuePrependSpliceIndex} to `-1`,
   * meaning that calls to {@linkcode unshiftPhase} will insert at end of {@linkcode phaseQueuePrepend}
   */
  public clearPhaseQueueSplice(): void {
    this.phaseQueuePrependSpliceIndex = -1;
  }

  /**
   * Called by each Phase's `end()` method by default.
   * Does the following:
   * - If there is an existing {@linkcode standbyPhase}, set {@linkcode currentPhase} to `standbyPhase`
   *     and set `standbyPhase` to `null`, then `return`
   * - Calls {@linkcode clearPhaseQueueSplice} and dumps everything from
   *     {@linkcode phaseQueuePrepend} to the start of of {@linkcode phaseQueue}
   * - Calls {@linkcode populatePhaseQueue}
   * - Checks the {@linkcode conditionalQueue | conditional phase queue}
   * - Remove the first phase from the queue and run its `start()` method.
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

    while (this.phaseQueuePrepend.length) {
      const poppedPhase = this.phaseQueuePrepend.pop();
      if (poppedPhase) {
        this.phaseQueue.unshift(poppedPhase);
      }
    }

    if (!this.phaseQueue.length) {
      this.populatePhaseQueue();
      // Clear the conditionalQueue if there are no phases left in the phaseQueue
      this.conditionalQueue = [];
    }

    this.currentPhase = this.phaseQueue.shift() ?? null;

    // Check if there are any conditional phases queued
    if (this.conditionalQueue?.length) {
      // Retrieve the first conditional phase from the queue
      const conditionalPhase = this.conditionalQueue.shift();
      // Evaluate the condition associated with the phase
      if (conditionalPhase?.[0]()) {
        // If the condition is met, add the phase to the phase queue
        this.pushPhase(conditionalPhase[1]);
      } else if (conditionalPhase) {
        // If the condition is not met, re-add the phase back to the front of the conditional queue
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
   * @param phaseFilter - Filter function to find the wanted phase
   * @returns the found phase or `undefined` if none is found
   */
  public findPhase<P extends Phase = Phase>(phaseFilter: (phase: P) => boolean): P | undefined {
    return this.phaseQueue.find(phaseFilter) as P;
  }

  /**
   * Checks if the phase queue contains a phase that matches the filter function
   *
   * @param phaseFilter - Filter function to find the wanted phase
   * @returns `true` if the phase exists, `false` otherwise
   */
  public hasPhase<P extends Phase = Phase>(phaseFilter: (phase: P) => boolean): boolean {
    return this.phaseQueue.some(phaseFilter);
  }

  /**
   * @todo this is unused, may be removed?
   */
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
   * @param phaseFilter - The filter function to find the desired phase
   * @todo This is currently unused. It should probably be merged into {@linkcode tryRemovePhase}
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
   * Tries to add the input phase to the index before the target phase in the {@linkcode phaseQueue},
   * otherwise it calls {@linkcode unshiftPhase} instead
   * @param phase - The {@linkcode Phase} to be added
   * @param targetPhaseId - The {@linkcode PhaseId | id} of the phase to search for in the {@linkcode phaseQueue}
   * @returns `true` if the phase was successfully added to the queue before the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public prependToPhase(phase: Phase, targetPhaseId: PhaseId): boolean {
    const targetIndex = this.phaseQueue.findIndex(({ id }) => id === targetPhaseId);

    if (targetIndex !== -1) {
      this.phaseQueue.splice(targetIndex, 0, phase);
      return true;
    } else {
      this.unshiftPhase(phase);
      return false;
    }
  }

  /**
   * Tries to add the input phase to the index after the target phase in the {@linkcode phaseQueue},
   * otherwise it calls {@linkcode unshiftPhase} instead
   * @param phase - The {@linkcode Phase} to be added
   * @param targetPhaseId - The {@linkcode PhaseId | id} of the phase to search for in the {@linkcode phaseQueue}
   * @returns `true` if the phase was successfully added to the queue after the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public appendToPhase(phase: Phase, targetPhaseId: PhaseId): boolean {
    const targetIndex = this.phaseQueue.findIndex(({ id }) => id === targetPhaseId);

    if (targetIndex !== -1 && this.phaseQueue.length > targetIndex) {
      this.phaseQueue.splice(targetIndex + 1, 0, phase);
      return true;
    } else {
      this.unshiftPhase(phase);
      return false;
    }
  }

  /**
   * Moves everything from the {@linkcode nextCommandPhaseQueue} to the {@linkcode phaseQueue} (keeping order)
   */
  public populatePhaseQueue(): void {
    if (this.nextCommandPhaseQueue.length) {
      this.phaseQueue.push(...this.nextCommandPhaseQueue);
      this.nextCommandPhaseQueue.splice(0, this.nextCommandPhaseQueue.length);
    }
    this.phaseQueue.push(new TurnInitPhase());
  }

  /**
   * Adds a {@linkcode MessagePhase}, either to {@linkcode phaseQueuePrepend} or {@linkcode phaseQueue}
   * @param message - The message to display (passed to `MessagePhase`)
   * @param callbackDelay - (Optional) (passed to `MessagePhase`)
   * @param prompt - (Optional) (passed to `MessagePhase`)
   * @param promptDelay - (Optional) (passed to `MessagePhase`)
   * @param defer - (Optional, default `false`)
   *   Whether to use {@linkcode unshiftPhase} (`false`) or {@linkcode pushPhase} (`true`)
   */
  public queueMessagePhase(
    message: string,
    callbackDelay?: number | null,
    prompt?: boolean | null,
    promptDelay?: number | null,
    defer: boolean = false,
  ) {
    const phase = new MessagePhase(message, callbackDelay, prompt, promptDelay);
    if (!defer) {
      this.unshiftPhase(phase);
    } else {
      this.pushPhase(phase);
    }
  }

  /**
   * Queues a new {@linkcode PokemonHealPhase} for the given {@linkcode BattlerIndex}.
   * @param eager - Whether to add the {@linkcode PokemonHealPhase} to the front of the phase queue or defer it
   * @param battlerIndex - The {@linkcode BattlerIndex} of the pokemon to heal
   * @param hpHealed - The amount of HP to heal
   * @param params_2 - The various {@linkcode PokemonHealPhaseOptions | optional parameters} of `PokemonHealPhase`
   */
  public queuePokemonHealPhase(eager: boolean, ...params: ConstructorParameters<typeof PokemonHealPhase>) {
    const pokemonHealPhase = new PokemonHealPhase(...params);

    if (eager) {
      this.unshiftPhase(pokemonHealPhase);
    } else {
      this.pushPhase(pokemonHealPhase, true);
    }
  }

  /**
   * Adds a new {@linkcode MoveChargePhase} to the phase queue.
   * @param battlerIndex - The user's {@linkcode BattlerIndex}
   * @param targets - Array of target `BattlerIndex`es
   * @param move - The {@linkcode PokemonMove} being used
   */
  public queueMoveChargePhase(battlerIndex: BattlerIndex, targets: BattlerIndex[], move: PokemonMove): void {
    this.unshiftPhase(new MoveChargePhase(battlerIndex, targets, move));
  }

  /**
   * Inserts a new {@linkcode SelectTargetPhase} to the phase queue.
   * @param battlerIndex - The selected target's {@linkcode BattlerIndex}
   */
  public queueSelectTargetPhase(battlerIndex: BattlerIndex): void {
    this.unshiftPhase(new SelectTargetPhase(battlerIndex));
  }

  /**
   * Adds a new {@linkcode MoveAnimPhase} to the phase queue.
   * @param chargeAnim - The {@linkcode ChargeAnim} to be used
   * @param moveId - The {@linkcode MoveId} to be used
   * @param user - The {@linkcode Pokemon} using the move
   */
  public queueMoveAnimPhase(chargeAnim: ChargeAnim, moveId: MoveId, user: Pokemon): void {
    this.unshiftPhase(new MoveAnimPhase(new MoveChargeAnim(chargeAnim, moveId, user)));
  }

  /**
   * Unshifts a new {@linkcode FaintPhase} for the given {@linkcode BattlerIndex} to faint.
   *
   * @param battlerIndex - The {@linkcode BattlerIndex} to faint
   * @param preventEndure - (Optional, default `false`) Whether or not enduring (Reviver Seed) should be prevented
   * @param destinyTag - (Optional) Destiny Bond tag belonging to the currently fainting Pokemon, if applicable
   * @param grudgeTag - (Optional) Grudge tag belonging to the currently fainting Pokemon, if applicable
   * @param source - (Optional) The source {@linkcode Pokemon} that dealt fatal damage
   *
   * **Regarding {@linkcode setPhaseQueueSplice} call:**\
   * _When adding the `FaintPhase`, want to toggle future {@linkcode unshiftPhase} and {@linkcode queueMessagePhase} calls
   * to appear before the `FaintPhase` as `FaintPhase` will potentially end the encounter (and add Phases such as
   * {@linkcode GameOverPhase}, {@linkcode VictoryPhase}, etc that will interfere
   * with anything else that happens during this {@linkcode MoveEffectPhase}).
   * Once the `MoveEffectPhase` is over (and calls it's `.end()` method),
   * {@linkcode shiftPhase} will reset the {@linkcode phaseQueuePrependSpliceIndex} via {@linkcode clearPhaseQueueSplice}_
   */
  public queueBattlerFaintPhase(
    battlerIndex: BattlerIndex,
    { preventEndure = false, destinyTag = null, grudgeTag = null, source }: PokemonFaintInit,
  ): void {
    this.setPhaseQueueSplice();
    this.unshiftPhase(new FaintPhase(battlerIndex, preventEndure, destinyTag, grudgeTag, source));
  }

  public queueMovePhase({
    pokemon,
    targets,
    move,
    followUp = false,
    ignorePp = false,
    reflected = false,
    snatched = false,
    when,
    phaseId,
  }: UseMoveInit) {
    const movePhase = new MovePhase(pokemon, targets, move, followUp, ignorePp, reflected, snatched);

    if ((when === "before" || when === "after") && !phaseId) {
      throw new Error("phaseId is required for useMove.when === 'before' or 'after'");
    }

    switch (when) {
      case "eager":
        this.unshiftPhase(movePhase);
        break;
      case "defer":
        this.pushPhase(movePhase);
        break;
      case "before":
        this.prependToPhase(movePhase, phaseId!);
        break;
      case "after":
        this.appendToPhase(movePhase, phaseId!);
        break;
      default:
        throw new Error(`Unknown useMove.when: ${when}`);
    }
  }

  /**
   * Ends the current battle and starts a new one.
   * @param isVictory - Whether the player won the battle
   */
  public queueNextBattle(isVictory: boolean): void {
    this.pushPhase(new BattleEndPhase(isVictory));
    this.pushPhase(new NewBattlePhase());
  }

  /**
   * Ends the game.
   * @param isVictory - (Optional) Whether the player won the game
   * @param clearPhaseQueue - (Optional) Whether to clear the phase queue
   */
  public queueGameOverPhase({ isVictory, clearPhaseQueue }: GameOverInit = {}): void {
    if (clearPhaseQueue) {
      this.clearPhaseQueue();
    }
    this.pushPhase(new GameOverPhase(isVictory));
  }

  /**
   * @param eager - (Optional) `true` to use {@linkcode unshiftPhase}, `false` for {@linkcode pushPhase}
   * @param clearPhaseQueue - (Optional) `true` to clear the phase queue
   */
  public toTitleScreen({ eager, clearPhaseQueue }: ToTitleScreenInit = {}): void {
    if (clearPhaseQueue) {
      this.clearPhaseQueue();
    }

    if (eager) {
      this.unshiftPhase(new TitlePhase());
    } else {
      this.pushPhase(new TitlePhase());
    }
  }

  /**
   * @param eager - (Optional) `true` to use {@linkcode unshiftPhase}, `false` for {@linkcode pushPhase}
   * @param showText - (Optional, default `true`) Whether to show text
   */
  public toLoginScreen({ eager, showText = true }: ToLoginScreenInit = {}): void {
    const loginPhase = new LoginPhase(showText);

    if (eager) {
      this.unshiftPhase(loginPhase);
    } else {
      this.pushPhase(loginPhase);
    }
  }
}
