// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ChargeAnim } from "#enums/charge-anim";
import type { MoveEffectPhase } from "#phases/move-effect-phase";
import type { VictoryPhase } from "#phases/victory-phase";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { MoveChargeAnim } from "#animations/move-charge-anim";
import type { Phase } from "#app/phase";
import type { DestinyBondTag } from "#battler-tags/destiny-bond-tag";
import type { GrudgeTag } from "#battler-tags/grudge-tag";
import type { BattlerIndex } from "#enums/battler-index";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import type { MoveChargePhase } from "#phases/move-charge-phase";
import type { PokemonHealPhase } from "#phases/pokemon-heal-phase";
import type { SelectTargetPhase } from "#phases/select-target-phase";
import type { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import { type PhaseKey, PHASES, type PhaseConstructorMap, type PhaseMap } from "#phases/phases";

interface UseMoveInit {
  pokemon: Pokemon;
  targets: BattlerIndex[];
  move: PokemonMove | MoveId;
  /** Whether to add the {@linkcode MovePhase} to the front of the phase queue or defer it. */
  when: "eager" | "defer" | "before" | "after";
  targetPhaseKey?: PhaseKey;
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
  /** Whether to show text. @defaultValue `true` */
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
  /**
   * The main queue where {@linkcode Phase | Phases} are scheduled.
   * The first Phase in this queue is {@linkcode Phase.start | run} whenever
   * {@linkcode shiftPhase} is called.
   */
  private phaseQueue: Phase[] = [];
  /**
   * When {@linkcode shiftPhase} is called, the Phases in this queue are inserted
   * in queue order to the front of {@linkcode phaseQueue}.
   */
  private phaseQueuePrepend: Phase[] = [];
  /** overrides default of inserting phases to end of phaseQueuePrepend array, useful for inserting Phases "out of order" */
  private phaseQueuePrependSpliceIndex: number = -1;
  private conditionalQueue: [() => boolean, Phase][] = [];

  private currentPhase: Phase | null = null;
  /**
   * Stores an {@linkcode overridePhase | overridden} {@linkcode Phase}
   * to restart once the overriding Phase finishes running
   */
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
   * Constructs a phase from the given parameters.
   * @param phase - The {@linkcode PhaseKey} for the {@linkcode Phase} to construct, e.g. `"MovePhase"`
   * @param params - The inferred constructor parameters for the Phase specified
   * by {@linkcode phase}
   * @returns The newly constructed {@linkcode Phase}
   */
  public createPhase<P extends PhaseKey>(phase: P, ...params: PhaseConstructorMap[P]): InstanceType<PhaseMap[P]> {
    const PhaseClass = PHASES[phase];
    if (!PhaseClass) {
      throw new Error(`${phase} does not exist in PHASES!`);
    }

    // @ts-expect-error: Typescript does not support narrowing the type of operands in generic methods (see https://stackoverflow.com/a/72891234)
    return new PhaseClass(...params);
  }

  /**
   * Queues one or more phases to be run at a future point in time.
   * @param phase - The first {@linkcode Phase} to push to the {@link phaseQueue | main queue}.
   * @param otherPhases - Additional (optional) phases to queue. These phases are scheduled after {@linkcode phase} in array order.
   */
  public pushPhase(phase: Phase, ...otherPhases: Phase[]): void {
    this.phaseQueue.push(phase, ...otherPhases);
  }

  /**
   * Creates a {@linkcode Phase} from the given parameters, then pushes
   * that Phase to {@linkcode phaseQueue}. This is equivalent to calling
   * {@linkcode createPhase}, then {@linkcode pushPhase} for the created Phase.
   *
   * Note that this only supports pushing one Phase at a time. The best practice
   * to push multiple Phases at once is to construct each phase with {@linkcode createPhase}, e.g.
   *
   * ```
   * pushPhase(
   *   createPhase("MovePhase", ...),
   *   createPhase("MoveEffectPhase", ...),
   * );
   * ```
   * @param phase - The {@linkcode PhaseKey} for the {@linkcode Phase} to construct, e.g. `"MovePhase"`
   * @param params - The inferred constructor parameters for the Phase specified
   * by {@linkcode phase}
   */
  public createAndPushPhase<P extends PhaseKey>(phase: P, ...params: PhaseConstructorMap[P]): void {
    this.pushPhase(this.createPhase(phase, ...params));
  }

  /**
   * Adds one or more phases to the end of {@linkcode phaseQueuePrepend},
   * or at {@linkcode phaseQueuePrependSpliceIndex} if it's set.
   * @param phase - The first {@linkcode Phase} to push to {@linkcode phaseQueuePrepend}.
   * @param otherPhases - Additional (optional) phases to queue. These phases are scheduled after {@linkcode phase} in array order.
   */
  public unshiftPhase(phase: Phase, ...otherPhases: Phase[]): void {
    if (this.phaseQueuePrependSpliceIndex === -1) {
      this.phaseQueuePrepend.push(phase, ...otherPhases);
    } else {
      this.phaseQueuePrepend.splice(this.phaseQueuePrependSpliceIndex, 0, phase, ...otherPhases);
    }
  }

  /**
   * Creates a {@linkcode Phase} from the given parameters, then adds
   * that Phase to {@linkcode phaseQueuePrepend}. This is equivalent to calling
   * {@linkcode createPhase}, then {@linkcode unshiftPhase} for the created Phase.
   *
   * Note that this only supports unshifting one Phase at a time. The best practice
   * to push multiple Phases at once is to construct each phase with {@linkcode createPhase}, e.g.
   *
   * ```
   * unshiftPhase(
   *   createPhase("MovePhase", ...),
   *   createPhase("MoveEffectPhase", ...),
   * );
   * ```
   * @param phase - The {@linkcode PhaseKey} for the {@linkcode Phase} to construct, e.g. `"MovePhase"`
   * @param params - The inferred constructor parameters for the Phase specified
   * by {@linkcode phase}
   */
  public createAndUnshiftPhase<P extends PhaseKey>(phase: P, ...params: PhaseConstructorMap[P]): void {
    this.unshiftPhase(this.createPhase<P>(phase, ...params));
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
    for (const queue of [this.phaseQueue, this.phaseQueuePrepend, this.conditionalQueue]) {
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

  /**
   * Cancels the {@link currentPhase | current Phase} to run another {@linkcode Phase}.
   * The overridden Phase will restart after the overriding Phase finishes running.
   * If a Phase is already on {@link standbyPhase | standby}, this does nothing.
   * @param phase - The {@linkcode Phase} overriding the current Phase
   * @returns `true` if the overriding Phase
   */
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
   * @param checkPrepend - If `true`, also searches through {@linkcode phaseQueuePrepend} (i.e., unshifted phases). Default `false`.
   * @returns the found phase or `undefined` if none is found
   */
  public findPhase<P extends Phase = Phase>(
    phaseFilter: (phase: P) => boolean,
    checkPrepend: boolean = false,
  ): P | undefined {
    if (checkPrepend) {
      return (this.phaseQueuePrepend.find(phaseFilter) ?? this.phaseQueue.find(phaseFilter)) as P;
    }
    return this.phaseQueue.find(phaseFilter) as P;
  }

  /**
   * Checks if the phase queue contains a phase that matches the filter function
   *
   * @param phaseFilter - Filter function to find the wanted phase
   * @param checkPrepend - If `true`, also searches through {@linkcode phaseQueuePrepend} (i.e., unshifted phases). Default `false`.
   * @returns `true` if the phase exists, `false` otherwise
   */
  public hasPhase<P extends Phase = Phase>(phaseFilter: (phase: P) => boolean, checkPrepend: boolean = false): boolean {
    if (checkPrepend) {
      return this.phaseQueuePrepend.some(phaseFilter) || this.phaseQueue.some(phaseFilter);
    }
    return this.phaseQueue.some(phaseFilter);
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
   * @param targetPhaseKey - The {@linkcode PhaseKey} of the phase to search for in the {@linkcode phaseQueue}
   * @param phase - The {@linkcode Phase} to be added
   * @param otherPhases - Additional (optional) Phases to add. These Phases are scheduled after {@linkcode phase} in array order
   * @returns `true` if the phase was successfully added to the queue before the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public prependToPhase(targetPhaseKey: PhaseKey, phase: Phase, ...otherPhases: Phase[]): boolean {
    const targetIndex = this.phaseQueue.findIndex((phase) => phase.is(targetPhaseKey));

    if (targetIndex !== -1) {
      this.phaseQueue.splice(targetIndex, 0, phase, ...otherPhases);
      return true;
    }
    this.unshiftPhase(phase, ...otherPhases);
    return false;
  }

  /**
   * Creates a {@linkcode Phase} from the given parameters, then prepends it to the first Phase
   * in {@linkcode phaseQueue} of the given key.
   * @param targetPhaseKey - The {@linkcode PhaseKey} of the Phase on which the created Phase is prepended
   * @param phase - The {@linkcode PhaseKey} of the Phase to create and add
   * @param params - The inferred constructor parameters according to {@linkcode phase}
   */
  public createAndPrependPhase<P extends PhaseKey>(
    targetPhaseKey: PhaseKey,
    phase: P,
    ...params: PhaseConstructorMap[P]
  ): boolean {
    return this.prependToPhase(targetPhaseKey, this.createPhase(phase, ...params));
  }

  /**
   * Tries to add the input phase to the index after the target phase in the {@linkcode phaseQueue},
   * otherwise it calls {@linkcode unshiftPhase} instead
   * @param targetPhaseKey - The {@linkcode PhaseKey} of the Phase on which the created Phase is appended
   * @param phase - The {@linkcode Phase} to be added
   * @param otherPhases - Additional (optional) Phases to add. These Phases are scheduled after {@linkcode phase} in array order
   * @returns `true` if the phase was successfully added to the queue after the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public appendToPhase(targetPhaseKey: PhaseKey, phase: Phase, ...otherPhases: Phase[]): boolean {
    const targetIndex = this.phaseQueue.findIndex((phase) => phase.is(targetPhaseKey));

    if (targetIndex !== -1 && this.phaseQueue.length > targetIndex) {
      this.phaseQueue.splice(targetIndex + 1, 0, phase, ...otherPhases);
      return true;
    }
    this.unshiftPhase(phase, ...otherPhases);
    return false;
  }

  /**
   * Creates a {@linkcode Phase} from the given parameters, then appends it to the first Phase
   * in {@linkcode phaseQueue} of the given key.
   * @param targetPhaseKey - The {@linkcode PhaseKey} of the Phase on which the created Phase is prepended
   * @param phase - The {@linkcode PhaseKey} of the Phase to create and add
   * @param params - The inferred constructor parameters according to {@linkcode phase}
   */
  public createAndAppendPhase<P extends PhaseKey>(
    targetPhaseKey: PhaseKey,
    phase: P,
    ...params: PhaseConstructorMap[P]
  ): boolean {
    return this.appendToPhase(targetPhaseKey, this.createPhase(phase, ...params));
  }

  /**
   * Moves everything from the {@linkcode nextCommandPhaseQueue} to the {@linkcode phaseQueue} (keeping order)
   */
  public populatePhaseQueue(): void {
    this.createAndPushPhase("TurnInitPhase");
  }

  // #region Phase-Specific Utils

  /**  @todo Are these utils still necessary? */

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
    if (!defer) {
      this.createAndUnshiftPhase("MessagePhase", message, callbackDelay, prompt, promptDelay);
    } else {
      this.createAndPushPhase("MessagePhase", message, callbackDelay, prompt, promptDelay);
    }
  }

  /**
   * Queues a new {@linkcode PokemonHealPhase} for the given {@linkcode BattlerIndex}.
   * @param battlerIndex - The {@linkcode BattlerIndex} of the pokemon to heal
   * @param hpHealed - The amount of HP to heal
   * @param params_2 - The various {@linkcode PokemonHealPhaseOptions | optional parameters} of `PokemonHealPhase`
   */
  public queuePokemonHealPhase(...params: ConstructorParameters<typeof PokemonHealPhase>) {
    this.createAndUnshiftPhase("PokemonHealPhase", ...params);
  }

  /**
   * Adds a new {@linkcode MoveChargePhase} to the phase queue.
   * @param battlerIndex - The user's {@linkcode BattlerIndex}
   * @param targets - Array of target `BattlerIndex`es
   * @param move - The {@linkcode PokemonMove} being used
   */
  public queueMoveChargePhase(...params: ConstructorParameters<typeof MoveChargePhase>): void {
    this.createAndUnshiftPhase("MoveChargePhase", ...params);
  }

  /**
   * Inserts a new {@linkcode SelectTargetPhase} to the phase queue.
   * @param fieldIndex - The selected target's {@linkcode BattlerIndex}
   */
  public queueSelectTargetPhase(...params: ConstructorParameters<typeof SelectTargetPhase>): void {
    this.createAndUnshiftPhase("SelectTargetPhase", ...params);
  }

  /**
   * Adds a new {@linkcode MoveAnimPhase} to the phase queue.
   * @param chargeAnim - The {@linkcode ChargeAnim} to be used
   * @param moveId - The {@linkcode MoveId} to be used
   * @param user - The {@linkcode Pokemon} using the move
   */
  public queueMoveAnimPhase(...params: ConstructorParameters<typeof MoveChargeAnim>): void {
    this.createAndUnshiftPhase("MoveAnimPhase", new MoveChargeAnim(...params));
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
    this.createAndUnshiftPhase("FaintPhase", battlerIndex, preventEndure, destinyTag, grudgeTag, source);
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
    targetPhaseKey,
  }: UseMoveInit) {
    const builderParams = ["MovePhase", pokemon, targets, move, followUp, ignorePp, reflected, snatched] as const;

    const validateTargetPhaseKey = () => {
      if (!targetPhaseKey) {
        throw new Error("targetPhaseKey is required for useMove.when === 'before' or 'after'");
      }
      return true;
    };

    switch (when) {
      case "eager":
        this.createAndUnshiftPhase(...builderParams);
        break;
      case "defer":
        this.createAndPushPhase(...builderParams);
        break;
      case "before":
        validateTargetPhaseKey();
        this.createAndPrependPhase(targetPhaseKey!, ...builderParams);
        break;
      case "after":
        validateTargetPhaseKey();
        this.createAndAppendPhase(targetPhaseKey!, ...builderParams);
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
    this.pushPhase(this.createPhase("BattleEndPhase", isVictory), this.createPhase("NewBattlePhase"));
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
    this.createAndPushPhase("GameOverPhase", isVictory);
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
      this.createAndUnshiftPhase("TitlePhase");
    } else {
      this.createAndPushPhase("TitlePhase");
    }
  }

  /**
   * @param eager - (Optional) `true` to use {@linkcode unshiftPhase}, `false` for {@linkcode pushPhase}
   * @param showText - (Optional, default `true`) Whether to show text
   */
  public toLoginScreen({ eager, showText = true }: ToLoginScreenInit = {}): void {
    const schedulePhase = eager ? this.createAndUnshiftPhase : this.createAndPushPhase;
    schedulePhase("LoginPhase", showText);
  }

  /**
   * @param eager - `true` to use {@linkcode unshiftPhase}, `false` for {@linkcode pushPhase}
   * @param battlerIndex - The {@linkcode BattlerIndex} of the affected {@linkcode Pokemon}
   * @param source - The {@linkcode Pokemon} that caused the stat stage change
   * @param stats - The {@linkcode BattleStat | stats} modified by this phase
   * @param stages - The change in each affected stat stage
   * @param params_4 - (Optional) The {@linkcode SSCPhaseOptions} for the generated phase
   */
  public queueStatStageChangePhase(
    eager: boolean,
    ...params: ConstructorParameters<typeof StatStageChangePhase>
  ): void {
    const schedulePhase = eager ? this.createAndUnshiftPhase : this.createAndPushPhase;
    schedulePhase("StatStageChangePhase", ...params);
  }
}
