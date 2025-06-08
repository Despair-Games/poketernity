// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ChargeAnim } from "#enums/charge-anim";
import { MoveEffectPhase } from "#phases/move-effect-phase";
import { VictoryPhase } from "#phases/victory-phase";
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
import { AttemptCapturePhase } from "#phases/attempt-capture-phase";
import { AttemptRunPhase } from "#phases/attempt-run-phase";
import { BattleEndPhase } from "#phases/battle-end-phase";
import { BerryPhase } from "#phases/berry-phase";
import { CheckStatusEffectPhase } from "#phases/check-status-effect-phase";
import { CheckSwitchPhase } from "#phases/check-switch-phase";
import { CommandPhase } from "#phases/command-phase";
import { CommonAnimPhase } from "#phases/common-anim-phase";
import { DamageAnimPhase } from "#phases/damage-anim-phase";
import { EggHatchPhase } from "#phases/egg-hatch-phase";
import { EggLapsePhase } from "#phases/egg-lapse-phase";
import { EggSummaryPhase } from "#phases/egg-summary-phase";
import { EncounterPhase } from "#phases/encounter-phase";
import { EndCardPhase } from "#phases/end-card-phase";
import { EndEvolutionPhase } from "#phases/end-evolution-phase";
import { EnemyCommandPhase } from "#phases/enemy-command-phase";
import { EvolutionPhase } from "#phases/evolution-phase";
import { ExpPhase } from "#phases/exp-phase";
import { FaintPhase } from "#phases/faint-phase";
import { FormChangePhase } from "#phases/form-change-phase";
import { GameOverModifierRewardPhase } from "#phases/game-over-modifier-reward-phase";
import { GameOverPhase } from "#phases/game-over-phase";
import { LearnMovePhase } from "#phases/learn-move-phase";
import { LevelCapPhase } from "#phases/level-cap-phase";
import { LevelUpPhase } from "#phases/level-up-phase";
import { LoadMoveAnimPhase } from "#phases/load-move-anim-phase";
import { LoginPhase } from "#phases/login-phase";
import { MessagePhase } from "#phases/message-phase";
import { ModifierRewardPhase } from "#phases/modifier-reward-phase";
import { MoneyRewardPhase } from "#phases/money-reward-phase";
import { MoveAnimPhase } from "#phases/move-anim-phase";
import { MoveChargePhase } from "#phases/move-charge-phase";
import { MoveHeaderPhase } from "#phases/move-header-phase";
import { MovePhase } from "#phases/move-phase";
import { MysteryEncounterBattlePhase } from "#phases/mystery-encounter-phases/battle-phase";
import { MysteryEncounterBattleStartCleanupPhase } from "#phases/mystery-encounter-phases/battle-start-cleanup-phase";
import { MysteryEncounterPhase } from "#phases/mystery-encounter-phases/mystery-encounter-phase";
import { MysteryEncounterOptionSelectedPhase } from "#phases/mystery-encounter-phases/option-selected-phase";
import { PostMysteryEncounterPhase } from "#phases/mystery-encounter-phases/post-mystery-encounter-phase";
import { MysteryEncounterRewardsPhase } from "#phases/mystery-encounter-phases/rewards-phase";
import { NewBattlePhase } from "#phases/new-battle-phase";
import { NewBiomeEncounterPhase } from "#phases/new-biome-encounter-phase";
import { NextEncounterPhase } from "#phases/next-encounter-phase";
import { ObtainStatusEffectPhase } from "#phases/obtain-status-effect-phase";
import { PartyExpPhase } from "#phases/party-exp-phase";
import { PartyHealPhase } from "#phases/party-heal-phase";
import { PokemonAnimPhase } from "#phases/pokemon-anim-phase";
import { PokemonHealPhase } from "#phases/pokemon-heal-phase";
import { PokemonTransformPhase } from "#phases/pokemon-transform-phase";
import { PostActionPhase } from "#phases/post-action-phase";
import { PostGameOverPhase } from "#phases/post-game-over-phase";
import { PostSummonPhase } from "#phases/post-summon-phase";
import { PostTurnStatusEffectPhase } from "#phases/post-turn-status-effect-phase";
import { QuietFormChangePhase } from "#phases/quiet-form-change-phase";
import { ReloadSessionPhase } from "#phases/reload-session-phase";
import { ReturnPhase } from "#phases/return-phase";
import { RevivalBlessingPhase } from "#phases/revival-blessing-phase";
import { RibbonModifierRewardPhase } from "#phases/ribbon-modifier-reward-phase";
import { ScanIvsPhase } from "#phases/scan-ivs-phase";
import { SelectBiomePhase } from "#phases/select-biome-phase";
import { SelectChallengePhase } from "#phases/select-challenge-phase";
import { SelectGenderPhase } from "#phases/select-gender-phase";
import { SelectModifierPhase } from "#phases/select-modifier-phase";
import { SelectStarterPhase } from "#phases/select-starter-phase";
import { SelectTargetPhase } from "#phases/select-target-phase";
import { ShinySparklePhase } from "#phases/shiny-sparkle-phase";
import { ShowAbilityPhase } from "#phases/show-ability-phase";
import { ShowPartyExpBarPhase } from "#phases/show-party-exp-bar-phase";
import { ShowTrainerPhase } from "#phases/show-trainer-phase";
import { StatStageChangePhase } from "#phases/stat-stage-change-phase";
import { SummonMissingPhase } from "#phases/summon-missing-phase";
import { SummonPhase } from "#phases/summon-phase";
import { SwitchBiomePhase } from "#phases/switch-biome-phase";
import { SwitchPhase } from "#phases/switch-phase";
import { SwitchSummonPhase } from "#phases/switch-summon-phase";
import { TerastallizationPhase } from "#phases/terastallization-phase";
import { TitlePhase } from "#phases/title-phase";
import { ToggleDoublePositionPhase } from "#phases/toggle-double-position-phase";
import { TrainerVictoryPhase } from "#phases/trainer-victory-phase";
import { TurnEndPhase } from "#phases/turn-end-phase";
import { TurnInitPhase } from "#phases/turn-init-phase";
import { TurnStartPhase } from "#phases/turn-start-phase";
import { UnavailablePhase } from "#phases/unavailable-phase";
import { UnlockPhase } from "#phases/unlock-phase";
import { WeatherEffectPhase } from "#phases/weather-effect-phase";
import type { PhaseMap, PhaseString } from "#types/phase-types";
import { coerceArray } from "#utils/common-utils";

interface UseMoveInit {
  pokemon: Pokemon;
  targets: BattlerIndex[];
  move: PokemonMove | MoveId;
  /** Whether to add the {@linkcode MovePhase} to the front of the phase queue or defer it. */
  when: "eager" | "defer" | "before" | "after";
  phaseName?: PhaseString;
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
 * Object that holds all of the phase constructors.
 * This is used to create new phases dynamically using the `newPhase` method in the `PhaseManager`.
 *
 * @remarks
 * The keys of this object are the names of the phases, and the values are the constructors of the phases.
 * This allows for easy creation of new phases without needing to import each phase individually.
 */
const PHASES = Object.freeze({
  AttemptCapturePhase,
  AttemptRunPhase,
  BattleEndPhase,
  BerryPhase,
  CheckStatusEffectPhase,
  CheckSwitchPhase,
  CommandPhase,
  CommonAnimPhase,
  DamageAnimPhase,
  EggHatchPhase,
  EggLapsePhase,
  EggSummaryPhase,
  EncounterPhase,
  EndCardPhase,
  EndEvolutionPhase,
  EnemyCommandPhase,
  EvolutionPhase,
  ExpPhase,
  FaintPhase,
  FormChangePhase,
  GameOverPhase,
  GameOverModifierRewardPhase,
  // HideAbilityPhase,
  // HidePartyExpBarPhase,
  LearnMovePhase,
  LevelCapPhase,
  LevelUpPhase,
  LoadMoveAnimPhase,
  LoginPhase,
  MessagePhase,
  ModifierRewardPhase,
  MoneyRewardPhase,
  MoveAnimPhase,
  MoveChargePhase,
  MoveEffectPhase,
  MoveHeaderPhase,
  MovePhase,
  MysteryEncounterPhase,
  MysteryEncounterOptionSelectedPhase,
  MysteryEncounterBattlePhase,
  MysteryEncounterBattleStartCleanupPhase,
  MysteryEncounterRewardsPhase,
  PostMysteryEncounterPhase,
  NewBattlePhase,
  NewBiomeEncounterPhase,
  NextEncounterPhase,
  ObtainStatusEffectPhase,
  PartyExpPhase,
  PartyHealPhase,
  PokemonAnimPhase,
  PokemonHealPhase,
  PokemonTransformPhase,
  PostActionPhase,
  PostGameOverPhase,
  PostSummonPhase,
  PostTurnStatusEffectPhase,
  QuietFormChangePhase,
  ReloadSessionPhase,
  // ResetStatusPhase, // see https://github.com/pagefaultgames/pokerogue/blob/beta/src/phases/reset-status-phase.ts
  ReturnPhase,
  RevivalBlessingPhase,
  RibbonModifierRewardPhase,
  ScanIvsPhase,
  SelectBiomePhase,
  SelectChallengePhase,
  SelectGenderPhase,
  SelectModifierPhase,
  SelectStarterPhase,
  SelectTargetPhase,
  ShinySparklePhase,
  ShowAbilityPhase,
  ShowPartyExpBarPhase,
  ShowTrainerPhase,
  StatStageChangePhase,
  SummonMissingPhase,
  SummonPhase,
  SwitchBiomePhase,
  SwitchPhase,
  SwitchSummonPhase,
  TerastallizationPhase,
  TitlePhase,
  ToggleDoublePositionPhase,
  TrainerVictoryPhase,
  TurnEndPhase,
  TurnInitPhase,
  TurnStartPhase,
  UnavailablePhase,
  UnlockPhase,
  VictoryPhase,
  WeatherEffectPhase,
});

// This type export cannot be moved to `@types`, as `Phases` is intentionally private to this file
/** Maps Phase strings to their constructors */
export type PhaseConstructorMap = typeof PHASES;

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
  /** @deprecated see {@link https://github.com/Despair-Games/poketernity/pull/910#discussion_r2029764830} */
  private conditionalQueue: [() => boolean, Phase][] = [];

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
   * @deprecated see {@link https://github.com/Despair-Games/poketernity/pull/910#discussion_r2029764830}
   */
  public pushConditionalPhase(phase: Phase, condition: () => boolean): void {
    this.conditionalQueue.push([condition, phase]);
  }

  /**
   * Queues a phase to be run at a future point in time.
   * @remarks {@linkcode pushNew} should be used instead if possible
   * @param phases - The {@linkcode Phase}(s) to add
   * @param defer - If `false`, adds the phase to `phaseQueue`. If `true`, adds the phase to `nextCommandPhaseQueue`. Default `false`.
   */
  public pushPhase(...phases: Phase[]): void {
    this.phaseQueue.push(...phases);
  }

  /**
   * Adds a phase to the end of {@linkcode phaseQueuePrepend},
   * or at {@linkcode phaseQueuePrependSpliceIndex} if it's set.
   * @remarks {@linkcode unshiftNew} should be used instead if possible
   * @param phases - The {@linkcode Phase}(s) to add
   */
  public unshiftPhase(...phases: Phase[]): void {
    if (this.phaseQueuePrependSpliceIndex === -1) {
      this.phaseQueuePrepend.push(...phases);
    } else {
      this.phaseQueuePrepend.splice(this.phaseQueuePrependSpliceIndex, 0, ...phases);
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
   * @remarks {@linkcode prependNewToPhase} should be used instead if possible
   * @param phase - The {@linkcode Phase} to be added
   * @param targetPhaseName - The {@linkcode PhaseString | name} of the phase to search for in the {@linkcode phaseQueue}
   * @returns `true` if the phase was successfully added to the queue before the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public prependToPhase(phase: Phase | Phase[], targetPhaseName: PhaseString): boolean {
    const targetIndex = this.phaseQueue.findIndex(({ phaseName }) => phaseName === targetPhaseName);
    const phases = coerceArray(phase);

    if (targetIndex !== -1) {
      this.phaseQueue.splice(targetIndex, 0, ...phases);
      return true;
    }
    this.unshiftPhase(...phases);
    return false;
  }

  /**
   * Tries to add the input phase to the index after the target phase in the {@linkcode phaseQueue},
   * otherwise it calls {@linkcode unshiftPhase} instead
   * @remarks {@linkcode appendNewToPhase} should be used instead if possible
   * @param phase - The {@linkcode Phase} to be added
   * @param targetPhaseName - The {@linkcode PhaseString | name} of the phase to search for in the {@linkcode phaseQueue}
   * @returns `true` if the phase was successfully added to the queue after the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public appendToPhase(phase: Phase | Phase[], targetPhaseName: PhaseString): boolean {
    const targetIndex = this.phaseQueue.findIndex(({ phaseName }) => phaseName === targetPhaseName);
    const phases = coerceArray(phase);

    if (targetIndex !== -1 && this.phaseQueue.length > targetIndex) {
      this.phaseQueue.splice(targetIndex + 1, 0, ...phases);
      return true;
    }
    this.unshiftPhase(...phases);
    return false;
  }

  /**
   * Pushes a {@linkcode TurnInitPhase} to the {@linkcode phaseQueue}
   * @todo Rename? Remove?
   */
  public populatePhaseQueue(): void {
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
   * @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew}
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
   * @param battlerIndex - The {@linkcode BattlerIndex} of the pokemon to heal
   * @param hpHealed - The amount of HP to heal
   * @param params_2 - The various {@linkcode PokemonHealPhaseOptions | optional parameters} of `PokemonHealPhase`
   * @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew}
   */
  public queuePokemonHealPhase(...params: ConstructorParameters<typeof PokemonHealPhase>) {
    const pokemonHealPhase = new PokemonHealPhase(...params);
    this.unshiftPhase(pokemonHealPhase);
  }

  /**
   * Adds a new {@linkcode MoveChargePhase} to the phase queue.
   * @param battlerIndex - The user's {@linkcode BattlerIndex}
   * @param targets - Array of target `BattlerIndex`es
   * @param move - The {@linkcode PokemonMove} being used
   * @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew}
   */
  public queueMoveChargePhase(...params: ConstructorParameters<typeof MoveChargePhase>): void {
    this.unshiftPhase(new MoveChargePhase(...params));
  }

  /**
   * Inserts a new {@linkcode SelectTargetPhase} to the phase queue.
   * @param fieldIndex - The selected target's {@linkcode BattlerIndex}
   * @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew}
   */
  public queueSelectTargetPhase(...params: ConstructorParameters<typeof SelectTargetPhase>): void {
    this.unshiftPhase(new SelectTargetPhase(...params));
  }

  /**
   * Adds a new {@linkcode MoveAnimPhase} to the phase queue.
   * @param chargeAnim - The {@linkcode ChargeAnim} to be used
   * @param moveId - The {@linkcode MoveId} to be used
   * @param user - The {@linkcode Pokemon} using the move
   * @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew}
   */
  public queueMoveAnimPhase(...params: ConstructorParameters<typeof MoveChargeAnim>): void {
    this.unshiftPhase(new MoveAnimPhase(new MoveChargeAnim(...params)));
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

  /** @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew} */
  public queueMovePhase({
    pokemon,
    targets,
    move,
    followUp = false,
    ignorePp = false,
    reflected = false,
    snatched = false,
    when,
    phaseName,
  }: UseMoveInit) {
    const movePhase = new MovePhase(pokemon, targets, move, followUp, ignorePp, reflected, snatched);

    if ((when === "before" || when === "after") && !phaseName) {
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
        this.prependToPhase(movePhase, phaseName!);
        break;
      case "after":
        this.appendToPhase(movePhase, phaseName!);
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
   * @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew}
   */
  public toLoginScreen({ eager, showText = true }: ToLoginScreenInit = {}): void {
    const loginPhase = new LoginPhase(showText);

    if (eager) {
      this.unshiftPhase(loginPhase);
    } else {
      this.pushPhase(loginPhase);
    }
  }

  /**
   * @param eager - `true` to use {@linkcode unshiftPhase}, `false` for {@linkcode pushPhase}
   * @param battlerIndex - The {@linkcode BattlerIndex} of the affected {@linkcode Pokemon}
   * @param source - The {@linkcode Pokemon} that caused the stat stage change
   * @param stats - The {@linkcode BattleStat | stats} modified by this phase
   * @param stages - The change in each affected stat stage
   * @param params_4 - (Optional) The {@linkcode SSCPhaseOptions} for the generated phase
   * @deprecated To be replaced with {@linkcode pushNew} / {@linkcode unshiftNew}
   */
  public queueStatStageChangePhase(
    eager: boolean,
    ...params: ConstructorParameters<typeof StatStageChangePhase>
  ): void {
    const statStageChangePhase = new StatStageChangePhase(...params);
    if (eager) {
      this.unshiftPhase(statStageChangePhase);
    } else {
      this.pushPhase(statStageChangePhase);
    }
  }

  /**
   * Dynamically create the named phase from the provided arguments
   *
   * @remarks
   * Used to avoid importing each phase individually, allowing for dynamic creation of phases.
   * @param phase - The name of the phase to create.
   * @param args - The arguments to pass to the phase constructor.
   * @returns The requested phase instance
   */
  public create<T extends PhaseString>(phase: T, ...args: ConstructorParameters<PhaseConstructorMap[T]>): PhaseMap[T] {
    const PhaseClass = PHASES[phase];

    if (!PhaseClass) {
      throw new Error(`Phase ${phase} does not exist in PhaseMap.`);
    }

    // @ts-expect-error: Typescript does not support narrowing the type of operands in generic methods (see https://stackoverflow.com/a/72891234)
    return new PhaseClass(...args);
  }

  /**
   * Create a new phase and immediately push it to the phase queue. Equivalent to calling {@linkcode create} followed by {@linkcode pushPhase}.
   * @param phase - The name of the phase to create
   * @param args - The arguments to pass to the phase constructor
   */
  public pushNew<T extends PhaseString>(phase: T, ...args: ConstructorParameters<PhaseConstructorMap[T]>): void {
    this.pushPhase(this.create(phase, ...args));
  }

  /**
   * Create a new phase and immediately unshift it to the phase queue. Equivalent to calling {@linkcode create} followed by {@linkcode unshiftPhase}.
   * @param phase - The name of the phase to create
   * @param args - The arguments to pass to the phase constructor
   */
  public unshiftNew<T extends PhaseString>(phase: T, ...args: ConstructorParameters<PhaseConstructorMap[T]>): void {
    this.unshiftPhase(this.create(phase, ...args));
  }

  /**
   * Create a new phase and immediately prepend it to an existing phase in the phase queue.
   * Equivalent to calling {@linkcode create} followed by {@linkcode prependToPhase}.
   * @param targetPhase - The phase to search for in phaseQueue
   * @param phase - The name of the phase to create
   * @param args - The arguments to pass to the phase constructor
   * @returns `true` if a `targetPhase` was found to prepend to
   */
  public prependNewToPhase<T extends PhaseString>(
    targetPhase: PhaseString,
    phase: T,
    ...args: ConstructorParameters<PhaseConstructorMap[T]>
  ): boolean {
    return this.prependToPhase(this.create(phase, ...args), targetPhase);
  }

  /**
   * Create a new phase and immediately append it to an existing phase the phase queue.
   * Equivalent to calling {@linkcode create} followed by {@linkcode appendToPhase}.
   * @param targetPhase - The phase to search for in phaseQueue
   * @param phase - The name of the phase to create
   * @param args - The arguments to pass to the phase constructor
   * @returns `true` if a `targetPhase` was found to append to
   */
  public appendNewToPhase<T extends PhaseString>(
    targetPhase: PhaseString,
    phase: T,
    ...args: ConstructorParameters<PhaseConstructorMap[T]>
  ): boolean {
    return this.appendToPhase(this.create(phase, ...args), targetPhase);
  }
}
