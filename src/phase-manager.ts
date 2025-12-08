import { DynamicPhaseManager, dynamicPhaseKeys } from "#app/dynamic-phase-manager";
import type { Phase } from "#app/phase";
import { type PhaseEntryInput, PhaseTree } from "#app/phase-tree";
import type { DestinyBondTag } from "#battler-tags/destiny-bond-tag";
import type { GrudgeTag } from "#battler-tags/grudge-tag";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { SwitchType } from "#enums/switch-type";
import type { Pokemon } from "#field/pokemon";
import { AttemptCapturePhase } from "#phases/attempt-capture-phase";
import { AttemptRunPhase } from "#phases/attempt-run-phase";
import type { PokemonPhase } from "#phases/base/pokemon-phase";
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
import { HideAbilityPhase } from "#phases/hide-ability-phase";
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
import { MoveEffectPhase } from "#phases/move-effect-phase";
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
import { PostKnockoutPhase } from "#phases/post-knockout-phase";
import { PostSummonPhase } from "#phases/post-summon-phase";
import { PostTurnStatusEffectPhase } from "#phases/post-turn-status-effect-phase";
import { QuietFormChangePhase } from "#phases/quiet-form-change-phase";
import { RecallPhase } from "#phases/recall-phase";
import { ReloadSessionPhase } from "#phases/reload-session-phase";
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
import { SummonPhase } from "#phases/summon-phase";
import { SwitchBiomePhase } from "#phases/switch-biome-phase";
import { SwitchPhase } from "#phases/switch-phase";
import { TerastallizationPhase } from "#phases/terastallization-phase";
import { TitlePhase } from "#phases/title-phase";
import { ToggleDoublePositionPhase } from "#phases/toggle-double-position-phase";
import { TrainerVictoryPhase } from "#phases/trainer-victory-phase";
import { TurnEndPhase } from "#phases/turn-end-phase";
import { TurnInitPhase } from "#phases/turn-init-phase";
import { TurnStartPhase } from "#phases/turn-start-phase";
import { UnavailablePhase } from "#phases/unavailable-phase";
import { UnlockPhase } from "#phases/unlock-phase";
import { VictoryPhase } from "#phases/victory-phase";
import { WeatherEffectPhase } from "#phases/weather-effect-phase";
import type { PhaseConditionFunc, PhaseKey, PhaseMap, PhaseParameterMap } from "#types/phase-types";
import type { NonEmptyArray } from "#types/utility-types";

/**
 * A map of all {@linkcode Phase | Phases} that can be generated by
 * a {@linkcode PhaseManager | PhaseManager's} factory methods.
 *
 * @remarks
 * The keys of this object are the names of the phases (e.g. `"MovePhase"`).
 * This allows for easy creation of new phases without needing to import each phase individually.
 */
const PHASES = {
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
  GameOverModifierRewardPhase,
  GameOverPhase,
  HideAbilityPhase,
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
  MysteryEncounterBattlePhase,
  MysteryEncounterBattleStartCleanupPhase,
  MysteryEncounterOptionSelectedPhase,
  MysteryEncounterPhase,
  MysteryEncounterRewardsPhase,
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
  PostKnockoutPhase,
  PostMysteryEncounterPhase,
  PostSummonPhase,
  PostTurnStatusEffectPhase,
  QuietFormChangePhase,
  ReloadSessionPhase,
  RecallPhase,
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
  SummonPhase,
  SwitchBiomePhase,
  SwitchPhase,
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
} as const;

export type PhaseConstructorMap = typeof PHASES;

type PhaseInput = Readonly<NonEmptyArray<Phase>>;

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

interface PokemonFaintInit {
  preventEndure?: boolean;
  destinyTag?: DestinyBondTag | null;
  grudgeTag?: GrudgeTag | null;
  source?: Pokemon;
}

interface BattlerSwitchOutInit {
  switchType?: SwitchType;
  switchInIndex?: number;
  when?: "eager" | "before" | "after";
  phaseKey?: PhaseKey;
}

/**
 * This is responsible for managing the game's {@linkcode Phase | phases}.
 */
export class PhaseManager {
  /** The main {@linkcode PhaseTree} where Phases are stored and scheduled. */
  private readonly phaseQueue: PhaseTree = new PhaseTree();

  /** Stores priority queues for dynamically scheduled Phases */
  private readonly dynamicPhaseManager: DynamicPhaseManager = new DynamicPhaseManager();

  /** The currently-running Phase */
  private currentPhase: Phase;
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
   * Constructs a phase from the given parameters.
   * @param phase - The {@linkcode PhaseKey} for the {@linkcode Phase} to construct, e.g. `"MovePhase"`
   * @param params - The inferred constructor parameters for the Phase specified
   * by {@linkcode phase}
   * @returns The newly constructed {@linkcode Phase}
   */
  public createPhase<P extends PhaseKey>(phase: P, ...params: PhaseParameterMap[P]): PhaseMap[P] {
    const PhaseClass = PHASES[phase];
    if (!PhaseClass) {
      throw new Error(`${phase} does not exist in PHASES!`);
    }

    // @ts-expect-error: Typescript does not support narrowing the type of operands in generic methods (see https://stackoverflow.com/a/72891234)
    return new PhaseClass(...params);
  }

  /**
   * Queues one or more phases to be run at a future point in time.
   * @param phase - The {@linkcode Phase | Phases} to push to the {@link phaseQueue | main queue}.
   * @see {@linkcode PhaseTree.push}
   */
  public pushPhase(...phases: PhaseInput): void {
    this.phaseQueue.push(...this.parseDynamic(...phases));
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
  public createAndPushPhase<P extends PhaseKey>(phase: P, ...params: PhaseParameterMap[P]): void {
    this.pushPhase(this.createPhase(phase, ...params));
  }

  /**
   * Adds one or more phases to the top level of the Phase Tree.
   * @param phases - The {@linkcode Phases} to unshift.
   * @see {@linkcode PhaseTree.unshift}
   */
  public unshiftPhase(...phases: PhaseInput): void {
    this.phaseQueue.unshift(...this.parseDynamic(...phases));
  }

  /**
   * Creates a {@linkcode Phase} from the given parameters, then unshifts it
   * onto the Phase Tree. This is equivalent to calling
   * {@linkcode createPhase}, then {@linkcode unshiftPhase} for the created Phase.
   *
   * Note that this only supports unshifting one Phase at a time. The best practice
   * to defer multiple Phases at once is to construct each phase with {@linkcode createPhase}, e.g.
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
  public createAndUnshiftPhase<P extends PhaseKey>(phase: P, ...params: PhaseParameterMap[P]): void {
    this.unshiftPhase(this.createPhase<P>(phase, ...params));
  }

  /**
   * Adds one or more phases to the "deferred" level of the Phase Tree.
   * Deferred Phases will run before any previously pushed Phases, but after
   * all Phases that are unshifted over the course of the current Phase.
   * @param phases - The {@linkcode Phase | Phases} to defer
   * @see {@linkcode PhaseTree.defer}
   */
  public deferPhase(...phases: PhaseInput): void {
    this.phaseQueue.defer(...this.parseDynamic(...phases));
  }

  /**
   * Creates a {@linkcode Phase} from the given parameters, then adds it
   * to the Phase Tree at the "deferred" level. This is equivalent to calling
   * {@linkcode createPhase}, then {@linkcode deferPhase} for the created Phase.
   *
   * Note that this only supports deferring one Phase at a time. The best practice
   * to defer multiple Phases at once is to construct each phase with {@linkcode createPhase}, e.g.
   *
   * ```
   * deferPhase(
   *   createPhase("MovePhase", ...),
   *   createPhase("MoveEffectPhase", ...),
   * );
   * ```
   * @param phase - The {@linkcode PhaseKey} for the {@linkcode Phase} to construct, e.g. `"MovePhase"`
   * @param params - The inferred constructor parameters for the Phase specified
   * by {@linkcode phase}
   */
  public createAndDeferPhase<P extends PhaseKey>(phase: P, ...params: PhaseParameterMap[P]): void {
    this.deferPhase(this.createPhase<P>(phase, ...params));
  }

  /** Clears all queued Phases, including the standby Phase. */
  public clear(): void {
    this.phaseQueue.clear();
    this.dynamicPhaseManager.clearQueues();
    this.standbyPhase = null;
  }

  /**
   * Removes and executes the first {@linkcode Phase} in the Phase Tree.
   *
   * If the first element in the Tree marks a dynamically scheduled Phase, then the Phase to execute
   * is obtained from the {@linkcode DynamicPhaseManager}'s priority queue of the respective Phase type.
   *
   * If the Tree is empty, or a matching Phase isn't found for a given Dynamic Phase marker, then
   * this function defaults to running a {@linkcode TurnInitPhase}.
   *
   * @privateRemarks
   * This is called automatically via {@linkcode Phase.end} and should not be called by other methods.
   */
  public shiftPhase(): void {
    if (this.standbyPhase) {
      this.currentPhase = this.standbyPhase;
      this.standbyPhase = null;
      return;
    }

    const phaseEntry = this.phaseQueue.getNextEntry();
    if (phaseEntry == null) {
      this.dynamicPhaseManager.clearQueues();
      this.currentPhase = this.createPhase("TurnInitPhase");
      console.log(`%cStart Phase ${this.currentPhase.constructor.name}`, "color:green;");
      this.currentPhase.start();
      return;
    }

    const phase = this.phaseQueue.isPhase(phaseEntry)
      ? phaseEntry
      : (this.dynamicPhaseManager.popNextPhase(phaseEntry.phaseType) ?? this.createPhase("TurnInitPhase"));

    this.currentPhase = phase;
    console.log(`%cStart Phase ${this.currentPhase.constructor.name}`, "color:green;");
    this.currentPhase.start();
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
   * Finds a Phase matching the given type and condition (if defined).
   *
   * @param phaseType - The {@link PhaseKey | type} of Phase to search for
   * @param phaseFilter - (Optional) A condition the query Phase must satisfy
   * @returns the found {@linkcode Phase}, or `undefined` if none is found
   */
  public findPhaseOfType<P extends PhaseKey>(
    phaseType: P,
    phaseFilter: PhaseConditionFunc<P> = () => true,
  ): PhaseMap[P] | undefined {
    return this.phaseQueue.find(phaseType, phaseFilter);
  }

  /**
   * Checks if the phase queue contains a phase that matches the filter function
   *
   * @param phaseType - The {@link PhaseKey | type} of Phase to search for
   * @param phaseFilter - (Optional) A condition the query Phase must satisfy
   * @returns `true` if the phase exists, `false` otherwise
   */
  public hasPhaseOfType<P extends PhaseKey>(phaseType: P, phaseFilter: PhaseConditionFunc<P> = () => true): boolean {
    return this.phaseQueue.has(phaseType, phaseFilter) || this.dynamicPhaseManager.has(phaseType, phaseFilter);
  }

  /**
   * Removes the first Phase in the Phase Tree (in pop order) that is of the given
   * type and meets the given condition.
   * @param phaseType - The {@link PhaseKey | type} of Phase to remove
   * @param phaseFilter - (Optional) A condition the Phase to remove must satisfy
   * @returns `true` if a Phase was successfully removed
   */
  public removePhase<P extends PhaseKey>(phaseType: P, phaseFilter: PhaseConditionFunc<P> = () => true): boolean {
    return this.phaseQueue.remove(phaseType, phaseFilter);
  }

  /**
   * Removes all Phases in the Phase Tree of the given type.
   * @param phaseType - The {@link PhaseKey | type} of Phase to remove
   */
  public removeAllPhasesOfType<P extends PhaseKey>(phaseType: P): void {
    this.phaseQueue.removeAll(phaseType);
  }

  /**
   * Tries to add the input phase to the index before the target phase in the {@linkcode phaseQueue},
   * otherwise it calls {@linkcode unshiftPhase} instead
   * @param targetPhaseKey - The {@linkcode PhaseKey} of the phase to search for in the {@linkcode phaseQueue}
   * @param phases - The {@linkcode Phases} to be added. This requires at least one Phase as input.
   * @returns `true` if the phase was successfully added to the queue before the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public prependToPhase(targetPhaseKey: PhaseKey, ...phases: PhaseInput): boolean {
    return this.phaseQueue.addBefore(targetPhaseKey, ...this.parseDynamic(...phases));
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
    ...params: PhaseParameterMap[P]
  ): boolean {
    return this.prependToPhase(targetPhaseKey, this.createPhase(phase, ...params));
  }

  /**
   * Tries to add the input phase to the index after the target phase in the {@linkcode phaseQueue},
   * otherwise it calls {@linkcode unshiftPhase} instead
   * @param targetPhaseKey - The {@linkcode PhaseKey} of the Phase on which the created Phase is appended
   * @param phases - The {@linkcode Phases} to be added. This requires at least one Phase as input.
   * @returns `true` if the phase was successfully added to the queue after the target phase,
   *   `false` if the target phase wasn't found and {@linkcode unshiftPhase} was called instead
   */
  public appendToPhase(targetPhaseKey: PhaseKey, ...phases: [Phase, ...Phase[]]): boolean {
    return this.phaseQueue.addAfter(targetPhaseKey, ...this.parseDynamic(...phases));
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
    ...params: PhaseParameterMap[P]
  ): boolean {
    return this.appendToPhase(targetPhaseKey, this.createPhase(phase, ...params));
  }

  /**
   * Determines if any Phases in the given input should be scheduled dynamically.
   * All Phases interpreted as dynamic are added to the {@linkcode dynamicPhaseManager} during parsing.
   * @param phases - The {@linkcode Phase | Phases} to parse
   * @returns The corresponding {@linkcode PhaseEntry | entries} to add to the Phase Tree.
   * Dynamic Phases are added to the Tree as {@linkcode DynamicPhaseMarker | DynamicPhaseMarkers}.
   */
  private parseDynamic(...phases: PhaseInput): PhaseEntryInput {
    return phases.map((phase) => {
      if (dynamicPhaseKeys.includes(phase.phaseName)) {
        this.dynamicPhaseManager.add(phase as PokemonPhase);
        return { phaseType: phase.phaseName };
      }
      return phase;
    }) as PhaseEntryInput; // TS interprets this as `PhaseEntry[]` by default
  }

  // #region Phase-Specific Utils

  /**
   * Unshifts a new {@linkcode FaintPhase} for the given {@linkcode BattlerIndex} to faint.
   *
   * @param battlerIndex - The {@linkcode FieldBattlerIndex} to faint
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
    battlerIndex: FieldBattlerIndex,
    { preventEndure = false, destinyTag = null, grudgeTag = null, source }: PokemonFaintInit,
  ): void {
    this.createAndDeferPhase("FaintPhase", battlerIndex, preventEndure, destinyTag, grudgeTag, source);
  }

  /**
   * Unshifts a sequence of phases to switch out a Pokemon on the field
   * @param battlerIndex - The {@linkcode BattlerIndex} of the Pokemon to switch out
   * @param switchType - (Default {@linkcode SwitchType.SWITCH}) The {@linkcode SwitchType | type} of switch to apply
   * @param switchInIndex - (Default `-1`) The index of the party Pokemon to switch into
   * the target Pokemon's place. If set to `-1`, the Pokemon to switch in is instead resolved
   * during the {@linkcode SwitchPhase}.
   */
  public queueBattlerSwitchOut(
    battlerIndex: FieldBattlerIndex,
    { switchType = SwitchType.SWITCH, switchInIndex = -1, when = "eager", phaseKey }: BattlerSwitchOutInit = {},
  ): void {
    const phases = [
      this.createPhase("RecallPhase", battlerIndex, switchType),
      this.createPhase("SwitchPhase", battlerIndex, switchType, switchInIndex),
    ] as const;

    const validatePhaseId = () => {
      if (!phaseKey) {
        throw new Error("`phaseId` is required if `when` is 'before' or 'after'");
      }
    };

    // biome-ignore lint/nursery/useExhaustiveSwitchCases: false positive, biome doesn't recognize the default value of the param
    switch (when) {
      case "eager":
        this.unshiftPhase(...phases);
        break;
      case "before":
        validatePhaseId();
        this.prependToPhase(phaseKey!, ...phases);
        break;
      case "after":
        validatePhaseId();
        this.appendToPhase(phaseKey!, ...phases);
        break;
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
      this.clear();
    }
    this.createAndPushPhase("GameOverPhase", isVictory);
  }

  /**
   * @param eager - (Optional) `true` to use {@linkcode unshiftPhase}, `false` for {@linkcode pushPhase}
   * @param clearPhaseQueue - (Optional) `true` to clear the phase queue
   */
  public toTitleScreen({ eager, clearPhaseQueue }: ToTitleScreenInit = {}): void {
    if (clearPhaseQueue) {
      this.clear();
    }

    if (eager) {
      this.createAndUnshiftPhase("TitlePhase");
    } else {
      this.createAndPushPhase("TitlePhase");
    }
  }
}
