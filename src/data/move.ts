import { ChargeAnim } from "#app/data/battle-anims";
import {
  EncoreTag,
  HelpingHandTag,
  SemiInvulnerableTag,
  ShellTrapTag,
  StockpilingTag,
  TrappedTag,
  TypeBoostTag,
} from "#app/data/battler-tags";
import { getPokemonNameWithAffix } from "#app/messages";
import type { TurnMove } from "#app/field/pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { HitResult, MoveResult, PokemonMove } from "#app/field/pokemon";
import { getNonVolatileStatusEffects, isNonVolatileStatusEffect } from "#app/data/status-effect";
import { Type } from "#enums/type";
import { type Constructor, BooleanHolder, NumberHolder, toDmgValue, isNullOrUndefined, type nil } from "#app/utils";
import { WeatherType } from "#enums/weather-type";
import type { ArenaTrapTag } from "#app/data/arena-tag";
import { ArenaTagSide, WeakenMoveTypeTag } from "#app/data/arena-tag";
import { applyAbAttrs, applyPreAttackAbAttrs, applyPreDefendAbAttrs } from "#app/data/ability";
import { InfiltratorAbAttr } from "#app/data/ab-attrs/infiltrator-ab-attr";
import { IgnoreProtectOnContactAbAttr } from "#app/data/ab-attrs/ignore-protect-on-contact-ab-attr";
import { MoveAbilityBypassAbAttr } from "#app/data/ab-attrs/move-ability-bypass-ab-attr";
import { IgnoreContactAbAttr } from "#app/data/ab-attrs/ignore-contact-ab-attr";
import { ChangeMovePriorityAbAttr } from "#app/data/ab-attrs/change-move-priority-ab-attr";
import { BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import { AllyMoveCategoryPowerBoostAbAttr } from "#app/data/ab-attrs/ally-move-category-power-boost-ab-attr";
import { UserFieldMoveTypePowerBoostAbAttr } from "#app/data/ab-attrs/user-field-move-type-power-boost-ab-attr";
import { MoveTypeChangeAbAttr } from "#app/data/ab-attrs/move-type-change-ab-attr";
import { FieldPreventExplosiveMovesAbAttr } from "#app/data/ab-attrs/field-prevent-explosive-moves-ab-attr";
import { VariableMovePowerAbAttr } from "#app/data/ab-attrs/variable-move-power-ab-attr";
import {
  AttackTypeBoosterModifier,
  BerryModifier,
  PokemonMoveAccuracyBoosterModifier,
  PokemonMultiHitModifier,
} from "#app/modifier/modifier";
import type { BattlerIndex } from "#app/battle";
import { TerrainType } from "#enums/terrain-type";
import { Command } from "#app/ui/command-ui-handler";
import i18next from "i18next";
import type { Localizable } from "#app/interfaces/locales";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { BATTLE_STATS, getStatKey, Stat } from "#enums/stat";
import { MovePhase } from "#app/phases/move-phase";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { SwitchType } from "#enums/switch-type";
import { StatusEffect } from "enums/status-effect";
import { globalScene } from "#app/global-scene";
import { WonderSkinAbAttr } from "#app/data/ab-attrs/wonder-skin-ab-attr";
import { FieldMoveTypePowerBoostAbAttr } from "#app/data/ab-attrs/field-move-type-power-boost-ab-attr";
import { MoveCategory } from "#enums/move-category";
import { MoveTarget } from "#enums/move-target";
import { MoveFlags } from "#enums/move-flags";
import { AttackMove } from "#app/data/attack-move";
import { StatusMove } from "#app/data/status-move";
import { SelfStatusMove } from "#app/data/self-status-move";
import { type ChargingMove, ChargingAttackMove, ChargingSelfStatusMove } from "#app/data/charge-move";
import type { MoveAttr } from "#app/data/move-attrs/move-attr";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { MoveEffectAttr, type MoveEffectAttrOptions } from "#app/data/move-attrs/move-effect-attr";
import { MessageHeaderAttr } from "#app/data/move-attrs/message-header-attr";
import { AddBattlerTagHeaderAttr } from "#app/data/move-attrs/add-battler-tag-header-attr";
import { BeakBlastHeaderAttr } from "#app/data/move-attrs/beak-blast-header-attr";
import { PreMoveMessageAttr } from "#app/data/move-attrs/pre-move-message-attr";
import { RespectAttackTypeImmunityAttr } from "#app/data/move-attrs/respect-attack-type-immunity-attr";
import { IgnoreOpponentStatStagesAttr } from "#app/data/move-attrs/ignore-opponent-stat-stages-attr";
import { HighCritAttr } from "#app/data/move-attrs/high-crit-attr";
import { CritOnlyAttr } from "#app/data/move-attrs/crit-only-attr";
import { FixedDamageAttr } from "#app/data/move-attrs/fixed-damage-attr";
import { UserHpDamageAttr } from "#app/data/move-attrs/user-hp-damage-attr";
import { TargetHalfHpDamageAttr } from "#app/data/move-attrs/target-half-hp-damage-attr";
import { MatchHpAttr } from "#app/data/move-attrs/match-hp-attr";
import { CounterDamageAttr } from "#app/data/move-attrs/counter-damage-attr";
import { LevelDamageAttr } from "#app/data/move-attrs/level-damage-attr";
import { RandomLevelDamageAttr } from "#app/data/move-attrs/random-level-damage-attr";
import { SurviveDamageAttr } from "#app/data/move-attrs/survive-damage-attr";
import { RecoilAttr } from "#app/data/move-attrs/recoil-attr";
import { SacrificialAttr } from "#app/data/move-attrs/sacrificial-attr";
import { SacrificialAttrOnHit } from "#app/data/move-attrs/sacrificial-attr-on-hit";
import { HalfSacrificialAttr } from "#app/data/move-attrs/half-sacrificial-attr";
import { AddSubstituteAttr } from "#app/data/move-attrs/add-substitute-attr";
import { MultiHitType } from "#enums/multi-hit-type";
import { PartyStatusCureAttr } from "#app/data/move-attrs/party-status-cure-attr";
import { HealAttr } from "#app/data/move-attrs/heal-attr";
import { FlameBurstAttr } from "#app/data/move-attrs/flame-burst-attr";
import { SacrificialFullRestoreAttr } from "#app/data/move-attrs/sacrificial-full-restore-attr";
import { IgnoreWeatherTypeDebuffAttr } from "#app/data/move-attrs/ignore-weather-type-debuff-attr";
import { PlantHealAttr } from "#app/data/move-attrs/plant-heal-attr";
import { SandHealAttr } from "#app/data/move-attrs/sand-heal-attr";
import { BoostHealAttr } from "#app/data/move-attrs/boost-heal-attr";
import { HealOnAllyAttr } from "#app/data/move-attrs/heal-on-ally-attr";
import { HitHealAttr } from "#app/data/move-attrs/hit-heal-attr";
import { IncrementMovePriorityAttr } from "#app/data/move-attrs/increment-move-priority-attr";
import { MultiHitAttr } from "#app/data/move-attrs/multi-hit-attr";
import { WaterShurikenMultiHitTypeAttr } from "#app/data/move-attrs/water-shuriken-multi-hit-type-attr";
import { StatusEffectAttr } from "#app/data/move-attrs/status-effect-attr";
import { MultiStatusEffectAttr } from "#app/data/move-attrs/multi-status-effect-attr";
import { PsychoShiftEffectAttr } from "#app/data/move-attrs/psycho-shift-effect-attr";
import { EatBerryAttr } from "#app/data/move-attrs/eat-berry-attr";
import { HealStatusEffectAttr } from "#app/data/move-attrs/heal-status-effect-attr";
import { RemoveHeldItemAttr } from "#app/data/move-attrs/remove-held-item-attr";
import { StealEatBerryAttr } from "#app/data/move-attrs/steal-eat-berry-attr";
import { StealHeldItemChanceAttr } from "#app/data/move-attrs/steal-held-item-chance-attr";
import { BypassSleepAttr } from "#app/data/move-attrs/bypass-sleep-attr";
import { BypassBurnDamageReductionAttr } from "#app/data/move-attrs/bypass-burn-damage-reduction-attr";
import { WeatherChangeAttr } from "#app/data/move-attrs/weather-change-attr";
import { ClearWeatherAttr } from "#app/data/move-attrs/clear-weather-attr";
import { TerrainChangeAttr } from "#app/data/move-attrs/terrain-change-attr";
import { ClearTerrainAttr } from "#app/data/move-attrs/clear-terrain-attr";
import { OneHitKOAttr } from "#app/data/move-attrs/one-hit-ko-attr";
import { WeatherInstantChargeAttr } from "#app/data/move-attrs/weather-instant-charge-attr";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";
import { DelayedAttackAttr } from "#app/data/move-attrs/delayed-attack-attr";
import { AwaitCombinedPledgeAttr } from "#app/data/move-attrs/await-combined-pledge-attr";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";
import { SecretPowerAttr } from "#app/data/move-attrs/secret-power-attr";
import { PostVictoryStatStageChangeAttr } from "#app/data/move-attrs/post-victory-stat-stage-change-attr";
import { AcupressureStatStageChangeAttr } from "#app/data/move-attrs/acupressure-stat-stage-change-attr";
import { GrowthStatStageChangeAttr } from "#app/data/move-attrs/growth-stat-stage-change-attr";
import { CutHpStatStageBoostAttr } from "#app/data/move-attrs/cut-hp-stat-stage-boost-attr";
import { OrderUpStatBoostAttr } from "#app/data/move-attrs/order-up-stat-boost-attr";
import { CopyStatsAttr } from "#app/data/move-attrs/copy-stats-attr";
import { InvertStatsAttr } from "#app/data/move-attrs/invert-stats-attr";
import { ResetStatsAttr } from "#app/data/move-attrs/reset-stats-attr";
import { StealPositiveStatsAttr } from "#app/data/move-attrs/steal-positive-stats-attr";
import { SwapStatStagesAttr } from "#app/data/move-attrs/swap-stat-stages-attr";
import { HpSplitAttr } from "#app/data/move-attrs/hp-split-attr";
import { VariablePowerAttr } from "#app/data/move-attrs/variable-power-attr";
import { LessPPMorePowerAttr } from "#app/data/move-attrs/less-pp-more-power-attr";
import { MovePowerMultiplierAttr } from "#app/data/move-attrs/move-power-multiplier-attr";
import { BeatUpAttr } from "#app/data/move-attrs/beat-up-attr";
import { DoublePowerChanceAttr, doublePowerChanceMessageFunc } from "#app/data/move-attrs/double-power-chance-attr";
import { ConsecutiveUseDoublePowerAttr } from "#app/data/move-attrs/consecutive-use-double-power-attr";
import { ConsecutiveUseMultiBasePowerAttr } from "#app/data/move-attrs/consecutive-use-multi-base-power-attr";
import { WeightPowerAttr } from "#app/data/move-attrs/weight-power-attr";
import { ElectroBallPowerAttr } from "#app/data/move-attrs/electro-ball-power-attr";
import { GyroBallPowerAttr } from "#app/data/move-attrs/gyro-ball-power-attr";
import { LowHpPowerAttr } from "#app/data/move-attrs/low-hp-power-attr";
import { CompareWeightPowerAttr } from "#app/data/move-attrs/compare-weight-power-attr";
import { HpPowerAttr } from "#app/data/move-attrs/hp-power-attr";
import { OpponentHighHpPowerAttr } from "#app/data/move-attrs/opponent-high-hp-power-attr";
import { FirstAttackDoublePowerAttr } from "#app/data/move-attrs/first-attack-double-power-attr";
import { TurnDamagedDoublePowerAttr } from "#app/data/move-attrs/turn-damaged-double-power-attr";
import { magnitudeMessageFunc, MagnitudePowerAttr } from "#app/data/move-attrs/magnitude-power-attr";
import { AntiSunlightPowerDecreaseAttr } from "#app/data/move-attrs/anti-sunlight-power-decrease-attr";
import { FriendshipPowerAttr } from "#app/data/move-attrs/friendship-power-attr";
import { HitCountPowerAttr } from "#app/data/move-attrs/hit-count-power-attr";
import { PunishmentPowerAttr, PositiveStatStagePowerAttr } from "#app/data/move-attrs/positive-stat-stage-power-attr";
import { PresentPowerAttr } from "#app/data/move-attrs/present-power-attr";
import { WaterShurikenPowerAttr } from "#app/data/move-attrs/water-shuriken-power-attr";
import { SpitUpPowerAttr } from "#app/data/move-attrs/spit-up-power-attr";
import { SwallowHealAttr } from "#app/data/move-attrs/swallow-heal-attr";
import { MultiHitPowerIncrementAttr } from "#app/data/move-attrs/multi-hit-power-increment-attr";
import { LastMoveDoublePowerAttr } from "#app/data/move-attrs/last-move-double-power-attr";
import { CombinedPledgePowerAttr } from "#app/data/move-attrs/combined-pledge-power-attr";
import { CombinedPledgeStabBoostAttr } from "#app/data/move-attrs/combined-pledge-stab-boost-attr";
import { RoundPowerAttr } from "#app/data/move-attrs/round-power-attr";
import { CueNextRoundAttr } from "#app/data/move-attrs/cue-next-round-attr";
import { TargetAtkUserAtkAttr } from "#app/data/move-attrs/target-atk-user-atk-attr";
import { DefAtkAttr } from "#app/data/move-attrs/def-atk-attr";
import { DefDefAttr } from "#app/data/move-attrs/def-def-attr";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";
import { ThunderAccuracyAttr } from "#app/data/move-attrs/thunder-accuracy-attr";
import { StormAccuracyAttr } from "#app/data/move-attrs/storm-accuracy-attr";
import { AlwaysHitMinimizeAttr } from "#app/data/move-attrs/always-hit-minimize-attr";
import { ToxicAccuracyAttr } from "#app/data/move-attrs/toxic-accuracy-attr";
import { BlizzardAccuracyAttr } from "#app/data/move-attrs/blizzard-accuracy-attr";
import { PhotonGeyserCategoryAttr } from "#app/data/move-attrs/photon-geyser-category-attr";
import { TeraMoveCategoryAttr } from "#app/data/move-attrs/tera-move-category-attr";
import { TeraBlastPowerAttr } from "#app/data/move-attrs/tera-blast-power-attr";
import { StatusCategoryOnAllyAttr } from "#app/data/move-attrs/status-category-on-ally-attr";
import { ShellSideArmCategoryAttr } from "#app/data/move-attrs/shell-side-arm-category-attr";
import { TeraStarstormTypeAttr } from "#app/data/move-attrs/tera-starstorm-type-attr";
import { FormChangeItemTypeAttr } from "#app/data/move-attrs/form-change-item-type-attr";
import { TechnoBlastTypeAttr } from "#app/data/move-attrs/techno-blast-type-attr";
import { AuraWheelTypeAttr } from "#app/data/move-attrs/aura-wheel-type-attr";
import { RagingBullTypeAttr } from "#app/data/move-attrs/raging-bull-type-attr";
import { IvyCudgelTypeAttr } from "#app/data/move-attrs/ivy-cudgel-type-attr";
import { WeatherBallTypeAttr } from "#app/data/move-attrs/weather-ball-type-attr";
import { TerrainPulseTypeAttr } from "#app/data/move-attrs/terrain-pulse-type-attr";
import { HiddenPowerTypeAttr } from "#app/data/move-attrs/hidden-power-type-attr";
import { TeraBlastTypeAttr } from "#app/data/move-attrs/tera-blast-type-attr";
import { MatchUserTypeAttr } from "#app/data/move-attrs/match-user-type-attr";
import { CombinedPledgeTypeAttr } from "#app/data/move-attrs/combined-pledge-type-attr";
import { NeutralDamageAgainstFlyingTypeMultiplierAttr } from "#app/data/move-attrs/neutral-damage-against-flying-type-multiplier-attr";
import { IceNoEffectTypeAttr } from "#app/data/move-attrs/ice-no-effect-type-attr";
import { FlyingTypeMultiplierAttr } from "#app/data/move-attrs/flying-type-multiplier-attr";
import { FreezeDryAttr } from "#app/data/move-attrs/freeze-dry-attr";
import { OneHitKOAccuracyAttr } from "#app/data/move-attrs/one-hit-ko-accuracy-attr";
import { SheerColdAccuracyAttr } from "#app/data/move-attrs/sheer-cold-accuracy-attr";
import { MissEffectAttr } from "#app/data/move-attrs/miss-effect-attr";
import { NoEffectAttr } from "#app/data/move-attrs/no-effect-attr";
import { TypelessAttr } from "#app/data/move-attrs/typeless-attr";
import { BypassRedirectAttr } from "#app/data/move-attrs/bypass-redirect-attr";
import { FrenzyAttr } from "#app/data/move-attrs/frenzy-attr";
import { SemiInvulnerableAttr } from "#app/data/move-attrs/semi-invulnerable-attr";
import { GulpMissileTagAttr } from "#app/data/move-attrs/gulp-missile-tag-attr";
import { RemoveAllSubstitutesAttr } from "#app/data/move-attrs/remove-all-substitutes-attr";
import { HitsTagAttr } from "#app/data/move-attrs/hits-tag-attr";
import { HitsTagForDoubleDamageAttr } from "#app/data/move-attrs/hits-tag-for-double-damage-attr";
import { RevivalBlessingAttr } from "#app/data/move-attrs/revival-blessing-attr";
import { ForceSwitchOutAttr } from "#app/data/move-attrs/force-switch-out-attr";
import { ChillyReceptionAttr } from "#app/data/move-attrs/chilly-reception-attr";
import { RemoveTypeAttr } from "#app/data/move-attrs/remove-type-attr";
import { CopyTypeAttr } from "#app/data/move-attrs/copy-type-attr";
import { CopyBiomeTypeAttr } from "#app/data/move-attrs/copy-biome-type-attr";
import { FirstMoveTypeAttr } from "#app/data/move-attrs/first-move-type-attr";
import { ChangeTypeAttr } from "#app/data/move-attrs/change-type-attr";
import { AddTypeAttr } from "#app/data/move-attrs/add-type-attr";
import { RandomMovesetMoveAttr } from "#app/data/move-attrs/random-moveset-move-attr";
import { RandomMoveAttr } from "#app/data/move-attrs/random-move-attr";
import { NaturePowerAttr } from "#app/data/move-attrs/nature-power-attr";
import { CopyMoveAttr } from "#app/data/move-attrs/copy-move-attr";
import { RepeatMoveAttr } from "#app/data/move-attrs/repeat-move-attr";
import { ReducePpMoveAttr } from "#app/data/move-attrs/reduce-pp-move-attr";
import { AttackReducePpMoveAttr } from "#app/data/move-attrs/attack-reduce-pp-move-attr";
import { AbilityChangeAttr } from "#app/data/move-attrs/ability-change-attr";
import { AbilityCopyAttr } from "#app/data/move-attrs/ability-copy-attr";
import { SuppressAbilitiesAttr } from "#app/data/move-attrs/suppress-abilities-attr";
import { SwitchAbilitiesAttr } from "#app/data/move-attrs/switch-abilities-attr";
import { AbilityGiveAttr } from "#app/data/move-attrs/ability-give-attr";
import { SuppressAbilitiesIfActedAttr } from "#app/data/move-attrs/suppress-abilities-if-acted-attr";
import { TransformAttr } from "#app/data/move-attrs/transform-attr";
import { SwapStatAttr } from "#app/data/move-attrs/swap-stat-attr";
import { ShiftStatAttr } from "#app/data/move-attrs/shift-stat-attr";
import { DiscourageFrequentUseAttr } from "#app/data/move-attrs/discourage-frequent-use-attr";
import { AddBattlerTagIfBoostedAttr } from "#app/data/move-attrs/add-battler-tag-if-boosted-attr";
import { StatusIfBoostedAttr } from "#app/data/move-attrs/status-if-boosted-attr";
import { MoneyAttr } from "#app/data/move-attrs/money-attr";
import { AverageStatsAttr } from "#app/data/move-attrs/average-stats-attr";
import { DestinyBondAttr } from "#app/data/move-attrs/destiny-bond-attr";
import { LastResortAttr } from "#app/data/move-attrs/last-resort-attr";
import { VariableTargetAttr } from "#app/data/move-attrs/variable-target-attr";
import { AfterYouAttr } from "#app/data/move-attrs/after-you-attr";
import { AttackedByItemAttr } from "#app/data/move-attrs/attacked-by-item-attr";
import { HitsSameTypeAttr } from "#app/data/move-attrs/hits-same-type-attr";
import { ResistLastMoveTypeAttr } from "#app/data/move-attrs/resist-last-move-type-attr";

export type MoveConditionFunc = (user: Pokemon, target: Pokemon, move: Move) => boolean;
export type UserMoveConditionFunc = (user: Pokemon, move: Move) => boolean;

export abstract class Move implements Localizable {
  public id: Moves;
  public name: string;
  private _type: Type;
  private _category: MoveCategory;
  public moveTarget: MoveTarget;
  public power: number;
  public accuracy: number;
  public pp: number;
  public effect: string;
  /** The chance of a move's secondary effects activating */
  public chance: number;
  public priority: number;
  public generation: number;
  public attrs: MoveAttr[] = [];
  private conditions: MoveCondition[] = [];
  /** The move's {@linkcode MoveFlags} */
  private flags: number = 0;
  private nameAppend: string = "";

  constructor(
    id: Moves,
    type: Type,
    category: MoveCategory,
    defaultMoveTarget: MoveTarget,
    power: number,
    accuracy: number,
    pp: number,
    chance: number,
    priority: number,
    generation: number,
  ) {
    this.id = id;
    this._type = type;
    this._category = category;
    this.moveTarget = defaultMoveTarget;
    this.power = power;
    this.accuracy = accuracy;
    this.pp = pp;
    this.chance = chance;
    this.priority = priority;
    this.generation = generation;

    if (defaultMoveTarget === MoveTarget.USER) {
      this.setFlag(MoveFlags.IGNORE_PROTECT, true);
    }
    if (category === MoveCategory.PHYSICAL) {
      this.setFlag(MoveFlags.MAKES_CONTACT, true);
    }

    this.localize();
  }

  get type() {
    return this._type;
  }
  get category() {
    return this._category;
  }

  localize(): void {
    const i18nKey = Moves[this.id]
      .split("_")
      .filter((f) => f)
      .map((f, i) => (i ? `${f[0]}${f.slice(1).toLowerCase()}` : f.toLowerCase()))
      .join("") as unknown as string;

    this.name = this.id ? `${i18next.t(`move:${i18nKey}.name`)}${this.nameAppend}` : "";
    this.effect = this.id ? `${i18next.t(`move:${i18nKey}.effect`)}${this.nameAppend}` : "";
  }

  /**
   * Get all move attributes that match `attrType`
   * @param attrType any attribute that extends {@linkcode MoveAttr}
   * @returns Array of attributes that match `attrType`, Empty Array if none match.
   */
  getAttrs<T extends MoveAttr>(attrType: Constructor<T>): T[] {
    return this.attrs.filter((a): a is T => a instanceof attrType);
  }

  /**
   * Check if a move has an attribute that matches `attrType`
   * @param attrType any attribute that extends {@linkcode MoveAttr}
   * @returns true if the move has attribute `attrType`
   */
  hasAttr<T extends MoveAttr>(attrType: Constructor<T>): boolean {
    return this.attrs.some((attr) => attr instanceof attrType);
  }

  /**
   * Takes as input a boolean function and returns the first MoveAttr in attrs that matches true
   * @param attrPredicate
   * @returns the first {@linkcode MoveAttr} element in attrs that makes the input function return true
   */
  findAttr(attrPredicate: (attr: MoveAttr) => boolean): MoveAttr {
    return this.attrs.find(attrPredicate)!; // TODO: is the bang correct?
  }

  /**
   * Adds a new MoveAttr to the move (appends to the attr array)
   * if the MoveAttr also comes with a condition, also adds that to the conditions array: {@linkcode MoveCondition}
   * @param AttrType {@linkcode MoveAttr} the constructor of a MoveAttr class
   * @param args the args needed to instantiate a the given class
   * @returns the called object {@linkcode Move}
   */
  attr<T extends Constructor<MoveAttr>>(AttrType: T, ...args: ConstructorParameters<T>): this {
    const attr = new AttrType(...args);
    this.attrs.push(attr);
    let attrCondition = attr.getCondition();
    if (attrCondition) {
      if (typeof attrCondition === "function") {
        attrCondition = new MoveCondition(attrCondition);
      }
      this.conditions.push(attrCondition);
    }

    return this;
  }

  /**
   * Adds a new MoveAttr to the move (appends to the attr array)
   * if the MoveAttr also comes with a condition, also adds that to the conditions array: {@linkcode MoveCondition}
   * Almost identical to {@link attr}, except you are passing in a MoveAttr object, instead of a constructor and it's arguments
   * @param attrAdd {@linkcode MoveAttr} the attribute to add
   * @returns the called object {@linkcode Move}
   */
  addAttr(attrAdd: MoveAttr): this {
    this.attrs.push(attrAdd);
    let attrCondition = attrAdd.getCondition();
    if (attrCondition) {
      if (typeof attrCondition === "function") {
        attrCondition = new MoveCondition(attrCondition);
      }
      this.conditions.push(attrCondition);
    }

    return this;
  }

  /**
   * Sets the move target of this move
   * @param moveTarget {@linkcode MoveTarget} the move target to set
   * @returns the called object {@linkcode Move}
   */
  target(moveTarget: MoveTarget): this {
    this.moveTarget = moveTarget;
    return this;
  }

  /**
   * Getter function that returns if this Move has a MoveFlag
   * @param flag {@linkcode MoveFlags} to check
   * @returns boolean
   */
  hasFlag(flag: MoveFlags): boolean {
    // internally it is taking the bitwise AND (MoveFlags are represented as bit-shifts) and returning False if result is 0 and true otherwise
    return !!(this.flags & flag);
  }

  /**
   * Getter function that returns if the move hits multiple targets
   * @returns boolean
   */
  isMultiTarget(): boolean {
    switch (this.moveTarget) {
      case MoveTarget.ALL_OTHERS:
      case MoveTarget.ALL_NEAR_OTHERS:
      case MoveTarget.ALL_NEAR_ENEMIES:
      case MoveTarget.ALL_ENEMIES:
      case MoveTarget.USER_AND_ALLIES:
      case MoveTarget.ALL:
      case MoveTarget.USER_SIDE:
      case MoveTarget.ENEMY_SIDE:
      case MoveTarget.BOTH_SIDES:
        return true;
    }
    return false;
  }

  /**
   * Getter function that returns if the move targets the user or its ally
   * @returns boolean
   */
  isAllyTarget(): boolean {
    switch (this.moveTarget) {
      case MoveTarget.USER:
      case MoveTarget.NEAR_ALLY:
      case MoveTarget.ALLY:
      case MoveTarget.USER_OR_NEAR_ALLY:
      case MoveTarget.USER_AND_ALLIES:
      case MoveTarget.USER_SIDE:
        return true;
    }
    return false;
  }

  isFieldTarget(): boolean {
    switch (this.moveTarget) {
      case MoveTarget.BOTH_SIDES:
      case MoveTarget.USER_SIDE:
      case MoveTarget.ENEMY_SIDE:
        return true;
    }
    return false;
  }

  isChargingMove(): this is ChargingMove {
    return false;
  }

  /**
   * Checks if the move is immune to certain types.
   * Currently looks at cases of Grass types with powder moves and Dark types with moves affected by Prankster.
   * @param user the source of this move
   * @param target the target of this move
   * @param type the type of the move's target
   * @returns boolean
   */
  isTypeImmune(user: Pokemon, target: Pokemon, type: Type): boolean {
    if (this.moveTarget === MoveTarget.USER) {
      return false;
    }

    switch (type) {
      case Type.GRASS:
        if (this.hasFlag(MoveFlags.POWDER_MOVE)) {
          return true;
        }
        break;
      case Type.DARK:
        if (
          user.hasAbility(Abilities.PRANKSTER)
          && this.category === MoveCategory.STATUS
          && user.isPlayer() !== target.isPlayer()
        ) {
          return true;
        }
        break;
    }
    return false;
  }

  /**
   * Checks if the move would hit its target's Substitute instead of the target itself.
   * @param user The {@linkcode Pokemon} using this move
   * @param target The {@linkcode Pokemon} targeted by this move
   * @returns `true` if the move can bypass the target's Substitute; `false` otherwise.
   */
  hitsSubstitute(user: Pokemon, target: Pokemon | nil): boolean {
    if (
      [MoveTarget.USER, MoveTarget.USER_SIDE, MoveTarget.ENEMY_SIDE, MoveTarget.BOTH_SIDES].includes(this.moveTarget)
      || !target?.getTag(BattlerTagType.SUBSTITUTE)
    ) {
      return false;
    }

    const bypassed = new BooleanHolder(false);
    // TODO: Allow this to be simulated
    applyAbAttrs(InfiltratorAbAttr, user, null, false, bypassed);

    return !bypassed.value && !this.hasFlag(MoveFlags.SOUND_BASED) && !this.hasFlag(MoveFlags.IGNORE_SUBSTITUTE);
  }

  /**
   * Adds a move condition to the move
   * @param condition {@linkcode MoveCondition} or {@linkcode MoveConditionFunc}, appends to conditions array a new MoveCondition object
   * @returns the called object {@linkcode Move}
   */
  condition(condition: MoveCondition | MoveConditionFunc): this {
    if (typeof condition === "function") {
      condition = new MoveCondition(condition as MoveConditionFunc);
    }
    this.conditions.push(condition);

    return this;
  }

  /**
   * Internal dev flag for documenting edge cases. When using this, please document the known edge case.
   * @returns the called object {@linkcode Move}
   */
  edgeCase(): this {
    return this;
  }

  /**
   * Marks the move as "partial": appends texts to the move name
   * @returns the called object {@linkcode Move}
   */
  partial(): this {
    this.nameAppend += " (P)";
    return this;
  }

  /**
   * Marks the move as "unimplemented": appends texts to the move name
   * @returns the called object {@linkcode Move}
   */
  unimplemented(): this {
    this.nameAppend += " (N)";
    return this;
  }

  /**
   * Sets the flags of the move
   * @param flag {@linkcode MoveFlags}
   * @param on a boolean, if True, then "ORs" the flag onto existing ones, if False then "XORs" the flag onto existing ones
   */
  private setFlag(flag: MoveFlags, on: boolean): void {
    // bitwise OR and bitwise XOR respectively
    if (on) {
      this.flags |= flag;
    } else {
      this.flags ^= flag;
    }
  }

  /**
   * Sets the {@linkcode MoveFlags.MAKES_CONTACT} flag for the calling Move
   * @param setFlag Default `true`, set to `false` if the move doesn't make contact
   * @see {@linkcode Abilities.STATIC}
   * @returns The {@linkcode Move} that called this function
   */
  makesContact(setFlag: boolean = true): this {
    this.setFlag(MoveFlags.MAKES_CONTACT, setFlag);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_PROTECT} flag for the calling Move
   * @see {@linkcode Moves.CURSE}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresProtect(): this {
    this.setFlag(MoveFlags.IGNORE_PROTECT, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_VIRTUAL} flag for the calling Move
   * @see {@linkcode Moves.NATURE_POWER}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresVirtual(): this {
    this.setFlag(MoveFlags.IGNORE_VIRTUAL, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.SOUND_BASED} flag for the calling Move
   * @see {@linkcode Moves.UPROAR}
   * @returns The {@linkcode Move} that called this function
   */
  soundBased(): this {
    this.setFlag(MoveFlags.SOUND_BASED, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.HIDE_USER} flag for the calling Move
   * @see {@linkcode Moves.TELEPORT}
   * @returns The {@linkcode Move} that called this function
   */
  hidesUser(): this {
    this.setFlag(MoveFlags.HIDE_USER, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.HIDE_TARGET} flag for the calling Move
   * @see {@linkcode Moves.WHIRLWIND}
   * @returns The {@linkcode Move} that called this function
   */
  hidesTarget(): this {
    this.setFlag(MoveFlags.HIDE_TARGET, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.BITING_MOVE} flag for the calling Move
   * @see {@linkcode Moves.BITE}
   * @returns The {@linkcode Move} that called this function
   */
  bitingMove(): this {
    this.setFlag(MoveFlags.BITING_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.PULSE_MOVE} flag for the calling Move
   * @see {@linkcode Moves.WATER_PULSE}
   * @returns The {@linkcode Move} that called this function
   */
  pulseMove(): this {
    this.setFlag(MoveFlags.PULSE_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.PUNCHING_MOVE} flag for the calling Move
   * @see {@linkcode Moves.DRAIN_PUNCH}
   * @returns The {@linkcode Move} that called this function
   */
  punchingMove(): this {
    this.setFlag(MoveFlags.PUNCHING_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.SLICING_MOVE} flag for the calling Move
   * @see {@linkcode Moves.X_SCISSOR}
   * @returns The {@linkcode Move} that called this function
   */
  slicingMove(): this {
    this.setFlag(MoveFlags.SLICING_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.RECKLESS_MOVE} flag for the calling Move
   * @see {@linkcode Abilities.RECKLESS}
   * @returns The {@linkcode Move} that called this function
   */
  recklessMove(): this {
    this.setFlag(MoveFlags.RECKLESS_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.BALLBOMB_MOVE} flag for the calling Move
   * @see {@linkcode Moves.ELECTRO_BALL}
   * @returns The {@linkcode Move} that called this function
   */
  ballBombMove(): this {
    this.setFlag(MoveFlags.BALLBOMB_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.POWDER_MOVE} flag for the calling Move
   * @see {@linkcode Moves.STUN_SPORE}
   * @returns The {@linkcode Move} that called this function
   */
  powderMove(): this {
    this.setFlag(MoveFlags.POWDER_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.DANCE_MOVE} flag for the calling Move
   * @see {@linkcode Moves.PETAL_DANCE}
   * @returns The {@linkcode Move} that called this function
   */
  danceMove(): this {
    this.setFlag(MoveFlags.DANCE_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.WIND_MOVE} flag for the calling Move
   * @see {@linkcode Moves.HURRICANE}
   * @returns The {@linkcode Move} that called this function
   */
  windMove(): this {
    this.setFlag(MoveFlags.WIND_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.TRIAGE_MOVE} flag for the calling Move
   * @see {@linkcode Moves.ABSORB}
   * @returns The {@linkcode Move} that called this function
   */
  triageMove(): this {
    this.setFlag(MoveFlags.TRIAGE_MOVE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_ABILITIES} flag for the calling Move
   * @see {@linkcode Moves.SUNSTEEL_STRIKE}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresAbilities(): this {
    this.setFlag(MoveFlags.IGNORE_ABILITIES, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.CHECK_ALL_HITS} flag for the calling Move
   * @see {@linkcode Moves.TRIPLE_AXEL}
   * @returns The {@linkcode Move} that called this function
   */
  checkAllHits(): this {
    this.setFlag(MoveFlags.CHECK_ALL_HITS, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.IGNORE_SUBSTITUTE} flag for the calling Move
   * @see {@linkcode Moves.WHIRLWIND}
   * @returns The {@linkcode Move} that called this function
   */
  ignoresSubstitute(): this {
    this.setFlag(MoveFlags.IGNORE_SUBSTITUTE, true);
    return this;
  }

  /**
   * Sets the {@linkcode MoveFlags.REDIRECT_COUNTER} flag for the calling Move
   * @see {@linkcode Moves.METAL_BURST}
   * @returns The {@linkcode Move} that called this function
   */
  redirectCounter(): this {
    this.setFlag(MoveFlags.REDIRECT_COUNTER, true);
    return this;
  }

  /**
   * Checks if the move flag applies to the pokemon(s) using/receiving the move
   * @param flag {@linkcode MoveFlags} MoveFlag to check on user and/or target
   * @param user {@linkcode Pokemon} the Pokemon using the move
   * @param target {@linkcode Pokemon} the Pokemon receiving the move
   * @returns boolean
   */
  checkFlag(flag: MoveFlags, user: Pokemon, target: Pokemon | null): boolean {
    // special cases below, eg: if the move flag is MAKES_CONTACT, and the user pokemon has an ability that ignores contact (like "Long Reach"), then overrides and move does not make contact
    switch (flag) {
      case MoveFlags.MAKES_CONTACT:
        if (user.hasAbilityWithAttr(IgnoreContactAbAttr) || this.hitsSubstitute(user, target)) {
          return false;
        }
        break;
      case MoveFlags.IGNORE_ABILITIES:
        if (user.hasAbilityWithAttr(MoveAbilityBypassAbAttr)) {
          const abilityEffectsIgnored = new BooleanHolder(false);
          applyAbAttrs(MoveAbilityBypassAbAttr, user, abilityEffectsIgnored, false, this);
          if (abilityEffectsIgnored.value) {
            return true;
          }
        }
        break;
      case MoveFlags.IGNORE_PROTECT:
        if (
          user.hasAbilityWithAttr(IgnoreProtectOnContactAbAttr)
          && this.checkFlag(MoveFlags.MAKES_CONTACT, user, null)
        ) {
          return true;
        }
        break;
    }

    return !!(this.flags & flag);
  }

  /**
   * Applies each {@linkcode MoveCondition} function of this move to the params, determines if the move can be used prior to calling each attribute's apply()
   * @param user {@linkcode Pokemon} to apply conditions to
   * @param target {@linkcode Pokemon} to apply conditions to
   * @param move {@linkcode Move} to apply conditions to
   * @returns boolean: false if any of the apply()'s return false, else true
   */
  applyConditions(user: Pokemon, target: Pokemon, move: Move): boolean {
    for (const condition of this.conditions) {
      if (!condition.apply(user, target, move)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Sees if a move has a custom failure text (by looking at each {@linkcode MoveAttr} of this move)
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @param cancelled {@linkcode BooleanHolder} to hold boolean value
   * @returns string of the custom failure text, or `null` if it uses the default text ("But it failed!")
   */
  getFailedText(user: Pokemon, target: Pokemon, move: Move, cancelled: BooleanHolder): string | null {
    for (const attr of this.attrs) {
      const failedText = attr.getFailedText(user, target, move, cancelled);
      if (failedText !== null) {
        return failedText;
      }
    }
    return null;
  }

  /**
   * Calculates the userBenefitScore across all the attributes and conditions
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @returns integer representing the total benefitScore
   */
  getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let score = 0;

    for (const attr of this.attrs) {
      score += attr.getUserBenefitScore(user, target, move);
    }

    for (const condition of this.conditions) {
      score += condition.getUserBenefitScore(user, target, move);
    }

    return score;
  }

  /**
   * Calculates the targetBenefitScore across all the attributes
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} receiving the move
   * @param move {@linkcode Move} using the move
   * @returns integer representing the total benefitScore
   */
  getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let score = 0;

    if (target.getAlly()?.getTag(BattlerTagType.COMMANDED)?.getSourcePokemon() === target) {
      return 20 * (target.isPlayer() === user.isPlayer() ? -1 : 1); // always -20 with how the AI handles this score
    }

    for (const attr of this.attrs) {
      // conditionals to check if the move is self targeting (if so then you are applying the move to yourself, not the target)
      score +=
        attr.getTargetBenefitScore(user, !attr.selfTarget ? target : user, move)
        * (target !== user && attr.selfTarget ? -1 : 1);
    }

    return score;
  }

  /**
   * Calculates the accuracy of a move in battle based on various conditions and attributes.
   *
   * @param user {@linkcode Pokemon} The Pokémon using the move.
   * @param target {@linkcode Pokemon} The Pokémon being targeted by the move.
   * @returns The calculated accuracy of the move.
   */
  calculateBattleAccuracy(user: Pokemon, target: Pokemon, simulated: boolean = false) {
    const moveAccuracy = new NumberHolder(this.accuracy);

    applyMoveAttrs(VariableAccuracyAttr, user, target, this, moveAccuracy);
    applyPreDefendAbAttrs(WonderSkinAbAttr, target, user, this, { value: false }, simulated, moveAccuracy);

    if (moveAccuracy.value === -1) {
      return moveAccuracy.value;
    }

    const isOhko = this.hasAttr(OneHitKOAccuracyAttr);

    if (!isOhko) {
      globalScene.applyModifiers(PokemonMoveAccuracyBoosterModifier, user.isPlayer(), user, moveAccuracy);
    }

    if (globalScene.arena.weather?.weatherType === WeatherType.FOG) {
      /**
       *  The 0.9 multiplier is Game-specific implementation, Bulbapedia uses 3/5
       *  See Fog {@link https://bulbapedia.bulbagarden.net/wiki/Fog}
       */
      moveAccuracy.value = Math.floor(moveAccuracy.value * 0.9);
    }

    if (!isOhko && globalScene.arena.getTag(ArenaTagType.GRAVITY)) {
      moveAccuracy.value = Math.floor(moveAccuracy.value * 1.67);
    }

    return moveAccuracy.value;
  }

  /**
   * Calculates the power of a move in battle based on various conditions and attributes.
   *
   * @param source {@linkcode Pokemon} The Pokémon using the move.
   * @param target {@linkcode Pokemon} The Pokémon being targeted by the move.
   * @returns The calculated power of the move.
   */
  calculateBattlePower(source: Pokemon, target: Pokemon, simulated: boolean = false): number {
    if (this.category === MoveCategory.STATUS) {
      return -1;
    }

    const power = new NumberHolder(this.power);
    const typeChangeMovePowerMultiplier = new NumberHolder(1);

    applyPreAttackAbAttrs(MoveTypeChangeAbAttr, source, target, this, true, null, typeChangeMovePowerMultiplier);

    const sourceTeraType = source.getTeraType();
    if (
      sourceTeraType !== Type.UNKNOWN
      && sourceTeraType === this.type
      && power.value < 60
      && this.priority <= 0
      && !this.hasAttr(MultiHitAttr)
      && !globalScene.findModifier((m) => m instanceof PokemonMultiHitModifier && m.pokemonId === source.id)
    ) {
      power.value = 60;
    }

    applyPreAttackAbAttrs(VariableMovePowerAbAttr, source, target, this, simulated, power);

    if (source.getAlly()) {
      applyPreAttackAbAttrs(AllyMoveCategoryPowerBoostAbAttr, source.getAlly(), target, this, simulated, power);
    }

    const fieldAuras = new Set(
      globalScene
        .getField(true)
        .map(
          (p) =>
            p.getAbilityAttrs(FieldMoveTypePowerBoostAbAttr).filter((attr) => {
              const condition = attr.getCondition();
              return !condition || condition(p);
            }) as FieldMoveTypePowerBoostAbAttr[],
        )
        .flat(),
    );
    for (const aura of fieldAuras) {
      aura.applyPreAttack(source, null, simulated, target, this, [power]);
    }

    const alliedField: Pokemon[] = source.getField();
    alliedField.forEach((p) =>
      applyPreAttackAbAttrs(UserFieldMoveTypePowerBoostAbAttr, p, target, this, simulated, power),
    );

    power.value *= typeChangeMovePowerMultiplier.value;

    const typeBoost = source.findTag((t) => t instanceof TypeBoostTag && t.boostedType === this.type) as TypeBoostTag;
    if (typeBoost) {
      power.value *= typeBoost.boostValue;
    }

    applyMoveAttrs(VariablePowerAttr, source, target, this, power);

    if (!this.hasAttr(TypelessAttr)) {
      globalScene.arena.applyTags(WeakenMoveTypeTag, simulated, this.type, power);
      globalScene.applyModifiers(AttackTypeBoosterModifier, source.isPlayer(), source, this.type, power);
    }

    if (source.getTag(HelpingHandTag)) {
      power.value *= 1.5;
    }

    return power.value;
  }

  getPriority(user: Pokemon, simulated: boolean = true) {
    const priority = new NumberHolder(this.priority);

    applyMoveAttrs(IncrementMovePriorityAttr, user, null, this, priority);
    applyAbAttrs(ChangeMovePriorityAbAttr, user, null, simulated, this, priority);

    return priority.value;
  }

  /**
   * Returns `true` if this move can be given additional strikes
   * by enhancing effects.
   * Currently used for {@link https://bulbapedia.bulbagarden.net/wiki/Parental_Bond_(Ability) | Parental Bond}
   * and {@linkcode PokemonMultiHitModifier | Multi-Lens}.
   * @param user The {@linkcode Pokemon} using the move
   * @param restrictSpread `true` if the enhancing effect
   * should not affect multi-target moves (default `false`)
   */
  canBeMultiStrikeEnhanced(user: Pokemon, restrictSpread: boolean = false): boolean {
    // Multi-strike enhancers...

    // ...cannot enhance moves that hit multiple targets
    const { targets, multiple } = getMoveTargets(user, this.id);
    const isMultiTarget = multiple && targets.length > 1;

    // ...cannot enhance multi-hit or sacrificial moves
    const exceptAttrs: Constructor<MoveAttr>[] = [MultiHitAttr, SacrificialAttr, SacrificialAttrOnHit];

    // ...and cannot enhance these specific moves.
    const exceptMoves: Moves[] = [Moves.FLING, Moves.UPROAR, Moves.ROLLOUT, Moves.ICE_BALL, Moves.ENDEAVOR];

    return (
      (!restrictSpread || !isMultiTarget)
      && !this.isChargingMove()
      && !exceptAttrs.some((attr) => this.hasAttr(attr))
      && !exceptMoves.some((id) => this.id === id)
      && this.category !== MoveCategory.STATUS
    );
  }
}

const hasStockpileStacksCondition: MoveConditionFunc = (user) => {
  const hasStockpilingTag = user.getTag(StockpilingTag);
  return !!hasStockpilingTag && hasStockpilingTag.stockpiledCount > 0;
};

const crashDamageFunc = (user: Pokemon, _move: Move) => {
  const cancelled = new BooleanHolder(false);
  applyAbAttrs(BlockNonDirectDamageAbAttr, user, cancelled);
  if (cancelled.value) {
    return false;
  }

  user.damageAndUpdate(toDmgValue(user.getMaxHp() / 2), HitResult.OTHER, false, true);
  globalScene.queueMessage(
    i18next.t("moveTriggers:keptGoingAndCrashed", { pokemonName: getPokemonNameWithAffix(user) }),
  );
  user.turnData.damageTaken += toDmgValue(user.getMaxHp() / 2);

  return true;
};

export const frenzyMissFunc: UserMoveConditionFunc = (user: Pokemon, move: Move) => {
  while (user.getMoveQueue().length && user.getMoveQueue()[0].move === move.id) {
    user.getMoveQueue().shift();
  }
  user.removeTag(BattlerTagType.FRENZY); // FRENZY tag should be disrupted on miss/no effect

  return true;
};

interface AddBattlerTagAttrOptions extends MoveEffectAttrOptions {
  /** Should the move fail if the target already has a tag of the same type? */
  failOnOverlap?: boolean;
  /** The minimum number of turns the tag is active */
  turnCountMin?: number;
  /** The maximum number of turns the tag is active (inclusive) */
  turnCountMax?: number;
}

export class AddBattlerTagAttr extends MoveEffectAttr {
  public tagType: BattlerTagType;
  protected override options?: AddBattlerTagAttrOptions;

  constructor(tagType: BattlerTagType, selfTarget: boolean = false, options?: AddBattlerTagAttrOptions) {
    super(selfTarget);

    this.tagType = tagType;
    this.options = options;
  }

  /**
   * If `true`, causes the move to fail if the target already
   * has a tag of the same type.
   * @default false
   */
  public get failOnOverlap() {
    return this.options?.failOnOverlap ?? false;
  }

  /**
   * The minimum number of turns the tag is active
   * @default 0
   */
  public get turnCountMin() {
    return this.options?.turnCountMin ?? 0;
  }

  /**
   * The maximum number of turns the tag is active.
   * @default turnCountMin
   */
  public get turnCountMax() {
    return this.options?.turnCountMax ?? this.turnCountMin;
  }

  override canApply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.canApply(user, target, move, args)) {
      return false;
    } else {
      return true;
    }
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      return (this.selfTarget ? user : target).addTag(
        this.tagType,
        user.randSeedIntRange(this.turnCountMin, this.turnCountMax),
        move.id,
        user.id,
      );
    }

    return false;
  }

  override getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap ? (user, target, _move) => !(this.selfTarget ? user : target).getTag(this.tagType) : null;
  }

  getTagTargetBenefitScore(): number {
    switch (this.tagType) {
      case BattlerTagType.RECHARGING:
      case BattlerTagType.PERISH_SONG:
        return -16;
      case BattlerTagType.FLINCHED:
      case BattlerTagType.CONFUSED:
      case BattlerTagType.INFATUATED:
      case BattlerTagType.NIGHTMARE:
      case BattlerTagType.DROWSY:
      case BattlerTagType.DISABLED:
      case BattlerTagType.HEAL_BLOCK:
      case BattlerTagType.RECEIVE_DOUBLE_DAMAGE:
        return -5;
      case BattlerTagType.SEEDED:
      case BattlerTagType.SALT_CURED:
      case BattlerTagType.CURSED:
      case BattlerTagType.FRENZY:
      case BattlerTagType.TRAPPED:
      case BattlerTagType.BIND:
      case BattlerTagType.WRAP:
      case BattlerTagType.FIRE_SPIN:
      case BattlerTagType.WHIRLPOOL:
      case BattlerTagType.CLAMP:
      case BattlerTagType.SAND_TOMB:
      case BattlerTagType.MAGMA_STORM:
      case BattlerTagType.SNAP_TRAP:
      case BattlerTagType.THUNDER_CAGE:
      case BattlerTagType.INFESTATION:
        return -3;
      case BattlerTagType.ENCORE:
        return -2;
      case BattlerTagType.MINIMIZED:
      case BattlerTagType.ALWAYS_GET_HIT:
        return 0;
      case BattlerTagType.INGRAIN:
      case BattlerTagType.IGNORE_ACCURACY:
      case BattlerTagType.AQUA_RING:
        return 3;
      case BattlerTagType.PROTECTED:
      case BattlerTagType.FLYING:
      case BattlerTagType.CRIT_BOOST:
      case BattlerTagType.ALWAYS_CRIT:
        return 5;
      default:
        console.warn(`BattlerTag ${BattlerTagType[this.tagType]} is missing a score!`);
        return 0;
    }
  }

  override getTargetBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    let moveChance = this.getMoveChance(user, target, move, this.selfTarget, false);
    if (moveChance < 0) {
      moveChance = 100;
    }
    return Math.floor(this.getTagTargetBenefitScore() * (moveChance / 100));
  }
}

/**
 * Adds a {@link https://bulbapedia.bulbagarden.net/wiki/Seeding | Seeding} effect to the target
 * as seen with Leech Seed and Sappy Seed.
 * @extends AddBattlerTagAttr
 */
export class LeechSeedAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.SEEDED);
  }
}

/**
 * Attribute to implement Jaw Lock's linked trapping effect between the user and target
 * @extends AddBattlerTagAttr
 */
export class JawLockAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.TRAPPED);
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.canApply(user, target, move, args)) {
      return false;
    }

    // If either the user or the target already has the tag, do not apply
    if (user.getTag(TrappedTag) || target.getTag(TrappedTag)) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, this.selfTarget);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      /**
       * Add the tag to both the user and the target.
       * The target's tag source is considered to be the user and vice versa
       */
      return (
        target.addTag(BattlerTagType.TRAPPED, 1, move.id, user.id)
        && user.addTag(BattlerTagType.TRAPPED, 1, move.id, target.id)
      );
    }

    return false;
  }
}

export class CurseAttr extends MoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, _args: any[]): boolean {
    if (user.getTypes(true).includes(Type.GHOST)) {
      if (target.getTag(BattlerTagType.CURSED)) {
        globalScene.queueMessage(i18next.t("battle:attackFailed"));
        return false;
      }
      const curseRecoilDamage = Math.max(1, Math.floor(user.getMaxHp() / 2));
      user.damageAndUpdate(curseRecoilDamage, HitResult.OTHER, false, true, true);
      globalScene.queueMessage(
        i18next.t("battlerTags:cursedOnAdd", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          pokemonName: getPokemonNameWithAffix(target),
        }),
      );

      target.addTag(BattlerTagType.CURSED, 0, move.id, user.id);
      return true;
    } else {
      globalScene.unshiftPhase(new StatStageChangePhase(user.getBattlerIndex(), true, [Stat.ATK, Stat.DEF], 1));
      globalScene.unshiftPhase(new StatStageChangePhase(user.getBattlerIndex(), true, [Stat.SPD], -1));
      return true;
    }
  }
}

export class LapseBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).lapseTag(tagType);
    }

    return true;
  }
}

export class RemoveBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).removeTag(tagType);
    }

    return true;
  }
}

export class FlinchAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.FLINCHED, false);
  }
}

export class ConfuseAttr extends AddBattlerTagAttr {
  constructor(selfTarget?: boolean) {
    super(BattlerTagType.CONFUSED, selfTarget, { turnCountMin: 2, turnCountMax: 5 });
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!this.selfTarget && target.isSafeguarded(user)) {
      if (move.category === MoveCategory.STATUS) {
        globalScene.queueMessage(i18next.t("moveTriggers:safeguard", { targetName: getPokemonNameWithAffix(target) }));
      }
      return false;
    }

    return super.apply(user, target, move, args);
  }
}

export class RechargeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.RECHARGING, true, { turnCountMin: 1, lastHitOnly: true });
  }
}

export class TrapAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, { turnCountMin: 4, turnCountMax: 5 });
  }
}

export class ProtectAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType = BattlerTagType.PROTECTED) {
    super(tagType, true);
  }

  override getCondition(): MoveConditionFunc {
    return (user, _target, _move): boolean => {
      let timesUsed = 0;
      const moveHistory = user.getLastXMoves();
      let turnMove: TurnMove | undefined;

      while (moveHistory.length) {
        turnMove = moveHistory.shift();
        if (!allMoves[turnMove?.move ?? Moves.NONE].hasAttr(ProtectAttr) || turnMove?.result !== MoveResult.SUCCESS) {
          break;
        }
        timesUsed++;
      }
      if (timesUsed) {
        return !user.randSeedInt(Math.pow(3, timesUsed));
      }
      return true;
    };
  }
}

export class IgnoreAccuracyAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.IGNORE_ACCURACY, true, { turnCountMin: 2 });
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    globalScene.queueMessage(
      i18next.t("moveTriggers:tookAimAtTarget", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}

export class FaintCountdownAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.PERISH_SONG, false, {
      failOnOverlap: true,
      turnCountMin: 4,
    });
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    globalScene.queueMessage(
      i18next.t("moveTriggers:faintCountdown", {
        pokemonName: getPokemonNameWithAffix(target),
        turnCount: this.turnCountMin - 1,
      }),
    );

    return true;
  }
}

export class AddArenaTagAttr extends MoveEffectAttr {
  public tagType: ArenaTagType;
  public turnCount: number;
  private failOnOverlap: boolean;
  public selfSideTarget: boolean;

  constructor(
    tagType: ArenaTagType,
    turnCount?: number | null,
    failOnOverlap: boolean = false,
    selfSideTarget: boolean = false,
  ) {
    super(true);

    this.tagType = tagType;
    this.turnCount = turnCount!; // TODO: is the bang correct?
    this.failOnOverlap = failOnOverlap;
    this.selfSideTarget = selfSideTarget;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (
      (move.chance < 0 || move.chance === 100 || user.randSeedInt(100) < move.chance)
      && user.getLastXMoves(1)[0]?.result === MoveResult.SUCCESS
    ) {
      const side = (this.selfSideTarget ? user : target).getArenaTagSide();
      globalScene.arena.addTag(this.tagType, this.turnCount, move.id, user.id, side);
      return true;
    }

    return false;
  }

  override getCondition(): MoveConditionFunc | null {
    return this.failOnOverlap
      ? (_user, target, _move) => !globalScene.arena.getTagOnSide(this.tagType, target.getArenaTagSide())
      : null;
  }
}

/**
 * Generic class for removing arena tags
 * @param tagTypes: The types of tags that can be removed
 * @param selfSideTarget: Is the user removing tags from its own side?
 */
export class RemoveArenaTagsAttr extends MoveEffectAttr {
  public tagTypes: ArenaTagType[];
  public selfSideTarget: boolean;

  constructor(tagTypes: ArenaTagType[], selfSideTarget: boolean) {
    super(true);

    this.tagTypes = tagTypes;
    this.selfSideTarget = selfSideTarget;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const side = (this.selfSideTarget ? user : target).getArenaTagSide();

    for (const tagType of this.tagTypes) {
      globalScene.arena.removeTagOnSide(tagType, side);
    }

    return true;
  }
}

export class AddArenaTrapTagAttr extends AddArenaTagAttr {
  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const side = (this.selfSideTarget ? user : target).getArenaTagSide();
      const tag = globalScene.arena.getTagOnSide(this.tagType, side) as ArenaTrapTag;
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    };
  }
}

/**
 * Attribute used for Stone Axe and Ceaseless Edge.
 * Applies the given ArenaTrapTag when move is used.
 * @extends AddArenaTagAttr
 * @see {@linkcode apply}
 */
export class AddArenaTrapTagHitAttr extends AddArenaTagAttr {
  /**
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, _args: any[]): boolean {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    const side = (this.selfSideTarget ? user : target).getArenaTagSide();
    const tag = globalScene.arena.getTagOnSide(this.tagType, side) as ArenaTrapTag;
    if (
      (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance)
      && user.getLastXMoves(1)[0]?.result === MoveResult.SUCCESS
    ) {
      globalScene.arena.addTag(this.tagType, 0, move.id, user.id, side);
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    }
    return false;
  }
}

export class RemoveArenaTrapAttr extends MoveEffectAttr {
  private targetBothSides: boolean;

  constructor(targetBothSides: boolean = false) {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
    this.targetBothSides = targetBothSides;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (this.targetBothSides) {
      globalScene.arena.removeTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.TOXIC_SPIKES, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.STEALTH_ROCK, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.STICKY_WEB, ArenaTagSide.PLAYER);

      globalScene.arena.removeTagOnSide(ArenaTagType.SPIKES, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.TOXIC_SPIKES, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.STEALTH_ROCK, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.STICKY_WEB, ArenaTagSide.ENEMY);
    } else {
      const opposingSide = target.getOpposingArenaTagSide();
      globalScene.arena.removeTagOnSide(ArenaTagType.SPIKES, opposingSide);
      globalScene.arena.removeTagOnSide(ArenaTagType.TOXIC_SPIKES, opposingSide);
      globalScene.arena.removeTagOnSide(ArenaTagType.STEALTH_ROCK, opposingSide);
      globalScene.arena.removeTagOnSide(ArenaTagType.STICKY_WEB, opposingSide);
    }

    return true;
  }
}

export class RemoveScreensAttr extends MoveEffectAttr {
  private targetBothSides: boolean;

  constructor(targetBothSides: boolean = false) {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
    this.targetBothSides = targetBothSides;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    if (this.targetBothSides) {
      globalScene.arena.removeTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.PLAYER);
      globalScene.arena.removeTagOnSide(ArenaTagType.AURORA_VEIL, ArenaTagSide.PLAYER);

      globalScene.arena.removeTagOnSide(ArenaTagType.REFLECT, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, ArenaTagSide.ENEMY);
      globalScene.arena.removeTagOnSide(ArenaTagType.AURORA_VEIL, ArenaTagSide.ENEMY);
    } else {
      const side = target.getArenaTagSide();
      globalScene.arena.removeTagOnSide(ArenaTagType.REFLECT, side);
      globalScene.arena.removeTagOnSide(ArenaTagType.LIGHT_SCREEN, side);
      globalScene.arena.removeTagOnSide(ArenaTagType.AURORA_VEIL, side);
    }

    return true;
  }
}

/*Swaps arena effects between the player and enemy side
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class SwapArenaTagsAttr extends MoveEffectAttr {
  public SwapTags: ArenaTagType[];

  constructor(SwapTags: ArenaTagType[]) {
    super(true);
    this.SwapTags = SwapTags;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const tagPlayerTemp = globalScene.arena.findTagsOnSide(
      (t) => this.SwapTags.includes(t.tagType),
      ArenaTagSide.PLAYER,
    );
    const tagEnemyTemp = globalScene.arena.findTagsOnSide((t) => this.SwapTags.includes(t.tagType), ArenaTagSide.ENEMY);

    if (tagPlayerTemp) {
      for (const swapTagsType of tagPlayerTemp) {
        globalScene.arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.PLAYER, true);
        globalScene.arena.addTag(
          swapTagsType.tagType,
          swapTagsType.turnCount,
          swapTagsType.sourceMove,
          swapTagsType.sourceId!,
          ArenaTagSide.ENEMY,
          true,
        ); // TODO: is the bang correct?
      }
    }
    if (tagEnemyTemp) {
      for (const swapTagsType of tagEnemyTemp) {
        globalScene.arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.ENEMY, true);
        globalScene.arena.addTag(
          swapTagsType.tagType,
          swapTagsType.turnCount,
          swapTagsType.sourceMove,
          swapTagsType.sourceId!,
          ArenaTagSide.PLAYER,
          true,
        ); // TODO: is the bang correct?
      }
    }

    globalScene.queueMessage(i18next.t("moveTriggers:swapArenaTags", { pokemonName: getPokemonNameWithAffix(user) }));
    return true;
  }
}

/**
 * Attribute that adds a secondary effect to the field when two unique Pledge moves
 * are combined. The effect added varies based on the two Pledge moves combined.
 */
export class AddPledgeEffectAttr extends AddArenaTagAttr {
  private readonly requiredPledge: Moves;

  constructor(tagType: ArenaTagType, requiredPledge: Moves, selfSideTarget: boolean = false) {
    super(tagType, 4, false, selfSideTarget);

    this.requiredPledge = requiredPledge;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    // TODO: add support for `HIT` effect triggering in AddArenaTagAttr to remove the need for this check
    if (user.getLastXMoves(1)[0]?.result !== MoveResult.SUCCESS) {
      return false;
    }

    if (user.turnData.combiningPledge === this.requiredPledge) {
      return super.apply(user, target, move, args);
    }
    return false;
  }
}

// TODO: Review this
const targetMoveCopiableCondition: MoveConditionFunc = (_user, target, _move) => {
  const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
  if (!targetMoves.length) {
    return false;
  }

  const copiableMove = targetMoves[0];

  if (!copiableMove.move) {
    return false;
  }

  if (allMoves[copiableMove.move].isChargingMove() && copiableMove.result === MoveResult.OTHER) {
    return false;
  }

  // TODO: Add last turn of Bide

  return true;
};

export class MovesetCopyMoveAttr extends OverrideMoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, _args: any[]): boolean {
    const targetMoves = target.getMoveHistory().filter((m) => !m.virtual);
    if (!targetMoves.length) {
      return false;
    }

    const copiedMove = allMoves[targetMoves[0].move];

    const thisMoveIndex = user.getMoveset().findIndex((m) => m.moveId === move.id);

    if (thisMoveIndex === -1) {
      return false;
    }

    user.summonData.moveset = user.getMoveset().slice(0);
    user.summonData.moveset[thisMoveIndex] = new PokemonMove(copiedMove.id, 0, 0);

    globalScene.queueMessage(
      i18next.t("moveTriggers:copiedMove", { pokemonName: getPokemonNameWithAffix(user), moveName: copiedMove.name }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return targetMoveCopiableCondition;
  }
}

/**
 * Attribute for {@linkcode Moves.SKETCH} that causes the user to copy the opponent's last used move
 * This move copies the last used non-virtual move
 *  e.g. if Metronome is used, it copies Metronome itself, not the virtual move called by Metronome
 * Fails if the opponent has not yet used a move.
 * Fails if used on an uncopiable move, listed in unsketchableMoves in getCondition
 * Fails if the move is already in the user's moveset
 */
export class SketchAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }
  /**
   * User copies the opponent's last used move, if possible
   * @param user Pokemon that used the move and will replace Sketch with the copied move
   * @param target Pokemon that the user wants to copy a move from
   * @param move Move being used
   * @param args Unused
   * @returns `true` if the function succeeds, otherwise `false`
   */

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const targetMove = target
      .getLastXMoves(-1)
      .find((m) => m.move !== Moves.NONE && m.move !== Moves.STRUGGLE && !m.virtual);
    if (!targetMove) {
      return false;
    }

    const sketchedMove = allMoves[targetMove.move];
    const sketchIndex = user.getMoveset().findIndex((m) => m.moveId === move.id);
    if (sketchIndex === -1) {
      return false;
    }

    user.setMove(sketchIndex, sketchedMove.id);

    globalScene.queueMessage(
      i18next.t("moveTriggers:sketchedMove", {
        pokemonName: getPokemonNameWithAffix(user),
        moveName: sketchedMove.name,
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, move) => {
      if (!targetMoveCopiableCondition(user, target, move)) {
        return false;
      }

      const targetMove = target
        .getMoveHistory()
        .filter((m) => !m.virtual)
        .at(-1);
      if (!targetMove) {
        return false;
      }

      const unsketchableMoves = [
        Moves.CHATTER,
        Moves.MIRROR_MOVE,
        Moves.SLEEP_TALK,
        Moves.STRUGGLE,
        Moves.SKETCH,
        Moves.REVIVAL_BLESSING,
        Moves.TERA_STARSTORM,
        Moves.BREAKNECK_BLITZ__PHYSICAL,
        Moves.BREAKNECK_BLITZ__SPECIAL,
      ];

      if (unsketchableMoves.includes(targetMove.move)) {
        return false;
      }

      if (user.getMoveset().find((m) => m.moveId === targetMove.move)) {
        return false;
      }

      return true;
    };
  }
}

const failOnGravityCondition: MoveConditionFunc = (_user, _target, _move) =>
  !globalScene.arena.getTag(ArenaTagType.GRAVITY);

const failOnBossCondition: MoveConditionFunc = (_user, target, _move) => !target.isBossImmune();

const failIfSingleBattle: MoveConditionFunc = (_user, _target, _move) => globalScene.currentBattle.double;

const failIfDampCondition: MoveConditionFunc = (user, _target, move) => {
  const cancelled = new BooleanHolder(false);
  globalScene.getField(true).map((p) => applyAbAttrs(FieldPreventExplosiveMovesAbAttr, p, cancelled));
  // Queue a message if an ability prevented usage of the move
  if (cancelled.value) {
    globalScene.queueMessage(
      i18next.t("moveTriggers:cannotUseMove", { pokemonName: getPokemonNameWithAffix(user), moveName: move.name }),
    );
  }
  return !cancelled.value;
};

const userSleptOrComatoseCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) =>
  user.status?.effect === StatusEffect.SLEEP || user.hasAbility(Abilities.COMATOSE);

const targetSleptOrComatoseCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  target.status?.effect === StatusEffect.SLEEP || target.hasAbility(Abilities.COMATOSE);

const failIfLastCondition: MoveConditionFunc = (_user: Pokemon, _target: Pokemon, _move: Move) =>
  globalScene.phaseQueue.find((phase) => phase instanceof MovePhase) !== undefined;

const failIfLastInPartyCondition: MoveConditionFunc = (user: Pokemon, _target: Pokemon, _move: Move) => {
  const party: Pokemon[] = user.getParty();
  return party.some((pokemon) => pokemon.isActive() && !pokemon.isOnField());
};

const failIfGhostTypeCondition: MoveConditionFunc = (_user: Pokemon, target: Pokemon, _move: Move) =>
  !target.isOfType(Type.GHOST);

export type MoveAttrFilter = (attr: MoveAttr) => boolean;

function applyMoveAttrsInternal(
  attrFilter: MoveAttrFilter,
  user: Pokemon | null,
  target: Pokemon | null,
  move: Move,
  args: any[],
): void {
  move.attrs.filter((attr) => attrFilter(attr)).forEach((attr) => attr.apply(user, target, move, args));
}

function applyMoveChargeAttrsInternal(
  attrFilter: MoveAttrFilter,
  user: Pokemon | null,
  target: Pokemon | null,
  move: ChargingMove,
  args: any[],
): void {
  move.chargeAttrs.filter((attr) => attrFilter(attr)).forEach((attr) => attr.apply(user, target, move, args));
}

export function applyMoveAttrs(
  attrType: Constructor<MoveAttr>,
  user: Pokemon | null,
  target: Pokemon | null,
  move: Move,
  ...args: any[]
): void {
  applyMoveAttrsInternal((attr: MoveAttr) => attr instanceof attrType, user, target, move, args);
}

export function applyFilteredMoveAttrs(
  attrFilter: MoveAttrFilter,
  user: Pokemon,
  target: Pokemon | null,
  move: Move,
  ...args: any[]
): void {
  applyMoveAttrsInternal(attrFilter, user, target, move, args);
}

export function applyMoveChargeAttrs(
  attrType: Constructor<MoveAttr>,
  user: Pokemon | null,
  target: Pokemon | null,
  move: ChargingMove,
  ...args: any[]
): void {
  applyMoveChargeAttrsInternal((attr: MoveAttr) => attr instanceof attrType, user, target, move, args);
}

export class MoveCondition {
  protected func: MoveConditionFunc;

  constructor(func: MoveConditionFunc) {
    this.func = func;
  }

  apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    return this.func(user, target, move);
  }

  getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}

export class FirstMoveCondition extends MoveCondition {
  constructor() {
    super((user, _target, _move) => user.battleSummonData?.waveTurnCount === 1);
  }

  override getUserBenefitScore(user: Pokemon, target: Pokemon, move: Move): number {
    return this.apply(user, target, move) ? 10 : -20;
  }
}

/**
 * Condition used by the move {@link https://bulbapedia.bulbagarden.net/wiki/Upper_Hand_(move) | Upper Hand}.
 * Moves with this condition are only successful when the target has selected
 * a high-priority attack (after factoring in priority-boosting effects) and
 * hasn't moved yet this turn.
 */
export class UpperHandCondition extends MoveCondition {
  constructor() {
    super((_user, target, _move) => {
      const targetCommand = globalScene.currentBattle.turnCommands[target.getBattlerIndex()];

      return (
        !!targetCommand
        && targetCommand.command === Command.FIGHT
        && !target.turnData.acted
        && !!targetCommand.move?.move
        && allMoves[targetCommand.move.move].category !== MoveCategory.STATUS
        && allMoves[targetCommand.move.move].getPriority(target) > 0
      );
    });
  }
}

/**
 * Drops the target's immunity to types it is immune to
 * and makes its evasiveness be ignored during accuracy
 * checks. Used by: {@linkcode Moves.ODOR_SLEUTH | Odor Sleuth}, {@linkcode Moves.MIRACLE_EYE | Miracle Eye} and {@linkcode Moves.FORESIGHT | Foresight}
 *
 * @extends AddBattlerTagAttr
 * @see {@linkcode apply}
 */
export class ExposedMoveAttr extends AddBattlerTagAttr {
  constructor(tagType: BattlerTagType) {
    super(tagType, false, { failOnOverlap: true });
  }

  /**
   * Applies {@linkcode ExposedTag} to the target.
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   * @param args N/A
   * @returns `true` if the function succeeds
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    globalScene.queueMessage(
      i18next.t("moveTriggers:exposedMove", {
        pokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}

const unknownTypeCondition: MoveConditionFunc = (user, _target, _move) => !user.getTypes().includes(Type.UNKNOWN);

export type MoveTargetSet = {
  targets: BattlerIndex[];
  multiple: boolean;
};

export function getMoveTargets(user: Pokemon, move: Moves): MoveTargetSet {
  const variableTarget = new NumberHolder(0);
  user.getOpponents().forEach((p) => applyMoveAttrs(VariableTargetAttr, user, p, allMoves[move], variableTarget));

  const moveTarget = allMoves[move].hasAttr(VariableTargetAttr)
    ? variableTarget.value
    : move
      ? allMoves[move].moveTarget
      : move === undefined
        ? MoveTarget.NEAR_ENEMY
        : [];
  const opponents = user.getOpponents();

  let set: Pokemon[] = [];
  let multiple = false;

  switch (moveTarget) {
    case MoveTarget.USER:
    case MoveTarget.PARTY:
      set = [user];
      break;
    case MoveTarget.NEAR_OTHER:
    case MoveTarget.OTHER:
    case MoveTarget.DRAGON_DARTS:
    case MoveTarget.ALL_NEAR_OTHERS:
    case MoveTarget.ALL_OTHERS:
      set = opponents.concat([user.getAlly()]);
      multiple = moveTarget === MoveTarget.ALL_NEAR_OTHERS || moveTarget === MoveTarget.ALL_OTHERS;
      break;
    case MoveTarget.NEAR_ENEMY:
    case MoveTarget.ALL_NEAR_ENEMIES:
    case MoveTarget.ALL_ENEMIES:
    case MoveTarget.ENEMY_SIDE:
      set = opponents;
      multiple = moveTarget !== MoveTarget.NEAR_ENEMY;
      break;
    case MoveTarget.RANDOM_NEAR_ENEMY:
      set = [opponents[user.randSeedInt(opponents.length)]];
      break;
    case MoveTarget.ATTACKER:
      return { targets: [-1 as BattlerIndex], multiple: false };
    case MoveTarget.NEAR_ALLY:
    case MoveTarget.ALLY:
      set = [user.getAlly()];
      break;
    case MoveTarget.USER_OR_NEAR_ALLY:
    case MoveTarget.USER_AND_ALLIES:
    case MoveTarget.USER_SIDE:
      set = [user, user.getAlly()];
      multiple = moveTarget !== MoveTarget.USER_OR_NEAR_ALLY;
      break;
    case MoveTarget.ALL:
    case MoveTarget.BOTH_SIDES:
      set = [user, user.getAlly()].concat(opponents);
      multiple = true;
      break;
    case MoveTarget.CURSE:
      set = user.getTypes(true).includes(Type.GHOST) ? opponents.concat([user.getAlly()]) : [user];
      break;
  }

  return {
    targets: set
      .filter((p) => p?.isActive(true))
      .map((p) => p.getBattlerIndex())
      .filter((t) => t !== undefined),
    multiple,
  };
}

export const allMoves: Move[] = [new SelfStatusMove(Moves.NONE, Type.NORMAL, MoveCategory.STATUS, -1, -1, 0, 1)];

export const selfStatLowerMoves: Moves[] = [];

export function initMoves() {
  allMoves.push(
    new AttackMove(Moves.POUND, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(Moves.KARATE_CHOP, Type.FIGHTING, MoveCategory.PHYSICAL, 50, 100, 25, -1, 0, 1).attr(HighCritAttr),
    new AttackMove(Moves.DOUBLE_SLAP, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 10, -1, 0, 1).attr(MultiHitAttr),
    new AttackMove(Moves.COMET_PUNCH, Type.NORMAL, MoveCategory.PHYSICAL, 18, 85, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .punchingMove(),
    new AttackMove(Moves.MEGA_PUNCH, Type.NORMAL, MoveCategory.PHYSICAL, 80, 85, 20, -1, 0, 1).punchingMove(),
    new AttackMove(Moves.PAY_DAY, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 20, -1, 0, 1)
      .attr(MoneyAttr)
      .makesContact(false),
    new AttackMove(Moves.FIRE_PUNCH, Type.FIRE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .punchingMove(),
    new AttackMove(Moves.ICE_PUNCH, Type.ICE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .punchingMove(),
    new AttackMove(Moves.THUNDER_PUNCH, Type.ELECTRIC, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .punchingMove(),
    new AttackMove(Moves.SCRATCH, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(Moves.VISE_GRIP, Type.NORMAL, MoveCategory.PHYSICAL, 55, 100, 30, -1, 0, 1),
    new AttackMove(Moves.GUILLOTINE, Type.NORMAL, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new ChargingAttackMove(Moves.RAZOR_WIND, Type.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:whippedUpAWhirlwind", { pokemonName: "{USER}" }))
      .attr(HighCritAttr)
      .windMove()
      .ignoresVirtual()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(Moves.SWORDS_DANCE, Type.NORMAL, -1, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], 2, true)
      .danceMove(),
    new AttackMove(Moves.CUT, Type.NORMAL, MoveCategory.PHYSICAL, 50, 95, 30, -1, 0, 1).slicingMove(),
    new AttackMove(Moves.GUST, Type.FLYING, MoveCategory.SPECIAL, 40, 100, 35, -1, 0, 1)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.FLYING)
      .windMove(),
    new AttackMove(Moves.WING_ATTACK, Type.FLYING, MoveCategory.PHYSICAL, 60, 100, 35, -1, 0, 1),
    new StatusMove(Moves.WHIRLWIND, Type.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .ignoresSubstitute()
      .hidesTarget()
      .windMove(),
    new ChargingAttackMove(Moves.FLY, Type.FLYING, MoveCategory.PHYSICAL, 90, 95, 15, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:flewUpHigh", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.FLYING)
      .condition(failOnGravityCondition)
      .ignoresVirtual(),
    new AttackMove(Moves.BIND, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.BIND,
    ),
    new AttackMove(Moves.SLAM, Type.NORMAL, MoveCategory.PHYSICAL, 80, 75, 20, -1, 0, 1),
    new AttackMove(Moves.VINE_WHIP, Type.GRASS, MoveCategory.PHYSICAL, 45, 100, 25, -1, 0, 1),
    new AttackMove(Moves.STOMP, Type.NORMAL, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 1)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new AttackMove(Moves.DOUBLE_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 30, 100, 30, -1, 0, 1).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(Moves.MEGA_KICK, Type.NORMAL, MoveCategory.PHYSICAL, 120, 75, 5, -1, 0, 1),
    new AttackMove(Moves.JUMP_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 95, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new AttackMove(Moves.ROLLING_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 60, 85, 15, 30, 0, 1).attr(FlinchAttr),
    new StatusMove(Moves.SAND_ATTACK, Type.GROUND, 100, 15, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(Moves.HEADBUTT, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 15, 30, 0, 1).attr(FlinchAttr),
    new AttackMove(Moves.HORN_ATTACK, Type.NORMAL, MoveCategory.PHYSICAL, 65, 100, 25, -1, 0, 1),
    new AttackMove(Moves.FURY_ATTACK, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1).attr(MultiHitAttr),
    new AttackMove(Moves.HORN_DRILL, Type.NORMAL, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new AttackMove(Moves.TACKLE, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(Moves.BODY_SLAM, Type.NORMAL, MoveCategory.PHYSICAL, 85, 100, 15, 30, 0, 1)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(Moves.WRAP, Type.NORMAL, MoveCategory.PHYSICAL, 15, 90, 20, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.WRAP,
    ),
    new AttackMove(Moves.TAKE_DOWN, Type.NORMAL, MoveCategory.PHYSICAL, 90, 85, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(Moves.THRASH, Type.NORMAL, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 1)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new AttackMove(Moves.DOUBLE_EDGE, Type.NORMAL, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 1)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new StatusMove(Moves.TAIL_WHIP, Type.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.POISON_STING, Type.POISON, MoveCategory.PHYSICAL, 15, 100, 35, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(Moves.TWINEEDLE, Type.BUG, MoveCategory.PHYSICAL, 25, 100, 20, 20, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(Moves.PIN_MISSILE, Type.BUG, MoveCategory.PHYSICAL, 25, 95, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new StatusMove(Moves.LEER, Type.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BITE, Type.DARK, MoveCategory.PHYSICAL, 60, 100, 25, 30, 0, 1).attr(FlinchAttr).bitingMove(),
    new StatusMove(Moves.GROWL, Type.NORMAL, 100, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.ROAR, Type.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .soundBased()
      .hidesTarget(),
    new StatusMove(Moves.SING, Type.NORMAL, 55, 15, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.SLEEP).soundBased(),
    new StatusMove(Moves.SUPERSONIC, Type.NORMAL, 55, 20, -1, 0, 1).attr(ConfuseAttr).soundBased(),
    new AttackMove(Moves.SONIC_BOOM, Type.NORMAL, MoveCategory.SPECIAL, -1, 90, 20, -1, 0, 1).attr(FixedDamageAttr, 20),
    new StatusMove(Moves.DISABLE, Type.NORMAL, 100, 20, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.DISABLED, false, { failOnOverlap: true })
      .condition(
        (_user, target, _move) =>
          target
            .getMoveHistory()
            .reverse()
            .find((m) => m.move !== Moves.NONE && m.move !== Moves.STRUGGLE && !m.virtual) !== undefined,
      )
      .ignoresSubstitute(),
    new AttackMove(Moves.ACID, Type.POISON, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.EMBER, Type.FIRE, MoveCategory.SPECIAL, 40, 100, 25, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(Moves.FLAMETHROWER, Type.FIRE, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new StatusMove(Moves.MIST, Type.ICE, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.MIST, 5, true)
      .target(MoveTarget.USER_SIDE),
    new AttackMove(Moves.WATER_GUN, Type.WATER, MoveCategory.SPECIAL, 40, 100, 25, -1, 0, 1),
    new AttackMove(Moves.HYDRO_PUMP, Type.WATER, MoveCategory.SPECIAL, 110, 80, 5, -1, 0, 1),
    new AttackMove(Moves.SURF, Type.WATER, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 1)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERWATER)
      .attr(GulpMissileTagAttr),
    new AttackMove(Moves.ICE_BEAM, Type.ICE, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.FREEZE,
    ),
    new AttackMove(Moves.BLIZZARD, Type.ICE, MoveCategory.SPECIAL, 110, 70, 5, 10, 0, 1)
      .attr(BlizzardAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.PSYBEAM, Type.PSYCHIC, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1).attr(ConfuseAttr),
    new AttackMove(Moves.BUBBLE_BEAM, Type.WATER, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(Moves.AURORA_BEAM, Type.ICE, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(Moves.HYPER_BEAM, Type.NORMAL, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 1).attr(RechargeAttr),
    new AttackMove(Moves.PECK, Type.FLYING, MoveCategory.PHYSICAL, 35, 100, 35, -1, 0, 1),
    new AttackMove(Moves.DRILL_PECK, Type.FLYING, MoveCategory.PHYSICAL, 80, 100, 20, -1, 0, 1),
    new AttackMove(Moves.SUBMISSION, Type.FIGHTING, MoveCategory.PHYSICAL, 80, 80, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(Moves.LOW_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1).attr(WeightPowerAttr),
    new AttackMove(Moves.COUNTER, Type.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, -5, 1)
      .attr(CounterDamageAttr, (move: Move) => move.category === MoveCategory.PHYSICAL, 2)
      .target(MoveTarget.ATTACKER),
    new AttackMove(Moves.SEISMIC_TOSS, Type.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1).attr(
      LevelDamageAttr,
    ),
    new AttackMove(Moves.STRENGTH, Type.NORMAL, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 1),
    new AttackMove(Moves.ABSORB, Type.GRASS, MoveCategory.SPECIAL, 20, 100, 25, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new AttackMove(Moves.MEGA_DRAIN, Type.GRASS, MoveCategory.SPECIAL, 40, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(Moves.LEECH_SEED, Type.GRASS, 90, 10, -1, 0, 1)
      .attr(LeechSeedAttr)
      .condition((_user, target, _move) => !target.getTag(BattlerTagType.SEEDED) && !target.isOfType(Type.GRASS)),
    new SelfStatusMove(Moves.GROWTH, Type.NORMAL, -1, 20, -1, 0, 1).attr(GrowthStatStageChangeAttr),
    new AttackMove(Moves.RAZOR_LEAF, Type.GRASS, MoveCategory.PHYSICAL, 55, 95, 25, -1, 0, 1)
      .attr(HighCritAttr)
      .makesContact(false)
      .slicingMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new ChargingAttackMove(Moves.SOLAR_BEAM, Type.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:tookInSunlight", { pokemonName: "{USER}" }))
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.SUNNY, WeatherType.HARSH_SUN])
      .attr(AntiSunlightPowerDecreaseAttr)
      .ignoresVirtual(),
    new StatusMove(Moves.POISON_POWDER, Type.POISON, 75, 35, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .powderMove(),
    new StatusMove(Moves.STUN_SPORE, Type.GRASS, 75, 30, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .powderMove(),
    new StatusMove(Moves.SLEEP_POWDER, Type.GRASS, 75, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .powderMove(),
    new AttackMove(Moves.PETAL_DANCE, Type.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .makesContact()
      .danceMove()
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(Moves.STRING_SHOT, Type.BUG, 95, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -2)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.DRAGON_RAGE, Type.DRAGON, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 1).attr(
      FixedDamageAttr,
      40,
    ),
    new AttackMove(Moves.FIRE_SPIN, Type.FIRE, MoveCategory.SPECIAL, 35, 85, 15, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.FIRE_SPIN,
    ),
    new AttackMove(Moves.THUNDER_SHOCK, Type.ELECTRIC, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(Moves.THUNDERBOLT, Type.ELECTRIC, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new StatusMove(Moves.THUNDER_WAVE, Type.ELECTRIC, 90, 20, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(RespectAttackTypeImmunityAttr),
    new AttackMove(Moves.THUNDER, Type.ELECTRIC, MoveCategory.SPECIAL, 110, 70, 10, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(ThunderAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING),
    new AttackMove(Moves.ROCK_THROW, Type.ROCK, MoveCategory.PHYSICAL, 50, 90, 15, -1, 0, 1).makesContact(false),
    new AttackMove(Moves.EARTHQUAKE, Type.GROUND, MoveCategory.PHYSICAL, 100, 100, 10, -1, 0, 1)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERGROUND)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.GRASSY && target.isGrounded() ? 0.5 : 1,
      )
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.FISSURE, Type.GROUND, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.UNDERGROUND)
      .makesContact(false),
    new ChargingAttackMove(Moves.DIG, Type.GROUND, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:dugAHole", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.UNDERGROUND)
      .ignoresVirtual(),
    new StatusMove(Moves.TOXIC, Type.POISON, 90, 10, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.TOXIC)
      .attr(ToxicAccuracyAttr),
    new AttackMove(Moves.CONFUSION, Type.PSYCHIC, MoveCategory.SPECIAL, 50, 100, 25, 10, 0, 1).attr(ConfuseAttr),
    new AttackMove(Moves.PSYCHIC, Type.PSYCHIC, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new StatusMove(Moves.HYPNOSIS, Type.PSYCHIC, 60, 20, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.SLEEP),
    new SelfStatusMove(Moves.MEDITATE, Type.PSYCHIC, -1, 40, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ATK], 1, true),
    new SelfStatusMove(Moves.AGILITY, Type.PSYCHIC, -1, 30, -1, 0, 1).attr(StatStageChangeAttr, [Stat.SPD], 2, true),
    new AttackMove(Moves.QUICK_ATTACK, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 1),
    new AttackMove(Moves.RAGE, Type.NORMAL, MoveCategory.PHYSICAL, 20, 100, 20, -1, 0, 1).partial(), // No effect implemented
    new SelfStatusMove(Moves.TELEPORT, Type.PSYCHIC, -1, 20, -1, -6, 1).attr(ForceSwitchOutAttr, true).hidesUser(),
    new AttackMove(Moves.NIGHT_SHADE, Type.GHOST, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1).attr(LevelDamageAttr),
    new StatusMove(Moves.MIMIC, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(MovesetCopyMoveAttr)
      .ignoresSubstitute()
      .ignoresVirtual(),
    new StatusMove(Moves.SCREECH, Type.NORMAL, 85, 40, -1, 0, 1).attr(StatStageChangeAttr, [Stat.DEF], -2).soundBased(),
    new SelfStatusMove(Moves.DOUBLE_TEAM, Type.NORMAL, -1, 15, -1, 0, 1).attr(StatStageChangeAttr, [Stat.EVA], 1, true),
    new SelfStatusMove(Moves.RECOVER, Type.NORMAL, -1, 5, -1, 0, 1).attr(HealAttr, 0.5).triageMove(),
    new SelfStatusMove(Moves.HARDEN, Type.NORMAL, -1, 30, -1, 0, 1).attr(StatStageChangeAttr, [Stat.DEF], 1, true),
    new SelfStatusMove(Moves.MINIMIZE, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.MINIMIZED, true)
      .attr(StatStageChangeAttr, [Stat.EVA], 2, true),
    new StatusMove(Moves.SMOKESCREEN, Type.NORMAL, 100, 20, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new StatusMove(Moves.CONFUSE_RAY, Type.GHOST, 100, 10, -1, 0, 1).attr(ConfuseAttr),
    new SelfStatusMove(Moves.WITHDRAW, Type.WATER, -1, 40, -1, 0, 1).attr(StatStageChangeAttr, [Stat.DEF], 1, true),
    new SelfStatusMove(Moves.DEFENSE_CURL, Type.NORMAL, -1, 40, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new SelfStatusMove(Moves.BARRIER, Type.PSYCHIC, -1, 20, -1, 0, 1).attr(StatStageChangeAttr, [Stat.DEF], 2, true),
    new StatusMove(Moves.LIGHT_SCREEN, Type.PSYCHIC, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.LIGHT_SCREEN, 5, true)
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(Moves.HAZE, Type.ICE, -1, 30, -1, 0, 1).ignoresSubstitute().attr(ResetStatsAttr, true),
    new StatusMove(Moves.REFLECT, Type.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.REFLECT, 5, true)
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(Moves.FOCUS_ENERGY, Type.NORMAL, -1, 30, -1, 0, 1).attr(
      AddBattlerTagAttr,
      BattlerTagType.CRIT_BOOST,
      true,
      { failOnOverlap: true },
    ),
    new AttackMove(Moves.BIDE, Type.NORMAL, MoveCategory.PHYSICAL, -1, -1, 10, -1, 1, 1)
      .ignoresVirtual()
      .target(MoveTarget.USER)
      .unimplemented(),
    new SelfStatusMove(Moves.METRONOME, Type.NORMAL, -1, 10, -1, 0, 1).attr(RandomMoveAttr).ignoresVirtual(),
    new StatusMove(Moves.MIRROR_MOVE, Type.FLYING, -1, 20, -1, 0, 1).attr(CopyMoveAttr).ignoresVirtual(),
    new AttackMove(Moves.SELF_DESTRUCT, Type.NORMAL, MoveCategory.PHYSICAL, 200, 100, 5, -1, 0, 1)
      .attr(SacrificialAttr)
      .makesContact(false)
      .condition(failIfDampCondition)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.EGG_BOMB, Type.NORMAL, MoveCategory.PHYSICAL, 100, 75, 10, -1, 0, 1)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.LICK, Type.GHOST, MoveCategory.PHYSICAL, 30, 100, 30, 30, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(Moves.SMOG, Type.POISON, MoveCategory.SPECIAL, 30, 70, 20, 40, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.POISON,
    ),
    new AttackMove(Moves.SLUDGE, Type.POISON, MoveCategory.SPECIAL, 65, 100, 20, 30, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.POISON,
    ),
    new AttackMove(Moves.BONE_CLUB, Type.GROUND, MoveCategory.PHYSICAL, 65, 85, 20, 10, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false),
    new AttackMove(Moves.FIRE_BLAST, Type.FIRE, MoveCategory.SPECIAL, 110, 85, 5, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(Moves.WATERFALL, Type.WATER, MoveCategory.PHYSICAL, 80, 100, 15, 20, 0, 1).attr(FlinchAttr),
    new AttackMove(Moves.CLAMP, Type.WATER, MoveCategory.PHYSICAL, 35, 85, 15, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.CLAMP,
    ),
    new AttackMove(Moves.SWIFT, Type.NORMAL, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 1).target(
      MoveTarget.ALL_NEAR_ENEMIES,
    ),
    new ChargingAttackMove(Moves.SKULL_BASH, Type.NORMAL, MoveCategory.PHYSICAL, 130, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:loweredItsHead", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.DEF], 1, true)
      .ignoresVirtual(),
    new AttackMove(Moves.SPIKE_CANNON, Type.NORMAL, MoveCategory.PHYSICAL, 20, 100, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new AttackMove(Moves.CONSTRICT, Type.NORMAL, MoveCategory.PHYSICAL, 10, 100, 35, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new SelfStatusMove(Moves.AMNESIA, Type.PSYCHIC, -1, 20, -1, 0, 1).attr(StatStageChangeAttr, [Stat.SPDEF], 2, true),
    new StatusMove(Moves.KINESIS, Type.PSYCHIC, 80, 15, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new SelfStatusMove(Moves.SOFT_BOILED, Type.NORMAL, -1, 5, -1, 0, 1).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(Moves.HIGH_JUMP_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 130, 90, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new StatusMove(Moves.GLARE, Type.NORMAL, 100, 30, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(Moves.DREAM_EATER, Type.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .condition(targetSleptOrComatoseCondition)
      .triageMove(),
    new StatusMove(Moves.POISON_GAS, Type.POISON, 90, 40, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BARRAGE, Type.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.LEECH_LIFE, Type.BUG, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(Moves.LOVELY_KISS, Type.NORMAL, 75, 10, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.SLEEP),
    new ChargingAttackMove(Moves.SKY_ATTACK, Type.FLYING, MoveCategory.PHYSICAL, 140, 90, 5, 30, 0, 1)
      .chargeText(i18next.t("moveTriggers:isGlowing", { pokemonName: "{USER}" }))
      .attr(HighCritAttr)
      .attr(FlinchAttr)
      .makesContact(false)
      .ignoresVirtual(),
    new StatusMove(Moves.TRANSFORM, Type.NORMAL, -1, 10, -1, 0, 1)
      .attr(TransformAttr)
      // transforming from or into fusion pokemon causes various problems (such as crashes)
      .condition(
        (user, target, _move) =>
          !target.getTag(BattlerTagType.SUBSTITUTE) && !user.fusionSpecies && !target.fusionSpecies,
      )
      .ignoresProtect(),
    new AttackMove(Moves.BUBBLE, Type.WATER, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.DIZZY_PUNCH, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 10, 20, 0, 1)
      .attr(ConfuseAttr)
      .punchingMove(),
    new StatusMove(Moves.SPORE, Type.GRASS, 100, 15, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.SLEEP).powderMove(),
    new StatusMove(Moves.FLASH, Type.NORMAL, 100, 20, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(Moves.PSYWAVE, Type.PSYCHIC, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1).attr(
      RandomLevelDamageAttr,
    ),
    new SelfStatusMove(Moves.SPLASH, Type.NORMAL, -1, 40, -1, 0, 1).condition(failOnGravityCondition),
    new SelfStatusMove(Moves.ACID_ARMOR, Type.POISON, -1, 20, -1, 0, 1).attr(StatStageChangeAttr, [Stat.DEF], 2, true),
    new AttackMove(Moves.CRABHAMMER, Type.WATER, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 1).attr(HighCritAttr),
    new AttackMove(Moves.EXPLOSION, Type.NORMAL, MoveCategory.PHYSICAL, 250, 100, 5, -1, 0, 1)
      .condition(failIfDampCondition)
      .attr(SacrificialAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.FURY_SWIPES, Type.NORMAL, MoveCategory.PHYSICAL, 18, 80, 15, -1, 0, 1).attr(MultiHitAttr),
    new AttackMove(Moves.BONEMERANG, Type.GROUND, MoveCategory.PHYSICAL, 50, 90, 10, -1, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .makesContact(false),
    new SelfStatusMove(Moves.REST, Type.PSYCHIC, -1, 5, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP, true, 3, true)
      .attr(HealAttr, 1, true)
      .condition((user, _target, _move) => !user.isFullHp() && user.canSetStatus(StatusEffect.SLEEP, true, true))
      .triageMove(),
    new AttackMove(Moves.ROCK_SLIDE, Type.ROCK, MoveCategory.PHYSICAL, 75, 90, 10, 30, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.HYPER_FANG, Type.NORMAL, MoveCategory.PHYSICAL, 80, 90, 15, 10, 0, 1)
      .attr(FlinchAttr)
      .bitingMove(),
    new SelfStatusMove(Moves.SHARPEN, Type.NORMAL, -1, 30, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ATK], 1, true),
    new SelfStatusMove(Moves.CONVERSION, Type.NORMAL, -1, 30, -1, 0, 1).attr(FirstMoveTypeAttr),
    new AttackMove(Moves.TRI_ATTACK, Type.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, 20, 0, 1).attr(
      MultiStatusEffectAttr,
      [StatusEffect.BURN, StatusEffect.FREEZE, StatusEffect.PARALYSIS],
    ),
    new AttackMove(Moves.SUPER_FANG, Type.NORMAL, MoveCategory.PHYSICAL, -1, 90, 10, -1, 0, 1).attr(
      TargetHalfHpDamageAttr,
    ),
    new AttackMove(Moves.SLASH, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 1)
      .attr(HighCritAttr)
      .slicingMove(),
    new SelfStatusMove(Moves.SUBSTITUTE, Type.NORMAL, -1, 10, -1, 0, 1).attr(AddSubstituteAttr),
    new AttackMove(Moves.STRUGGLE, Type.NORMAL, MoveCategory.PHYSICAL, 50, -1, 1, -1, 0, 1)
      .attr(RecoilAttr, true, 0.25, true)
      .attr(TypelessAttr)
      .ignoresVirtual()
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(Moves.SKETCH, Type.NORMAL, -1, 1, -1, 0, 2).ignoresSubstitute().attr(SketchAttr).ignoresVirtual(),
    new AttackMove(Moves.TRIPLE_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 10, 90, 10, -1, 0, 2)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(MultiHitPowerIncrementAttr, 3)
      .checkAllHits(),
    new AttackMove(Moves.THIEF, Type.DARK, MoveCategory.PHYSICAL, 60, 100, 25, -1, 0, 2).attr(
      StealHeldItemChanceAttr,
      0.3,
    ),
    new StatusMove(Moves.SPIDER_WEB, Type.BUG, -1, 10, -1, 0, 2)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true }),
    new StatusMove(Moves.MIND_READER, Type.NORMAL, -1, 5, -1, 0, 2).attr(IgnoreAccuracyAttr),
    new StatusMove(Moves.NIGHTMARE, Type.GHOST, 100, 15, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.NIGHTMARE)
      .condition(targetSleptOrComatoseCondition),
    new AttackMove(Moves.FLAME_WHEEL, Type.FIRE, MoveCategory.PHYSICAL, 60, 100, 25, 10, 0, 2)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(Moves.SNORE, Type.NORMAL, MoveCategory.SPECIAL, 50, 100, 15, 30, 0, 2)
      .attr(BypassSleepAttr)
      .attr(FlinchAttr)
      .condition(userSleptOrComatoseCondition)
      .soundBased(),
    new StatusMove(Moves.CURSE, Type.GHOST, -1, 10, -1, 0, 2)
      .attr(CurseAttr)
      .ignoresSubstitute()
      .ignoresProtect()
      .target(MoveTarget.CURSE),
    new AttackMove(Moves.FLAIL, Type.NORMAL, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 2).attr(LowHpPowerAttr),
    new StatusMove(Moves.CONVERSION_2, Type.NORMAL, -1, 30, -1, 0, 2)
      .attr(ResistLastMoveTypeAttr)
      .ignoresSubstitute()
      .partial(), // Checks the move's original typing and not if its type is changed through some other means
    new AttackMove(Moves.AEROBLAST, Type.FLYING, MoveCategory.SPECIAL, 100, 95, 5, -1, 0, 2)
      .windMove()
      .attr(HighCritAttr),
    new StatusMove(Moves.COTTON_SPORE, Type.GRASS, 100, 40, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], -2)
      .powderMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.REVERSAL, Type.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 2).attr(LowHpPowerAttr),
    new StatusMove(Moves.SPITE, Type.GHOST, 100, 10, -1, 0, 2).ignoresSubstitute().attr(ReducePpMoveAttr, 4),
    new AttackMove(Moves.POWDER_SNOW, Type.ICE, MoveCategory.SPECIAL, 40, 100, 25, 10, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(Moves.PROTECT, Type.NORMAL, -1, 10, -1, 4, 2).attr(ProtectAttr).condition(failIfLastCondition),
    new AttackMove(Moves.MACH_PUNCH, Type.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 2).punchingMove(),
    new StatusMove(Moves.SCARY_FACE, Type.NORMAL, 100, 10, -1, 0, 2).attr(StatStageChangeAttr, [Stat.SPD], -2),
    new AttackMove(Moves.FEINT_ATTACK, Type.DARK, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 2),
    new StatusMove(Moves.SWEET_KISS, Type.FAIRY, 75, 10, -1, 0, 2).attr(ConfuseAttr),
    new SelfStatusMove(Moves.BELLY_DRUM, Type.NORMAL, -1, 10, -1, 0, 2).attr(
      CutHpStatStageBoostAttr,
      [Stat.ATK],
      12,
      2,
      (user) => {
        globalScene.queueMessage(
          i18next.t("moveTriggers:cutOwnHpAndMaximizedStat", {
            pokemonName: getPokemonNameWithAffix(user),
            statName: i18next.t(getStatKey(Stat.ATK)),
          }),
        );
      },
    ),
    new AttackMove(Moves.SLUDGE_BOMB, Type.POISON, MoveCategory.SPECIAL, 90, 100, 10, 30, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .ballBombMove(),
    new AttackMove(Moves.MUD_SLAP, Type.GROUND, MoveCategory.SPECIAL, 20, 100, 10, 100, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(Moves.OCTAZOOKA, Type.WATER, MoveCategory.SPECIAL, 65, 85, 10, 50, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .ballBombMove(),
    new StatusMove(Moves.SPIKES, Type.GROUND, -1, 20, -1, 0, 2)
      .attr(AddArenaTrapTagAttr, ArenaTagType.SPIKES)
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(Moves.ZAP_CANNON, Type.ELECTRIC, MoveCategory.SPECIAL, 120, 50, 5, 100, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .ballBombMove(),
    new StatusMove(Moves.FORESIGHT, Type.NORMAL, -1, 40, -1, 0, 2)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_GHOST)
      .ignoresSubstitute(),
    new SelfStatusMove(Moves.DESTINY_BOND, Type.GHOST, -1, 5, -1, 0, 2)
      .ignoresProtect()
      .attr(DestinyBondAttr)
      .condition((user, _target, move) => {
        // Retrieves user's previous move, returns empty array if no moves have been used
        const lastTurnMove = user.getLastXMoves(1);
        // Checks last move and allows destiny bond to be used if:
        // - no previous moves have been made
        // - the previous move used was not destiny bond
        // - the previous move was unsuccessful
        return (
          lastTurnMove.length === 0 || lastTurnMove[0].move !== move.id || lastTurnMove[0].result !== MoveResult.SUCCESS
        );
      }),
    new StatusMove(Moves.PERISH_SONG, Type.NORMAL, -1, 5, -1, 0, 2)
      .attr(FaintCountdownAttr)
      .ignoresProtect()
      .soundBased()
      .condition(failOnBossCondition)
      .target(MoveTarget.ALL),
    new AttackMove(Moves.ICY_WIND, Type.ICE, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(Moves.DETECT, Type.FIGHTING, -1, 5, -1, 4, 2).attr(ProtectAttr).condition(failIfLastCondition),
    new AttackMove(Moves.BONE_RUSH, Type.GROUND, MoveCategory.PHYSICAL, 25, 90, 10, -1, 0, 2)
      .attr(MultiHitAttr)
      .makesContact(false),
    new StatusMove(Moves.LOCK_ON, Type.NORMAL, -1, 5, -1, 0, 2).attr(IgnoreAccuracyAttr),
    new AttackMove(Moves.OUTRAGE, Type.DRAGON, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 2)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(Moves.SANDSTORM, Type.ROCK, -1, 10, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.SANDSTORM)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.GIGA_DRAIN, Type.GRASS, MoveCategory.SPECIAL, 75, 100, 10, -1, 0, 2)
      .attr(HitHealAttr)
      .triageMove(),
    new SelfStatusMove(Moves.ENDURE, Type.NORMAL, -1, 10, -1, 4, 2)
      .attr(ProtectAttr, BattlerTagType.ENDURING)
      .condition(failIfLastCondition),
    new StatusMove(Moves.CHARM, Type.FAIRY, 100, 20, -1, 0, 2).attr(StatStageChangeAttr, [Stat.ATK], -2),
    new AttackMove(Moves.ROLLOUT, Type.ROCK, MoveCategory.PHYSICAL, 30, 90, 20, -1, 0, 2)
      .partial() // Does not lock the user, also does not increase damage properly
      .attr(ConsecutiveUseDoublePowerAttr, 5, true, true, Moves.DEFENSE_CURL),
    new AttackMove(Moves.FALSE_SWIPE, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 2).attr(
      SurviveDamageAttr,
    ),
    new StatusMove(Moves.SWAGGER, Type.NORMAL, 85, 15, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ATK], 2)
      .attr(ConfuseAttr),
    new SelfStatusMove(Moves.MILK_DRINK, Type.NORMAL, -1, 5, -1, 0, 2).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(Moves.SPARK, Type.ELECTRIC, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 2).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(Moves.FURY_CUTTER, Type.BUG, MoveCategory.PHYSICAL, 40, 95, 20, -1, 0, 2)
      .attr(ConsecutiveUseDoublePowerAttr, 3, true)
      .slicingMove(),
    new AttackMove(Moves.STEEL_WING, Type.STEEL, MoveCategory.PHYSICAL, 70, 90, 25, 10, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new StatusMove(Moves.MEAN_LOOK, Type.NORMAL, -1, 5, -1, 0, 2)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true }),
    new StatusMove(Moves.ATTRACT, Type.NORMAL, 100, 15, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.INFATUATED)
      .ignoresSubstitute()
      .condition((user, target, _move) => user.isOppositeGender(target)),
    new SelfStatusMove(Moves.SLEEP_TALK, Type.NORMAL, -1, 10, -1, 0, 2)
      .attr(BypassSleepAttr)
      .attr(RandomMovesetMoveAttr)
      .condition(userSleptOrComatoseCondition)
      .target(MoveTarget.ALL_ENEMIES)
      .ignoresVirtual(),
    new StatusMove(Moves.HEAL_BELL, Type.NORMAL, -1, 5, -1, 0, 2)
      .attr(PartyStatusCureAttr, i18next.t("moveTriggers:bellChimed"), Abilities.SOUNDPROOF)
      .soundBased()
      .target(MoveTarget.PARTY),
    new AttackMove(Moves.RETURN, Type.NORMAL, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 2).attr(FriendshipPowerAttr),
    new AttackMove(Moves.PRESENT, Type.NORMAL, MoveCategory.PHYSICAL, -1, 90, 15, -1, 0, 2)
      .attr(PresentPowerAttr)
      .makesContact(false),
    new AttackMove(Moves.FRUSTRATION, Type.NORMAL, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 2).attr(
      FriendshipPowerAttr,
      true,
    ),
    new StatusMove(Moves.SAFEGUARD, Type.NORMAL, -1, 25, -1, 0, 2)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.SAFEGUARD, 5, true, true),
    new StatusMove(Moves.PAIN_SPLIT, Type.NORMAL, -1, 20, -1, 0, 2).attr(HpSplitAttr).condition(failOnBossCondition),
    new AttackMove(Moves.SACRED_FIRE, Type.FIRE, MoveCategory.PHYSICAL, 100, 95, 5, 50, 0, 2)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .makesContact(false),
    new AttackMove(Moves.MAGNITUDE, Type.GROUND, MoveCategory.PHYSICAL, -1, 100, 30, -1, 0, 2)
      .attr(PreMoveMessageAttr, magnitudeMessageFunc)
      .attr(MagnitudePowerAttr)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.GRASSY && target.isGrounded() ? 0.5 : 1,
      )
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERGROUND)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.DYNAMIC_PUNCH, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 50, 5, 100, 0, 2)
      .attr(ConfuseAttr)
      .punchingMove(),
    new AttackMove(Moves.MEGAHORN, Type.BUG, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 2),
    new AttackMove(Moves.DRAGON_BREATH, Type.DRAGON, MoveCategory.SPECIAL, 60, 100, 20, 30, 0, 2).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new SelfStatusMove(Moves.BATON_PASS, Type.NORMAL, -1, 40, -1, 0, 2)
      .attr(ForceSwitchOutAttr, true, SwitchType.BATON_PASS)
      .condition(failIfLastInPartyCondition)
      .hidesUser(),
    new StatusMove(Moves.ENCORE, Type.NORMAL, 100, 5, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.ENCORE, false, { failOnOverlap: true })
      .ignoresSubstitute()
      .condition((user, target, _move) => new EncoreTag(user.id).canAdd(target)),
    new AttackMove(Moves.PURSUIT, Type.DARK, MoveCategory.PHYSICAL, 40, 100, 20, -1, 0, 2).partial(), // No effect implemented
    new AttackMove(Moves.RAPID_SPIN, Type.NORMAL, MoveCategory.PHYSICAL, 50, 100, 40, 100, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .attr(
        RemoveBattlerTagAttr,
        [
          BattlerTagType.BIND,
          BattlerTagType.WRAP,
          BattlerTagType.FIRE_SPIN,
          BattlerTagType.WHIRLPOOL,
          BattlerTagType.CLAMP,
          BattlerTagType.SAND_TOMB,
          BattlerTagType.MAGMA_STORM,
          BattlerTagType.SNAP_TRAP,
          BattlerTagType.THUNDER_CAGE,
          BattlerTagType.SEEDED,
          BattlerTagType.INFESTATION,
        ],
        true,
      )
      .attr(RemoveArenaTrapAttr),
    new StatusMove(Moves.SWEET_SCENT, Type.NORMAL, 100, 20, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.EVA], -2)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.IRON_TAIL, Type.STEEL, MoveCategory.PHYSICAL, 100, 75, 15, 30, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(Moves.METAL_CLAW, Type.STEEL, MoveCategory.PHYSICAL, 50, 95, 35, 10, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      1,
      true,
    ),
    new AttackMove(Moves.VITAL_THROW, Type.FIGHTING, MoveCategory.PHYSICAL, 70, -1, 10, -1, -1, 2),
    new SelfStatusMove(Moves.MORNING_SUN, Type.NORMAL, -1, 5, -1, 0, 2).attr(PlantHealAttr).triageMove(),
    new SelfStatusMove(Moves.SYNTHESIS, Type.GRASS, -1, 5, -1, 0, 2).attr(PlantHealAttr).triageMove(),
    new SelfStatusMove(Moves.MOONLIGHT, Type.FAIRY, -1, 5, -1, 0, 2).attr(PlantHealAttr).triageMove(),
    new AttackMove(Moves.HIDDEN_POWER, Type.NORMAL, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 2).attr(
      HiddenPowerTypeAttr,
    ),
    new AttackMove(Moves.CROSS_CHOP, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 80, 5, -1, 0, 2).attr(HighCritAttr),
    new AttackMove(Moves.TWISTER, Type.DRAGON, MoveCategory.SPECIAL, 40, 100, 20, 20, 0, 2)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.FLYING)
      .attr(FlinchAttr)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.RAIN_DANCE, Type.WATER, -1, 5, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.RAIN)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(Moves.SUNNY_DAY, Type.FIRE, -1, 5, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.SUNNY)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.CRUNCH, Type.DARK, MoveCategory.PHYSICAL, 80, 100, 15, 20, 0, 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .bitingMove(),
    new AttackMove(Moves.MIRROR_COAT, Type.PSYCHIC, MoveCategory.SPECIAL, -1, 100, 20, -1, -5, 2)
      .attr(CounterDamageAttr, (move: Move) => move.category === MoveCategory.SPECIAL, 2)
      .target(MoveTarget.ATTACKER),
    new StatusMove(Moves.PSYCH_UP, Type.NORMAL, -1, 10, -1, 0, 2).ignoresSubstitute().attr(CopyStatsAttr),
    new AttackMove(Moves.EXTREME_SPEED, Type.NORMAL, MoveCategory.PHYSICAL, 80, 100, 5, -1, 2, 2),
    new AttackMove(Moves.ANCIENT_POWER, Type.ROCK, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD],
      1,
      true,
    ),
    new AttackMove(Moves.SHADOW_BALL, Type.GHOST, MoveCategory.SPECIAL, 80, 100, 15, 20, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .ballBombMove(),
    new AttackMove(Moves.FUTURE_SIGHT, Type.PSYCHIC, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 2)
      .partial() // cannot be used on multiple Pokemon on the same side in a double battle, hits immediately when called by Metronome/etc, should not apply abilities or held items if user is off the field
      .ignoresProtect()
      .attr(
        DelayedAttackAttr,
        ArenaTagType.FUTURE_SIGHT,
        ChargeAnim.FUTURE_SIGHT_CHARGING,
        i18next.t("moveTriggers:foresawAnAttack", { pokemonName: "{USER}" }),
      ),
    new AttackMove(Moves.ROCK_SMASH, Type.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 15, 50, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(Moves.WHIRLPOOL, Type.WATER, MoveCategory.SPECIAL, 35, 85, 15, -1, 0, 2)
      .attr(TrapAttr, BattlerTagType.WHIRLPOOL)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERWATER),
    new AttackMove(Moves.BEAT_UP, Type.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 2)
      .attr(MultiHitAttr, MultiHitType.BEAT_UP)
      .attr(BeatUpAttr)
      .makesContact(false),
    new AttackMove(Moves.FAKE_OUT, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 10, 100, 3, 3)
      .attr(FlinchAttr)
      .condition(new FirstMoveCondition()),
    new AttackMove(Moves.UPROAR, Type.NORMAL, MoveCategory.SPECIAL, 90, 100, 10, -1, 0, 3)
      .ignoresVirtual()
      .soundBased()
      .target(MoveTarget.RANDOM_NEAR_ENEMY)
      .partial(), // Does not lock the user, does not stop Pokemon from sleeping
    new SelfStatusMove(Moves.STOCKPILE, Type.NORMAL, -1, 20, -1, 0, 3)
      .condition((user) => (user.getTag(StockpilingTag)?.stockpiledCount ?? 0) < 3)
      .attr(AddBattlerTagAttr, BattlerTagType.STOCKPILING, true),
    new AttackMove(Moves.SPIT_UP, Type.NORMAL, MoveCategory.SPECIAL, -1, -1, 10, -1, 0, 3)
      .condition(hasStockpileStacksCondition)
      .attr(SpitUpPowerAttr, 100)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.STOCKPILING], true),
    new SelfStatusMove(Moves.SWALLOW, Type.NORMAL, -1, 10, -1, 0, 3)
      .condition(hasStockpileStacksCondition)
      .attr(SwallowHealAttr)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.STOCKPILING], true)
      .triageMove(),
    new AttackMove(Moves.HEAT_WAVE, Type.FIRE, MoveCategory.SPECIAL, 95, 90, 10, 10, 0, 3)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.HAIL, Type.ICE, -1, 10, -1, 0, 3)
      .attr(WeatherChangeAttr, WeatherType.HAIL)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(Moves.TORMENT, Type.DARK, 100, 15, -1, 0, 3)
      .ignoresSubstitute()
      .edgeCase() // Incomplete implementation because of Uproar's partial implementation
      .attr(AddBattlerTagAttr, BattlerTagType.TORMENT, false, { failOnOverlap: true }),
    new StatusMove(Moves.FLATTER, Type.DARK, 100, 15, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1)
      .attr(ConfuseAttr),
    new StatusMove(Moves.WILL_O_WISP, Type.FIRE, 85, 15, -1, 0, 3).attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(Moves.MEMENTO, Type.DARK, 100, 10, -1, 0, 3)
      .attr(SacrificialAttrOnHit)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -2),
    new AttackMove(Moves.FACADE, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        user.status
        && (user.status.effect === StatusEffect.BURN
          || user.status.effect === StatusEffect.POISON
          || user.status.effect === StatusEffect.TOXIC
          || user.status.effect === StatusEffect.PARALYSIS)
          ? 2
          : 1,
      )
      .attr(BypassBurnDamageReductionAttr),
    new AttackMove(Moves.FOCUS_PUNCH, Type.FIGHTING, MoveCategory.PHYSICAL, 150, 100, 20, -1, -3, 3)
      .attr(MessageHeaderAttr, (user, _move) =>
        i18next.t("moveTriggers:isTighteningFocus", { pokemonName: getPokemonNameWithAffix(user) }),
      )
      .punchingMove()
      .ignoresVirtual()
      .condition((user, _target, _move) => !user.turnData.attacksReceived.find((r) => r.damage)),
    new AttackMove(Moves.SMELLING_SALTS, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 10, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.status?.effect === StatusEffect.PARALYSIS ? 2 : 1,
      )
      .attr(HealStatusEffectAttr, true, StatusEffect.PARALYSIS),
    new SelfStatusMove(Moves.FOLLOW_ME, Type.NORMAL, -1, 20, -1, 2, 3).attr(
      AddBattlerTagAttr,
      BattlerTagType.CENTER_OF_ATTENTION,
      true,
    ),
    new StatusMove(Moves.NATURE_POWER, Type.NORMAL, -1, 20, -1, 0, 3).attr(NaturePowerAttr).ignoresVirtual(),
    new SelfStatusMove(Moves.CHARGE, Type.ELECTRIC, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], 1, true)
      .attr(AddBattlerTagAttr, BattlerTagType.CHARGED, true),
    new StatusMove(Moves.TAUNT, Type.DARK, 100, 20, -1, 0, 3)
      .ignoresSubstitute()
      .attr(AddBattlerTagAttr, BattlerTagType.TAUNT, false, { failOnOverlap: true, turnCountMin: 4 }),
    new StatusMove(Moves.HELPING_HAND, Type.NORMAL, -1, 20, -1, 5, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.HELPING_HAND)
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_ALLY)
      .condition(failIfSingleBattle),
    new StatusMove(Moves.TRICK, Type.PSYCHIC, 100, 10, -1, 0, 3).unimplemented(),
    new StatusMove(Moves.ROLE_PLAY, Type.PSYCHIC, -1, 10, -1, 0, 3).ignoresSubstitute().attr(AbilityCopyAttr),
    new SelfStatusMove(Moves.WISH, Type.NORMAL, -1, 10, -1, 0, 3)
      .triageMove()
      .attr(AddArenaTagAttr, ArenaTagType.WISH, 2, true),
    new SelfStatusMove(Moves.ASSIST, Type.NORMAL, -1, 20, -1, 0, 3).attr(RandomMovesetMoveAttr, true).ignoresVirtual(),
    new SelfStatusMove(Moves.INGRAIN, Type.GRASS, -1, 20, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.INGRAIN, true, { failOnOverlap: true })
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, true, { failOnOverlap: true })
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLOATING], true),
    new AttackMove(Moves.SUPERPOWER, Type.FIGHTING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF],
      -1,
      true,
    ),
    new SelfStatusMove(Moves.MAGIC_COAT, Type.PSYCHIC, -1, 15, -1, 4, 3).unimplemented(),
    new SelfStatusMove(Moves.RECYCLE, Type.NORMAL, -1, 10, -1, 0, 3).unimplemented(),
    new AttackMove(Moves.REVENGE, Type.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, -1, -4, 3).attr(
      TurnDamagedDoublePowerAttr,
    ),
    new AttackMove(Moves.BRICK_BREAK, Type.FIGHTING, MoveCategory.PHYSICAL, 75, 100, 15, -1, 0, 3).attr(
      RemoveScreensAttr,
    ),
    new StatusMove(Moves.YAWN, Type.NORMAL, -1, 10, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.DROWSY, false, { failOnOverlap: true })
      .condition((user, target, _move) => !target.status && !target.isSafeguarded(user)),
    new AttackMove(Moves.KNOCK_OFF, Type.DARK, MoveCategory.PHYSICAL, 65, 100, 20, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.getHeldItems().filter((i) => i.isTransferable).length > 0 ? 1.5 : 1,
      )
      .attr(RemoveHeldItemAttr, false),
    new AttackMove(Moves.ENDEAVOR, Type.NORMAL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 3)
      .attr(MatchHpAttr)
      .condition(failOnBossCondition),
    new AttackMove(Moves.ERUPTION, Type.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 3)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.SKILL_SWAP, Type.PSYCHIC, -1, 10, -1, 0, 3).ignoresSubstitute().attr(SwitchAbilitiesAttr),
    new StatusMove(Moves.IMPRISON, Type.PSYCHIC, 100, 10, -1, 0, 3)
      .ignoresSubstitute()
      .attr(AddArenaTagAttr, ArenaTagType.IMPRISON, 1, true, false)
      .target(MoveTarget.ENEMY_SIDE),
    new SelfStatusMove(Moves.REFRESH, Type.NORMAL, -1, 20, -1, 0, 3)
      .attr(HealStatusEffectAttr, true, [
        StatusEffect.PARALYSIS,
        StatusEffect.POISON,
        StatusEffect.TOXIC,
        StatusEffect.BURN,
      ])
      .condition(
        (user, _target, _move) =>
          !!user.status
          && (user.status.effect === StatusEffect.PARALYSIS
            || user.status.effect === StatusEffect.POISON
            || user.status.effect === StatusEffect.TOXIC
            || user.status.effect === StatusEffect.BURN),
      ),
    new SelfStatusMove(Moves.GRUDGE, Type.GHOST, -1, 5, -1, 0, 3).attr(AddBattlerTagAttr, BattlerTagType.GRUDGE, true, {
      turnCountMin: 1,
    }),
    new SelfStatusMove(Moves.SNATCH, Type.DARK, -1, 10, -1, 4, 3).unimplemented(),
    new AttackMove(Moves.SECRET_POWER, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, 30, 0, 3)
      .makesContact(false)
      .attr(SecretPowerAttr),
    new ChargingAttackMove(Moves.DIVE, Type.WATER, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 3)
      .chargeText(i18next.t("moveTriggers:hidUnderwater", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.UNDERWATER)
      .chargeAttr(GulpMissileTagAttr)
      .ignoresVirtual(),
    new AttackMove(Moves.ARM_THRUST, Type.FIGHTING, MoveCategory.PHYSICAL, 15, 100, 20, -1, 0, 3).attr(MultiHitAttr),
    new SelfStatusMove(Moves.CAMOUFLAGE, Type.NORMAL, -1, 20, -1, 0, 3).attr(CopyBiomeTypeAttr),
    new SelfStatusMove(Moves.TAIL_GLOW, Type.BUG, -1, 20, -1, 0, 3).attr(StatStageChangeAttr, [Stat.SPATK], 3, true),
    new AttackMove(Moves.LUSTER_PURGE, Type.PSYCHIC, MoveCategory.SPECIAL, 95, 100, 5, 50, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new AttackMove(Moves.MIST_BALL, Type.PSYCHIC, MoveCategory.SPECIAL, 95, 100, 5, 50, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .ballBombMove(),
    new StatusMove(Moves.FEATHER_DANCE, Type.FLYING, 100, 15, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], -2)
      .danceMove(),
    new StatusMove(Moves.TEETER_DANCE, Type.NORMAL, 100, 20, -1, 0, 3)
      .attr(ConfuseAttr)
      .danceMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.BLAZE_KICK, Type.FIRE, MoveCategory.PHYSICAL, 85, 90, 10, 10, 0, 3)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(Moves.MUD_SPORT, Type.GROUND, -1, 15, -1, 0, 3)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.MUD_SPORT, 5)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.ICE_BALL, Type.ICE, MoveCategory.PHYSICAL, 30, 90, 20, -1, 0, 3)
      .partial() // Does not lock the user properly, does not increase damage correctly
      .attr(ConsecutiveUseDoublePowerAttr, 5, true, true, Moves.DEFENSE_CURL)
      .ballBombMove(),
    new AttackMove(Moves.NEEDLE_ARM, Type.GRASS, MoveCategory.PHYSICAL, 60, 100, 15, 30, 0, 3).attr(FlinchAttr),
    new SelfStatusMove(Moves.SLACK_OFF, Type.NORMAL, -1, 5, -1, 0, 3).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(Moves.HYPER_VOICE, Type.NORMAL, MoveCategory.SPECIAL, 90, 100, 10, -1, 0, 3)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.POISON_FANG, Type.POISON, MoveCategory.PHYSICAL, 50, 100, 15, 50, 0, 3)
      .attr(StatusEffectAttr, StatusEffect.TOXIC)
      .bitingMove(),
    new AttackMove(Moves.CRUSH_CLAW, Type.NORMAL, MoveCategory.PHYSICAL, 75, 95, 10, 50, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(Moves.BLAST_BURN, Type.FIRE, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3).attr(RechargeAttr),
    new AttackMove(Moves.HYDRO_CANNON, Type.WATER, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3).attr(RechargeAttr),
    new AttackMove(Moves.METEOR_MASH, Type.STEEL, MoveCategory.PHYSICAL, 90, 90, 10, 20, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .punchingMove(),
    new AttackMove(Moves.ASTONISH, Type.GHOST, MoveCategory.PHYSICAL, 30, 100, 15, 30, 0, 3).attr(FlinchAttr),
    new AttackMove(Moves.WEATHER_BALL, Type.NORMAL, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 3)
      .attr(WeatherBallTypeAttr)
      .attr(MovePowerMultiplierAttr, (_user, _target, _move) => {
        const weather = globalScene.arena.weather;
        if (!weather) {
          return 1;
        }
        const weatherTypes = [
          WeatherType.SUNNY,
          WeatherType.RAIN,
          WeatherType.SANDSTORM,
          WeatherType.HAIL,
          WeatherType.SNOW,
          WeatherType.FOG,
          WeatherType.HEAVY_RAIN,
          WeatherType.HARSH_SUN,
        ];
        if (weatherTypes.includes(weather.weatherType) && !weather.isEffectSuppressed()) {
          return 2;
        }
        return 1;
      })
      .ballBombMove(),
    new StatusMove(Moves.AROMATHERAPY, Type.GRASS, -1, 5, -1, 0, 3)
      .attr(PartyStatusCureAttr, i18next.t("moveTriggers:soothingAromaWaftedThroughArea"), Abilities.SAP_SIPPER)
      .target(MoveTarget.PARTY),
    new StatusMove(Moves.FAKE_TEARS, Type.DARK, 100, 20, -1, 0, 3).attr(StatStageChangeAttr, [Stat.SPDEF], -2),
    new AttackMove(Moves.AIR_CUTTER, Type.FLYING, MoveCategory.SPECIAL, 60, 95, 25, -1, 0, 3)
      .attr(HighCritAttr)
      .slicingMove()
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.OVERHEAT, Type.FIRE, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2, true)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE),
    new StatusMove(Moves.ODOR_SLEUTH, Type.NORMAL, -1, 40, -1, 0, 3)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_GHOST)
      .ignoresSubstitute(),
    new AttackMove(Moves.ROCK_TOMB, Type.ROCK, MoveCategory.PHYSICAL, 60, 95, 15, 100, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .makesContact(false),
    new AttackMove(Moves.SILVER_WIND, Type.BUG, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .windMove(),
    new StatusMove(Moves.METAL_SOUND, Type.STEEL, 85, 40, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2)
      .soundBased(),
    new StatusMove(Moves.GRASS_WHISTLE, Type.GRASS, 55, 15, -1, 0, 3)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundBased(),
    new StatusMove(Moves.TICKLE, Type.NORMAL, 100, 20, -1, 0, 3).attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF], -1),
    new SelfStatusMove(Moves.COSMIC_POWER, Type.PSYCHIC, -1, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      1,
      true,
    ),
    new AttackMove(Moves.WATER_SPOUT, Type.WATER, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 3)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.SIGNAL_BEAM, Type.BUG, MoveCategory.SPECIAL, 75, 100, 15, 10, 0, 3).attr(ConfuseAttr),
    new AttackMove(Moves.SHADOW_PUNCH, Type.GHOST, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 3).punchingMove(),
    new AttackMove(Moves.EXTRASENSORY, Type.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 20, 10, 0, 3).attr(FlinchAttr),
    new AttackMove(Moves.SKY_UPPERCUT, Type.FIGHTING, MoveCategory.PHYSICAL, 85, 90, 15, -1, 0, 3)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .punchingMove(),
    new AttackMove(Moves.SAND_TOMB, Type.GROUND, MoveCategory.PHYSICAL, 35, 85, 15, -1, 0, 3)
      .attr(TrapAttr, BattlerTagType.SAND_TOMB)
      .makesContact(false),
    new AttackMove(Moves.SHEER_COLD, Type.ICE, MoveCategory.SPECIAL, 200, 20, 5, -1, 0, 3)
      .attr(IceNoEffectTypeAttr)
      .attr(OneHitKOAttr)
      .attr(SheerColdAccuracyAttr),
    new AttackMove(Moves.MUDDY_WATER, Type.WATER, MoveCategory.SPECIAL, 90, 85, 10, 30, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BULLET_SEED, Type.GRASS, MoveCategory.PHYSICAL, 25, 100, 30, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.AERIAL_ACE, Type.FLYING, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 3).slicingMove(),
    new AttackMove(Moves.ICICLE_SPEAR, Type.ICE, MoveCategory.PHYSICAL, 25, 100, 30, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false),
    new SelfStatusMove(Moves.IRON_DEFENSE, Type.STEEL, -1, 15, -1, 0, 3).attr(StatStageChangeAttr, [Stat.DEF], 2, true),
    new StatusMove(Moves.BLOCK, Type.NORMAL, -1, 5, -1, 0, 3)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true, turnCountMin: 1 }),
    new StatusMove(Moves.HOWL, Type.NORMAL, -1, 40, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], 1)
      .soundBased()
      .target(MoveTarget.USER_AND_ALLIES),
    new AttackMove(Moves.DRAGON_CLAW, Type.DRAGON, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 3),
    new AttackMove(Moves.FRENZY_PLANT, Type.GRASS, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3).attr(RechargeAttr),
    new SelfStatusMove(Moves.BULK_UP, Type.FIGHTING, -1, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF],
      1,
      true,
    ),
    new ChargingAttackMove(Moves.BOUNCE, Type.FLYING, MoveCategory.PHYSICAL, 85, 85, 5, 30, 0, 3)
      .chargeText(i18next.t("moveTriggers:sprangUp", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.FLYING)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .condition(failOnGravityCondition)
      .ignoresVirtual(),
    new AttackMove(Moves.MUD_SHOT, Type.GROUND, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(Moves.POISON_TAIL, Type.POISON, MoveCategory.PHYSICAL, 50, 100, 25, 10, 0, 3)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(Moves.COVET, Type.NORMAL, MoveCategory.PHYSICAL, 60, 100, 25, -1, 0, 3).attr(
      StealHeldItemChanceAttr,
      0.3,
    ),
    new AttackMove(Moves.VOLT_TACKLE, Type.ELECTRIC, MoveCategory.PHYSICAL, 120, 100, 15, 10, 0, 3)
      .attr(RecoilAttr, false, 0.33)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .recklessMove(),
    new AttackMove(Moves.MAGICAL_LEAF, Type.GRASS, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 3),
    new StatusMove(Moves.WATER_SPORT, Type.WATER, -1, 15, -1, 0, 3)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.WATER_SPORT, 5)
      .target(MoveTarget.BOTH_SIDES),
    new SelfStatusMove(Moves.CALM_MIND, Type.PSYCHIC, -1, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPATK, Stat.SPDEF],
      1,
      true,
    ),
    new AttackMove(Moves.LEAF_BLADE, Type.GRASS, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 3)
      .attr(HighCritAttr)
      .slicingMove(),
    new SelfStatusMove(Moves.DRAGON_DANCE, Type.DRAGON, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPD], 1, true)
      .danceMove(),
    new AttackMove(Moves.ROCK_BLAST, Type.ROCK, MoveCategory.PHYSICAL, 25, 90, 10, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.SHOCK_WAVE, Type.ELECTRIC, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 3),
    new AttackMove(Moves.WATER_PULSE, Type.WATER, MoveCategory.SPECIAL, 60, 100, 20, 20, 0, 3)
      .attr(ConfuseAttr)
      .pulseMove(),
    new AttackMove(Moves.DOOM_DESIRE, Type.STEEL, MoveCategory.SPECIAL, 140, 100, 5, -1, 0, 3)
      .partial() // cannot be used on multiple Pokemon on the same side in a double battle, hits immediately when called by Metronome/etc, should not apply abilities or held items if user is off the field
      .ignoresProtect()
      .attr(
        DelayedAttackAttr,
        ArenaTagType.DOOM_DESIRE,
        ChargeAnim.DOOM_DESIRE_CHARGING,
        i18next.t("moveTriggers:choseDoomDesireAsDestiny", { pokemonName: "{USER}" }),
      ),
    new AttackMove(Moves.PSYCHO_BOOST, Type.PSYCHIC, MoveCategory.SPECIAL, 140, 90, 5, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new SelfStatusMove(Moves.ROOST, Type.FLYING, -1, 5, -1, 0, 4)
      .attr(HealAttr, 0.5)
      .attr(AddBattlerTagAttr, BattlerTagType.ROOSTED, true)
      .triageMove(),
    new StatusMove(Moves.GRAVITY, Type.PSYCHIC, -1, 5, -1, 0, 4)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.GRAVITY, 5)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(Moves.MIRACLE_EYE, Type.PSYCHIC, -1, 40, -1, 0, 4)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_DARK)
      .ignoresSubstitute(),
    new AttackMove(Moves.WAKE_UP_SLAP, Type.FIGHTING, MoveCategory.PHYSICAL, 70, 100, 10, -1, 0, 4)
      .attr(MovePowerMultiplierAttr, (user, target, move) =>
        targetSleptOrComatoseCondition(user, target, move) ? 2 : 1,
      )
      .attr(HealStatusEffectAttr, false, StatusEffect.SLEEP),
    new AttackMove(Moves.HAMMER_ARM, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPD], -1, true)
      .punchingMove(),
    new AttackMove(Moves.GYRO_BALL, Type.STEEL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4)
      .attr(GyroBallPowerAttr)
      .ballBombMove(),
    new SelfStatusMove(Moves.HEALING_WISH, Type.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SacrificialFullRestoreAttr, false, "moveTriggers:sacrificialFullRestore")
      .triageMove()
      .partial(), // Does not have the effect of being stored if the incoming Pokemon is already healthy
    new AttackMove(Moves.BRINE, Type.WATER, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 4).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) => (target.getHpRatio() < 0.5 ? 2 : 1),
    ),
    new AttackMove(Moves.NATURAL_GIFT, Type.NORMAL, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 4)
      .makesContact(false)
      .unimplemented(),
    new AttackMove(Moves.FEINT, Type.NORMAL, MoveCategory.PHYSICAL, 30, 100, 10, -1, 2, 4)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.PROTECTED])
      .attr(
        RemoveArenaTagsAttr,
        [ArenaTagType.QUICK_GUARD, ArenaTagType.WIDE_GUARD, ArenaTagType.MAT_BLOCK, ArenaTagType.CRAFTY_SHIELD],
        false,
      )
      .makesContact(false)
      .ignoresProtect(),
    new AttackMove(Moves.PLUCK, Type.FLYING, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 4).attr(StealEatBerryAttr),
    new StatusMove(Moves.TAILWIND, Type.FLYING, -1, 15, -1, 0, 4)
      .windMove()
      .attr(AddArenaTagAttr, ArenaTagType.TAILWIND, 4, true)
      .target(MoveTarget.USER_SIDE),
    new StatusMove(Moves.ACUPRESSURE, Type.NORMAL, -1, 30, -1, 0, 4)
      .attr(AcupressureStatStageChangeAttr)
      .target(MoveTarget.USER_OR_NEAR_ALLY),
    new AttackMove(Moves.METAL_BURST, Type.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 4)
      .attr(
        CounterDamageAttr,
        (move: Move) => move.category === MoveCategory.PHYSICAL || move.category === MoveCategory.SPECIAL,
        1.5,
      )
      .redirectCounter()
      .makesContact(false)
      .target(MoveTarget.ATTACKER),
    new AttackMove(Moves.U_TURN, Type.BUG, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 4).attr(ForceSwitchOutAttr, true),
    new AttackMove(Moves.CLOSE_COMBAT, Type.FIGHTING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      -1,
      true,
    ),
    new AttackMove(Moves.PAYBACK, Type.DARK, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 4).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) =>
        target.getLastXMoves(1).find((m) => m.turn === globalScene.currentBattle.turn)
        || globalScene.currentBattle.turnCommands[target.getBattlerIndex()]?.command === Command.BALL
          ? 2
          : 1,
    ),
    new AttackMove(Moves.ASSURANCE, Type.DARK, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 4).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) => (target.turnData.damageTaken > 0 ? 2 : 1),
    ),
    new StatusMove(Moves.EMBARGO, Type.DARK, 100, 15, -1, 0, 4).unimplemented(),
    new AttackMove(Moves.FLING, Type.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 4)
      .makesContact(false)
      .unimplemented(),
    new StatusMove(Moves.PSYCHO_SHIFT, Type.PSYCHIC, 100, 10, -1, 0, 4)
      .attr(PsychoShiftEffectAttr)
      .condition((user, target, _move) => {
        let statusToApply = user.hasAbility(Abilities.COMATOSE) ? StatusEffect.SLEEP : undefined;
        if (user.status?.effect && isNonVolatileStatusEffect(user.status.effect)) {
          statusToApply = user.status.effect;
        }
        return !!statusToApply && target.canSetStatus(statusToApply, false, false, user);
      }),
    new AttackMove(Moves.TRUMP_CARD, Type.NORMAL, MoveCategory.SPECIAL, -1, -1, 5, -1, 0, 4)
      .makesContact()
      .attr(LessPPMorePowerAttr),
    new StatusMove(Moves.HEAL_BLOCK, Type.PSYCHIC, 100, 15, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.HEAL_BLOCK, false, { failOnOverlap: true, turnCountMin: 5 })
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.WRING_OUT, Type.NORMAL, MoveCategory.SPECIAL, -1, 100, 5, -1, 0, 4)
      .attr(OpponentHighHpPowerAttr, 120)
      .makesContact(),
    new SelfStatusMove(Moves.POWER_TRICK, Type.PSYCHIC, -1, 10, -1, 0, 4).attr(
      AddBattlerTagAttr,
      BattlerTagType.POWER_TRICK,
      true,
    ),
    new StatusMove(Moves.GASTRO_ACID, Type.POISON, 100, 10, -1, 0, 4).attr(SuppressAbilitiesAttr),
    new StatusMove(Moves.LUCKY_CHANT, Type.NORMAL, -1, 30, -1, 0, 4)
      .attr(AddArenaTagAttr, ArenaTagType.NO_CRIT, 5, true, true)
      .target(MoveTarget.USER_SIDE),
    new StatusMove(Moves.ME_FIRST, Type.NORMAL, -1, 20, -1, 0, 4)
      .ignoresSubstitute()
      .ignoresVirtual()
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new SelfStatusMove(Moves.COPYCAT, Type.NORMAL, -1, 20, -1, 0, 4).attr(CopyMoveAttr).ignoresVirtual(),
    new StatusMove(Moves.POWER_SWAP, Type.PSYCHIC, -1, 10, 100, 0, 4)
      .attr(SwapStatStagesAttr, [Stat.ATK, Stat.SPATK])
      .ignoresSubstitute(),
    new StatusMove(Moves.GUARD_SWAP, Type.PSYCHIC, -1, 10, 100, 0, 4)
      .attr(SwapStatStagesAttr, [Stat.DEF, Stat.SPDEF])
      .ignoresSubstitute(),
    new AttackMove(Moves.PUNISHMENT, Type.DARK, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4)
      .makesContact(true)
      .attr(PunishmentPowerAttr),
    new AttackMove(Moves.LAST_RESORT, Type.NORMAL, MoveCategory.PHYSICAL, 140, 100, 5, -1, 0, 4).attr(LastResortAttr),
    new StatusMove(Moves.WORRY_SEED, Type.GRASS, 100, 10, -1, 0, 4).attr(AbilityChangeAttr, Abilities.INSOMNIA),
    new AttackMove(Moves.SUCKER_PUNCH, Type.DARK, MoveCategory.PHYSICAL, 70, 100, 5, -1, 1, 4).condition(
      (_user, target, _move) => {
        const turnCommand = globalScene.currentBattle.turnCommands[target.getBattlerIndex()];
        if (!turnCommand || !turnCommand.move) {
          return false;
        }
        return (
          turnCommand.command === Command.FIGHT
          && !target.turnData.acted
          && allMoves[turnCommand.move.move].category !== MoveCategory.STATUS
        );
      },
    ),
    new StatusMove(Moves.TOXIC_SPIKES, Type.POISON, -1, 20, -1, 0, 4)
      .attr(AddArenaTrapTagAttr, ArenaTagType.TOXIC_SPIKES)
      .target(MoveTarget.ENEMY_SIDE),
    new StatusMove(Moves.HEART_SWAP, Type.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SwapStatStagesAttr, BATTLE_STATS)
      .ignoresSubstitute(),
    new SelfStatusMove(Moves.AQUA_RING, Type.WATER, -1, 20, -1, 0, 4).attr(
      AddBattlerTagAttr,
      BattlerTagType.AQUA_RING,
      true,
      { failOnOverlap: true },
    ),
    new SelfStatusMove(Moves.MAGNET_RISE, Type.ELECTRIC, -1, 10, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.FLOATING, true, { failOnOverlap: true, turnCountMin: 5 })
      .condition(
        (user, _target, _move) =>
          !globalScene.arena.getTag(ArenaTagType.GRAVITY)
          && [BattlerTagType.FLOATING, BattlerTagType.IGNORE_FLYING, BattlerTagType.INGRAIN].every(
            (tag) => !user.getTag(tag),
          ),
      ),
    new AttackMove(Moves.FLARE_BLITZ, Type.FIRE, MoveCategory.PHYSICAL, 120, 100, 15, 10, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .recklessMove(),
    new AttackMove(Moves.FORCE_PALM, Type.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, 30, 0, 4).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(Moves.AURA_SPHERE, Type.FIGHTING, MoveCategory.SPECIAL, 80, -1, 20, -1, 0, 4)
      .pulseMove()
      .ballBombMove(),
    new SelfStatusMove(Moves.ROCK_POLISH, Type.ROCK, -1, 20, -1, 0, 4).attr(StatStageChangeAttr, [Stat.SPD], 2, true),
    new AttackMove(Moves.POISON_JAB, Type.POISON, MoveCategory.PHYSICAL, 80, 100, 20, 30, 0, 4).attr(
      StatusEffectAttr,
      StatusEffect.POISON,
    ),
    new AttackMove(Moves.DARK_PULSE, Type.DARK, MoveCategory.SPECIAL, 80, 100, 15, 20, 0, 4)
      .attr(FlinchAttr)
      .pulseMove(),
    new AttackMove(Moves.NIGHT_SLASH, Type.DARK, MoveCategory.PHYSICAL, 70, 100, 15, -1, 0, 4)
      .attr(HighCritAttr)
      .slicingMove(),
    new AttackMove(Moves.AQUA_TAIL, Type.WATER, MoveCategory.PHYSICAL, 90, 90, 10, -1, 0, 4),
    new AttackMove(Moves.SEED_BOMB, Type.GRASS, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 4)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.AIR_SLASH, Type.FLYING, MoveCategory.SPECIAL, 75, 95, 15, 30, 0, 4)
      .attr(FlinchAttr)
      .slicingMove(),
    new AttackMove(Moves.X_SCISSOR, Type.BUG, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 4).slicingMove(),
    new AttackMove(Moves.BUG_BUZZ, Type.BUG, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .soundBased(),
    new AttackMove(Moves.DRAGON_PULSE, Type.DRAGON, MoveCategory.SPECIAL, 85, 100, 10, -1, 0, 4).pulseMove(),
    new AttackMove(Moves.DRAGON_RUSH, Type.DRAGON, MoveCategory.PHYSICAL, 100, 75, 10, 20, 0, 4)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new AttackMove(Moves.POWER_GEM, Type.ROCK, MoveCategory.SPECIAL, 80, 100, 20, -1, 0, 4),
    new AttackMove(Moves.DRAIN_PUNCH, Type.FIGHTING, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 4)
      .attr(HitHealAttr)
      .punchingMove()
      .triageMove(),
    new AttackMove(Moves.VACUUM_WAVE, Type.FIGHTING, MoveCategory.SPECIAL, 40, 100, 30, -1, 1, 4),
    new AttackMove(Moves.FOCUS_BLAST, Type.FIGHTING, MoveCategory.SPECIAL, 120, 70, 5, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .ballBombMove(),
    new AttackMove(Moves.ENERGY_BALL, Type.GRASS, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .ballBombMove(),
    new AttackMove(Moves.BRAVE_BIRD, Type.FLYING, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(Moves.EARTH_POWER, Type.GROUND, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new StatusMove(Moves.SWITCHEROO, Type.DARK, 100, 10, -1, 0, 4).unimplemented(),
    new AttackMove(Moves.GIGA_IMPACT, Type.NORMAL, MoveCategory.PHYSICAL, 150, 90, 5, -1, 0, 4).attr(RechargeAttr),
    new SelfStatusMove(Moves.NASTY_PLOT, Type.DARK, -1, 20, -1, 0, 4).attr(StatStageChangeAttr, [Stat.SPATK], 2, true),
    new AttackMove(Moves.BULLET_PUNCH, Type.STEEL, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4).punchingMove(),
    new AttackMove(Moves.AVALANCHE, Type.ICE, MoveCategory.PHYSICAL, 60, 100, 10, -1, -4, 4).attr(
      TurnDamagedDoublePowerAttr,
    ),
    new AttackMove(Moves.ICE_SHARD, Type.ICE, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4).makesContact(false),
    new AttackMove(Moves.SHADOW_CLAW, Type.GHOST, MoveCategory.PHYSICAL, 70, 100, 15, -1, 0, 4).attr(HighCritAttr),
    new AttackMove(Moves.THUNDER_FANG, Type.ELECTRIC, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .bitingMove(),
    new AttackMove(Moves.ICE_FANG, Type.ICE, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .bitingMove(),
    new AttackMove(Moves.FIRE_FANG, Type.FIRE, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .bitingMove(),
    new AttackMove(Moves.SHADOW_SNEAK, Type.GHOST, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4),
    new AttackMove(Moves.MUD_BOMB, Type.GROUND, MoveCategory.SPECIAL, 65, 85, 10, 30, 0, 4)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .ballBombMove(),
    new AttackMove(Moves.PSYCHO_CUT, Type.PSYCHIC, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 4)
      .attr(HighCritAttr)
      .slicingMove()
      .makesContact(false),
    new AttackMove(Moves.ZEN_HEADBUTT, Type.PSYCHIC, MoveCategory.PHYSICAL, 80, 90, 15, 20, 0, 4).attr(FlinchAttr),
    new AttackMove(Moves.MIRROR_SHOT, Type.STEEL, MoveCategory.SPECIAL, 65, 85, 10, 30, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(Moves.FLASH_CANNON, Type.STEEL, MoveCategory.SPECIAL, 80, 100, 10, 10, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new AttackMove(Moves.ROCK_CLIMB, Type.NORMAL, MoveCategory.PHYSICAL, 90, 85, 20, 20, 0, 4).attr(ConfuseAttr),
    new StatusMove(Moves.DEFOG, Type.FLYING, -1, 15, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.EVA], -1)
      .attr(ClearWeatherAttr, WeatherType.FOG)
      .attr(ClearTerrainAttr)
      .attr(RemoveScreensAttr, false)
      .attr(RemoveArenaTrapAttr, true),
    new StatusMove(Moves.TRICK_ROOM, Type.PSYCHIC, -1, 5, -1, -7, 4)
      .attr(AddArenaTagAttr, ArenaTagType.TRICK_ROOM, 5)
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.DRACO_METEOR, Type.DRAGON, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new AttackMove(Moves.DISCHARGE, Type.ELECTRIC, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.LAVA_PLUME, Type.FIRE, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.LEAF_STORM, Type.GRASS, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new AttackMove(Moves.POWER_WHIP, Type.GRASS, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 4),
    new AttackMove(Moves.ROCK_WRECKER, Type.ROCK, MoveCategory.PHYSICAL, 150, 90, 5, -1, 0, 4)
      .attr(RechargeAttr)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.CROSS_POISON, Type.POISON, MoveCategory.PHYSICAL, 70, 100, 20, 10, 0, 4)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .slicingMove(),
    new AttackMove(Moves.GUNK_SHOT, Type.POISON, MoveCategory.PHYSICAL, 120, 80, 5, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(Moves.IRON_HEAD, Type.STEEL, MoveCategory.PHYSICAL, 80, 100, 15, 30, 0, 4).attr(FlinchAttr),
    new AttackMove(Moves.MAGNET_BOMB, Type.STEEL, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 4)
      .makesContact(false)
      .ballBombMove(),
    new AttackMove(Moves.STONE_EDGE, Type.ROCK, MoveCategory.PHYSICAL, 100, 80, 5, -1, 0, 4)
      .attr(HighCritAttr)
      .makesContact(false),
    new StatusMove(Moves.CAPTIVATE, Type.NORMAL, 100, 20, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2)
      .condition((user, target, _move) => target.isOppositeGender(user))
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.STEALTH_ROCK, Type.ROCK, -1, 20, -1, 0, 4)
      .attr(AddArenaTrapTagAttr, ArenaTagType.STEALTH_ROCK)
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(Moves.GRASS_KNOT, Type.GRASS, MoveCategory.SPECIAL, -1, 100, 20, -1, 0, 4)
      .attr(WeightPowerAttr)
      .makesContact(),
    new AttackMove(Moves.CHATTER, Type.FLYING, MoveCategory.SPECIAL, 65, 100, 20, 100, 0, 4)
      .attr(ConfuseAttr)
      .soundBased(),
    new AttackMove(Moves.JUDGMENT, Type.NORMAL, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 4).attr(
      FormChangeItemTypeAttr,
    ),
    new AttackMove(Moves.BUG_BITE, Type.BUG, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 4).attr(StealEatBerryAttr),
    new AttackMove(Moves.CHARGE_BEAM, Type.ELECTRIC, MoveCategory.SPECIAL, 50, 90, 10, 70, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      1,
      true,
    ),
    new AttackMove(Moves.WOOD_HAMMER, Type.GRASS, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(Moves.AQUA_JET, Type.WATER, MoveCategory.PHYSICAL, 40, 100, 20, -1, 1, 4),
    new AttackMove(Moves.ATTACK_ORDER, Type.BUG, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 4)
      .attr(HighCritAttr)
      .makesContact(false),
    new SelfStatusMove(Moves.DEFEND_ORDER, Type.BUG, -1, 10, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      1,
      true,
    ),
    new SelfStatusMove(Moves.HEAL_ORDER, Type.BUG, -1, 5, -1, 0, 4).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(Moves.HEAD_SMASH, Type.ROCK, MoveCategory.PHYSICAL, 150, 80, 5, -1, 0, 4)
      .attr(RecoilAttr, false, 0.5)
      .recklessMove(),
    new AttackMove(Moves.DOUBLE_HIT, Type.NORMAL, MoveCategory.PHYSICAL, 35, 90, 10, -1, 0, 4).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(Moves.ROAR_OF_TIME, Type.DRAGON, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 4).attr(RechargeAttr),
    new AttackMove(Moves.SPACIAL_REND, Type.DRAGON, MoveCategory.SPECIAL, 100, 95, 5, -1, 0, 4).attr(HighCritAttr),
    new SelfStatusMove(Moves.LUNAR_DANCE, Type.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SacrificialFullRestoreAttr, true, "moveTriggers:lunarDanceRestore")
      .danceMove()
      .triageMove()
      .partial(), // Does not have the effect of being stored if the incoming Pokemon is already perfectly healthy
    new AttackMove(Moves.CRUSH_GRIP, Type.NORMAL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4).attr(
      OpponentHighHpPowerAttr,
      120,
    ),
    new AttackMove(Moves.MAGMA_STORM, Type.FIRE, MoveCategory.SPECIAL, 100, 75, 5, -1, 0, 4).attr(
      TrapAttr,
      BattlerTagType.MAGMA_STORM,
    ),
    new StatusMove(Moves.DARK_VOID, Type.DARK, 80, 10, -1, 0, 4) //Accuracy from Generations 4-6
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.SEED_FLARE, Type.GRASS, MoveCategory.SPECIAL, 120, 85, 5, 40, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -2,
    ),
    new AttackMove(Moves.OMINOUS_WIND, Type.GHOST, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .windMove(),
    new ChargingAttackMove(Moves.SHADOW_FORCE, Type.GHOST, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 4)
      .chargeText(i18next.t("moveTriggers:vanishedInstantly", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.HIDDEN)
      .ignoresProtect()
      .ignoresVirtual(),
    new SelfStatusMove(Moves.HONE_CLAWS, Type.DARK, -1, 15, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.ACC],
      1,
      true,
    ),
    new StatusMove(Moves.WIDE_GUARD, Type.ROCK, -1, 10, -1, 3, 5)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.WIDE_GUARD, 1, true, true)
      .condition(failIfLastCondition),
    new StatusMove(Moves.GUARD_SPLIT, Type.PSYCHIC, -1, 10, -1, 0, 5).attr(
      AverageStatsAttr,
      [Stat.DEF, Stat.SPDEF],
      "moveTriggers:sharedGuard",
    ),
    new StatusMove(Moves.POWER_SPLIT, Type.PSYCHIC, -1, 10, -1, 0, 5).attr(
      AverageStatsAttr,
      [Stat.ATK, Stat.SPATK],
      "moveTriggers:sharedPower",
    ),
    new StatusMove(Moves.WONDER_ROOM, Type.PSYCHIC, -1, 10, -1, 0, 5)
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .unimplemented(),
    new AttackMove(Moves.PSYSHOCK, Type.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5).attr(DefDefAttr),
    new AttackMove(Moves.VENOSHOCK, Type.POISON, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 5).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) =>
        target.status && (target.status.effect === StatusEffect.POISON || target.status.effect === StatusEffect.TOXIC)
          ? 2
          : 1,
    ),
    new SelfStatusMove(Moves.AUTOTOMIZE, Type.STEEL, -1, 15, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true)
      .attr(AddBattlerTagAttr, BattlerTagType.AUTOTOMIZED, true),
    new SelfStatusMove(Moves.RAGE_POWDER, Type.BUG, -1, 20, -1, 2, 5)
      .powderMove()
      .attr(AddBattlerTagAttr, BattlerTagType.CENTER_OF_ATTENTION, true),
    new StatusMove(Moves.TELEKINESIS, Type.PSYCHIC, -1, 15, -1, 0, 5)
      .condition(failOnGravityCondition)
      .condition(
        (_user, target, _move) =>
          ![
            Species.DIGLETT,
            Species.DUGTRIO,
            Species.ALOLA_DIGLETT,
            Species.ALOLA_DUGTRIO,
            Species.SANDYGAST,
            Species.PALOSSAND,
            Species.WIGLETT,
            Species.WUGTRIO,
          ].includes(target.species.speciesId),
      )
      .condition(
        (_user, target, _move) => !(target.species.speciesId === Species.GENGAR && target.getFormKey() === "mega"),
      )
      .condition(
        (_user, target, _move) =>
          isNullOrUndefined(target.getTag(BattlerTagType.INGRAIN))
          && isNullOrUndefined(target.getTag(BattlerTagType.IGNORE_FLYING)),
      )
      .attr(AddBattlerTagAttr, BattlerTagType.TELEKINESIS, false, { failOnOverlap: true, turnCountMin: 3 })
      .attr(AddBattlerTagAttr, BattlerTagType.FLOATING, false, { failOnOverlap: true, turnCountMin: 3 }),
    new StatusMove(Moves.MAGIC_ROOM, Type.PSYCHIC, -1, 10, -1, 0, 5)
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .unimplemented(),
    new AttackMove(Moves.SMACK_DOWN, Type.ROCK, MoveCategory.PHYSICAL, 50, 100, 15, 100, 0, 5)
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, false, { lastHitOnly: true })
      .attr(AddBattlerTagAttr, BattlerTagType.INTERRUPTED)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLYING, BattlerTagType.FLOATING, BattlerTagType.TELEKINESIS])
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .makesContact(false),
    new AttackMove(Moves.STORM_THROW, Type.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 5).attr(CritOnlyAttr),
    new AttackMove(Moves.FLAME_BURST, Type.FIRE, MoveCategory.SPECIAL, 70, 100, 15, -1, 0, 5).attr(FlameBurstAttr),
    new AttackMove(Moves.SLUDGE_WAVE, Type.POISON, MoveCategory.SPECIAL, 95, 100, 10, 10, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new SelfStatusMove(Moves.QUIVER_DANCE, Type.BUG, -1, 20, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .danceMove(),
    new AttackMove(Moves.HEAVY_SLAM, Type.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 5)
      .attr(AlwaysHitMinimizeAttr)
      .attr(CompareWeightPowerAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED),
    new AttackMove(Moves.SYNCHRONOISE, Type.PSYCHIC, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 5)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .condition(unknownTypeCondition)
      .attr(HitsSameTypeAttr),
    new AttackMove(Moves.ELECTRO_BALL, Type.ELECTRIC, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 5)
      .attr(ElectroBallPowerAttr)
      .ballBombMove(),
    new StatusMove(Moves.SOAK, Type.WATER, 100, 20, -1, 0, 5).attr(ChangeTypeAttr, Type.WATER),
    new AttackMove(Moves.FLAME_CHARGE, Type.FIRE, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      1,
      true,
    ),
    new SelfStatusMove(Moves.COIL, Type.POISON, -1, 20, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF, Stat.ACC],
      1,
      true,
    ),
    new AttackMove(Moves.LOW_SWEEP, Type.FIGHTING, MoveCategory.PHYSICAL, 65, 100, 20, 100, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(Moves.ACID_SPRAY, Type.POISON, MoveCategory.SPECIAL, 40, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2)
      .ballBombMove(),
    new AttackMove(Moves.FOUL_PLAY, Type.DARK, MoveCategory.PHYSICAL, 95, 100, 15, -1, 0, 5).attr(TargetAtkUserAtkAttr),
    new StatusMove(Moves.SIMPLE_BEAM, Type.NORMAL, 100, 15, -1, 0, 5).attr(AbilityChangeAttr, Abilities.SIMPLE),
    new StatusMove(Moves.ENTRAINMENT, Type.NORMAL, 100, 15, -1, 0, 5).attr(AbilityGiveAttr),
    new StatusMove(Moves.AFTER_YOU, Type.NORMAL, -1, 15, -1, 0, 5)
      .ignoresProtect()
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_OTHER)
      .condition(failIfSingleBattle)
      .condition((_user, target, _move) => !target.turnData.acted)
      .attr(AfterYouAttr),
    new AttackMove(Moves.ROUND, Type.NORMAL, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 5)
      .attr(CueNextRoundAttr)
      .attr(RoundPowerAttr)
      .soundBased(),
    new AttackMove(Moves.ECHOED_VOICE, Type.NORMAL, MoveCategory.SPECIAL, 40, 100, 15, -1, 0, 5)
      .attr(ConsecutiveUseMultiBasePowerAttr, 5, false)
      .soundBased(),
    new AttackMove(Moves.CHIP_AWAY, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 5).attr(
      IgnoreOpponentStatStagesAttr,
    ),
    new AttackMove(Moves.CLEAR_SMOG, Type.POISON, MoveCategory.SPECIAL, 50, -1, 15, -1, 0, 5).attr(
      ResetStatsAttr,
      false,
    ),
    new AttackMove(Moves.STORED_POWER, Type.PSYCHIC, MoveCategory.SPECIAL, 20, 100, 10, -1, 0, 5).attr(
      PositiveStatStagePowerAttr,
    ),
    new StatusMove(Moves.QUICK_GUARD, Type.FIGHTING, -1, 15, -1, 3, 5)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.QUICK_GUARD, 1, true, true)
      .condition(failIfLastCondition),
    new SelfStatusMove(Moves.ALLY_SWITCH, Type.PSYCHIC, -1, 15, -1, 2, 5).ignoresProtect().unimplemented(),
    new AttackMove(Moves.SCALD, Type.WATER, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 5)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new SelfStatusMove(Moves.SHELL_SMASH, Type.NORMAL, -1, 15, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK, Stat.SPD], 2, true)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true),
    new StatusMove(Moves.HEAL_PULSE, Type.PSYCHIC, -1, 10, -1, 0, 5)
      .attr(HealAttr, 0.5, false, false)
      .pulseMove()
      .triageMove(),
    new AttackMove(Moves.HEX, Type.GHOST, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 5).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) => (target.status || target.hasAbility(Abilities.COMATOSE) ? 2 : 1),
    ),
    new ChargingAttackMove(Moves.SKY_DROP, Type.FLYING, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 5)
      .chargeText(i18next.t("moveTriggers:tookTargetIntoSky", { pokemonName: "{USER}", targetName: "{TARGET}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.FLYING)
      .condition(failOnGravityCondition)
      .condition((_user, target, _move) => !target.getTag(BattlerTagType.SUBSTITUTE))
      .ignoresVirtual()
      .partial(), // Should immobilize the target, Flying types should take no damage. cf https://bulbapedia.bulbagarden.net/wiki/Sky_Drop_(move) and https://www.smogon.com/dex/sv/moves/sky-drop/
    new SelfStatusMove(Moves.SHIFT_GEAR, Type.STEEL, -1, 10, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true),
    new AttackMove(Moves.CIRCLE_THROW, Type.FIGHTING, MoveCategory.PHYSICAL, 60, 90, 10, -1, -6, 5)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .hidesTarget(),
    new AttackMove(Moves.INCINERATE, Type.FIRE, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 5)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(RemoveHeldItemAttr, true),
    new StatusMove(Moves.QUASH, Type.DARK, 100, 15, -1, 0, 5).condition(failIfSingleBattle).unimplemented(),
    new AttackMove(Moves.ACROBATICS, Type.FLYING, MoveCategory.PHYSICAL, 55, 100, 15, -1, 0, 5).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) =>
        Math.max(
          1,
          2
            - 0.2
              * user
                .getHeldItems()
                .filter((i) => i.isTransferable)
                .reduce((v, m) => v + m.stackCount, 0),
        ),
    ),
    new StatusMove(Moves.REFLECT_TYPE, Type.NORMAL, -1, 15, -1, 0, 5).ignoresSubstitute().attr(CopyTypeAttr),
    new AttackMove(Moves.RETALIATE, Type.NORMAL, MoveCategory.PHYSICAL, 70, 100, 5, -1, 0, 5).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) => {
        const turn = globalScene.currentBattle.turn;
        const lastPlayerFaint =
          globalScene.currentBattle.playerFaintsHistory[globalScene.currentBattle.playerFaintsHistory.length - 1];
        const lastEnemyFaint =
          globalScene.currentBattle.enemyFaintsHistory[globalScene.currentBattle.enemyFaintsHistory.length - 1];
        return (lastPlayerFaint !== undefined && turn - lastPlayerFaint.turn === 1 && user.isPlayer())
          || (lastEnemyFaint !== undefined && turn - lastEnemyFaint.turn === 1 && !user.isPlayer())
          ? 2
          : 1;
      },
    ),
    new AttackMove(Moves.FINAL_GAMBIT, Type.FIGHTING, MoveCategory.SPECIAL, -1, 100, 5, -1, 0, 5)
      .attr(UserHpDamageAttr)
      .attr(SacrificialAttrOnHit),
    new StatusMove(Moves.BESTOW, Type.NORMAL, -1, 15, -1, 0, 5).ignoresProtect().ignoresSubstitute().unimplemented(),
    new AttackMove(Moves.INFERNO, Type.FIRE, MoveCategory.SPECIAL, 100, 50, 5, 100, 0, 5).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(Moves.WATER_PLEDGE, Type.WATER, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.WATER_FIRE_PLEDGE, Moves.FIRE_PLEDGE, true)
      .attr(AddPledgeEffectAttr, ArenaTagType.GRASS_WATER_PLEDGE, Moves.GRASS_PLEDGE)
      .attr(BypassRedirectAttr, true),
    new AttackMove(Moves.FIRE_PLEDGE, Type.FIRE, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.FIRE_GRASS_PLEDGE, Moves.GRASS_PLEDGE)
      .attr(AddPledgeEffectAttr, ArenaTagType.WATER_FIRE_PLEDGE, Moves.WATER_PLEDGE, true)
      .attr(BypassRedirectAttr, true),
    new AttackMove(Moves.GRASS_PLEDGE, Type.GRASS, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.GRASS_WATER_PLEDGE, Moves.WATER_PLEDGE)
      .attr(AddPledgeEffectAttr, ArenaTagType.FIRE_GRASS_PLEDGE, Moves.FIRE_PLEDGE)
      .attr(BypassRedirectAttr, true),
    new AttackMove(Moves.VOLT_SWITCH, Type.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 20, -1, 0, 5).attr(
      ForceSwitchOutAttr,
      true,
    ),
    new AttackMove(Moves.STRUGGLE_BUG, Type.BUG, MoveCategory.SPECIAL, 50, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BULLDOZE, Type.GROUND, MoveCategory.PHYSICAL, 60, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.GRASSY && target.isGrounded() ? 0.5 : 1,
      )
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.FROST_BREATH, Type.ICE, MoveCategory.SPECIAL, 60, 90, 10, 100, 0, 5).attr(CritOnlyAttr),
    new AttackMove(Moves.DRAGON_TAIL, Type.DRAGON, MoveCategory.PHYSICAL, 60, 90, 10, -1, -6, 5)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .hidesTarget(),
    new SelfStatusMove(Moves.WORK_UP, Type.NORMAL, -1, 30, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.SPATK],
      1,
      true,
    ),
    new AttackMove(Moves.ELECTROWEB, Type.ELECTRIC, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.WILD_CHARGE, Type.ELECTRIC, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 5)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(Moves.DRILL_RUN, Type.GROUND, MoveCategory.PHYSICAL, 80, 95, 10, -1, 0, 5).attr(HighCritAttr),
    new AttackMove(Moves.DUAL_CHOP, Type.DRAGON, MoveCategory.PHYSICAL, 40, 90, 15, -1, 0, 5).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(Moves.HEART_STAMP, Type.PSYCHIC, MoveCategory.PHYSICAL, 60, 100, 25, 30, 0, 5).attr(FlinchAttr),
    new AttackMove(Moves.HORN_LEECH, Type.GRASS, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 5)
      .attr(HitHealAttr)
      .triageMove(),
    new AttackMove(Moves.SACRED_SWORD, Type.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 5)
      .attr(IgnoreOpponentStatStagesAttr)
      .slicingMove(),
    new AttackMove(Moves.RAZOR_SHELL, Type.WATER, MoveCategory.PHYSICAL, 75, 95, 10, 50, 0, 5)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .slicingMove(),
    new AttackMove(Moves.HEAT_CRASH, Type.FIRE, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 5)
      .attr(AlwaysHitMinimizeAttr)
      .attr(CompareWeightPowerAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED),
    new AttackMove(Moves.LEAF_TORNADO, Type.GRASS, MoveCategory.SPECIAL, 65, 90, 10, 50, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(Moves.STEAMROLLER, Type.BUG, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 5)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new SelfStatusMove(Moves.COTTON_GUARD, Type.GRASS, -1, 10, -1, 0, 5).attr(StatStageChangeAttr, [Stat.DEF], 3, true),
    new AttackMove(Moves.NIGHT_DAZE, Type.DARK, MoveCategory.SPECIAL, 85, 95, 10, 40, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(Moves.PSYSTRIKE, Type.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 5).attr(DefDefAttr),
    new AttackMove(Moves.TAIL_SLAP, Type.NORMAL, MoveCategory.PHYSICAL, 25, 85, 10, -1, 0, 5).attr(MultiHitAttr),
    new AttackMove(Moves.HURRICANE, Type.FLYING, MoveCategory.SPECIAL, 110, 70, 10, 30, 0, 5)
      .attr(ThunderAccuracyAttr)
      .attr(ConfuseAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .windMove(),
    new AttackMove(Moves.HEAD_CHARGE, Type.NORMAL, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 5)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(Moves.GEAR_GRIND, Type.STEEL, MoveCategory.PHYSICAL, 50, 85, 15, -1, 0, 5).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(Moves.SEARING_SHOT, Type.FIRE, MoveCategory.SPECIAL, 100, 100, 5, 30, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .ballBombMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.TECHNO_BLAST, Type.NORMAL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 5).attr(
      TechnoBlastTypeAttr,
    ),
    new AttackMove(Moves.RELIC_SONG, Type.NORMAL, MoveCategory.SPECIAL, 75, 100, 10, 10, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.SECRET_SWORD, Type.FIGHTING, MoveCategory.SPECIAL, 85, 100, 10, -1, 0, 5)
      .attr(DefDefAttr)
      .slicingMove(),
    new AttackMove(Moves.GLACIATE, Type.ICE, MoveCategory.SPECIAL, 65, 95, 10, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BOLT_STRIKE, Type.ELECTRIC, MoveCategory.PHYSICAL, 130, 85, 5, 20, 0, 5).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(Moves.BLUE_FLARE, Type.FIRE, MoveCategory.SPECIAL, 130, 85, 5, 20, 0, 5).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(Moves.FIERY_DANCE, Type.FIRE, MoveCategory.SPECIAL, 80, 100, 10, 50, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .danceMove(),
    new ChargingAttackMove(Moves.FREEZE_SHOCK, Type.ICE, MoveCategory.PHYSICAL, 140, 90, 5, 30, 0, 5)
      .chargeText(i18next.t("moveTriggers:becameCloakedInFreezingLight", { pokemonName: "{USER}" }))
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .makesContact(false),
    new ChargingAttackMove(Moves.ICE_BURN, Type.ICE, MoveCategory.SPECIAL, 140, 90, 5, 30, 0, 5)
      .chargeText(i18next.t("moveTriggers:becameCloakedInFreezingAir", { pokemonName: "{USER}" }))
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .ignoresVirtual(),
    new AttackMove(Moves.SNARL, Type.DARK, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.ICICLE_CRASH, Type.ICE, MoveCategory.PHYSICAL, 85, 90, 10, 30, 0, 5)
      .attr(FlinchAttr)
      .makesContact(false),
    new AttackMove(Moves.V_CREATE, Type.FIRE, MoveCategory.PHYSICAL, 180, 95, 5, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF, Stat.SPD],
      -1,
      true,
    ),
    new AttackMove(Moves.FUSION_FLARE, Type.FIRE, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 5)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(LastMoveDoublePowerAttr, Moves.FUSION_BOLT),
    new AttackMove(Moves.FUSION_BOLT, Type.ELECTRIC, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 5)
      .attr(LastMoveDoublePowerAttr, Moves.FUSION_FLARE)
      .makesContact(false),
    new AttackMove(Moves.FLYING_PRESS, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 95, 10, -1, 0, 6)
      .attr(AlwaysHitMinimizeAttr)
      .attr(FlyingTypeMultiplierAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .condition(failOnGravityCondition),
    new StatusMove(Moves.MAT_BLOCK, Type.FIGHTING, -1, 10, -1, 0, 6)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.MAT_BLOCK, 1, true, true)
      .condition(new FirstMoveCondition())
      .condition(failIfLastCondition),
    new AttackMove(Moves.BELCH, Type.POISON, MoveCategory.SPECIAL, 120, 90, 10, -1, 0, 6).condition(
      (user, _target, _move) => user.battleData.berriesEaten.length > 0,
    ),
    new StatusMove(Moves.ROTOTILLER, Type.GROUND, -1, 10, -1, 0, 6)
      .target(MoveTarget.ALL)
      .condition((_user, _target, _move) => {
        // If any fielded pokémon is grass-type and grounded.
        return [...globalScene.getEnemyParty(), ...globalScene.getPlayerParty()].some(
          (poke) => poke.isOfType(Type.GRASS) && poke.isGrounded(),
        );
      })
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 1, false, {
        condition: (_user, target, _move) => target.isOfType(Type.GRASS) && target.isGrounded(),
      }),
    new StatusMove(Moves.STICKY_WEB, Type.BUG, -1, 20, -1, 0, 6)
      .attr(AddArenaTrapTagAttr, ArenaTagType.STICKY_WEB)
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(Moves.FELL_STINGER, Type.BUG, MoveCategory.PHYSICAL, 50, 100, 25, -1, 0, 6).attr(
      PostVictoryStatStageChangeAttr,
      [Stat.ATK],
      3,
      true,
    ),
    new ChargingAttackMove(Moves.PHANTOM_FORCE, Type.GHOST, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .chargeText(i18next.t("moveTriggers:vanishedInstantly", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.HIDDEN)
      .ignoresProtect()
      .ignoresVirtual(),
    new StatusMove(Moves.TRICK_OR_TREAT, Type.GHOST, 100, 20, -1, 0, 6).attr(AddTypeAttr, Type.GHOST),
    new StatusMove(Moves.NOBLE_ROAR, Type.NORMAL, 100, 30, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1)
      .soundBased(),
    new StatusMove(Moves.ION_DELUGE, Type.ELECTRIC, -1, 25, -1, 1, 6)
      .attr(AddArenaTagAttr, ArenaTagType.ION_DELUGE)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.PARABOLIC_CHARGE, Type.ELECTRIC, MoveCategory.SPECIAL, 65, 100, 20, -1, 0, 6)
      .attr(HitHealAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .triageMove(),
    new StatusMove(Moves.FORESTS_CURSE, Type.GRASS, 100, 20, -1, 0, 6).attr(AddTypeAttr, Type.GRASS),
    new AttackMove(Moves.PETAL_BLIZZARD, Type.GRASS, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 6)
      .windMove()
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.FREEZE_DRY, Type.ICE, MoveCategory.SPECIAL, 70, 100, 20, 10, 0, 6)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .attr(FreezeDryAttr),
    new AttackMove(Moves.DISARMING_VOICE, Type.FAIRY, MoveCategory.SPECIAL, 40, -1, 15, -1, 0, 6)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.PARTING_SHOT, Type.DARK, 100, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1, false, { trigger: MoveEffectTrigger.PRE_APPLY })
      .attr(ForceSwitchOutAttr, true)
      .soundBased(),
    new StatusMove(Moves.TOPSY_TURVY, Type.DARK, -1, 20, -1, 0, 6).attr(InvertStatsAttr),
    new AttackMove(Moves.DRAINING_KISS, Type.FAIRY, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 6)
      .attr(HitHealAttr, 0.75)
      .makesContact()
      .triageMove(),
    new StatusMove(Moves.CRAFTY_SHIELD, Type.FAIRY, -1, 10, -1, 3, 6)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.CRAFTY_SHIELD, 1, true, true)
      .condition(failIfLastCondition),
    new StatusMove(Moves.FLOWER_SHIELD, Type.FAIRY, -1, 10, -1, 0, 6)
      .target(MoveTarget.ALL)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, false, {
        condition: (_user, target, _move) =>
          target.getTypes().includes(Type.GRASS) && !target.getTag(SemiInvulnerableTag),
      }),
    new StatusMove(Moves.GRASSY_TERRAIN, Type.GRASS, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.GRASSY)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(Moves.MISTY_TERRAIN, Type.FAIRY, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.MISTY)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(Moves.ELECTRIFY, Type.ELECTRIC, -1, 20, -1, 0, 6).attr(
      AddBattlerTagAttr,
      BattlerTagType.ELECTRIFIED,
      false,
      { failOnOverlap: true },
    ),
    new AttackMove(Moves.PLAY_ROUGH, Type.FAIRY, MoveCategory.PHYSICAL, 90, 90, 10, 10, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(Moves.FAIRY_WIND, Type.FAIRY, MoveCategory.SPECIAL, 40, 100, 30, -1, 0, 6).windMove(),
    new AttackMove(Moves.MOONBLAST, Type.FAIRY, MoveCategory.SPECIAL, 95, 100, 15, 30, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new AttackMove(Moves.BOOMBURST, Type.NORMAL, MoveCategory.SPECIAL, 140, 100, 10, -1, 0, 6)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new StatusMove(Moves.FAIRY_LOCK, Type.FAIRY, -1, 10, -1, 0, 6)
      .ignoresSubstitute()
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .attr(AddArenaTagAttr, ArenaTagType.FAIRY_LOCK, 2, true),
    new SelfStatusMove(Moves.KINGS_SHIELD, Type.STEEL, -1, 10, -1, 4, 6)
      .attr(ProtectAttr, BattlerTagType.KINGS_SHIELD)
      .condition(failIfLastCondition),
    new StatusMove(Moves.PLAY_NICE, Type.NORMAL, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .ignoresSubstitute(),
    new StatusMove(Moves.CONFIDE, Type.NORMAL, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .soundBased(),
    new AttackMove(Moves.DIAMOND_STORM, Type.ROCK, MoveCategory.PHYSICAL, 100, 95, 5, 50, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true, { firstTargetOnly: true })
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.STEAM_ERUPTION, Type.WATER, MoveCategory.SPECIAL, 110, 95, 5, 30, 0, 6)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(Moves.HYPERSPACE_HOLE, Type.PSYCHIC, MoveCategory.SPECIAL, 80, -1, 5, -1, 0, 6)
      .ignoresProtect()
      .ignoresSubstitute(),
    new AttackMove(Moves.WATER_SHURIKEN, Type.WATER, MoveCategory.SPECIAL, 15, 100, 20, -1, 1, 6)
      .attr(MultiHitAttr)
      .attr(WaterShurikenPowerAttr)
      .attr(WaterShurikenMultiHitTypeAttr),
    new AttackMove(Moves.MYSTICAL_FIRE, Type.FIRE, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new SelfStatusMove(Moves.SPIKY_SHIELD, Type.GRASS, -1, 10, -1, 4, 6)
      .attr(ProtectAttr, BattlerTagType.SPIKY_SHIELD)
      .condition(failIfLastCondition),
    new StatusMove(Moves.AROMATIC_MIST, Type.FAIRY, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPDEF], 1)
      .ignoresSubstitute()
      .condition(failIfSingleBattle)
      .target(MoveTarget.NEAR_ALLY),
    new StatusMove(Moves.EERIE_IMPULSE, Type.ELECTRIC, 100, 15, -1, 0, 6).attr(StatStageChangeAttr, [Stat.SPATK], -2),
    new StatusMove(Moves.VENOM_DRENCH, Type.POISON, 100, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK, Stat.SPD], -1, false, {
        condition: (_user, target, _move) =>
          target.status?.effect === StatusEffect.POISON || target.status?.effect === StatusEffect.TOXIC,
      })
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.POWDER, Type.BUG, 100, 20, -1, 1, 6)
      .attr(AddBattlerTagAttr, BattlerTagType.POWDER, false, { failOnOverlap: true })
      .ignoresSubstitute()
      .powderMove(),
    new ChargingSelfStatusMove(Moves.GEOMANCY, Type.FAIRY, -1, 10, -1, 0, 6)
      .chargeText(i18next.t("moveTriggers:isChargingPower", { pokemonName: "{USER}" }))
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF, Stat.SPD], 2, true)
      .ignoresVirtual(),
    new StatusMove(Moves.MAGNETIC_FLUX, Type.ELECTRIC, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], 1, false, {
        condition: (_user, target, _move) =>
          !![Abilities.PLUS, Abilities.MINUS].find((a) => target.hasAbility(a, false)),
      })
      .ignoresSubstitute()
      .target(MoveTarget.USER_AND_ALLIES)
      .condition(
        (user, _target, _move) =>
          !![user, user.getAlly()]
            .filter((p) => p?.isActive())
            .find((p) => !![Abilities.PLUS, Abilities.MINUS].find((a) => p.hasAbility(a, false))),
      ),
    new StatusMove(Moves.HAPPY_HOUR, Type.NORMAL, -1, 30, -1, 0, 6) // No animation
      .attr(AddArenaTagAttr, ArenaTagType.HAPPY_HOUR, null, true)
      .target(MoveTarget.USER_SIDE),
    new StatusMove(Moves.ELECTRIC_TERRAIN, Type.ELECTRIC, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.ELECTRIC)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.DAZZLING_GLEAM, Type.FAIRY, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 6).target(
      MoveTarget.ALL_NEAR_ENEMIES,
    ),
    new SelfStatusMove(Moves.CELEBRATE, Type.NORMAL, -1, 40, -1, 0, 6),
    new StatusMove(Moves.HOLD_HANDS, Type.NORMAL, -1, 40, -1, 0, 6).ignoresSubstitute().target(MoveTarget.NEAR_ALLY),
    new StatusMove(Moves.BABY_DOLL_EYES, Type.FAIRY, 100, 30, -1, 1, 6).attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(Moves.NUZZLE, Type.ELECTRIC, MoveCategory.PHYSICAL, 20, 100, 20, 100, 0, 6).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(Moves.HOLD_BACK, Type.NORMAL, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 6).attr(SurviveDamageAttr),
    new AttackMove(Moves.INFESTATION, Type.BUG, MoveCategory.SPECIAL, 20, 100, 20, -1, 0, 6)
      .makesContact()
      .attr(TrapAttr, BattlerTagType.INFESTATION),
    new AttackMove(Moves.POWER_UP_PUNCH, Type.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 20, 100, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .punchingMove(),
    new AttackMove(Moves.OBLIVION_WING, Type.FLYING, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 6)
      .attr(HitHealAttr, 0.75)
      .triageMove(),
    new AttackMove(Moves.THOUSAND_ARROWS, Type.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .attr(NeutralDamageAgainstFlyingTypeMultiplierAttr)
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, false, { lastHitOnly: true })
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.FLOATING)
      .attr(AddBattlerTagAttr, BattlerTagType.INTERRUPTED)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLYING, BattlerTagType.FLOATING, BattlerTagType.TELEKINESIS])
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.THOUSAND_WAVES, Type.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { lastHitOnly: true })
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.LANDS_WRATH, Type.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.LIGHT_OF_RUIN, Type.FAIRY, MoveCategory.SPECIAL, 140, 90, 5, -1, 0, 6)
      .attr(RecoilAttr, false, 0.5)
      .recklessMove(),
    new AttackMove(Moves.ORIGIN_PULSE, Type.WATER, MoveCategory.SPECIAL, 110, 85, 10, -1, 0, 6)
      .pulseMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.PRECIPICE_BLADES, Type.GROUND, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 6)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.DRAGON_ASCENT, Type.FLYING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      -1,
      true,
    ),
    new AttackMove(Moves.HYPERSPACE_FURY, Type.DARK, MoveCategory.PHYSICAL, 100, -1, 5, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true)
      .ignoresSubstitute()
      .makesContact(false)
      .ignoresProtect(),
    /* Unused */
    new AttackMove(Moves.BREAKNECK_BLITZ__PHYSICAL, Type.NORMAL, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.BREAKNECK_BLITZ__SPECIAL, Type.NORMAL, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.ALL_OUT_PUMMELING__PHYSICAL, Type.FIGHTING, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.ALL_OUT_PUMMELING__SPECIAL, Type.FIGHTING, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SUPERSONIC_SKYSTRIKE__PHYSICAL, Type.FLYING, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SUPERSONIC_SKYSTRIKE__SPECIAL, Type.FLYING, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.ACID_DOWNPOUR__PHYSICAL, Type.POISON, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.ACID_DOWNPOUR__SPECIAL, Type.POISON, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.TECTONIC_RAGE__PHYSICAL, Type.GROUND, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.TECTONIC_RAGE__SPECIAL, Type.GROUND, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.CONTINENTAL_CRUSH__PHYSICAL, Type.ROCK, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.CONTINENTAL_CRUSH__SPECIAL, Type.ROCK, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SAVAGE_SPIN_OUT__PHYSICAL, Type.BUG, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SAVAGE_SPIN_OUT__SPECIAL, Type.BUG, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.NEVER_ENDING_NIGHTMARE__PHYSICAL, Type.GHOST, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.NEVER_ENDING_NIGHTMARE__SPECIAL, Type.GHOST, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.CORKSCREW_CRASH__PHYSICAL, Type.STEEL, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.CORKSCREW_CRASH__SPECIAL, Type.STEEL, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.INFERNO_OVERDRIVE__PHYSICAL, Type.FIRE, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.INFERNO_OVERDRIVE__SPECIAL, Type.FIRE, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.HYDRO_VORTEX__PHYSICAL, Type.WATER, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.HYDRO_VORTEX__SPECIAL, Type.WATER, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.BLOOM_DOOM__PHYSICAL, Type.GRASS, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.BLOOM_DOOM__SPECIAL, Type.GRASS, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.GIGAVOLT_HAVOC__PHYSICAL, Type.ELECTRIC, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.GIGAVOLT_HAVOC__SPECIAL, Type.ELECTRIC, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SHATTERED_PSYCHE__PHYSICAL, Type.PSYCHIC, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SHATTERED_PSYCHE__SPECIAL, Type.PSYCHIC, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SUBZERO_SLAMMER__PHYSICAL, Type.ICE, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SUBZERO_SLAMMER__SPECIAL, Type.ICE, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.DEVASTATING_DRAKE__PHYSICAL, Type.DRAGON, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.DEVASTATING_DRAKE__SPECIAL, Type.DRAGON, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.BLACK_HOLE_ECLIPSE__PHYSICAL, Type.DARK, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.BLACK_HOLE_ECLIPSE__SPECIAL, Type.DARK, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.TWINKLE_TACKLE__PHYSICAL, Type.FAIRY, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.TWINKLE_TACKLE__SPECIAL, Type.FAIRY, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.CATASTROPIKA, Type.ELECTRIC, MoveCategory.PHYSICAL, 210, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    /* End Unused */
    new SelfStatusMove(Moves.SHORE_UP, Type.GROUND, -1, 5, -1, 0, 7).attr(SandHealAttr).triageMove(),
    new AttackMove(Moves.FIRST_IMPRESSION, Type.BUG, MoveCategory.PHYSICAL, 90, 100, 10, -1, 2, 7).condition(
      new FirstMoveCondition(),
    ),
    new SelfStatusMove(Moves.BANEFUL_BUNKER, Type.POISON, -1, 10, -1, 4, 7)
      .attr(ProtectAttr, BattlerTagType.BANEFUL_BUNKER)
      .condition(failIfLastCondition),
    new AttackMove(Moves.SPIRIT_SHACKLE, Type.GHOST, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { lastHitOnly: true })
      .makesContact(false),
    new AttackMove(Moves.DARKEST_LARIAT, Type.DARK, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 7).attr(
      IgnoreOpponentStatStagesAttr,
    ),
    new AttackMove(Moves.SPARKLING_ARIA, Type.WATER, MoveCategory.SPECIAL, 90, 100, 10, 100, 0, 7)
      .attr(HealStatusEffectAttr, false, StatusEffect.BURN)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.ICE_HAMMER, Type.ICE, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.SPD], -1, true)
      .punchingMove(),
    new StatusMove(Moves.FLORAL_HEALING, Type.FAIRY, -1, 10, -1, 0, 7)
      .attr(
        BoostHealAttr,
        0.5,
        2 / 3,
        true,
        false,
        (_user, _target, _move) => globalScene.arena.terrain?.terrainType === TerrainType.GRASSY,
      )
      .triageMove(),
    new AttackMove(Moves.HIGH_HORSEPOWER, Type.GROUND, MoveCategory.PHYSICAL, 95, 95, 10, -1, 0, 7),
    new StatusMove(Moves.STRENGTH_SAP, Type.GRASS, 100, 10, -1, 0, 7)
      .attr(HitHealAttr, null, Stat.ATK)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .condition((_user, target, _move) => target.getStatStage(Stat.ATK) > -6)
      .triageMove(),
    new ChargingAttackMove(Moves.SOLAR_BLADE, Type.GRASS, MoveCategory.PHYSICAL, 125, 100, 10, -1, 0, 7)
      .chargeText(i18next.t("moveTriggers:isGlowing", { pokemonName: "{USER}" }))
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.SUNNY, WeatherType.HARSH_SUN])
      .attr(AntiSunlightPowerDecreaseAttr)
      .slicingMove(),
    new AttackMove(Moves.LEAFAGE, Type.GRASS, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 7).makesContact(false),
    new StatusMove(Moves.SPOTLIGHT, Type.NORMAL, -1, 15, -1, 3, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.CENTER_OF_ATTENTION, false)
      .condition(failIfSingleBattle),
    new StatusMove(Moves.TOXIC_THREAD, Type.POISON, 100, 20, -1, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .attr(StatStageChangeAttr, [Stat.SPD], -1),
    new SelfStatusMove(Moves.LASER_FOCUS, Type.NORMAL, -1, 30, -1, 0, 7).attr(
      AddBattlerTagAttr,
      BattlerTagType.ALWAYS_CRIT,
      true,
    ),
    new StatusMove(Moves.GEAR_UP, Type.STEEL, -1, 20, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 1, false, {
        condition: (_user, target, _move) =>
          !![Abilities.PLUS, Abilities.MINUS].find((a) => target.hasAbility(a, false)),
      })
      .ignoresSubstitute()
      .target(MoveTarget.USER_AND_ALLIES)
      .condition(
        (user, _target, _move) =>
          !![user, user.getAlly()]
            .filter((p) => p?.isActive())
            .find((p) => !![Abilities.PLUS, Abilities.MINUS].find((a) => p.hasAbility(a, false))),
      ),
    new AttackMove(Moves.THROAT_CHOP, Type.DARK, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7).attr(
      AddBattlerTagAttr,
      BattlerTagType.THROAT_CHOPPED,
    ),
    new AttackMove(Moves.POLLEN_PUFF, Type.BUG, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 7)
      .attr(StatusCategoryOnAllyAttr)
      .attr(HealOnAllyAttr, 0.5, true, false)
      .ballBombMove(),
    new AttackMove(Moves.ANCHOR_SHOT, Type.STEEL, MoveCategory.PHYSICAL, 80, 100, 20, 100, 0, 7).attr(
      AddBattlerTagAttr,
      BattlerTagType.TRAPPED,
      false,
      { lastHitOnly: true },
    ),
    new StatusMove(Moves.PSYCHIC_TERRAIN, Type.PSYCHIC, -1, 10, -1, 0, 7)
      .attr(TerrainChangeAttr, TerrainType.PSYCHIC)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.LUNGE, Type.BUG, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(Moves.FIRE_LASH, Type.FIRE, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(Moves.POWER_TRIP, Type.DARK, MoveCategory.PHYSICAL, 20, 100, 10, -1, 0, 7).attr(
      PositiveStatStagePowerAttr,
    ),
    new AttackMove(Moves.BURN_UP, Type.FIRE, MoveCategory.SPECIAL, 130, 100, 5, -1, 0, 7)
      .condition((user) => {
        const userTypes = user.getTypes(true);
        return userTypes.includes(Type.FIRE);
      })
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(AddBattlerTagAttr, BattlerTagType.BURNED_UP, true)
      .attr(RemoveTypeAttr, Type.FIRE, (user) => {
        globalScene.queueMessage(
          i18next.t("moveTriggers:burnedItselfOut", { pokemonName: getPokemonNameWithAffix(user) }),
        );
      }),
    new StatusMove(Moves.SPEED_SWAP, Type.PSYCHIC, -1, 10, -1, 0, 7).attr(SwapStatAttr, Stat.SPD).ignoresSubstitute(),
    new AttackMove(Moves.SMART_STRIKE, Type.STEEL, MoveCategory.PHYSICAL, 70, -1, 10, -1, 0, 7),
    new StatusMove(Moves.PURIFY, Type.POISON, -1, 20, -1, 0, 7)
      .condition((_user, target, _move) => {
        if (!target.status) {
          return false;
        }
        return isNonVolatileStatusEffect(target.status.effect);
      })
      .attr(HealAttr, 0.5)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .triageMove(),
    new AttackMove(Moves.REVELATION_DANCE, Type.NORMAL, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 7)
      .danceMove()
      .attr(MatchUserTypeAttr),
    new AttackMove(Moves.CORE_ENFORCER, Type.DRAGON, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 7)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(SuppressAbilitiesIfActedAttr),
    new AttackMove(Moves.TROP_KICK, Type.GRASS, MoveCategory.PHYSICAL, 70, 100, 15, 100, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new StatusMove(Moves.INSTRUCT, Type.PSYCHIC, -1, 15, -1, 0, 7).ignoresSubstitute().attr(RepeatMoveAttr).edgeCase(), // incorrect interactions with Gigaton Hammer, Blood Moon & Torment
    new AttackMove(Moves.BEAK_BLAST, Type.FLYING, MoveCategory.PHYSICAL, 100, 100, 15, -1, -3, 7)
      .attr(BeakBlastHeaderAttr)
      .ballBombMove()
      .makesContact(false),
    new AttackMove(Moves.CLANGING_SCALES, Type.DRAGON, MoveCategory.SPECIAL, 110, 100, 5, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true, { firstTargetOnly: true })
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.DRAGON_HAMMER, Type.DRAGON, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 7),
    new AttackMove(Moves.BRUTAL_SWING, Type.DARK, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 7).target(
      MoveTarget.ALL_NEAR_OTHERS,
    ),
    new StatusMove(Moves.AURORA_VEIL, Type.ICE, -1, 20, -1, 0, 7)
      .condition(
        (_user, _target, _move) =>
          (globalScene.arena.weather?.weatherType === WeatherType.HAIL
            || globalScene.arena.weather?.weatherType === WeatherType.SNOW)
          && !globalScene.arena.weather?.isEffectSuppressed(),
      )
      .attr(AddArenaTagAttr, ArenaTagType.AURORA_VEIL, 5, true)
      .target(MoveTarget.USER_SIDE),
    /* Unused */
    new AttackMove(Moves.SINISTER_ARROW_RAID, Type.GHOST, MoveCategory.PHYSICAL, 180, -1, 1, -1, 0, 7)
      .makesContact(false)
      .edgeCase() // I assume it's because the user needs spirit shackle and decidueye
      .ignoresVirtual(),
    new AttackMove(Moves.MALICIOUS_MOONSAULT, Type.DARK, MoveCategory.PHYSICAL, 180, -1, 1, -1, 0, 7)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagAttr, BattlerTagType.MINIMIZED, true)
      .edgeCase() // I assume it's because it needs darkest lariat and incineroar
      .ignoresVirtual(),
    new AttackMove(Moves.OCEANIC_OPERETTA, Type.WATER, MoveCategory.SPECIAL, 195, -1, 1, -1, 0, 7)
      .edgeCase() // I assume it's because it needs sparkling aria and primarina
      .ignoresVirtual(),
    new AttackMove(Moves.GUARDIAN_OF_ALOLA, Type.FAIRY, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.SOUL_STEALING_7_STAR_STRIKE, Type.GHOST, MoveCategory.PHYSICAL, 195, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.STOKED_SPARKSURFER, Type.ELECTRIC, MoveCategory.SPECIAL, 175, -1, 1, 100, 0, 7)
      .edgeCase() // I assume it's because it needs thunderbolt and Alola Raichu
      .ignoresVirtual(),
    new AttackMove(Moves.PULVERIZING_PANCAKE, Type.NORMAL, MoveCategory.PHYSICAL, 210, -1, 1, -1, 0, 7)
      .edgeCase() // I assume it's because it needs giga impact and snorlax
      .ignoresVirtual(),
    new SelfStatusMove(Moves.EXTREME_EVOBOOST, Type.NORMAL, -1, 1, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 2, true)
      .ignoresVirtual(),
    new AttackMove(Moves.GENESIS_SUPERNOVA, Type.PSYCHIC, MoveCategory.SPECIAL, 185, -1, 1, 100, 0, 7)
      .attr(TerrainChangeAttr, TerrainType.PSYCHIC)
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(Moves.SHELL_TRAP, Type.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, -3, 7)
      .attr(AddBattlerTagHeaderAttr, BattlerTagType.SHELL_TRAP)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      // Fails if the user was not hit by a physical attack during the turn
      .condition((user, _target, _move) => user.getTag(ShellTrapTag)?.activated === true),
    new AttackMove(Moves.FLEUR_CANNON, Type.FAIRY, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new AttackMove(Moves.PSYCHIC_FANGS, Type.PSYCHIC, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 7)
      .bitingMove()
      .attr(RemoveScreensAttr),
    new AttackMove(Moves.STOMPING_TANTRUM, Type.GROUND, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 7).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) =>
        user.getLastXMoves(2)[1]?.result === MoveResult.MISS || user.getLastXMoves(2)[1]?.result === MoveResult.FAIL
          ? 2
          : 1,
    ),
    new AttackMove(Moves.SHADOW_BONE, Type.GHOST, MoveCategory.PHYSICAL, 85, 100, 10, 20, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .makesContact(false),
    new AttackMove(Moves.ACCELEROCK, Type.ROCK, MoveCategory.PHYSICAL, 40, 100, 20, -1, 1, 7),
    new AttackMove(Moves.LIQUIDATION, Type.WATER, MoveCategory.PHYSICAL, 85, 100, 10, 20, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(Moves.PRISMATIC_LASER, Type.PSYCHIC, MoveCategory.SPECIAL, 160, 100, 10, -1, 0, 7).attr(
      RechargeAttr,
    ),
    new AttackMove(Moves.SPECTRAL_THIEF, Type.GHOST, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 7)
      .attr(StealPositiveStatsAttr)
      .ignoresSubstitute(),
    new AttackMove(Moves.SUNSTEEL_STRIKE, Type.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 7).ignoresAbilities(),
    new AttackMove(Moves.MOONGEIST_BEAM, Type.GHOST, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 7).ignoresAbilities(),
    new StatusMove(Moves.TEARFUL_LOOK, Type.NORMAL, -1, 20, -1, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.SPATK],
      -1,
    ),
    new AttackMove(Moves.ZING_ZAP, Type.ELECTRIC, MoveCategory.PHYSICAL, 80, 100, 10, 30, 0, 7).attr(FlinchAttr),
    new AttackMove(Moves.NATURES_MADNESS, Type.FAIRY, MoveCategory.SPECIAL, -1, 90, 10, -1, 0, 7).attr(
      TargetHalfHpDamageAttr,
    ),
    new AttackMove(Moves.MULTI_ATTACK, Type.NORMAL, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 7).attr(
      FormChangeItemTypeAttr,
    ),
    /* Unused */
    new AttackMove(Moves.TEN_MILLION_VOLT_THUNDERBOLT, Type.ELECTRIC, MoveCategory.SPECIAL, 195, -1, 1, -1, 0, 7)
      .edgeCase() // I assume it's because it needs thunderbolt and pikachu in a cap
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(Moves.MIND_BLOWN, Type.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 7)
      .condition(failIfDampCondition)
      .attr(HalfSacrificialAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(Moves.PLASMA_FISTS, Type.ELECTRIC, MoveCategory.PHYSICAL, 100, 100, 15, -1, 0, 7)
      .attr(AddArenaTagAttr, ArenaTagType.ION_DELUGE, 1)
      .punchingMove(),
    new AttackMove(Moves.PHOTON_GEYSER, Type.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 7)
      .attr(PhotonGeyserCategoryAttr)
      .ignoresAbilities(),
    /* Unused */
    new AttackMove(Moves.LIGHT_THAT_BURNS_THE_SKY, Type.PSYCHIC, MoveCategory.SPECIAL, 200, -1, 1, -1, 0, 7)
      .attr(PhotonGeyserCategoryAttr)
      .ignoresAbilities()
      .ignoresVirtual(),
    new AttackMove(Moves.SEARING_SUNRAZE_SMASH, Type.STEEL, MoveCategory.PHYSICAL, 200, -1, 1, -1, 0, 7)
      .ignoresAbilities()
      .ignoresVirtual(),
    new AttackMove(Moves.MENACING_MOONRAZE_MAELSTROM, Type.GHOST, MoveCategory.SPECIAL, 200, -1, 1, -1, 0, 7)
      .ignoresAbilities()
      .ignoresVirtual(),
    new AttackMove(Moves.LETS_SNUGGLE_FOREVER, Type.FAIRY, MoveCategory.PHYSICAL, 190, -1, 1, -1, 0, 7)
      .edgeCase() // I assume it needs play rough and mimikyu
      .ignoresVirtual(),
    new AttackMove(Moves.SPLINTERED_STORMSHARDS, Type.ROCK, MoveCategory.PHYSICAL, 190, -1, 1, -1, 0, 7)
      .attr(ClearTerrainAttr)
      .makesContact(false)
      .ignoresVirtual(),
    new AttackMove(Moves.CLANGOROUS_SOULBLAZE, Type.DRAGON, MoveCategory.SPECIAL, 185, -1, 1, 100, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true, {
        firstTargetOnly: true,
      })
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .edgeCase() // I assume it needs clanging scales and Kommo-O
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(Moves.ZIPPY_ZAP, Type.ELECTRIC, MoveCategory.PHYSICAL, 50, 100, 15, -1, 2, 7) // LGPE Implementation
      .attr(CritOnlyAttr),
    new AttackMove(Moves.SPLISHY_SPLASH, Type.WATER, MoveCategory.SPECIAL, 90, 100, 15, 30, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.FLOATY_FALL, Type.FLYING, MoveCategory.PHYSICAL, 90, 95, 15, 30, 0, 7).attr(FlinchAttr),
    new AttackMove(Moves.PIKA_PAPOW, Type.ELECTRIC, MoveCategory.SPECIAL, -1, -1, 20, -1, 0, 7).attr(
      FriendshipPowerAttr,
    ),
    new AttackMove(Moves.BOUNCY_BUBBLE, Type.WATER, MoveCategory.SPECIAL, 60, 100, 20, -1, 0, 7)
      .attr(HitHealAttr) // Custom
      .triageMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.BUZZY_BUZZ, Type.ELECTRIC, MoveCategory.SPECIAL, 60, 100, 20, 100, 0, 7).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(Moves.SIZZLY_SLIDE, Type.FIRE, MoveCategory.PHYSICAL, 60, 100, 20, 100, 0, 7).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(Moves.GLITZY_GLOW, Type.PSYCHIC, MoveCategory.SPECIAL, 80, 95, 15, -1, 0, 7).attr(
      AddArenaTagAttr,
      ArenaTagType.LIGHT_SCREEN,
      5,
      false,
      true,
    ),
    new AttackMove(Moves.BADDY_BAD, Type.DARK, MoveCategory.SPECIAL, 80, 95, 15, -1, 0, 7).attr(
      AddArenaTagAttr,
      ArenaTagType.REFLECT,
      5,
      false,
      true,
    ),
    new AttackMove(Moves.SAPPY_SEED, Type.GRASS, MoveCategory.PHYSICAL, 100, 90, 10, 100, 0, 7)
      .attr(LeechSeedAttr)
      .makesContact(false),
    new AttackMove(Moves.FREEZY_FROST, Type.ICE, MoveCategory.SPECIAL, 100, 90, 10, -1, 0, 7).attr(
      ResetStatsAttr,
      true,
    ),
    new AttackMove(Moves.SPARKLY_SWIRL, Type.FAIRY, MoveCategory.SPECIAL, 120, 85, 5, -1, 0, 7).attr(
      PartyStatusCureAttr,
      null,
      Abilities.NONE,
    ),
    new AttackMove(Moves.VEEVEE_VOLLEY, Type.NORMAL, MoveCategory.PHYSICAL, -1, -1, 20, -1, 0, 7).attr(
      FriendshipPowerAttr,
    ),
    new AttackMove(Moves.DOUBLE_IRON_BASH, Type.STEEL, MoveCategory.PHYSICAL, 60, 100, 5, 30, 0, 7)
      .attr(MultiHitAttr, MultiHitType._2)
      .attr(FlinchAttr)
      .punchingMove(),
    /* Unused */
    new SelfStatusMove(Moves.MAX_GUARD, Type.NORMAL, -1, 10, -1, 4, 8)
      .attr(ProtectAttr)
      .condition(failIfLastCondition)
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(Moves.DYNAMAX_CANNON, Type.DRAGON, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 8)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => {
        // Move is only stronger against overleveled foes.
        if (target.level > globalScene.getMaxExpLevel()) {
          const dynamaxCannonPercentMarginBeforeFullDamage = 0.05; // How much % above MaxExpLevel of wave will the target need to be to take full damage.
          // The move's power scales as the margin is approached, reaching double power when it does or goes over it.
          return (
            1
            + Math.min(
              1,
              (target.level - globalScene.getMaxExpLevel())
                / (globalScene.getMaxExpLevel() * dynamaxCannonPercentMarginBeforeFullDamage),
            )
          );
        } else {
          return 1;
        }
      })
      .attr(DiscourageFrequentUseAttr)
      .ignoresVirtual(),

    new AttackMove(Moves.SNIPE_SHOT, Type.WATER, MoveCategory.SPECIAL, 80, 100, 15, -1, 0, 8)
      .attr(HighCritAttr)
      .attr(BypassRedirectAttr),
    new AttackMove(Moves.JAW_LOCK, Type.DARK, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 8)
      .attr(JawLockAttr)
      .bitingMove(),
    new SelfStatusMove(Moves.STUFF_CHEEKS, Type.NORMAL, -1, 10, -1, 0, 8)
      .attr(EatBerryAttr, true)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true)
      .condition((user) => {
        const userBerries = globalScene.findModifiers((m) => m instanceof BerryModifier, user.isPlayer());
        return userBerries.length > 0;
      })
      .edgeCase(), // Stuff Cheeks should not be selectable when the user does not have a berry, see wiki
    new SelfStatusMove(Moves.NO_RETREAT, Type.FIGHTING, -1, 5, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .attr(AddBattlerTagAttr, BattlerTagType.NO_RETREAT, true)
      .condition((user, _target, _move) => user.getTag(TrappedTag)?.sourceMove !== Moves.NO_RETREAT), // fails if the user is currently trapped by No Retreat
    new StatusMove(Moves.TAR_SHOT, Type.ROCK, 100, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .attr(AddBattlerTagAttr, BattlerTagType.TAR_SHOT, false),
    new StatusMove(Moves.MAGIC_POWDER, Type.PSYCHIC, 100, 20, -1, 0, 8).attr(ChangeTypeAttr, Type.PSYCHIC).powderMove(),
    new AttackMove(Moves.DRAGON_DARTS, Type.DRAGON, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._2)
      .makesContact(false)
      .target(MoveTarget.DRAGON_DARTS)
      .edgeCase(), // see `dragon_darts.test.ts` for documented edge cases
    new StatusMove(Moves.TEATIME, Type.NORMAL, -1, 10, -1, 0, 8).attr(EatBerryAttr, false).target(MoveTarget.ALL),
    new StatusMove(Moves.OCTOLOCK, Type.FIGHTING, 100, 15, -1, 0, 8)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.OCTOLOCK, false, { failOnOverlap: true }),
    new AttackMove(Moves.BOLT_BEAK, Type.ELECTRIC, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 8).attr(
      FirstAttackDoublePowerAttr,
    ),
    new AttackMove(Moves.FISHIOUS_REND, Type.WATER, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 8)
      .attr(FirstAttackDoublePowerAttr)
      .bitingMove(),
    new StatusMove(Moves.COURT_CHANGE, Type.NORMAL, 100, 10, -1, 0, 8).attr(SwapArenaTagsAttr, [
      ArenaTagType.AURORA_VEIL,
      ArenaTagType.LIGHT_SCREEN,
      ArenaTagType.MIST,
      ArenaTagType.REFLECT,
      ArenaTagType.SPIKES,
      ArenaTagType.STEALTH_ROCK,
      ArenaTagType.STICKY_WEB,
      ArenaTagType.TAILWIND,
      ArenaTagType.TOXIC_SPIKES,
    ]),
    new AttackMove(Moves.MAX_FLARE, Type.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_FLUTTERBY, Type.BUG, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_LIGHTNING, Type.ELECTRIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_STRIKE, Type.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_KNUCKLE, Type.FIGHTING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_PHANTASM, Type.GHOST, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_HAILSTORM, Type.ICE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_OOZE, Type.POISON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_GEYSER, Type.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_AIRSTREAM, Type.FLYING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_STARFALL, Type.FAIRY, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_WYRMWIND, Type.DRAGON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_MINDSTORM, Type.PSYCHIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_ROCKFALL, Type.ROCK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_QUAKE, Type.GROUND, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_DARKNESS, Type.DARK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_OVERGROWTH, Type.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(Moves.MAX_STEELSPIKE, Type.STEEL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    /* End Unused */
    new SelfStatusMove(Moves.CLANGOROUS_SOUL, Type.DRAGON, 100, 5, -1, 0, 8)
      .attr(CutHpStatStageBoostAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, 3)
      .soundBased()
      .danceMove(),
    new AttackMove(Moves.BODY_PRESS, Type.FIGHTING, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 8).attr(DefAtkAttr),
    new StatusMove(Moves.DECORATE, Type.FAIRY, -1, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 2)
      .ignoresProtect(),
    new AttackMove(Moves.DRUM_BEATING, Type.GRASS, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .makesContact(false),
    new AttackMove(Moves.SNAP_TRAP, Type.GRASS, MoveCategory.PHYSICAL, 35, 100, 15, -1, 0, 8).attr(
      TrapAttr,
      BattlerTagType.SNAP_TRAP,
    ),
    new AttackMove(Moves.PYRO_BALL, Type.FIRE, MoveCategory.PHYSICAL, 120, 90, 5, 10, 0, 8)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .ballBombMove()
      .makesContact(false),
    new AttackMove(Moves.BEHEMOTH_BLADE, Type.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 8).slicingMove(),
    new AttackMove(Moves.BEHEMOTH_BASH, Type.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 8),
    new AttackMove(Moves.AURA_WHEEL, Type.ELECTRIC, MoveCategory.PHYSICAL, 110, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .makesContact(false)
      .attr(AuraWheelTypeAttr),
    new AttackMove(Moves.BREAKING_SWIPE, Type.DRAGON, MoveCategory.PHYSICAL, 60, 100, 15, 100, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(Moves.BRANCH_POKE, Type.GRASS, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 8),
    new AttackMove(Moves.OVERDRIVE, Type.ELECTRIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 8)
      .soundBased()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.APPLE_ACID, Type.GRASS, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new AttackMove(Moves.GRAV_APPLE, Type.GRASS, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .attr(MovePowerMultiplierAttr, (_user, _target, _move) =>
        globalScene.arena.getTag(ArenaTagType.GRAVITY) ? 1.5 : 1,
      )
      .makesContact(false),
    new AttackMove(Moves.SPIRIT_BREAK, Type.FAIRY, MoveCategory.PHYSICAL, 75, 100, 15, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new AttackMove(Moves.STRANGE_STEAM, Type.FAIRY, MoveCategory.SPECIAL, 90, 95, 10, 20, 0, 8).attr(ConfuseAttr),
    new StatusMove(Moves.LIFE_DEW, Type.WATER, -1, 10, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .target(MoveTarget.USER_AND_ALLIES)
      .ignoresProtect(),
    new SelfStatusMove(Moves.OBSTRUCT, Type.DARK, 100, 10, -1, 4, 8)
      .attr(ProtectAttr, BattlerTagType.OBSTRUCT)
      .condition(failIfLastCondition),
    new AttackMove(Moves.FALSE_SURRENDER, Type.DARK, MoveCategory.PHYSICAL, 80, -1, 10, -1, 0, 8),
    new AttackMove(Moves.METEOR_ASSAULT, Type.FIGHTING, MoveCategory.PHYSICAL, 150, 100, 5, -1, 0, 8)
      .attr(RechargeAttr)
      .makesContact(false),
    new AttackMove(Moves.ETERNABEAM, Type.DRAGON, MoveCategory.SPECIAL, 160, 90, 5, -1, 0, 8).attr(RechargeAttr),
    new AttackMove(Moves.STEEL_BEAM, Type.STEEL, MoveCategory.SPECIAL, 140, 95, 5, -1, 0, 8).attr(HalfSacrificialAttr),
    new AttackMove(Moves.EXPANDING_FORCE, Type.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 8)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.PSYCHIC && user.isGrounded() ? 1.5 : 1,
      )
      .attr(VariableTargetAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.PSYCHIC && user.isGrounded()
          ? MoveTarget.ALL_NEAR_ENEMIES
          : MoveTarget.NEAR_OTHER,
      ),
    new AttackMove(Moves.STEEL_ROLLER, Type.STEEL, MoveCategory.PHYSICAL, 130, 100, 5, -1, 0, 8)
      .attr(ClearTerrainAttr)
      .condition((_user, _target, _move) => !!globalScene.arena.terrain),
    new AttackMove(Moves.SCALE_SHOT, Type.DRAGON, MoveCategory.PHYSICAL, 25, 90, 20, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true, { lastHitOnly: true })
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true, { lastHitOnly: true })
      .attr(MultiHitAttr)
      .makesContact(false),
    new ChargingAttackMove(Moves.METEOR_BEAM, Type.ROCK, MoveCategory.SPECIAL, 120, 90, 10, -1, 0, 8)
      .chargeText(i18next.t("moveTriggers:isOverflowingWithSpacePower", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .ignoresVirtual(),
    new AttackMove(Moves.SHELL_SIDE_ARM, Type.POISON, MoveCategory.SPECIAL, 90, 100, 10, 20, 0, 8)
      .attr(ShellSideArmCategoryAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(Moves.MISTY_EXPLOSION, Type.FAIRY, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 8)
      .attr(SacrificialAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.MISTY && user.isGrounded() ? 1.5 : 1,
      )
      .condition(failIfDampCondition)
      .makesContact(false),
    new AttackMove(Moves.GRASSY_GLIDE, Type.GRASS, MoveCategory.PHYSICAL, 55, 100, 20, -1, 0, 8).attr(
      IncrementMovePriorityAttr,
      (user, _target, _move) => globalScene.arena.getTerrainType() === TerrainType.GRASSY && user.isGrounded(),
    ),
    new AttackMove(Moves.RISING_VOLTAGE, Type.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 20, -1, 0, 8).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.ELECTRIC && target.isGrounded() ? 2 : 1,
    ),
    new AttackMove(Moves.TERRAIN_PULSE, Type.NORMAL, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 8)
      .attr(TerrainPulseTypeAttr)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() !== TerrainType.NONE && user.isGrounded() ? 2 : 1,
      )
      .pulseMove(),
    new AttackMove(Moves.SKITTER_SMACK, Type.BUG, MoveCategory.PHYSICAL, 70, 90, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new AttackMove(Moves.BURNING_JEALOUSY, Type.FIRE, MoveCategory.SPECIAL, 70, 100, 5, 100, 0, 8)
      .attr(StatusIfBoostedAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.LASH_OUT, Type.DARK, MoveCategory.PHYSICAL, 75, 100, 5, -1, 0, 8).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) => (user.turnData.statStagesDecreased ? 2 : 1),
    ),
    new AttackMove(Moves.POLTERGEIST, Type.GHOST, MoveCategory.PHYSICAL, 110, 90, 5, -1, 0, 8)
      .attr(AttackedByItemAttr)
      .makesContact(false),
    new StatusMove(Moves.CORROSIVE_GAS, Type.POISON, 100, 40, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .unimplemented(),
    new StatusMove(Moves.COACHING, Type.FIGHTING, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF], 1)
      .target(MoveTarget.NEAR_ALLY)
      .condition(failIfSingleBattle),
    new AttackMove(Moves.FLIP_TURN, Type.WATER, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 8).attr(
      ForceSwitchOutAttr,
      true,
    ),
    new AttackMove(Moves.TRIPLE_AXEL, Type.ICE, MoveCategory.PHYSICAL, 20, 90, 10, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(MultiHitPowerIncrementAttr, 3)
      .checkAllHits(),
    new AttackMove(Moves.DUAL_WINGBEAT, Type.FLYING, MoveCategory.PHYSICAL, 40, 90, 10, -1, 0, 8).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(Moves.SCORCHING_SANDS, Type.GROUND, MoveCategory.SPECIAL, 70, 100, 10, 30, 0, 8)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(Moves.JUNGLE_HEALING, Type.GRASS, -1, 10, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .target(MoveTarget.USER_AND_ALLIES),
    new AttackMove(Moves.WICKED_BLOW, Type.DARK, MoveCategory.PHYSICAL, 75, 100, 5, -1, 0, 8)
      .attr(CritOnlyAttr)
      .punchingMove(),
    new AttackMove(Moves.SURGING_STRIKES, Type.WATER, MoveCategory.PHYSICAL, 25, 100, 5, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(CritOnlyAttr)
      .punchingMove(),
    new AttackMove(Moves.THUNDER_CAGE, Type.ELECTRIC, MoveCategory.SPECIAL, 80, 90, 15, -1, 0, 8).attr(
      TrapAttr,
      BattlerTagType.THUNDER_CAGE,
    ),
    new AttackMove(Moves.DRAGON_ENERGY, Type.DRAGON, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 8)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.FREEZING_GLARE, Type.PSYCHIC, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 8).attr(
      StatusEffectAttr,
      StatusEffect.FREEZE,
    ),
    new AttackMove(Moves.FIERY_WRATH, Type.DARK, MoveCategory.SPECIAL, 90, 100, 10, 20, 0, 8)
      .attr(FlinchAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.THUNDEROUS_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(Moves.GLACIAL_LANCE, Type.ICE, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .makesContact(false),
    new AttackMove(Moves.ASTRAL_BARRAGE, Type.GHOST, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 8).target(
      MoveTarget.ALL_NEAR_ENEMIES,
    ),
    new AttackMove(Moves.EERIE_SPELL, Type.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 5, 100, 0, 8)
      .attr(AttackReducePpMoveAttr, 3)
      .soundBased(),
    new AttackMove(Moves.DIRE_CLAW, Type.POISON, MoveCategory.PHYSICAL, 80, 100, 15, 50, 0, 8).attr(
      MultiStatusEffectAttr,
      [StatusEffect.POISON, StatusEffect.PARALYSIS, StatusEffect.SLEEP],
    ),
    new AttackMove(Moves.PSYSHIELD_BASH, Type.PSYCHIC, MoveCategory.PHYSICAL, 70, 90, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new SelfStatusMove(Moves.POWER_SHIFT, Type.NORMAL, -1, 10, -1, 0, 8)
      .target(MoveTarget.USER)
      .attr(ShiftStatAttr, Stat.ATK, Stat.DEF),
    new AttackMove(Moves.STONE_AXE, Type.ROCK, MoveCategory.PHYSICAL, 65, 90, 15, 100, 0, 8)
      .attr(AddArenaTrapTagHitAttr, ArenaTagType.STEALTH_ROCK)
      .slicingMove(),
    new AttackMove(Moves.SPRINGTIDE_STORM, Type.FAIRY, MoveCategory.SPECIAL, 100, 80, 5, 30, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.MYSTICAL_POWER, Type.PSYCHIC, MoveCategory.SPECIAL, 70, 90, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      1,
      true,
    ),
    new AttackMove(Moves.RAGING_FURY, Type.FIRE, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 8)
      .makesContact(false)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new AttackMove(Moves.WAVE_CRASH, Type.WATER, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 8)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(Moves.CHLOROBLAST, Type.GRASS, MoveCategory.SPECIAL, 150, 95, 5, -1, 0, 8).attr(
      RecoilAttr,
      true,
      0.5,
    ),
    new AttackMove(Moves.MOUNTAIN_GALE, Type.ICE, MoveCategory.PHYSICAL, 100, 85, 10, 30, 0, 8)
      .makesContact(false)
      .attr(FlinchAttr),
    new SelfStatusMove(Moves.VICTORY_DANCE, Type.FIGHTING, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPD], 1, true)
      .danceMove(),
    new AttackMove(Moves.HEADLONG_RUSH, Type.GROUND, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true)
      .punchingMove(),
    new AttackMove(Moves.BARB_BARRAGE, Type.POISON, MoveCategory.PHYSICAL, 60, 100, 10, 50, 0, 8)
      .makesContact(false)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.status && (target.status.effect === StatusEffect.POISON || target.status.effect === StatusEffect.TOXIC)
          ? 2
          : 1,
      )
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(Moves.ESPER_WING, Type.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 8)
      .attr(HighCritAttr)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true),
    new AttackMove(Moves.BITTER_MALICE, Type.GHOST, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new SelfStatusMove(Moves.SHELTER, Type.STEEL, -1, 10, 100, 0, 8).attr(StatStageChangeAttr, [Stat.DEF], 2, true),
    new AttackMove(Moves.TRIPLE_ARROWS, Type.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 10, 30, 0, 8)
      .makesContact(false)
      .attr(HighCritAttr)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, false, { effectChanceOverride: 50 })
      .attr(FlinchAttr),
    new AttackMove(Moves.INFERNAL_PARADE, Type.GHOST, MoveCategory.SPECIAL, 60, 100, 15, 30, 0, 8)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.status ? 2 : 1)),
    new AttackMove(Moves.CEASELESS_EDGE, Type.DARK, MoveCategory.PHYSICAL, 65, 90, 15, 100, 0, 8)
      .attr(AddArenaTrapTagHitAttr, ArenaTagType.SPIKES)
      .slicingMove(),
    new AttackMove(Moves.BLEAKWIND_STORM, Type.FLYING, MoveCategory.SPECIAL, 100, 80, 10, 30, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.WILDBOLT_STORM, Type.ELECTRIC, MoveCategory.SPECIAL, 100, 80, 10, 20, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.SANDSEAR_STORM, Type.GROUND, MoveCategory.SPECIAL, 100, 80, 10, 20, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.LUNAR_BLESSING, Type.PSYCHIC, -1, 5, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .target(MoveTarget.USER_AND_ALLIES)
      .triageMove(),
    new SelfStatusMove(Moves.TAKE_HEART, Type.PSYCHIC, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF], 1, true)
      .attr(HealStatusEffectAttr, true, [
        StatusEffect.PARALYSIS,
        StatusEffect.POISON,
        StatusEffect.TOXIC,
        StatusEffect.BURN,
        StatusEffect.SLEEP,
      ]),
    /* Unused
    new AttackMove(Moves.G_MAX_WILDFIRE, Type.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_BEFUDDLE, Type.BUG, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_VOLT_CRASH, Type.ELECTRIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_GOLD_RUSH, Type.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_CHI_STRIKE, Type.FIGHTING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_TERROR, Type.GHOST, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_RESONANCE, Type.ICE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_CUDDLE, Type.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_REPLENISH, Type.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_MALODOR, Type.POISON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_STONESURGE, Type.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_WIND_RAGE, Type.FLYING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_STUN_SHOCK, Type.ELECTRIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_FINALE, Type.FAIRY, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_DEPLETION, Type.DRAGON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_GRAVITAS, Type.PSYCHIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_VOLCALITH, Type.ROCK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_SANDBLAST, Type.GROUND, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_SNOOZE, Type.DARK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_TARTNESS, Type.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_SWEETNESS, Type.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_SMITE, Type.FAIRY, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_STEELSURGE, Type.STEEL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_MELTDOWN, Type.STEEL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_FOAM_BURST, Type.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_CENTIFERNO, Type.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_VINE_LASH, Type.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_CANNONADE, Type.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_DRUM_SOLO, Type.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_FIREBALL, Type.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_HYDROSNIPE, Type.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_ONE_BLOW, Type.DARK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    new AttackMove(Moves.G_MAX_RAPID_FLOW, Type.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .unimplemented(),
    End Unused */
    new AttackMove(Moves.TERA_BLAST, Type.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 9)
      .attr(TeraMoveCategoryAttr)
      .attr(TeraBlastTypeAttr)
      .attr(TeraBlastPowerAttr)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1, true, {
        condition: (user, _target, _move) => user.isTerastallized() && user.isOfType(Type.STELLAR),
      })
      .partial() /** Does not ignore abilities that affect stats, relevant in determining the move's category {@see TeraMoveCategoryAttr} */,
    new SelfStatusMove(Moves.SILK_TRAP, Type.BUG, -1, 10, -1, 4, 9)
      .attr(ProtectAttr, BattlerTagType.SILK_TRAP)
      .condition(failIfLastCondition),
    new AttackMove(Moves.AXE_KICK, Type.FIGHTING, MoveCategory.PHYSICAL, 120, 90, 10, 30, 0, 9)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .attr(ConfuseAttr)
      .recklessMove(),
    new AttackMove(Moves.LAST_RESPECTS, Type.GHOST, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 9)
      .partial() // Counter resets every wave instead of on arena reset
      .attr(
        MovePowerMultiplierAttr,
        (user, _target, _move) =>
          1
          + Math.min(
            user.isPlayer() ? globalScene.currentBattle.playerFaints : globalScene.currentBattle.enemyFaints,
            100,
          ),
      )
      .makesContact(false),
    new AttackMove(Moves.LUMINA_CRASH, Type.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -2,
    ),
    new AttackMove(Moves.ORDER_UP, Type.DRAGON, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 9)
      .attr(OrderUpStatBoostAttr)
      .makesContact(false),
    new AttackMove(Moves.JET_PUNCH, Type.WATER, MoveCategory.PHYSICAL, 60, 100, 15, -1, 1, 9).punchingMove(),
    new StatusMove(Moves.SPICY_EXTRACT, Type.GRASS, -1, 15, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.ATK], 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -2),
    new AttackMove(Moves.SPIN_OUT, Type.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -2,
      true,
    ),
    new AttackMove(Moves.POPULATION_BOMB, Type.NORMAL, MoveCategory.PHYSICAL, 20, 90, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._10)
      .slicingMove()
      .checkAllHits(),
    new AttackMove(Moves.ICE_SPINNER, Type.ICE, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 9).attr(ClearTerrainAttr),
    new AttackMove(Moves.GLAIVE_RUSH, Type.DRAGON, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.ALWAYS_GET_HIT, true, { lastHitOnly: true })
      .attr(AddBattlerTagAttr, BattlerTagType.RECEIVE_DOUBLE_DAMAGE, true, { lastHitOnly: true })
      .condition((_user, target, _move) => {
        return !(
          target.getTag(BattlerTagType.PROTECTED)?.tagType === "PROTECTED"
          || globalScene.arena.getTag(ArenaTagType.MAT_BLOCK)?.tagType === "MAT_BLOCK"
        );
      }),
    new StatusMove(Moves.REVIVAL_BLESSING, Type.NORMAL, -1, 1, -1, 0, 9)
      .triageMove()
      .attr(RevivalBlessingAttr)
      .target(MoveTarget.USER),
    new AttackMove(Moves.SALT_CURE, Type.ROCK, MoveCategory.PHYSICAL, 40, 100, 15, 100, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.SALT_CURED)
      .makesContact(false),
    new AttackMove(Moves.TRIPLE_DIVE, Type.WATER, MoveCategory.PHYSICAL, 30, 95, 10, -1, 0, 9).attr(
      MultiHitAttr,
      MultiHitType._3,
    ),
    new AttackMove(Moves.MORTAL_SPIN, Type.POISON, MoveCategory.PHYSICAL, 30, 100, 15, 100, 0, 9)
      .attr(
        LapseBattlerTagAttr,
        [
          BattlerTagType.BIND,
          BattlerTagType.WRAP,
          BattlerTagType.FIRE_SPIN,
          BattlerTagType.WHIRLPOOL,
          BattlerTagType.CLAMP,
          BattlerTagType.SAND_TOMB,
          BattlerTagType.MAGMA_STORM,
          BattlerTagType.SNAP_TRAP,
          BattlerTagType.THUNDER_CAGE,
          BattlerTagType.SEEDED,
          BattlerTagType.INFESTATION,
        ],
        true,
      )
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .attr(RemoveArenaTrapAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(Moves.DOODLE, Type.NORMAL, 100, 10, -1, 0, 9).attr(AbilityCopyAttr, true),
    new SelfStatusMove(Moves.FILLET_AWAY, Type.NORMAL, -1, 10, -1, 0, 9).attr(
      CutHpStatStageBoostAttr,
      [Stat.ATK, Stat.SPATK, Stat.SPD],
      2,
      2,
    ),
    new AttackMove(Moves.KOWTOW_CLEAVE, Type.DARK, MoveCategory.PHYSICAL, 85, -1, 10, -1, 0, 9).slicingMove(),
    new AttackMove(Moves.FLOWER_TRICK, Type.GRASS, MoveCategory.PHYSICAL, 70, -1, 10, 100, 0, 9)
      .attr(CritOnlyAttr)
      .makesContact(false),
    new AttackMove(Moves.TORCH_SONG, Type.FIRE, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .soundBased(),
    new AttackMove(Moves.AQUA_STEP, Type.WATER, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .danceMove(),
    new AttackMove(Moves.RAGING_BULL, Type.NORMAL, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 9)
      .attr(RagingBullTypeAttr)
      .attr(RemoveScreensAttr),
    new AttackMove(Moves.MAKE_IT_RAIN, Type.STEEL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9)
      .attr(MoneyAttr)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1, true, { firstTargetOnly: true })
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(Moves.PSYBLADE, Type.PSYCHIC, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 9)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.ELECTRIC && user.isGrounded() ? 1.5 : 1,
      )
      .slicingMove(),
    new AttackMove(Moves.HYDRO_STEAM, Type.WATER, MoveCategory.SPECIAL, 80, 100, 15, -1, 0, 9)
      .attr(IgnoreWeatherTypeDebuffAttr, WeatherType.SUNNY)
      .attr(MovePowerMultiplierAttr, (_user, _target, _move) => {
        const weather = globalScene.arena.weather;
        if (!weather) {
          return 1;
        }
        return [WeatherType.SUNNY, WeatherType.HARSH_SUN].includes(weather.weatherType) && !weather.isEffectSuppressed()
          ? 1.5
          : 1;
      }),
    new AttackMove(Moves.RUINATION, Type.DARK, MoveCategory.SPECIAL, -1, 90, 10, -1, 0, 9).attr(TargetHalfHpDamageAttr),
    new AttackMove(Moves.COLLISION_COURSE, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9).attr(
      MovePowerMultiplierAttr,
      (user, target, move) => (target.getAttackTypeEffectiveness(move.type, user) >= 2 ? 5461 / 4096 : 1),
    ),
    new AttackMove(Moves.ELECTRO_DRIFT, Type.ELECTRIC, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 9)
      .attr(MovePowerMultiplierAttr, (user, target, move) =>
        target.getAttackTypeEffectiveness(move.type, user) >= 2 ? 5461 / 4096 : 1,
      )
      .makesContact(),
    new SelfStatusMove(Moves.SHED_TAIL, Type.NORMAL, -1, 10, -1, 0, 9)
      .attr(AddSubstituteAttr, 0.5)
      .attr(ForceSwitchOutAttr, true, SwitchType.SHED_TAIL)
      .condition(failIfLastInPartyCondition),
    new SelfStatusMove(Moves.CHILLY_RECEPTION, Type.ICE, -1, 10, -1, 0, 9)
      .attr(PreMoveMessageAttr, (user, _move) =>
        i18next.t("moveTriggers:chillyReception", { pokemonName: getPokemonNameWithAffix(user) }),
      )
      .attr(ChillyReceptionAttr, true),
    new SelfStatusMove(Moves.TIDY_UP, Type.NORMAL, -1, 10, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPD], 1, true)
      .attr(RemoveArenaTrapAttr, true)
      .attr(RemoveAllSubstitutesAttr),
    new StatusMove(Moves.SNOWSCAPE, Type.ICE, -1, 10, -1, 0, 9)
      .attr(WeatherChangeAttr, WeatherType.SNOW)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(Moves.POUNCE, Type.BUG, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(Moves.TRAILBLAZE, Type.GRASS, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      1,
      true,
    ),
    new AttackMove(Moves.CHILLING_WATER, Type.WATER, MoveCategory.SPECIAL, 50, 100, 20, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(Moves.HYPER_DRILL, Type.NORMAL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9).ignoresProtect(),
    new AttackMove(Moves.TWIN_BEAM, Type.PSYCHIC, MoveCategory.SPECIAL, 40, 100, 10, -1, 0, 9).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(Moves.RAGE_FIST, Type.GHOST, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 9)
      .partial() // Counter resets every wave instead of on arena reset
      .attr(HitCountPowerAttr)
      .punchingMove(),
    new AttackMove(Moves.ARMOR_CANNON, Type.FIRE, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      -1,
      true,
    ),
    new AttackMove(Moves.BITTER_BLADE, Type.FIRE, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 9)
      .attr(HitHealAttr)
      .slicingMove()
      .triageMove(),
    new AttackMove(Moves.DOUBLE_SHOCK, Type.ELECTRIC, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 9)
      .condition((user) => {
        const userTypes = user.getTypes(true);
        return userTypes.includes(Type.ELECTRIC);
      })
      .attr(AddBattlerTagAttr, BattlerTagType.DOUBLE_SHOCKED, true)
      .attr(RemoveTypeAttr, Type.ELECTRIC, (user) => {
        globalScene.queueMessage(
          i18next.t("moveTriggers:usedUpAllElectricity", { pokemonName: getPokemonNameWithAffix(user) }),
        );
      }),
    new AttackMove(Moves.GIGATON_HAMMER, Type.STEEL, MoveCategory.PHYSICAL, 160, 100, 5, -1, 0, 9)
      .makesContact(false)
      .condition((user, _target, move) => {
        const turnMove = user.getLastXMoves(1);
        return !turnMove.length || turnMove[0].move !== move.id || turnMove[0].result !== MoveResult.SUCCESS;
      }), // TODO Add Instruct/Encore interaction
    new AttackMove(Moves.COMEUPPANCE, Type.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 9)
      .attr(
        CounterDamageAttr,
        (move: Move) => move.category === MoveCategory.PHYSICAL || move.category === MoveCategory.SPECIAL,
        1.5,
      )
      .redirectCounter()
      .target(MoveTarget.ATTACKER),
    new AttackMove(Moves.AQUA_CUTTER, Type.WATER, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 9)
      .attr(HighCritAttr)
      .slicingMove()
      .makesContact(false),
    new AttackMove(Moves.BLAZING_TORQUE, Type.FIRE, MoveCategory.PHYSICAL, 80, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .makesContact(false),
    new AttackMove(Moves.WICKED_TORQUE, Type.DARK, MoveCategory.PHYSICAL, 80, 100, 10, 10, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .makesContact(false),
    new AttackMove(Moves.NOXIOUS_TORQUE, Type.POISON, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(Moves.COMBAT_TORQUE, Type.FIGHTING, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .makesContact(false),
    new AttackMove(Moves.MAGICAL_TORQUE, Type.FAIRY, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(ConfuseAttr)
      .makesContact(false),
    new AttackMove(Moves.BLOOD_MOON, Type.NORMAL, MoveCategory.SPECIAL, 140, 100, 5, -1, 0, 9).condition(
      (user, _target, move) => {
        const turnMove = user.getLastXMoves(1);
        return !turnMove.length || turnMove[0].move !== move.id || turnMove[0].result !== MoveResult.SUCCESS;
      },
    ), // TODO Add Instruct/Encore interaction
    new AttackMove(Moves.MATCHA_GOTCHA, Type.GRASS, MoveCategory.SPECIAL, 80, 90, 15, 20, 0, 9)
      .attr(HitHealAttr)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .triageMove(),
    new AttackMove(Moves.SYRUP_BOMB, Type.GRASS, MoveCategory.SPECIAL, 60, 85, 10, -1, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.SYRUP_BOMB, false, { turnCountMin: 3 })
      .ballBombMove(),
    new AttackMove(Moves.IVY_CUDGEL, Type.GRASS, MoveCategory.PHYSICAL, 100, 100, 10, -1, 0, 9)
      .attr(IvyCudgelTypeAttr)
      .attr(HighCritAttr)
      .makesContact(false),
    new ChargingAttackMove(Moves.ELECTRO_SHOT, Type.ELECTRIC, MoveCategory.SPECIAL, 130, 100, 10, 100, 0, 9)
      .chargeText(i18next.t("moveTriggers:absorbedElectricity", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.RAIN, WeatherType.HEAVY_RAIN])
      .ignoresVirtual(),
    new AttackMove(Moves.TERA_STARSTORM, Type.NORMAL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9)
      .attr(TeraMoveCategoryAttr)
      .attr(TeraStarstormTypeAttr)
      .attr(VariableTargetAttr, (user, _target, _move) =>
        (user.hasFusionSpecies(Species.TERAPAGOS) || user.species.speciesId === Species.TERAPAGOS)
        && user.isTerastallized()
          ? MoveTarget.ALL_NEAR_ENEMIES
          : MoveTarget.NEAR_OTHER,
      )
      .partial() /** Does not ignore abilities that affect stats, relevant in determining the move's category {@see TeraMoveCategoryAttr} */,
    new AttackMove(Moves.FICKLE_BEAM, Type.DRAGON, MoveCategory.SPECIAL, 80, 100, 5, 30, 0, 9)
      .attr(PreMoveMessageAttr, doublePowerChanceMessageFunc)
      .attr(DoublePowerChanceAttr),
    new SelfStatusMove(Moves.BURNING_BULWARK, Type.FIRE, -1, 10, -1, 4, 9)
      .attr(ProtectAttr, BattlerTagType.BURNING_BULWARK)
      .condition(failIfLastCondition),
    new AttackMove(Moves.THUNDERCLAP, Type.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 5, -1, 1, 9).condition(
      (_user, target, _move) => {
        const turnCommand = globalScene.currentBattle.turnCommands[target.getBattlerIndex()];
        if (!turnCommand || !turnCommand.move) {
          return false;
        }
        return (
          turnCommand.command === Command.FIGHT
          && !target.turnData.acted
          && allMoves[turnCommand.move.move].category !== MoveCategory.STATUS
        );
      },
    ),
    new AttackMove(Moves.MIGHTY_CLEAVE, Type.ROCK, MoveCategory.PHYSICAL, 95, 100, 5, -1, 0, 9)
      .slicingMove()
      .ignoresProtect(),
    new AttackMove(Moves.TACHYON_CUTTER, Type.STEEL, MoveCategory.SPECIAL, 50, -1, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._2)
      .slicingMove(),
    new AttackMove(Moves.HARD_PRESS, Type.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 9).attr(
      OpponentHighHpPowerAttr,
      100,
    ),
    new StatusMove(Moves.DRAGON_CHEER, Type.DRAGON, -1, 15, -1, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.DRAGON_CHEER, false, { failOnOverlap: true })
      .target(MoveTarget.NEAR_ALLY),
    new AttackMove(Moves.ALLURING_VOICE, Type.FAIRY, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 9)
      .attr(AddBattlerTagIfBoostedAttr, BattlerTagType.CONFUSED)
      .soundBased(),
    new AttackMove(Moves.TEMPER_FLARE, Type.FIRE, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 9).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) =>
        user.getLastXMoves(2)[1]?.result === MoveResult.MISS || user.getLastXMoves(2)[1]?.result === MoveResult.FAIL
          ? 2
          : 1,
    ),
    new AttackMove(Moves.SUPERCELL_SLAM, Type.ELECTRIC, MoveCategory.PHYSICAL, 100, 95, 15, -1, 0, 9)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .recklessMove(),
    new AttackMove(Moves.PSYCHIC_NOISE, Type.PSYCHIC, MoveCategory.SPECIAL, 75, 100, 10, -1, 0, 9)
      .soundBased()
      .attr(AddBattlerTagAttr, BattlerTagType.HEAL_BLOCK, false, { turnCountMin: 2 }),
    new AttackMove(Moves.UPPER_HAND, Type.FIGHTING, MoveCategory.PHYSICAL, 65, 100, 15, 100, 3, 9)
      .attr(FlinchAttr)
      .condition(new UpperHandCondition()),
    new AttackMove(Moves.MALIGNANT_CHAIN, Type.POISON, MoveCategory.SPECIAL, 100, 100, 5, 50, 0, 9).attr(
      StatusEffectAttr,
      StatusEffect.TOXIC,
    ),
  );
  allMoves.map((m) => {
    if (m.getAttrs(StatStageChangeAttr).some((a) => a.selfTarget && a.stages < 0)) {
      selfStatLowerMoves.push(m.id);
    }
  });
}
