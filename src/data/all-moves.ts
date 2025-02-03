import { MoveResult } from "#enums/move-result";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattleCommand } from "#enums/battle-command";
import { Abilities } from "#enums/abilities";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { MoveTarget } from "#enums/move-target";
import { MoveId } from "#enums/move-id";
import { MultiHitType } from "#enums/multi-hit-type";
import { Species } from "#enums/species";
import { Stat, getStatKey, BATTLE_STATS } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { SwitchType } from "#enums/switch-type";
import { TerrainType } from "#enums/terrain-type";
import { ElementType } from "#enums/element-type";
import { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { isNullOrUndefined } from "#app/utils";
import { type Move, AttackMove } from "#app/data/move";
import { ChargeAnim } from "#enums/charge-anim";
import { EncoreTag, StockpilingTag, SemiInvulnerableTag, ShellTrapTag, TrappedTag } from "./battler-tags";
import { ChargingAttackMove, ChargingSelfStatusMove } from "./move";
import { AbilityChangeAttr } from "./move-attrs/ability-change-attr";
import { AbilityCopyAttr } from "./move-attrs/ability-copy-attr";
import { AbilityGiveAttr } from "./move-attrs/ability-give-attr";
import { AcupressureStatStageChangeAttr } from "./move-attrs/acupressure-stat-stage-change-attr";
import { AddArenaTagAttr } from "./move-attrs/add-arena-tag-attr";
import { AddArenaTrapTagAttr } from "./move-attrs/add-arena-trap-tag-attr";
import { AddBattlerTagAttr } from "./move-attrs/add-battler-tag-attr";
import { AddBattlerTagHeaderAttr } from "./move-attrs/add-battler-tag-header-attr";
import { AddBattlerTagIfBoostedAttr } from "./move-attrs/add-battler-tag-if-boosted-attr";
import { AddPledgeEffectAttr } from "./move-attrs/add-pledge-effect-attr";
import { AddSubstituteAttr } from "./move-attrs/add-substitute-attr";
import { AddTypeAttr } from "./move-attrs/add-type-attr";
import { AfterYouAttr } from "./move-attrs/after-you-attr";
import { AlwaysHitMinimizeAttr } from "./move-attrs/always-hit-minimize-attr";
import { AntiSunlightPowerDecreaseAttr } from "./move-attrs/anti-sunlight-power-decrease-attr";
import { AttackReducePpMoveAttr } from "./move-attrs/attack-reduce-pp-move-attr";
import { AttackedByItemAttr } from "./move-attrs/attacked-by-item-attr";
import { AuraWheelTypeAttr } from "./move-attrs/aura-wheel-type-attr";
import { AverageStatsAttr } from "./move-attrs/average-stats-attr";
import { AwaitCombinedPledgeAttr } from "./move-attrs/await-combined-pledge-attr";
import { BeakBlastHeaderAttr } from "./move-attrs/beak-blast-header-attr";
import { BeatUpAttr } from "./move-attrs/beat-up-attr";
import { BlizzardAccuracyAttr } from "./move-attrs/blizzard-accuracy-attr";
import { BoostHealAttr } from "./move-attrs/boost-heal-attr";
import { BypassBurnDamageReductionAttr } from "./move-attrs/bypass-burn-damage-reduction-attr";
import { BypassRedirectAttr } from "./move-attrs/bypass-redirect-attr";
import { BypassSleepAttr } from "./move-attrs/bypass-sleep-attr";
import { ChangeTypeAttr } from "./move-attrs/change-type-attr";
import { ChillyReceptionAttr } from "./move-attrs/chilly-reception-attr";
import { ClearTerrainAttr } from "./move-attrs/clear-terrain-attr";
import { ClearWeatherAttr } from "./move-attrs/clear-weather-attr";
import { CombinedPledgePowerAttr } from "./move-attrs/combined-pledge-power-attr";
import { CombinedPledgeStabBoostAttr } from "./move-attrs/combined-pledge-stab-boost-attr";
import { CombinedPledgeTypeAttr } from "./move-attrs/combined-pledge-type-attr";
import { CompareWeightPowerAttr } from "./move-attrs/compare-weight-power-attr";
import { ConfuseAttr } from "./move-attrs/confuse-attr";
import { ConsecutiveUseDoublePowerAttr } from "./move-attrs/consecutive-use-double-power-attr";
import { ConsecutiveUseMultiBasePowerAttr } from "./move-attrs/consecutive-use-multi-base-power-attr";
import { CopyBiomeTypeAttr } from "./move-attrs/copy-biome-type-attr";
import { CopyMoveAttr } from "./move-attrs/copy-move-attr";
import { CopyStatsAttr } from "./move-attrs/copy-stats-attr";
import { CopyTypeAttr } from "./move-attrs/copy-type-attr";
import { CounterDamageAttr } from "./move-attrs/counter-damage-attr";
import { CritOnlyAttr } from "./move-attrs/crit-only-attr";
import { CueNextRoundAttr } from "./move-attrs/cue-next-round-attr";
import { CurseAttr } from "./move-attrs/curse-attr";
import { CutHpStatStageBoostAttr } from "./move-attrs/cut-hp-stat-stage-boost-attr";
import { DefAtkAttr } from "./move-attrs/def-atk-attr";
import { DealsPhysicalDamageAttr } from "./move-attrs/deals-physical-damage-attr";
import { DelayedAttackAttr } from "./move-attrs/delayed-attack-attr";
import { DestinyBondAttr } from "./move-attrs/destiny-bond-attr";
import { DiscourageFrequentUseAttr } from "./move-attrs/discourage-frequent-use-attr";
import { doublePowerChanceMessageFunc, DoublePowerChanceAttr } from "./move-attrs/double-power-chance-attr";
import { EatBerryAttr } from "./move-attrs/eat-berry-attr";
import { ElectroBallPowerAttr } from "./move-attrs/electro-ball-power-attr";
import { ExposedMoveAttr } from "./move-attrs/exposed-move-attr";
import { FaintCountdownAttr } from "./move-attrs/faint-countdown-attr";
import { FirstAttackDoublePowerAttr } from "./move-attrs/first-attack-double-power-attr";
import { FirstMoveTypeAttr } from "./move-attrs/first-move-type-attr";
import { FixedDamageAttr } from "./move-attrs/fixed-damage-attr";
import { FlameBurstAttr } from "./move-attrs/flame-burst-attr";
import { FlinchAttr } from "./move-attrs/flinch-attr";
import { FlyingTypeMultiplierAttr } from "./move-attrs/flying-type-multiplier-attr";
import { ForceSwitchOutAttr } from "./move-attrs/force-switch-out-attr";
import { FormChangeItemTypeAttr } from "./move-attrs/form-change-item-type-attr";
import { FreezeDryAttr } from "./move-attrs/freeze-dry-attr";
import { FrenzyAttr } from "./move-attrs/frenzy-attr";
import { FriendshipPowerAttr } from "./move-attrs/friendship-power-attr";
import { GrowthStatStageChangeAttr } from "./move-attrs/growth-stat-stage-change-attr";
import { GulpMissileTagAttr } from "./move-attrs/gulp-missile-tag-attr";
import { GyroBallPowerAttr } from "./move-attrs/gyro-ball-power-attr";
import { HalfSacrificialAttr } from "./move-attrs/half-sacrificial-attr";
import { HealAttr } from "./move-attrs/heal-attr";
import { HealOnAllyAttr } from "./move-attrs/heal-on-ally-attr";
import { HealStatusEffectAttr } from "./move-attrs/heal-status-effect-attr";
import { HiddenPowerTypeAttr } from "./move-attrs/hidden-power-type-attr";
import { HighCritAttr } from "./move-attrs/high-crit-attr";
import { HitCountPowerAttr } from "./move-attrs/hit-count-power-attr";
import { HitHealAttr } from "./move-attrs/hit-heal-attr";
import { HitsSameTypeAttr } from "./move-attrs/hits-same-type-attr";
import { HitsTagAttr } from "./move-attrs/hits-tag-attr";
import { HitsTagForDoubleDamageAttr } from "./move-attrs/hits-tag-for-double-damage-attr";
import { HpPowerAttr } from "./move-attrs/hp-power-attr";
import { HpSplitAttr } from "./move-attrs/hp-split-attr";
import { IceNoEffectTypeAttr } from "./move-attrs/ice-no-effect-type-attr";
import { IgnoreAccuracyAttr } from "./move-attrs/ignore-accuracy-attr";
import { IgnoreOpponentStatStagesAttr } from "./move-attrs/ignore-opponent-stat-stages-attr";
import { IgnoreWeatherTypeDebuffAttr } from "./move-attrs/ignore-weather-type-debuff-attr";
import { IncrementMovePriorityAttr } from "./move-attrs/increment-move-priority-attr";
import { InvertStatsAttr } from "./move-attrs/invert-stats-attr";
import { IvyCudgelTypeAttr } from "./move-attrs/ivy-cudgel-type-attr";
import { JawLockAttr } from "./move-attrs/jaw-lock-attr";
import { LastMoveDoublePowerAttr } from "./move-attrs/last-move-double-power-attr";
import { LastResortAttr } from "./move-attrs/last-resort-attr";
import { LeechSeedAttr } from "./move-attrs/leech-seed-attr";
import { LessPPMorePowerAttr } from "./move-attrs/less-pp-more-power-attr";
import { LevelDamageAttr } from "./move-attrs/level-damage-attr";
import { LowHpPowerAttr } from "./move-attrs/low-hp-power-attr";
import { magnitudeMessageFunc, MagnitudePowerAttr } from "./move-attrs/magnitude-power-attr";
import { MatchHpAttr } from "./move-attrs/match-hp-attr";
import { MatchUserTypeAttr } from "./move-attrs/match-user-type-attr";
import { MessageHeaderAttr } from "./move-attrs/message-header-attr";
import { MissEffectAttr } from "./move-attrs/miss-effect-attr";
import { MoneyAttr } from "./move-attrs/money-attr";
import { MovePowerMultiplierAttr } from "./move-attrs/move-power-multiplier-attr";
import { MovesetCopyMoveAttr } from "./move-attrs/moveset-copy-move-attr";
import { MultiHitAttr } from "./move-attrs/multi-hit-attr";
import { MultiHitPowerIncrementAttr } from "./move-attrs/multi-hit-power-increment-attr";
import { MultiStatusEffectAttr } from "./move-attrs/multi-status-effect-attr";
import { NaturePowerAttr } from "./move-attrs/nature-power-attr";
import { NeutralDamageAgainstFlyingTypeMultiplierAttr } from "./move-attrs/neutral-damage-against-flying-type-multiplier-attr";
import { NoEffectAttr } from "./move-attrs/no-effect-attr";
import { OneHitKOAccuracyAttr } from "./move-attrs/one-hit-ko-accuracy-attr";
import { OneHitKOAttr } from "./move-attrs/one-hit-ko-attr";
import { OpponentHighHpPowerAttr } from "./move-attrs/opponent-high-hp-power-attr";
import { OrderUpStatBoostAttr } from "./move-attrs/order-up-stat-boost-attr";
import { PartyStatusCureAttr } from "./move-attrs/party-status-cure-attr";
import { PhotonGeyserCategoryAttr } from "./move-attrs/photon-geyser-category-attr";
import { PlantHealAttr } from "./move-attrs/plant-heal-attr";
import { PunishmentPowerAttr, PositiveStatStagePowerAttr } from "./move-attrs/positive-stat-stage-power-attr";
import { PostVictoryStatStageChangeAttr } from "./move-attrs/post-victory-stat-stage-change-attr";
import { PreMoveMessageAttr } from "./move-attrs/pre-move-message-attr";
import { PresentPowerAttr } from "./move-attrs/present-power-attr";
import { ProtectAttr } from "./move-attrs/protect-attr";
import { PsychoShiftEffectAttr } from "./move-attrs/psycho-shift-effect-attr";
import { RagingBullTypeAttr } from "./move-attrs/raging-bull-type-attr";
import { RandomLevelDamageAttr } from "./move-attrs/random-level-damage-attr";
import { RandomMoveAttr } from "./move-attrs/random-move-attr";
import { RandomMovesetMoveAttr } from "./move-attrs/random-moveset-move-attr";
import { RechargeAttr } from "./move-attrs/recharge-attr";
import { RecoilAttr } from "./move-attrs/recoil-attr";
import { ReducePpMoveAttr } from "./move-attrs/reduce-pp-move-attr";
import { RemoveAllSubstitutesAttr } from "./move-attrs/remove-all-substitutes-attr";
import { RemoveArenaTagsAttr } from "./move-attrs/remove-arena-tags-attr";
import { RemoveArenaTrapAttr } from "./move-attrs/remove-arena-trap-attr";
import { rapidSpinRemoveTags, RemoveBattlerTagAttr } from "./move-attrs/remove-battler-tag-attr";
import { RemoveHeldItemAttr } from "./move-attrs/remove-held-item-attr";
import { RemoveScreensAttr } from "./move-attrs/remove-screens-attr";
import { RemoveTypeAttr } from "./move-attrs/remove-type-attr";
import { RepeatMoveAttr } from "./move-attrs/repeat-move-attr";
import { ResetStatsAttr } from "./move-attrs/reset-stats-attr";
import { ResistLastMoveTypeAttr } from "./move-attrs/resist-last-move-type-attr";
import { RespectAttackTypeImmunityAttr } from "./move-attrs/respect-attack-type-immunity-attr";
import { RevivalBlessingAttr } from "./move-attrs/revival-blessing-attr";
import { RoundPowerAttr } from "./move-attrs/round-power-attr";
import { SacrificialAttr } from "./move-attrs/sacrificial-attr";
import { SacrificialFullRestoreAttr } from "./move-attrs/sacrificial-full-restore-attr";
import { SandHealAttr } from "./move-attrs/sand-heal-attr";
import { SecretPowerAttr } from "./move-attrs/secret-power-attr";
import { SemiInvulnerableAttr } from "./move-attrs/semi-invulnerable-attr";
import { SheerColdAccuracyAttr } from "./move-attrs/sheer-cold-accuracy-attr";
import { ShellSideArmCategoryAttr } from "./move-attrs/shell-side-arm-category-attr";
import { ShiftStatAttr } from "./move-attrs/shift-stat-attr";
import { SketchAttr } from "./move-attrs/sketch-attr";
import { SpitUpPowerAttr } from "./move-attrs/spit-up-power-attr";
import { StatStageChangeAttr } from "./move-attrs/stat-stage-change-attr";
import { StatusCategoryOnAllyAttr } from "./move-attrs/status-category-on-ally-attr";
import { StatusEffectAttr } from "./move-attrs/status-effect-attr";
import { StatusIfBoostedAttr } from "./move-attrs/status-if-boosted-attr";
import { StealEatBerryAttr } from "./move-attrs/steal-eat-berry-attr";
import { StealHeldItemChanceAttr } from "./move-attrs/steal-held-item-chance-attr";
import { StealPositiveStatsAttr } from "./move-attrs/steal-positive-stats-attr";
import { StormAccuracyAttr } from "./move-attrs/storm-accuracy-attr";
import { SuppressAbilitiesAttr } from "./move-attrs/suppress-abilities-attr";
import { SuppressAbilitiesIfActedAttr } from "./move-attrs/suppress-abilities-if-acted-attr";
import { SurviveDamageAttr } from "./move-attrs/survive-damage-attr";
import { SwallowHealAttr } from "./move-attrs/swallow-heal-attr";
import { courtChangeArenaTags, SwapArenaTagsAttr } from "./move-attrs/swap-arena-tags-attr";
import { SwapStatAttr } from "./move-attrs/swap-stat-attr";
import { SwapStatStagesAttr } from "./move-attrs/swap-stat-stages-attr";
import { SwitchAbilitiesAttr } from "./move-attrs/switch-abilities-attr";
import { TargetAtkUserAtkAttr } from "./move-attrs/target-atk-user-atk-attr";
import { TargetHalfHpDamageAttr } from "./move-attrs/target-half-hp-damage-attr";
import { TechnoBlastTypeAttr } from "./move-attrs/techno-blast-type-attr";
import { TeraBlastPowerAttr } from "./move-attrs/tera-blast-power-attr";
import { TeraBlastTypeAttr } from "./move-attrs/tera-blast-type-attr";
import { TeraMoveCategoryAttr } from "./move-attrs/tera-move-category-attr";
import { TeraStarstormTypeAttr } from "./move-attrs/tera-starstorm-type-attr";
import { TerrainChangeAttr } from "./move-attrs/terrain-change-attr";
import { TerrainPulseTypeAttr } from "./move-attrs/terrain-pulse-type-attr";
import { ThunderAccuracyAttr } from "./move-attrs/thunder-accuracy-attr";
import { ToxicAccuracyAttr } from "./move-attrs/toxic-accuracy-attr";
import { TransformAttr } from "./move-attrs/transform-attr";
import { TrapAttr } from "./move-attrs/trap-attr";
import { TurnDamagedDoublePowerAttr } from "./move-attrs/turn-damaged-double-power-attr";
import { TypelessAttr } from "./move-attrs/typeless-attr";
import { UserHpDamageAttr } from "./move-attrs/user-hp-damage-attr";
import { VariableTargetAttr } from "./move-attrs/variable-target-attr";
import { WaterShurikenMultiHitTypeAttr } from "./move-attrs/water-shuriken-multi-hit-type-attr";
import { WaterShurikenPowerAttr } from "./move-attrs/water-shuriken-power-attr";
import { WeatherBallTypeAttr } from "./move-attrs/weather-ball-type-attr";
import { WeatherChangeAttr } from "./move-attrs/weather-change-attr";
import { WeatherInstantChargeAttr } from "./move-attrs/weather-instant-charge-attr";
import { WeightPowerAttr } from "./move-attrs/weight-power-attr";
import {
  failOnGravityCondition,
  failIfDampCondition,
  targetSleptOrComatoseCondition,
  failIfGhostTypeCondition,
  userSleptOrComatoseCondition,
  failIfLastCondition,
  failOnBossCondition,
  failIfLastInPartyCondition,
  FirstMoveCondition,
  hasStockpileStacksCondition,
  failIfSingleBattle,
  unknownTypeCondition,
  UpperHandCondition,
  failOnMaxCondition,
} from "./move-conditions";
import { SelfStatusMove } from "./move";
import { isNonVolatileStatusEffect, getNonVolatileStatusEffects } from "./status-effect";
import { StatusMove } from "./move";
import { crashDamageFunc, frenzyMissFunc } from "./move-utils";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { NoDamageAgainstFlyingAttr } from "./move-attrs/no-damage-against-flying-attr";
import { SkyDropAttr } from "./move-attrs/sky-drop-attr";

// Initialized as being empty; it will be filled during `initMoves()`
export const allMoves: { [moveId in MoveId]: Move } = {} as any;

export function initMoves() {
  const rawAllMoves = [
    new SelfStatusMove(MoveId.NONE, ElementType.NORMAL, MoveCategory.STATUS, -1, -1, 0, 1),
    new AttackMove(MoveId.POUND, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.KARATE_CHOP, ElementType.FIGHTING, MoveCategory.PHYSICAL, 50, 100, 25, -1, 0, 1).attr(
      HighCritAttr,
    ),
    new AttackMove(MoveId.DOUBLE_SLAP, ElementType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 10, -1, 0, 1).attr(
      MultiHitAttr,
    ),
    new AttackMove(MoveId.COMET_PUNCH, ElementType.NORMAL, MoveCategory.PHYSICAL, 18, 85, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .punchingMove(),
    new AttackMove(MoveId.MEGA_PUNCH, ElementType.NORMAL, MoveCategory.PHYSICAL, 80, 85, 20, -1, 0, 1).punchingMove(),
    new AttackMove(MoveId.PAY_DAY, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 20, -1, 0, 1)
      .attr(MoneyAttr)
      .makesContact(false),
    new AttackMove(MoveId.FIRE_PUNCH, ElementType.FIRE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .punchingMove(),
    new AttackMove(MoveId.ICE_PUNCH, ElementType.ICE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .punchingMove(),
    new AttackMove(MoveId.THUNDER_PUNCH, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .punchingMove(),
    new AttackMove(MoveId.SCRATCH, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.VISE_GRIP, ElementType.NORMAL, MoveCategory.PHYSICAL, 55, 100, 30, -1, 0, 1),
    new AttackMove(MoveId.GUILLOTINE, ElementType.NORMAL, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new ChargingAttackMove(MoveId.RAZOR_WIND, ElementType.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:whippedUpAWhirlwind", { pokemonName: "{USER}" }))
      .attr(HighCritAttr)
      .windMove()
      .ignoresVirtual()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(MoveId.SWORDS_DANCE, ElementType.NORMAL, -1, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], 2, true)
      .danceMove(),
    new AttackMove(MoveId.CUT, ElementType.NORMAL, MoveCategory.PHYSICAL, 50, 95, 30, -1, 0, 1).slicingMove(),
    new AttackMove(MoveId.GUST, ElementType.FLYING, MoveCategory.SPECIAL, 40, 100, 35, -1, 0, 1)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .windMove(),
    new AttackMove(MoveId.WING_ATTACK, ElementType.FLYING, MoveCategory.PHYSICAL, 60, 100, 35, -1, 0, 1),
    new StatusMove(MoveId.WHIRLWIND, ElementType.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .ignoresSubstitute()
      .hidesTarget()
      .windMove(),
    new ChargingAttackMove(MoveId.FLY, ElementType.FLYING, MoveCategory.PHYSICAL, 90, 95, 15, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:flewUpHigh", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.FLYING)
      .condition(failOnGravityCondition)
      .ignoresVirtual(),
    new AttackMove(MoveId.BIND, ElementType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.BIND,
    ),
    new AttackMove(MoveId.SLAM, ElementType.NORMAL, MoveCategory.PHYSICAL, 80, 75, 20, -1, 0, 1),
    new AttackMove(MoveId.VINE_WHIP, ElementType.GRASS, MoveCategory.PHYSICAL, 45, 100, 25, -1, 0, 1),
    new AttackMove(MoveId.STOMP, ElementType.NORMAL, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 1)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new AttackMove(MoveId.DOUBLE_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 30, 100, 30, -1, 0, 1).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(MoveId.MEGA_KICK, ElementType.NORMAL, MoveCategory.PHYSICAL, 120, 75, 5, -1, 0, 1),
    new AttackMove(MoveId.JUMP_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 100, 95, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new AttackMove(MoveId.ROLLING_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 60, 85, 15, 30, 0, 1).attr(
      FlinchAttr,
    ),
    new StatusMove(MoveId.SAND_ATTACK, ElementType.GROUND, 100, 15, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(MoveId.HEADBUTT, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 15, 30, 0, 1).attr(FlinchAttr),
    new AttackMove(MoveId.HORN_ATTACK, ElementType.NORMAL, MoveCategory.PHYSICAL, 65, 100, 25, -1, 0, 1),
    new AttackMove(MoveId.FURY_ATTACK, ElementType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1).attr(
      MultiHitAttr,
    ),
    new AttackMove(MoveId.HORN_DRILL, ElementType.NORMAL, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new AttackMove(MoveId.TACKLE, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.BODY_SLAM, ElementType.NORMAL, MoveCategory.PHYSICAL, 85, 100, 15, 30, 0, 1)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.WRAP, ElementType.NORMAL, MoveCategory.PHYSICAL, 15, 90, 20, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.WRAP,
    ),
    new AttackMove(MoveId.TAKE_DOWN, ElementType.NORMAL, MoveCategory.PHYSICAL, 90, 85, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.THRASH, ElementType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 1)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new AttackMove(MoveId.DOUBLE_EDGE, ElementType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 1)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new StatusMove(MoveId.TAIL_WHIP, ElementType.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.POISON_STING, ElementType.POISON, MoveCategory.PHYSICAL, 15, 100, 35, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.TWINEEDLE, ElementType.BUG, MoveCategory.PHYSICAL, 25, 100, 20, 20, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.PIN_MISSILE, ElementType.BUG, MoveCategory.PHYSICAL, 25, 95, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new StatusMove(MoveId.LEER, ElementType.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BITE, ElementType.DARK, MoveCategory.PHYSICAL, 60, 100, 25, 30, 0, 1)
      .attr(FlinchAttr)
      .bitingMove(),
    new StatusMove(MoveId.GROWL, ElementType.NORMAL, 100, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.ROAR, ElementType.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .soundMove()
      .hidesTarget(),
    new StatusMove(MoveId.SING, ElementType.NORMAL, 55, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundMove(),
    new StatusMove(MoveId.SUPERSONIC, ElementType.NORMAL, 55, 20, -1, 0, 1).attr(ConfuseAttr).soundMove(),
    new AttackMove(MoveId.SONIC_BOOM, ElementType.NORMAL, MoveCategory.SPECIAL, -1, 90, 20, -1, 0, 1).attr(
      FixedDamageAttr,
      20,
    ),
    new StatusMove(MoveId.DISABLE, ElementType.NORMAL, 100, 20, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.DISABLED, false, { failOnOverlap: true })
      .condition(failOnMaxCondition)
      .condition(
        (_user, target, _move) =>
          target
            .getMoveHistory()
            .reverse()
            .find((m) => m.moveId !== MoveId.NONE && m.moveId !== MoveId.STRUGGLE && !m.virtual) !== undefined,
      )
      .ignoresSubstitute(),
    new AttackMove(MoveId.ACID, ElementType.POISON, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.EMBER, ElementType.FIRE, MoveCategory.SPECIAL, 40, 100, 25, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(MoveId.FLAMETHROWER, ElementType.FIRE, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new StatusMove(MoveId.MIST, ElementType.ICE, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.MIST, { turnCount: 5, failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    new AttackMove(MoveId.WATER_GUN, ElementType.WATER, MoveCategory.SPECIAL, 40, 100, 25, -1, 0, 1),
    new AttackMove(MoveId.HYDRO_PUMP, ElementType.WATER, MoveCategory.SPECIAL, 110, 80, 5, -1, 0, 1),
    new AttackMove(MoveId.SURF, ElementType.WATER, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 1)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERWATER)
      .attr(GulpMissileTagAttr),
    new AttackMove(MoveId.ICE_BEAM, ElementType.ICE, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.FREEZE,
    ),
    new AttackMove(MoveId.BLIZZARD, ElementType.ICE, MoveCategory.SPECIAL, 110, 70, 5, 10, 0, 1)
      .attr(BlizzardAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.PSYBEAM, ElementType.PSYCHIC, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1).attr(ConfuseAttr),
    new AttackMove(MoveId.BUBBLE_BEAM, ElementType.WATER, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(MoveId.AURORA_BEAM, ElementType.ICE, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(MoveId.HYPER_BEAM, ElementType.NORMAL, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 1).attr(
      RechargeAttr,
    ),
    new AttackMove(MoveId.PECK, ElementType.FLYING, MoveCategory.PHYSICAL, 35, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.DRILL_PECK, ElementType.FLYING, MoveCategory.PHYSICAL, 80, 100, 20, -1, 0, 1),
    new AttackMove(MoveId.SUBMISSION, ElementType.FIGHTING, MoveCategory.PHYSICAL, 80, 80, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.LOW_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1)
      .condition(failOnMaxCondition)
      .attr(WeightPowerAttr),
    new AttackMove(MoveId.COUNTER, ElementType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, -5, 1)
      .attr(CounterDamageAttr, (move: Move) => move.category === MoveCategory.PHYSICAL, 2)
      .target(MoveTarget.ATTACKER),
    new AttackMove(MoveId.SEISMIC_TOSS, ElementType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1).attr(
      LevelDamageAttr,
    ),
    new AttackMove(MoveId.STRENGTH, ElementType.NORMAL, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 1),
    new AttackMove(MoveId.ABSORB, ElementType.GRASS, MoveCategory.SPECIAL, 20, 100, 25, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new AttackMove(MoveId.MEGA_DRAIN, ElementType.GRASS, MoveCategory.SPECIAL, 40, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(MoveId.LEECH_SEED, ElementType.GRASS, 90, 10, -1, 0, 1)
      .attr(LeechSeedAttr)
      .condition(
        (_user, target, _move) => !target.getTag(BattlerTagType.SEEDED) && !target.isOfType(ElementType.GRASS),
      ),
    new SelfStatusMove(MoveId.GROWTH, ElementType.NORMAL, -1, 20, -1, 0, 1).attr(GrowthStatStageChangeAttr),
    new AttackMove(MoveId.RAZOR_LEAF, ElementType.GRASS, MoveCategory.PHYSICAL, 55, 95, 25, -1, 0, 1)
      .attr(HighCritAttr)
      .makesContact(false)
      .slicingMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new ChargingAttackMove(MoveId.SOLAR_BEAM, ElementType.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:tookInSunlight", { pokemonName: "{USER}" }))
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.SUNNY, WeatherType.HARSH_SUN])
      .attr(AntiSunlightPowerDecreaseAttr)
      .ignoresVirtual(),
    new StatusMove(MoveId.POISON_POWDER, ElementType.POISON, 75, 35, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .powderMove(),
    new StatusMove(MoveId.STUN_SPORE, ElementType.GRASS, 75, 30, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .powderMove(),
    new StatusMove(MoveId.SLEEP_POWDER, ElementType.GRASS, 75, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .powderMove(),
    new AttackMove(MoveId.PETAL_DANCE, ElementType.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .makesContact()
      .danceMove()
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(MoveId.STRING_SHOT, ElementType.BUG, 95, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -2)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DRAGON_RAGE, ElementType.DRAGON, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 1).attr(
      FixedDamageAttr,
      40,
    ),
    new AttackMove(MoveId.FIRE_SPIN, ElementType.FIRE, MoveCategory.SPECIAL, 35, 85, 15, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.FIRE_SPIN,
    ),
    new AttackMove(MoveId.THUNDER_SHOCK, ElementType.ELECTRIC, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(MoveId.THUNDERBOLT, ElementType.ELECTRIC, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new StatusMove(MoveId.THUNDER_WAVE, ElementType.ELECTRIC, 90, 20, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(RespectAttackTypeImmunityAttr),
    new AttackMove(MoveId.THUNDER, ElementType.ELECTRIC, MoveCategory.SPECIAL, 110, 70, 10, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(ThunderAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP),
    new AttackMove(MoveId.ROCK_THROW, ElementType.ROCK, MoveCategory.PHYSICAL, 50, 90, 15, -1, 0, 1).makesContact(
      false,
    ),
    new AttackMove(MoveId.EARTHQUAKE, ElementType.GROUND, MoveCategory.PHYSICAL, 100, 100, 10, -1, 0, 1)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERGROUND)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.GRASSY && target.isGrounded() ? 0.5 : 1,
      )
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FISSURE, ElementType.GROUND, MoveCategory.PHYSICAL, 200, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.UNDERGROUND)
      .makesContact(false),
    new ChargingAttackMove(MoveId.DIG, ElementType.GROUND, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:dugAHole", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.UNDERGROUND)
      .ignoresVirtual(),
    new StatusMove(MoveId.TOXIC, ElementType.POISON, 90, 10, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.TOXIC)
      .attr(ToxicAccuracyAttr),
    new AttackMove(MoveId.CONFUSION, ElementType.PSYCHIC, MoveCategory.SPECIAL, 50, 100, 25, 10, 0, 1).attr(
      ConfuseAttr,
    ),
    new AttackMove(MoveId.PSYCHIC, ElementType.PSYCHIC, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new StatusMove(MoveId.HYPNOSIS, ElementType.PSYCHIC, 60, 20, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.SLEEP),
    new SelfStatusMove(MoveId.MEDITATE, ElementType.PSYCHIC, -1, 40, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.AGILITY, ElementType.PSYCHIC, -1, 30, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      2,
      true,
    ),
    new AttackMove(MoveId.QUICK_ATTACK, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 1),
    new AttackMove(MoveId.RAGE, ElementType.NORMAL, MoveCategory.PHYSICAL, 20, 100, 20, -1, 0, 1).partial(), // No effect implemented
    new SelfStatusMove(MoveId.TELEPORT, ElementType.PSYCHIC, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, true)
      .hidesUser(),
    new AttackMove(MoveId.NIGHT_SHADE, ElementType.GHOST, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1).attr(
      LevelDamageAttr,
    ),
    new StatusMove(MoveId.MIMIC, ElementType.NORMAL, -1, 10, -1, 0, 1)
      .attr(MovesetCopyMoveAttr)
      .ignoresSubstitute()
      .ignoresVirtual(),
    new StatusMove(MoveId.SCREECH, ElementType.NORMAL, 85, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -2)
      .soundMove(),
    new SelfStatusMove(MoveId.DOUBLE_TEAM, ElementType.NORMAL, -1, 15, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.EVA],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.RECOVER, ElementType.NORMAL, -1, 5, -1, 0, 1).attr(HealAttr, 0.5).triageMove(),
    new SelfStatusMove(MoveId.HARDEN, ElementType.NORMAL, -1, 30, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.MINIMIZE, ElementType.NORMAL, -1, 10, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.MINIMIZED, true)
      .attr(StatStageChangeAttr, [Stat.EVA], 2, true),
    new StatusMove(MoveId.SMOKESCREEN, ElementType.NORMAL, 100, 20, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new StatusMove(MoveId.CONFUSE_RAY, ElementType.GHOST, 100, 10, -1, 0, 1).attr(ConfuseAttr),
    new SelfStatusMove(MoveId.WITHDRAW, ElementType.WATER, -1, 40, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.DEFENSE_CURL, ElementType.NORMAL, -1, 40, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.BARRIER, ElementType.PSYCHIC, -1, 20, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      2,
      true,
    ),
    new StatusMove(MoveId.LIGHT_SCREEN, ElementType.PSYCHIC, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.LIGHT_SCREEN, { turnCount: 5, failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(MoveId.HAZE, ElementType.ICE, -1, 30, -1, 0, 1).ignoresSubstitute().attr(ResetStatsAttr, true),
    new StatusMove(MoveId.REFLECT, ElementType.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.REFLECT, { turnCount: 5, failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(MoveId.FOCUS_ENERGY, ElementType.NORMAL, -1, 30, -1, 0, 1).attr(
      AddBattlerTagAttr,
      BattlerTagType.CRIT_BOOST,
      true,
      { failOnOverlap: true },
    ),
    new AttackMove(MoveId.BIDE, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, -1, 10, -1, 1, 1)
      .ignoresVirtual()
      .target(MoveTarget.USER)
      .unimplemented(),
    new SelfStatusMove(MoveId.METRONOME, ElementType.NORMAL, -1, 10, -1, 0, 1).attr(RandomMoveAttr).ignoresVirtual(),
    new StatusMove(MoveId.MIRROR_MOVE, ElementType.FLYING, -1, 20, -1, 0, 1).attr(CopyMoveAttr).ignoresVirtual(),
    new AttackMove(MoveId.SELF_DESTRUCT, ElementType.NORMAL, MoveCategory.PHYSICAL, 200, 100, 5, -1, 0, 1)
      .attr(SacrificialAttr)
      .makesContact(false)
      .condition(failIfDampCondition)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.EGG_BOMB, ElementType.NORMAL, MoveCategory.PHYSICAL, 100, 75, 10, -1, 0, 1)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.LICK, ElementType.GHOST, MoveCategory.PHYSICAL, 30, 100, 30, 30, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(MoveId.SMOG, ElementType.POISON, MoveCategory.SPECIAL, 30, 70, 20, 40, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.POISON,
    ),
    new AttackMove(MoveId.SLUDGE, ElementType.POISON, MoveCategory.SPECIAL, 65, 100, 20, 30, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.POISON,
    ),
    new AttackMove(MoveId.BONE_CLUB, ElementType.GROUND, MoveCategory.PHYSICAL, 65, 85, 20, 10, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false),
    new AttackMove(MoveId.FIRE_BLAST, ElementType.FIRE, MoveCategory.SPECIAL, 110, 85, 5, 10, 0, 1).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(MoveId.WATERFALL, ElementType.WATER, MoveCategory.PHYSICAL, 80, 100, 15, 20, 0, 1).attr(FlinchAttr),
    new AttackMove(MoveId.CLAMP, ElementType.WATER, MoveCategory.PHYSICAL, 35, 85, 15, -1, 0, 1).attr(
      TrapAttr,
      BattlerTagType.CLAMP,
    ),
    new AttackMove(MoveId.SWIFT, ElementType.NORMAL, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 1).target(
      MoveTarget.ALL_NEAR_ENEMIES,
    ),
    new ChargingAttackMove(MoveId.SKULL_BASH, ElementType.NORMAL, MoveCategory.PHYSICAL, 130, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:loweredItsHead", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.DEF], 1, true)
      .ignoresVirtual(),
    new AttackMove(MoveId.SPIKE_CANNON, ElementType.NORMAL, MoveCategory.PHYSICAL, 20, 100, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new AttackMove(MoveId.CONSTRICT, ElementType.NORMAL, MoveCategory.PHYSICAL, 10, 100, 35, 10, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new SelfStatusMove(MoveId.AMNESIA, ElementType.PSYCHIC, -1, 20, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      2,
      true,
    ),
    new StatusMove(MoveId.KINESIS, ElementType.PSYCHIC, 80, 15, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new SelfStatusMove(MoveId.SOFT_BOILED, ElementType.NORMAL, -1, 5, -1, 0, 1).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(MoveId.HIGH_JUMP_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 130, 90, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new StatusMove(MoveId.GLARE, ElementType.NORMAL, 100, 30, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.DREAM_EATER, ElementType.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .condition(targetSleptOrComatoseCondition)
      .triageMove(),
    new StatusMove(MoveId.POISON_GAS, ElementType.POISON, 90, 40, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BARRAGE, ElementType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.LEECH_LIFE, ElementType.BUG, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(MoveId.LOVELY_KISS, ElementType.NORMAL, 75, 10, -1, 0, 1).attr(StatusEffectAttr, StatusEffect.SLEEP),
    new ChargingAttackMove(MoveId.SKY_ATTACK, ElementType.FLYING, MoveCategory.PHYSICAL, 140, 90, 5, 30, 0, 1)
      .chargeText(i18next.t("moveTriggers:isGlowing", { pokemonName: "{USER}" }))
      .attr(HighCritAttr)
      .attr(FlinchAttr)
      .makesContact(false)
      .ignoresVirtual(),
    new StatusMove(MoveId.TRANSFORM, ElementType.NORMAL, -1, 10, -1, 0, 1)
      .attr(TransformAttr)
      // transforming from or into fusion pokemon causes various problems (such as crashes)
      .condition(
        (user, target, _move) =>
          !target.getTag(BattlerTagType.SUBSTITUTE) && !user.fusionSpecies && !target.fusionSpecies,
      )
      .ignoresProtect(),
    new AttackMove(MoveId.BUBBLE, ElementType.WATER, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DIZZY_PUNCH, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 10, 20, 0, 1)
      .attr(ConfuseAttr)
      .punchingMove(),
    new StatusMove(MoveId.SPORE, ElementType.GRASS, 100, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .powderMove(),
    new StatusMove(MoveId.FLASH, ElementType.NORMAL, 100, 20, -1, 0, 1).attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(MoveId.PSYWAVE, ElementType.PSYCHIC, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1).attr(
      RandomLevelDamageAttr,
    ),
    new SelfStatusMove(MoveId.SPLASH, ElementType.NORMAL, -1, 40, -1, 0, 1).condition(failOnGravityCondition),
    new SelfStatusMove(MoveId.ACID_ARMOR, ElementType.POISON, -1, 20, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      2,
      true,
    ),
    new AttackMove(MoveId.CRABHAMMER, ElementType.WATER, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 1).attr(
      HighCritAttr,
    ),
    new AttackMove(MoveId.EXPLOSION, ElementType.NORMAL, MoveCategory.PHYSICAL, 250, 100, 5, -1, 0, 1)
      .condition(failIfDampCondition)
      .attr(SacrificialAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FURY_SWIPES, ElementType.NORMAL, MoveCategory.PHYSICAL, 18, 80, 15, -1, 0, 1).attr(
      MultiHitAttr,
    ),
    new AttackMove(MoveId.BONEMERANG, ElementType.GROUND, MoveCategory.PHYSICAL, 50, 90, 10, -1, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .makesContact(false),
    new SelfStatusMove(MoveId.REST, ElementType.PSYCHIC, -1, 5, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP, true, 3, true)
      .attr(HealAttr, 1, true)
      .condition((user, _target, _move) => !user.isFullHp() && user.canSetStatus(StatusEffect.SLEEP, true, true))
      .triageMove(),
    new AttackMove(MoveId.ROCK_SLIDE, ElementType.ROCK, MoveCategory.PHYSICAL, 75, 90, 10, 30, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.HYPER_FANG, ElementType.NORMAL, MoveCategory.PHYSICAL, 80, 90, 15, 10, 0, 1)
      .attr(FlinchAttr)
      .bitingMove(),
    new SelfStatusMove(MoveId.SHARPEN, ElementType.NORMAL, -1, 30, -1, 0, 1).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.CONVERSION, ElementType.NORMAL, -1, 30, -1, 0, 1).attr(FirstMoveTypeAttr),
    new AttackMove(MoveId.TRI_ATTACK, ElementType.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, 20, 0, 1).attr(
      MultiStatusEffectAttr,
      [StatusEffect.BURN, StatusEffect.FREEZE, StatusEffect.PARALYSIS],
    ),
    new AttackMove(MoveId.SUPER_FANG, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 90, 10, -1, 0, 1).attr(
      TargetHalfHpDamageAttr,
    ),
    new AttackMove(MoveId.SLASH, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 1)
      .attr(HighCritAttr)
      .slicingMove(),
    new SelfStatusMove(MoveId.SUBSTITUTE, ElementType.NORMAL, -1, 10, -1, 0, 1).attr(AddSubstituteAttr),
    new AttackMove(MoveId.STRUGGLE, ElementType.NORMAL, MoveCategory.PHYSICAL, 50, -1, 1, -1, 0, 1)
      .attr(RecoilAttr, true, 0.25, true)
      .attr(TypelessAttr)
      .ignoresVirtual()
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(MoveId.SKETCH, ElementType.NORMAL, -1, 1, -1, 0, 2)
      .ignoresSubstitute()
      .attr(SketchAttr)
      .ignoresVirtual(),
    new AttackMove(MoveId.TRIPLE_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 10, 90, 10, -1, 0, 2)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(MultiHitPowerIncrementAttr, 3)
      .checkAllHits(),
    new AttackMove(MoveId.THIEF, ElementType.DARK, MoveCategory.PHYSICAL, 60, 100, 25, -1, 0, 2).attr(
      StealHeldItemChanceAttr,
      0.3,
    ),
    new StatusMove(MoveId.SPIDER_WEB, ElementType.BUG, -1, 10, -1, 0, 2)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true })
      .ignoresProtect(),
    new StatusMove(MoveId.MIND_READER, ElementType.NORMAL, -1, 5, -1, 0, 2).attr(IgnoreAccuracyAttr),
    new StatusMove(MoveId.NIGHTMARE, ElementType.GHOST, 100, 15, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.NIGHTMARE)
      .condition(targetSleptOrComatoseCondition),
    new AttackMove(MoveId.FLAME_WHEEL, ElementType.FIRE, MoveCategory.PHYSICAL, 60, 100, 25, 10, 0, 2)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.SNORE, ElementType.NORMAL, MoveCategory.SPECIAL, 50, 100, 15, 30, 0, 2)
      .attr(BypassSleepAttr)
      .attr(FlinchAttr)
      .condition(userSleptOrComatoseCondition)
      .soundMove(),
    new StatusMove(MoveId.CURSE, ElementType.GHOST, -1, 10, -1, 0, 2)
      .attr(CurseAttr)
      .ignoresSubstitute()
      .ignoresProtect()
      .target(MoveTarget.CURSE),
    new AttackMove(MoveId.FLAIL, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 2).attr(LowHpPowerAttr),
    new StatusMove(MoveId.CONVERSION_2, ElementType.NORMAL, -1, 30, -1, 0, 2)
      .attr(ResistLastMoveTypeAttr)
      .ignoresSubstitute()
      .partial(), // Checks the move's original typing and not if its type is changed through some other means
    new AttackMove(MoveId.AEROBLAST, ElementType.FLYING, MoveCategory.SPECIAL, 100, 95, 5, -1, 0, 2)
      .windMove()
      .attr(HighCritAttr),
    new StatusMove(MoveId.COTTON_SPORE, ElementType.GRASS, 100, 40, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], -2)
      .powderMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.REVERSAL, ElementType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 2).attr(
      LowHpPowerAttr,
    ),
    new StatusMove(MoveId.SPITE, ElementType.GHOST, 100, 10, -1, 0, 2).ignoresSubstitute().attr(ReducePpMoveAttr, 4),
    new AttackMove(MoveId.POWDER_SNOW, ElementType.ICE, MoveCategory.SPECIAL, 40, 100, 25, 10, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(MoveId.PROTECT, ElementType.NORMAL, -1, 10, -1, 4, 2)
      .attr(ProtectAttr)
      .condition(failIfLastCondition),
    new AttackMove(
      MoveId.MACH_PUNCH,
      ElementType.FIGHTING,
      MoveCategory.PHYSICAL,
      40,
      100,
      30,
      -1,
      1,
      2,
    ).punchingMove(),
    new StatusMove(MoveId.SCARY_FACE, ElementType.NORMAL, 100, 10, -1, 0, 2).attr(StatStageChangeAttr, [Stat.SPD], -2),
    new AttackMove(MoveId.FEINT_ATTACK, ElementType.DARK, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 2),
    new StatusMove(MoveId.SWEET_KISS, ElementType.FAIRY, 75, 10, -1, 0, 2).attr(ConfuseAttr),
    new SelfStatusMove(MoveId.BELLY_DRUM, ElementType.NORMAL, -1, 10, -1, 0, 2).attr(
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
    new AttackMove(MoveId.SLUDGE_BOMB, ElementType.POISON, MoveCategory.SPECIAL, 90, 100, 10, 30, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .bulletMove(),
    new AttackMove(MoveId.MUD_SLAP, ElementType.GROUND, MoveCategory.SPECIAL, 20, 100, 10, 100, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(MoveId.OCTAZOOKA, ElementType.WATER, MoveCategory.SPECIAL, 65, 85, 10, 50, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bulletMove(),
    new StatusMove(MoveId.SPIKES, ElementType.GROUND, -1, 20, -1, 0, 2)
      .attr(AddArenaTrapTagAttr, ArenaTagType.SPIKES)
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(MoveId.ZAP_CANNON, ElementType.ELECTRIC, MoveCategory.SPECIAL, 120, 50, 5, 100, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .bulletMove(),
    new StatusMove(MoveId.FORESIGHT, ElementType.NORMAL, -1, 40, -1, 0, 2)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_GHOST)
      .ignoresSubstitute(),
    new SelfStatusMove(MoveId.DESTINY_BOND, ElementType.GHOST, -1, 5, -1, 0, 2)
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
          lastTurnMove.length === 0
          || lastTurnMove[0].moveId !== move.id
          || lastTurnMove[0].result !== MoveResult.SUCCESS
        );
      }),
    new StatusMove(MoveId.PERISH_SONG, ElementType.NORMAL, -1, 5, -1, 0, 2)
      .attr(FaintCountdownAttr)
      .ignoresProtect()
      .soundMove()
      .condition(failOnBossCondition)
      .target(MoveTarget.ALL),
    new AttackMove(MoveId.ICY_WIND, ElementType.ICE, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(MoveId.DETECT, ElementType.FIGHTING, -1, 5, -1, 4, 2)
      .attr(ProtectAttr)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.BONE_RUSH, ElementType.GROUND, MoveCategory.PHYSICAL, 25, 90, 10, -1, 0, 2)
      .attr(MultiHitAttr)
      .makesContact(false),
    new StatusMove(MoveId.LOCK_ON, ElementType.NORMAL, -1, 5, -1, 0, 2).attr(IgnoreAccuracyAttr),
    new AttackMove(MoveId.OUTRAGE, ElementType.DRAGON, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 2)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(MoveId.SANDSTORM, ElementType.ROCK, -1, 10, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.SANDSTORM)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.GIGA_DRAIN, ElementType.GRASS, MoveCategory.SPECIAL, 75, 100, 10, -1, 0, 2)
      .attr(HitHealAttr)
      .triageMove(),
    new SelfStatusMove(MoveId.ENDURE, ElementType.NORMAL, -1, 10, -1, 4, 2)
      .attr(ProtectAttr, BattlerTagType.ENDURING)
      .condition(failIfLastCondition),
    new StatusMove(MoveId.CHARM, ElementType.FAIRY, 100, 20, -1, 0, 2).attr(StatStageChangeAttr, [Stat.ATK], -2),
    new AttackMove(MoveId.ROLLOUT, ElementType.ROCK, MoveCategory.PHYSICAL, 30, 90, 20, -1, 0, 2)
      .partial() // Does not lock the user, also does not increase damage properly
      .attr(ConsecutiveUseDoublePowerAttr, 5, true, true, MoveId.DEFENSE_CURL),
    new AttackMove(MoveId.FALSE_SWIPE, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 2).attr(
      SurviveDamageAttr,
    ),
    new StatusMove(MoveId.SWAGGER, ElementType.NORMAL, 85, 15, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ATK], 2)
      .attr(ConfuseAttr),
    new SelfStatusMove(MoveId.MILK_DRINK, ElementType.NORMAL, -1, 5, -1, 0, 2).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(MoveId.SPARK, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 2).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(MoveId.FURY_CUTTER, ElementType.BUG, MoveCategory.PHYSICAL, 40, 95, 20, -1, 0, 2)
      .attr(ConsecutiveUseDoublePowerAttr, 3, true)
      .slicingMove(),
    new AttackMove(MoveId.STEEL_WING, ElementType.STEEL, MoveCategory.PHYSICAL, 70, 90, 25, 10, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new StatusMove(MoveId.MEAN_LOOK, ElementType.NORMAL, -1, 5, -1, 0, 2)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true })
      .ignoresProtect(),
    new StatusMove(MoveId.ATTRACT, ElementType.NORMAL, 100, 15, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.INFATUATED)
      .ignoresSubstitute()
      .condition((user, target, _move) => user.isOppositeGender(target)),
    new SelfStatusMove(MoveId.SLEEP_TALK, ElementType.NORMAL, -1, 10, -1, 0, 2)
      .attr(BypassSleepAttr)
      .attr(RandomMovesetMoveAttr)
      .condition(userSleptOrComatoseCondition)
      .target(MoveTarget.ALL_ENEMIES)
      .ignoresVirtual(),
    new StatusMove(MoveId.HEAL_BELL, ElementType.NORMAL, -1, 5, -1, 0, 2)
      .attr(PartyStatusCureAttr, i18next.t("moveTriggers:bellChimed"), Abilities.SOUNDPROOF)
      .soundMove()
      .target(MoveTarget.PARTY),
    new AttackMove(MoveId.RETURN, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 2).attr(
      FriendshipPowerAttr,
    ),
    new AttackMove(MoveId.PRESENT, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 90, 15, -1, 0, 2)
      .attr(PresentPowerAttr)
      .makesContact(false),
    new AttackMove(MoveId.FRUSTRATION, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 2).attr(
      FriendshipPowerAttr,
      true,
    ),
    new StatusMove(MoveId.SAFEGUARD, ElementType.NORMAL, -1, 25, -1, 0, 2)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.SAFEGUARD, { turnCount: 5, failOnOverlap: true, selfSideTarget: true }),
    new StatusMove(MoveId.PAIN_SPLIT, ElementType.NORMAL, -1, 20, -1, 0, 2)
      .attr(HpSplitAttr)
      .condition(failOnBossCondition),
    new AttackMove(MoveId.SACRED_FIRE, ElementType.FIRE, MoveCategory.PHYSICAL, 100, 95, 5, 50, 0, 2)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .makesContact(false),
    new AttackMove(MoveId.MAGNITUDE, ElementType.GROUND, MoveCategory.PHYSICAL, -1, 100, 30, -1, 0, 2)
      .attr(PreMoveMessageAttr, magnitudeMessageFunc)
      .attr(MagnitudePowerAttr)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.GRASSY && target.isGrounded() ? 0.5 : 1,
      )
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERGROUND)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.DYNAMIC_PUNCH, ElementType.FIGHTING, MoveCategory.PHYSICAL, 100, 50, 5, 100, 0, 2)
      .attr(ConfuseAttr)
      .punchingMove(),
    new AttackMove(MoveId.MEGAHORN, ElementType.BUG, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 2),
    new AttackMove(MoveId.DRAGON_BREATH, ElementType.DRAGON, MoveCategory.SPECIAL, 60, 100, 20, 30, 0, 2).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new SelfStatusMove(MoveId.BATON_PASS, ElementType.NORMAL, -1, 40, -1, 0, 2)
      .attr(ForceSwitchOutAttr, true, SwitchType.BATON_PASS)
      .condition(failIfLastInPartyCondition)
      .hidesUser(),
    new StatusMove(MoveId.ENCORE, ElementType.NORMAL, 100, 5, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.ENCORE, false, { failOnOverlap: true })
      .ignoresSubstitute()
      .condition((user, target, _move) => new EncoreTag(user.id).canAdd(target)),
    new AttackMove(MoveId.PURSUIT, ElementType.DARK, MoveCategory.PHYSICAL, 40, 100, 20, -1, 0, 2).partial(), // No effect implemented
    new AttackMove(MoveId.RAPID_SPIN, ElementType.NORMAL, MoveCategory.PHYSICAL, 50, 100, 40, 100, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .attr(RemoveBattlerTagAttr, rapidSpinRemoveTags, true)
      .attr(RemoveArenaTrapAttr),
    new StatusMove(MoveId.SWEET_SCENT, ElementType.NORMAL, 100, 20, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.EVA], -2)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.IRON_TAIL, ElementType.STEEL, MoveCategory.PHYSICAL, 100, 75, 15, 30, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(MoveId.METAL_CLAW, ElementType.STEEL, MoveCategory.PHYSICAL, 50, 95, 35, 10, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      1,
      true,
    ),
    new AttackMove(MoveId.VITAL_THROW, ElementType.FIGHTING, MoveCategory.PHYSICAL, 70, -1, 10, -1, -1, 2),
    new SelfStatusMove(MoveId.MORNING_SUN, ElementType.NORMAL, -1, 5, -1, 0, 2).attr(PlantHealAttr).triageMove(),
    new SelfStatusMove(MoveId.SYNTHESIS, ElementType.GRASS, -1, 5, -1, 0, 2).attr(PlantHealAttr).triageMove(),
    new SelfStatusMove(MoveId.MOONLIGHT, ElementType.FAIRY, -1, 5, -1, 0, 2).attr(PlantHealAttr).triageMove(),
    new AttackMove(MoveId.HIDDEN_POWER, ElementType.NORMAL, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 2).attr(
      HiddenPowerTypeAttr,
    ),
    new AttackMove(MoveId.CROSS_CHOP, ElementType.FIGHTING, MoveCategory.PHYSICAL, 100, 80, 5, -1, 0, 2).attr(
      HighCritAttr,
    ),
    new AttackMove(MoveId.TWISTER, ElementType.DRAGON, MoveCategory.SPECIAL, 40, 100, 20, 20, 0, 2)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .attr(FlinchAttr)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.RAIN_DANCE, ElementType.WATER, -1, 5, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.RAIN)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.SUNNY_DAY, ElementType.FIRE, -1, 5, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.SUNNY)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.CRUNCH, ElementType.DARK, MoveCategory.PHYSICAL, 80, 100, 15, 20, 0, 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .bitingMove(),
    new AttackMove(MoveId.MIRROR_COAT, ElementType.PSYCHIC, MoveCategory.SPECIAL, -1, 100, 20, -1, -5, 2)
      .attr(CounterDamageAttr, (move: Move) => move.category === MoveCategory.SPECIAL, 2)
      .target(MoveTarget.ATTACKER),
    new StatusMove(MoveId.PSYCH_UP, ElementType.NORMAL, -1, 10, -1, 0, 2).ignoresSubstitute().attr(CopyStatsAttr),
    new AttackMove(MoveId.EXTREME_SPEED, ElementType.NORMAL, MoveCategory.PHYSICAL, 80, 100, 5, -1, 2, 2),
    new AttackMove(MoveId.ANCIENT_POWER, ElementType.ROCK, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD],
      1,
      true,
    ),
    new AttackMove(MoveId.SHADOW_BALL, ElementType.GHOST, MoveCategory.SPECIAL, 80, 100, 15, 20, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .bulletMove(),
    new AttackMove(MoveId.FUTURE_SIGHT, ElementType.PSYCHIC, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 2)
      .partial() // hits immediately when called by Metronome/etc, should not apply abilities or held items if user is off the field
      .ignoresProtect()
      .attr(
        DelayedAttackAttr,
        ChargeAnim.FUTURE_SIGHT_CHARGING,
        i18next.t("moveTriggers:foresawAnAttack", { pokemonName: "{USER}" }),
      ),
    new AttackMove(MoveId.ROCK_SMASH, ElementType.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 15, 50, 0, 2).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(MoveId.WHIRLPOOL, ElementType.WATER, MoveCategory.SPECIAL, 35, 85, 15, -1, 0, 2)
      .attr(TrapAttr, BattlerTagType.WHIRLPOOL)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERWATER),
    new AttackMove(MoveId.BEAT_UP, ElementType.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 2)
      .attr(MultiHitAttr, MultiHitType.BEAT_UP)
      .attr(BeatUpAttr)
      .makesContact(false),
    new AttackMove(MoveId.FAKE_OUT, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 10, 100, 3, 3)
      .attr(FlinchAttr)
      .condition(new FirstMoveCondition()),
    new AttackMove(MoveId.UPROAR, ElementType.NORMAL, MoveCategory.SPECIAL, 90, 100, 10, -1, 0, 3)
      .ignoresVirtual()
      .soundMove()
      .target(MoveTarget.RANDOM_NEAR_ENEMY)
      .partial(), // Does not lock the user, does not stop Pokemon from sleeping
    new SelfStatusMove(MoveId.STOCKPILE, ElementType.NORMAL, -1, 20, -1, 0, 3)
      .condition((user) => (user.getTag(StockpilingTag)?.stockpiledCount ?? 0) < 3)
      .attr(AddBattlerTagAttr, BattlerTagType.STOCKPILING, true),
    new AttackMove(MoveId.SPIT_UP, ElementType.NORMAL, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 3)
      .condition(hasStockpileStacksCondition)
      .attr(SpitUpPowerAttr, 100)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.STOCKPILING], true),
    new SelfStatusMove(MoveId.SWALLOW, ElementType.NORMAL, -1, 10, -1, 0, 3)
      .condition(hasStockpileStacksCondition)
      .attr(SwallowHealAttr)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.STOCKPILING], true)
      .triageMove(),
    new AttackMove(MoveId.HEAT_WAVE, ElementType.FIRE, MoveCategory.SPECIAL, 95, 90, 10, 10, 0, 3)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.HAIL, ElementType.ICE, -1, 10, -1, 0, 3)
      .attr(WeatherChangeAttr, WeatherType.HAIL)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.TORMENT, ElementType.DARK, 100, 15, -1, 0, 3)
      .ignoresSubstitute()
      .edgeCase() // Incomplete implementation because of Uproar's partial implementation
      .attr(AddBattlerTagAttr, BattlerTagType.TORMENT, false, { failOnOverlap: true }),
    new StatusMove(MoveId.FLATTER, ElementType.DARK, 100, 15, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1)
      .attr(ConfuseAttr),
    new StatusMove(MoveId.WILL_O_WISP, ElementType.FIRE, 85, 15, -1, 0, 3).attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(MoveId.MEMENTO, ElementType.DARK, 100, 10, -1, 0, 3)
      .attr(SacrificialAttr, true)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -2),
    new AttackMove(MoveId.FACADE, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 3)
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
    new AttackMove(MoveId.FOCUS_PUNCH, ElementType.FIGHTING, MoveCategory.PHYSICAL, 150, 100, 20, -1, -3, 3)
      .attr(MessageHeaderAttr, (user, _move) =>
        i18next.t("moveTriggers:isTighteningFocus", { pokemonName: getPokemonNameWithAffix(user) }),
      )
      .punchingMove()
      .ignoresVirtual()
      .condition((user, _target, _move) => !user.turnData.attacksReceived.find((r) => r.damage)),
    new AttackMove(MoveId.SMELLING_SALTS, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 10, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.status?.effect === StatusEffect.PARALYSIS ? 2 : 1,
      )
      .attr(HealStatusEffectAttr, true, StatusEffect.PARALYSIS),
    new SelfStatusMove(MoveId.FOLLOW_ME, ElementType.NORMAL, -1, 20, -1, 2, 3).attr(
      AddBattlerTagAttr,
      BattlerTagType.CENTER_OF_ATTENTION,
      true,
    ),
    new StatusMove(MoveId.NATURE_POWER, ElementType.NORMAL, -1, 20, -1, 0, 3).attr(NaturePowerAttr).ignoresVirtual(),
    new SelfStatusMove(MoveId.CHARGE, ElementType.ELECTRIC, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], 1, true)
      .attr(AddBattlerTagAttr, BattlerTagType.CHARGED, true),
    new StatusMove(MoveId.TAUNT, ElementType.DARK, 100, 20, -1, 0, 3)
      .ignoresSubstitute()
      .attr(AddBattlerTagAttr, BattlerTagType.TAUNT, false, { failOnOverlap: true, turnCountMin: 4 }),
    new StatusMove(MoveId.HELPING_HAND, ElementType.NORMAL, -1, 20, -1, 5, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.HELPING_HAND)
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_ALLY)
      .condition(failIfSingleBattle),
    new StatusMove(MoveId.TRICK, ElementType.PSYCHIC, 100, 10, -1, 0, 3).unimplemented(),
    new StatusMove(MoveId.ROLE_PLAY, ElementType.PSYCHIC, -1, 10, -1, 0, 3).ignoresSubstitute().attr(AbilityCopyAttr),
    new SelfStatusMove(MoveId.WISH, ElementType.NORMAL, -1, 10, -1, 0, 3)
      .triageMove()
      .attr(AddArenaTagAttr, ArenaTagType.WISH, { turnCount: 2, failOnOverlap: true }),
    new SelfStatusMove(MoveId.ASSIST, ElementType.NORMAL, -1, 20, -1, 0, 3)
      .attr(RandomMovesetMoveAttr, true)
      .ignoresVirtual(),
    new SelfStatusMove(MoveId.INGRAIN, ElementType.GRASS, -1, 20, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.INGRAIN, true, { failOnOverlap: true })
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, true, { failOnOverlap: true })
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLOATING], true),
    new AttackMove(MoveId.SUPERPOWER, ElementType.FIGHTING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF],
      -1,
      true,
    ),
    new SelfStatusMove(MoveId.MAGIC_COAT, ElementType.PSYCHIC, -1, 15, -1, 4, 3).unimplemented(),
    new SelfStatusMove(MoveId.RECYCLE, ElementType.NORMAL, -1, 10, -1, 0, 3).unimplemented(),
    new AttackMove(MoveId.REVENGE, ElementType.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, -1, -4, 3).attr(
      TurnDamagedDoublePowerAttr,
    ),
    new AttackMove(MoveId.BRICK_BREAK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 75, 100, 15, -1, 0, 3).attr(
      RemoveScreensAttr,
    ),
    new StatusMove(MoveId.YAWN, ElementType.NORMAL, -1, 10, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.DROWSY, false, { failOnOverlap: true })
      .condition((user, target, _move) => !target.status && !target.isSafeguarded(user)),
    new AttackMove(MoveId.KNOCK_OFF, ElementType.DARK, MoveCategory.PHYSICAL, 65, 100, 20, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.getHeldItems().filter((i) => i.isTransferable).length > 0 ? 1.5 : 1,
      )
      .attr(RemoveHeldItemAttr, false),
    new AttackMove(MoveId.ENDEAVOR, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 3)
      .attr(MatchHpAttr)
      .condition(failOnBossCondition),
    new AttackMove(MoveId.ERUPTION, ElementType.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 3)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.SKILL_SWAP, ElementType.PSYCHIC, -1, 10, -1, 0, 3)
      .condition(failOnMaxCondition)
      .ignoresSubstitute()
      .attr(SwitchAbilitiesAttr),
    new StatusMove(MoveId.IMPRISON, ElementType.PSYCHIC, 100, 10, -1, 0, 3)
      .ignoresSubstitute()
      .attr(AddArenaTagAttr, ArenaTagType.IMPRISON, { failOnOverlap: true })
      .target(MoveTarget.ENEMY_SIDE),
    new SelfStatusMove(MoveId.REFRESH, ElementType.NORMAL, -1, 20, -1, 0, 3)
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
    new SelfStatusMove(MoveId.GRUDGE, ElementType.GHOST, -1, 5, -1, 0, 3).attr(
      AddBattlerTagAttr,
      BattlerTagType.GRUDGE,
      true,
      {
        turnCountMin: 1,
      },
    ),
    new SelfStatusMove(MoveId.SNATCH, ElementType.DARK, -1, 10, -1, 4, 3).unimplemented(),
    new AttackMove(MoveId.SECRET_POWER, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, 30, 0, 3)
      .makesContact(false)
      .attr(SecretPowerAttr),
    new ChargingAttackMove(MoveId.DIVE, ElementType.WATER, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 3)
      .chargeText(i18next.t("moveTriggers:hidUnderwater", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.UNDERWATER)
      .chargeAttr(GulpMissileTagAttr)
      .ignoresVirtual(),
    new AttackMove(MoveId.ARM_THRUST, ElementType.FIGHTING, MoveCategory.PHYSICAL, 15, 100, 20, -1, 0, 3).attr(
      MultiHitAttr,
    ),
    new SelfStatusMove(MoveId.CAMOUFLAGE, ElementType.NORMAL, -1, 20, -1, 0, 3).attr(CopyBiomeTypeAttr),
    new SelfStatusMove(MoveId.TAIL_GLOW, ElementType.BUG, -1, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      3,
      true,
    ),
    new AttackMove(MoveId.LUSTER_PURGE, ElementType.PSYCHIC, MoveCategory.SPECIAL, 95, 100, 5, 50, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new AttackMove(MoveId.MIST_BALL, ElementType.PSYCHIC, MoveCategory.SPECIAL, 95, 100, 5, 50, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .bulletMove(),
    new StatusMove(MoveId.FEATHER_DANCE, ElementType.FLYING, 100, 15, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], -2)
      .danceMove(),
    new StatusMove(MoveId.TEETER_DANCE, ElementType.NORMAL, 100, 20, -1, 0, 3)
      .attr(ConfuseAttr)
      .danceMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.BLAZE_KICK, ElementType.FIRE, MoveCategory.PHYSICAL, 85, 90, 10, 10, 0, 3)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(MoveId.MUD_SPORT, ElementType.GROUND, -1, 15, -1, 0, 3)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.MUD_SPORT, { turnCount: 5 })
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.ICE_BALL, ElementType.ICE, MoveCategory.PHYSICAL, 30, 90, 20, -1, 0, 3)
      .partial() // Does not lock the user properly, does not increase damage correctly
      .attr(ConsecutiveUseDoublePowerAttr, 5, true, true, MoveId.DEFENSE_CURL)
      .bulletMove(),
    new AttackMove(MoveId.NEEDLE_ARM, ElementType.GRASS, MoveCategory.PHYSICAL, 60, 100, 15, 30, 0, 3).attr(FlinchAttr),
    new SelfStatusMove(MoveId.SLACK_OFF, ElementType.NORMAL, -1, 5, -1, 0, 3).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(MoveId.HYPER_VOICE, ElementType.NORMAL, MoveCategory.SPECIAL, 90, 100, 10, -1, 0, 3)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.POISON_FANG, ElementType.POISON, MoveCategory.PHYSICAL, 50, 100, 15, 50, 0, 3)
      .attr(StatusEffectAttr, StatusEffect.TOXIC)
      .bitingMove(),
    new AttackMove(MoveId.CRUSH_CLAW, ElementType.NORMAL, MoveCategory.PHYSICAL, 75, 95, 10, 50, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(MoveId.BLAST_BURN, ElementType.FIRE, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3).attr(RechargeAttr),
    new AttackMove(MoveId.HYDRO_CANNON, ElementType.WATER, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3).attr(
      RechargeAttr,
    ),
    new AttackMove(MoveId.METEOR_MASH, ElementType.STEEL, MoveCategory.PHYSICAL, 90, 90, 10, 20, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .punchingMove(),
    new AttackMove(MoveId.ASTONISH, ElementType.GHOST, MoveCategory.PHYSICAL, 30, 100, 15, 30, 0, 3).attr(FlinchAttr),
    new AttackMove(MoveId.WEATHER_BALL, ElementType.NORMAL, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 3)
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
      .bulletMove(),
    new StatusMove(MoveId.AROMATHERAPY, ElementType.GRASS, -1, 5, -1, 0, 3)
      .attr(PartyStatusCureAttr, i18next.t("moveTriggers:soothingAromaWaftedThroughArea"), Abilities.SAP_SIPPER)
      .target(MoveTarget.PARTY),
    new StatusMove(MoveId.FAKE_TEARS, ElementType.DARK, 100, 20, -1, 0, 3).attr(StatStageChangeAttr, [Stat.SPDEF], -2),
    new AttackMove(MoveId.AIR_CUTTER, ElementType.FLYING, MoveCategory.SPECIAL, 60, 95, 25, -1, 0, 3)
      .attr(HighCritAttr)
      .slicingMove()
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.OVERHEAT, ElementType.FIRE, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2, true)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE),
    new StatusMove(MoveId.ODOR_SLEUTH, ElementType.NORMAL, -1, 40, -1, 0, 3)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_GHOST)
      .ignoresSubstitute(),
    new AttackMove(MoveId.ROCK_TOMB, ElementType.ROCK, MoveCategory.PHYSICAL, 60, 95, 15, 100, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .makesContact(false),
    new AttackMove(MoveId.SILVER_WIND, ElementType.BUG, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .windMove(),
    new StatusMove(MoveId.METAL_SOUND, ElementType.STEEL, 85, 40, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2)
      .soundMove(),
    new StatusMove(MoveId.GRASS_WHISTLE, ElementType.GRASS, 55, 15, -1, 0, 3)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundMove(),
    new StatusMove(MoveId.TICKLE, ElementType.NORMAL, 100, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF],
      -1,
    ),
    new SelfStatusMove(MoveId.COSMIC_POWER, ElementType.PSYCHIC, -1, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      1,
      true,
    ),
    new AttackMove(MoveId.WATER_SPOUT, ElementType.WATER, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 3)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SIGNAL_BEAM, ElementType.BUG, MoveCategory.SPECIAL, 75, 100, 15, 10, 0, 3).attr(ConfuseAttr),
    new AttackMove(MoveId.SHADOW_PUNCH, ElementType.GHOST, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 3).punchingMove(),
    new AttackMove(MoveId.EXTRASENSORY, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 20, 10, 0, 3).attr(
      FlinchAttr,
    ),
    new AttackMove(MoveId.SKY_UPPERCUT, ElementType.FIGHTING, MoveCategory.PHYSICAL, 85, 90, 15, -1, 0, 3)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .punchingMove(),
    new AttackMove(MoveId.SAND_TOMB, ElementType.GROUND, MoveCategory.PHYSICAL, 35, 85, 15, -1, 0, 3)
      .attr(TrapAttr, BattlerTagType.SAND_TOMB)
      .makesContact(false),
    new AttackMove(MoveId.SHEER_COLD, ElementType.ICE, MoveCategory.SPECIAL, 200, 30, 5, -1, 0, 3)
      .attr(IceNoEffectTypeAttr)
      .attr(OneHitKOAttr)
      .attr(SheerColdAccuracyAttr),
    new AttackMove(MoveId.MUDDY_WATER, ElementType.WATER, MoveCategory.SPECIAL, 90, 85, 10, 30, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BULLET_SEED, ElementType.GRASS, MoveCategory.PHYSICAL, 25, 100, 30, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.AERIAL_ACE, ElementType.FLYING, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 3).slicingMove(),
    new AttackMove(MoveId.ICICLE_SPEAR, ElementType.ICE, MoveCategory.PHYSICAL, 25, 100, 30, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false),
    new SelfStatusMove(MoveId.IRON_DEFENSE, ElementType.STEEL, -1, 15, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      2,
      true,
    ),
    new StatusMove(MoveId.BLOCK, ElementType.NORMAL, -1, 5, -1, 0, 3)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true })
      .ignoresProtect(),
    new StatusMove(MoveId.HOWL, ElementType.NORMAL, -1, 40, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], 1)
      .soundMove()
      .target(MoveTarget.USER_AND_ALLIES),
    new AttackMove(MoveId.DRAGON_CLAW, ElementType.DRAGON, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 3),
    new AttackMove(MoveId.FRENZY_PLANT, ElementType.GRASS, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3).attr(
      RechargeAttr,
    ),
    new SelfStatusMove(MoveId.BULK_UP, ElementType.FIGHTING, -1, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF],
      1,
      true,
    ),
    new ChargingAttackMove(MoveId.BOUNCE, ElementType.FLYING, MoveCategory.PHYSICAL, 85, 85, 5, 30, 0, 3)
      .chargeText(i18next.t("moveTriggers:sprangUp", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.FLYING)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .condition(failOnGravityCondition)
      .ignoresVirtual(),
    new AttackMove(MoveId.MUD_SHOT, ElementType.GROUND, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(MoveId.POISON_TAIL, ElementType.POISON, MoveCategory.PHYSICAL, 50, 100, 25, 10, 0, 3)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.COVET, ElementType.NORMAL, MoveCategory.PHYSICAL, 60, 100, 25, -1, 0, 3).attr(
      StealHeldItemChanceAttr,
      0.3,
    ),
    new AttackMove(MoveId.VOLT_TACKLE, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 120, 100, 15, 10, 0, 3)
      .attr(RecoilAttr, false, 0.33)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .recklessMove(),
    new AttackMove(MoveId.MAGICAL_LEAF, ElementType.GRASS, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 3),
    new StatusMove(MoveId.WATER_SPORT, ElementType.WATER, -1, 15, -1, 0, 3)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.WATER_SPORT, { turnCount: 5 })
      .target(MoveTarget.BOTH_SIDES),
    new SelfStatusMove(MoveId.CALM_MIND, ElementType.PSYCHIC, -1, 20, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPATK, Stat.SPDEF],
      1,
      true,
    ),
    new AttackMove(MoveId.LEAF_BLADE, ElementType.GRASS, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 3)
      .attr(HighCritAttr)
      .slicingMove(),
    new SelfStatusMove(MoveId.DRAGON_DANCE, ElementType.DRAGON, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPD], 1, true)
      .danceMove(),
    new AttackMove(MoveId.ROCK_BLAST, ElementType.ROCK, MoveCategory.PHYSICAL, 25, 90, 10, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.SHOCK_WAVE, ElementType.ELECTRIC, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 3),
    new AttackMove(MoveId.WATER_PULSE, ElementType.WATER, MoveCategory.SPECIAL, 60, 100, 20, 20, 0, 3)
      .attr(ConfuseAttr)
      .pulseMove(),
    new AttackMove(MoveId.DOOM_DESIRE, ElementType.STEEL, MoveCategory.SPECIAL, 140, 100, 5, -1, 0, 3)
      .partial() // cannot be used on multiple Pokemon on the same side in a double battle, hits immediately when called by Metronome/etc, should not apply abilities or held items if user is off the field
      .ignoresProtect()
      .attr(
        DelayedAttackAttr,
        ChargeAnim.DOOM_DESIRE_CHARGING,
        i18next.t("moveTriggers:choseDoomDesireAsDestiny", { pokemonName: "{USER}" }),
      ),
    new AttackMove(MoveId.PSYCHO_BOOST, ElementType.PSYCHIC, MoveCategory.SPECIAL, 140, 90, 5, -1, 0, 3).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new SelfStatusMove(MoveId.ROOST, ElementType.FLYING, -1, 5, -1, 0, 4)
      .attr(HealAttr, 0.5)
      .attr(AddBattlerTagAttr, BattlerTagType.ROOSTED, true)
      .triageMove(),
    new StatusMove(MoveId.GRAVITY, ElementType.PSYCHIC, -1, 5, -1, 0, 4)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.GRAVITY, { turnCount: 5 })
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.MIRACLE_EYE, ElementType.PSYCHIC, -1, 40, -1, 0, 4)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_DARK)
      .ignoresSubstitute(),
    new AttackMove(MoveId.WAKE_UP_SLAP, ElementType.FIGHTING, MoveCategory.PHYSICAL, 70, 100, 10, -1, 0, 4)
      .attr(MovePowerMultiplierAttr, (user, target, move) =>
        targetSleptOrComatoseCondition(user, target, move) ? 2 : 1,
      )
      .attr(HealStatusEffectAttr, false, StatusEffect.SLEEP),
    new AttackMove(MoveId.HAMMER_ARM, ElementType.FIGHTING, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPD], -1, true)
      .punchingMove(),
    new AttackMove(MoveId.GYRO_BALL, ElementType.STEEL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4)
      .attr(GyroBallPowerAttr)
      .bulletMove(),
    new SelfStatusMove(MoveId.HEALING_WISH, ElementType.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SacrificialFullRestoreAttr, false, "moveTriggers:sacrificialFullRestore")
      .triageMove()
      .partial(), // Does not have the effect of being stored if the incoming Pokemon is already healthy
    new AttackMove(MoveId.BRINE, ElementType.WATER, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 4).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) => (target.getHpRatio() < 0.5 ? 2 : 1),
    ),
    new AttackMove(MoveId.NATURAL_GIFT, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 4)
      .makesContact(false)
      .unimplemented(),
    new AttackMove(MoveId.FEINT, ElementType.NORMAL, MoveCategory.PHYSICAL, 30, 100, 10, -1, 2, 4)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.PROTECTED])
      .attr(
        RemoveArenaTagsAttr,
        [ArenaTagType.QUICK_GUARD, ArenaTagType.WIDE_GUARD, ArenaTagType.MAT_BLOCK, ArenaTagType.CRAFTY_SHIELD],
        ArenaTagRelativeSide.TARGET,
        MoveEffectTrigger.PRE_APPLY,
      )
      .makesContact(false)
      .ignoresProtect(),
    new AttackMove(MoveId.PLUCK, ElementType.FLYING, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 4).attr(
      StealEatBerryAttr,
    ),
    new StatusMove(MoveId.TAILWIND, ElementType.FLYING, -1, 15, -1, 0, 4)
      .windMove()
      .attr(AddArenaTagAttr, ArenaTagType.TAILWIND, { turnCount: 4, failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    new StatusMove(MoveId.ACUPRESSURE, ElementType.NORMAL, -1, 30, -1, 0, 4)
      .attr(AcupressureStatStageChangeAttr)
      .target(MoveTarget.USER_OR_NEAR_ALLY),
    new AttackMove(MoveId.METAL_BURST, ElementType.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 4)
      .attr(
        CounterDamageAttr,
        (move: Move) => move.category === MoveCategory.PHYSICAL || move.category === MoveCategory.SPECIAL,
        1.5,
      )
      .redirectCounter()
      .makesContact(false)
      .target(MoveTarget.ATTACKER),
    new AttackMove(MoveId.U_TURN, ElementType.BUG, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 4).attr(
      ForceSwitchOutAttr,
      true,
    ),
    new AttackMove(MoveId.CLOSE_COMBAT, ElementType.FIGHTING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      -1,
      true,
    ),
    new AttackMove(MoveId.PAYBACK, ElementType.DARK, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 4).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) =>
        target.getLastXMoves(1).find((m) => m.turn === globalScene.currentBattle.turn)
        || globalScene.currentBattle.turnCommands[target.getBattlerIndex()]?.command === BattleCommand.BALL
          ? 2
          : 1,
    ),
    new AttackMove(MoveId.ASSURANCE, ElementType.DARK, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 4).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) => (target.turnData.damageTaken > 0 ? 2 : 1),
    ),
    new StatusMove(MoveId.EMBARGO, ElementType.DARK, 100, 15, -1, 0, 4).unimplemented(),
    new AttackMove(MoveId.FLING, ElementType.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 4)
      .makesContact(false)
      .unimplemented(),
    new StatusMove(MoveId.PSYCHO_SHIFT, ElementType.PSYCHIC, 100, 10, -1, 0, 4)
      .attr(PsychoShiftEffectAttr)
      .condition((user, target, _move) => {
        let statusToApply = user.hasAbility(Abilities.COMATOSE) ? StatusEffect.SLEEP : undefined;
        if (user.status?.effect && isNonVolatileStatusEffect(user.status.effect)) {
          statusToApply = user.status.effect;
        }
        return !!statusToApply && target.canSetStatus(statusToApply, false, false, user);
      }),
    new AttackMove(MoveId.TRUMP_CARD, ElementType.NORMAL, MoveCategory.SPECIAL, -1, -1, 5, -1, 0, 4)
      .makesContact()
      .attr(LessPPMorePowerAttr),
    new StatusMove(MoveId.HEAL_BLOCK, ElementType.PSYCHIC, 100, 15, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.HEAL_BLOCK, false, { failOnOverlap: true, turnCountMin: 5 })
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.WRING_OUT, ElementType.NORMAL, MoveCategory.SPECIAL, -1, 100, 5, -1, 0, 4)
      .attr(OpponentHighHpPowerAttr, 120)
      .makesContact(),
    new SelfStatusMove(MoveId.POWER_TRICK, ElementType.PSYCHIC, -1, 10, -1, 0, 4).attr(
      AddBattlerTagAttr,
      BattlerTagType.POWER_TRICK,
      true,
    ),
    new StatusMove(MoveId.GASTRO_ACID, ElementType.POISON, 100, 10, -1, 0, 4).attr(SuppressAbilitiesAttr),
    new StatusMove(MoveId.LUCKY_CHANT, ElementType.NORMAL, -1, 30, -1, 0, 4)
      .attr(AddArenaTagAttr, ArenaTagType.NO_CRIT, { turnCount: 5, failOnOverlap: true, selfSideTarget: true })
      .target(MoveTarget.USER_SIDE),
    new StatusMove(MoveId.ME_FIRST, ElementType.NORMAL, -1, 20, -1, 0, 4)
      .ignoresSubstitute()
      .ignoresVirtual()
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new SelfStatusMove(MoveId.COPYCAT, ElementType.NORMAL, -1, 20, -1, 0, 4).attr(CopyMoveAttr).ignoresVirtual(),
    new StatusMove(MoveId.POWER_SWAP, ElementType.PSYCHIC, -1, 10, 100, 0, 4)
      .attr(SwapStatStagesAttr, [Stat.ATK, Stat.SPATK])
      .ignoresSubstitute(),
    new StatusMove(MoveId.GUARD_SWAP, ElementType.PSYCHIC, -1, 10, 100, 0, 4)
      .attr(SwapStatStagesAttr, [Stat.DEF, Stat.SPDEF])
      .ignoresSubstitute(),
    new AttackMove(MoveId.PUNISHMENT, ElementType.DARK, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4)
      .makesContact(true)
      .attr(PunishmentPowerAttr),
    new AttackMove(MoveId.LAST_RESORT, ElementType.NORMAL, MoveCategory.PHYSICAL, 140, 100, 5, -1, 0, 4).attr(
      LastResortAttr,
    ),
    new StatusMove(MoveId.WORRY_SEED, ElementType.GRASS, 100, 10, -1, 0, 4).attr(AbilityChangeAttr, Abilities.INSOMNIA),
    new AttackMove(MoveId.SUCKER_PUNCH, ElementType.DARK, MoveCategory.PHYSICAL, 70, 100, 5, -1, 1, 4).condition(
      (_user, target, _move) => {
        const turnCommand = globalScene.currentBattle.turnCommands[target.getBattlerIndex()];
        if (!turnCommand || !turnCommand.move) {
          return false;
        }
        return (
          turnCommand.command === BattleCommand.FIGHT
          && !target.turnData.acted
          && allMoves[turnCommand.move.moveId].category !== MoveCategory.STATUS
        );
      },
    ),
    new StatusMove(MoveId.TOXIC_SPIKES, ElementType.POISON, -1, 20, -1, 0, 4)
      .attr(AddArenaTrapTagAttr, ArenaTagType.TOXIC_SPIKES)
      .target(MoveTarget.ENEMY_SIDE),
    new StatusMove(MoveId.HEART_SWAP, ElementType.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SwapStatStagesAttr, BATTLE_STATS)
      .ignoresSubstitute(),
    new SelfStatusMove(MoveId.AQUA_RING, ElementType.WATER, -1, 20, -1, 0, 4).attr(
      AddBattlerTagAttr,
      BattlerTagType.AQUA_RING,
      true,
      { failOnOverlap: true },
    ),
    new SelfStatusMove(MoveId.MAGNET_RISE, ElementType.ELECTRIC, -1, 10, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.FLOATING, true, { failOnOverlap: true, turnCountMin: 5 })
      .condition(
        (user, _target, _move) =>
          !globalScene.arena.getTag(ArenaTagType.GRAVITY)
          && [BattlerTagType.FLOATING, BattlerTagType.IGNORE_FLYING, BattlerTagType.INGRAIN].every(
            (tag) => !user.getTag(tag),
          ),
      ),
    new AttackMove(MoveId.FLARE_BLITZ, ElementType.FIRE, MoveCategory.PHYSICAL, 120, 100, 15, 10, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .recklessMove(),
    new AttackMove(MoveId.FORCE_PALM, ElementType.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, 30, 0, 4).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(MoveId.AURA_SPHERE, ElementType.FIGHTING, MoveCategory.SPECIAL, 80, -1, 20, -1, 0, 4)
      .pulseMove()
      .bulletMove(),
    new SelfStatusMove(MoveId.ROCK_POLISH, ElementType.ROCK, -1, 20, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      2,
      true,
    ),
    new AttackMove(MoveId.POISON_JAB, ElementType.POISON, MoveCategory.PHYSICAL, 80, 100, 20, 30, 0, 4).attr(
      StatusEffectAttr,
      StatusEffect.POISON,
    ),
    new AttackMove(MoveId.DARK_PULSE, ElementType.DARK, MoveCategory.SPECIAL, 80, 100, 15, 20, 0, 4)
      .attr(FlinchAttr)
      .pulseMove(),
    new AttackMove(MoveId.NIGHT_SLASH, ElementType.DARK, MoveCategory.PHYSICAL, 70, 100, 15, -1, 0, 4)
      .attr(HighCritAttr)
      .slicingMove(),
    new AttackMove(MoveId.AQUA_TAIL, ElementType.WATER, MoveCategory.PHYSICAL, 90, 90, 10, -1, 0, 4),
    new AttackMove(MoveId.SEED_BOMB, ElementType.GRASS, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 4)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.AIR_SLASH, ElementType.FLYING, MoveCategory.SPECIAL, 75, 95, 15, 30, 0, 4)
      .attr(FlinchAttr)
      .slicingMove(),
    new AttackMove(MoveId.X_SCISSOR, ElementType.BUG, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 4).slicingMove(),
    new AttackMove(MoveId.BUG_BUZZ, ElementType.BUG, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .soundMove(),
    new AttackMove(MoveId.DRAGON_PULSE, ElementType.DRAGON, MoveCategory.SPECIAL, 85, 100, 10, -1, 0, 4).pulseMove(),
    new AttackMove(MoveId.DRAGON_RUSH, ElementType.DRAGON, MoveCategory.PHYSICAL, 100, 75, 10, 20, 0, 4)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new AttackMove(MoveId.POWER_GEM, ElementType.ROCK, MoveCategory.SPECIAL, 80, 100, 20, -1, 0, 4),
    new AttackMove(MoveId.DRAIN_PUNCH, ElementType.FIGHTING, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 4)
      .attr(HitHealAttr)
      .punchingMove()
      .triageMove(),
    new AttackMove(MoveId.VACUUM_WAVE, ElementType.FIGHTING, MoveCategory.SPECIAL, 40, 100, 30, -1, 1, 4),
    new AttackMove(MoveId.FOCUS_BLAST, ElementType.FIGHTING, MoveCategory.SPECIAL, 120, 70, 5, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .bulletMove(),
    new AttackMove(MoveId.ENERGY_BALL, ElementType.GRASS, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .bulletMove(),
    new AttackMove(MoveId.BRAVE_BIRD, ElementType.FLYING, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(MoveId.EARTH_POWER, ElementType.GROUND, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new StatusMove(MoveId.SWITCHEROO, ElementType.DARK, 100, 10, -1, 0, 4).unimplemented(),
    new AttackMove(MoveId.GIGA_IMPACT, ElementType.NORMAL, MoveCategory.PHYSICAL, 150, 90, 5, -1, 0, 4).attr(
      RechargeAttr,
    ),
    new SelfStatusMove(MoveId.NASTY_PLOT, ElementType.DARK, -1, 20, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      2,
      true,
    ),
    new AttackMove(MoveId.BULLET_PUNCH, ElementType.STEEL, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4).punchingMove(),
    new AttackMove(MoveId.AVALANCHE, ElementType.ICE, MoveCategory.PHYSICAL, 60, 100, 10, -1, -4, 4).attr(
      TurnDamagedDoublePowerAttr,
    ),
    new AttackMove(MoveId.ICE_SHARD, ElementType.ICE, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4).makesContact(false),
    new AttackMove(MoveId.SHADOW_CLAW, ElementType.GHOST, MoveCategory.PHYSICAL, 70, 100, 15, -1, 0, 4).attr(
      HighCritAttr,
    ),
    new AttackMove(MoveId.THUNDER_FANG, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .bitingMove(),
    new AttackMove(MoveId.ICE_FANG, ElementType.ICE, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .bitingMove(),
    new AttackMove(MoveId.FIRE_FANG, ElementType.FIRE, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .bitingMove(),
    new AttackMove(MoveId.SHADOW_SNEAK, ElementType.GHOST, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4),
    new AttackMove(MoveId.MUD_BOMB, ElementType.GROUND, MoveCategory.SPECIAL, 65, 85, 10, 30, 0, 4)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bulletMove(),
    new AttackMove(MoveId.PSYCHO_CUT, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 4)
      .attr(HighCritAttr)
      .slicingMove()
      .makesContact(false),
    new AttackMove(MoveId.ZEN_HEADBUTT, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 80, 90, 15, 20, 0, 4).attr(
      FlinchAttr,
    ),
    new AttackMove(MoveId.MIRROR_SHOT, ElementType.STEEL, MoveCategory.SPECIAL, 65, 85, 10, 30, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(MoveId.FLASH_CANNON, ElementType.STEEL, MoveCategory.SPECIAL, 80, 100, 10, 10, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new AttackMove(MoveId.ROCK_CLIMB, ElementType.NORMAL, MoveCategory.PHYSICAL, 90, 85, 20, 20, 0, 4).attr(
      ConfuseAttr,
    ),
    new StatusMove(MoveId.DEFOG, ElementType.FLYING, -1, 15, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.EVA], -1)
      .attr(ClearWeatherAttr, WeatherType.FOG)
      .attr(ClearTerrainAttr)
      .attr(RemoveScreensAttr, false)
      .attr(RemoveArenaTrapAttr, true)
      .attr(RemoveArenaTagsAttr, [ArenaTagType.SAFEGUARD, ArenaTagType.MIST], ArenaTagRelativeSide.TARGET),
    new StatusMove(MoveId.TRICK_ROOM, ElementType.PSYCHIC, -1, 5, -1, -7, 4)
      .attr(AddArenaTagAttr, ArenaTagType.TRICK_ROOM, { turnCount: 5 })
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.DRACO_METEOR, ElementType.DRAGON, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new AttackMove(MoveId.DISCHARGE, ElementType.ELECTRIC, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.LAVA_PLUME, ElementType.FIRE, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.LEAF_STORM, ElementType.GRASS, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new AttackMove(MoveId.POWER_WHIP, ElementType.GRASS, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 4),
    new AttackMove(MoveId.ROCK_WRECKER, ElementType.ROCK, MoveCategory.PHYSICAL, 150, 90, 5, -1, 0, 4)
      .attr(RechargeAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.CROSS_POISON, ElementType.POISON, MoveCategory.PHYSICAL, 70, 100, 20, 10, 0, 4)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .slicingMove(),
    new AttackMove(MoveId.GUNK_SHOT, ElementType.POISON, MoveCategory.PHYSICAL, 120, 80, 5, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.IRON_HEAD, ElementType.STEEL, MoveCategory.PHYSICAL, 80, 100, 15, 30, 0, 4).attr(FlinchAttr),
    new AttackMove(MoveId.MAGNET_BOMB, ElementType.STEEL, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 4)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.STONE_EDGE, ElementType.ROCK, MoveCategory.PHYSICAL, 100, 80, 5, -1, 0, 4)
      .attr(HighCritAttr)
      .makesContact(false),
    new StatusMove(MoveId.CAPTIVATE, ElementType.NORMAL, 100, 20, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2)
      .condition((user, target, _move) => target.isOppositeGender(user))
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.STEALTH_ROCK, ElementType.ROCK, -1, 20, -1, 0, 4)
      .attr(AddArenaTrapTagAttr, ArenaTagType.STEALTH_ROCK)
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(MoveId.GRASS_KNOT, ElementType.GRASS, MoveCategory.SPECIAL, -1, 100, 20, -1, 0, 4)
      .condition(failOnMaxCondition)
      .attr(WeightPowerAttr)
      .makesContact(),
    new AttackMove(MoveId.CHATTER, ElementType.FLYING, MoveCategory.SPECIAL, 65, 100, 20, 100, 0, 4)
      .attr(ConfuseAttr)
      .soundMove(),
    new AttackMove(MoveId.JUDGMENT, ElementType.NORMAL, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 4).attr(
      FormChangeItemTypeAttr,
    ),
    new AttackMove(MoveId.BUG_BITE, ElementType.BUG, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 4).attr(
      StealEatBerryAttr,
    ),
    new AttackMove(MoveId.CHARGE_BEAM, ElementType.ELECTRIC, MoveCategory.SPECIAL, 50, 90, 10, 70, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      1,
      true,
    ),
    new AttackMove(MoveId.WOOD_HAMMER, ElementType.GRASS, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(MoveId.AQUA_JET, ElementType.WATER, MoveCategory.PHYSICAL, 40, 100, 20, -1, 1, 4),
    new AttackMove(MoveId.ATTACK_ORDER, ElementType.BUG, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 4)
      .attr(HighCritAttr)
      .makesContact(false),
    new SelfStatusMove(MoveId.DEFEND_ORDER, ElementType.BUG, -1, 10, -1, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.HEAL_ORDER, ElementType.BUG, -1, 10, -1, 0, 4).attr(HealAttr, 0.5).triageMove(),
    new AttackMove(MoveId.HEAD_SMASH, ElementType.ROCK, MoveCategory.PHYSICAL, 150, 80, 5, -1, 0, 4)
      .attr(RecoilAttr, false, 0.5)
      .recklessMove(),
    new AttackMove(MoveId.DOUBLE_HIT, ElementType.NORMAL, MoveCategory.PHYSICAL, 35, 90, 10, -1, 0, 4).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(MoveId.ROAR_OF_TIME, ElementType.DRAGON, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 4).attr(
      RechargeAttr,
    ),
    new AttackMove(MoveId.SPACIAL_REND, ElementType.DRAGON, MoveCategory.SPECIAL, 100, 95, 5, -1, 0, 4).attr(
      HighCritAttr,
    ),
    new SelfStatusMove(MoveId.LUNAR_DANCE, ElementType.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SacrificialFullRestoreAttr, true, "moveTriggers:lunarDanceRestore")
      .danceMove()
      .triageMove()
      .partial(), // Does not have the effect of being stored if the incoming Pokemon is already perfectly healthy
    new AttackMove(MoveId.CRUSH_GRIP, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4).attr(
      OpponentHighHpPowerAttr,
      120,
    ),
    new AttackMove(MoveId.MAGMA_STORM, ElementType.FIRE, MoveCategory.SPECIAL, 100, 75, 5, -1, 0, 4).attr(
      TrapAttr,
      BattlerTagType.MAGMA_STORM,
    ),
    new StatusMove(MoveId.DARK_VOID, ElementType.DARK, 80, 10, -1, 0, 4) //Accuracy from Generations 4-6
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SEED_FLARE, ElementType.GRASS, MoveCategory.SPECIAL, 120, 85, 5, 40, 0, 4).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -2,
    ),
    new AttackMove(MoveId.OMINOUS_WIND, ElementType.GHOST, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .windMove(),
    new ChargingAttackMove(MoveId.SHADOW_FORCE, ElementType.GHOST, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 4)
      .chargeText(i18next.t("moveTriggers:vanishedInstantly", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.HIDDEN)
      .ignoresProtect()
      .ignoresVirtual(),
    new SelfStatusMove(MoveId.HONE_CLAWS, ElementType.DARK, -1, 15, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.ACC],
      1,
      true,
    ),
    new StatusMove(MoveId.WIDE_GUARD, ElementType.ROCK, -1, 10, -1, 3, 5)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.WIDE_GUARD, { turnCount: 1, failOnOverlap: true, selfSideTarget: true })
      .condition(failIfLastCondition),
    new StatusMove(MoveId.GUARD_SPLIT, ElementType.PSYCHIC, -1, 10, -1, 0, 5).attr(
      AverageStatsAttr,
      [Stat.DEF, Stat.SPDEF],
      "moveTriggers:sharedGuard",
    ),
    new StatusMove(MoveId.POWER_SPLIT, ElementType.PSYCHIC, -1, 10, -1, 0, 5).attr(
      AverageStatsAttr,
      [Stat.ATK, Stat.SPATK],
      "moveTriggers:sharedPower",
    ),
    new StatusMove(MoveId.WONDER_ROOM, ElementType.PSYCHIC, -1, 10, -1, 0, 5)
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .unimplemented(),
    new AttackMove(MoveId.PSYSHOCK, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5).attr(
      DealsPhysicalDamageAttr,
    ),
    new AttackMove(MoveId.VENOSHOCK, ElementType.POISON, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 5).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) =>
        target.status && (target.status.effect === StatusEffect.POISON || target.status.effect === StatusEffect.TOXIC)
          ? 2
          : 1,
    ),
    new SelfStatusMove(MoveId.AUTOTOMIZE, ElementType.STEEL, -1, 15, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true)
      .attr(AddBattlerTagAttr, BattlerTagType.AUTOTOMIZED, true),
    new SelfStatusMove(MoveId.RAGE_POWDER, ElementType.BUG, -1, 20, -1, 2, 5)
      .powderMove()
      .attr(AddBattlerTagAttr, BattlerTagType.CENTER_OF_ATTENTION, true),
    new StatusMove(MoveId.TELEKINESIS, ElementType.PSYCHIC, -1, 15, -1, 0, 5)
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
    new StatusMove(MoveId.MAGIC_ROOM, ElementType.PSYCHIC, -1, 10, -1, 0, 5)
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .unimplemented(),
    new AttackMove(MoveId.SMACK_DOWN, ElementType.ROCK, MoveCategory.PHYSICAL, 50, 100, 15, -1, 0, 5)
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, false, { lastHitOnly: true })
      .attr(AddBattlerTagAttr, BattlerTagType.INTERRUPTED)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLYING, BattlerTagType.FLOATING, BattlerTagType.TELEKINESIS])
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .makesContact(false)
      .edgeCase(), // Should hit a Pokemon lifted up by Sky Drop without permanently grounding it
    new AttackMove(MoveId.STORM_THROW, ElementType.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 5).attr(
      CritOnlyAttr,
    ),
    new AttackMove(MoveId.FLAME_BURST, ElementType.FIRE, MoveCategory.SPECIAL, 70, 100, 15, -1, 0, 5).attr(
      FlameBurstAttr,
    ),
    new AttackMove(MoveId.SLUDGE_WAVE, ElementType.POISON, MoveCategory.SPECIAL, 95, 100, 10, 10, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new SelfStatusMove(MoveId.QUIVER_DANCE, ElementType.BUG, -1, 20, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .danceMove(),
    new AttackMove(MoveId.HEAVY_SLAM, ElementType.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 5)
      .condition(failOnMaxCondition)
      .attr(AlwaysHitMinimizeAttr)
      .attr(CompareWeightPowerAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED),
    new AttackMove(MoveId.SYNCHRONOISE, ElementType.PSYCHIC, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 5)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .condition(unknownTypeCondition)
      .attr(HitsSameTypeAttr),
    new AttackMove(MoveId.ELECTRO_BALL, ElementType.ELECTRIC, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 5)
      .attr(ElectroBallPowerAttr)
      .bulletMove(),
    new StatusMove(MoveId.SOAK, ElementType.WATER, 100, 20, -1, 0, 5).attr(ChangeTypeAttr, ElementType.WATER),
    new AttackMove(MoveId.FLAME_CHARGE, ElementType.FIRE, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.COIL, ElementType.POISON, -1, 20, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.DEF, Stat.ACC],
      1,
      true,
    ),
    new AttackMove(MoveId.LOW_SWEEP, ElementType.FIGHTING, MoveCategory.PHYSICAL, 65, 100, 20, 100, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(MoveId.ACID_SPRAY, ElementType.POISON, MoveCategory.SPECIAL, 40, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2)
      .bulletMove(),
    new AttackMove(MoveId.FOUL_PLAY, ElementType.DARK, MoveCategory.PHYSICAL, 95, 100, 15, -1, 0, 5).attr(
      TargetAtkUserAtkAttr,
    ),
    new StatusMove(MoveId.SIMPLE_BEAM, ElementType.NORMAL, 100, 15, -1, 0, 5).attr(AbilityChangeAttr, Abilities.SIMPLE),
    new StatusMove(MoveId.ENTRAINMENT, ElementType.NORMAL, 100, 15, -1, 0, 5)
      .condition(failOnMaxCondition)
      .attr(AbilityGiveAttr),
    new StatusMove(MoveId.AFTER_YOU, ElementType.NORMAL, -1, 15, -1, 0, 5)
      .ignoresProtect()
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_OTHER)
      .condition(failIfSingleBattle)
      .condition((_user, target, _move) => !target.turnData.acted)
      .attr(AfterYouAttr),
    new AttackMove(MoveId.ROUND, ElementType.NORMAL, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 5)
      .attr(CueNextRoundAttr)
      .attr(RoundPowerAttr)
      .soundMove(),
    new AttackMove(MoveId.ECHOED_VOICE, ElementType.NORMAL, MoveCategory.SPECIAL, 40, 100, 15, -1, 0, 5)
      .attr(ConsecutiveUseMultiBasePowerAttr, 5, false)
      .soundMove(),
    new AttackMove(MoveId.CHIP_AWAY, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 5).attr(
      IgnoreOpponentStatStagesAttr,
    ),
    new AttackMove(MoveId.CLEAR_SMOG, ElementType.POISON, MoveCategory.SPECIAL, 50, -1, 15, -1, 0, 5).attr(
      ResetStatsAttr,
      false,
    ),
    new AttackMove(MoveId.STORED_POWER, ElementType.PSYCHIC, MoveCategory.SPECIAL, 20, 100, 10, -1, 0, 5).attr(
      PositiveStatStagePowerAttr,
    ),
    new StatusMove(MoveId.QUICK_GUARD, ElementType.FIGHTING, -1, 15, -1, 3, 5)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.QUICK_GUARD, { turnCount: 1, failOnOverlap: true, selfSideTarget: true })
      .condition(failIfLastCondition),
    new SelfStatusMove(MoveId.ALLY_SWITCH, ElementType.PSYCHIC, -1, 15, -1, 2, 5).ignoresProtect().unimplemented(),
    new AttackMove(MoveId.SCALD, ElementType.WATER, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 5)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new SelfStatusMove(MoveId.SHELL_SMASH, ElementType.NORMAL, -1, 15, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK, Stat.SPD], 2, true)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true),
    new StatusMove(MoveId.HEAL_PULSE, ElementType.PSYCHIC, -1, 10, -1, 0, 5)
      .attr(HealAttr, 0.5, false, false)
      .pulseMove()
      .triageMove(),
    new AttackMove(MoveId.HEX, ElementType.GHOST, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 5).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) => (target.status || target.hasAbility(Abilities.COMATOSE) ? 2 : 1),
    ),
    new ChargingAttackMove(MoveId.SKY_DROP, ElementType.FLYING, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 5)
      .chargeText(i18next.t("moveTriggers:tookTargetIntoSky", { pokemonName: "{USER}", targetName: "{TARGET}" }))
      .chargeAttr(SkyDropAttr)
      .attr(NoDamageAgainstFlyingAttr)
      .attr(BypassRedirectAttr)
      .doesHitCheckOnCharge()
      .ignoresVirtual(),
    new SelfStatusMove(MoveId.SHIFT_GEAR, ElementType.STEEL, -1, 10, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true),
    new AttackMove(MoveId.CIRCLE_THROW, ElementType.FIGHTING, MoveCategory.PHYSICAL, 60, 90, 10, -1, -6, 5)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .hidesTarget(),
    new AttackMove(MoveId.INCINERATE, ElementType.FIRE, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 5)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(RemoveHeldItemAttr, true),
    new StatusMove(MoveId.QUASH, ElementType.DARK, 100, 15, -1, 0, 5).condition(failIfSingleBattle).unimplemented(),
    new AttackMove(MoveId.ACROBATICS, ElementType.FLYING, MoveCategory.PHYSICAL, 55, 100, 15, -1, 0, 5).attr(
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
    new StatusMove(MoveId.REFLECT_TYPE, ElementType.NORMAL, -1, 15, -1, 0, 5).ignoresSubstitute().attr(CopyTypeAttr),
    new AttackMove(MoveId.RETALIATE, ElementType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 5, -1, 0, 5).attr(
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
    new AttackMove(MoveId.FINAL_GAMBIT, ElementType.FIGHTING, MoveCategory.SPECIAL, -1, 100, 5, -1, 0, 5)
      .attr(UserHpDamageAttr)
      .attr(SacrificialAttr, true),
    new StatusMove(MoveId.BESTOW, ElementType.NORMAL, -1, 15, -1, 0, 5)
      .ignoresProtect()
      .ignoresSubstitute()
      .unimplemented(),
    new AttackMove(MoveId.INFERNO, ElementType.FIRE, MoveCategory.SPECIAL, 100, 50, 5, 100, 0, 5).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(MoveId.WATER_PLEDGE, ElementType.WATER, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.WATER_FIRE_PLEDGE, MoveId.FIRE_PLEDGE, true)
      .attr(AddPledgeEffectAttr, ArenaTagType.GRASS_WATER_PLEDGE, MoveId.GRASS_PLEDGE)
      .attr(BypassRedirectAttr, true),
    new AttackMove(MoveId.FIRE_PLEDGE, ElementType.FIRE, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.FIRE_GRASS_PLEDGE, MoveId.GRASS_PLEDGE)
      .attr(AddPledgeEffectAttr, ArenaTagType.WATER_FIRE_PLEDGE, MoveId.WATER_PLEDGE, true)
      .attr(BypassRedirectAttr, true),
    new AttackMove(MoveId.GRASS_PLEDGE, ElementType.GRASS, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.GRASS_WATER_PLEDGE, MoveId.WATER_PLEDGE)
      .attr(AddPledgeEffectAttr, ArenaTagType.FIRE_GRASS_PLEDGE, MoveId.FIRE_PLEDGE)
      .attr(BypassRedirectAttr, true),
    new AttackMove(MoveId.VOLT_SWITCH, ElementType.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 20, -1, 0, 5).attr(
      ForceSwitchOutAttr,
      true,
    ),
    new AttackMove(MoveId.STRUGGLE_BUG, ElementType.BUG, MoveCategory.SPECIAL, 50, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BULLDOZE, ElementType.GROUND, MoveCategory.PHYSICAL, 60, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.GRASSY && target.isGrounded() ? 0.5 : 1,
      )
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FROST_BREATH, ElementType.ICE, MoveCategory.SPECIAL, 60, 90, 10, -1, 0, 5).attr(CritOnlyAttr),
    new AttackMove(MoveId.DRAGON_TAIL, ElementType.DRAGON, MoveCategory.PHYSICAL, 60, 90, 10, -1, -6, 5)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .hidesTarget(),
    new SelfStatusMove(MoveId.WORK_UP, ElementType.NORMAL, -1, 30, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.SPATK],
      1,
      true,
    ),
    new AttackMove(MoveId.ELECTROWEB, ElementType.ELECTRIC, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.WILD_CHARGE, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 5)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.DRILL_RUN, ElementType.GROUND, MoveCategory.PHYSICAL, 80, 95, 10, -1, 0, 5).attr(
      HighCritAttr,
    ),
    new AttackMove(MoveId.DUAL_CHOP, ElementType.DRAGON, MoveCategory.PHYSICAL, 40, 90, 15, -1, 0, 5).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(MoveId.HEART_STAMP, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 60, 100, 25, 30, 0, 5).attr(
      FlinchAttr,
    ),
    new AttackMove(MoveId.HORN_LEECH, ElementType.GRASS, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 5)
      .attr(HitHealAttr)
      .triageMove(),
    new AttackMove(MoveId.SACRED_SWORD, ElementType.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 5)
      .attr(IgnoreOpponentStatStagesAttr)
      .slicingMove(),
    new AttackMove(MoveId.RAZOR_SHELL, ElementType.WATER, MoveCategory.PHYSICAL, 75, 95, 10, 50, 0, 5)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .slicingMove(),
    new AttackMove(MoveId.HEAT_CRASH, ElementType.FIRE, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 5)
      .condition(failOnMaxCondition)
      .attr(AlwaysHitMinimizeAttr)
      .attr(CompareWeightPowerAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED),
    new AttackMove(MoveId.LEAF_TORNADO, ElementType.GRASS, MoveCategory.SPECIAL, 65, 90, 10, 50, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(MoveId.STEAMROLLER, ElementType.BUG, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 5)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new SelfStatusMove(MoveId.COTTON_GUARD, ElementType.GRASS, -1, 10, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      3,
      true,
    ),
    new AttackMove(MoveId.NIGHT_DAZE, ElementType.DARK, MoveCategory.SPECIAL, 85, 95, 10, 40, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.ACC],
      -1,
    ),
    new AttackMove(MoveId.PSYSTRIKE, ElementType.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 5).attr(
      DealsPhysicalDamageAttr,
    ),
    new AttackMove(MoveId.TAIL_SLAP, ElementType.NORMAL, MoveCategory.PHYSICAL, 25, 85, 10, -1, 0, 5).attr(
      MultiHitAttr,
    ),
    new AttackMove(MoveId.HURRICANE, ElementType.FLYING, MoveCategory.SPECIAL, 110, 70, 10, 30, 0, 5)
      .attr(ThunderAccuracyAttr)
      .attr(ConfuseAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .windMove(),
    new AttackMove(MoveId.HEAD_CHARGE, ElementType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 5)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.GEAR_GRIND, ElementType.STEEL, MoveCategory.PHYSICAL, 50, 85, 15, -1, 0, 5).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(MoveId.SEARING_SHOT, ElementType.FIRE, MoveCategory.SPECIAL, 100, 100, 5, 30, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .bulletMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.TECHNO_BLAST, ElementType.NORMAL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 5).attr(
      TechnoBlastTypeAttr,
    ),
    new AttackMove(MoveId.RELIC_SONG, ElementType.NORMAL, MoveCategory.SPECIAL, 75, 100, 10, 10, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SECRET_SWORD, ElementType.FIGHTING, MoveCategory.SPECIAL, 85, 100, 10, -1, 0, 5)
      .attr(DealsPhysicalDamageAttr)
      .slicingMove(),
    new AttackMove(MoveId.GLACIATE, ElementType.ICE, MoveCategory.SPECIAL, 65, 95, 10, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BOLT_STRIKE, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 130, 85, 5, 20, 0, 5).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(MoveId.BLUE_FLARE, ElementType.FIRE, MoveCategory.SPECIAL, 130, 85, 5, 20, 0, 5).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(MoveId.FIERY_DANCE, ElementType.FIRE, MoveCategory.SPECIAL, 80, 100, 10, 50, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .danceMove(),
    new ChargingAttackMove(MoveId.FREEZE_SHOCK, ElementType.ICE, MoveCategory.PHYSICAL, 140, 90, 5, 30, 0, 5)
      .chargeText(i18next.t("moveTriggers:becameCloakedInFreezingLight", { pokemonName: "{USER}" }))
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .makesContact(false),
    new ChargingAttackMove(MoveId.ICE_BURN, ElementType.ICE, MoveCategory.SPECIAL, 140, 90, 5, 30, 0, 5)
      .chargeText(i18next.t("moveTriggers:becameCloakedInFreezingAir", { pokemonName: "{USER}" }))
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .ignoresVirtual(),
    new AttackMove(MoveId.SNARL, ElementType.DARK, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.ICICLE_CRASH, ElementType.ICE, MoveCategory.PHYSICAL, 85, 90, 10, 30, 0, 5)
      .attr(FlinchAttr)
      .makesContact(false),
    new AttackMove(MoveId.V_CREATE, ElementType.FIRE, MoveCategory.PHYSICAL, 180, 95, 5, -1, 0, 5).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF, Stat.SPD],
      -1,
      true,
    ),
    new AttackMove(MoveId.FUSION_FLARE, ElementType.FIRE, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 5)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(LastMoveDoublePowerAttr, MoveId.FUSION_BOLT),
    new AttackMove(MoveId.FUSION_BOLT, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 5)
      .attr(LastMoveDoublePowerAttr, MoveId.FUSION_FLARE)
      .makesContact(false),
    new AttackMove(MoveId.FLYING_PRESS, ElementType.FIGHTING, MoveCategory.PHYSICAL, 100, 95, 10, -1, 0, 6)
      .attr(AlwaysHitMinimizeAttr)
      .attr(FlyingTypeMultiplierAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .condition(failOnGravityCondition),
    new StatusMove(MoveId.MAT_BLOCK, ElementType.FIGHTING, -1, 10, -1, 0, 6)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.MAT_BLOCK, { turnCount: 1, failOnOverlap: true, selfSideTarget: true })
      .condition(new FirstMoveCondition())
      .condition(failIfLastCondition),
    new AttackMove(MoveId.BELCH, ElementType.POISON, MoveCategory.SPECIAL, 120, 90, 10, -1, 0, 6).condition(
      (user, _target, _move) => user.battleData.berriesEaten.length > 0,
    ),
    new StatusMove(MoveId.ROTOTILLER, ElementType.GROUND, -1, 10, -1, 0, 6)
      .target(MoveTarget.ALL)
      .condition((_user, _target, _move) => {
        // If any fielded pokémon is grass-type and grounded.
        return [...globalScene.getEnemyParty(), ...globalScene.getPlayerParty()].some(
          (poke) => poke.isOfType(ElementType.GRASS) && poke.isGrounded(),
        );
      })
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 1, false, {
        condition: (_user, target, _move) => target.isOfType(ElementType.GRASS) && target.isGrounded(),
      }),
    new StatusMove(MoveId.STICKY_WEB, ElementType.BUG, -1, 20, -1, 0, 6)
      .attr(AddArenaTrapTagAttr, ArenaTagType.STICKY_WEB)
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(MoveId.FELL_STINGER, ElementType.BUG, MoveCategory.PHYSICAL, 50, 100, 25, -1, 0, 6).attr(
      PostVictoryStatStageChangeAttr,
      [Stat.ATK],
      3,
      true,
    ),
    new ChargingAttackMove(MoveId.PHANTOM_FORCE, ElementType.GHOST, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .chargeText(i18next.t("moveTriggers:vanishedInstantly", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.HIDDEN)
      .ignoresProtect()
      .ignoresVirtual(),
    new StatusMove(MoveId.TRICK_OR_TREAT, ElementType.GHOST, 100, 20, -1, 0, 6).attr(AddTypeAttr, ElementType.GHOST),
    new StatusMove(MoveId.NOBLE_ROAR, ElementType.NORMAL, 100, 30, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1)
      .soundMove(),
    new StatusMove(MoveId.ION_DELUGE, ElementType.ELECTRIC, -1, 25, -1, 1, 6)
      .attr(AddArenaTagAttr, ArenaTagType.ION_DELUGE, { turnCount: 1 })
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.PARABOLIC_CHARGE, ElementType.ELECTRIC, MoveCategory.SPECIAL, 65, 100, 20, -1, 0, 6)
      .attr(HitHealAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .triageMove(),
    new StatusMove(MoveId.FORESTS_CURSE, ElementType.GRASS, 100, 20, -1, 0, 6).attr(AddTypeAttr, ElementType.GRASS),
    new AttackMove(MoveId.PETAL_BLIZZARD, ElementType.GRASS, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 6)
      .windMove()
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FREEZE_DRY, ElementType.ICE, MoveCategory.SPECIAL, 70, 100, 20, 10, 0, 6)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .attr(FreezeDryAttr),
    new AttackMove(MoveId.DISARMING_VOICE, ElementType.FAIRY, MoveCategory.SPECIAL, 40, -1, 15, -1, 0, 6)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.PARTING_SHOT, ElementType.DARK, 100, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1, false, { trigger: MoveEffectTrigger.PRE_APPLY })
      .attr(ForceSwitchOutAttr, true)
      .soundMove(),
    new StatusMove(MoveId.TOPSY_TURVY, ElementType.DARK, -1, 20, -1, 0, 6).attr(InvertStatsAttr),
    new AttackMove(MoveId.DRAINING_KISS, ElementType.FAIRY, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 6)
      .attr(HitHealAttr, 0.75)
      .makesContact()
      .triageMove(),
    new StatusMove(MoveId.CRAFTY_SHIELD, ElementType.FAIRY, -1, 10, -1, 3, 6)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.CRAFTY_SHIELD, { turnCount: 1, failOnOverlap: true, selfSideTarget: true })
      .condition(failIfLastCondition),
    new StatusMove(MoveId.FLOWER_SHIELD, ElementType.FAIRY, -1, 10, -1, 0, 6)
      .target(MoveTarget.ALL)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, false, {
        condition: (_user, target, _move) =>
          target.getTypes().includes(ElementType.GRASS) && !target.getTag(SemiInvulnerableTag),
      }),
    new StatusMove(MoveId.GRASSY_TERRAIN, ElementType.GRASS, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.GRASSY)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.MISTY_TERRAIN, ElementType.FAIRY, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.MISTY)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.ELECTRIFY, ElementType.ELECTRIC, -1, 20, -1, 0, 6).attr(
      AddBattlerTagAttr,
      BattlerTagType.ELECTRIFIED,
      false,
      { failOnOverlap: true },
    ),
    new AttackMove(MoveId.PLAY_ROUGH, ElementType.FAIRY, MoveCategory.PHYSICAL, 90, 90, 10, 10, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(MoveId.FAIRY_WIND, ElementType.FAIRY, MoveCategory.SPECIAL, 40, 100, 30, -1, 0, 6).windMove(),
    new AttackMove(MoveId.MOONBLAST, ElementType.FAIRY, MoveCategory.SPECIAL, 95, 100, 15, 30, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new AttackMove(MoveId.BOOMBURST, ElementType.NORMAL, MoveCategory.SPECIAL, 140, 100, 10, -1, 0, 6)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new StatusMove(MoveId.FAIRY_LOCK, ElementType.FAIRY, -1, 10, -1, 0, 6)
      .ignoresSubstitute()
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .attr(AddArenaTagAttr, ArenaTagType.FAIRY_LOCK, { turnCount: 2, failOnOverlap: true }),
    new SelfStatusMove(MoveId.KINGS_SHIELD, ElementType.STEEL, -1, 10, -1, 4, 6)
      .attr(ProtectAttr, BattlerTagType.KINGS_SHIELD)
      .condition(failIfLastCondition),
    new StatusMove(MoveId.PLAY_NICE, ElementType.NORMAL, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .ignoresSubstitute(),
    new StatusMove(MoveId.CONFIDE, ElementType.NORMAL, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .soundMove(),
    new AttackMove(MoveId.DIAMOND_STORM, ElementType.ROCK, MoveCategory.PHYSICAL, 100, 95, 5, 50, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true, { firstTargetOnly: true })
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.STEAM_ERUPTION, ElementType.WATER, MoveCategory.SPECIAL, 110, 95, 5, 30, 0, 6)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.HYPERSPACE_HOLE, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, -1, 5, -1, 0, 6)
      .ignoresProtect()
      .ignoresSubstitute(),
    new AttackMove(MoveId.WATER_SHURIKEN, ElementType.WATER, MoveCategory.SPECIAL, 15, 100, 20, -1, 1, 6)
      .attr(MultiHitAttr)
      .attr(WaterShurikenPowerAttr)
      .attr(WaterShurikenMultiHitTypeAttr),
    new AttackMove(MoveId.MYSTICAL_FIRE, ElementType.FIRE, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new SelfStatusMove(MoveId.SPIKY_SHIELD, ElementType.GRASS, -1, 10, -1, 4, 6)
      .attr(ProtectAttr, BattlerTagType.SPIKY_SHIELD)
      .condition(failIfLastCondition),
    new StatusMove(MoveId.AROMATIC_MIST, ElementType.FAIRY, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPDEF], 1)
      .ignoresSubstitute()
      .condition(failIfSingleBattle)
      .target(MoveTarget.NEAR_ALLY),
    new StatusMove(MoveId.EERIE_IMPULSE, ElementType.ELECTRIC, 100, 15, -1, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
    ),
    new StatusMove(MoveId.VENOM_DRENCH, ElementType.POISON, 100, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK, Stat.SPD], -1, false, {
        condition: (_user, target, _move) =>
          target.status?.effect === StatusEffect.POISON || target.status?.effect === StatusEffect.TOXIC,
      })
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.POWDER, ElementType.BUG, 100, 20, -1, 1, 6)
      .attr(AddBattlerTagAttr, BattlerTagType.POWDER, false, { failOnOverlap: true })
      .ignoresSubstitute()
      .powderMove(),
    new ChargingSelfStatusMove(MoveId.GEOMANCY, ElementType.FAIRY, -1, 10, -1, 0, 6)
      .chargeText(i18next.t("moveTriggers:isChargingPower", { pokemonName: "{USER}" }))
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF, Stat.SPD], 2, true)
      .ignoresVirtual(),
    new StatusMove(MoveId.MAGNETIC_FLUX, ElementType.ELECTRIC, -1, 20, -1, 0, 6)
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
    new StatusMove(MoveId.HAPPY_HOUR, ElementType.NORMAL, -1, 30, -1, 0, 6) // No animation
      .attr(AddArenaTagAttr, ArenaTagType.HAPPY_HOUR, { failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    new StatusMove(MoveId.ELECTRIC_TERRAIN, ElementType.ELECTRIC, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.ELECTRIC)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.DAZZLING_GLEAM, ElementType.FAIRY, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 6).target(
      MoveTarget.ALL_NEAR_ENEMIES,
    ),
    new SelfStatusMove(MoveId.CELEBRATE, ElementType.NORMAL, -1, 40, -1, 0, 6),
    new StatusMove(MoveId.HOLD_HANDS, ElementType.NORMAL, -1, 40, -1, 0, 6)
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_ALLY),
    new StatusMove(MoveId.BABY_DOLL_EYES, ElementType.FAIRY, 100, 30, -1, 1, 6).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(MoveId.NUZZLE, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 20, 100, 20, 100, 0, 6).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(MoveId.HOLD_BACK, ElementType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 6).attr(
      SurviveDamageAttr,
    ),
    new AttackMove(MoveId.INFESTATION, ElementType.BUG, MoveCategory.SPECIAL, 20, 100, 20, -1, 0, 6)
      .makesContact()
      .attr(TrapAttr, BattlerTagType.INFESTATION),
    new AttackMove(MoveId.POWER_UP_PUNCH, ElementType.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 20, 100, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .punchingMove(),
    new AttackMove(MoveId.OBLIVION_WING, ElementType.FLYING, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 6)
      .attr(HitHealAttr, 0.75)
      .triageMove(),
    new AttackMove(MoveId.THOUSAND_ARROWS, ElementType.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .attr(NeutralDamageAgainstFlyingTypeMultiplierAttr)
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, false, { lastHitOnly: true })
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.FLOATING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .attr(AddBattlerTagAttr, BattlerTagType.INTERRUPTED)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLYING, BattlerTagType.FLOATING, BattlerTagType.TELEKINESIS])
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .edgeCase(), // Should hit a Pokemon lifted up by Sky Drop without permanently grounding it
    new AttackMove(MoveId.THOUSAND_WAVES, ElementType.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { lastHitOnly: true })
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.LANDS_WRATH, ElementType.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.LIGHT_OF_RUIN, ElementType.FAIRY, MoveCategory.SPECIAL, 140, 90, 5, -1, 0, 6)
      .attr(RecoilAttr, false, 0.5)
      .recklessMove(),
    new AttackMove(MoveId.ORIGIN_PULSE, ElementType.WATER, MoveCategory.SPECIAL, 110, 85, 10, -1, 0, 6)
      .pulseMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.PRECIPICE_BLADES, ElementType.GROUND, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 6)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DRAGON_ASCENT, ElementType.FLYING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 6).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      -1,
      true,
    ),
    new AttackMove(MoveId.HYPERSPACE_FURY, ElementType.DARK, MoveCategory.PHYSICAL, 100, -1, 5, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true)
      .ignoresSubstitute()
      .makesContact(false)
      .ignoresProtect(),
    /* Unused */
    new AttackMove(MoveId.BREAKNECK_BLITZ__PHYSICAL, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.BREAKNECK_BLITZ__SPECIAL, ElementType.NORMAL, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.ALL_OUT_PUMMELING__PHYSICAL, ElementType.FIGHTING, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.ALL_OUT_PUMMELING__SPECIAL, ElementType.FIGHTING, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(
      MoveId.SUPERSONIC_SKYSTRIKE__PHYSICAL,
      ElementType.FLYING,
      MoveCategory.PHYSICAL,
      -1,
      -1,
      1,
      -1,
      0,
      7,
    )
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SUPERSONIC_SKYSTRIKE__SPECIAL, ElementType.FLYING, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.ACID_DOWNPOUR__PHYSICAL, ElementType.POISON, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.ACID_DOWNPOUR__SPECIAL, ElementType.POISON, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.TECTONIC_RAGE__PHYSICAL, ElementType.GROUND, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.TECTONIC_RAGE__SPECIAL, ElementType.GROUND, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.CONTINENTAL_CRUSH__PHYSICAL, ElementType.ROCK, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.CONTINENTAL_CRUSH__SPECIAL, ElementType.ROCK, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SAVAGE_SPIN_OUT__PHYSICAL, ElementType.BUG, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SAVAGE_SPIN_OUT__SPECIAL, ElementType.BUG, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(
      MoveId.NEVER_ENDING_NIGHTMARE__PHYSICAL,
      ElementType.GHOST,
      MoveCategory.PHYSICAL,
      -1,
      -1,
      1,
      -1,
      0,
      7,
    )
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.NEVER_ENDING_NIGHTMARE__SPECIAL, ElementType.GHOST, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.CORKSCREW_CRASH__PHYSICAL, ElementType.STEEL, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.CORKSCREW_CRASH__SPECIAL, ElementType.STEEL, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.INFERNO_OVERDRIVE__PHYSICAL, ElementType.FIRE, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.INFERNO_OVERDRIVE__SPECIAL, ElementType.FIRE, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.HYDRO_VORTEX__PHYSICAL, ElementType.WATER, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.HYDRO_VORTEX__SPECIAL, ElementType.WATER, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.BLOOM_DOOM__PHYSICAL, ElementType.GRASS, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.BLOOM_DOOM__SPECIAL, ElementType.GRASS, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.GIGAVOLT_HAVOC__PHYSICAL, ElementType.ELECTRIC, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.GIGAVOLT_HAVOC__SPECIAL, ElementType.ELECTRIC, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SHATTERED_PSYCHE__PHYSICAL, ElementType.PSYCHIC, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SHATTERED_PSYCHE__SPECIAL, ElementType.PSYCHIC, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SUBZERO_SLAMMER__PHYSICAL, ElementType.ICE, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SUBZERO_SLAMMER__SPECIAL, ElementType.ICE, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.DEVASTATING_DRAKE__PHYSICAL, ElementType.DRAGON, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.DEVASTATING_DRAKE__SPECIAL, ElementType.DRAGON, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.BLACK_HOLE_ECLIPSE__PHYSICAL, ElementType.DARK, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.BLACK_HOLE_ECLIPSE__SPECIAL, ElementType.DARK, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.TWINKLE_TACKLE__PHYSICAL, ElementType.FAIRY, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.TWINKLE_TACKLE__SPECIAL, ElementType.FAIRY, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.CATASTROPIKA, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 210, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    /* End Unused */
    new SelfStatusMove(MoveId.SHORE_UP, ElementType.GROUND, -1, 5, -1, 0, 7).attr(SandHealAttr).triageMove(),
    new AttackMove(MoveId.FIRST_IMPRESSION, ElementType.BUG, MoveCategory.PHYSICAL, 90, 100, 10, -1, 2, 7).condition(
      new FirstMoveCondition(),
    ),
    new SelfStatusMove(MoveId.BANEFUL_BUNKER, ElementType.POISON, -1, 10, -1, 4, 7)
      .attr(ProtectAttr, BattlerTagType.BANEFUL_BUNKER)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.SPIRIT_SHACKLE, ElementType.GHOST, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { lastHitOnly: true })
      .makesContact(false),
    new AttackMove(MoveId.DARKEST_LARIAT, ElementType.DARK, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 7).attr(
      IgnoreOpponentStatStagesAttr,
    ),
    new AttackMove(MoveId.SPARKLING_ARIA, ElementType.WATER, MoveCategory.SPECIAL, 90, 100, 10, 100, 0, 7)
      .attr(HealStatusEffectAttr, false, StatusEffect.BURN)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.ICE_HAMMER, ElementType.ICE, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.SPD], -1, true)
      .punchingMove(),
    new StatusMove(MoveId.FLORAL_HEALING, ElementType.FAIRY, -1, 10, -1, 0, 7)
      .attr(
        BoostHealAttr,
        0.5,
        2 / 3,
        true,
        false,
        (_user, _target, _move) => globalScene.arena.terrain?.terrainType === TerrainType.GRASSY,
      )
      .triageMove(),
    new AttackMove(MoveId.HIGH_HORSEPOWER, ElementType.GROUND, MoveCategory.PHYSICAL, 95, 95, 10, -1, 0, 7),
    new StatusMove(MoveId.STRENGTH_SAP, ElementType.GRASS, 100, 10, -1, 0, 7)
      .attr(HitHealAttr, null, Stat.ATK)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .condition((_user, target, _move) => target.getStatStage(Stat.ATK) > -6)
      .triageMove(),
    new ChargingAttackMove(MoveId.SOLAR_BLADE, ElementType.GRASS, MoveCategory.PHYSICAL, 125, 100, 10, -1, 0, 7)
      .chargeText(i18next.t("moveTriggers:isGlowing", { pokemonName: "{USER}" }))
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.SUNNY, WeatherType.HARSH_SUN])
      .attr(AntiSunlightPowerDecreaseAttr)
      .slicingMove(),
    new AttackMove(MoveId.LEAFAGE, ElementType.GRASS, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 7).makesContact(false),
    new StatusMove(MoveId.SPOTLIGHT, ElementType.NORMAL, -1, 15, -1, 3, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.CENTER_OF_ATTENTION, false)
      .condition(failIfSingleBattle),
    new StatusMove(MoveId.TOXIC_THREAD, ElementType.POISON, 100, 20, -1, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .attr(StatStageChangeAttr, [Stat.SPD], -1),
    new SelfStatusMove(MoveId.LASER_FOCUS, ElementType.NORMAL, -1, 30, -1, 0, 7).attr(
      AddBattlerTagAttr,
      BattlerTagType.ALWAYS_CRIT,
      true,
    ),
    new StatusMove(MoveId.GEAR_UP, ElementType.STEEL, -1, 20, -1, 0, 7)
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
    new AttackMove(MoveId.THROAT_CHOP, ElementType.DARK, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7).attr(
      AddBattlerTagAttr,
      BattlerTagType.THROAT_CHOPPED,
    ),
    new AttackMove(MoveId.POLLEN_PUFF, ElementType.BUG, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 7)
      .attr(StatusCategoryOnAllyAttr)
      .attr(HealOnAllyAttr, 0.5, true, false)
      .bulletMove(),
    new AttackMove(MoveId.ANCHOR_SHOT, ElementType.STEEL, MoveCategory.PHYSICAL, 80, 100, 20, 100, 0, 7).attr(
      AddBattlerTagAttr,
      BattlerTagType.TRAPPED,
      false,
      { lastHitOnly: true },
    ),
    new StatusMove(MoveId.PSYCHIC_TERRAIN, ElementType.PSYCHIC, -1, 10, -1, 0, 7)
      .attr(TerrainChangeAttr, TerrainType.PSYCHIC)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.LUNGE, ElementType.BUG, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(MoveId.FIRE_LASH, ElementType.FIRE, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(MoveId.POWER_TRIP, ElementType.DARK, MoveCategory.PHYSICAL, 20, 100, 10, -1, 0, 7).attr(
      PositiveStatStagePowerAttr,
    ),
    new AttackMove(MoveId.BURN_UP, ElementType.FIRE, MoveCategory.SPECIAL, 130, 100, 5, -1, 0, 7)
      .condition((user) => {
        const userTypes = user.getTypes(true);
        return userTypes.includes(ElementType.FIRE);
      })
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(AddBattlerTagAttr, BattlerTagType.BURNED_UP, true)
      .attr(RemoveTypeAttr, ElementType.FIRE, (user) => {
        globalScene.queueMessage(
          i18next.t("moveTriggers:burnedItselfOut", { pokemonName: getPokemonNameWithAffix(user) }),
        );
      }),
    new StatusMove(MoveId.SPEED_SWAP, ElementType.PSYCHIC, -1, 10, -1, 0, 7)
      .attr(SwapStatAttr, Stat.SPD)
      .ignoresSubstitute(),
    new AttackMove(MoveId.SMART_STRIKE, ElementType.STEEL, MoveCategory.PHYSICAL, 70, -1, 10, -1, 0, 7),
    new StatusMove(MoveId.PURIFY, ElementType.POISON, -1, 20, -1, 0, 7)
      .condition((_user, target, _move) => {
        if (!target.status) {
          return false;
        }
        return isNonVolatileStatusEffect(target.status.effect);
      })
      .attr(HealAttr, 0.5)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .triageMove(),
    new AttackMove(MoveId.REVELATION_DANCE, ElementType.NORMAL, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 7)
      .danceMove()
      .attr(MatchUserTypeAttr),
    new AttackMove(MoveId.CORE_ENFORCER, ElementType.DRAGON, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 7)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(SuppressAbilitiesIfActedAttr),
    new AttackMove(MoveId.TROP_KICK, ElementType.GRASS, MoveCategory.PHYSICAL, 70, 100, 15, 100, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new StatusMove(MoveId.INSTRUCT, ElementType.PSYCHIC, -1, 15, -1, 0, 7)
      .ignoresSubstitute()
      .attr(RepeatMoveAttr)
      .edgeCase(), // incorrect interactions with Gigaton Hammer, Blood Moon & Torment
    new AttackMove(MoveId.BEAK_BLAST, ElementType.FLYING, MoveCategory.PHYSICAL, 100, 100, 15, -1, -3, 7)
      .attr(BeakBlastHeaderAttr)
      .bulletMove()
      .makesContact(false),
    new AttackMove(MoveId.CLANGING_SCALES, ElementType.DRAGON, MoveCategory.SPECIAL, 110, 100, 5, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true, { firstTargetOnly: true })
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DRAGON_HAMMER, ElementType.DRAGON, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 7),
    new AttackMove(MoveId.BRUTAL_SWING, ElementType.DARK, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 7).target(
      MoveTarget.ALL_NEAR_OTHERS,
    ),
    new StatusMove(MoveId.AURORA_VEIL, ElementType.ICE, -1, 20, -1, 0, 7)
      .condition(
        (_user, _target, _move) =>
          (globalScene.arena.weather?.weatherType === WeatherType.HAIL
            || globalScene.arena.weather?.weatherType === WeatherType.SNOW)
          && !globalScene.arena.weather?.isEffectSuppressed(),
      )
      .attr(AddArenaTagAttr, ArenaTagType.AURORA_VEIL, { turnCount: 5, failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    /* Unused */
    new AttackMove(MoveId.SINISTER_ARROW_RAID, ElementType.GHOST, MoveCategory.PHYSICAL, 180, -1, 1, -1, 0, 7)
      .makesContact(false)
      .unimplemented()
      .edgeCase() // I assume it's because the user needs spirit shackle and decidueye
      .ignoresVirtual(),
    new AttackMove(MoveId.MALICIOUS_MOONSAULT, ElementType.DARK, MoveCategory.PHYSICAL, 180, -1, 1, -1, 0, 7)
      .attr(AlwaysHitMinimizeAttr)
      .unimplemented()
      .attr(HitsTagAttr, BattlerTagType.MINIMIZED, true)
      .edgeCase() // I assume it's because it needs darkest lariat and incineroar
      .ignoresVirtual(),
    new AttackMove(MoveId.OCEANIC_OPERETTA, ElementType.WATER, MoveCategory.SPECIAL, 195, -1, 1, -1, 0, 7)
      .edgeCase() // I assume it's because it needs sparkling aria and primarina
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.GUARDIAN_OF_ALOLA, ElementType.FAIRY, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SOUL_STEALING_7_STAR_STRIKE, ElementType.GHOST, MoveCategory.PHYSICAL, 195, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.STOKED_SPARKSURFER, ElementType.ELECTRIC, MoveCategory.SPECIAL, 175, -1, 1, 100, 0, 7)
      .unimplemented()
      .edgeCase() // I assume it's because it needs thunderbolt and Alola Raichu
      .ignoresVirtual(),
    new AttackMove(MoveId.PULVERIZING_PANCAKE, ElementType.NORMAL, MoveCategory.PHYSICAL, 210, -1, 1, -1, 0, 7)
      .edgeCase() // I assume it's because it needs giga impact and snorlax
      .unimplemented()
      .ignoresVirtual(),
    new SelfStatusMove(MoveId.EXTREME_EVOBOOST, ElementType.NORMAL, -1, 1, -1, 0, 7)
      .unimplemented()
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 2, true)
      .ignoresVirtual(),
    new AttackMove(MoveId.GENESIS_SUPERNOVA, ElementType.PSYCHIC, MoveCategory.SPECIAL, 185, -1, 1, 100, 0, 7)
      .unimplemented()
      .attr(TerrainChangeAttr, TerrainType.PSYCHIC)
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(MoveId.SHELL_TRAP, ElementType.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, -3, 7)
      .attr(AddBattlerTagHeaderAttr, BattlerTagType.SHELL_TRAP)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      // Fails if the user was not hit by a physical attack during the turn
      .condition((user, _target, _move) => user.getTag(ShellTrapTag)?.activated === true),
    new AttackMove(MoveId.FLEUR_CANNON, ElementType.FAIRY, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -2,
      true,
    ),
    new AttackMove(MoveId.PSYCHIC_FANGS, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 7)
      .bitingMove()
      .attr(RemoveScreensAttr),
    new AttackMove(MoveId.STOMPING_TANTRUM, ElementType.GROUND, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 7).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) =>
        user.getLastXMoves(2)[1]?.result === MoveResult.MISS || user.getLastXMoves(2)[1]?.result === MoveResult.FAIL
          ? 2
          : 1,
    ),
    new AttackMove(MoveId.SHADOW_BONE, ElementType.GHOST, MoveCategory.PHYSICAL, 85, 100, 10, 20, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .makesContact(false),
    new AttackMove(MoveId.ACCELEROCK, ElementType.ROCK, MoveCategory.PHYSICAL, 40, 100, 20, -1, 1, 7),
    new AttackMove(MoveId.LIQUIDATION, ElementType.WATER, MoveCategory.PHYSICAL, 85, 100, 10, 20, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(MoveId.PRISMATIC_LASER, ElementType.PSYCHIC, MoveCategory.SPECIAL, 160, 100, 10, -1, 0, 7).attr(
      RechargeAttr,
    ),
    new AttackMove(MoveId.SPECTRAL_THIEF, ElementType.GHOST, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 7)
      .attr(StealPositiveStatsAttr)
      .ignoresSubstitute(),
    new AttackMove(
      MoveId.SUNSTEEL_STRIKE,
      ElementType.STEEL,
      MoveCategory.PHYSICAL,
      100,
      100,
      5,
      -1,
      0,
      7,
    ).ignoresAbilities(),
    new AttackMove(
      MoveId.MOONGEIST_BEAM,
      ElementType.GHOST,
      MoveCategory.SPECIAL,
      100,
      100,
      5,
      -1,
      0,
      7,
    ).ignoresAbilities(),
    new StatusMove(MoveId.TEARFUL_LOOK, ElementType.NORMAL, -1, 20, -1, 0, 7).attr(
      StatStageChangeAttr,
      [Stat.ATK, Stat.SPATK],
      -1,
    ),
    new AttackMove(MoveId.ZING_ZAP, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 80, 100, 10, 30, 0, 7).attr(
      FlinchAttr,
    ),
    new AttackMove(MoveId.NATURES_MADNESS, ElementType.FAIRY, MoveCategory.SPECIAL, -1, 90, 10, -1, 0, 7).attr(
      TargetHalfHpDamageAttr,
    ),
    new AttackMove(MoveId.MULTI_ATTACK, ElementType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 7).attr(
      FormChangeItemTypeAttr,
    ),
    /* Unused */
    new AttackMove(
      MoveId.TEN_MILLION_VOLT_THUNDERBOLT,
      ElementType.ELECTRIC,
      MoveCategory.SPECIAL,
      195,
      -1,
      1,
      -1,
      0,
      7,
    )
      .edgeCase() // I assume it's because it needs thunderbolt and pikachu in a cap
      .unimplemented()
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(MoveId.MIND_BLOWN, ElementType.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 7)
      .condition(failIfDampCondition)
      .attr(HalfSacrificialAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.PLASMA_FISTS, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 100, 100, 15, -1, 0, 7)
      .attr(AddArenaTagAttr, ArenaTagType.ION_DELUGE, { turnCount: 1 })
      .punchingMove(),
    new AttackMove(MoveId.PHOTON_GEYSER, ElementType.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 7)
      .attr(PhotonGeyserCategoryAttr)
      .ignoresAbilities(),
    /* Unused */
    new AttackMove(MoveId.LIGHT_THAT_BURNS_THE_SKY, ElementType.PSYCHIC, MoveCategory.SPECIAL, 200, -1, 1, -1, 0, 7)
      .attr(PhotonGeyserCategoryAttr)
      .unimplemented()
      .ignoresAbilities()
      .ignoresVirtual(),
    new AttackMove(MoveId.SEARING_SUNRAZE_SMASH, ElementType.STEEL, MoveCategory.PHYSICAL, 200, -1, 1, -1, 0, 7)
      .ignoresAbilities()
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MENACING_MOONRAZE_MAELSTROM, ElementType.GHOST, MoveCategory.SPECIAL, 200, -1, 1, -1, 0, 7)
      .ignoresAbilities()
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.LETS_SNUGGLE_FOREVER, ElementType.FAIRY, MoveCategory.PHYSICAL, 190, -1, 1, -1, 0, 7)
      .edgeCase() // I assume it needs play rough and mimikyu
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.SPLINTERED_STORMSHARDS, ElementType.ROCK, MoveCategory.PHYSICAL, 190, -1, 1, -1, 0, 7)
      .attr(ClearTerrainAttr)
      .makesContact(false)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.CLANGOROUS_SOULBLAZE, ElementType.DRAGON, MoveCategory.SPECIAL, 185, -1, 1, 100, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true, {
        firstTargetOnly: true,
      })
      .soundMove()
      .unimplemented()
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .edgeCase() // I assume it needs clanging scales and Kommo-O
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(MoveId.ZIPPY_ZAP, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 50, 100, 15, -1, 2, 7) // LGPE Implementation
      .attr(CritOnlyAttr),
    new AttackMove(MoveId.SPLISHY_SPLASH, ElementType.WATER, MoveCategory.SPECIAL, 90, 100, 15, 30, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.FLOATY_FALL, ElementType.FLYING, MoveCategory.PHYSICAL, 90, 95, 15, 30, 0, 7).attr(
      FlinchAttr,
    ),
    new AttackMove(MoveId.PIKA_PAPOW, ElementType.ELECTRIC, MoveCategory.SPECIAL, -1, -1, 20, -1, 0, 7).attr(
      FriendshipPowerAttr,
    ),
    new AttackMove(MoveId.BOUNCY_BUBBLE, ElementType.WATER, MoveCategory.SPECIAL, 60, 100, 20, -1, 0, 7)
      .attr(HitHealAttr) // Custom
      .triageMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BUZZY_BUZZ, ElementType.ELECTRIC, MoveCategory.SPECIAL, 60, 100, 20, 100, 0, 7).attr(
      StatusEffectAttr,
      StatusEffect.PARALYSIS,
    ),
    new AttackMove(MoveId.SIZZLY_SLIDE, ElementType.FIRE, MoveCategory.PHYSICAL, 60, 100, 20, 100, 0, 7).attr(
      StatusEffectAttr,
      StatusEffect.BURN,
    ),
    new AttackMove(MoveId.GLITZY_GLOW, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, 95, 15, -1, 0, 7).attr(
      AddArenaTagAttr,
      ArenaTagType.LIGHT_SCREEN,
      { turnCount: 5, selfSideTarget: true },
    ),
    new AttackMove(MoveId.BADDY_BAD, ElementType.DARK, MoveCategory.SPECIAL, 80, 95, 15, -1, 0, 7).attr(
      AddArenaTagAttr,
      ArenaTagType.REFLECT,
      { turnCount: 5, selfSideTarget: true },
    ),
    new AttackMove(MoveId.SAPPY_SEED, ElementType.GRASS, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 7)
      .attr(LeechSeedAttr)
      .makesContact(false),
    new AttackMove(MoveId.FREEZY_FROST, ElementType.ICE, MoveCategory.SPECIAL, 100, 90, 10, -1, 0, 7).attr(
      ResetStatsAttr,
      true,
    ),
    new AttackMove(MoveId.SPARKLY_SWIRL, ElementType.FAIRY, MoveCategory.SPECIAL, 120, 85, 5, -1, 0, 7).attr(
      PartyStatusCureAttr,
      null,
      Abilities.NONE,
    ),
    new AttackMove(MoveId.VEEVEE_VOLLEY, ElementType.NORMAL, MoveCategory.PHYSICAL, -1, -1, 20, -1, 0, 7).attr(
      FriendshipPowerAttr,
    ),
    new AttackMove(MoveId.DOUBLE_IRON_BASH, ElementType.STEEL, MoveCategory.PHYSICAL, 60, 100, 5, 30, 0, 7)
      .attr(MultiHitAttr, MultiHitType._2)
      .attr(FlinchAttr)
      .punchingMove(),
    /* Unused */
    new SelfStatusMove(MoveId.MAX_GUARD, ElementType.NORMAL, -1, 10, -1, 4, 8)
      .attr(ProtectAttr)
      .condition(failIfLastCondition)
      .ignoresVirtual(),
    /* End Unused */
    new AttackMove(MoveId.DYNAMAX_CANNON, ElementType.DRAGON, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 8)
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

    new AttackMove(MoveId.SNIPE_SHOT, ElementType.WATER, MoveCategory.SPECIAL, 80, 100, 15, -1, 0, 8)
      .attr(HighCritAttr)
      .attr(BypassRedirectAttr),
    new AttackMove(MoveId.JAW_LOCK, ElementType.DARK, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 8)
      .attr(JawLockAttr)
      .bitingMove(),
    new SelfStatusMove(MoveId.STUFF_CHEEKS, ElementType.NORMAL, -1, 10, -1, 0, 8)
      .attr(EatBerryAttr, true)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true)
      .condition((user) => {
        const userBerries = globalScene.findModifiers((m) => m.isBerryModifier(), user.isPlayer());
        return userBerries.length > 0;
      })
      .edgeCase(), // Stuff Cheeks should not be selectable when the user does not have a berry, see wiki
    new SelfStatusMove(MoveId.NO_RETREAT, ElementType.FIGHTING, -1, 5, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .attr(AddBattlerTagAttr, BattlerTagType.NO_RETREAT, true)
      .condition((user, _target, _move) => user.getTag(TrappedTag)?.sourceMoveId !== MoveId.NO_RETREAT), // fails if the user is currently trapped by No Retreat
    new StatusMove(MoveId.TAR_SHOT, ElementType.ROCK, 100, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .attr(AddBattlerTagAttr, BattlerTagType.TAR_SHOT, false),
    new StatusMove(MoveId.MAGIC_POWDER, ElementType.PSYCHIC, 100, 20, -1, 0, 8)
      .attr(ChangeTypeAttr, ElementType.PSYCHIC)
      .powderMove(),
    new AttackMove(MoveId.DRAGON_DARTS, ElementType.DRAGON, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._2)
      .makesContact(false)
      .target(MoveTarget.DRAGON_DARTS)
      .edgeCase(), // see `dragon_darts.test.ts` for documented edge cases
    new StatusMove(MoveId.TEATIME, ElementType.NORMAL, -1, 10, -1, 0, 8)
      .attr(EatBerryAttr, false)
      .target(MoveTarget.ALL),
    new StatusMove(MoveId.OCTOLOCK, ElementType.FIGHTING, 100, 15, -1, 0, 8)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.OCTOLOCK, false, { failOnOverlap: true }),
    new AttackMove(MoveId.BOLT_BEAK, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 8).attr(
      FirstAttackDoublePowerAttr,
    ),
    new AttackMove(MoveId.FISHIOUS_REND, ElementType.WATER, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 8)
      .attr(FirstAttackDoublePowerAttr)
      .bitingMove(),
    new StatusMove(MoveId.COURT_CHANGE, ElementType.NORMAL, -1, 10, -1, 0, 8)
      .attr(SwapArenaTagsAttr, courtChangeArenaTags)
      .condition((_user, _target, _move) =>
        globalScene.arena.tags.some((arenaTag) => courtChangeArenaTags.includes(arenaTag.tagType)),
      ),
    new AttackMove(MoveId.MAX_FLARE, ElementType.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_FLUTTERBY, ElementType.BUG, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_LIGHTNING, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_STRIKE, ElementType.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_KNUCKLE, ElementType.FIGHTING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_PHANTASM, ElementType.GHOST, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_HAILSTORM, ElementType.ICE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_OOZE, ElementType.POISON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_GEYSER, ElementType.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_AIRSTREAM, ElementType.FLYING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_STARFALL, ElementType.FAIRY, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_WYRMWIND, ElementType.DRAGON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_MINDSTORM, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_ROCKFALL, ElementType.ROCK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_QUAKE, ElementType.GROUND, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_DARKNESS, ElementType.DARK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_OVERGROWTH, ElementType.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    new AttackMove(MoveId.MAX_STEELSPIKE, ElementType.STEEL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented()
      .ignoresVirtual(),
    /* End Unused */
    new SelfStatusMove(MoveId.CLANGOROUS_SOUL, ElementType.DRAGON, 100, 5, -1, 0, 8)
      .attr(CutHpStatStageBoostAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, 3)
      .soundMove()
      .danceMove(),
    new AttackMove(MoveId.BODY_PRESS, ElementType.FIGHTING, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 8).attr(
      DefAtkAttr,
    ),
    new StatusMove(MoveId.DECORATE, ElementType.FAIRY, -1, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 2)
      .ignoresProtect(),
    new AttackMove(MoveId.DRUM_BEATING, ElementType.GRASS, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .makesContact(false),
    new AttackMove(MoveId.SNAP_TRAP, ElementType.GRASS, MoveCategory.PHYSICAL, 35, 100, 15, -1, 0, 8).attr(
      TrapAttr,
      BattlerTagType.SNAP_TRAP,
    ),
    new AttackMove(MoveId.PYRO_BALL, ElementType.FIRE, MoveCategory.PHYSICAL, 120, 90, 5, 10, 0, 8)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .bulletMove()
      .makesContact(false),
    new AttackMove(
      MoveId.BEHEMOTH_BLADE,
      ElementType.STEEL,
      MoveCategory.PHYSICAL,
      100,
      100,
      5,
      -1,
      0,
      8,
    ).slicingMove(),
    new AttackMove(MoveId.BEHEMOTH_BASH, ElementType.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 8),
    new AttackMove(MoveId.AURA_WHEEL, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 110, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .makesContact(false)
      .attr(AuraWheelTypeAttr),
    new AttackMove(MoveId.BREAKING_SWIPE, ElementType.DRAGON, MoveCategory.PHYSICAL, 60, 100, 15, 100, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(MoveId.BRANCH_POKE, ElementType.GRASS, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 8),
    new AttackMove(MoveId.OVERDRIVE, ElementType.ELECTRIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 8)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.APPLE_ACID, ElementType.GRASS, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -1,
    ),
    new AttackMove(MoveId.GRAV_APPLE, ElementType.GRASS, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .attr(MovePowerMultiplierAttr, (_user, _target, _move) =>
        globalScene.arena.getTag(ArenaTagType.GRAVITY) ? 1.5 : 1,
      )
      .makesContact(false),
    new AttackMove(MoveId.SPIRIT_BREAK, ElementType.FAIRY, MoveCategory.PHYSICAL, 75, 100, 15, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new AttackMove(MoveId.STRANGE_STEAM, ElementType.FAIRY, MoveCategory.SPECIAL, 90, 95, 10, 20, 0, 8).attr(
      ConfuseAttr,
    ),
    new StatusMove(MoveId.LIFE_DEW, ElementType.WATER, -1, 10, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .target(MoveTarget.USER_AND_ALLIES)
      .triageMove()
      .ignoresProtect(),
    new SelfStatusMove(MoveId.OBSTRUCT, ElementType.DARK, 100, 10, -1, 4, 8)
      .attr(ProtectAttr, BattlerTagType.OBSTRUCT)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.FALSE_SURRENDER, ElementType.DARK, MoveCategory.PHYSICAL, 80, -1, 10, -1, 0, 8),
    new AttackMove(MoveId.METEOR_ASSAULT, ElementType.FIGHTING, MoveCategory.PHYSICAL, 150, 100, 5, -1, 0, 8)
      .attr(RechargeAttr)
      .makesContact(false),
    new AttackMove(MoveId.ETERNABEAM, ElementType.DRAGON, MoveCategory.SPECIAL, 160, 90, 5, -1, 0, 8).attr(
      RechargeAttr,
    ),
    new AttackMove(MoveId.STEEL_BEAM, ElementType.STEEL, MoveCategory.SPECIAL, 140, 95, 5, -1, 0, 8).attr(
      HalfSacrificialAttr,
    ),
    new AttackMove(MoveId.EXPANDING_FORCE, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 8)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.PSYCHIC && user.isGrounded() ? 1.5 : 1,
      )
      .attr(VariableTargetAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.PSYCHIC && user.isGrounded()
          ? MoveTarget.ALL_NEAR_ENEMIES
          : MoveTarget.NEAR_OTHER,
      ),
    new AttackMove(MoveId.STEEL_ROLLER, ElementType.STEEL, MoveCategory.PHYSICAL, 130, 100, 5, -1, 0, 8)
      .attr(ClearTerrainAttr)
      .condition((_user, _target, _move) => !!globalScene.arena.terrain),
    new AttackMove(MoveId.SCALE_SHOT, ElementType.DRAGON, MoveCategory.PHYSICAL, 25, 90, 20, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true, { lastHitOnly: true })
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true, { lastHitOnly: true })
      .attr(MultiHitAttr)
      .makesContact(false),
    new ChargingAttackMove(MoveId.METEOR_BEAM, ElementType.ROCK, MoveCategory.SPECIAL, 120, 90, 10, -1, 0, 8)
      .chargeText(i18next.t("moveTriggers:isOverflowingWithSpacePower", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .ignoresVirtual(),
    new AttackMove(MoveId.SHELL_SIDE_ARM, ElementType.POISON, MoveCategory.SPECIAL, 90, 100, 10, 20, 0, 8)
      .attr(ShellSideArmCategoryAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.MISTY_EXPLOSION, ElementType.FAIRY, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 8)
      .attr(SacrificialAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.MISTY && user.isGrounded() ? 1.5 : 1,
      )
      .condition(failIfDampCondition)
      .makesContact(false),
    new AttackMove(MoveId.GRASSY_GLIDE, ElementType.GRASS, MoveCategory.PHYSICAL, 55, 100, 20, -1, 0, 8).attr(
      IncrementMovePriorityAttr,
      (user, _target, _move) => globalScene.arena.getTerrainType() === TerrainType.GRASSY && user.isGrounded(),
    ),
    new AttackMove(MoveId.RISING_VOLTAGE, ElementType.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 20, -1, 0, 8).attr(
      MovePowerMultiplierAttr,
      (_user, target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.ELECTRIC && target.isGrounded() ? 2 : 1,
    ),
    new AttackMove(MoveId.TERRAIN_PULSE, ElementType.NORMAL, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 8)
      .attr(TerrainPulseTypeAttr)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() !== TerrainType.NONE && user.isGrounded() ? 2 : 1,
      )
      .pulseMove(),
    new AttackMove(MoveId.SKITTER_SMACK, ElementType.BUG, MoveCategory.PHYSICAL, 70, 90, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      -1,
    ),
    new AttackMove(MoveId.BURNING_JEALOUSY, ElementType.FIRE, MoveCategory.SPECIAL, 70, 100, 5, 100, 0, 8)
      .attr(StatusIfBoostedAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.LASH_OUT, ElementType.DARK, MoveCategory.PHYSICAL, 75, 100, 5, -1, 0, 8).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) => (user.turnData.statStagesDecreased ? 2 : 1),
    ),
    new AttackMove(MoveId.POLTERGEIST, ElementType.GHOST, MoveCategory.PHYSICAL, 110, 90, 5, -1, 0, 8)
      .attr(AttackedByItemAttr)
      .makesContact(false),
    new StatusMove(MoveId.CORROSIVE_GAS, ElementType.POISON, 100, 40, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .unimplemented(),
    new StatusMove(MoveId.COACHING, ElementType.FIGHTING, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF], 1)
      .target(MoveTarget.NEAR_ALLY)
      .condition(failIfSingleBattle),
    new AttackMove(MoveId.FLIP_TURN, ElementType.WATER, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 8).attr(
      ForceSwitchOutAttr,
      true,
    ),
    new AttackMove(MoveId.TRIPLE_AXEL, ElementType.ICE, MoveCategory.PHYSICAL, 20, 90, 10, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(MultiHitPowerIncrementAttr, 3)
      .checkAllHits(),
    new AttackMove(MoveId.DUAL_WINGBEAT, ElementType.FLYING, MoveCategory.PHYSICAL, 40, 90, 10, -1, 0, 8).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(MoveId.SCORCHING_SANDS, ElementType.GROUND, MoveCategory.SPECIAL, 70, 100, 10, 30, 0, 8)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(MoveId.JUNGLE_HEALING, ElementType.GRASS, -1, 10, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .triageMove()
      .target(MoveTarget.USER_AND_ALLIES),
    new AttackMove(MoveId.WICKED_BLOW, ElementType.DARK, MoveCategory.PHYSICAL, 75, 100, 5, -1, 0, 8)
      .attr(CritOnlyAttr)
      .punchingMove(),
    new AttackMove(MoveId.SURGING_STRIKES, ElementType.WATER, MoveCategory.PHYSICAL, 25, 100, 5, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(CritOnlyAttr)
      .punchingMove(),
    new AttackMove(MoveId.THUNDER_CAGE, ElementType.ELECTRIC, MoveCategory.SPECIAL, 80, 90, 15, -1, 0, 8).attr(
      TrapAttr,
      BattlerTagType.THUNDER_CAGE,
    ),
    new AttackMove(MoveId.DRAGON_ENERGY, ElementType.DRAGON, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 8)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.FREEZING_GLARE, ElementType.PSYCHIC, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 8).attr(
      StatusEffectAttr,
      StatusEffect.FREEZE,
    ),
    new AttackMove(MoveId.FIERY_WRATH, ElementType.DARK, MoveCategory.SPECIAL, 90, 100, 10, 20, 0, 8)
      .attr(FlinchAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.THUNDEROUS_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      -1,
    ),
    new AttackMove(MoveId.GLACIAL_LANCE, ElementType.ICE, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .makesContact(false),
    new AttackMove(MoveId.ASTRAL_BARRAGE, ElementType.GHOST, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 8).target(
      MoveTarget.ALL_NEAR_ENEMIES,
    ),
    new AttackMove(MoveId.EERIE_SPELL, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 5, 100, 0, 8)
      .attr(AttackReducePpMoveAttr, 3)
      .soundMove(),
    new AttackMove(MoveId.DIRE_CLAW, ElementType.POISON, MoveCategory.PHYSICAL, 80, 100, 15, 50, 0, 8).attr(
      MultiStatusEffectAttr,
      [StatusEffect.POISON, StatusEffect.PARALYSIS, StatusEffect.SLEEP],
    ),
    new AttackMove(MoveId.PSYSHIELD_BASH, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 70, 90, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      1,
      true,
    ),
    new SelfStatusMove(MoveId.POWER_SHIFT, ElementType.NORMAL, -1, 10, -1, 0, 8)
      .target(MoveTarget.USER)
      .attr(ShiftStatAttr, Stat.ATK, Stat.DEF),
    new AttackMove(MoveId.STONE_AXE, ElementType.ROCK, MoveCategory.PHYSICAL, 65, 90, 15, 100, 0, 8)
      .attr(AddArenaTrapTagAttr, ArenaTagType.STEALTH_ROCK)
      .slicingMove(),
    new AttackMove(MoveId.SPRINGTIDE_STORM, ElementType.FAIRY, MoveCategory.SPECIAL, 100, 80, 5, 30, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.MYSTICAL_POWER, ElementType.PSYCHIC, MoveCategory.SPECIAL, 70, 90, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.SPATK],
      1,
      true,
    ),
    new AttackMove(MoveId.RAGING_FURY, ElementType.FIRE, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 8)
      .makesContact(false)
      .attr(FrenzyAttr)
      .attr(MissEffectAttr, frenzyMissFunc)
      .attr(NoEffectAttr, frenzyMissFunc)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new AttackMove(MoveId.WAVE_CRASH, ElementType.WATER, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 8)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(MoveId.CHLOROBLAST, ElementType.GRASS, MoveCategory.SPECIAL, 150, 95, 5, -1, 0, 8).attr(
      RecoilAttr,
      true,
      0.5,
    ),
    new AttackMove(MoveId.MOUNTAIN_GALE, ElementType.ICE, MoveCategory.PHYSICAL, 100, 85, 10, 30, 0, 8)
      .makesContact(false)
      .attr(FlinchAttr),
    new SelfStatusMove(MoveId.VICTORY_DANCE, ElementType.FIGHTING, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPD], 1, true)
      .danceMove(),
    new AttackMove(MoveId.HEADLONG_RUSH, ElementType.GROUND, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true)
      .makesContact()
      .punchingMove(),
    new AttackMove(MoveId.BARB_BARRAGE, ElementType.POISON, MoveCategory.PHYSICAL, 60, 100, 10, 50, 0, 8)
      .makesContact(false)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.status && (target.status.effect === StatusEffect.POISON || target.status.effect === StatusEffect.TOXIC)
          ? 2
          : 1,
      )
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.ESPER_WING, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 8)
      .attr(HighCritAttr)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true),
    new AttackMove(MoveId.BITTER_MALICE, ElementType.GHOST, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new SelfStatusMove(MoveId.SHELTER, ElementType.STEEL, -1, 10, -1, 0, 8).attr(
      StatStageChangeAttr,
      [Stat.DEF],
      2,
      true,
    ),
    new AttackMove(MoveId.TRIPLE_ARROWS, ElementType.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 10, 30, 0, 8)
      .makesContact(false)
      .attr(HighCritAttr)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, false, { effectChanceOverride: 50 })
      .attr(FlinchAttr),
    new AttackMove(MoveId.INFERNAL_PARADE, ElementType.GHOST, MoveCategory.SPECIAL, 60, 100, 15, 30, 0, 8)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.status ? 2 : 1)),
    new AttackMove(MoveId.CEASELESS_EDGE, ElementType.DARK, MoveCategory.PHYSICAL, 65, 90, 15, 100, 0, 8)
      .attr(AddArenaTrapTagAttr, ArenaTagType.SPIKES)
      .slicingMove(),
    new AttackMove(MoveId.BLEAKWIND_STORM, ElementType.FLYING, MoveCategory.SPECIAL, 100, 80, 10, 30, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.WILDBOLT_STORM, ElementType.ELECTRIC, MoveCategory.SPECIAL, 100, 80, 10, 20, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SANDSEAR_STORM, ElementType.GROUND, MoveCategory.SPECIAL, 100, 80, 10, 20, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.LUNAR_BLESSING, ElementType.PSYCHIC, -1, 5, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .target(MoveTarget.USER_AND_ALLIES)
      .triageMove(),
    new SelfStatusMove(MoveId.TAKE_HEART, ElementType.PSYCHIC, -1, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF], 1, true)
      .attr(HealStatusEffectAttr, true, [
        StatusEffect.PARALYSIS,
        StatusEffect.POISON,
        StatusEffect.TOXIC,
        StatusEffect.BURN,
        StatusEffect.SLEEP,
      ]),
    new AttackMove(MoveId.G_MAX_WILDFIRE, ElementType.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_WILDFIRE),
    new AttackMove(MoveId.G_MAX_BEFUDDLE, ElementType.BUG, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(MultiStatusEffectAttr, [StatusEffect.POISON, StatusEffect.PARALYSIS, StatusEffect.SLEEP]),
    new AttackMove(MoveId.G_MAX_VOLT_CRASH, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.G_MAX_GOLD_RUSH, ElementType.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(ConfuseAttr)
      .attr(MoneyAttr), // should gives 100x user level (20x as effective as payday) as money. Rebalance later
    new AttackMove(MoveId.G_MAX_CHI_STRIKE, ElementType.FIGHTING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddBattlerTagAttr, BattlerTagType.CRIT_BOOST_STACKABLE, true),
    new AttackMove(MoveId.G_MAX_TERROR, ElementType.GHOST, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED),
    new AttackMove(MoveId.G_MAX_RESONANCE, ElementType.ICE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTagAttr, ArenaTagType.AURORA_VEIL, { turnCount: 5, selfSideTarget: true }),
    new AttackMove(MoveId.G_MAX_CUDDLE, ElementType.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddBattlerTagAttr, BattlerTagType.INFATUATED),
    new AttackMove(MoveId.G_MAX_REPLENISH, ElementType.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .partial(), // 50% of replenishing user and ally's berries (like recycle)
    new AttackMove(MoveId.G_MAX_MALODOR, ElementType.POISON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.G_MAX_STONESURGE, ElementType.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTrapTagAttr, ArenaTagType.STEALTH_ROCK),
    new AttackMove(MoveId.G_MAX_WIND_RAGE, ElementType.FLYING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(ClearWeatherAttr, WeatherType.FOG)
      .attr(ClearTerrainAttr)
      .attr(RemoveScreensAttr, false)
      .attr(RemoveArenaTrapAttr, true)
      .attr(RemoveArenaTagsAttr, [ArenaTagType.SAFEGUARD, ArenaTagType.MIST], ArenaTagRelativeSide.TARGET),
    new AttackMove(MoveId.G_MAX_STUN_SHOCK, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(MultiStatusEffectAttr, [StatusEffect.POISON, StatusEffect.PARALYSIS]),
    new AttackMove(MoveId.G_MAX_FINALE, ElementType.FAIRY, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(HealAttr, 1 / 6),
    new AttackMove(MoveId.G_MAX_DEPLETION, ElementType.DRAGON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AttackReducePpMoveAttr, 2),
    new AttackMove(MoveId.G_MAX_GRAVITAS, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTagAttr, ArenaTagType.GRAVITY, { turnCount: 5 }),
    new AttackMove(MoveId.G_MAX_VOLCALITH, ElementType.ROCK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_VOLCALITH),
    new AttackMove(MoveId.G_MAX_SANDBLAST, ElementType.GROUND, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(TrapAttr, BattlerTagType.G_MAX_SAND_TOMB),
    new AttackMove(MoveId.G_MAX_SNOOZE, ElementType.DARK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddBattlerTagAttr, BattlerTagType.DROWSY, false, { effectChanceOverride: 50 })
      .edgeCase(), // The 50% chance incorrectly gets overridden by Shield Dust, Sheer Force, etc.
    new AttackMove(MoveId.G_MAX_TARTNESS, ElementType.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(StatStageChangeAttr, [Stat.EVA], -1),
    new AttackMove(MoveId.G_MAX_SWEETNESS, ElementType.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(HealStatusEffectAttr, true, getNonVolatileStatusEffects()),
    new AttackMove(MoveId.G_MAX_SMITE, ElementType.FAIRY, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(ConfuseAttr),
    new AttackMove(MoveId.G_MAX_STEELSURGE, ElementType.STEEL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTrapTagAttr, ArenaTagType.SHARP_STEEL),
    new AttackMove(MoveId.G_MAX_MELTDOWN, ElementType.STEEL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddBattlerTagAttr, BattlerTagType.TORMENT),
    new AttackMove(MoveId.G_MAX_FOAM_BURST, ElementType.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(StatStageChangeAttr, [Stat.SPD], -2),
    new AttackMove(MoveId.G_MAX_CENTIFERNO, ElementType.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(TrapAttr, BattlerTagType.G_MAX_FIRE_SPIN),
    new AttackMove(MoveId.G_MAX_VINE_LASH, ElementType.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_VINE_LASH),
    new AttackMove(MoveId.G_MAX_CANNONADE, ElementType.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_CANNONADE),
    new AttackMove(MoveId.G_MAX_DRUM_SOLO, ElementType.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .ignoresAbilities(),
    new AttackMove(MoveId.G_MAX_FIREBALL, ElementType.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .ignoresAbilities(),
    new AttackMove(MoveId.G_MAX_HYDROSNIPE, ElementType.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .ignoresAbilities(),
    new AttackMove(MoveId.G_MAX_ONE_BLOW, ElementType.DARK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .ignoresProtect(),
    new AttackMove(MoveId.G_MAX_RAPID_FLOW, ElementType.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .gMaxMove()
      .ignoresProtect(),
    new AttackMove(MoveId.TERA_BLAST, ElementType.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 9)
      .attr(TeraMoveCategoryAttr)
      .attr(TeraBlastTypeAttr)
      .attr(TeraBlastPowerAttr)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1, true, {
        condition: (user, _target, _move) => user.isTerastallized() && user.isOfType(ElementType.STELLAR),
      }),
    new SelfStatusMove(MoveId.SILK_TRAP, ElementType.BUG, -1, 10, -1, 4, 9)
      .attr(ProtectAttr, BattlerTagType.SILK_TRAP)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.AXE_KICK, ElementType.FIGHTING, MoveCategory.PHYSICAL, 120, 90, 10, 30, 0, 9)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .attr(ConfuseAttr)
      .recklessMove(),
    new AttackMove(MoveId.LAST_RESPECTS, ElementType.GHOST, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 9)
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
    new AttackMove(MoveId.LUMINA_CRASH, ElementType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPDEF],
      -2,
    ),
    new AttackMove(MoveId.ORDER_UP, ElementType.DRAGON, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 9)
      .attr(OrderUpStatBoostAttr)
      .makesContact(false),
    new AttackMove(MoveId.JET_PUNCH, ElementType.WATER, MoveCategory.PHYSICAL, 60, 100, 15, -1, 1, 9).punchingMove(),
    new StatusMove(MoveId.SPICY_EXTRACT, ElementType.GRASS, -1, 15, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.ATK], 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -2),
    new AttackMove(MoveId.SPIN_OUT, ElementType.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -2,
      true,
    ),
    new AttackMove(MoveId.POPULATION_BOMB, ElementType.NORMAL, MoveCategory.PHYSICAL, 20, 90, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._10)
      .slicingMove()
      .checkAllHits(),
    new AttackMove(MoveId.ICE_SPINNER, ElementType.ICE, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 9).attr(
      ClearTerrainAttr,
    ),
    new AttackMove(MoveId.GLAIVE_RUSH, ElementType.DRAGON, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.ALWAYS_GET_HIT, true, { lastHitOnly: true })
      .attr(AddBattlerTagAttr, BattlerTagType.RECEIVE_DOUBLE_DAMAGE, true, { lastHitOnly: true }),
    new StatusMove(MoveId.REVIVAL_BLESSING, ElementType.NORMAL, -1, 1, -1, 0, 9)
      .triageMove()
      .attr(RevivalBlessingAttr)
      .target(MoveTarget.USER),
    new AttackMove(MoveId.SALT_CURE, ElementType.ROCK, MoveCategory.PHYSICAL, 40, 100, 15, 100, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.SALT_CURED)
      .makesContact(false),
    new AttackMove(MoveId.TRIPLE_DIVE, ElementType.WATER, MoveCategory.PHYSICAL, 30, 95, 10, -1, 0, 9).attr(
      MultiHitAttr,
      MultiHitType._3,
    ),
    new AttackMove(MoveId.MORTAL_SPIN, ElementType.POISON, MoveCategory.PHYSICAL, 30, 100, 15, 100, 0, 9)
      .attr(RemoveBattlerTagAttr, rapidSpinRemoveTags, true)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .attr(RemoveArenaTrapAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.DOODLE, ElementType.NORMAL, 100, 10, -1, 0, 9).attr(AbilityCopyAttr, true),
    new SelfStatusMove(MoveId.FILLET_AWAY, ElementType.NORMAL, -1, 10, -1, 0, 9).attr(
      CutHpStatStageBoostAttr,
      [Stat.ATK, Stat.SPATK, Stat.SPD],
      2,
      2,
    ),
    new AttackMove(MoveId.KOWTOW_CLEAVE, ElementType.DARK, MoveCategory.PHYSICAL, 85, -1, 10, -1, 0, 9).slicingMove(),
    new AttackMove(MoveId.FLOWER_TRICK, ElementType.GRASS, MoveCategory.PHYSICAL, 70, -1, 10, -1, 0, 9)
      .attr(CritOnlyAttr)
      .makesContact(false),
    new AttackMove(MoveId.TORCH_SONG, ElementType.FIRE, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .soundMove(),
    new AttackMove(MoveId.AQUA_STEP, ElementType.WATER, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .makesContact()
      .danceMove(),
    new AttackMove(MoveId.RAGING_BULL, ElementType.NORMAL, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 9)
      .attr(RagingBullTypeAttr)
      .attr(RemoveScreensAttr),
    new AttackMove(MoveId.MAKE_IT_RAIN, ElementType.STEEL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9)
      .attr(MoneyAttr)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1, true, { firstTargetOnly: true })
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.PSYBLADE, ElementType.PSYCHIC, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 9)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.ELECTRIC && user.isGrounded() ? 1.5 : 1,
      )
      .slicingMove(),
    new AttackMove(MoveId.HYDRO_STEAM, ElementType.WATER, MoveCategory.SPECIAL, 80, 100, 15, -1, 0, 9)
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
    new AttackMove(MoveId.RUINATION, ElementType.DARK, MoveCategory.SPECIAL, -1, 90, 10, -1, 0, 9).attr(
      TargetHalfHpDamageAttr,
    ),
    new AttackMove(MoveId.COLLISION_COURSE, ElementType.FIGHTING, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9).attr(
      MovePowerMultiplierAttr,
      (user, target, move) => (target.getAttackTypeEffectiveness(move.type, user) >= 2 ? 5461 / 4096 : 1),
    ),
    new AttackMove(MoveId.ELECTRO_DRIFT, ElementType.ELECTRIC, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 9)
      .attr(MovePowerMultiplierAttr, (user, target, move) =>
        target.getAttackTypeEffectiveness(move.type, user) >= 2 ? 5461 / 4096 : 1,
      )
      .makesContact(),
    new SelfStatusMove(MoveId.SHED_TAIL, ElementType.NORMAL, -1, 10, -1, 0, 9)
      .attr(AddSubstituteAttr, 0.5)
      .attr(ForceSwitchOutAttr, true, SwitchType.SHED_TAIL)
      .condition(failIfLastInPartyCondition),
    new SelfStatusMove(MoveId.CHILLY_RECEPTION, ElementType.ICE, -1, 10, -1, 0, 9)
      .attr(PreMoveMessageAttr, (user, _move) =>
        i18next.t("moveTriggers:chillyReception", { pokemonName: getPokemonNameWithAffix(user) }),
      )
      .attr(ChillyReceptionAttr, true),
    new SelfStatusMove(MoveId.TIDY_UP, ElementType.NORMAL, -1, 10, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPD], 1, true)
      .attr(RemoveArenaTrapAttr, true)
      .attr(RemoveAllSubstitutesAttr),
    new StatusMove(MoveId.SNOWSCAPE, ElementType.ICE, -1, 10, -1, 0, 9)
      .attr(WeatherChangeAttr, WeatherType.SNOW)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.POUNCE, ElementType.BUG, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      -1,
    ),
    new AttackMove(MoveId.TRAILBLAZE, ElementType.GRASS, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.SPD],
      1,
      true,
    ),
    new AttackMove(MoveId.CHILLING_WATER, ElementType.WATER, MoveCategory.SPECIAL, 50, 100, 20, 100, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.ATK],
      -1,
    ),
    new AttackMove(
      MoveId.HYPER_DRILL,
      ElementType.NORMAL,
      MoveCategory.PHYSICAL,
      100,
      100,
      5,
      -1,
      0,
      9,
    ).ignoresProtect(),
    new AttackMove(MoveId.TWIN_BEAM, ElementType.PSYCHIC, MoveCategory.SPECIAL, 40, 100, 10, -1, 0, 9).attr(
      MultiHitAttr,
      MultiHitType._2,
    ),
    new AttackMove(MoveId.RAGE_FIST, ElementType.GHOST, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 9)
      .partial() // Counter resets every wave instead of on arena reset
      .attr(HitCountPowerAttr)
      .punchingMove(),
    new AttackMove(MoveId.ARMOR_CANNON, ElementType.FIRE, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9).attr(
      StatStageChangeAttr,
      [Stat.DEF, Stat.SPDEF],
      -1,
      true,
    ),
    new AttackMove(MoveId.BITTER_BLADE, ElementType.FIRE, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 9)
      .attr(HitHealAttr)
      .makesContact()
      .slicingMove()
      .triageMove(),
    new AttackMove(MoveId.DOUBLE_SHOCK, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 9)
      .condition((user) => {
        const userTypes = user.getTypes(true);
        return userTypes.includes(ElementType.ELECTRIC);
      })
      .attr(AddBattlerTagAttr, BattlerTagType.DOUBLE_SHOCKED, true)
      .attr(RemoveTypeAttr, ElementType.ELECTRIC, (user) => {
        globalScene.queueMessage(
          i18next.t("moveTriggers:usedUpAllElectricity", { pokemonName: getPokemonNameWithAffix(user) }),
        );
      }),
    new AttackMove(MoveId.GIGATON_HAMMER, ElementType.STEEL, MoveCategory.PHYSICAL, 160, 100, 5, -1, 0, 9)
      .makesContact(false)
      .condition((user, _target, move) => {
        const turnMove = user.getLastXMoves(1);
        return !turnMove.length || turnMove[0].moveId !== move.id || turnMove[0].result !== MoveResult.SUCCESS;
      }), // TODO Add Instruct/Encore interaction
    new AttackMove(MoveId.COMEUPPANCE, ElementType.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 9)
      .attr(
        CounterDamageAttr,
        (move: Move) => move.category === MoveCategory.PHYSICAL || move.category === MoveCategory.SPECIAL,
        1.5,
      )
      .redirectCounter()
      .target(MoveTarget.ATTACKER),
    new AttackMove(MoveId.AQUA_CUTTER, ElementType.WATER, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 9)
      .attr(HighCritAttr)
      .slicingMove()
      .makesContact(false),
    new AttackMove(MoveId.BLAZING_TORQUE, ElementType.FIRE, MoveCategory.PHYSICAL, 80, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .makesContact(false),
    new AttackMove(MoveId.WICKED_TORQUE, ElementType.DARK, MoveCategory.PHYSICAL, 80, 100, 10, 10, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .makesContact(false),
    new AttackMove(MoveId.NOXIOUS_TORQUE, ElementType.POISON, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.COMBAT_TORQUE, ElementType.FIGHTING, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .makesContact(false),
    new AttackMove(MoveId.MAGICAL_TORQUE, ElementType.FAIRY, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(ConfuseAttr)
      .makesContact(false),
    new AttackMove(MoveId.BLOOD_MOON, ElementType.NORMAL, MoveCategory.SPECIAL, 140, 100, 5, -1, 0, 9).condition(
      (user, _target, move) => {
        const turnMove = user.getLastXMoves(1);
        return !turnMove.length || turnMove[0].moveId !== move.id || turnMove[0].result !== MoveResult.SUCCESS;
      },
    ), // TODO Add Instruct/Encore interaction
    new AttackMove(MoveId.MATCHA_GOTCHA, ElementType.GRASS, MoveCategory.SPECIAL, 80, 90, 15, 20, 0, 9)
      .attr(HitHealAttr)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .triageMove(),
    new AttackMove(MoveId.SYRUP_BOMB, ElementType.GRASS, MoveCategory.SPECIAL, 60, 85, 10, 100, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.SYRUP_BOMB, false, { turnCountMin: 3 })
      .bulletMove(),
    new AttackMove(MoveId.IVY_CUDGEL, ElementType.GRASS, MoveCategory.PHYSICAL, 100, 100, 10, -1, 0, 9)
      .attr(IvyCudgelTypeAttr)
      .attr(HighCritAttr)
      .makesContact(false),
    new ChargingAttackMove(MoveId.ELECTRO_SHOT, ElementType.ELECTRIC, MoveCategory.SPECIAL, 130, 100, 10, 100, 0, 9)
      .chargeText(i18next.t("moveTriggers:absorbedElectricity", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.RAIN, WeatherType.HEAVY_RAIN])
      .ignoresVirtual(),
    new AttackMove(MoveId.TERA_STARSTORM, ElementType.NORMAL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9)
      .attr(TeraMoveCategoryAttr)
      .attr(TeraStarstormTypeAttr)
      .attr(VariableTargetAttr, (user, _target, _move) =>
        (user.hasFusionSpecies(Species.TERAPAGOS) || user.species.speciesId === Species.TERAPAGOS)
        && user.isTerastallized()
          ? MoveTarget.ALL_NEAR_ENEMIES
          : MoveTarget.NEAR_OTHER,
      ),
    new AttackMove(MoveId.FICKLE_BEAM, ElementType.DRAGON, MoveCategory.SPECIAL, 80, 100, 5, 30, 0, 9)
      .attr(PreMoveMessageAttr, doublePowerChanceMessageFunc)
      .attr(DoublePowerChanceAttr)
      .edgeCase(), // Needs to be rewritten to not be affected by sheer force
    new SelfStatusMove(MoveId.BURNING_BULWARK, ElementType.FIRE, -1, 10, -1, 4, 9)
      .attr(ProtectAttr, BattlerTagType.BURNING_BULWARK)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.THUNDERCLAP, ElementType.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 5, -1, 1, 9).condition(
      (_user, target, _move) => {
        const turnCommand = globalScene.currentBattle.turnCommands[target.getBattlerIndex()];
        if (!turnCommand || !turnCommand.move) {
          return false;
        }
        return (
          turnCommand.command === BattleCommand.FIGHT
          && !target.turnData.acted
          && allMoves[turnCommand.move.moveId].category !== MoveCategory.STATUS
        );
      },
    ),
    new AttackMove(MoveId.MIGHTY_CLEAVE, ElementType.ROCK, MoveCategory.PHYSICAL, 95, 100, 5, -1, 0, 9)
      .slicingMove()
      .ignoresProtect(),
    new AttackMove(MoveId.TACHYON_CUTTER, ElementType.STEEL, MoveCategory.SPECIAL, 50, -1, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._2)
      .slicingMove(),
    new AttackMove(MoveId.HARD_PRESS, ElementType.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 9).attr(
      OpponentHighHpPowerAttr,
      100,
    ),
    new StatusMove(MoveId.DRAGON_CHEER, ElementType.DRAGON, -1, 15, -1, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.DRAGON_CHEER, false, { failOnOverlap: true })
      .target(MoveTarget.NEAR_ALLY),
    new AttackMove(MoveId.ALLURING_VOICE, ElementType.FAIRY, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9)
      .attr(AddBattlerTagIfBoostedAttr, BattlerTagType.CONFUSED)
      .soundMove(),
    new AttackMove(MoveId.TEMPER_FLARE, ElementType.FIRE, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 9).attr(
      MovePowerMultiplierAttr,
      (user, _target, _move) =>
        user.getLastXMoves(2)[1]?.result === MoveResult.MISS || user.getLastXMoves(2)[1]?.result === MoveResult.FAIL
          ? 2
          : 1,
    ),
    new AttackMove(MoveId.SUPERCELL_SLAM, ElementType.ELECTRIC, MoveCategory.PHYSICAL, 100, 95, 15, -1, 0, 9)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .recklessMove(),
    new AttackMove(MoveId.PSYCHIC_NOISE, ElementType.PSYCHIC, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 9)
      .soundMove()
      .attr(AddBattlerTagAttr, BattlerTagType.HEAL_BLOCK, false, { turnCountMin: 2 }),
    new AttackMove(MoveId.UPPER_HAND, ElementType.FIGHTING, MoveCategory.PHYSICAL, 65, 100, 15, 100, 3, 9)
      .attr(FlinchAttr)
      .condition(new UpperHandCondition()),
    new AttackMove(MoveId.MALIGNANT_CHAIN, ElementType.POISON, MoveCategory.SPECIAL, 100, 100, 5, 50, 0, 9).attr(
      StatusEffectAttr,
      StatusEffect.TOXIC,
    ),
  ];

  for (const move of rawAllMoves) {
    // Make sure `allMoves` assigns correct ID to every move
    allMoves[move.id] = move;
  }
}
