import type { ShellTrapTag } from "#app/data/battler-tags/shell-trap-tag";
import type { StockpilingTag } from "#app/data/battler-tags/stockpiling-tag";
import { allMoves } from "#app/data/data-lists";
import { ChargingAttackMove } from "#app/data/moves/charging-attack-move";
import { ChargingSelfStatusMove } from "#app/data/moves/charging-self-status-move";
import { AttackMove, SelfStatusMove, StatusMove, type Move } from "#app/data/moves/move";
import { AbilityChangeAttr } from "#app/data/moves/move-attrs/ability-change-attr";
import { AbilityCopyAttr } from "#app/data/moves/move-attrs/ability-copy-attr";
import { AbilityGiveAttr } from "#app/data/moves/move-attrs/ability-give-attr";
import { AcupressureStatStageChangeAttr } from "#app/data/moves/move-attrs/acupressure-stat-stage-change-attr";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import { AddBattlerTagAttr } from "#app/data/moves/move-attrs/add-battler-tag-attr";
import { AddBattlerTagHeaderAttr } from "#app/data/moves/move-attrs/add-battler-tag-header-attr";
import { AddBattlerTagIfBoostedAttr } from "#app/data/moves/move-attrs/add-battler-tag-if-boosted-attr";
import { AddEntryHazardTagAttr } from "#app/data/moves/move-attrs/add-entry-hazard-tag-attr";
import { AddPledgeEffectAttr } from "#app/data/moves/move-attrs/add-pledge-effect-attr";
import { AddSubstituteAttr } from "#app/data/moves/move-attrs/add-substitute-attr";
import { AddTypeAttr } from "#app/data/moves/move-attrs/add-type-attr";
import { AfterYouAttr } from "#app/data/moves/move-attrs/after-you-attr";
import { AlwaysHitMinimizeAttr } from "#app/data/moves/move-attrs/always-hit-minimize-attr";
import { AntiSunlightPowerDecreaseAttr } from "#app/data/moves/move-attrs/anti-sunlight-power-decrease-attr";
import { AttackReducePpMoveAttr } from "#app/data/moves/move-attrs/attack-reduce-pp-move-attr";
import { AttackedByItemAttr } from "#app/data/moves/move-attrs/attacked-by-item-attr";
import { AuraWheelTypeAttr } from "#app/data/moves/move-attrs/aura-wheel-type-attr";
import { AverageStatsAttr } from "#app/data/moves/move-attrs/average-stats-attr";
import { AwaitCombinedPledgeAttr } from "#app/data/moves/move-attrs/await-combined-pledge-attr";
import { BeakBlastHeaderAttr } from "#app/data/moves/move-attrs/beak-blast-header-attr";
import { BeatUpAttr } from "#app/data/moves/move-attrs/beat-up-attr";
import { BlizzardAccuracyAttr } from "#app/data/moves/move-attrs/blizzard-accuracy-attr";
import { BoostHealAttr } from "#app/data/moves/move-attrs/boost-heal-attr";
import { BypassBurnDamageReductionAttr } from "#app/data/moves/move-attrs/bypass-burn-damage-reduction-attr";
import { BypassRedirectAttr } from "#app/data/moves/move-attrs/bypass-redirect-attr";
import { BypassSleepAttr } from "#app/data/moves/move-attrs/bypass-sleep-attr";
import { CaptivateAttr } from "#app/data/moves/move-attrs/captivate-attr";
import { ChangeTypeAttr } from "#app/data/moves/move-attrs/change-type-attr";
import { ChillyReceptionAttr } from "#app/data/moves/move-attrs/chilly-reception-attr";
import { ClearTerrainAttr } from "#app/data/moves/move-attrs/clear-terrain-attr";
import { ClearWeatherAttr } from "#app/data/moves/move-attrs/clear-weather-attr";
import { CombinedPledgePowerAttr } from "#app/data/moves/move-attrs/combined-pledge-power-attr";
import { CombinedPledgeStabBoostAttr } from "#app/data/moves/move-attrs/combined-pledge-stab-boost-attr";
import { CombinedPledgeTypeAttr } from "#app/data/moves/move-attrs/combined-pledge-type-attr";
import { CompareWeightPowerAttr } from "#app/data/moves/move-attrs/compare-weight-power-attr";
import { ConfuseAttr } from "#app/data/moves/move-attrs/confuse-attr";
import { ConsecutiveUseDoublePowerAttr } from "#app/data/moves/move-attrs/consecutive-use-double-power-attr";
import { ConsecutiveUseMultiBasePowerAttr } from "#app/data/moves/move-attrs/consecutive-use-multi-base-power-attr";
import { CopyBiomeTypeAttr } from "#app/data/moves/move-attrs/copy-biome-type-attr";
import { CopyStatsAttr } from "#app/data/moves/move-attrs/copy-stats-attr";
import { CopyTypeAttr } from "#app/data/moves/move-attrs/copy-type-attr";
import { CopycatAttr } from "#app/data/moves/move-attrs/copycat-attr";
import { CounterDamageAttr } from "#app/data/moves/move-attrs/counter-damage-attr";
import { CritOnlyAttr } from "#app/data/moves/move-attrs/crit-only-attr";
import { CueNextRoundAttr } from "#app/data/moves/move-attrs/cue-next-round-attr";
import { CurseAttr } from "#app/data/moves/move-attrs/curse-attr";
import { CutHpStatStageBoostAttr } from "#app/data/moves/move-attrs/cut-hp-stat-stage-boost-attr";
import { DealsPhysicalDamageAttr } from "#app/data/moves/move-attrs/deals-physical-damage-attr";
import { DefAtkAttr } from "#app/data/moves/move-attrs/def-atk-attr";
import { DelayedAttackAttr } from "#app/data/moves/move-attrs/delayed-attack-attr";
import { DestinyBondAttr } from "#app/data/moves/move-attrs/destiny-bond-attr";
import { DiscourageFrequentUseAttr } from "#app/data/moves/move-attrs/discourage-frequent-use-attr";
import { DisplayMessageAttr } from "#app/data/moves/move-attrs/display-message-attr";
import { DoubleDamageToMaxAttr } from "#app/data/moves/move-attrs/double-damage-to-max-attr";
import {
  DoublePowerChanceAttr,
  doublePowerChanceMessageFunc,
} from "#app/data/moves/move-attrs/double-power-chance-attr";
import { EatBerryAttr } from "#app/data/moves/move-attrs/eat-berry-attr";
import { ElectroBallPowerAttr } from "#app/data/moves/move-attrs/electro-ball-power-attr";
import { EncoreAttr } from "#app/data/moves/move-attrs/encore-attr";
import { ExposedMoveAttr } from "#app/data/moves/move-attrs/exposed-move-attr";
import { FaintCountdownAttr } from "#app/data/moves/move-attrs/faint-countdown-attr";
import { FirstAttackDoublePowerAttr } from "#app/data/moves/move-attrs/first-attack-double-power-attr";
import { FirstMoveTypeAttr } from "#app/data/moves/move-attrs/first-move-type-attr";
import { FixedDamageAttr } from "#app/data/moves/move-attrs/fixed-damage-attr";
import { FlameBurstAttr } from "#app/data/moves/move-attrs/flame-burst-attr";
import { FlinchAttr } from "#app/data/moves/move-attrs/flinch-attr";
import { FlyingTypeMultiplierAttr } from "#app/data/moves/move-attrs/flying-type-multiplier-attr";
import { ForceSwitchOutAttr } from "#app/data/moves/move-attrs/force-switch-out-attr";
import { FormChangeItemTypeAttr } from "#app/data/moves/move-attrs/form-change-item-type-attr";
import { FreezeDryAttr } from "#app/data/moves/move-attrs/freeze-dry-attr";
import { FriendshipPowerAttr } from "#app/data/moves/move-attrs/friendship-power-attr";
import { GrowthStatStageChangeAttr } from "#app/data/moves/move-attrs/growth-stat-stage-change-attr";
import { GulpMissileTagAttr } from "#app/data/moves/move-attrs/gulp-missile-tag-attr";
import { GyroBallPowerAttr } from "#app/data/moves/move-attrs/gyro-ball-power-attr";
import { HalfSacrificialAttr } from "#app/data/moves/move-attrs/half-sacrificial-attr";
import { HealAttr } from "#app/data/moves/move-attrs/heal-attr";
import { HealOnAllyAttr } from "#app/data/moves/move-attrs/heal-on-ally-attr";
import { HealStatusEffectAttr } from "#app/data/moves/move-attrs/heal-status-effect-attr";
import { HiddenPowerTypeAttr } from "#app/data/moves/move-attrs/hidden-power-type-attr";
import { HighCritAttr } from "#app/data/moves/move-attrs/high-crit-attr";
import { HitCountPowerAttr } from "#app/data/moves/move-attrs/hit-count-power-attr";
import { HitHealAttr } from "#app/data/moves/move-attrs/hit-heal-attr";
import { HitsSameTypeAttr } from "#app/data/moves/move-attrs/hits-same-type-attr";
import { HitsTagAttr } from "#app/data/moves/move-attrs/hits-tag-attr";
import { HitsTagForDoubleDamageAttr } from "#app/data/moves/move-attrs/hits-tag-for-double-damage-attr";
import { HpPowerAttr } from "#app/data/moves/move-attrs/hp-power-attr";
import { HpSplitAttr } from "#app/data/moves/move-attrs/hp-split-attr";
import { IceNoEffectTypeAttr } from "#app/data/moves/move-attrs/ice-no-effect-type-attr";
import { IgnoreAccuracyAttr } from "#app/data/moves/move-attrs/ignore-accuracy-attr";
import { IgnoreOpponentStatStagesAttr } from "#app/data/moves/move-attrs/ignore-opponent-stat-stages-attr";
import { IgnoreWeatherTypeDebuffAttr } from "#app/data/moves/move-attrs/ignore-weather-type-debuff-attr";
import { IncrementMovePriorityAttr } from "#app/data/moves/move-attrs/increment-move-priority-attr";
import { InvertStatsAttr } from "#app/data/moves/move-attrs/invert-stats-attr";
import { IvyCudgelTypeAttr } from "#app/data/moves/move-attrs/ivy-cudgel-type-attr";
import { JawLockAttr } from "#app/data/moves/move-attrs/jaw-lock-attr";
import { LastMoveDoublePowerAttr } from "#app/data/moves/move-attrs/last-move-double-power-attr";
import { LastResortAttr } from "#app/data/moves/move-attrs/last-resort-attr";
import { LeechSeedAttr } from "#app/data/moves/move-attrs/leech-seed-attr";
import { LessPPMorePowerAttr } from "#app/data/moves/move-attrs/less-pp-more-power-attr";
import { LevelDamageAttr } from "#app/data/moves/move-attrs/level-damage-attr";
import { LowHpPowerAttr } from "#app/data/moves/move-attrs/low-hp-power-attr";
import { magnitudeMessageFunc, MagnitudePowerAttr } from "#app/data/moves/move-attrs/magnitude-power-attr";
import { MatchHpAttr } from "#app/data/moves/move-attrs/match-hp-attr";
import { MatchUserTypeAttr } from "#app/data/moves/move-attrs/match-user-type-attr";
import { MeFirstAttr } from "#app/data/moves/move-attrs/me-first-attr";
import { MessageHeaderAttr } from "#app/data/moves/move-attrs/message-header-attr";
import { MetronomeAttr } from "#app/data/moves/move-attrs/metronome-attr";
import { MirrorMoveAttr } from "#app/data/moves/move-attrs/mirror-move-attr";
import { MissEffectAttr } from "#app/data/moves/move-attrs/miss-effect-attr";
import { MoneyAttr } from "#app/data/moves/move-attrs/money-attr";
import { MovePowerMultiplierAttr } from "#app/data/moves/move-attrs/move-power-multiplier-attr";
import { MovesetCopyMoveAttr } from "#app/data/moves/move-attrs/moveset-copy-move-attr";
import { MultiHitAttr } from "#app/data/moves/move-attrs/multi-hit-attr";
import { MultiHitPowerIncrementAttr } from "#app/data/moves/move-attrs/multi-hit-power-increment-attr";
import { MultiStatusEffectAttr } from "#app/data/moves/move-attrs/multi-status-effect-attr";
import { NaturePowerAttr } from "#app/data/moves/move-attrs/nature-power-attr";
import { NeutralDamageAgainstFlyingTypeMultiplierAttr } from "#app/data/moves/move-attrs/neutral-damage-against-flying-type-multiplier-attr";
import { NoDamageAgainstFlyingAttr } from "#app/data/moves/move-attrs/no-damage-against-flying-attr";
import { NoEffectAttr } from "#app/data/moves/move-attrs/no-effect-attr";
import { OneHitKOAccuracyAttr } from "#app/data/moves/move-attrs/one-hit-ko-accuracy-attr";
import { OneHitKOAttr } from "#app/data/moves/move-attrs/one-hit-ko-attr";
import { OpponentHighHpPowerAttr } from "#app/data/moves/move-attrs/opponent-high-hp-power-attr";
import { OrderUpStatBoostAttr } from "#app/data/moves/move-attrs/order-up-stat-boost-attr";
import { PartyStatusCureAttr } from "#app/data/moves/move-attrs/party-status-cure-attr";
import { PlantHealAttr } from "#app/data/moves/move-attrs/plant-heal-attr";
import {
  PositiveStatStagePowerAttr,
  PunishmentPowerAttr,
} from "#app/data/moves/move-attrs/positive-stat-stage-power-attr";
import { PostVictoryStatStageChangeAttr } from "#app/data/moves/move-attrs/post-victory-stat-stage-change-attr";
import { PreMoveMessageAttr } from "#app/data/moves/move-attrs/pre-move-message-attr";
import { PresentPowerAttr } from "#app/data/moves/move-attrs/present-power-attr";
import { ProtectAttr } from "#app/data/moves/move-attrs/protect-attr";
import { PsychoShiftEffectAttr } from "#app/data/moves/move-attrs/psycho-shift-effect-attr";
import { QuashAttr } from "#app/data/moves/move-attrs/quash-attr";
import { RageAttr } from "#app/data/moves/move-attrs/rage-attr";
import { RagingBullTypeAttr } from "#app/data/moves/move-attrs/raging-bull-type-attr";
import { RandomLevelDamageAttr } from "#app/data/moves/move-attrs/random-level-damage-attr";
import {
  invalidAssistMoves,
  invalidSleepTalkMoves,
  RandomMovesetMoveAttr,
} from "#app/data/moves/move-attrs/random-moveset-move-attr";
import { RechargeAttr } from "#app/data/moves/move-attrs/recharge-attr";
import { RecoilAttr } from "#app/data/moves/move-attrs/recoil-attr";
import { ReducePpMoveAttr } from "#app/data/moves/move-attrs/reduce-pp-move-attr";
import { RemoveAllSubstitutesAttr } from "#app/data/moves/move-attrs/remove-all-substitutes-attr";
import { RemoveArenaTagsAttr } from "#app/data/moves/move-attrs/remove-arena-tags-attr";
import { rapidSpinRemoveTags, RemoveBattlerTagAttr } from "#app/data/moves/move-attrs/remove-battler-tag-attr";
import { RemoveEntryHazardAttr } from "#app/data/moves/move-attrs/remove-entry-hazard-attr";
import { RemoveHeldItemAttr } from "#app/data/moves/move-attrs/remove-held-item-attr";
import { RemoveScreensAttr } from "#app/data/moves/move-attrs/remove-screens-attr";
import { RemoveTypeAttr } from "#app/data/moves/move-attrs/remove-type-attr";
import { RepeatMoveAttr } from "#app/data/moves/move-attrs/repeat-move-attr";
import { ResetStatsAttr } from "#app/data/moves/move-attrs/reset-stats-attr";
import { ResistLastMoveTypeAttr } from "#app/data/moves/move-attrs/resist-last-move-type-attr";
import { RespectAttackTypeImmunityAttr } from "#app/data/moves/move-attrs/respect-attack-type-immunity-attr";
import { RevivalBlessingAttr } from "#app/data/moves/move-attrs/revival-blessing-attr";
import { RollingPowerMultiplierAttr } from "#app/data/moves/move-attrs/rolling-power-multiplier-attr";
import { RoundPowerAttr } from "#app/data/moves/move-attrs/round-power-attr";
import { SacrificialAttr } from "#app/data/moves/move-attrs/sacrificial-attr";
import { SacrificialFullRestoreAttr } from "#app/data/moves/move-attrs/sacrificial-full-restore-attr";
import { SandHealAttr } from "#app/data/moves/move-attrs/sand-heal-attr";
import { SecretPowerAttr } from "#app/data/moves/move-attrs/secret-power-attr";
import { SemiInvulnerableAttr } from "#app/data/moves/move-attrs/semi-invulnerable-attr";
import { SheerColdAccuracyAttr } from "#app/data/moves/move-attrs/sheer-cold-accuracy-attr";
import { ShellSideArmCategoryAttr } from "#app/data/moves/move-attrs/shell-side-arm-category-attr";
import { ShiftStatAttr } from "#app/data/moves/move-attrs/shift-stat-attr";
import { SketchAttr } from "#app/data/moves/move-attrs/sketch-attr";
import { SkyDropAttr } from "#app/data/moves/move-attrs/sky-drop-attr";
import { SpitUpPowerAttr } from "#app/data/moves/move-attrs/spit-up-power-attr";
import { StatStageChangeAttr } from "#app/data/moves/move-attrs/stat-stage-change-attr";
import { StatusCategoryOnAllyAttr } from "#app/data/moves/move-attrs/status-category-on-ally-attr";
import { StatusEffectAttr } from "#app/data/moves/move-attrs/status-effect-attr";
import { StatusIfBoostedAttr } from "#app/data/moves/move-attrs/status-if-boosted-attr";
import { StealEatBerryAttr } from "#app/data/moves/move-attrs/steal-eat-berry-attr";
import { StealHeldItemChanceAttr } from "#app/data/moves/move-attrs/steal-held-item-chance-attr";
import { StealPositiveStatsAttr } from "#app/data/moves/move-attrs/steal-positive-stats-attr";
import { StormAccuracyAttr } from "#app/data/moves/move-attrs/storm-accuracy-attr";
import { SuppressAbilitiesAttr } from "#app/data/moves/move-attrs/suppress-abilities-attr";
import { SuppressAbilitiesIfActedAttr } from "#app/data/moves/move-attrs/suppress-abilities-if-acted-attr";
import { SurviveDamageAttr } from "#app/data/moves/move-attrs/survive-damage-attr";
import { SwallowHealAttr } from "#app/data/moves/move-attrs/swallow-heal-attr";
import { courtChangeArenaTags, SwapArenaTagsAttr } from "#app/data/moves/move-attrs/swap-arena-tags-attr";
import { SwapStatAttr } from "#app/data/moves/move-attrs/swap-stat-attr";
import { SwapStatStagesAttr } from "#app/data/moves/move-attrs/swap-stat-stages-attr";
import { SwitchAbilitiesAttr } from "#app/data/moves/move-attrs/switch-abilities-attr";
import { TargetAtkUserAtkAttr } from "#app/data/moves/move-attrs/target-atk-user-atk-attr";
import { TargetHalfHpDamageAttr } from "#app/data/moves/move-attrs/target-half-hp-damage-attr";
import { TechnoBlastTypeAttr } from "#app/data/moves/move-attrs/techno-blast-type-attr";
import { TeraBlastPowerAttr } from "#app/data/moves/move-attrs/tera-blast-power-attr";
import { TeraBlastTypeAttr } from "#app/data/moves/move-attrs/tera-blast-type-attr";
import { TeraMoveCategoryAttr } from "#app/data/moves/move-attrs/tera-move-category-attr";
import { TeraStarstormTypeAttr } from "#app/data/moves/move-attrs/tera-starstorm-type-attr";
import { TerrainChangeAttr } from "#app/data/moves/move-attrs/terrain-change-attr";
import { TerrainPulseTypeAttr } from "#app/data/moves/move-attrs/terrain-pulse-type-attr";
import { ThunderAccuracyAttr } from "#app/data/moves/move-attrs/thunder-accuracy-attr";
import { ToxicAccuracyAttr } from "#app/data/moves/move-attrs/toxic-accuracy-attr";
import { TransformAttr } from "#app/data/moves/move-attrs/transform-attr";
import { TrapAttr } from "#app/data/moves/move-attrs/trap-attr";
import { TurnDamagedDoublePowerAttr } from "#app/data/moves/move-attrs/turn-damaged-double-power-attr";
import { TypelessAttr } from "#app/data/moves/move-attrs/typeless-attr";
import { UseHigherAttackingStatAttr } from "#app/data/moves/move-attrs/use-higher-attacking-stat-attr";
import { UserHpDamageAttr } from "#app/data/moves/move-attrs/user-hp-damage-attr";
import { VariableTargetAttr } from "#app/data/moves/move-attrs/variable-target-attr";
import { WaterShurikenMultiHitTypeAttr } from "#app/data/moves/move-attrs/water-shuriken-multi-hit-type-attr";
import { WaterShurikenPowerAttr } from "#app/data/moves/move-attrs/water-shuriken-power-attr";
import { WeatherBallTypeAttr } from "#app/data/moves/move-attrs/weather-ball-type-attr";
import { WeatherChangeAttr } from "#app/data/moves/move-attrs/weather-change-attr";
import { WeatherInstantChargeAttr } from "#app/data/moves/move-attrs/weather-instant-charge-attr";
import { WeightPowerAttr } from "#app/data/moves/move-attrs/weight-power-attr";
import { failIfDampCondition } from "#app/data/moves/move-conditions/fail-if-damp-condition";
import { failIfGhostTypeCondition } from "#app/data/moves/move-conditions/fail-if-ghost-type-condition";
import { failIfLastCondition } from "#app/data/moves/move-conditions/fail-if-last-condition";
import { failIfLastInPartyCondition } from "#app/data/moves/move-conditions/fail-if-last-in-party-condition";
import { failIfSingleBattle } from "#app/data/moves/move-conditions/fail-if-single-battle-condition";
import { failOnBossCondition } from "#app/data/moves/move-conditions/fail-on-boss-condition";
import { failOnGravityCondition } from "#app/data/moves/move-conditions/fail-on-gravity-condition";
import { failOnMaxCondition } from "#app/data/moves/move-conditions/fail-on-max-condition";
import { FirstMoveCondition } from "#app/data/moves/move-conditions/first-move-condition";
import { hasStockpileStacksCondition } from "#app/data/moves/move-conditions/has-stockpile-stacks-condition";
import { targetSleptOrComatoseCondition } from "#app/data/moves/move-conditions/target-slept-or-comatose-condition";
import { unknownTypeCondition } from "#app/data/moves/move-conditions/unknown-type-condition";
import { UpperHandCondition } from "#app/data/moves/move-conditions/upper-hand-condition";
import { userSleptOrComatoseCondition } from "#app/data/moves/move-conditions/user-slept-or-comatose-condition";
import { getNonVolatileStatusEffects } from "#app/data/status-effect";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { isNullOrUndefined } from "#app/utils";
import { ConditionalProtectArenaTagTypes } from "#app/utils/arena-tag-type-utils";
import { SemiInvulnerableBattlerTagTypes, TrappedBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { crashDamageFunc } from "#app/utils/move-utils";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleCommand } from "#enums/battle-command";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ChargeAnim } from "#enums/charge-anim";
import { ElementalType } from "#enums/elemental-type";
import { MoveCategory } from "#enums/move-category";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { MoveTarget } from "#enums/move-target";
import { MultiHitType } from "#enums/multi-hit-type";
import { SpeciesId } from "#enums/species-id";
import { BATTLE_STATS, getStatKey, Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { SwitchType } from "#enums/switch-type";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import i18next from "i18next";

// prettier-ignore
export function initMoves() {
  const rawAllMoves = [
    SelfStatusMove.none(),
    new AttackMove(MoveId.POUND, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.KARATE_CHOP, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 50, 100, 25, -1, 0, 1)
      .attr(HighCritAttr),
    new AttackMove(MoveId.DOUBLE_SLAP, ElementalType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 10, -1, 0, 1)
      .attr(MultiHitAttr),
    new AttackMove(MoveId.COMET_PUNCH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 18, 85, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .punchingMove(),
    new AttackMove(MoveId.MEGA_PUNCH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, 85, 20, -1, 0, 1)
      .punchingMove(),
    new AttackMove(MoveId.PAY_DAY, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 20, -1, 0, 1)
      .attr(MoneyAttr)
      .makesContact(false),
    new AttackMove(MoveId.FIRE_PUNCH, ElementalType.FIRE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .punchingMove(),
    new AttackMove(MoveId.ICE_PUNCH, ElementalType.ICE, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .punchingMove(),
    new AttackMove(MoveId.THUNDER_PUNCH, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 75, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .punchingMove(),
    new AttackMove(MoveId.SCRATCH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.VISE_GRIP, ElementalType.NORMAL, MoveCategory.PHYSICAL, 55, 100, 30, -1, 0, 1),
    new AttackMove(MoveId.GUILLOTINE, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new ChargingAttackMove(MoveId.RAZOR_WIND, ElementalType.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:whippedUpAWhirlwind", { pokemonName: "{USER}" }))
      .attr(HighCritAttr)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(MoveId.SWORDS_DANCE, ElementalType.NORMAL, -1, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], 2, true)
      .danceMove()
      .snatchable(),
    new AttackMove(MoveId.CUT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 50, 95, 30, -1, 0, 1)
      .slicingMove(),
    new AttackMove(MoveId.GUST, ElementalType.FLYING, MoveCategory.SPECIAL, 40, 100, 35, -1, 0, 1)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .windMove(),
    new AttackMove(MoveId.WING_ATTACK, ElementalType.FLYING, MoveCategory.PHYSICAL, 60, 100, 35, -1, 0, 1),
    new StatusMove(MoveId.WHIRLWIND, ElementalType.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .ignoresSubstitute()
      .hidesTarget()
      .windMove()
      .bounceable(),
    new ChargingAttackMove(MoveId.FLY, ElementalType.FLYING, MoveCategory.PHYSICAL, 90, 95, 15, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:flewUpHigh", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.FLYING)
      .condition(failOnGravityCondition),
    new AttackMove(MoveId.BIND, ElementalType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.BIND),
    new AttackMove(MoveId.SLAM, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, 75, 20, -1, 0, 1),
    new AttackMove(MoveId.VINE_WHIP, ElementalType.GRASS, MoveCategory.PHYSICAL, 45, 100, 25, -1, 0, 1),
    new AttackMove(MoveId.STOMP, ElementalType.NORMAL, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 1)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new AttackMove(MoveId.DOUBLE_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 30, 100, 30, -1, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2),
    new AttackMove(MoveId.MEGA_KICK, ElementalType.NORMAL, MoveCategory.PHYSICAL, 120, 75, 5, -1, 0, 1),
    new AttackMove(MoveId.JUMP_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 100, 95, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new AttackMove(MoveId.ROLLING_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 60, 85, 15, 30, 0, 1)
      .attr(FlinchAttr),
    new StatusMove(MoveId.SAND_ATTACK, ElementalType.GROUND, 100, 15, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bounceable(),
    new AttackMove(MoveId.HEADBUTT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 15, 30, 0, 1)
      .attr(FlinchAttr),
    new AttackMove(MoveId.HORN_ATTACK, ElementalType.NORMAL, MoveCategory.PHYSICAL, 65, 100, 25, -1, 0, 1),
    new AttackMove(MoveId.FURY_ATTACK, ElementalType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(MultiHitAttr),
    new AttackMove(MoveId.HORN_DRILL, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr),
    new AttackMove(MoveId.TACKLE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.BODY_SLAM, ElementalType.NORMAL, MoveCategory.PHYSICAL, 85, 100, 15, 30, 0, 1)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.WRAP, ElementalType.NORMAL, MoveCategory.PHYSICAL, 15, 90, 20, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.WRAP),
    new AttackMove(MoveId.TAKE_DOWN, ElementalType.NORMAL, MoveCategory.PHYSICAL, 90, 85, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.THRASH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.FRENZY, true, { turnCountMin: 2, turnCountMax: 3 })
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new AttackMove(MoveId.DOUBLE_EDGE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 1)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new StatusMove(MoveId.TAIL_WHIP, ElementalType.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.POISON_STING, ElementalType.POISON, MoveCategory.PHYSICAL, 15, 100, 35, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.TWINEEDLE, ElementalType.BUG, MoveCategory.PHYSICAL, 25, 100, 20, 20, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.PIN_MISSILE, ElementalType.BUG, MoveCategory.PHYSICAL, 25, 95, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new StatusMove(MoveId.LEER, ElementalType.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BITE, ElementalType.DARK, MoveCategory.PHYSICAL, 60, 100, 25, 30, 0, 1)
      .attr(FlinchAttr)
      .bitingMove(),
    new StatusMove(MoveId.GROWL, ElementalType.NORMAL, 100, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .soundMove()
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.ROAR, ElementalType.NORMAL, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .soundMove()
      .hidesTarget()
      .bounceable(),
    new StatusMove(MoveId.SING, ElementalType.NORMAL, 55, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundMove()
      .bounceable(),
    new StatusMove(MoveId.SUPERSONIC, ElementalType.NORMAL, 55, 20, -1, 0, 1)
      .attr(ConfuseAttr)
      .soundMove()
      .bounceable(),
    new AttackMove(MoveId.SONIC_BOOM, ElementalType.NORMAL, MoveCategory.SPECIAL, -1, 90, 20, -1, 0, 1)
      .attr(FixedDamageAttr, 20),
    new StatusMove(MoveId.DISABLE, ElementalType.NORMAL, 100, 20, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.DISABLED, false, { failOnOverlap: true })
      .condition(failOnMaxCondition)
      .condition(
        (_user, target, _move) =>
          target
            .getMoveHistory()
            .reverse()
            .find((m) => m.move.id !== MoveId.NONE && m.move.id !== MoveId.STRUGGLE && !m.virtual) !== undefined,
      )
      .ignoresSubstitute()
      .bounceable()
      .edgeCase(), // Does not disable itself when reflected by Magic Coat/Bounce
    new AttackMove(MoveId.ACID, ElementalType.POISON, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.EMBER, ElementalType.FIRE, MoveCategory.SPECIAL, 40, 100, 25, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.FLAMETHROWER, ElementalType.FIRE, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(MoveId.MIST, ElementalType.ICE, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.MIST, ArenaTagRelativeSide.USER, { turnCount: 5, failOnOverlap: true })
      .snatchable()
      .target(MoveTarget.USER_SIDE),
    new AttackMove(MoveId.WATER_GUN, ElementalType.WATER, MoveCategory.SPECIAL, 40, 100, 25, -1, 0, 1),
    new AttackMove(MoveId.HYDRO_PUMP, ElementalType.WATER, MoveCategory.SPECIAL, 110, 80, 5, -1, 0, 1),
    new AttackMove(MoveId.SURF, ElementalType.WATER, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 1)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERWATER)
      .attr(GulpMissileTagAttr),
    new AttackMove(MoveId.ICE_BEAM, ElementalType.ICE, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.FREEZE),
    new AttackMove(MoveId.BLIZZARD, ElementalType.ICE, MoveCategory.SPECIAL, 110, 70, 5, 10, 0, 1)
      .attr(BlizzardAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.PSYBEAM, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1)
      .attr(ConfuseAttr),
    new AttackMove(MoveId.BUBBLE_BEAM, ElementalType.WATER, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -1),
    new AttackMove(MoveId.AURORA_BEAM, ElementalType.ICE, MoveCategory.SPECIAL, 65, 100, 20, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(MoveId.HYPER_BEAM, ElementalType.NORMAL, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 1)
      .attr(RechargeAttr),
    new AttackMove(MoveId.PECK, ElementalType.FLYING, MoveCategory.PHYSICAL, 35, 100, 35, -1, 0, 1),
    new AttackMove(MoveId.DRILL_PECK, ElementalType.FLYING, MoveCategory.PHYSICAL, 80, 100, 20, -1, 0, 1),
    new AttackMove(MoveId.SUBMISSION, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 80, 80, 20, -1, 0, 1)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.LOW_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1)
      .condition(failOnMaxCondition)
      .attr(WeightPowerAttr),
    new AttackMove(MoveId.COUNTER, ElementalType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, -5, 1)
      .attr(CounterDamageAttr, (moveId) => allMoves.get(moveId).category === MoveCategory.PHYSICAL, 2)
      .target(MoveTarget.ATTACKER),
    new AttackMove(MoveId.SEISMIC_TOSS, ElementalType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 1)
      .attr(LevelDamageAttr),
    new AttackMove(MoveId.STRENGTH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 1),
    new AttackMove(MoveId.ABSORB, ElementalType.GRASS, MoveCategory.SPECIAL, 20, 100, 25, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new AttackMove(MoveId.MEGA_DRAIN, ElementalType.GRASS, MoveCategory.SPECIAL, 40, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(MoveId.LEECH_SEED, ElementalType.GRASS, 90, 10, -1, 0, 1)
      .attr(LeechSeedAttr)
      .condition(
        (_user, target, _move) => !target.getTag(BattlerTagType.SEEDED) && !target.isOfType(ElementalType.GRASS),
      )
      .bounceable(),
    new SelfStatusMove(MoveId.GROWTH, ElementalType.NORMAL, -1, 20, -1, 0, 1)
      .attr(GrowthStatStageChangeAttr)
      .snatchable(),
    new AttackMove(MoveId.RAZOR_LEAF, ElementalType.GRASS, MoveCategory.PHYSICAL, 55, 95, 25, -1, 0, 1)
      .attr(HighCritAttr)
      .makesContact(false)
      .slicingMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new ChargingAttackMove(MoveId.SOLAR_BEAM, ElementalType.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:tookInSunlight", { pokemonName: "{USER}" }))
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.SUNNY, WeatherType.HARSH_SUN])
      .attr(AntiSunlightPowerDecreaseAttr),
    new StatusMove(MoveId.POISON_POWDER, ElementalType.POISON, 75, 35, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .powderMove()
      .bounceable(),
    new StatusMove(MoveId.STUN_SPORE, ElementalType.GRASS, 75, 30, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .powderMove()
      .bounceable(),
    new StatusMove(MoveId.SLEEP_POWDER, ElementalType.GRASS, 75, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .powderMove()
      .bounceable(),
    new AttackMove(MoveId.PETAL_DANCE, ElementalType.GRASS, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.FRENZY, true, { turnCountMin: 2, turnCountMax: 3 })
      .makesContact()
      .danceMove()
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(MoveId.STRING_SHOT, ElementalType.BUG, 95, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -2)
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DRAGON_RAGE, ElementalType.DRAGON, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 1)
      .attr(FixedDamageAttr, 40),
    new AttackMove(MoveId.FIRE_SPIN, ElementalType.FIRE, MoveCategory.SPECIAL, 35, 85, 15, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.FIRE_SPIN),
    new AttackMove(MoveId.THUNDER_SHOCK, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.THUNDERBOLT, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 90, 100, 15, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new StatusMove(MoveId.THUNDER_WAVE, ElementalType.ELECTRIC, 90, 20, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(RespectAttackTypeImmunityAttr)
      .bounceable(),
    new AttackMove(MoveId.THUNDER, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 110, 70, 10, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .attr(ThunderAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP),
    new AttackMove(MoveId.ROCK_THROW, ElementalType.ROCK, MoveCategory.PHYSICAL, 50, 90, 15, -1, 0, 1)
      .makesContact(false),
    new AttackMove(MoveId.EARTHQUAKE, ElementalType.GROUND, MoveCategory.PHYSICAL, 100, 100, 10, -1, 0, 1)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERGROUND)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.hasTerrain(TerrainType.GRASSY) && target.isGrounded() ? 0.5 : 1,
      )
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FISSURE, ElementalType.GROUND, MoveCategory.PHYSICAL, -1, 30, 5, -1, 0, 1)
      .attr(OneHitKOAttr)
      .attr(OneHitKOAccuracyAttr)
      .attr(HitsTagAttr, BattlerTagType.UNDERGROUND)
      .makesContact(false),
    new ChargingAttackMove(MoveId.DIG, ElementalType.GROUND, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:dugAHole", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.UNDERGROUND),
    new StatusMove(MoveId.TOXIC, ElementalType.POISON, 90, 10, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.TOXIC)
      .attr(ToxicAccuracyAttr)
      .bounceable(),
    new AttackMove(MoveId.CONFUSION, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 50, 100, 25, 10, 0, 1)
      .attr(ConfuseAttr),
    new AttackMove(MoveId.PSYCHIC, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1),
    new StatusMove(MoveId.HYPNOSIS, ElementalType.PSYCHIC, 60, 20, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .bounceable(),
    new SelfStatusMove(MoveId.MEDITATE, ElementalType.PSYCHIC, -1, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .snatchable(),
    new SelfStatusMove(MoveId.AGILITY, ElementalType.PSYCHIC, -1, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true)
      .snatchable(),
    new AttackMove(MoveId.QUICK_ATTACK, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 1),
    new AttackMove(MoveId.RAGE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 20, 100, 20, -1, 0, 1)
      .attr(RageAttr),
    new SelfStatusMove(MoveId.TELEPORT, ElementalType.PSYCHIC, -1, 20, -1, -6, 1)
      .attr(ForceSwitchOutAttr, true)
      .hidesUser(),
    new AttackMove(MoveId.NIGHT_SHADE, ElementalType.GHOST, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1)
      .attr(LevelDamageAttr),
    new StatusMove(MoveId.MIMIC, ElementalType.NORMAL, -1, 10, -1, 0, 1)
      .attr(MovesetCopyMoveAttr)
      .ignoresSubstitute(),
    new StatusMove(MoveId.SCREECH, ElementalType.NORMAL, 85, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], -2)
      .soundMove()
      .bounceable(),
    new SelfStatusMove(MoveId.DOUBLE_TEAM, ElementalType.NORMAL, -1, 15, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.EVA], 1, true)
      .snatchable(),
    new SelfStatusMove(MoveId.RECOVER, ElementalType.NORMAL, -1, 5, -1, 0, 1)
      .attr(HealAttr, 0.5)
      .triageMove()
      .snatchable(),
    new SelfStatusMove(MoveId.HARDEN, ElementalType.NORMAL, -1, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, true)
      .snatchable(),
    new SelfStatusMove(MoveId.MINIMIZE, ElementalType.NORMAL, -1, 10, -1, 0, 1)
      .attr(AddBattlerTagAttr, BattlerTagType.MINIMIZED, true)
      .attr(StatStageChangeAttr, [Stat.EVA], 2, true)
      .snatchable(),
    new StatusMove(MoveId.SMOKESCREEN, ElementalType.NORMAL, 100, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bounceable(),
    new StatusMove(MoveId.CONFUSE_RAY, ElementalType.GHOST, 100, 10, -1, 0, 1)
      .attr(ConfuseAttr)
      .bounceable(),
    new SelfStatusMove(MoveId.WITHDRAW, ElementalType.WATER, -1, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, true)
      .snatchable(),
    new SelfStatusMove(MoveId.DEFENSE_CURL, ElementalType.NORMAL, -1, 40, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, true)
      .snatchable(),
    new SelfStatusMove(MoveId.BARRIER, ElementalType.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true)
      .snatchable(),
    new StatusMove(MoveId.LIGHT_SCREEN, ElementalType.PSYCHIC, -1, 30, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.LIGHT_SCREEN, ArenaTagRelativeSide.USER, {
        turnCount: 5,
        failOnOverlap: true,
      })
      .snatchable()
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(MoveId.HAZE, ElementalType.ICE, -1, 30, -1, 0, 1)
      .ignoresSubstitute()
      .attr(ResetStatsAttr, true),
    new StatusMove(MoveId.REFLECT, ElementalType.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(AddArenaTagAttr, ArenaTagType.REFLECT, ArenaTagRelativeSide.USER, { turnCount: 5, failOnOverlap: true })
      .snatchable()
      .target(MoveTarget.USER_SIDE),
    new SelfStatusMove(MoveId.FOCUS_ENERGY, ElementalType.NORMAL, -1, 30, -1, 0, 1)
      .attr( AddBattlerTagAttr, BattlerTagType.CRIT_BOOST, true, { failOnOverlap: true })
      .snatchable(),
    new AttackMove(MoveId.BIDE, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, -1, 10, -1, 1, 1)
      .target(MoveTarget.USER)
      .unimplemented(),
    new SelfStatusMove(MoveId.METRONOME, ElementalType.NORMAL, -1, 10, -1, 0, 1)
      .attr(MetronomeAttr),
    new StatusMove(MoveId.MIRROR_MOVE, ElementalType.FLYING, -1, 20, -1, 0, 1)
      .attr(MirrorMoveAttr)
      .edgeCase(),
    new AttackMove(MoveId.SELF_DESTRUCT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 200, 100, 5, -1, 0, 1)
      .attr(SacrificialAttr)
      .makesContact(false)
      .condition(failIfDampCondition)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.EGG_BOMB, ElementalType.NORMAL, MoveCategory.PHYSICAL, 100, 75, 10, -1, 0, 1)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.LICK, ElementalType.GHOST, MoveCategory.PHYSICAL, 30, 100, 30, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.SMOG, ElementalType.POISON, MoveCategory.SPECIAL, 30, 70, 20, 40, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.SLUDGE, ElementalType.POISON, MoveCategory.SPECIAL, 65, 100, 20, 30, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.BONE_CLUB, ElementalType.GROUND, MoveCategory.PHYSICAL, 65, 85, 20, 10, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false),
    new AttackMove(MoveId.FIRE_BLAST, ElementalType.FIRE, MoveCategory.SPECIAL, 110, 85, 5, 10, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.WATERFALL, ElementalType.WATER, MoveCategory.PHYSICAL, 80, 100, 15, 20, 0, 1)
      .attr(FlinchAttr),
    new AttackMove(MoveId.CLAMP, ElementalType.WATER, MoveCategory.PHYSICAL, 35, 85, 15, -1, 0, 1)
      .attr(TrapAttr, BattlerTagType.CLAMP),
    new AttackMove(MoveId.SWIFT, ElementalType.NORMAL, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new ChargingAttackMove(MoveId.SKULL_BASH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 130, 100, 10, -1, 0, 1)
      .chargeText(i18next.t("moveTriggers:loweredItsHead", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.DEF], 1, true),
    new AttackMove(MoveId.SPIKE_CANNON, ElementalType.NORMAL, MoveCategory.PHYSICAL, 20, 100, 15, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false),
    new AttackMove(MoveId.CONSTRICT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 10, 100, 35, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -1),
    new SelfStatusMove(MoveId.AMNESIA, ElementalType.PSYCHIC, -1, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPDEF], 2, true)
      .snatchable(),
    new StatusMove(MoveId.KINESIS, ElementalType.PSYCHIC, 80, 15, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bounceable(),
    new SelfStatusMove(MoveId.SOFT_BOILED, ElementalType.NORMAL, -1, 5, -1, 0, 1)
      .attr(HealAttr, 0.5)
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.HIGH_JUMP_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 130, 90, 10, -1, 0, 1)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .condition(failOnGravityCondition)
      .recklessMove(),
    new StatusMove(MoveId.GLARE, ElementalType.NORMAL, 100, 30, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .bounceable(),
    new AttackMove(MoveId.DREAM_EATER, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 15, -1, 0, 1)
      .attr(HitHealAttr)
      .condition(targetSleptOrComatoseCondition)
      .triageMove(),
    new StatusMove(MoveId.POISON_GAS, ElementalType.POISON, 90, 40, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BARRAGE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 15, 85, 20, -1, 0, 1)
      .attr(MultiHitAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.LEECH_LIFE, ElementalType.BUG, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 1)
      .attr(HitHealAttr)
      .triageMove(),
    new StatusMove(MoveId.LOVELY_KISS, ElementalType.NORMAL, 75, 10, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .bounceable(),
    new ChargingAttackMove(MoveId.SKY_ATTACK, ElementalType.FLYING, MoveCategory.PHYSICAL, 140, 90, 5, 30, 0, 1)
      .chargeText(i18next.t("moveTriggers:isGlowing", { pokemonName: "{USER}" }))
      .attr(HighCritAttr)
      .attr(FlinchAttr)
      .makesContact(false),
    new StatusMove(MoveId.TRANSFORM, ElementalType.NORMAL, -1, 10, -1, 0, 1)
      .attr(TransformAttr)
      .condition((_user, target, _move) => !target.getTag(BattlerTagType.SUBSTITUTE))
      .ignoresProtect(),
    new AttackMove(MoveId.BUBBLE, ElementalType.WATER, MoveCategory.SPECIAL, 40, 100, 30, 10, 0, 1)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DIZZY_PUNCH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 10, 20, 0, 1)
      .attr(ConfuseAttr)
      .punchingMove(),
    new StatusMove(MoveId.SPORE, ElementalType.GRASS, 100, 15, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .powderMove()
      .bounceable(),
    new StatusMove(MoveId.FLASH, ElementalType.NORMAL, 100, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bounceable(),
    new AttackMove(MoveId.PSYWAVE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, -1, 100, 15, -1, 0, 1)
      .attr(RandomLevelDamageAttr),
    new SelfStatusMove(MoveId.SPLASH, ElementalType.NORMAL, -1, 40, -1, 0, 1)
      .condition(failOnGravityCondition)
      .attr(DisplayMessageAttr, i18next.t("moveTriggers:splash")),
    new SelfStatusMove(MoveId.ACID_ARMOR, ElementalType.POISON, -1, 20, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true)
      .snatchable(),
    new AttackMove(MoveId.CRABHAMMER, ElementalType.WATER, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 1)
      .attr(HighCritAttr),
    new AttackMove(MoveId.EXPLOSION, ElementalType.NORMAL, MoveCategory.PHYSICAL, 250, 100, 5, -1, 0, 1)
      .condition(failIfDampCondition)
      .attr(SacrificialAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FURY_SWIPES, ElementalType.NORMAL, MoveCategory.PHYSICAL, 18, 80, 15, -1, 0, 1)
      .attr(MultiHitAttr),
    new AttackMove(MoveId.BONEMERANG, ElementalType.GROUND, MoveCategory.PHYSICAL, 50, 90, 10, -1, 0, 1)
      .attr(MultiHitAttr, MultiHitType._2)
      .makesContact(false),
    new SelfStatusMove(MoveId.REST, ElementalType.PSYCHIC, -1, 5, -1, 0, 1)
      .attr(StatusEffectAttr, StatusEffect.SLEEP, true, 3, true)
      .attr(HealAttr, 1, true)
      .condition((user, _target, _move) => !user.isFullHp() && user.canSetStatus(StatusEffect.SLEEP, true, true))
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.ROCK_SLIDE, ElementalType.ROCK, MoveCategory.PHYSICAL, 75, 90, 10, 30, 0, 1)
      .attr(FlinchAttr)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.HYPER_FANG, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, 90, 15, 10, 0, 1)
      .attr(FlinchAttr)
      .bitingMove(),
    new SelfStatusMove(MoveId.SHARPEN, ElementalType.NORMAL, -1, 30, -1, 0, 1)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .snatchable(),
    new SelfStatusMove(MoveId.CONVERSION, ElementalType.NORMAL, -1, 30, -1, 0, 1)
      .attr(FirstMoveTypeAttr)
      .snatchable(),
    new AttackMove(MoveId.TRI_ATTACK, ElementalType.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, 20, 0, 1)
      .attr(MultiStatusEffectAttr, [StatusEffect.BURN, StatusEffect.FREEZE, StatusEffect.PARALYSIS]),
    new AttackMove(MoveId.SUPER_FANG, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 90, 10, -1, 0, 1)
      .attr(TargetHalfHpDamageAttr),
    new AttackMove(MoveId.SLASH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 1)
      .attr(HighCritAttr)
      .slicingMove(),
    new SelfStatusMove(MoveId.SUBSTITUTE, ElementalType.NORMAL, -1, 10, -1, 0, 1)
      .attr(AddSubstituteAttr)
      .snatchable(),
    new AttackMove(MoveId.STRUGGLE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 50, -1, 1, -1, 0, 1)
      .attr(RecoilAttr, true, 0.25, true)
      .attr(TypelessAttr)
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(MoveId.SKETCH, ElementalType.NORMAL, -1, 1, -1, 0, 2)
      .ignoresSubstitute()
      .attr(SketchAttr),
    new AttackMove(MoveId.TRIPLE_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 10, 90, 10, -1, 0, 2)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(MultiHitPowerIncrementAttr, 3)
      .checkAllHits(),
    new AttackMove(MoveId.THIEF, ElementalType.DARK, MoveCategory.PHYSICAL, 60, 100, 25, -1, 0, 2)
      .attr(StealHeldItemChanceAttr, 0.3),
    new StatusMove(MoveId.SPIDER_WEB, ElementalType.BUG, -1, 10, -1, 0, 2)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true })
      .ignoresProtect()
      .bounceable(),
    new StatusMove(MoveId.MIND_READER, ElementalType.NORMAL, -1, 5, -1, 0, 2)
      .attr(IgnoreAccuracyAttr),
    new StatusMove(MoveId.NIGHTMARE, ElementalType.GHOST, 100, 15, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.NIGHTMARE)
      .condition(targetSleptOrComatoseCondition),
    new AttackMove(MoveId.FLAME_WHEEL, ElementalType.FIRE, MoveCategory.PHYSICAL, 60, 100, 25, 10, 0, 2)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.SNORE, ElementalType.NORMAL, MoveCategory.SPECIAL, 50, 100, 15, 30, 0, 2)
      .attr(BypassSleepAttr)
      .attr(FlinchAttr)
      .condition(userSleptOrComatoseCondition)
      .soundMove(),
    new StatusMove(MoveId.CURSE, ElementalType.GHOST, -1, 10, -1, 0, 2)
      .attr(CurseAttr)
      .ignoresSubstitute()
      .ignoresProtect()
      .target(MoveTarget.CURSE),
    new AttackMove(MoveId.FLAIL, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 2)
      .attr(LowHpPowerAttr),
    new StatusMove(MoveId.CONVERSION_2, ElementalType.NORMAL, -1, 30, -1, 0, 2)
      .attr(ResistLastMoveTypeAttr)
      .ignoresSubstitute(),
    new AttackMove(MoveId.AEROBLAST, ElementalType.FLYING, MoveCategory.SPECIAL, 100, 95, 5, -1, 0, 2)
      .windMove()
      .attr(HighCritAttr),
    new StatusMove(MoveId.COTTON_SPORE, ElementalType.GRASS, 100, 40, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], -2)
      .powderMove()
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.REVERSAL, ElementalType.FIGHTING, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 2)
      .attr(LowHpPowerAttr),
    new StatusMove(MoveId.SPITE, ElementalType.GHOST, 100, 10, -1, 0, 2)
      .attr(ReducePpMoveAttr, 4)
      .ignoresSubstitute()
      .bounceable(),
    new AttackMove(MoveId.POWDER_SNOW, ElementalType.ICE, MoveCategory.SPECIAL, 40, 100, 25, 10, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(MoveId.PROTECT, ElementalType.NORMAL, -1, 10, -1, 4, 2)
      .attr(ProtectAttr)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.MACH_PUNCH, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 2)
      .punchingMove(),
    new StatusMove(MoveId.SCARY_FACE, ElementalType.NORMAL, 100, 10, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], -2)
      .bounceable(),
    new AttackMove(MoveId.FEINT_ATTACK, ElementalType.DARK, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 2),
    new StatusMove(MoveId.SWEET_KISS, ElementalType.FAIRY, 75, 10, -1, 0, 2)
      .attr(ConfuseAttr)
      .bounceable(),
    new SelfStatusMove(MoveId.BELLY_DRUM, ElementalType.NORMAL, -1, 10, -1, 0, 2)
      .attr(CutHpStatStageBoostAttr, [Stat.ATK], 12, 2,
        (user) => {
          globalScene.queueMessage(
            i18next.t("moveTriggers:cutOwnHpAndMaximizedStat", {
              pokemonName: getPokemonNameWithAffix(user),
              statName: i18next.t(getStatKey(Stat.ATK)),
            }),
          );
        },
      )
      .snatchable(),
    new AttackMove(MoveId.SLUDGE_BOMB, ElementalType.POISON, MoveCategory.SPECIAL, 90, 100, 10, 30, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .bulletMove(),
    new AttackMove(MoveId.MUD_SLAP, ElementalType.GROUND, MoveCategory.SPECIAL, 20, 100, 10, 100, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(MoveId.OCTAZOOKA, ElementalType.WATER, MoveCategory.SPECIAL, 65, 85, 10, 50, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bulletMove(),
    new StatusMove(MoveId.SPIKES, ElementalType.GROUND, -1, 20, -1, 0, 2)
      .attr(AddEntryHazardTagAttr, ArenaTagType.SPIKES)
      .bounceable()
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(MoveId.ZAP_CANNON, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 120, 50, 5, 100, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .bulletMove(),
    new StatusMove(MoveId.FORESIGHT, ElementalType.NORMAL, -1, 40, -1, 0, 2)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_GHOST)
      .ignoresSubstitute()
      .bounceable(),
    new SelfStatusMove(MoveId.DESTINY_BOND, ElementalType.GHOST, -1, 5, -1, 0, 2)
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
          || lastTurnMove[0].move.id !== move.id
          || lastTurnMove[0].result !== MoveResult.SUCCESS
        );
      }),
    new StatusMove(MoveId.PERISH_SONG, ElementalType.NORMAL, -1, 5, -1, 0, 2)
      .attr(FaintCountdownAttr)
      .ignoresProtect()
      .soundMove()
      .condition(failOnBossCondition)
      .target(MoveTarget.ALL),
    new AttackMove(MoveId.ICY_WIND, ElementalType.ICE, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(MoveId.DETECT, ElementalType.FIGHTING, -1, 5, -1, 4, 2)
      .attr(ProtectAttr)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.BONE_RUSH, ElementalType.GROUND, MoveCategory.PHYSICAL, 25, 90, 10, -1, 0, 2)
      .attr(MultiHitAttr)
      .makesContact(false),
    new StatusMove(MoveId.LOCK_ON, ElementalType.NORMAL, -1, 5, -1, 0, 2)
      .attr(IgnoreAccuracyAttr),
    new AttackMove(MoveId.OUTRAGE, ElementalType.DRAGON, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.FRENZY, true, { turnCountMin: 2, turnCountMax: 3 })
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new StatusMove(MoveId.SANDSTORM, ElementalType.ROCK, -1, 10, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.SANDSTORM)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.GIGA_DRAIN, ElementalType.GRASS, MoveCategory.SPECIAL, 75, 100, 10, -1, 0, 2)
      .attr(HitHealAttr)
      .triageMove(),
    new SelfStatusMove(MoveId.ENDURE, ElementalType.NORMAL, -1, 10, -1, 4, 2)
      .attr(ProtectAttr, BattlerTagType.ENDURING)
      .condition(failIfLastCondition),
    new StatusMove(MoveId.CHARM, ElementalType.FAIRY, 100, 20, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ATK], -2)
      .bounceable(),
    new AttackMove(MoveId.ROLLOUT, ElementalType.ROCK, MoveCategory.PHYSICAL, 30, 90, 20, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.ROLLING, true)
      .attr(RollingPowerMultiplierAttr),
    new AttackMove(MoveId.FALSE_SWIPE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 2)
      .attr(SurviveDamageAttr),
    new StatusMove(MoveId.SWAGGER, ElementalType.NORMAL, 85, 15, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ATK], 2)
      .attr(ConfuseAttr)
      .bounceable(),
    new SelfStatusMove(MoveId.MILK_DRINK, ElementalType.NORMAL, -1, 5, -1, 0, 2)
      .attr(HealAttr, 0.5)
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.SPARK, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.FURY_CUTTER, ElementalType.BUG, MoveCategory.PHYSICAL, 40, 95, 20, -1, 0, 2)
      .attr(ConsecutiveUseDoublePowerAttr, 3, true)
      .slicingMove(),
    new AttackMove(MoveId.STEEL_WING, ElementalType.STEEL, MoveCategory.PHYSICAL, 70, 90, 25, 10, 0, 2)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, true),
    new StatusMove(MoveId.MEAN_LOOK, ElementalType.NORMAL, -1, 5, -1, 0, 2)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true })
      .ignoresProtect()
      .bounceable(),
    new StatusMove(MoveId.ATTRACT, ElementalType.NORMAL, 100, 15, -1, 0, 2)
      .attr(AddBattlerTagAttr, BattlerTagType.INFATUATED)
      .ignoresSubstitute()
      .bounceable()
      .condition((user, target, _move) => user.isOppositeGender(target)),
    new SelfStatusMove(MoveId.SLEEP_TALK, ElementalType.NORMAL, -1, 10, -1, 0, 2)
      .attr(BypassSleepAttr)
      .attr(RandomMovesetMoveAttr, invalidSleepTalkMoves)
      .condition(userSleptOrComatoseCondition),
    new StatusMove(MoveId.HEAL_BELL, ElementalType.NORMAL, -1, 5, -1, 0, 2)
      .attr(PartyStatusCureAttr, i18next.t("moveTriggers:bellChimed"), AbilityId.SOUNDPROOF)
      .soundMove()
      .snatchable()
      .target(MoveTarget.PARTY),
    new AttackMove(MoveId.RETURN, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 2)
      .attr(FriendshipPowerAttr),
    new AttackMove(MoveId.PRESENT, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 90, 15, -1, 0, 2)
      .attr(PresentPowerAttr)
      .makesContact(false),
    new AttackMove(MoveId.FRUSTRATION, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 20, -1, 0, 2)
      .attr(FriendshipPowerAttr, true),
    new StatusMove(MoveId.SAFEGUARD, ElementalType.NORMAL, -1, 25, -1, 0, 2)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.SAFEGUARD, ArenaTagRelativeSide.USER, { turnCount: 5, failOnOverlap: true })
      .snatchable(),
    new StatusMove(MoveId.PAIN_SPLIT, ElementalType.NORMAL, -1, 20, -1, 0, 2)
      .attr(HpSplitAttr)
      .condition(failOnBossCondition),
    new AttackMove(MoveId.SACRED_FIRE, ElementalType.FIRE, MoveCategory.PHYSICAL, 100, 95, 5, 50, 0, 2)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .makesContact(false),
    new AttackMove(MoveId.MAGNITUDE, ElementalType.GROUND, MoveCategory.PHYSICAL, -1, 100, 30, -1, 0, 2)
      .attr(PreMoveMessageAttr, magnitudeMessageFunc)
      .attr(MagnitudePowerAttr)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.hasTerrain(TerrainType.GRASSY) && target.isGrounded() ? 0.5 : 1,
      )
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERGROUND)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.DYNAMIC_PUNCH, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 100, 50, 5, 100, 0, 2)
      .attr(ConfuseAttr)
      .punchingMove(),
    new AttackMove(MoveId.MEGAHORN, ElementalType.BUG, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 2),
    new AttackMove(MoveId.DRAGON_BREATH, ElementalType.DRAGON, MoveCategory.SPECIAL, 60, 100, 20, 30, 0, 2)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new SelfStatusMove(MoveId.BATON_PASS, ElementalType.NORMAL, -1, 40, -1, 0, 2)
      .attr(ForceSwitchOutAttr, true, SwitchType.BATON_PASS)
      .condition(failIfLastInPartyCondition)
      .hidesUser(),
    new StatusMove(MoveId.ENCORE, ElementalType.NORMAL, 100, 5, -1, 0, 2)
      .attr(EncoreAttr)
      .ignoresSubstitute()
      .bounceable()
      .edgeCase(), // wrongly interacts with moves reflected by Magic Coat/Bounce
    new AttackMove(MoveId.PURSUIT, ElementalType.DARK, MoveCategory.PHYSICAL, 40, 100, 20, -1, 0, 2)
      .partial(), // No effect implemented
    new AttackMove(MoveId.RAPID_SPIN, ElementalType.NORMAL, MoveCategory.PHYSICAL, 50, 100, 40, 100, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .attr(RemoveBattlerTagAttr, rapidSpinRemoveTags, true)
      .attr(RemoveEntryHazardAttr),
    new StatusMove(MoveId.SWEET_SCENT, ElementalType.NORMAL, 100, 20, -1, 0, 2)
      .attr(StatStageChangeAttr, [Stat.EVA], -2)
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.IRON_TAIL, ElementalType.STEEL, MoveCategory.PHYSICAL, 100, 75, 15, 30, 0, 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -1),
    new AttackMove(MoveId.METAL_CLAW, ElementalType.STEEL, MoveCategory.PHYSICAL, 50, 95, 35, 10, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true),
    new AttackMove(MoveId.VITAL_THROW, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 70, -1, 10, -1, -1, 2),
    new SelfStatusMove(MoveId.MORNING_SUN, ElementalType.NORMAL, -1, 5, -1, 0, 2)
      .attr(PlantHealAttr)
      .triageMove()
      .snatchable(),
    new SelfStatusMove(MoveId.SYNTHESIS, ElementalType.GRASS, -1, 5, -1, 0, 2)
      .attr(PlantHealAttr)
      .triageMove()
      .snatchable(),
    new SelfStatusMove(MoveId.MOONLIGHT, ElementalType.FAIRY, -1, 5, -1, 0, 2)
      .attr(PlantHealAttr)
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.HIDDEN_POWER, ElementalType.NORMAL, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 2)
      .attr(HiddenPowerTypeAttr),
    new AttackMove(MoveId.CROSS_CHOP, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 100, 80, 5, -1, 0, 2)
      .attr(HighCritAttr),
    new AttackMove(MoveId.TWISTER, ElementalType.DRAGON, MoveCategory.SPECIAL, 40, 100, 20, 20, 0, 2)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .attr(FlinchAttr)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.RAIN_DANCE, ElementalType.WATER, -1, 5, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.RAIN)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.SUNNY_DAY, ElementalType.FIRE, -1, 5, -1, 0, 2)
      .attr(WeatherChangeAttr, WeatherType.SUNNY)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.CRUNCH, ElementalType.DARK, MoveCategory.PHYSICAL, 80, 100, 15, 20, 0, 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .bitingMove(),
    new AttackMove(MoveId.MIRROR_COAT, ElementalType.PSYCHIC, MoveCategory.SPECIAL, -1, 100, 20, -1, -5, 2)
      .attr(CounterDamageAttr, (moveId) => allMoves.get(moveId).category === MoveCategory.SPECIAL, 2)
      .target(MoveTarget.ATTACKER),
    new StatusMove(MoveId.PSYCH_UP, ElementalType.NORMAL, -1, 10, -1, 0, 2)
      .ignoresSubstitute()
      .attr(CopyStatsAttr),
    new AttackMove(MoveId.EXTREME_SPEED, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, 100, 5, -1, 2, 2),
    new AttackMove(MoveId.ANCIENT_POWER, ElementalType.ROCK, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 2)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true),
    new AttackMove(MoveId.SHADOW_BALL, ElementalType.GHOST, MoveCategory.SPECIAL, 80, 100, 15, 20, 0, 2)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .bulletMove(),
    new AttackMove(MoveId.FUTURE_SIGHT, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 2)
      .partial() // hits immediately when called by Metronome/etc, should not apply abilities or held items if user is off the field
      .ignoresProtect()
      .attr(
        DelayedAttackAttr,
        ChargeAnim.FUTURE_SIGHT_CHARGING,
        i18next.t("moveTriggers:foresawAnAttack", { pokemonName: "{USER}" }),
      ),
    new AttackMove(MoveId.ROCK_SMASH, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 15, 50, 0, 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -1),
    new AttackMove(MoveId.WHIRLPOOL, ElementalType.WATER, MoveCategory.SPECIAL, 35, 85, 15, -1, 0, 2)
      .attr(TrapAttr, BattlerTagType.WHIRLPOOL)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.UNDERWATER),
    new AttackMove(MoveId.BEAT_UP, ElementalType.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 2)
      .attr(MultiHitAttr, MultiHitType.BEAT_UP)
      .attr(BeatUpAttr)
      .makesContact(false),
    new AttackMove(MoveId.FAKE_OUT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 10, 100, 3, 3)
      .attr(FlinchAttr)
      .condition(new FirstMoveCondition()),
    new AttackMove(MoveId.UPROAR, ElementalType.NORMAL, MoveCategory.SPECIAL, 90, 100, 10, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.UPROAR, true)
      .attr(MessageHeaderAttr, (user, _move) =>
        !!user.getTag(BattlerTagType.UPROAR)
          // "{pokemonNameWithAffix} is making an uproar!"
          ? i18next.t("moveTriggers:isMakingAnUproar", { pokemonNameWithAffix: getPokemonNameWithAffix(user) })
          : undefined,
      )
      .soundMove()
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new SelfStatusMove(MoveId.STOCKPILE, ElementalType.NORMAL, -1, 20, -1, 0, 3)
      .condition((user) => (user.getTag<StockpilingTag>(BattlerTagType.STOCKPILING)?.stockpiledCount ?? 0) < 3)
      .attr(AddBattlerTagAttr, BattlerTagType.STOCKPILING, true)
      .snatchable(),
    new AttackMove(MoveId.SPIT_UP, ElementalType.NORMAL, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 3)
      .condition(hasStockpileStacksCondition)
      .attr(SpitUpPowerAttr, 100)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.STOCKPILING], true),
    new SelfStatusMove(MoveId.SWALLOW, ElementalType.NORMAL, -1, 10, -1, 0, 3)
      .condition(hasStockpileStacksCondition)
      .attr(SwallowHealAttr)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.STOCKPILING], true)
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.HEAT_WAVE, ElementalType.FIRE, MoveCategory.SPECIAL, 95, 90, 10, 10, 0, 3)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.HAIL, ElementalType.ICE, -1, 10, -1, 0, 3)
      .attr(WeatherChangeAttr, WeatherType.HAIL)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.TORMENT, ElementalType.DARK, 100, 15, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.TORMENT, false, { failOnOverlap: true })
      .ignoresSubstitute()
      .bounceable(),
    new StatusMove(MoveId.FLATTER, ElementalType.DARK, 100, 15, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1)
      .attr(ConfuseAttr)
      .bounceable(),
    new StatusMove(MoveId.WILL_O_WISP, ElementalType.FIRE, 85, 15, -1, 0, 3)
      .attr(StatusEffectAttr, StatusEffect.BURN).bounceable(),
    new StatusMove(MoveId.MEMENTO, ElementalType.DARK, 100, 10, -1, 0, 3)
      .attr(SacrificialAttr, true)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -2),
    new AttackMove(MoveId.FACADE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        user.hasStatusEffect([StatusEffect.BURN, StatusEffect.POISON, StatusEffect.TOXIC, StatusEffect.PARALYSIS])
          ? 2
          : 1,
      )
      .attr(BypassBurnDamageReductionAttr),
    new AttackMove(MoveId.FOCUS_PUNCH, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 150, 100, 20, -1, -3, 3)
      .attr(MessageHeaderAttr, (user, _move) =>
        i18next.t("moveTriggers:isTighteningFocus", { pokemonName: getPokemonNameWithAffix(user) }),
      )
      .punchingMove()
      .condition((user, _target, _move) => !user.turnData.attacksReceived.find((r) => r.damage)),
    new AttackMove(MoveId.SMELLING_SALTS, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 10, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.hasStatusEffect(StatusEffect.PARALYSIS) ? 2 : 1))
      .attr(HealStatusEffectAttr, true, StatusEffect.PARALYSIS),
    new SelfStatusMove(MoveId.FOLLOW_ME, ElementalType.NORMAL, -1, 20, -1, 2, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.CENTER_OF_ATTENTION, true),
    new StatusMove(MoveId.NATURE_POWER, ElementalType.NORMAL, -1, 20, -1, 0, 3)
      .attr(NaturePowerAttr),
    new SelfStatusMove(MoveId.CHARGE, ElementalType.ELECTRIC, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], 1, true)
      .attr(AddBattlerTagAttr, BattlerTagType.CHARGED, true)
      .snatchable(),
    new StatusMove(MoveId.TAUNT, ElementalType.DARK, 100, 20, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.TAUNT, false, { failOnOverlap: true, turnCountMin: 4 })
      .bounceable()
      .ignoresSubstitute(),
    new StatusMove(MoveId.HELPING_HAND, ElementalType.NORMAL, -1, 20, -1, 5, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.HELPING_HAND)
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_ALLY)
      .condition(failIfSingleBattle),
    new StatusMove(MoveId.TRICK, ElementalType.PSYCHIC, 100, 10, -1, 0, 3)
      .unimplemented(),
    new StatusMove(MoveId.ROLE_PLAY, ElementalType.PSYCHIC, -1, 10, -1, 0, 3)
      .ignoresSubstitute()
      .attr(AbilityCopyAttr),
    new SelfStatusMove(MoveId.WISH, ElementalType.NORMAL, -1, 10, -1, 0, 3)
      .triageMove()
      .snatchable()
      .attr(AddArenaTagAttr, ArenaTagType.WISH, ArenaTagRelativeSide.USER, { turnCount: 2, failOnOverlap: true }),
    new SelfStatusMove(MoveId.ASSIST, ElementalType.NORMAL, -1, 20, -1, 0, 3)
      .attr(RandomMovesetMoveAttr, invalidAssistMoves, true),
    new SelfStatusMove(MoveId.INGRAIN, ElementalType.GRASS, -1, 20, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.INGRAIN, true, { failOnOverlap: true })
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, true, { failOnOverlap: true })
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLOATING], true)
      .snatchable(),
    new AttackMove(MoveId.SUPERPOWER, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF], -1, true),
    new SelfStatusMove(MoveId.MAGIC_COAT, ElementalType.PSYCHIC, -1, 15, -1, 4, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.MAGIC_COAT, true, { failOnOverlap: true })
      .condition(failIfLastCondition),
    new SelfStatusMove(MoveId.RECYCLE, ElementalType.NORMAL, -1, 10, -1, 0, 3)
      .snatchable()
      .unimplemented(),
    new AttackMove(MoveId.REVENGE, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, -1, -4, 3)
      .attr(TurnDamagedDoublePowerAttr),
    new AttackMove(MoveId.BRICK_BREAK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 75, 100, 15, -1, 0, 3)
      .attr(RemoveScreensAttr),
    new StatusMove(MoveId.YAWN, ElementalType.NORMAL, -1, 10, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.DROWSY, false, { failOnOverlap: true })
      .bounceable()
      .condition((user, target, _move) => !target.hasNonVolatileStatusEffect() && !target.isSafeguarded(user)),
    new AttackMove(MoveId.KNOCK_OFF, ElementalType.DARK, MoveCategory.PHYSICAL, 65, 100, 20, -1, 0, 3)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.getHeldItems().filter((i) => i.isTransferable).length > 0 ? 1.5 : 1,
      )
      .attr(RemoveHeldItemAttr, false),
    new AttackMove(MoveId.ENDEAVOR, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 3)
      .attr(MatchHpAttr)
      .condition(failOnBossCondition),
    new AttackMove(MoveId.ERUPTION, ElementalType.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 3)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.SKILL_SWAP, ElementalType.PSYCHIC, -1, 10, -1, 0, 3)
      .condition(failOnMaxCondition)
      .ignoresSubstitute()
      .attr(SwitchAbilitiesAttr),
    new SelfStatusMove(MoveId.IMPRISON, ElementalType.PSYCHIC, 100, 10, -1, 0, 3)
      .ignoresSubstitute()
      .attr(AddBattlerTagAttr, BattlerTagType.IMPRISONING, true, { failOnOverlap: true })
      .snatchable(),
    new SelfStatusMove(MoveId.REFRESH, ElementalType.NORMAL, -1, 20, -1, 0, 3)
      .attr(HealStatusEffectAttr, true, [
        StatusEffect.PARALYSIS,
        StatusEffect.POISON,
        StatusEffect.TOXIC,
        StatusEffect.BURN,
      ])
      .snatchable()
      .condition((user, _target, _move) =>
        user.hasStatusEffect([StatusEffect.BURN, StatusEffect.PARALYSIS, StatusEffect.POISON, StatusEffect.TOXIC]),
      ),
    new SelfStatusMove(MoveId.GRUDGE, ElementalType.GHOST, -1, 5, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.GRUDGE, true, { turnCountMin: 1 }),
    new SelfStatusMove(MoveId.SNATCH, ElementalType.DARK, -1, 10, -1, 4, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.SNATCHING, true, { failOnOverlap: true }),
    new AttackMove(MoveId.SECRET_POWER, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, 30, 0, 3)
      .makesContact(false)
      .attr(SecretPowerAttr),
    new ChargingAttackMove(MoveId.DIVE, ElementalType.WATER, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 3)
      .chargeText(i18next.t("moveTriggers:hidUnderwater", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.UNDERWATER)
      .chargeAttr(GulpMissileTagAttr),
    new AttackMove(MoveId.ARM_THRUST, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 15, 100, 20, -1, 0, 3)
      .attr(MultiHitAttr),
    new SelfStatusMove(MoveId.CAMOUFLAGE, ElementalType.NORMAL, -1, 20, -1, 0, 3)
      .attr(CopyBiomeTypeAttr)
      .snatchable(),
    new SelfStatusMove(MoveId.TAIL_GLOW, ElementalType.BUG, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], 3, true)
      .snatchable(),
    new AttackMove(MoveId.LUSTER_PURGE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 95, 100, 5, 50, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1),
    new AttackMove(MoveId.MIST_BALL, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 95, 100, 5, 50, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .bulletMove(),
    new StatusMove(MoveId.FEATHER_DANCE, ElementalType.FLYING, 100, 15, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], -2)
      .danceMove()
      .bounceable(),
    new StatusMove(MoveId.TEETER_DANCE, ElementalType.NORMAL, 100, 20, -1, 0, 3)
      .attr(ConfuseAttr)
      .danceMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.BLAZE_KICK, ElementalType.FIRE, MoveCategory.PHYSICAL, 85, 90, 10, 10, 0, 3)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(MoveId.MUD_SPORT, ElementalType.GROUND, -1, 15, -1, 0, 3)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.MUD_SPORT, ArenaTagRelativeSide.ALL, { turnCount: 5 })
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.ICE_BALL, ElementalType.ICE, MoveCategory.PHYSICAL, 30, 90, 20, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.ROLLING, true)
      .attr(RollingPowerMultiplierAttr)
      .bulletMove(),
    new AttackMove(MoveId.NEEDLE_ARM, ElementalType.GRASS, MoveCategory.PHYSICAL, 60, 100, 15, 30, 0, 3)
      .attr(FlinchAttr),
    new SelfStatusMove(MoveId.SLACK_OFF, ElementalType.NORMAL, -1, 5, -1, 0, 3)
      .attr(HealAttr, 0.5)
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.HYPER_VOICE, ElementalType.NORMAL, MoveCategory.SPECIAL, 90, 100, 10, -1, 0, 3)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.POISON_FANG, ElementalType.POISON, MoveCategory.PHYSICAL, 50, 100, 15, 50, 0, 3)
      .attr(StatusEffectAttr, StatusEffect.TOXIC)
      .bitingMove(),
    new AttackMove(MoveId.CRUSH_CLAW, ElementalType.NORMAL, MoveCategory.PHYSICAL, 75, 95, 10, 50, 0, 3)
      .attr(StatStageChangeAttr, [Stat.DEF], -1),
    new AttackMove(MoveId.BLAST_BURN, ElementalType.FIRE, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3)
      .attr(RechargeAttr),
    new AttackMove(MoveId.HYDRO_CANNON, ElementalType.WATER, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3)
      .attr(RechargeAttr),
    new AttackMove(MoveId.METEOR_MASH, ElementalType.STEEL, MoveCategory.PHYSICAL, 90, 90, 10, 20, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .punchingMove(),
    new AttackMove(MoveId.ASTONISH, ElementalType.GHOST, MoveCategory.PHYSICAL, 30, 100, 15, 30, 0, 3)
      .attr(FlinchAttr),
    new AttackMove(MoveId.WEATHER_BALL, ElementalType.NORMAL, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 3)
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
    new StatusMove(MoveId.AROMATHERAPY, ElementalType.GRASS, -1, 5, -1, 0, 3)
      .attr(PartyStatusCureAttr, i18next.t("moveTriggers:soothingAromaWaftedThroughArea"), AbilityId.SAP_SIPPER)
      .target(MoveTarget.PARTY)
      .snatchable(),
    new StatusMove(MoveId.FAKE_TEARS, ElementalType.DARK, 100, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2)
      .bounceable(),
    new AttackMove(MoveId.AIR_CUTTER, ElementalType.FLYING, MoveCategory.SPECIAL, 60, 95, 25, -1, 0, 3)
      .attr(HighCritAttr)
      .slicingMove()
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.OVERHEAT, ElementalType.FIRE, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2, true)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE),
    new StatusMove(MoveId.ODOR_SLEUTH, ElementalType.NORMAL, -1, 40, -1, 0, 3)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_GHOST)
      .ignoresSubstitute()
      .bounceable(),
    new AttackMove(MoveId.ROCK_TOMB, ElementalType.ROCK, MoveCategory.PHYSICAL, 60, 95, 15, 100, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .makesContact(false),
    new AttackMove(MoveId.SILVER_WIND, ElementalType.BUG, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .windMove(),
    new StatusMove(MoveId.METAL_SOUND, ElementalType.STEEL, 85, 40, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2)
      .soundMove()
      .bounceable(),
    new StatusMove(MoveId.GRASS_WHISTLE, ElementalType.GRASS, 55, 15, -1, 0, 3)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundMove()
      .bounceable(),
    new StatusMove(MoveId.TICKLE, ElementalType.NORMAL, 100, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF], -1)
      .bounceable(),
    new SelfStatusMove(MoveId.COSMIC_POWER, ElementalType.PSYCHIC, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], 1, true)
      .snatchable(),
    new AttackMove(MoveId.WATER_SPOUT, ElementalType.WATER, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 3)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SIGNAL_BEAM, ElementalType.BUG, MoveCategory.SPECIAL, 75, 100, 15, 10, 0, 3)
      .attr(ConfuseAttr),
    new AttackMove(MoveId.SHADOW_PUNCH, ElementalType.GHOST, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 3)
      .punchingMove(),
    new AttackMove(MoveId.EXTRASENSORY, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 20, 10, 0, 3)
      .attr(FlinchAttr),
    new AttackMove(MoveId.SKY_UPPERCUT, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 85, 90, 15, -1, 0, 3)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .punchingMove(),
    new AttackMove(MoveId.SAND_TOMB, ElementalType.GROUND, MoveCategory.PHYSICAL, 35, 85, 15, -1, 0, 3)
      .attr(TrapAttr, BattlerTagType.SAND_TOMB)
      .makesContact(false),
    new AttackMove(MoveId.SHEER_COLD, ElementalType.ICE, MoveCategory.SPECIAL, -1, 30, 5, -1, 0, 3)
      .attr(IceNoEffectTypeAttr)
      .attr(OneHitKOAttr)
      .attr(SheerColdAccuracyAttr),
    new AttackMove(MoveId.MUDDY_WATER, ElementalType.WATER, MoveCategory.SPECIAL, 90, 85, 10, 30, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BULLET_SEED, ElementalType.GRASS, MoveCategory.PHYSICAL, 25, 100, 30, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.AERIAL_ACE, ElementalType.FLYING, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 3)
      .slicingMove(),
    new AttackMove(MoveId.ICICLE_SPEAR, ElementalType.ICE, MoveCategory.PHYSICAL, 25, 100, 30, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false),
    new SelfStatusMove(MoveId.IRON_DEFENSE, ElementalType.STEEL, -1, 15, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true)
      .snatchable(),
    new StatusMove(MoveId.BLOCK, ElementalType.NORMAL, -1, 5, -1, 0, 3)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { failOnOverlap: true })
      .ignoresProtect()
      .bounceable()
      .condition(failIfGhostTypeCondition),
    new StatusMove(MoveId.HOWL, ElementalType.NORMAL, -1, 40, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK], 1)
      .soundMove()
      .target(MoveTarget.USER_AND_ALLIES)
      .snatchable(),
    new AttackMove(MoveId.DRAGON_CLAW, ElementalType.DRAGON, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 3),
    new AttackMove(MoveId.FRENZY_PLANT, ElementalType.GRASS, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 3)
      .attr(RechargeAttr),
    new SelfStatusMove(MoveId.BULK_UP, ElementalType.FIGHTING, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF], 1, true)
      .snatchable(),
    new ChargingAttackMove(MoveId.BOUNCE, ElementalType.FLYING, MoveCategory.PHYSICAL, 85, 85, 5, 30, 0, 3)
      .chargeText(i18next.t("moveTriggers:sprangUp", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.FLYING)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .condition(failOnGravityCondition),
    new AttackMove(MoveId.MUD_SHOT, ElementalType.GROUND, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPD], -1),
    new AttackMove(MoveId.POISON_TAIL, ElementalType.POISON, MoveCategory.PHYSICAL, 50, 100, 25, 10, 0, 3)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.COVET, ElementalType.NORMAL, MoveCategory.PHYSICAL, 60, 100, 25, -1, 0, 3)
      .attr(StealHeldItemChanceAttr, 0.3),
    new AttackMove(MoveId.VOLT_TACKLE, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 120, 100, 15, 10, 0, 3)
      .attr(RecoilAttr, false, 0.33)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .recklessMove(),
    new AttackMove(MoveId.MAGICAL_LEAF, ElementalType.GRASS, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 3),
    new StatusMove(MoveId.WATER_SPORT, ElementalType.WATER, -1, 15, -1, 0, 3)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.WATER_SPORT, ArenaTagRelativeSide.ALL, { turnCount: 5 })
      .target(MoveTarget.BOTH_SIDES),
    new SelfStatusMove(MoveId.CALM_MIND, ElementalType.PSYCHIC, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF], 1, true)
      .snatchable(),
    new AttackMove(MoveId.LEAF_BLADE, ElementalType.GRASS, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 3)
      .attr(HighCritAttr)
      .slicingMove(),
    new SelfStatusMove(MoveId.DRAGON_DANCE, ElementalType.DRAGON, -1, 20, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPD], 1, true)
      .danceMove()
      .snatchable(),
    new AttackMove(MoveId.ROCK_BLAST, ElementalType.ROCK, MoveCategory.PHYSICAL, 25, 90, 10, -1, 0, 3)
      .attr(MultiHitAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.SHOCK_WAVE, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 60, -1, 20, -1, 0, 3),
    new AttackMove(MoveId.WATER_PULSE, ElementalType.WATER, MoveCategory.SPECIAL, 60, 100, 20, 20, 0, 3)
      .attr(ConfuseAttr)
      .pulseMove(),
    new AttackMove(MoveId.DOOM_DESIRE, ElementalType.STEEL, MoveCategory.SPECIAL, 140, 100, 5, -1, 0, 3)
      // cannot be used on multiple Pokemon on the same side in a double battle,
      // hits immediately when called by Metronome/etc,
      // should not apply abilities or held items if user is off the field
      .partial()
      .ignoresProtect()
      .attr(
        DelayedAttackAttr,
        ChargeAnim.DOOM_DESIRE_CHARGING,
        i18next.t("moveTriggers:choseDoomDesireAsDestiny", { pokemonName: "{USER}" }),
      ),
    new AttackMove(MoveId.PSYCHO_BOOST, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 140, 90, 5, -1, 0, 3)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2, true),
    new SelfStatusMove(MoveId.ROOST, ElementalType.FLYING, -1, 5, -1, 0, 4)
      .attr(HealAttr, 0.5)
      .attr(AddBattlerTagAttr, BattlerTagType.ROOSTED, true)
      .triageMove()
      .snatchable(),
    new StatusMove(MoveId.GRAVITY, ElementalType.PSYCHIC, -1, 5, -1, 0, 4)
      .ignoresProtect()
      .attr(AddArenaTagAttr, ArenaTagType.GRAVITY, ArenaTagRelativeSide.ALL, { turnCount: 5 })
      .target(MoveTarget.BOTH_SIDES)
      .edgeCase(), // does not prevent Bounce, Fly, etc. from being selected; only causes the moves to fail.
    new StatusMove(MoveId.MIRACLE_EYE, ElementalType.PSYCHIC, -1, 40, -1, 0, 4)
      .attr(ExposedMoveAttr, BattlerTagType.IGNORE_DARK)
      .ignoresSubstitute()
      .bounceable(),
    new AttackMove(MoveId.WAKE_UP_SLAP, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 70, 100, 10, -1, 0, 4)
      .attr(MovePowerMultiplierAttr, (user, target, move) =>
        targetSleptOrComatoseCondition(user, target, move) ? 2 : 1,
      )
      .attr(HealStatusEffectAttr, false, StatusEffect.SLEEP),
    new AttackMove(MoveId.HAMMER_ARM, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPD], -1, true)
      .punchingMove(),
    new AttackMove(MoveId.GYRO_BALL, ElementalType.STEEL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4)
      .attr(GyroBallPowerAttr)
      .bulletMove(),
    new SelfStatusMove(MoveId.HEALING_WISH, ElementalType.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SacrificialFullRestoreAttr, false, "moveTriggers:sacrificialFullRestore")
      .triageMove()
      .snatchable()
      .partial(), // Does not have the effect of being stored if the incoming Pokemon is already healthy
    new AttackMove(MoveId.BRINE, ElementalType.WATER, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 4)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.getHpRatio() < 0.5 ? 2 : 1)),
    new AttackMove(MoveId.NATURAL_GIFT, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 15, -1, 0, 4)
      .makesContact(false)
      .unimplemented(),
    new AttackMove(MoveId.FEINT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 30, 100, 10, -1, 2, 4)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.PROTECTED])
      .attr(
        RemoveArenaTagsAttr,
        [...ConditionalProtectArenaTagTypes],
        ArenaTagRelativeSide.TARGET,
        MoveEffectTrigger.PRE_APPLY,
      )
      .makesContact(false)
      .ignoresProtect(),
    new AttackMove(MoveId.PLUCK, ElementalType.FLYING, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 4)
      .attr(StealEatBerryAttr),
    new StatusMove(MoveId.TAILWIND, ElementalType.FLYING, -1, 15, -1, 0, 4)
      .windMove()
      .snatchable()
      .attr(AddArenaTagAttr, ArenaTagType.TAILWIND, ArenaTagRelativeSide.USER, { turnCount: 4, failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    new StatusMove(MoveId.ACUPRESSURE, ElementalType.NORMAL, -1, 30, -1, 0, 4)
      .attr(AcupressureStatStageChangeAttr)
      .target(MoveTarget.USER_OR_NEAR_ALLY),
    new AttackMove(MoveId.METAL_BURST, ElementalType.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 4)
      .attr(CounterDamageAttr, (moveId) => allMoves.get(moveId).isAttackMove(), 1.5)
      .redirectCounter()
      .makesContact(false)
      .target(MoveTarget.ATTACKER),
    new AttackMove(MoveId.U_TURN, ElementalType.BUG, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 4)
      .attr(ForceSwitchOutAttr, true),
    new AttackMove(MoveId.CLOSE_COMBAT, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true),
    new AttackMove(MoveId.PAYBACK, ElementalType.DARK, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 4)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.turnData.acted ? 2 : 1)),
    new AttackMove(MoveId.ASSURANCE, ElementalType.DARK, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 4)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.turnData.damageTaken > 0 ? 2 : 1)),
    new StatusMove(MoveId.EMBARGO, ElementalType.DARK, 100, 15, -1, 0, 4)
      .bounceable()
      .unimplemented(),
    new AttackMove(MoveId.FLING, ElementalType.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 4)
      .makesContact(false)
      .unimplemented(),
    new StatusMove(MoveId.PSYCHO_SHIFT, ElementalType.PSYCHIC, 100, 10, -1, 0, 4)
      .attr(PsychoShiftEffectAttr)
      .condition((user, target, _move) => {
        return user.hasNonVolatileStatusEffect() && target.canSetStatus(user.getStatusEffect(), false, false, user);
      }),
    new AttackMove(MoveId.TRUMP_CARD, ElementalType.NORMAL, MoveCategory.SPECIAL, -1, -1, 5, -1, 0, 4)
      .makesContact()
      .attr(LessPPMorePowerAttr),
    new StatusMove(MoveId.HEAL_BLOCK, ElementalType.PSYCHIC, 100, 15, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.HEAL_BLOCK, false, { failOnOverlap: true, turnCountMin: 5 })
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .bounceable(),
    new AttackMove(MoveId.WRING_OUT, ElementalType.NORMAL, MoveCategory.SPECIAL, -1, 100, 5, -1, 0, 4)
      .attr(OpponentHighHpPowerAttr, 120)
      .makesContact(),
    new SelfStatusMove(MoveId.POWER_TRICK, ElementalType.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.POWER_TRICK, true)
      .snatchable(),
    new StatusMove(MoveId.GASTRO_ACID, ElementalType.POISON, 100, 10, -1, 0, 4)
      .attr(SuppressAbilitiesAttr)
      .bounceable(),
    new StatusMove(MoveId.LUCKY_CHANT, ElementalType.NORMAL, -1, 30, -1, 0, 4)
      .attr(AddArenaTagAttr, ArenaTagType.NO_CRIT, ArenaTagRelativeSide.USER, { turnCount: 5, failOnOverlap: true })
      .snatchable()
      .target(MoveTarget.USER_SIDE),
    new StatusMove(MoveId.ME_FIRST, ElementalType.NORMAL, -1, 20, -1, 0, 4)
      .attr(MeFirstAttr)
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_ENEMY),
    new SelfStatusMove(MoveId.COPYCAT, ElementalType.NORMAL, -1, 20, -1, 0, 4)
      .attr(CopycatAttr),
    new StatusMove(MoveId.POWER_SWAP, ElementalType.PSYCHIC, -1, 10, 100, 0, 4)
      .attr(SwapStatStagesAttr, [Stat.ATK, Stat.SPATK])
      .ignoresSubstitute(),
    new StatusMove(MoveId.GUARD_SWAP, ElementalType.PSYCHIC, -1, 10, 100, 0, 4)
      .attr(SwapStatStagesAttr, [Stat.DEF, Stat.SPDEF])
      .ignoresSubstitute(),
    new AttackMove(MoveId.PUNISHMENT, ElementalType.DARK, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4)
      .makesContact(true)
      .attr(PunishmentPowerAttr),
    new AttackMove(MoveId.LAST_RESORT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 140, 100, 5, -1, 0, 4)
      .attr(LastResortAttr),
    new StatusMove(MoveId.WORRY_SEED, ElementalType.GRASS, 100, 10, -1, 0, 4)
      .attr(AbilityChangeAttr, AbilityId.INSOMNIA)
      .bounceable(),
    new AttackMove(MoveId.SUCKER_PUNCH, ElementalType.DARK, MoveCategory.PHYSICAL, 70, 100, 5, -1, 1, 4)
      .condition(
        (_user, target, _move) => {
          const turnCommand = globalScene.currentBattle.turnManager.findCommandFromPokemon(target);
          if (!turnCommand || !turnCommand.turnMove) {
            return false;
          }
          return (
            turnCommand.command === BattleCommand.FIGHT
            && !target.turnData.acted
            && turnCommand.turnMove.move.category !== MoveCategory.STATUS
          );
        },
      ),
    new StatusMove(MoveId.TOXIC_SPIKES, ElementalType.POISON, -1, 20, -1, 0, 4)
      .attr(AddEntryHazardTagAttr, ArenaTagType.TOXIC_SPIKES)
      .bounceable()
      .target(MoveTarget.ENEMY_SIDE),
    new StatusMove(MoveId.HEART_SWAP, ElementalType.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SwapStatStagesAttr, BATTLE_STATS)
      .ignoresSubstitute(),
    new SelfStatusMove(MoveId.AQUA_RING, ElementalType.WATER, -1, 20, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.AQUA_RING, true, { failOnOverlap: true })
      .snatchable(),
    new SelfStatusMove(MoveId.MAGNET_RISE, ElementalType.ELECTRIC, -1, 10, -1, 0, 4)
      .attr(AddBattlerTagAttr, BattlerTagType.FLOATING, true, { failOnOverlap: true, turnCountMin: 5 })
      .condition(
        (user, _target, _move) =>
          !globalScene.arena.getTag(ArenaTagType.GRAVITY)
          && [BattlerTagType.FLOATING, BattlerTagType.IGNORE_FLYING, BattlerTagType.INGRAIN].every(
            (tag) => !user.getTag(tag),
          ),
      )
      .snatchable(),
    new AttackMove(MoveId.FLARE_BLITZ, ElementalType.FIRE, MoveCategory.PHYSICAL, 120, 100, 15, 10, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .recklessMove(),
    new AttackMove(MoveId.FORCE_PALM, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.AURA_SPHERE, ElementalType.FIGHTING, MoveCategory.SPECIAL, 80, -1, 20, -1, 0, 4)
      .pulseMove()
      .bulletMove(),
    new SelfStatusMove(MoveId.ROCK_POLISH, ElementalType.ROCK, -1, 20, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true)
      .snatchable(),
    new AttackMove(MoveId.POISON_JAB, ElementalType.POISON, MoveCategory.PHYSICAL, 80, 100, 20, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.DARK_PULSE, ElementalType.DARK, MoveCategory.SPECIAL, 80, 100, 15, 20, 0, 4)
      .attr(FlinchAttr)
      .pulseMove(),
    new AttackMove(MoveId.NIGHT_SLASH, ElementalType.DARK, MoveCategory.PHYSICAL, 70, 100, 15, -1, 0, 4)
      .attr(HighCritAttr)
      .slicingMove(),
    new AttackMove(MoveId.AQUA_TAIL, ElementalType.WATER, MoveCategory.PHYSICAL, 90, 90, 10, -1, 0, 4),
    new AttackMove(MoveId.SEED_BOMB, ElementalType.GRASS, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 4)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.AIR_SLASH, ElementalType.FLYING, MoveCategory.SPECIAL, 75, 95, 15, 30, 0, 4)
      .attr(FlinchAttr)
      .slicingMove(),
    new AttackMove(MoveId.X_SCISSOR, ElementalType.BUG, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 4)
      .slicingMove(),
    new AttackMove(MoveId.BUG_BUZZ, ElementalType.BUG, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .soundMove(),
    new AttackMove(MoveId.DRAGON_PULSE, ElementalType.DRAGON, MoveCategory.SPECIAL, 85, 100, 10, -1, 0, 4)
      .pulseMove(),
    new AttackMove(MoveId.DRAGON_RUSH, ElementalType.DRAGON, MoveCategory.PHYSICAL, 100, 75, 10, 20, 0, 4)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new AttackMove(MoveId.POWER_GEM, ElementalType.ROCK, MoveCategory.SPECIAL, 80, 100, 20, -1, 0, 4),
    new AttackMove(MoveId.DRAIN_PUNCH, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 4)
      .attr(HitHealAttr)
      .punchingMove()
      .triageMove(),
    new AttackMove(MoveId.VACUUM_WAVE, ElementalType.FIGHTING, MoveCategory.SPECIAL, 40, 100, 30, -1, 1, 4),
    new AttackMove(MoveId.FOCUS_BLAST, ElementalType.FIGHTING, MoveCategory.SPECIAL, 120, 70, 5, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .bulletMove(),
    new AttackMove(MoveId.ENERGY_BALL, ElementalType.GRASS, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1)
      .bulletMove(),
    new AttackMove(MoveId.BRAVE_BIRD, ElementalType.FLYING, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(MoveId.EARTH_POWER, ElementalType.GROUND, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1),
    new StatusMove(MoveId.SWITCHEROO, ElementalType.DARK, 100, 10, -1, 0, 4)
      .unimplemented(),
    new AttackMove(MoveId.GIGA_IMPACT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 150, 90, 5, -1, 0, 4)
      .attr(RechargeAttr),
    new SelfStatusMove(MoveId.NASTY_PLOT, ElementalType.DARK, -1, 20, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPATK], 2, true)
      .snatchable(),
    new AttackMove(MoveId.BULLET_PUNCH, ElementalType.STEEL, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4)
      .punchingMove(),
    new AttackMove(MoveId.AVALANCHE, ElementalType.ICE, MoveCategory.PHYSICAL, 60, 100, 10, -1, -4, 4)
      .attr(TurnDamagedDoublePowerAttr),
    new AttackMove(MoveId.ICE_SHARD, ElementalType.ICE, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4)
      .makesContact(false),
    new AttackMove(MoveId.SHADOW_CLAW, ElementalType.GHOST, MoveCategory.PHYSICAL, 70, 100, 15, -1, 0, 4)
      .attr(HighCritAttr),
    new AttackMove(MoveId.THUNDER_FANG, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .bitingMove(),
    new AttackMove(MoveId.ICE_FANG, ElementalType.ICE, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .bitingMove(),
    new AttackMove(MoveId.FIRE_FANG, ElementalType.FIRE, MoveCategory.PHYSICAL, 65, 95, 15, 10, 0, 4)
      .attr(FlinchAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .bitingMove(),
    new AttackMove(MoveId.SHADOW_SNEAK, ElementalType.GHOST, MoveCategory.PHYSICAL, 40, 100, 30, -1, 1, 4),
    new AttackMove(MoveId.MUD_BOMB, ElementalType.GROUND, MoveCategory.SPECIAL, 65, 85, 10, 30, 0, 4)
      .attr(StatStageChangeAttr, [Stat.ACC], -1)
      .bulletMove(),
    new AttackMove(MoveId.PSYCHO_CUT, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 4)
      .attr(HighCritAttr)
      .slicingMove()
      .makesContact(false),
    new AttackMove(MoveId.ZEN_HEADBUTT, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, 80, 90, 15, 20, 0, 4)
      .attr(FlinchAttr),
    new AttackMove(MoveId.MIRROR_SHOT, ElementalType.STEEL, MoveCategory.SPECIAL, 65, 85, 10, 30, 0, 4)
      .attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(MoveId.FLASH_CANNON, ElementalType.STEEL, MoveCategory.SPECIAL, 80, 100, 10, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1),
    new AttackMove(MoveId.ROCK_CLIMB, ElementalType.NORMAL, MoveCategory.PHYSICAL, 90, 85, 20, 20, 0, 4)
      .attr(ConfuseAttr),
    new StatusMove(MoveId.DEFOG, ElementalType.FLYING, -1, 15, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.EVA], -1)
      .attr(ClearWeatherAttr, WeatherType.FOG)
      .attr(ClearTerrainAttr)
      .attr(RemoveScreensAttr, false)
      .attr(RemoveEntryHazardAttr, true)
      .attr(RemoveArenaTagsAttr, [ArenaTagType.SAFEGUARD, ArenaTagType.MIST], ArenaTagRelativeSide.TARGET)
      .bounceable(),
    new StatusMove(MoveId.TRICK_ROOM, ElementalType.PSYCHIC, -1, 5, -1, -7, 4)
      .attr(AddArenaTagAttr, ArenaTagType.TRICK_ROOM, ArenaTagRelativeSide.ALL, { turnCount: 5 })
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.DRACO_METEOR, ElementalType.DRAGON, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2, true),
    new AttackMove(MoveId.DISCHARGE, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.LAVA_PLUME, ElementalType.FIRE, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.LEAF_STORM, ElementalType.GRASS, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2, true),
    new AttackMove(MoveId.POWER_WHIP, ElementalType.GRASS, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 4),
    new AttackMove(MoveId.ROCK_WRECKER, ElementalType.ROCK, MoveCategory.PHYSICAL, 150, 90, 5, -1, 0, 4)
      .attr(RechargeAttr)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.CROSS_POISON, ElementalType.POISON, MoveCategory.PHYSICAL, 70, 100, 20, 10, 0, 4)
      .attr(HighCritAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .slicingMove(),
    new AttackMove(MoveId.GUNK_SHOT, ElementalType.POISON, MoveCategory.PHYSICAL, 120, 80, 5, 30, 0, 4)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.IRON_HEAD, ElementalType.STEEL, MoveCategory.PHYSICAL, 80, 100, 15, 30, 0, 4)
      .attr(FlinchAttr),
    new AttackMove(MoveId.MAGNET_BOMB, ElementalType.STEEL, MoveCategory.PHYSICAL, 60, -1, 20, -1, 0, 4)
      .makesContact(false)
      .bulletMove(),
    new AttackMove(MoveId.STONE_EDGE, ElementalType.ROCK, MoveCategory.PHYSICAL, 100, 80, 5, -1, 0, 4)
      .attr(HighCritAttr)
      .makesContact(false),
    new StatusMove(MoveId.CAPTIVATE, ElementalType.NORMAL, 100, 20, -1, 0, 4)
      .attr(CaptivateAttr)
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.STEALTH_ROCK, ElementalType.ROCK, -1, 20, -1, 0, 4)
      .attr(AddEntryHazardTagAttr, ArenaTagType.STEALTH_ROCK)
      .target(MoveTarget.ENEMY_SIDE)
      .bounceable(),
    new AttackMove(MoveId.GRASS_KNOT, ElementalType.GRASS, MoveCategory.SPECIAL, -1, 100, 20, -1, 0, 4)
      .condition(failOnMaxCondition)
      .attr(WeightPowerAttr)
      .makesContact(),
    new AttackMove(MoveId.CHATTER, ElementalType.FLYING, MoveCategory.SPECIAL, 65, 100, 20, 100, 0, 4)
      .attr(ConfuseAttr)
      .soundMove(),
    new AttackMove(MoveId.JUDGMENT, ElementalType.NORMAL, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 4)
      .attr(FormChangeItemTypeAttr),
    new AttackMove(MoveId.BUG_BITE, ElementalType.BUG, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 4)
      .attr(StealEatBerryAttr),
    new AttackMove(MoveId.CHARGE_BEAM, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 50, 90, 10, 70, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true),
    new AttackMove(MoveId.WOOD_HAMMER, ElementalType.GRASS, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 4)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(MoveId.AQUA_JET, ElementalType.WATER, MoveCategory.PHYSICAL, 40, 100, 20, -1, 1, 4),
    new AttackMove(MoveId.ATTACK_ORDER, ElementalType.BUG, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 4)
      .attr(HighCritAttr)
      .makesContact(false),
    new SelfStatusMove(MoveId.DEFEND_ORDER, ElementalType.BUG, -1, 10, -1, 0, 4)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], 1, true)
      .snatchable(),
    new SelfStatusMove(MoveId.HEAL_ORDER, ElementalType.BUG, -1, 10, -1, 0, 4)
      .attr(HealAttr, 0.5)
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.HEAD_SMASH, ElementalType.ROCK, MoveCategory.PHYSICAL, 150, 80, 5, -1, 0, 4)
      .attr(RecoilAttr, false, 0.5)
      .recklessMove(),
    new AttackMove(MoveId.DOUBLE_HIT, ElementalType.NORMAL, MoveCategory.PHYSICAL, 35, 90, 10, -1, 0, 4)
      .attr(MultiHitAttr, MultiHitType._2),
    new AttackMove(MoveId.ROAR_OF_TIME, ElementalType.DRAGON, MoveCategory.SPECIAL, 150, 90, 5, -1, 0, 4)
      .attr(RechargeAttr),
    new AttackMove(MoveId.SPACIAL_REND, ElementalType.DRAGON, MoveCategory.SPECIAL, 100, 95, 5, -1, 0, 4)
      .attr(HighCritAttr),
    new SelfStatusMove(MoveId.LUNAR_DANCE, ElementalType.PSYCHIC, -1, 10, -1, 0, 4)
      .attr(SacrificialFullRestoreAttr, true, "moveTriggers:lunarDanceRestore")
      .danceMove()
      .triageMove()
      .snatchable()
      .partial(), // Does not have the effect of being stored if the incoming Pokemon is already perfectly healthy
    new AttackMove(MoveId.CRUSH_GRIP, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, 100, 5, -1, 0, 4)
      .attr(OpponentHighHpPowerAttr, 120),
    new AttackMove(MoveId.MAGMA_STORM, ElementalType.FIRE, MoveCategory.SPECIAL, 100, 75, 5, -1, 0, 4)
      .attr(TrapAttr, BattlerTagType.MAGMA_STORM),
    new StatusMove(MoveId.DARK_VOID, ElementalType.DARK, 80, 10, -1, 0, 4) // Accuracy from Generations 4-6
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SEED_FLARE, ElementalType.GRASS, MoveCategory.SPECIAL, 120, 85, 5, 40, 0, 4)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2),
    new AttackMove(MoveId.OMINOUS_WIND, ElementalType.GHOST, MoveCategory.SPECIAL, 60, 100, 5, 10, 0, 4)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .windMove(),
    new ChargingAttackMove(MoveId.SHADOW_FORCE, ElementalType.GHOST, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 4)
      .chargeText(i18next.t("moveTriggers:vanishedInstantly", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.HIDDEN)
      .ignoresProtect(),
    new SelfStatusMove(MoveId.HONE_CLAWS, ElementalType.DARK, -1, 15, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.ACC], 1, true)
      .snatchable(),
    new StatusMove(MoveId.WIDE_GUARD, ElementalType.ROCK, -1, 10, -1, 3, 5)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.WIDE_GUARD, ArenaTagRelativeSide.USER, { turnCount: 1, failOnOverlap: true })
      .snatchable()
      .condition(failIfLastCondition),
    new StatusMove(MoveId.GUARD_SPLIT, ElementalType.PSYCHIC, -1, 10, -1, 0, 5)
      .attr(AverageStatsAttr, [Stat.DEF, Stat.SPDEF], "moveTriggers:sharedGuard"),
    new StatusMove(MoveId.POWER_SPLIT, ElementalType.PSYCHIC, -1, 10, -1, 0, 5)
      .attr(AverageStatsAttr, [Stat.ATK, Stat.SPATK], "moveTriggers:sharedPower"),
    new StatusMove(MoveId.WONDER_ROOM, ElementalType.PSYCHIC, -1, 10, -1, 0, 5)
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .unimplemented(),
    new AttackMove(MoveId.PSYSHOCK, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(DealsPhysicalDamageAttr),
    new AttackMove(MoveId.VENOSHOCK, ElementalType.POISON, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 5)
      .attr(
        MovePowerMultiplierAttr,
        (_user, target, _move) => (target.hasStatusEffect([StatusEffect.POISON, StatusEffect.TOXIC]) ? 2 : 1),
      ),
    new SelfStatusMove(MoveId.AUTOTOMIZE, ElementalType.STEEL, -1, 15, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true)
      .attr(AddBattlerTagAttr, BattlerTagType.AUTOTOMIZED, true)
      .snatchable(),
    new SelfStatusMove(MoveId.RAGE_POWDER, ElementalType.BUG, -1, 20, -1, 2, 5)
      .powderMove()
      .attr(AddBattlerTagAttr, BattlerTagType.CENTER_OF_ATTENTION, true),
    new StatusMove(MoveId.TELEKINESIS, ElementalType.PSYCHIC, -1, 15, -1, 0, 5)
      .condition(failOnGravityCondition)
      .condition(
        (_user, target, _move) =>
          ![
            SpeciesId.DIGLETT,
            SpeciesId.DUGTRIO,
            SpeciesId.ALOLA_DIGLETT,
            SpeciesId.ALOLA_DUGTRIO,
            SpeciesId.SANDYGAST,
            SpeciesId.PALOSSAND,
            SpeciesId.WIGLETT,
            SpeciesId.WUGTRIO,
          ].includes(target.species.speciesId),
      )
      .condition(
        (_user, target, _move) => !(target.species.speciesId === SpeciesId.GENGAR && target.getFormKey() === "mega"),
      )
      .condition(
        (_user, target, _move) =>
          isNullOrUndefined(target.getTag(BattlerTagType.INGRAIN))
          && isNullOrUndefined(target.getTag(BattlerTagType.IGNORE_FLYING)),
      )
      .attr(AddBattlerTagAttr, BattlerTagType.TELEKINESIS, false, { failOnOverlap: true, turnCountMin: 3 })
      .attr(AddBattlerTagAttr, BattlerTagType.FLOATING, false, { failOnOverlap: true, turnCountMin: 3 })
      .bounceable(),
    new StatusMove(MoveId.MAGIC_ROOM, ElementalType.PSYCHIC, -1, 10, -1, 0, 5)
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .unimplemented(),
    new AttackMove(MoveId.SMACK_DOWN, ElementalType.ROCK, MoveCategory.PHYSICAL, 50, 100, 15, -1, 0, 5)
      .attr(AddBattlerTagAttr, BattlerTagType.IGNORE_FLYING, false, { lastHitOnly: true })
      .attr(AddBattlerTagAttr, BattlerTagType.INTERRUPTED)
      .attr(RemoveBattlerTagAttr, [BattlerTagType.FLYING, BattlerTagType.FLOATING, BattlerTagType.TELEKINESIS])
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .makesContact(false)
      .edgeCase(), // Should hit a Pokemon lifted up by Sky Drop without permanently grounding it
    new AttackMove(MoveId.STORM_THROW, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 5)
      .attr(CritOnlyAttr),
    new AttackMove(MoveId.FLAME_BURST, ElementalType.FIRE, MoveCategory.SPECIAL, 70, 100, 15, -1, 0, 5)
      .attr(FlameBurstAttr),
    new AttackMove(MoveId.SLUDGE_WAVE, ElementalType.POISON, MoveCategory.SPECIAL, 95, 100, 10, 10, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new SelfStatusMove(MoveId.QUIVER_DANCE, ElementalType.BUG, -1, 20, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .danceMove()
      .snatchable(),
    new AttackMove(MoveId.HEAVY_SLAM, ElementalType.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 5)
      .condition(failOnMaxCondition)
      .attr(AlwaysHitMinimizeAttr)
      .attr(CompareWeightPowerAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED),
    new AttackMove(MoveId.SYNCHRONOISE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 120, 100, 10, -1, 0, 5)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .condition(unknownTypeCondition)
      .attr(HitsSameTypeAttr),
    new AttackMove(MoveId.ELECTRO_BALL, ElementalType.ELECTRIC, MoveCategory.SPECIAL, -1, 100, 10, -1, 0, 5)
      .attr(ElectroBallPowerAttr)
      .bulletMove(),
    new StatusMove(MoveId.SOAK, ElementalType.WATER, 100, 20, -1, 0, 5)
      .attr(ChangeTypeAttr, ElementalType.WATER)
      .bounceable(),
    new AttackMove(MoveId.FLAME_CHARGE, ElementalType.FIRE, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true),
    new SelfStatusMove(MoveId.COIL, ElementalType.POISON, -1, 20, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.ACC], 1, true)
      .snatchable(),
    new AttackMove(MoveId.LOW_SWEEP, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 65, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1),
    new AttackMove(MoveId.ACID_SPRAY, ElementalType.POISON, MoveCategory.SPECIAL, 40, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2)
      .bulletMove(),
    new AttackMove(MoveId.FOUL_PLAY, ElementalType.DARK, MoveCategory.PHYSICAL, 95, 100, 15, -1, 0, 5)
      .attr(TargetAtkUserAtkAttr),
    new StatusMove(MoveId.SIMPLE_BEAM, ElementalType.NORMAL, 100, 15, -1, 0, 5)
      .attr(AbilityChangeAttr, AbilityId.SIMPLE)
      .bounceable(),
    new StatusMove(MoveId.ENTRAINMENT, ElementalType.NORMAL, 100, 15, -1, 0, 5)
      .condition(failOnMaxCondition)
      .attr(AbilityGiveAttr)
      .bounceable(),
    new StatusMove(MoveId.AFTER_YOU, ElementalType.NORMAL, -1, 15, -1, 0, 5)
      .ignoresProtect()
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_OTHER)
      .condition(failIfSingleBattle)
      .condition((_user, target, _move) => !target.turnData.acted)
      .attr(AfterYouAttr),
    new AttackMove(MoveId.ROUND, ElementalType.NORMAL, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 5)
      .attr(CueNextRoundAttr)
      .attr(RoundPowerAttr)
      .soundMove(),
    new AttackMove(MoveId.ECHOED_VOICE, ElementalType.NORMAL, MoveCategory.SPECIAL, 40, 100, 15, -1, 0, 5)
      .attr(ConsecutiveUseMultiBasePowerAttr, 5, false)
      .soundMove(),
    new AttackMove(MoveId.CHIP_AWAY, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 5)
      .attr(IgnoreOpponentStatStagesAttr),
    new AttackMove(MoveId.CLEAR_SMOG, ElementalType.POISON, MoveCategory.SPECIAL, 50, -1, 15, -1, 0, 5)
      .attr(ResetStatsAttr, false),
    new AttackMove(MoveId.STORED_POWER, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 20, 100, 10, -1, 0, 5)
      .attr(PositiveStatStagePowerAttr),
    new StatusMove(MoveId.QUICK_GUARD, ElementalType.FIGHTING, -1, 15, -1, 3, 5)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.QUICK_GUARD, ArenaTagRelativeSide.USER, { turnCount: 1, failOnOverlap: true })
      .snatchable()
      .condition(failIfLastCondition),
    new SelfStatusMove(MoveId.ALLY_SWITCH, ElementalType.PSYCHIC, -1, 15, -1, 2, 5)
      .ignoresProtect()
      .unimplemented(),
    new AttackMove(MoveId.SCALD, ElementalType.WATER, MoveCategory.SPECIAL, 80, 100, 15, 30, 0, 5)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new SelfStatusMove(MoveId.SHELL_SMASH, ElementalType.NORMAL, -1, 15, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK, Stat.SPD], 2, true)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true)
      .snatchable(),
    new StatusMove(MoveId.HEAL_PULSE, ElementalType.PSYCHIC, -1, 10, -1, 0, 5)
      .attr(HealAttr, 0.5, false, false)
      .pulseMove()
      .triageMove()
      .bounceable(),
    new AttackMove(MoveId.HEX, ElementalType.GHOST, MoveCategory.SPECIAL, 65, 100, 10, -1, 0, 5)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.hasNonVolatileStatusEffect() ? 2 : 1)),
    new ChargingAttackMove(MoveId.SKY_DROP, ElementalType.FLYING, MoveCategory.PHYSICAL, 60, 100, 10, -1, 0, 5)
      .chargeText(i18next.t("moveTriggers:tookTargetIntoSky", { pokemonName: "{USER}", targetName: "{TARGET}" }))
      .chargeAttr(SkyDropAttr)
      .attr(NoDamageAgainstFlyingAttr)
      .attr(BypassRedirectAttr)
      .doesHitCheckOnCharge(),
    new SelfStatusMove(MoveId.SHIFT_GEAR, ElementalType.STEEL, -1, 10, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .attr(StatStageChangeAttr, [Stat.SPD], 2, true)
      .snatchable(),
    new AttackMove(MoveId.CIRCLE_THROW, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 60, 90, 10, -1, -6, 5)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .hidesTarget(),
    new AttackMove(MoveId.INCINERATE, ElementalType.FIRE, MoveCategory.SPECIAL, 60, 100, 15, -1, 0, 5)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(RemoveHeldItemAttr, true),
    new StatusMove(MoveId.QUASH, ElementalType.DARK, 100, 15, -1, 0, 5)
      .attr(QuashAttr),
    new AttackMove(MoveId.ACROBATICS, ElementalType.FLYING, MoveCategory.PHYSICAL, 55, 100, 15, -1, 0, 5)
      .attr(
        MovePowerMultiplierAttr,
        (user, _target, _move) => {
          const heldItems = user.getHeldItems().filter((i) => i.isTransferable).reduce((v, m) => v + m.stackCount, 0);
          return Math.max(1, 2 - 0.2 * heldItems);
        },
      ),
    new StatusMove(MoveId.REFLECT_TYPE, ElementalType.NORMAL, -1, 15, -1, 0, 5)
      .ignoresSubstitute()
      .attr(CopyTypeAttr),
    new AttackMove(MoveId.RETALIATE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 70, 100, 5, -1, 0, 5)
      .attr(
        MovePowerMultiplierAttr,
        (user, _target, _move) => {
          const { currentBattle } = globalScene;
          const { turn, enemyFaintsHistory, playerFaintsHistory } = currentBattle;
          const lastPlayerFaint = playerFaintsHistory.at(-1);
          const lastEnemyFaint = enemyFaintsHistory.at(-1);

          if (user.isPlayer()) {
            return (lastPlayerFaint !== undefined && turn - lastPlayerFaint.turn === 1) ? 2 : 1;
          }

          return (lastEnemyFaint !== undefined && turn - lastEnemyFaint.turn === 1) ? 2 : 1;
        },
      ),
    new AttackMove(MoveId.FINAL_GAMBIT, ElementalType.FIGHTING, MoveCategory.SPECIAL, -1, 100, 5, -1, 0, 5)
      .attr(UserHpDamageAttr)
      .attr(SacrificialAttr, true),
    new StatusMove(MoveId.BESTOW, ElementalType.NORMAL, -1, 15, -1, 0, 5)
      .ignoresProtect()
      .ignoresSubstitute()
      .unimplemented(),
    new AttackMove(MoveId.INFERNO, ElementalType.FIRE, MoveCategory.SPECIAL, 100, 50, 5, 100, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.WATER_PLEDGE, ElementalType.WATER, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.WATER_FIRE_PLEDGE, MoveId.FIRE_PLEDGE, ArenaTagRelativeSide.USER)
      .attr(AddPledgeEffectAttr, ArenaTagType.GRASS_WATER_PLEDGE, MoveId.GRASS_PLEDGE, ArenaTagRelativeSide.TARGET)
      .attr(BypassRedirectAttr, true),
    new AttackMove(MoveId.FIRE_PLEDGE, ElementalType.FIRE, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.FIRE_GRASS_PLEDGE, MoveId.GRASS_PLEDGE, ArenaTagRelativeSide.TARGET)
      .attr(AddPledgeEffectAttr, ArenaTagType.WATER_FIRE_PLEDGE, MoveId.WATER_PLEDGE, ArenaTagRelativeSide.USER)
      .attr(BypassRedirectAttr, true),
    new AttackMove(MoveId.GRASS_PLEDGE, ElementalType.GRASS, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 5)
      .attr(AwaitCombinedPledgeAttr)
      .attr(CombinedPledgeTypeAttr)
      .attr(CombinedPledgePowerAttr)
      .attr(CombinedPledgeStabBoostAttr)
      .attr(AddPledgeEffectAttr, ArenaTagType.GRASS_WATER_PLEDGE, MoveId.WATER_PLEDGE, ArenaTagRelativeSide.TARGET)
      .attr(AddPledgeEffectAttr, ArenaTagType.FIRE_GRASS_PLEDGE, MoveId.FIRE_PLEDGE, ArenaTagRelativeSide.TARGET)
      .attr(BypassRedirectAttr, true),
    new AttackMove(MoveId.VOLT_SWITCH, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 20, -1, 0, 5)
      .attr(ForceSwitchOutAttr, true),
    new AttackMove(MoveId.STRUGGLE_BUG, ElementalType.BUG, MoveCategory.SPECIAL, 50, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BULLDOZE, ElementalType.GROUND, MoveCategory.PHYSICAL, 60, 100, 20, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        globalScene.arena.hasTerrain(TerrainType.GRASSY) && target.isGrounded() ? 0.5 : 1,
      )
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FROST_BREATH, ElementalType.ICE, MoveCategory.SPECIAL, 60, 90, 10, -1, 0, 5)
      .attr(CritOnlyAttr),
    new AttackMove(MoveId.DRAGON_TAIL, ElementalType.DRAGON, MoveCategory.PHYSICAL, 60, 90, 10, -1, -6, 5)
      .attr(ForceSwitchOutAttr, false, SwitchType.FORCE_SWITCH)
      .hidesTarget(),
    new SelfStatusMove(MoveId.WORK_UP, ElementalType.NORMAL, -1, 30, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 1, true)
      .snatchable(),
    new AttackMove(MoveId.ELECTROWEB, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.WILD_CHARGE, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 5)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.DRILL_RUN, ElementalType.GROUND, MoveCategory.PHYSICAL, 80, 95, 10, -1, 0, 5)
      .attr(HighCritAttr),
    new AttackMove(MoveId.DUAL_CHOP, ElementalType.DRAGON, MoveCategory.PHYSICAL, 40, 90, 15, -1, 0, 5)
      .attr(MultiHitAttr, MultiHitType._2),
    new AttackMove(MoveId.HEART_STAMP, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, 60, 100, 25, 30, 0, 5)
      .attr(FlinchAttr),
    new AttackMove(MoveId.HORN_LEECH, ElementalType.GRASS, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 5)
      .attr(HitHealAttr)
      .triageMove(),
    new AttackMove(MoveId.SACRED_SWORD, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 5)
      .attr(IgnoreOpponentStatStagesAttr)
      .slicingMove(),
    new AttackMove(MoveId.RAZOR_SHELL, ElementalType.WATER, MoveCategory.PHYSICAL, 75, 95, 10, 50, 0, 5)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .slicingMove(),
    new AttackMove(MoveId.HEAT_CRASH, ElementalType.FIRE, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 5)
      .condition(failOnMaxCondition)
      .attr(AlwaysHitMinimizeAttr)
      .attr(CompareWeightPowerAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED),
    new AttackMove(MoveId.LEAF_TORNADO, ElementalType.GRASS, MoveCategory.SPECIAL, 65, 90, 10, 50, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(MoveId.STEAMROLLER, ElementalType.BUG, MoveCategory.PHYSICAL, 65, 100, 20, 30, 0, 5)
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .attr(FlinchAttr),
    new SelfStatusMove(MoveId.COTTON_GUARD, ElementalType.GRASS, -1, 10, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.DEF], 3, true)
      .snatchable(),
    new AttackMove(MoveId.NIGHT_DAZE, ElementalType.DARK, MoveCategory.SPECIAL, 85, 95, 10, 40, 0, 5)
      .attr(StatStageChangeAttr, [Stat.ACC], -1),
    new AttackMove(MoveId.PSYSTRIKE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 5)
      .attr(DealsPhysicalDamageAttr),
    new AttackMove(MoveId.TAIL_SLAP, ElementalType.NORMAL, MoveCategory.PHYSICAL, 25, 85, 10, -1, 0, 5)
      .attr(MultiHitAttr),
    new AttackMove(MoveId.HURRICANE, ElementalType.FLYING, MoveCategory.SPECIAL, 110, 70, 10, 30, 0, 5)
      .attr(ThunderAccuracyAttr)
      .attr(ConfuseAttr)
      .attr(HitsTagAttr, BattlerTagType.FLYING)
      .attr(HitsTagAttr, BattlerTagType.SKY_DROP)
      .windMove(),
    new AttackMove(MoveId.HEAD_CHARGE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 15, -1, 0, 5)
      .attr(RecoilAttr)
      .recklessMove(),
    new AttackMove(MoveId.GEAR_GRIND, ElementalType.STEEL, MoveCategory.PHYSICAL, 50, 85, 15, -1, 0, 5)
      .attr(MultiHitAttr, MultiHitType._2),
    new AttackMove(MoveId.SEARING_SHOT, ElementalType.FIRE, MoveCategory.SPECIAL, 100, 100, 5, 30, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .bulletMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.TECHNO_BLAST, ElementalType.NORMAL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 5)
      .attr(TechnoBlastTypeAttr),
    new AttackMove(MoveId.RELIC_SONG, ElementalType.NORMAL, MoveCategory.SPECIAL, 75, 100, 10, 10, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SECRET_SWORD, ElementalType.FIGHTING, MoveCategory.SPECIAL, 85, 100, 10, -1, 0, 5)
      .attr(DealsPhysicalDamageAttr)
      .slicingMove(),
    new AttackMove(MoveId.GLACIATE, ElementalType.ICE, MoveCategory.SPECIAL, 65, 95, 10, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.BOLT_STRIKE, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 130, 85, 5, 20, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.BLUE_FLARE, ElementalType.FIRE, MoveCategory.SPECIAL, 130, 85, 5, 20, 0, 5)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.FIERY_DANCE, ElementalType.FIRE, MoveCategory.SPECIAL, 80, 100, 10, 50, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .danceMove(),
    new ChargingAttackMove(MoveId.FREEZE_SHOCK, ElementalType.ICE, MoveCategory.PHYSICAL, 140, 90, 5, 30, 0, 5)
      .chargeText(i18next.t("moveTriggers:becameCloakedInFreezingLight", { pokemonName: "{USER}" }))
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .makesContact(false),
    new ChargingAttackMove(MoveId.ICE_BURN, ElementalType.ICE, MoveCategory.SPECIAL, 140, 90, 5, 30, 0, 5)
      .chargeText(i18next.t("moveTriggers:becameCloakedInFreezingAir", { pokemonName: "{USER}" }))
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.SNARL, ElementalType.DARK, MoveCategory.SPECIAL, 55, 95, 15, 100, 0, 5)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.ICICLE_CRASH, ElementalType.ICE, MoveCategory.PHYSICAL, 85, 90, 10, 30, 0, 5)
      .attr(FlinchAttr)
      .makesContact(false),
    new AttackMove(MoveId.V_CREATE, ElementalType.FIRE, MoveCategory.PHYSICAL, 180, 95, 5, -1, 0, 5)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF, Stat.SPD], -1, true),
    new AttackMove(MoveId.FUSION_FLARE, ElementalType.FIRE, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 5)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(LastMoveDoublePowerAttr, MoveId.FUSION_BOLT),
    new AttackMove(MoveId.FUSION_BOLT, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 5)
      .attr(LastMoveDoublePowerAttr, MoveId.FUSION_FLARE)
      .makesContact(false),
    new AttackMove(MoveId.FLYING_PRESS, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 100, 95, 10, -1, 0, 6)
      .attr(AlwaysHitMinimizeAttr)
      .attr(FlyingTypeMultiplierAttr)
      .attr(HitsTagForDoubleDamageAttr, BattlerTagType.MINIMIZED)
      .condition(failOnGravityCondition),
    new StatusMove(MoveId.MAT_BLOCK, ElementalType.FIGHTING, -1, 10, -1, 0, 6)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.MAT_BLOCK, ArenaTagRelativeSide.USER, { turnCount: 1, failOnOverlap: true })
      .snatchable()
      .condition(new FirstMoveCondition())
      .condition(failIfLastCondition),
    new AttackMove(MoveId.BELCH, ElementalType.POISON, MoveCategory.SPECIAL, 120, 90, 10, -1, 0, 6)
      .condition((user, _target, _move) => user.battleData.berriesEaten.length > 0),
    new StatusMove(MoveId.ROTOTILLER, ElementalType.GROUND, -1, 10, -1, 0, 6)
      .target(MoveTarget.ALL)
      .condition((_user, _target, _move) => {
        // If any fielded pokémon is grass-type and grounded.
        return [...globalScene.getEnemyParty(), ...globalScene.getPlayerParty()].some(
          (poke) => poke.isOfType(ElementalType.GRASS) && poke.isGrounded(),
        );
      })
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 1, false, {
        condition: (_user, target, _move) => target.isOfType(ElementalType.GRASS) && target.isGrounded(),
      }),
    new StatusMove(MoveId.STICKY_WEB, ElementalType.BUG, -1, 20, -1, 0, 6)
      .attr(AddEntryHazardTagAttr, ArenaTagType.STICKY_WEB)
      .bounceable()
      .target(MoveTarget.ENEMY_SIDE),
    new AttackMove(MoveId.FELL_STINGER, ElementalType.BUG, MoveCategory.PHYSICAL, 50, 100, 25, -1, 0, 6)
      .attr(PostVictoryStatStageChangeAttr, [Stat.ATK], 3, true),
    new ChargingAttackMove(MoveId.PHANTOM_FORCE, ElementalType.GHOST, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .chargeText(i18next.t("moveTriggers:vanishedInstantly", { pokemonName: "{USER}" }))
      .chargeAttr(SemiInvulnerableAttr, BattlerTagType.HIDDEN)
      .ignoresProtect(),
    new StatusMove(MoveId.TRICK_OR_TREAT, ElementalType.GHOST, 100, 20, -1, 0, 6)
      .attr(AddTypeAttr, ElementalType.GHOST)
      .bounceable(),
    new StatusMove(MoveId.NOBLE_ROAR, ElementalType.NORMAL, 100, 30, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1)
      .soundMove()
      .bounceable(),
    new StatusMove(MoveId.ION_DELUGE, ElementalType.ELECTRIC, -1, 25, -1, 1, 6)
      .attr(AddArenaTagAttr, ArenaTagType.ION_DELUGE, ArenaTagRelativeSide.ALL, { turnCount: 1 })
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.PARABOLIC_CHARGE, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 65, 100, 20, -1, 0, 6)
      .attr(HitHealAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .triageMove(),
    new StatusMove(MoveId.FORESTS_CURSE, ElementalType.GRASS, 100, 20, -1, 0, 6)
      .attr(AddTypeAttr, ElementalType.GRASS)
      .bounceable(),
    new AttackMove(MoveId.PETAL_BLIZZARD, ElementalType.GRASS, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 6)
      .windMove()
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.FREEZE_DRY, ElementalType.ICE, MoveCategory.SPECIAL, 70, 100, 20, 10, 0, 6)
      .attr(StatusEffectAttr, StatusEffect.FREEZE)
      .attr(FreezeDryAttr),
    new AttackMove(MoveId.DISARMING_VOICE, ElementalType.FAIRY, MoveCategory.SPECIAL, 40, -1, 15, -1, 0, 6)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.PARTING_SHOT, ElementalType.DARK, 100, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1, false, { trigger: MoveEffectTrigger.PRE_APPLY })
      .attr(ForceSwitchOutAttr, true)
      .soundMove()
      .bounceable(),
    new StatusMove(MoveId.TOPSY_TURVY, ElementalType.DARK, -1, 20, -1, 0, 6)
      .attr(InvertStatsAttr)
      .bounceable(),
    new AttackMove(MoveId.DRAINING_KISS, ElementalType.FAIRY, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 6)
      .attr(HitHealAttr, 0.75)
      .makesContact()
      .triageMove(),
    new StatusMove(MoveId.CRAFTY_SHIELD, ElementalType.FAIRY, -1, 10, -1, 3, 6)
      .target(MoveTarget.USER_SIDE)
      .attr(AddArenaTagAttr, ArenaTagType.CRAFTY_SHIELD, ArenaTagRelativeSide.USER, {
        turnCount: 1,
        failOnOverlap: true,
      })
      .condition(failIfLastCondition),
    new StatusMove(MoveId.FLOWER_SHIELD, ElementalType.FAIRY, -1, 10, -1, 0, 6)
      .target(MoveTarget.ALL)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, false, {
        condition: (_user, target, _move) =>
          target.getTypes().includes(ElementalType.GRASS) && !target.getTag(...SemiInvulnerableBattlerTagTypes),
      }),
    new StatusMove(MoveId.GRASSY_TERRAIN, ElementalType.GRASS, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.GRASSY)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.MISTY_TERRAIN, ElementalType.FAIRY, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.MISTY)
      .target(MoveTarget.BOTH_SIDES),
    new StatusMove(MoveId.ELECTRIFY, ElementalType.ELECTRIC, -1, 20, -1, 0, 6)
      .attr(AddBattlerTagAttr, BattlerTagType.ELECTRIFIED, false, { failOnOverlap: true }),
    new AttackMove(MoveId.PLAY_ROUGH, ElementalType.FAIRY, MoveCategory.PHYSICAL, 90, 90, 10, 10, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(MoveId.FAIRY_WIND, ElementalType.FAIRY, MoveCategory.SPECIAL, 40, 100, 30, -1, 0, 6)
      .windMove(),
    new AttackMove(MoveId.MOONBLAST, ElementalType.FAIRY, MoveCategory.SPECIAL, 95, 100, 15, 30, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1,),
    new AttackMove(MoveId.BOOMBURST, ElementalType.NORMAL, MoveCategory.SPECIAL, 140, 100, 10, -1, 0, 6)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new StatusMove(MoveId.FAIRY_LOCK, ElementalType.FAIRY, -1, 10, -1, 0, 6)
      .ignoresSubstitute()
      .ignoresProtect()
      .target(MoveTarget.BOTH_SIDES)
      .attr(AddArenaTagAttr, ArenaTagType.FAIRY_LOCK, ArenaTagRelativeSide.ALL, { turnCount: 2, failOnOverlap: true }),
    new SelfStatusMove(MoveId.KINGS_SHIELD, ElementalType.STEEL, -1, 10, -1, 4, 6)
      .attr(ProtectAttr, BattlerTagType.KINGS_SHIELD)
      .condition(failIfLastCondition),
    new StatusMove(MoveId.PLAY_NICE, ElementalType.NORMAL, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .ignoresSubstitute()
      .bounceable(),
    new StatusMove(MoveId.CONFIDE, ElementalType.NORMAL, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1)
      .soundMove()
      .bounceable(),
    new AttackMove(MoveId.DIAMOND_STORM, ElementalType.ROCK, MoveCategory.PHYSICAL, 100, 95, 5, 50, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true, { firstTargetOnly: true })
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.STEAM_ERUPTION, ElementalType.WATER, MoveCategory.SPECIAL, 110, 95, 5, 30, 0, 6)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.HYPERSPACE_HOLE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, -1, 5, -1, 0, 6)
      .ignoresProtect()
      .ignoresSubstitute(),
    new AttackMove(MoveId.WATER_SHURIKEN, ElementalType.WATER, MoveCategory.SPECIAL, 15, 100, 20, -1, 1, 6)
      .attr(MultiHitAttr)
      .attr(WaterShurikenPowerAttr)
      .attr(WaterShurikenMultiHitTypeAttr),
    new AttackMove(MoveId.MYSTICAL_FIRE, ElementalType.FIRE, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1),
    new SelfStatusMove(MoveId.SPIKY_SHIELD, ElementalType.GRASS, -1, 10, -1, 4, 6)
      .attr(ProtectAttr, BattlerTagType.SPIKY_SHIELD)
      .condition(failIfLastCondition),
    new StatusMove(MoveId.AROMATIC_MIST, ElementalType.FAIRY, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPDEF], 1)
      .ignoresSubstitute()
      .condition(failIfSingleBattle)
      .target(MoveTarget.NEAR_ALLY),
    new StatusMove(MoveId.EERIE_IMPULSE, ElementalType.ELECTRIC, 100, 15, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2)
      .bounceable(),
    new StatusMove(MoveId.VENOM_DRENCH, ElementalType.POISON, 100, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK, Stat.SPD], -1, false, {
        condition: (_user, target, _move) => target.hasStatusEffect([StatusEffect.POISON, StatusEffect.TOXIC]),
      })
      .bounceable()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.POWDER, ElementalType.BUG, 100, 20, -1, 1, 6)
      .attr(AddBattlerTagAttr, BattlerTagType.POWDER, false, { failOnOverlap: true })
      .ignoresSubstitute()
      .powderMove()
      .bounceable(),
    new ChargingSelfStatusMove(MoveId.GEOMANCY, ElementalType.FAIRY, -1, 10, -1, 0, 6)
      .chargeText(i18next.t("moveTriggers:isChargingPower", { pokemonName: "{USER}" }))
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF, Stat.SPD], 2, true),
    new StatusMove(MoveId.MAGNETIC_FLUX, ElementalType.ELECTRIC, -1, 20, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], 1, false, {
        condition: (_user, target, _move) =>
          !![AbilityId.PLUS, AbilityId.MINUS].find((a) => target.hasAbility(a, false)),
      })
      .ignoresSubstitute()
      .snatchable()
      .target(MoveTarget.USER_AND_ALLIES)
      .condition(
        (user, _target, _move) =>
          [user, user.getAlly()]
            .filter((p) => p?.isActive())
            .some((p) => [AbilityId.PLUS, AbilityId.MINUS].some((a) => p?.hasAbility(a, false))),
      ),
    new StatusMove(MoveId.HAPPY_HOUR, ElementalType.NORMAL, -1, 30, -1, 0, 6) // No animation
      .attr(AddArenaTagAttr, ArenaTagType.HAPPY_HOUR, ArenaTagRelativeSide.USER, { failOnOverlap: true })
      .target(MoveTarget.USER_SIDE),
    new StatusMove(MoveId.ELECTRIC_TERRAIN, ElementalType.ELECTRIC, -1, 10, -1, 0, 6)
      .attr(TerrainChangeAttr, TerrainType.ELECTRIC)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.DAZZLING_GLEAM, ElementalType.FAIRY, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 6)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new SelfStatusMove(MoveId.CELEBRATE, ElementalType.NORMAL, -1, 40, -1, 0, 6)
      .attr(DisplayMessageAttr, i18next.t("moveTriggers:celebrate", { pokemonName: "{USER}" })),
    new StatusMove(MoveId.HOLD_HANDS, ElementalType.NORMAL, -1, 40, -1, 0, 6)
      .attr(
        DisplayMessageAttr,
        i18next.t("moveTriggers:holdHands", { pokemonName: "{USER}", targetPokemonName: "{TARGET}" }),
      )
      .ignoresSubstitute()
      .target(MoveTarget.NEAR_ALLY),
    new StatusMove(MoveId.BABY_DOLL_EYES, ElementalType.FAIRY, 100, 30, -1, 1, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .bounceable(),
    new AttackMove(MoveId.NUZZLE, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 20, 100, 20, 100, 0, 6)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.HOLD_BACK, ElementalType.NORMAL, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 6)
      .attr(SurviveDamageAttr),
    new AttackMove(MoveId.INFESTATION, ElementalType.BUG, MoveCategory.SPECIAL, 20, 100, 20, -1, 0, 6)
      .makesContact()
      .attr(TrapAttr, BattlerTagType.INFESTATION),
    new AttackMove(MoveId.POWER_UP_PUNCH, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 40, 100, 20, 100, 0, 6)
      .attr(StatStageChangeAttr, [Stat.ATK], 1, true)
      .punchingMove(),
    new AttackMove(MoveId.OBLIVION_WING, ElementalType.FLYING, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 6)
      .attr(HitHealAttr, 0.75)
      .triageMove(),
    new AttackMove(MoveId.THOUSAND_ARROWS, ElementalType.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
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
    new AttackMove(MoveId.THOUSAND_WAVES, ElementalType.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { lastHitOnly: true })
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.LANDS_WRATH, ElementalType.GROUND, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 6)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.LIGHT_OF_RUIN, ElementalType.FAIRY, MoveCategory.SPECIAL, 140, 90, 5, -1, 0, 6)
      .attr(RecoilAttr, false, 0.5)
      .recklessMove(),
    new AttackMove(MoveId.ORIGIN_PULSE, ElementalType.WATER, MoveCategory.SPECIAL, 110, 85, 10, -1, 0, 6)
      .pulseMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.PRECIPICE_BLADES, ElementalType.GROUND, MoveCategory.PHYSICAL, 120, 85, 10, -1, 0, 6)
      .makesContact(false)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DRAGON_ASCENT, ElementalType.FLYING, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true),
    new AttackMove(MoveId.HYPERSPACE_FURY, ElementalType.DARK, MoveCategory.PHYSICAL, 100, -1, 5, -1, 0, 6)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true)
      .ignoresSubstitute()
      .makesContact(false)
      .ignoresProtect(),
    // #region Z-Moves (unused)
    new AttackMove(MoveId.BREAKNECK_BLITZ__PHYSICAL, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.BREAKNECK_BLITZ__SPECIAL, ElementalType.NORMAL, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.ALL_OUT_PUMMELING__PHYSICAL, ElementalType.FIGHTING, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.ALL_OUT_PUMMELING__SPECIAL, ElementalType.FIGHTING, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SUPERSONIC_SKYSTRIKE__PHYSICAL, ElementalType.FLYING, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SUPERSONIC_SKYSTRIKE__SPECIAL, ElementalType.FLYING, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.ACID_DOWNPOUR__PHYSICAL, ElementalType.POISON, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.ACID_DOWNPOUR__SPECIAL, ElementalType.POISON, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.TECTONIC_RAGE__PHYSICAL, ElementalType.GROUND, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.TECTONIC_RAGE__SPECIAL, ElementalType.GROUND, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.CONTINENTAL_CRUSH__PHYSICAL, ElementalType.ROCK, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.CONTINENTAL_CRUSH__SPECIAL, ElementalType.ROCK, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SAVAGE_SPIN_OUT__PHYSICAL, ElementalType.BUG, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SAVAGE_SPIN_OUT__SPECIAL, ElementalType.BUG, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.NEVER_ENDING_NIGHTMARE__PHYSICAL, ElementalType.GHOST, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.NEVER_ENDING_NIGHTMARE__SPECIAL, ElementalType.GHOST, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.CORKSCREW_CRASH__PHYSICAL, ElementalType.STEEL, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.CORKSCREW_CRASH__SPECIAL, ElementalType.STEEL, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.INFERNO_OVERDRIVE__PHYSICAL, ElementalType.FIRE, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.INFERNO_OVERDRIVE__SPECIAL, ElementalType.FIRE, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.HYDRO_VORTEX__PHYSICAL, ElementalType.WATER, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.HYDRO_VORTEX__SPECIAL, ElementalType.WATER, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.BLOOM_DOOM__PHYSICAL, ElementalType.GRASS, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.BLOOM_DOOM__SPECIAL, ElementalType.GRASS, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.GIGAVOLT_HAVOC__PHYSICAL, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.GIGAVOLT_HAVOC__SPECIAL, ElementalType.ELECTRIC, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SHATTERED_PSYCHE__PHYSICAL, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SHATTERED_PSYCHE__SPECIAL, ElementalType.PSYCHIC, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SUBZERO_SLAMMER__PHYSICAL, ElementalType.ICE, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SUBZERO_SLAMMER__SPECIAL, ElementalType.ICE, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.DEVASTATING_DRAKE__PHYSICAL, ElementalType.DRAGON, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.DEVASTATING_DRAKE__SPECIAL, ElementalType.DRAGON, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.BLACK_HOLE_ECLIPSE__PHYSICAL, ElementalType.DARK, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.BLACK_HOLE_ECLIPSE__SPECIAL, ElementalType.DARK, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.TWINKLE_TACKLE__PHYSICAL, ElementalType.FAIRY, MoveCategory.PHYSICAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.TWINKLE_TACKLE__SPECIAL, ElementalType.FAIRY, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.CATASTROPIKA, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 210, -1, 1, -1, 0, 7)
      .unimplemented(),
    // #endregion
    new SelfStatusMove(MoveId.SHORE_UP, ElementalType.GROUND, -1, 5, -1, 0, 7)
      .attr(SandHealAttr)
      .triageMove()
      .snatchable(),
    new AttackMove(MoveId.FIRST_IMPRESSION, ElementalType.BUG, MoveCategory.PHYSICAL, 90, 100, 10, -1, 2, 7)
      .condition(new FirstMoveCondition()),
    new SelfStatusMove(MoveId.BANEFUL_BUNKER, ElementalType.POISON, -1, 10, -1, 4, 7)
      .attr(ProtectAttr, BattlerTagType.BANEFUL_BUNKER)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.SPIRIT_SHACKLE, ElementalType.GHOST, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { lastHitOnly: true })
      .makesContact(false),
    new AttackMove(MoveId.DARKEST_LARIAT, ElementalType.DARK, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 7)
      .attr(IgnoreOpponentStatStagesAttr),
    new AttackMove(MoveId.SPARKLING_ARIA, ElementalType.WATER, MoveCategory.SPECIAL, 90, 100, 10, 100, 0, 7)
      .attr(HealStatusEffectAttr, false, StatusEffect.BURN)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.ICE_HAMMER, ElementalType.ICE, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.SPD], -1, true)
      .punchingMove(),
    new StatusMove(MoveId.FLORAL_HEALING, ElementalType.FAIRY, -1, 10, -1, 0, 7)
      .attr(BoostHealAttr, 0.5, 2 / 3, true, false, (_user, _target, _move) =>
        globalScene.arena.hasTerrain(TerrainType.GRASSY),
      )
      .triageMove()
      .bounceable(),
    new AttackMove(MoveId.HIGH_HORSEPOWER, ElementalType.GROUND, MoveCategory.PHYSICAL, 95, 95, 10, -1, 0, 7),
    new StatusMove(MoveId.STRENGTH_SAP, ElementalType.GRASS, 100, 10, -1, 0, 7)
      .attr(HitHealAttr, null, Stat.ATK)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .condition((_user, target, _move) => target.getStatStage(Stat.ATK) > -6)
      .triageMove()
      .bounceable(),
    new ChargingAttackMove(MoveId.SOLAR_BLADE, ElementalType.GRASS, MoveCategory.PHYSICAL, 125, 100, 10, -1, 0, 7)
      .chargeText(i18next.t("moveTriggers:isGlowing", { pokemonName: "{USER}" }))
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.SUNNY, WeatherType.HARSH_SUN])
      .attr(AntiSunlightPowerDecreaseAttr)
      .slicingMove(),
    new AttackMove(MoveId.LEAFAGE, ElementalType.GRASS, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 7)
      .makesContact(false),
    new StatusMove(MoveId.SPOTLIGHT, ElementalType.NORMAL, -1, 15, -1, 3, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.CENTER_OF_ATTENTION, false)
      .bounceable()
      .condition(failIfSingleBattle),
    new StatusMove(MoveId.TOXIC_THREAD, ElementalType.POISON, 100, 20, -1, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .bounceable(),
    new SelfStatusMove(MoveId.LASER_FOCUS, ElementalType.NORMAL, -1, 30, -1, 0, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.ALWAYS_CRIT, true)
      .snatchable(),
    new StatusMove(MoveId.GEAR_UP, ElementalType.STEEL, -1, 20, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 1, false, {
        condition: (_user, target, _move) =>
          [AbilityId.PLUS, AbilityId.MINUS].some((a) => target.hasAbility(a, false)),
      })
      .snatchable()
      .ignoresSubstitute()
      .target(MoveTarget.USER_AND_ALLIES)
      .condition(
        (user, _target, _move) =>
          [user, user.getAlly()]
            .filter((p) => p?.isActive())
            .some((p) => [AbilityId.PLUS, AbilityId.MINUS].some((a) => p?.hasAbility(a, false))),
      ),
    new AttackMove(MoveId.THROAT_CHOP, ElementalType.DARK, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.THROAT_CHOPPED),
    new AttackMove(MoveId.POLLEN_PUFF, ElementalType.BUG, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 7)
      .attr(StatusCategoryOnAllyAttr)
      .attr(HealOnAllyAttr, 0.5, true, false)
      .bulletMove(),
    new AttackMove(MoveId.ANCHOR_SHOT, ElementalType.STEEL, MoveCategory.PHYSICAL, 80, 100, 20, 100, 0, 7)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED, false, { lastHitOnly: true }),
    new StatusMove(MoveId.PSYCHIC_TERRAIN, ElementalType.PSYCHIC, -1, 10, -1, 0, 7)
      .attr(TerrainChangeAttr, TerrainType.PSYCHIC)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.LUNGE, ElementalType.BUG, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(MoveId.FIRE_LASH, ElementalType.FIRE, MoveCategory.PHYSICAL, 80, 100, 15, 100, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1),
    new AttackMove(MoveId.POWER_TRIP, ElementalType.DARK, MoveCategory.PHYSICAL, 20, 100, 10, -1, 0, 7)
      .attr(PositiveStatStagePowerAttr),
    new AttackMove(MoveId.BURN_UP, ElementalType.FIRE, MoveCategory.SPECIAL, 130, 100, 5, -1, 0, 7)
      .condition((user) => {
        const userTypes = user.getTypes(true);
        return userTypes.includes(ElementalType.FIRE);
      })
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(AddBattlerTagAttr, BattlerTagType.BURNED_UP, true)
      .attr(RemoveTypeAttr, ElementalType.FIRE, (user) => {
        globalScene.queueMessage(
          i18next.t("moveTriggers:burnedItselfOut", { pokemonName: getPokemonNameWithAffix(user) }),
        );
      }),
    new StatusMove(MoveId.SPEED_SWAP, ElementalType.PSYCHIC, -1, 10, -1, 0, 7)
      .attr(SwapStatAttr, Stat.SPD)
      .ignoresSubstitute(),
    new AttackMove(MoveId.SMART_STRIKE, ElementalType.STEEL, MoveCategory.PHYSICAL, 70, -1, 10, -1, 0, 7),
    new StatusMove(MoveId.PURIFY, ElementalType.POISON, -1, 20, -1, 0, 7)
      .condition((_user, target, _move) => {
        return target.hasNonVolatileStatusEffect(false, true);
      })
      .attr(HealAttr, 0.5)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .triageMove()
      .bounceable(),
    new AttackMove(MoveId.REVELATION_DANCE, ElementalType.NORMAL, MoveCategory.SPECIAL, 90, 100, 15, -1, 0, 7)
      .danceMove()
      .attr(MatchUserTypeAttr),
    new AttackMove(MoveId.CORE_ENFORCER, ElementalType.DRAGON, MoveCategory.SPECIAL, 100, 100, 10, -1, 0, 7)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(SuppressAbilitiesIfActedAttr),
    new AttackMove(MoveId.TROP_KICK, ElementalType.GRASS, MoveCategory.PHYSICAL, 70, 100, 15, 100, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new StatusMove(MoveId.INSTRUCT, ElementalType.PSYCHIC, -1, 15, -1, 0, 7)
      .ignoresSubstitute()
      .attr(RepeatMoveAttr)
      .edgeCase(), // incorrect interactions with Gigaton Hammer, Blood Moon & Torment
    new AttackMove(MoveId.BEAK_BLAST, ElementalType.FLYING, MoveCategory.PHYSICAL, 100, 100, 15, -1, -3, 7)
      .attr(BeakBlastHeaderAttr)
      .bulletMove()
      .makesContact(false),
    new AttackMove(MoveId.CLANGING_SCALES, ElementalType.DRAGON, MoveCategory.SPECIAL, 110, 100, 5, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true, { firstTargetOnly: true })
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.DRAGON_HAMMER, ElementalType.DRAGON, MoveCategory.PHYSICAL, 90, 100, 15, -1, 0, 7),
    new AttackMove(MoveId.BRUTAL_SWING, ElementalType.DARK, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 7)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new StatusMove(MoveId.AURORA_VEIL, ElementalType.ICE, -1, 20, -1, 0, 7)
      .condition(
        (_user, _target, _move) =>
          globalScene.arena.hasWeather([WeatherType.HAIL, WeatherType.SNOW])
          && !globalScene.arena.weather?.isEffectSuppressed(),
      )
      .attr(AddArenaTagAttr, ArenaTagType.AURORA_VEIL, ArenaTagRelativeSide.USER, { turnCount: 5, failOnOverlap: true })
      .target(MoveTarget.USER_SIDE)
      .snatchable(),
    // #region Signature Z-Moves (unused)
    new AttackMove(MoveId.SINISTER_ARROW_RAID, ElementalType.GHOST, MoveCategory.PHYSICAL, 180, -1, 1, -1, 0, 7)
      .unimplemented()
      .makesContact(false)
      .edgeCase(), // I assume it's because the user needs spirit shackle and decidueye
    new AttackMove(MoveId.MALICIOUS_MOONSAULT, ElementalType.DARK, MoveCategory.PHYSICAL, 180, -1, 1, -1, 0, 7)
      .unimplemented()
      .attr(AlwaysHitMinimizeAttr)
      .attr(HitsTagAttr, BattlerTagType.MINIMIZED, true)
      .edgeCase(), // I assume it's because it needs darkest lariat and incineroar
    new AttackMove(MoveId.OCEANIC_OPERETTA, ElementalType.WATER, MoveCategory.SPECIAL, 195, -1, 1, -1, 0, 7)
      .unimplemented()
      .edgeCase(), // I assume it's because it needs sparkling aria and primarina
    new AttackMove(MoveId.GUARDIAN_OF_ALOLA, ElementalType.FAIRY, MoveCategory.SPECIAL, -1, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.SOUL_STEALING_7_STAR_STRIKE, ElementalType.GHOST, MoveCategory.PHYSICAL, 195, -1, 1, -1, 0, 7)
      .unimplemented(),
    new AttackMove(MoveId.STOKED_SPARKSURFER, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 175, -1, 1, 100, 0, 7)
      .unimplemented()
      .edgeCase(), // I assume it's because it needs thunderbolt and Alola Raichu
    new AttackMove(MoveId.PULVERIZING_PANCAKE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 210, -1, 1, -1, 0, 7)
      .unimplemented()
      .edgeCase(), // I assume it's because it needs giga impact and snorlax
    new SelfStatusMove(MoveId.EXTREME_EVOBOOST, ElementalType.NORMAL, -1, 1, -1, 0, 7)
      .unimplemented()
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 2, true),
    new AttackMove(MoveId.GENESIS_SUPERNOVA, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 185, -1, 1, 100, 0, 7)
      .attr(TerrainChangeAttr, TerrainType.PSYCHIC)
      .unimplemented(),
    // #endregion
    new AttackMove(MoveId.SHELL_TRAP, ElementalType.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, -3, 7)
      .attr(AddBattlerTagHeaderAttr, BattlerTagType.SHELL_TRAP)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      // Fails if the user was not hit by a physical attack during the turn
      .condition((user, _target, _move) => user.getTag<ShellTrapTag>(BattlerTagType.SHELL_TRAP)?.activated === true),
    new AttackMove(MoveId.FLEUR_CANNON, ElementalType.FAIRY, MoveCategory.SPECIAL, 130, 90, 5, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.SPATK], -2, true),
    new AttackMove(MoveId.PSYCHIC_FANGS, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 7)
      .bitingMove()
      .attr(RemoveScreensAttr),
    new AttackMove(MoveId.STOMPING_TANTRUM, ElementalType.GROUND, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 7)
      .attr(
        MovePowerMultiplierAttr,
        (user, _target, _move) => {
          const result = user.getLastXMoves(2)[1]?.result;
          if (isNullOrUndefined(result)) {
            return 1;
          }
          return [MoveResult.MISS, MoveResult.FAIL].includes(result) ? 2 : 1;
        },
      ),
    new AttackMove(MoveId.SHADOW_BONE, ElementalType.GHOST, MoveCategory.PHYSICAL, 85, 100, 10, 20, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .makesContact(false),
    new AttackMove(MoveId.ACCELEROCK, ElementalType.ROCK, MoveCategory.PHYSICAL, 40, 100, 20, -1, 1, 7),
    new AttackMove(MoveId.LIQUIDATION, ElementalType.WATER, MoveCategory.PHYSICAL, 85, 100, 10, 20, 0, 7)
      .attr(StatStageChangeAttr, [Stat.DEF], -1),
    new AttackMove(MoveId.PRISMATIC_LASER, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 160, 100, 10, -1, 0, 7)
      .attr(RechargeAttr),
    new AttackMove(MoveId.SPECTRAL_THIEF, ElementalType.GHOST, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 7)
      .attr(StealPositiveStatsAttr)
      .ignoresSubstitute(),
    new AttackMove(MoveId.SUNSTEEL_STRIKE, ElementalType.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 7)
      .ignoresAbilities(),
    new AttackMove(MoveId.MOONGEIST_BEAM, ElementalType.GHOST, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 7)
      .ignoresAbilities(),
    new StatusMove(MoveId.TEARFUL_LOOK, ElementalType.NORMAL, -1, 20, -1, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1)
      .bounceable(),
    new AttackMove(MoveId.ZING_ZAP, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 80, 100, 10, 30, 0, 7)
      .attr(FlinchAttr),
    new AttackMove(MoveId.NATURES_MADNESS, ElementalType.FAIRY, MoveCategory.SPECIAL, -1, 90, 10, -1, 0, 7)
      .attr(TargetHalfHpDamageAttr),
    new AttackMove(MoveId.MULTI_ATTACK, ElementalType.NORMAL, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 7)
      .attr(FormChangeItemTypeAttr),
    // #region Pikachu signature Z-Move (unused)
    new AttackMove(MoveId.TEN_MILLION_VOLT_THUNDERBOLT, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 195, -1, 1, -1, 0, 7)
      .unimplemented()
      .edgeCase(), // I assume it's because it needs thunderbolt and pikachu in a cap
    // #endregion
    new AttackMove(MoveId.MIND_BLOWN, ElementalType.FIRE, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 7)
      .condition(failIfDampCondition)
      .attr(HalfSacrificialAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS),
    new AttackMove(MoveId.PLASMA_FISTS, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 100, 100, 15, -1, 0, 7)
      .attr(AddArenaTagAttr, ArenaTagType.ION_DELUGE, ArenaTagRelativeSide.ALL, { turnCount: 1 })
      .punchingMove(),
    new AttackMove(MoveId.PHOTON_GEYSER, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 7)
      .attr(UseHigherAttackingStatAttr)
      .ignoresAbilities(),
    // #region USUM Z-Moves (unused)
    new AttackMove(MoveId.LIGHT_THAT_BURNS_THE_SKY, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 200, -1, 1, -1, 0, 7)
      .unimplemented()
      .attr(UseHigherAttackingStatAttr)
      .ignoresAbilities(),
    new AttackMove(MoveId.SEARING_SUNRAZE_SMASH, ElementalType.STEEL, MoveCategory.PHYSICAL, 200, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresAbilities(),
    new AttackMove(MoveId.MENACING_MOONRAZE_MAELSTROM, ElementalType.GHOST, MoveCategory.SPECIAL, 200, -1, 1, -1, 0, 7)
      .unimplemented()
      .ignoresAbilities(),
    new AttackMove(MoveId.LETS_SNUGGLE_FOREVER, ElementalType.FAIRY, MoveCategory.PHYSICAL, 190, -1, 1, -1, 0, 7)
      .unimplemented()
      .edgeCase(), // I assume it needs play rough and mimikyu
    new AttackMove(MoveId.SPLINTERED_STORMSHARDS, ElementalType.ROCK, MoveCategory.PHYSICAL, 190, -1, 1, -1, 0, 7)
      .unimplemented()
      .attr(ClearTerrainAttr)
      .makesContact(false),
    new AttackMove(MoveId.CLANGOROUS_SOULBLAZE, ElementalType.DRAGON, MoveCategory.SPECIAL, 185, -1, 1, 100, 0, 7)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true, {
        firstTargetOnly: true,
      })
      .soundMove()
      .unimplemented()
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .edgeCase(), // I assume it needs clanging scales and Kommo-O
    // #endregion
    new AttackMove(MoveId.ZIPPY_ZAP, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 50, 100, 15, -1, 2, 7) // LGPE Implementation
      .attr(CritOnlyAttr),
    new AttackMove(MoveId.SPLISHY_SPLASH, ElementalType.WATER, MoveCategory.SPECIAL, 90, 100, 15, 30, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.FLOATY_FALL, ElementalType.FLYING, MoveCategory.PHYSICAL, 90, 95, 15, 30, 0, 7)
      .attr(FlinchAttr),
    new AttackMove(MoveId.PIKA_PAPOW, ElementalType.ELECTRIC, MoveCategory.SPECIAL, -1, -1, 20, -1, 0, 7)
      .attr(FriendshipPowerAttr),
    new AttackMove(MoveId.BOUNCY_BUBBLE, ElementalType.WATER, MoveCategory.SPECIAL, 60, 100, 20, -1, 0, 7)
      .attr(HitHealAttr, 1)
      .triageMove(),
    new AttackMove(MoveId.BUZZY_BUZZ, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 60, 100, 20, 100, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.SIZZLY_SLIDE, ElementalType.FIRE, MoveCategory.PHYSICAL, 60, 100, 20, 100, 0, 7)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new AttackMove(MoveId.GLITZY_GLOW, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, 95, 15, -1, 0, 7)
      .attr(AddArenaTagAttr, ArenaTagType.LIGHT_SCREEN, ArenaTagRelativeSide.USER, { turnCount: 5 }),
    new AttackMove(MoveId.BADDY_BAD, ElementalType.DARK, MoveCategory.SPECIAL, 80, 95, 15, -1, 0, 7)
      .attr(AddArenaTagAttr, ArenaTagType.REFLECT, ArenaTagRelativeSide.USER, { turnCount: 5 }),
    new AttackMove(MoveId.SAPPY_SEED, ElementalType.GRASS, MoveCategory.PHYSICAL, 100, 90, 10, -1, 0, 7)
      .attr(LeechSeedAttr)
      .makesContact(false),
    new AttackMove(MoveId.FREEZY_FROST, ElementalType.ICE, MoveCategory.SPECIAL, 100, 90, 10, -1, 0, 7)
      .attr(ResetStatsAttr, true),
    new AttackMove(MoveId.SPARKLY_SWIRL, ElementalType.FAIRY, MoveCategory.SPECIAL, 120, 85, 5, -1, 0, 7)
      .attr(PartyStatusCureAttr, null, AbilityId.NONE),
    new AttackMove(MoveId.VEEVEE_VOLLEY, ElementalType.NORMAL, MoveCategory.PHYSICAL, -1, -1, 20, -1, 0, 7)
      .attr(FriendshipPowerAttr),
    new AttackMove(MoveId.DOUBLE_IRON_BASH, ElementalType.STEEL, MoveCategory.PHYSICAL, 60, 100, 5, 30, 0, 7)
      .attr(MultiHitAttr, MultiHitType._2)
      .attr(FlinchAttr)
      .punchingMove(),
    new SelfStatusMove(MoveId.MAX_GUARD, ElementalType.NORMAL, -1, 10, -1, 4, 8)
      .attr(ProtectAttr)
      .condition(failIfLastCondition)
      .unimplemented(),
    new AttackMove(MoveId.DYNAMAX_CANNON, ElementalType.DRAGON, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 8)
      .attr(DoubleDamageToMaxAttr)
      .attr(DiscourageFrequentUseAttr),
    new AttackMove(MoveId.SNIPE_SHOT, ElementalType.WATER, MoveCategory.SPECIAL, 80, 100, 15, -1, 0, 8)
      .attr(HighCritAttr)
      .attr(BypassRedirectAttr),
    new AttackMove(MoveId.JAW_LOCK, ElementalType.DARK, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 8)
      .attr(JawLockAttr)
      .bitingMove(),
    new SelfStatusMove(MoveId.STUFF_CHEEKS, ElementalType.NORMAL, -1, 10, -1, 0, 8)
      .attr(EatBerryAttr, true)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true)
      .snatchable() // Custom
      .condition((user) => {
        const userBerries = globalScene.findModifiers((m) => m.isBerryModifier(), user.isPlayer());
        return userBerries.length > 0;
      })
      .edgeCase(), // Stuff Cheeks should not be selectable when the user does not have a berry, see wiki
    new SelfStatusMove(MoveId.NO_RETREAT, ElementalType.FIGHTING, -1, 5, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, true)
      .snatchable() // Custom
      .attr(AddBattlerTagAttr, BattlerTagType.NO_RETREAT, true)
      .condition((user, _target, _move) => user.getTag(...TrappedBattlerTagTypes)?.sourceMoveId !== MoveId.NO_RETREAT),
    new StatusMove(MoveId.TAR_SHOT, ElementalType.ROCK, 100, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .attr(AddBattlerTagAttr, BattlerTagType.TAR_SHOT, false)
      .bounceable(),
    new StatusMove(MoveId.MAGIC_POWDER, ElementalType.PSYCHIC, 100, 20, -1, 0, 8)
      .attr(ChangeTypeAttr, ElementalType.PSYCHIC)
      .powderMove()
      .bounceable(),
    new AttackMove(MoveId.DRAGON_DARTS, ElementalType.DRAGON, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._2)
      .makesContact(false)
      .target(MoveTarget.DRAGON_DARTS)
      .edgeCase(), // see `dragon_darts.test.ts` for documented edge cases
    new StatusMove(MoveId.TEATIME, ElementalType.NORMAL, -1, 10, -1, 0, 8)
      .attr(EatBerryAttr, false)
      .target(MoveTarget.ALL),
    new StatusMove(MoveId.OCTOLOCK, ElementalType.FIGHTING, 100, 15, -1, 0, 8)
      .condition(failIfGhostTypeCondition)
      .attr(AddBattlerTagAttr, BattlerTagType.OCTOLOCK, false, { failOnOverlap: true }),
    new AttackMove(MoveId.BOLT_BEAK, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 8)
      .attr(FirstAttackDoublePowerAttr),
    new AttackMove(MoveId.FISHIOUS_REND, ElementalType.WATER, MoveCategory.PHYSICAL, 85, 100, 10, -1, 0, 8)
      .attr(FirstAttackDoublePowerAttr)
      .bitingMove(),
    new StatusMove(MoveId.COURT_CHANGE, ElementalType.NORMAL, -1, 10, -1, 0, 8)
      .attr(SwapArenaTagsAttr, courtChangeArenaTags)
      .condition((_user, _target, _move) =>
        globalScene.arena.tags.some((arenaTag) => courtChangeArenaTags.includes(arenaTag.tagType)),
      ),
    new AttackMove(MoveId.MAX_FLARE, ElementalType.FIRE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_FLUTTERBY, ElementalType.BUG, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_LIGHTNING, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_STRIKE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_KNUCKLE, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_PHANTASM, ElementalType.GHOST, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_HAILSTORM, ElementalType.ICE, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_OOZE, ElementalType.POISON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_GEYSER, ElementalType.WATER, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_AIRSTREAM, ElementalType.FLYING, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_STARFALL, ElementalType.FAIRY, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_WYRMWIND, ElementalType.DRAGON, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_MINDSTORM, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_ROCKFALL, ElementalType.ROCK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_QUAKE, ElementalType.GROUND, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_DARKNESS, ElementalType.DARK, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_OVERGROWTH, ElementalType.GRASS, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    new AttackMove(MoveId.MAX_STEELSPIKE, ElementalType.STEEL, MoveCategory.PHYSICAL, 10, -1, 10, -1, 0, 8)
      .target(MoveTarget.NEAR_ENEMY)
      .unimplemented(),
    // #endregion
    new SelfStatusMove(MoveId.CLANGOROUS_SOUL, ElementalType.DRAGON, 100, 5, -1, 0, 8)
      .attr(CutHpStatStageBoostAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.SPD], 1, 3)
      .soundMove()
      .danceMove()
      .snatchable(), // Custom
    new AttackMove(MoveId.BODY_PRESS, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 80, 100, 10, -1, 0, 8)
      .attr(DefAtkAttr),
    new StatusMove(MoveId.DECORATE, ElementalType.FAIRY, -1, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], 2)
      .ignoresProtect(),
    new AttackMove(MoveId.DRUM_BEATING, ElementalType.GRASS, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .makesContact(false),
    new AttackMove(MoveId.SNAP_TRAP, ElementalType.GRASS, MoveCategory.PHYSICAL, 35, 100, 15, -1, 0, 8)
      .attr(TrapAttr, BattlerTagType.SNAP_TRAP),
    new AttackMove(MoveId.PYRO_BALL, ElementalType.FIRE, MoveCategory.PHYSICAL, 120, 90, 5, 10, 0, 8)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .bulletMove()
      .makesContact(false),
    new AttackMove(MoveId.BEHEMOTH_BLADE, ElementalType.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 8)
      .attr(DoubleDamageToMaxAttr)
      .slicingMove(),
    new AttackMove(MoveId.BEHEMOTH_BASH, ElementalType.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 8)
      .attr(DoubleDamageToMaxAttr),
    new AttackMove(MoveId.AURA_WHEEL, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 110, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .makesContact(false)
      .attr(AuraWheelTypeAttr),
    new AttackMove(MoveId.BREAKING_SWIPE, ElementalType.DRAGON, MoveCategory.PHYSICAL, 60, 100, 15, 100, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(MoveId.BRANCH_POKE, ElementalType.GRASS, MoveCategory.PHYSICAL, 40, 100, 40, -1, 0, 8),
    new AttackMove(MoveId.OVERDRIVE, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 8)
      .soundMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.APPLE_ACID, ElementalType.GRASS, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -1),
    new AttackMove(MoveId.GRAV_APPLE, ElementalType.GRASS, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF], -1)
      .attr(MovePowerMultiplierAttr, (_user, _target, _move) =>
        globalScene.arena.getTag(ArenaTagType.GRAVITY) ? 1.5 : 1,
      )
      .makesContact(false),
    new AttackMove(MoveId.SPIRIT_BREAK, ElementalType.FAIRY, MoveCategory.PHYSICAL, 75, 100, 15, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1),
    new AttackMove(MoveId.STRANGE_STEAM, ElementalType.FAIRY, MoveCategory.SPECIAL, 90, 95, 10, 20, 0, 8)
      .attr(ConfuseAttr),
    new StatusMove(MoveId.LIFE_DEW, ElementalType.WATER, -1, 10, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .target(MoveTarget.USER_AND_ALLIES)
      .triageMove()
      .snatchable() // Custom
      .ignoresProtect(),
    new SelfStatusMove(MoveId.OBSTRUCT, ElementalType.DARK, 100, 10, -1, 4, 8)
      .attr(ProtectAttr, BattlerTagType.OBSTRUCT)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.FALSE_SURRENDER, ElementalType.DARK, MoveCategory.PHYSICAL, 80, -1, 10, -1, 0, 8),
    new AttackMove(MoveId.METEOR_ASSAULT, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 150, 100, 5, -1, 0, 8)
      .attr(RechargeAttr)
      .makesContact(false),
    new AttackMove(MoveId.ETERNABEAM, ElementalType.DRAGON, MoveCategory.SPECIAL, 160, 90, 5, -1, 0, 8)
      .attr(RechargeAttr),
    new AttackMove(MoveId.STEEL_BEAM, ElementalType.STEEL, MoveCategory.SPECIAL, 140, 95, 5, -1, 0, 8)
      .attr(HalfSacrificialAttr),
    new AttackMove(MoveId.EXPANDING_FORCE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 8)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.hasTerrain(TerrainType.PSYCHIC) && user.isGrounded() ? 1.5 : 1,
      )
      .attr(VariableTargetAttr, (user, _target, _move) =>
        globalScene.arena.hasTerrain(TerrainType.PSYCHIC) && user.isGrounded()
          ? MoveTarget.ALL_NEAR_ENEMIES
          : MoveTarget.NEAR_OTHER,
      ),
    new AttackMove(MoveId.STEEL_ROLLER, ElementalType.STEEL, MoveCategory.PHYSICAL, 130, 100, 5, -1, 0, 8)
      .attr(ClearTerrainAttr)
      .condition((_user, _target, _move) => !!globalScene.arena.terrain),
    new AttackMove(MoveId.SCALE_SHOT, ElementalType.DRAGON, MoveCategory.PHYSICAL, 25, 90, 20, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true, { lastHitOnly: true })
      .attr(StatStageChangeAttr, [Stat.DEF], -1, true, { lastHitOnly: true })
      .attr(MultiHitAttr)
      .makesContact(false),
    new ChargingAttackMove(MoveId.METEOR_BEAM, ElementalType.ROCK, MoveCategory.SPECIAL, 120, 90, 10, -1, 0, 8)
      .chargeText(i18next.t("moveTriggers:isOverflowingWithSpacePower", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.SPATK], 1, true),
    new AttackMove(MoveId.SHELL_SIDE_ARM, ElementalType.POISON, MoveCategory.SPECIAL, 90, 100, 10, 20, 0, 8)
      .attr(ShellSideArmCategoryAttr)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.MISTY_EXPLOSION, ElementalType.FAIRY, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 8)
      .attr(SacrificialAttr)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.hasTerrain(TerrainType.MISTY) && user.isGrounded() ? 1.5 : 1,
      )
      .condition(failIfDampCondition)
      .makesContact(false),
    new AttackMove(MoveId.GRASSY_GLIDE, ElementalType.GRASS, MoveCategory.PHYSICAL, 55, 100, 20, -1, 0, 8)
      .attr(
        IncrementMovePriorityAttr,
        (user) => globalScene.arena.hasTerrain(TerrainType.GRASSY) && user.isGrounded(),
      ),
    new AttackMove(MoveId.RISING_VOLTAGE, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 20, -1, 0, 8)
      .attr(
        MovePowerMultiplierAttr,
        (_user, target, _move) => (globalScene.arena.hasTerrain(TerrainType.ELECTRIC) && target.isGrounded() ? 2 : 1),
      ),
    new AttackMove(MoveId.TERRAIN_PULSE, ElementalType.NORMAL, MoveCategory.SPECIAL, 50, 100, 10, -1, 0, 8)
      .attr(TerrainPulseTypeAttr)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() !== TerrainType.NONE && user.isGrounded() ? 2 : 1,
      )
      .pulseMove(),
    new AttackMove(MoveId.SKITTER_SMACK, ElementalType.BUG, MoveCategory.PHYSICAL, 70, 90, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1),
    new AttackMove(MoveId.BURNING_JEALOUSY, ElementalType.FIRE, MoveCategory.SPECIAL, 70, 100, 5, 100, 0, 8)
      .attr(StatusIfBoostedAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.LASH_OUT, ElementalType.DARK, MoveCategory.PHYSICAL, 75, 100, 5, -1, 0, 8)
      .attr(
        MovePowerMultiplierAttr,
        (user, _target, _move) => (user.turnData.statStagesDecreased ? 2 : 1),
      ),
    new AttackMove(MoveId.POLTERGEIST, ElementalType.GHOST, MoveCategory.PHYSICAL, 110, 90, 5, -1, 0, 8)
      .attr(AttackedByItemAttr)
      .makesContact(false),
    new StatusMove(MoveId.CORROSIVE_GAS, ElementalType.POISON, 100, 40, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_OTHERS)
      .bounceable()
      .unimplemented(),
    new StatusMove(MoveId.COACHING, ElementalType.FIGHTING, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF], 1)
      .target(MoveTarget.NEAR_ALLY)
      .condition(failIfSingleBattle),
    new AttackMove(MoveId.FLIP_TURN, ElementalType.WATER, MoveCategory.PHYSICAL, 60, 100, 20, -1, 0, 8)
      .attr(ForceSwitchOutAttr, true),
    new AttackMove(MoveId.TRIPLE_AXEL, ElementalType.ICE, MoveCategory.PHYSICAL, 20, 90, 10, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(MultiHitPowerIncrementAttr, 3)
      .checkAllHits(),
    new AttackMove(MoveId.DUAL_WINGBEAT, ElementalType.FLYING, MoveCategory.PHYSICAL, 40, 90, 10, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._2),
    new AttackMove(MoveId.SCORCHING_SANDS, ElementalType.GROUND, MoveCategory.SPECIAL, 70, 100, 10, 30, 0, 8)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN),
    new StatusMove(MoveId.JUNGLE_HEALING, ElementalType.GRASS, -1, 10, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .triageMove()
      .snatchable() // Custom
      .target(MoveTarget.USER_AND_ALLIES),
    new AttackMove(MoveId.WICKED_BLOW, ElementalType.DARK, MoveCategory.PHYSICAL, 75, 100, 5, -1, 0, 8)
      .attr(CritOnlyAttr)
      .punchingMove(),
    new AttackMove(MoveId.SURGING_STRIKES, ElementalType.WATER, MoveCategory.PHYSICAL, 25, 100, 5, -1, 0, 8)
      .attr(MultiHitAttr, MultiHitType._3)
      .attr(CritOnlyAttr)
      .punchingMove(),
    new AttackMove(MoveId.THUNDER_CAGE, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 80, 90, 15, -1, 0, 8)
      .attr(TrapAttr, BattlerTagType.THUNDER_CAGE),
    new AttackMove(MoveId.DRAGON_ENERGY, ElementalType.DRAGON, MoveCategory.SPECIAL, 150, 100, 5, -1, 0, 8)
      .attr(HpPowerAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.FREEZING_GLARE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 90, 100, 10, 10, 0, 8)
      .attr(StatusEffectAttr, StatusEffect.FREEZE),
    new AttackMove(MoveId.FIERY_WRATH, ElementalType.DARK, MoveCategory.SPECIAL, 90, 100, 10, 20, 0, 8)
      .attr(FlinchAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.THUNDEROUS_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF], -1),
    new AttackMove(MoveId.GLACIAL_LANCE, ElementalType.ICE, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .makesContact(false),
    new AttackMove(MoveId.ASTRAL_BARRAGE, ElementalType.GHOST, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 8)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.EERIE_SPELL, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 5, 100, 0, 8)
      .attr(AttackReducePpMoveAttr, 3)
      .soundMove(),
    new AttackMove(MoveId.DIRE_CLAW, ElementalType.POISON, MoveCategory.PHYSICAL, 80, 100, 15, 50, 0, 8)
      .attr(MultiStatusEffectAttr, [StatusEffect.POISON, StatusEffect.PARALYSIS, StatusEffect.SLEEP]),
    new AttackMove(MoveId.PSYSHIELD_BASH, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, 70, 90, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF], 1, true),
    new SelfStatusMove(MoveId.POWER_SHIFT, ElementalType.NORMAL, -1, 10, -1, 0, 8)
      .target(MoveTarget.USER)
      .attr(ShiftStatAttr, Stat.ATK, Stat.DEF)
      .snatchable(), // Custom
    new AttackMove(MoveId.STONE_AXE, ElementalType.ROCK, MoveCategory.PHYSICAL, 65, 90, 15, 100, 0, 8)
      .attr(AddEntryHazardTagAttr, ArenaTagType.STEALTH_ROCK)
      .slicingMove(),
    new AttackMove(MoveId.SPRINGTIDE_STORM, ElementalType.FAIRY, MoveCategory.SPECIAL, 100, 80, 5, 30, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.MYSTICAL_POWER, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 70, 90, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true),
    new AttackMove(MoveId.RAGING_FURY, ElementalType.FIRE, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 8)
      .makesContact(false)
      .attr(AddBattlerTagAttr, BattlerTagType.FRENZY, true, { turnCountMin: 2, turnCountMax: 3 })
      .target(MoveTarget.RANDOM_NEAR_ENEMY),
    new AttackMove(MoveId.WAVE_CRASH, ElementalType.WATER, MoveCategory.PHYSICAL, 120, 100, 10, -1, 0, 8)
      .attr(RecoilAttr, false, 0.33)
      .recklessMove(),
    new AttackMove(MoveId.CHLOROBLAST, ElementalType.GRASS, MoveCategory.SPECIAL, 150, 95, 5, -1, 0, 8)
      .attr(RecoilAttr, true, 0.5),
    new AttackMove(MoveId.MOUNTAIN_GALE, ElementalType.ICE, MoveCategory.PHYSICAL, 100, 85, 10, 30, 0, 8)
      .makesContact(false)
      .attr(FlinchAttr),
    new SelfStatusMove(MoveId.VICTORY_DANCE, ElementalType.FIGHTING, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.DEF, Stat.SPD], 1, true)
      .danceMove()
      .snatchable(), // Custom
    new AttackMove(MoveId.HEADLONG_RUSH, ElementalType.GROUND, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true)
      .makesContact()
      .punchingMove(),
    new AttackMove(MoveId.BARB_BARRAGE, ElementalType.POISON, MoveCategory.PHYSICAL, 60, 100, 10, 50, 0, 8)
      .makesContact(false)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) =>
        target.hasStatusEffect([StatusEffect.POISON, StatusEffect.TOXIC]) ? 2 : 1,
      )
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.ESPER_WING, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 8)
      .attr(HighCritAttr)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true),
    new AttackMove(MoveId.BITTER_MALICE, ElementalType.GHOST, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 8)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new SelfStatusMove(MoveId.SHELTER, ElementalType.STEEL, -1, 10, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.DEF], 2, true)
      .snatchable(), // Custom
    new AttackMove(MoveId.TRIPLE_ARROWS, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 90, 100, 10, 30, 0, 8)
      .makesContact(false)
      .attr(HighCritAttr)
      .attr(StatStageChangeAttr, [Stat.DEF], -1, false, { effectChanceOverride: 50 })
      .attr(FlinchAttr),
    new AttackMove(MoveId.INFERNAL_PARADE, ElementalType.GHOST, MoveCategory.SPECIAL, 60, 100, 15, 30, 0, 8)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .attr(MovePowerMultiplierAttr, (_user, target, _move) => (target.hasNonVolatileStatusEffect() ? 2 : 1)),
    new AttackMove(MoveId.CEASELESS_EDGE, ElementalType.DARK, MoveCategory.PHYSICAL, 65, 90, 15, 100, 0, 8)
      .attr(AddEntryHazardTagAttr, ArenaTagType.SPIKES)
      .slicingMove(),
    new AttackMove(MoveId.BLEAKWIND_STORM, ElementalType.FLYING, MoveCategory.SPECIAL, 100, 80, 10, 30, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatStageChangeAttr, [Stat.SPD], -1)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.WILDBOLT_STORM, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 100, 80, 10, 20, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.SANDSEAR_STORM, ElementalType.GROUND, MoveCategory.SPECIAL, 100, 80, 10, 20, 0, 8)
      .attr(StormAccuracyAttr)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .windMove()
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.LUNAR_BLESSING, ElementalType.PSYCHIC, -1, 5, -1, 0, 8)
      .attr(HealAttr, 0.25, true, false)
      .attr(HealStatusEffectAttr, false, getNonVolatileStatusEffects())
      .target(MoveTarget.USER_AND_ALLIES)
      .triageMove()
      .snatchable(), // Custom
    new SelfStatusMove(MoveId.TAKE_HEART, ElementalType.PSYCHIC, -1, 15, -1, 0, 8)
      .attr(StatStageChangeAttr, [Stat.SPATK, Stat.SPDEF], 1, true)
      .attr(HealStatusEffectAttr, true, [
        StatusEffect.PARALYSIS,
        StatusEffect.POISON,
        StatusEffect.TOXIC,
        StatusEffect.BURN,
        StatusEffect.SLEEP,
      ])
      .snatchable(), // Custom
    new AttackMove(MoveId.G_MAX_WILDFIRE, ElementalType.FIRE, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.CHARIZARD)
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_WILDFIRE),
    new AttackMove(MoveId.G_MAX_BEFUDDLE, ElementalType.BUG, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.BUTTERFREE)
      .attr(MultiStatusEffectAttr, [StatusEffect.POISON, StatusEffect.PARALYSIS, StatusEffect.SLEEP]),
    new AttackMove(MoveId.G_MAX_VOLT_CRASH, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.PIKACHU)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS),
    new AttackMove(MoveId.G_MAX_GOLD_RUSH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.MEOWTH)
      .attr(ConfuseAttr)
      .attr(MoneyAttr), // should gives 100x user level (20x as effective as payday) as money. Rebalance later
    new AttackMove(MoveId.G_MAX_CHI_STRIKE, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.MACHAMP)
      .attr(AddBattlerTagAttr, BattlerTagType.CRIT_BOOST_STACKABLE, true),
    new AttackMove(MoveId.G_MAX_TERROR, ElementalType.GHOST, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.GENGAR)
      .attr(AddBattlerTagAttr, BattlerTagType.TRAPPED),
    new AttackMove(MoveId.G_MAX_RESONANCE, ElementalType.ICE, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.LAPRAS)
      .attr(AddArenaTagAttr, ArenaTagType.AURORA_VEIL, ArenaTagRelativeSide.USER, { turnCount: 5 }),
    new AttackMove(MoveId.G_MAX_CUDDLE, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.EEVEE)
      .attr(AddBattlerTagAttr, BattlerTagType.INFATUATED),
    new AttackMove(MoveId.G_MAX_REPLENISH, ElementalType.NORMAL, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.SNORLAX)
      .partial(), // 50% of replenishing user and ally's berries (like recycle)
    new AttackMove(MoveId.G_MAX_MALODOR, ElementalType.POISON, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.GARBODOR)
      .attr(StatusEffectAttr, StatusEffect.POISON),
    new AttackMove(MoveId.G_MAX_STONESURGE, ElementalType.WATER, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.DREDNAW)
      .attr(AddEntryHazardTagAttr, ArenaTagType.STEALTH_ROCK),
    new AttackMove(MoveId.G_MAX_WIND_RAGE, ElementalType.FLYING, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.CORVIKNIGHT)
      .attr(ClearWeatherAttr, WeatherType.FOG)
      .attr(ClearTerrainAttr)
      .attr(RemoveScreensAttr, false)
      .attr(RemoveEntryHazardAttr, true)
      .attr(RemoveArenaTagsAttr, [ArenaTagType.SAFEGUARD, ArenaTagType.MIST], ArenaTagRelativeSide.TARGET),
    new AttackMove(MoveId.G_MAX_STUN_SHOCK, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.TOXTRICITY)
      .attr(MultiStatusEffectAttr, [StatusEffect.POISON, StatusEffect.PARALYSIS]),
    new AttackMove(MoveId.G_MAX_FINALE, ElementalType.FAIRY, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.ALCREMIE)
      .attr(HealAttr, 1 / 6),
    new AttackMove(MoveId.G_MAX_DEPLETION, ElementalType.DRAGON, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.DURALUDON)
      .attr(AttackReducePpMoveAttr, 2),
    new AttackMove(MoveId.G_MAX_GRAVITAS, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.ORBEETLE)
      .attr(AddArenaTagAttr, ArenaTagType.GRAVITY, ArenaTagRelativeSide.ALL, { turnCount: 5 })
      .edgeCase(), // does not prevent Bounce, Fly, etc. from being selected; only causes the moves to fail.
    new AttackMove(MoveId.G_MAX_VOLCALITH, ElementalType.ROCK, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.COALOSSAL)
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_VOLCALITH),
    new AttackMove(MoveId.G_MAX_SANDBLAST, ElementalType.GROUND, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.SANDACONDA)
      .attr(TrapAttr, BattlerTagType.G_MAX_SAND_TOMB),
    new AttackMove(MoveId.G_MAX_SNOOZE, ElementalType.DARK, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.GRIMMSNARL)
      .attr(AddBattlerTagAttr, BattlerTagType.DROWSY, false, { effectChanceOverride: 50 })
      .edgeCase(), // The 50% chance incorrectly gets overridden by Shield Dust, Sheer Force, etc.
    new AttackMove(MoveId.G_MAX_TARTNESS, ElementalType.GRASS, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.FLAPPLE)
      .attr(StatStageChangeAttr, [Stat.EVA], -1),
    new AttackMove(MoveId.G_MAX_SWEETNESS, ElementalType.GRASS, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.APPLETUN)
      .attr(HealStatusEffectAttr, true, getNonVolatileStatusEffects()),
    new AttackMove(MoveId.G_MAX_SMITE, ElementalType.FAIRY, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.HATTERENE)
      .attr(ConfuseAttr),
    new AttackMove(MoveId.G_MAX_STEELSURGE, ElementalType.STEEL, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.COPPERAJAH)
      .attr(AddEntryHazardTagAttr, ArenaTagType.SHARP_STEEL),
    new AttackMove(MoveId.G_MAX_MELTDOWN, ElementalType.STEEL, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.MELMETAL)
      .attr(AddBattlerTagAttr, BattlerTagType.TORMENT),
    new AttackMove(MoveId.G_MAX_FOAM_BURST, ElementalType.WATER, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.KINGLER)
      .attr(StatStageChangeAttr, [Stat.SPD], -2),
    new AttackMove(MoveId.G_MAX_CENTIFERNO, ElementalType.FIRE, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.CENTISKORCH)
      .attr(TrapAttr, BattlerTagType.G_MAX_FIRE_SPIN),
    new AttackMove(MoveId.G_MAX_VINE_LASH, ElementalType.GRASS, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.VENUSAUR)
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_VINE_LASH),
    new AttackMove(MoveId.G_MAX_CANNONADE, ElementalType.WATER, MoveCategory.SPECIAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.BLASTOISE)
      .attr(AddArenaTagAttr, ArenaTagType.G_MAX_CANNONADE),
    new AttackMove(MoveId.G_MAX_DRUM_SOLO, ElementalType.GRASS, MoveCategory.PHYSICAL, 110, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.RILLABOOM)
      .ignoresAbilities(),
    new AttackMove(MoveId.G_MAX_FIREBALL, ElementalType.FIRE, MoveCategory.PHYSICAL, 110, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.CINDERACE)
      .ignoresAbilities(),
    new AttackMove(MoveId.G_MAX_HYDROSNIPE, ElementalType.WATER, MoveCategory.SPECIAL, 110, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.INTELEON)
      .ignoresAbilities(),
    new AttackMove(MoveId.G_MAX_ONE_BLOW, ElementalType.DARK, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.URSHIFU)
      .ignoresProtect(),
    new AttackMove(MoveId.G_MAX_RAPID_FLOW, ElementalType.WATER, MoveCategory.PHYSICAL, 80, -1, 3, -1, 0, 8)
      .gMaxMove(SpeciesId.URSHIFU)
      .ignoresProtect(),
    new AttackMove(MoveId.TERA_BLAST, ElementalType.NORMAL, MoveCategory.SPECIAL, 80, 100, 10, -1, 0, 9)
      .attr(TeraMoveCategoryAttr)
      .attr(TeraBlastTypeAttr)
      .attr(TeraBlastPowerAttr)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPATK], -1, true, {
        condition: (user, _target, _move) => user.isTerastallized() && user.isOfType(ElementalType.STELLAR),
      }),
    new SelfStatusMove(MoveId.SILK_TRAP, ElementalType.BUG, -1, 10, -1, 4, 9)
      .attr(ProtectAttr, BattlerTagType.SILK_TRAP)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.AXE_KICK, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 120, 90, 10, 30, 0, 9)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .attr(ConfuseAttr)
      .recklessMove(),
    new AttackMove(MoveId.LAST_RESPECTS, ElementalType.GHOST, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 9)
      .partial() // Counter resets every wave instead of on arena reset
      .attr(
        MovePowerMultiplierAttr,
        (user, _target, _move) => {
          const { playerFaints, enemyFaints } = globalScene.currentBattle;
          return 1 + Math.min(user.isPlayer() ? playerFaints : enemyFaints, 100);
        },
      )
      .makesContact(false),
    new AttackMove(MoveId.LUMINA_CRASH, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPDEF], -2),
    new AttackMove(MoveId.ORDER_UP, ElementalType.DRAGON, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 9)
      .attr(OrderUpStatBoostAttr)
      .makesContact(false),
    new AttackMove(MoveId.JET_PUNCH, ElementalType.WATER, MoveCategory.PHYSICAL, 60, 100, 15, -1, 1, 9)
      .punchingMove(),
    new StatusMove(MoveId.SPICY_EXTRACT, ElementalType.GRASS, -1, 15, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.ATK], 2)
      .attr(StatStageChangeAttr, [Stat.DEF], -2)
      .bounceable(),
    new AttackMove(MoveId.SPIN_OUT, ElementalType.STEEL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPD], -2, true),
    new AttackMove(MoveId.POPULATION_BOMB, ElementalType.NORMAL, MoveCategory.PHYSICAL, 20, 90, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._10)
      .slicingMove()
      .checkAllHits(),
    new AttackMove(MoveId.ICE_SPINNER, ElementalType.ICE, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 9)
      .attr(ClearTerrainAttr),
    new AttackMove(MoveId.GLAIVE_RUSH, ElementalType.DRAGON, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.ALWAYS_GET_HIT, true, { lastHitOnly: true })
      .attr(AddBattlerTagAttr, BattlerTagType.RECEIVE_DOUBLE_DAMAGE, true, { lastHitOnly: true }),
    new StatusMove(MoveId.REVIVAL_BLESSING, ElementalType.NORMAL, -1, 1, -1, 0, 9)
      .attr(RevivalBlessingAttr)
      .triageMove()
      .snatchable() // Custom
      .target(MoveTarget.USER),
    new AttackMove(MoveId.SALT_CURE, ElementalType.ROCK, MoveCategory.PHYSICAL, 40, 100, 15, 100, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.SALT_CURED)
      .makesContact(false),
    new AttackMove(MoveId.TRIPLE_DIVE, ElementalType.WATER, MoveCategory.PHYSICAL, 30, 95, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._3),
    new AttackMove(MoveId.MORTAL_SPIN, ElementalType.POISON, MoveCategory.PHYSICAL, 30, 100, 15, 100, 0, 9)
      .attr(RemoveBattlerTagAttr, rapidSpinRemoveTags, true)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .attr(RemoveEntryHazardAttr)
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new StatusMove(MoveId.DOODLE, ElementalType.NORMAL, 100, 10, -1, 0, 9)
      .attr(AbilityCopyAttr, true),
    new SelfStatusMove(MoveId.FILLET_AWAY, ElementalType.NORMAL, -1, 10, -1, 0, 9)
      .attr(CutHpStatStageBoostAttr, [Stat.ATK, Stat.SPATK, Stat.SPD], 2, 2)
      .snatchable(), // Custom
    new AttackMove(MoveId.KOWTOW_CLEAVE, ElementalType.DARK, MoveCategory.PHYSICAL, 85, -1, 10, -1, 0, 9)
      .slicingMove(),
    new AttackMove(MoveId.FLOWER_TRICK, ElementalType.GRASS, MoveCategory.PHYSICAL, 70, -1, 10, -1, 0, 9)
      .attr(CritOnlyAttr)
      .makesContact(false),
    new AttackMove(MoveId.TORCH_SONG, ElementalType.FIRE, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .soundMove(),
    new AttackMove(MoveId.AQUA_STEP, ElementalType.WATER, MoveCategory.PHYSICAL, 80, 100, 10, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true)
      .makesContact()
      .danceMove(),
    new AttackMove(MoveId.RAGING_BULL, ElementalType.NORMAL, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 9)
      .attr(RagingBullTypeAttr)
      .attr(RemoveScreensAttr),
    new AttackMove(MoveId.MAKE_IT_RAIN, ElementalType.STEEL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9)
      .attr(MoneyAttr)
      .attr(StatStageChangeAttr, [Stat.SPATK], -1, true, { firstTargetOnly: true })
      .target(MoveTarget.ALL_NEAR_ENEMIES),
    new AttackMove(MoveId.PSYBLADE, ElementalType.PSYCHIC, MoveCategory.PHYSICAL, 80, 100, 15, -1, 0, 9)
      .attr(MovePowerMultiplierAttr, (user, _target, _move) =>
        globalScene.arena.getTerrainType() === TerrainType.ELECTRIC && user.isGrounded() ? 1.5 : 1,
      )
      .slicingMove(),
    new AttackMove(MoveId.HYDRO_STEAM, ElementalType.WATER, MoveCategory.SPECIAL, 80, 100, 15, -1, 0, 9)
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
    new AttackMove(MoveId.RUINATION, ElementalType.DARK, MoveCategory.SPECIAL, -1, 90, 10, -1, 0, 9)
      .attr(TargetHalfHpDamageAttr),
    new AttackMove(MoveId.COLLISION_COURSE, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9)
      .attr(
        MovePowerMultiplierAttr, // TODO: replace fraction with decimal
        (user, target, move) => (target.getAttackTypeEffectiveness(move.type, user) >= 2 ? 5461 / 4096 : 1),
      ),
    new AttackMove(MoveId.ELECTRO_DRIFT, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 100, 100, 5, -1, 0, 9)
      .attr(MovePowerMultiplierAttr, (user, target, move) =>
        target.getAttackTypeEffectiveness(move.type, user) >= 2 ? 5461 / 4096 : 1,
      )
      .makesContact(),
    new SelfStatusMove(MoveId.SHED_TAIL, ElementalType.NORMAL, -1, 10, -1, 0, 9)
      .attr(AddSubstituteAttr, 0.5)
      .attr(ForceSwitchOutAttr, true, SwitchType.SHED_TAIL)
      .snatchable() // Custom
      .condition(failIfLastInPartyCondition),
    new SelfStatusMove(MoveId.CHILLY_RECEPTION, ElementalType.ICE, -1, 10, -1, 0, 9)
      .attr(PreMoveMessageAttr, (user, _move) =>
        i18next.t("moveTriggers:chillyReception", { pokemonName: getPokemonNameWithAffix(user) }),
      )
      .attr(ChillyReceptionAttr, true),
    new SelfStatusMove(MoveId.TIDY_UP, ElementalType.NORMAL, -1, 10, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.ATK, Stat.SPD], 1, true)
      .attr(RemoveEntryHazardAttr, true)
      .attr(RemoveAllSubstitutesAttr)
      .snatchable(), // Custom
    new StatusMove(MoveId.SNOWSCAPE, ElementalType.ICE, -1, 10, -1, 0, 9)
      .attr(WeatherChangeAttr, WeatherType.SNOW)
      .target(MoveTarget.BOTH_SIDES),
    new AttackMove(MoveId.POUNCE, ElementalType.BUG, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPD], -1),
    new AttackMove(MoveId.TRAILBLAZE, ElementalType.GRASS, MoveCategory.PHYSICAL, 50, 100, 20, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.SPD], 1, true),
    new AttackMove(MoveId.CHILLING_WATER, ElementalType.WATER, MoveCategory.SPECIAL, 50, 100, 20, 100, 0, 9)
      .attr(StatStageChangeAttr, [Stat.ATK], -1),
    new AttackMove(MoveId.HYPER_DRILL, ElementalType.NORMAL, MoveCategory.PHYSICAL, 100, 100, 5, -1, 0, 9)
      .ignoresProtect(),
    new AttackMove(MoveId.TWIN_BEAM, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 40, 100, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._2),
    new AttackMove(MoveId.RAGE_FIST, ElementalType.GHOST, MoveCategory.PHYSICAL, 50, 100, 10, -1, 0, 9)
      .partial() // Counter resets every wave instead of on arena reset
      .attr(HitCountPowerAttr)
      .punchingMove(),
    new AttackMove(MoveId.ARMOR_CANNON, ElementalType.FIRE, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9)
      .attr(StatStageChangeAttr, [Stat.DEF, Stat.SPDEF], -1, true),
    new AttackMove(MoveId.BITTER_BLADE, ElementalType.FIRE, MoveCategory.PHYSICAL, 90, 100, 10, -1, 0, 9)
      .attr(HitHealAttr)
      .makesContact()
      .slicingMove()
      .triageMove(),
    new AttackMove(MoveId.DOUBLE_SHOCK, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 120, 100, 5, -1, 0, 9)
      .condition((user) => {
        const userTypes = user.getTypes(true);
        return userTypes.includes(ElementalType.ELECTRIC);
      })
      .attr(AddBattlerTagAttr, BattlerTagType.DOUBLE_SHOCKED, true)
      .attr(RemoveTypeAttr, ElementalType.ELECTRIC, (user) => {
        globalScene.queueMessage(
          i18next.t("moveTriggers:usedUpAllElectricity", { pokemonName: getPokemonNameWithAffix(user) }),
        );
      }),
    new AttackMove(MoveId.GIGATON_HAMMER, ElementalType.STEEL, MoveCategory.PHYSICAL, 160, 100, 5, -1, 0, 9)
      .makesContact(false)
      .condition((user, _target, move) => {
        const turnMove = user.getLastXMoves(1);
        return !turnMove.length || turnMove[0].move.id !== move.id || turnMove[0].result !== MoveResult.SUCCESS;
      }) // TODO Add Instruct/Encore interaction
      .edgeCase(), // should be unselectable the turn after its used
    new AttackMove(MoveId.COMEUPPANCE, ElementalType.DARK, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 9)
      .attr(CounterDamageAttr, (moveId) => allMoves.get(moveId).isAttackMove(), 1.5)
      .redirectCounter()
      .target(MoveTarget.ATTACKER),
    new AttackMove(MoveId.AQUA_CUTTER, ElementalType.WATER, MoveCategory.PHYSICAL, 70, 100, 20, -1, 0, 9)
      .attr(HighCritAttr)
      .slicingMove()
      .makesContact(false),
    new AttackMove(MoveId.BLAZING_TORQUE, ElementalType.FIRE, MoveCategory.PHYSICAL, 80, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .makesContact(false),
    new AttackMove(MoveId.WICKED_TORQUE, ElementalType.DARK, MoveCategory.PHYSICAL, 80, 100, 10, 10, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.SLEEP)
      .makesContact(false),
    new AttackMove(MoveId.NOXIOUS_TORQUE, ElementalType.POISON, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.POISON)
      .makesContact(false),
    new AttackMove(MoveId.COMBAT_TORQUE, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.PARALYSIS)
      .makesContact(false),
    new AttackMove(MoveId.MAGICAL_TORQUE, ElementalType.FAIRY, MoveCategory.PHYSICAL, 100, 100, 10, 30, 0, 9)
      .attr(ConfuseAttr)
      .makesContact(false),
    new AttackMove(MoveId.BLOOD_MOON, ElementalType.NORMAL, MoveCategory.SPECIAL, 140, 100, 5, -1, 0, 9)
      .condition((user, _target, move) => {
        const turnMove = user.getLastXMoves(1);
        return !turnMove.length || turnMove[0].move.id !== move.id || turnMove[0].result !== MoveResult.SUCCESS;
      }) // TODO Add Instruct/Encore interaction
      .edgeCase(), // should be unselectable the turn after it's used
    new AttackMove(MoveId.MATCHA_GOTCHA, ElementalType.GRASS, MoveCategory.SPECIAL, 80, 90, 15, 20, 0, 9)
      .attr(HitHealAttr)
      .attr(HealStatusEffectAttr, true, StatusEffect.FREEZE)
      .attr(HealStatusEffectAttr, false, StatusEffect.FREEZE)
      .attr(StatusEffectAttr, StatusEffect.BURN)
      .target(MoveTarget.ALL_NEAR_ENEMIES)
      .triageMove(),
    new AttackMove(MoveId.SYRUP_BOMB, ElementalType.GRASS, MoveCategory.SPECIAL, 60, 85, 10, 100, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.SYRUP_BOMB, false, { turnCountMin: 3 })
      .bulletMove(),
    new AttackMove(MoveId.IVY_CUDGEL, ElementalType.GRASS, MoveCategory.PHYSICAL, 100, 100, 10, -1, 0, 9)
      .attr(IvyCudgelTypeAttr)
      .attr(HighCritAttr)
      .makesContact(false),
    new ChargingAttackMove(MoveId.ELECTRO_SHOT, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 130, 100, 10, 100, 0, 9)
      .chargeText(i18next.t("moveTriggers:absorbedElectricity", { pokemonName: "{USER}" }))
      .chargeAttr(StatStageChangeAttr, [Stat.SPATK], 1, true)
      .chargeAttr(WeatherInstantChargeAttr, [WeatherType.RAIN, WeatherType.HEAVY_RAIN]),
    new AttackMove(MoveId.TERA_STARSTORM, ElementalType.NORMAL, MoveCategory.SPECIAL, 120, 100, 5, -1, 0, 9)
      .attr(TeraMoveCategoryAttr)
      .attr(TeraStarstormTypeAttr)
      .attr(VariableTargetAttr, (user, _target, _move) =>
        user.species.speciesId === SpeciesId.TERAPAGOS && user.isTerastallized()
          ? MoveTarget.ALL_NEAR_ENEMIES
          : MoveTarget.NEAR_OTHER,
      ),
    new AttackMove(MoveId.FICKLE_BEAM, ElementalType.DRAGON, MoveCategory.SPECIAL, 80, 100, 5, 30, 0, 9)
      .attr(PreMoveMessageAttr, doublePowerChanceMessageFunc)
      .attr(DoublePowerChanceAttr)
      .edgeCase(), // Needs to be rewritten to not be affected by sheer force
    new SelfStatusMove(MoveId.BURNING_BULWARK, ElementalType.FIRE, -1, 10, -1, 4, 9)
      .attr(ProtectAttr, BattlerTagType.BURNING_BULWARK)
      .condition(failIfLastCondition),
    new AttackMove(MoveId.THUNDERCLAP, ElementalType.ELECTRIC, MoveCategory.SPECIAL, 70, 100, 5, -1, 1, 9)
      .condition(
        (_user, target, _move) => {
          const turnCommand = globalScene.currentBattle.turnManager.findCommandFromPokemon(target);
          if (!turnCommand || !turnCommand.turnMove) {
            return false;
          }
          return (
            turnCommand.command === BattleCommand.FIGHT
          && !target.turnData.acted
          && turnCommand.turnMove.move.category !== MoveCategory.STATUS
          );
        },
      ),
    new AttackMove(MoveId.MIGHTY_CLEAVE, ElementalType.ROCK, MoveCategory.PHYSICAL, 95, 100, 5, -1, 0, 9)
      .slicingMove()
      .ignoresProtect(),
    new AttackMove(MoveId.TACHYON_CUTTER, ElementalType.STEEL, MoveCategory.SPECIAL, 50, -1, 10, -1, 0, 9)
      .attr(MultiHitAttr, MultiHitType._2)
      .slicingMove(),
    new AttackMove(MoveId.HARD_PRESS, ElementalType.STEEL, MoveCategory.PHYSICAL, -1, 100, 10, -1, 0, 9)
      .attr(OpponentHighHpPowerAttr, 100),
    new StatusMove(MoveId.DRAGON_CHEER, ElementalType.DRAGON, -1, 15, -1, 0, 9)
      .attr(AddBattlerTagAttr, BattlerTagType.DRAGON_CHEER, false, { failOnOverlap: true })
      .target(MoveTarget.NEAR_ALLY),
    new AttackMove(MoveId.ALLURING_VOICE, ElementalType.FAIRY, MoveCategory.SPECIAL, 80, 100, 10, 100, 0, 9)
      .attr(AddBattlerTagIfBoostedAttr, BattlerTagType.CONFUSED)
      .soundMove(),
    new AttackMove(MoveId.TEMPER_FLARE, ElementalType.FIRE, MoveCategory.PHYSICAL, 75, 100, 10, -1, 0, 9)
      .attr(
        MovePowerMultiplierAttr,
        (user, _target, _move) => {
          const result = user.getLastXMoves(2)[1]?.result;
          if (!result) {
            return 1;
          }
          return [MoveResult.MISS, MoveResult.FAIL].includes(result) ? 2 : 1;
        },
      ),
    new AttackMove(MoveId.SUPERCELL_SLAM, ElementalType.ELECTRIC, MoveCategory.PHYSICAL, 100, 95, 15, -1, 0, 9)
      .attr(MissEffectAttr, crashDamageFunc)
      .attr(NoEffectAttr, crashDamageFunc)
      .recklessMove(),
    new AttackMove(MoveId.PSYCHIC_NOISE, ElementalType.PSYCHIC, MoveCategory.SPECIAL, 75, 100, 10, 100, 0, 9)
      .soundMove()
      .attr(AddBattlerTagAttr, BattlerTagType.HEAL_BLOCK, false, { turnCountMin: 2 }),
    new AttackMove(MoveId.UPPER_HAND, ElementalType.FIGHTING, MoveCategory.PHYSICAL, 65, 100, 15, 100, 3, 9)
      .attr(FlinchAttr)
      .condition(new UpperHandCondition()),
    new AttackMove(MoveId.MALIGNANT_CHAIN, ElementalType.POISON, MoveCategory.SPECIAL, 100, 100, 5, 50, 0, 9)
      .attr(StatusEffectAttr, StatusEffect.TOXIC),
  ];

  for (const move of rawAllMoves) {
    // Make sure `allMoves` assigns correct ID to every move
    allMoves.set(move.id, move);
    addFireMovesThawFrozenTargetAttribute(move);
  }
}

//#region Helpers

/**
 * All damaging (aka {@linkcode AttackMove}) Fire-type moves can now thaw a frozen target, regardless of whether or not they have a chance to burn.
 * @source {@link https://bulbapedia.bulbagarden.net/wiki/Freeze_(status_condition) | Bulbapedia - Freeze (Status Condition)}
 */
function addFireMovesThawFrozenTargetAttribute(move: Move) {
  if (move.type === ElementalType.FIRE && move.isAttackMove()) {
    move.addAttr(new HealStatusEffectAttr(false, StatusEffect.FREEZE));
  }
}

//#endregion
