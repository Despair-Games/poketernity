import { AbBuilder } from "#abilities/ab-builder";
import { AccuracyMultiplierAbAttr } from "#abilities/accuracy-multiplier-ab-attr";
import { AddSecondStrikeAbAttr } from "#abilities/add-second-strike-ab-attr";
import { AlliedFieldDamageReductionAbAttr } from "#abilities/allied-field-damage-reduction-ab-attr";
import { AllyMoveCategoryPowerBoostAbAttr } from "#abilities/ally-move-category-power-boost-ab-attr";
import { AlwaysHitAbAttr } from "#abilities/always-hit-ab-attr";
import { AnticipationAbAttr } from "#abilities/anticipation-ab-attr";
import { ArenaTrapAbAttr } from "#abilities/arena-trap-ab-attr";
import { BadDreamsAbAttr } from "#abilities/bad-dreams-ab-attr";
import { BattlerTagImmunityAbAttr } from "#abilities/battler-tag-immunity-ab-attr";
import { BlockCritAbAttr } from "#abilities/block-crit-ab-attr";
import { BlockItemTheftAbAttr } from "#abilities/block-item-theft-ab-attr";
import { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import { BlockOneHitKOAbAttr } from "#abilities/block-one-hit-ko-ab-attr";
import { BlockRecoilDamageAbAttr } from "#abilities/block-recoil-damage-ab-attr";
import { BlockRedirectAbAttr } from "#abilities/block-redirect-ab-attr";
import { BlockStatusDamageAbAttr } from "#abilities/block-status-damage-ab-attr";
import { BlockWeatherDamageAbAttr } from "#abilities/block-weather-damage-ab-attr";
import { BonusCritAbAttr } from "#abilities/bonus-crit-ab-attr";
import { BypassBurnDamageReductionAbAttr } from "#abilities/bypass-burn-damage-reduction-ab-attr";
import { BypassParaSpeedReductionAbAttr } from "#abilities/bypass-para-speed-reduction-ab-attr";
import { BypassSpeedChanceAbAttr } from "#abilities/bypass-speed-chance-ab-attr";
import { ChangeMovePriorityAbAttr } from "#abilities/change-move-priority-ab-attr";
import { CommanderAbAttr } from "#abilities/commander-ab-attr";
import { ConditionalCritAbAttr } from "#abilities/conditional-crit-ab-attr";
import { ConfusionOnStatusEffectAbAttr } from "#abilities/confusion-on-status-effect-ab-attr";
import { CopyFaintedAllyAbilityAbAttr } from "#abilities/copy-fainted-ally-ability-ab-attr";
import { DamageBoostAbAttr } from "#abilities/damage-boost-ab-attr";
import { DefiantCompetitiveAbAttr } from "#abilities/defiant-competitive-ab-attr";
import { DoubleBattleChanceAbAttr } from "#abilities/double-battle-chance-ab-attr";
import { DoubleBerryEffectAbAttr } from "#abilities/double-berry-effect-ab-attr";
import { DownloadAbAttr } from "#abilities/download-ab-attr";
import { EffectSporeAbAttr } from "#abilities/effect-spore-ab-attr";
import { EffectiveStatMultiplierAbAttr } from "#abilities/effective-stat-multiplier-ab-attr";
import { EvasivenessMultiplierAbAttr } from "#abilities/evasiveness-multiplier-ab-attr";
import { FetchBallAbAttr } from "#abilities/fetch-ball-ab-attr";
import { FieldAccuracyMultiplierAbAttr } from "#abilities/field-accuracy-multiplier-ab-attr";
import { FieldMoveTypePowerBoostAbAttr } from "#abilities/field-move-type-power-boost-ab-attr";
import { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import { FieldPriorityMoveImmunityAbAttr } from "#abilities/field-priority-move-immunity-ab-attr";
import { FlinchStatStageChangeAbAttr } from "#abilities/flinch-stat-stage-change-ab-attr";
import { ForceSwitchOutImmunityAbAttr } from "#abilities/force-switch-out-immunity-ab-attr";
import { ForewarnAbAttr } from "#abilities/forewarn-ab-attr";
import { FormBlockDamageAbAttr } from "#abilities/form-block-damage-ab-attr";
import { FriskAbAttr } from "#abilities/frisk-ab-attr";
import { FullHpResistTypeAbAttr } from "#abilities/full-hp-resist-type-ab-attr";
import { GorillaTacticsAbAttr } from "#abilities/gorilla-tactics-ab-attr";
import { HealFromBerryUseAbAttr } from "#abilities/heal-from-berry-use-ab-attr";
import { IgnoreContactAbAttr } from "#abilities/ignore-contact-ab-attr";
import { IgnoreMoveEffectsAbAttr } from "#abilities/ignore-move-effects-ab-attr";
import { IgnoreOpponentStatStagesAbAttr } from "#abilities/ignore-opponent-stat-stages-ab-attr";
import { IgnoreProtectOnContactAbAttr } from "#abilities/ignore-protect-on-contact-ab-attr";
import { IgnoreTypeImmunityAbAttr } from "#abilities/ignore-type-immunity-ab-attr";
import { IgnoreTypeStatusEffectImmunityAbAttr } from "#abilities/ignore-type-status-effect-immunity-ab-attr";
import { IncreasePpAbAttr } from "#abilities/increase-pp-ab-attr";
import { InfiltratorAbAttr } from "#abilities/infiltrator-ab-attr";
import { IntimidateImmunityAbAttr } from "#abilities/intimidate-immunity-ab-attr";
import { LevitateImmunityAbAttr } from "#abilities/levitate-immunity-ab-attr";
import { LowHpMoveTypeAttackMultiplierAbAttr } from "#abilities/low-hp-move-type-attack-multiplier-ab-attr";
import { MaxMultiHitAbAttr } from "#abilities/max-multi-hit-ab-attr";
import { MockStatusEffectAbAttr } from "#abilities/mock-status-effect-ab-attr";
import { MoneyAbAttr } from "#abilities/money-ab-attr";
import { MoodyAbAttr } from "#abilities/moody-ab-attr";
import { MoveAbilityBypassAbAttr } from "#abilities/move-ability-bypass-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "#abilities/move-effect-chance-multiplier-ab-attr";
import { MoveFlagImmunityAbAttr } from "#abilities/move-flag-immunity-ab-attr";
import { MoveFlagPowerBoostAbAttr } from "#abilities/move-flag-power-boost-ab-attr";
import { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import { MoveImmunityStatStageChangeAbAttr } from "#abilities/move-immunity-stat-stage-change-ab-attr";
import { MovePowerBoostAbAttr } from "#abilities/move-power-boost-ab-attr";
import { MoveTypeChangeAbAttr } from "#abilities/move-type-change-ab-attr";
import { MoveTypePowerBoostAbAttr } from "#abilities/move-type-power-boost-ab-attr";
import { MultCritAbAttr } from "#abilities/mult-crit-ab-attr";
import { NonSuperEffectiveImmunityAbAttr } from "#abilities/non-super-effective-immunity-ab-attr";
import { PokemonTypeChangeAbAttr } from "#abilities/pokemon-type-change-ab-attr";
import { PostAttackApplyBattlerTagAbAttr } from "#abilities/post-attack-apply-battler-tag-ab-attr";
import { PostAttackApplyStatusEffectAbAttr } from "#abilities/post-attack-apply-status-effect-ab-attr";
import { PostAttackStealHeldItemAbAttr } from "#abilities/post-attack-steal-held-item-ab-attr";
import { PostBattleInitFormChangeAbAttr } from "#abilities/post-battle-init-form-change-ab-attr";
import { PostBattleLootAbAttr } from "#abilities/post-battle-loot-ab-attr";
import { PostDamageForceSwitchAbAttr } from "#abilities/post-damage-force-switch-ab-attr";
import { PostDancingMoveAbAttr } from "#abilities/post-dancing-move-ab-attr";
import { PostDefendAbilityGiveAbAttr } from "#abilities/post-defend-ability-give-ab-attr";
import { PostDefendAbilitySwapAbAttr } from "#abilities/post-defend-ability-swap-ab-attr";
import { PostDefendApplyBattlerTagAbAttr } from "#abilities/post-defend-apply-battler-tag-ab-attr";
import { PostDefendApplyEntryHazardTagAbAttr } from "#abilities/post-defend-apply-entry-hazard-tag-ab-attr";
import { PostDefendContactApplyStatusEffectAbAttr } from "#abilities/post-defend-contact-apply-status-effect-ab-attr";
import { PostDefendContactApplyTagChanceAbAttr } from "#abilities/post-defend-contact-apply-tag-chance-ab-attr";
import { PostDefendContactDamageAbAttr } from "#abilities/post-defend-contact-damage-ab-attr";
import { PostDefendCritStatStageChangeAbAttr } from "#abilities/post-defend-crit-stat-stage-change-ab-attr";
import { PostDefendHpGatedStatStageChangeAbAttr } from "#abilities/post-defend-hp-gated-stat-stage-change-ab-attr";
import { PostDefendMoveDisableAbAttr } from "#abilities/post-defend-move-disable-ab-attr";
import { PostDefendPerishSongAbAttr } from "#abilities/post-defend-perish-song-ab-attr";
import { PostDefendStatStageChangeAbAttr } from "#abilities/post-defend-stat-stage-change-ab-attr";
import { PostDefendStealHeldItemAbAttr } from "#abilities/post-defend-steal-held-item-ab-attr";
import { PostDefendTerrainChangeAbAttr } from "#abilities/post-defend-terrain-change-ab-attr";
import { PostDefendTypeChangeAbAttr } from "#abilities/post-defend-type-change-ab-attr";
import { PostDefendWeatherChangeAbAttr } from "#abilities/post-defend-weather-change-ab-attr";
import { PostFaintContactDamageAbAttr } from "#abilities/post-faint-contact-damage-ab-attr";
import { PostFaintHPDamageAbAttr } from "#abilities/post-faint-hp-damage-ab-attr";
import { PostFaintUnsuppressedWeatherFormChangeAbAttr } from "#abilities/post-faint-unsuppressed-weather-form-change-ab-attr";
import { PostIntimidateStatStageChangeAbAttr } from "#abilities/post-intimidate-stat-stage-change-ab-attr";
import { PostItemLostApplyBattlerTagAbAttr } from "#abilities/post-item-lost-apply-battler-tag-ab-attr";
import { PostKnockOutStatStageChangeAbAttr } from "#abilities/post-knock-out-stat-stage-change-ab-attr";
import { PostSummonAddBattlerTagAbAttr } from "#abilities/post-summon-add-battler-tag-ab-attr";
import { PostSummonAllyHealAbAttr } from "#abilities/post-summon-ally-heal-ab-attr";
import { PostSummonClearAllyStatStagesAbAttr } from "#abilities/post-summon-clear-ally-stat-stages-ab-attr";
import { PostSummonCopyAbilityAbAttr } from "#abilities/post-summon-copy-ability-ab-attr";
import { PostSummonCopyAllyStatsAbAttr } from "#abilities/post-summon-copy-ally-stats-ab-attr";
import { PostSummonFormChangeAbAttr } from "#abilities/post-summon-form-change-ab-attr";
import { PostSummonFormChangeByWeatherAbAttr } from "#abilities/post-summon-form-change-by-weather-ab-attr";
import { PostSummonMessageAbAttr } from "#abilities/post-summon-message-ab-attr";
import { PostSummonRemoveArenaTagAbAttr } from "#abilities/post-summon-remove-arena-tag-ab-attr";
import { PostSummonStatStageChangeAbAttr } from "#abilities/post-summon-stat-stage-change-ab-attr";
import { PostSummonStatStageChangeOnArenaAbAttr } from "#abilities/post-summon-stat-stage-change-on-arena-ab-attr";
import { PostSummonTerrainChangeAbAttr } from "#abilities/post-summon-terrain-change-ab-attr";
import { PostSummonTransformAbAttr } from "#abilities/post-summon-transform-ab-attr";
import { PostSummonUnnamedMessageAbAttr } from "#abilities/post-summon-unnamed-message-ab-attr";
import { PostSummonUserFieldRemoveStatusEffectAbAttr } from "#abilities/post-summon-user-field-remove-status-effect-ab-attr";
import { PostSummonWeatherChangeAbAttr } from "#abilities/post-summon-weather-change-ab-attr";
import { PostSummonWeatherSuppressedFormChangeAbAttr } from "#abilities/post-summon-weather-suppressed-form-change-ab-attr";
import { PostTeraFormChangeClearWeatherTerrainAbAttr } from "#abilities/post-tera-form-change-clear-weather-terrain-ab-attr";
import { PostTeraFormChangeStatChangeAbAttr } from "#abilities/post-tera-form-change-stat-change-ab-attr";
import { PostTerrainChangeAddBattlerTagAbAttr } from "#abilities/post-terrain-change-add-battler-tag-ab-attr";
import { PostTurnFormChangeAbAttr } from "#abilities/post-turn-form-change-ab-attr";
import { PostTurnLootAbAttr } from "#abilities/post-turn-loot-ab-attr";
import { PostTurnResetStatusAbAttr } from "#abilities/post-turn-reset-status-ab-attr";
import { PostTurnStatusHealAbAttr } from "#abilities/post-turn-status-heal-ab-attr";
import { PostVictoryFormChangeAbAttr } from "#abilities/post-victory-form-change-ab-attr";
import { PostVictoryStatStageChangeAbAttr } from "#abilities/post-victory-stat-stage-change-ab-attr";
import { PostWeatherChangeAddBattlerTagAbAttr } from "#abilities/post-weather-change-add-battler-tag-ab-attr";
import { PostWeatherChangeFormChangeAbAttr } from "#abilities/post-weather-change-form-change-ab-attr";
import { PostWeatherLapseDamageAbAttr } from "#abilities/post-weather-lapse-damage-ab-attr";
import { PostWeatherLapseHealAbAttr } from "#abilities/post-weather-lapse-heal-ab-attr";
import { PreLeaveFieldClearWeatherAbAttr } from "#abilities/pre-leave-field-ab-attrs";
import { PreSwitchOutFormChangeAbAttr } from "#abilities/pre-switch-out-form-change-ab-attr";
import { PreSwitchOutHealAbAttr } from "#abilities/pre-switch-out-heal-ab-attr";
import { PreSwitchOutResetStatusAbAttr } from "#abilities/pre-switch-out-reset-status-ab-attr";
import { PreventBerryUseAbAttr } from "#abilities/prevent-berry-use-ab-attr";
import { PreventBypassSpeedChanceAbAttr } from "#abilities/prevent-bypass-speed-chance-ab-attr";
import { ProtectStatAbAttr } from "#abilities/protect-stat-ab-attr";
import { ReceivedMoveDamageMultiplierAbAttr } from "#abilities/received-move-damage-multiplier-ab-attr";
import { ReceivedTypeDamageMultiplierAbAttr } from "#abilities/received-type-damage-multiplier-ab-attr";
import { RecoveryBoostAbAttr } from "#abilities/recovery-boost-ab-attr";
import { RedirectTypeMoveAbAttr } from "#abilities/redirect-type-move-ab-attr";
import { ReduceBerryUseThresholdAbAttr } from "#abilities/reduce-berry-use-threshold-ab-attr";
import { ReduceBurnDamageAbAttr } from "#abilities/reduce-burn-damage-ab-attr";
import { ReduceSleepDurationAbAttr } from "#abilities/reduce-sleep-duration-ab-attr";
import { ReflectMovesAbAttr } from "#abilities/reflect-moves-ab-attr";
import { ReflectStatStageChangeAbAttr } from "#abilities/reflect-stat-stage-change-ab-attr";
import { ReverseDrainAbAttr } from "#abilities/reverse-drain-ab-attr";
import { RunSuccessAbAttr } from "#abilities/run-success-ab-attr";
import { SpeedBoostAbAttr } from "#abilities/speed-boost-ab-attr";
import { StabBoostAbAttr } from "#abilities/stab-boost-ab-attr";
import { StatStageChangeCopyAbAttr } from "#abilities/stat-stage-change-copy-ab-attr";
import { StatStageChangeMultiplierAbAttr } from "#abilities/stat-stage-change-multiplier-ab-attr";
import { StatusEffectImmunityAbAttr } from "#abilities/status-effect-immunity-ab-attr";
import { SturdyAbAttr } from "#abilities/sturdy-ab-attr";
import { SuppressFieldAbilitiesAbAttr } from "#abilities/suppress-field-abilities-ab-attr";
import { SuppressWeatherEffectAbAttr } from "#abilities/suppress-weather-effect-ab-attr";
import { SyncEncounterNatureAbAttr } from "#abilities/sync-encounter-nature-ab-attr";
import { SynchronizeStatusAbAttr } from "#abilities/synchronize-status-ab-attr";
import { TerrainEventTypeChangeAbAttr } from "#abilities/terrain-event-type-change-ab-attr";
import { TreasureOfRuinAbAttr } from "#abilities/treasure-of-ruin-ab-attr";
import { TypeImmunityAddBattlerTagAbAttr } from "#abilities/type-immunity-add-battler-tag-ab-attr";
import { TypeImmunityHealAbAttr } from "#abilities/type-immunity-heal-ab-attr";
import { TypeImmunityStatStageChangeAbAttr } from "#abilities/type-immunity-stat-stage-change-ab-attr";
import { UserFieldBattlerTagImmunityAbAttr } from "#abilities/user-field-battler-tag-immunity-ab-attr";
import { UserFieldMoveTypePowerBoostAbAttr } from "#abilities/user-field-move-type-power-boost-ab-attr";
import { UserFieldStatusEffectImmunityAbAttr } from "#abilities/user-field-status-effect-immunity-ab-attr";
import { VariableMovePowerBoostAbAttr } from "#abilities/variable-move-power-boost-ab-attr";
import { WeatherBasedSpeedDoublerAbAttr } from "#abilities/weather-based-speed-doubler-ab-attr";
import { WeightMultiplierAbAttr } from "#abilities/weight-multiplier-ab-attr";
import { WonderSkinAbAttr } from "#abilities/wonder-skin-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { NON_VOLATILE_STATUS_EFFECTS } from "#constants/game-constants";
import { RAINY_WEATHER_TYPES, SNOWY_WEATHER_TYPES, SUNNY_WEATHER_TYPES } from "#constants/weather-constants";
import { allAbilities, allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { Gender } from "#enums/gender";
import { MoveCategory } from "#enums/move-category";
import { MoveFlags } from "#enums/move-flags";
import { EFFECTIVE_STATS, type EffectiveStat, Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import { FlinchAttr } from "#moves/flinch-attr";
import type { Move } from "#moves/move";
import { VariablePowerAttr } from "#moves/variable-power-attr";
import type { AbAttrCondition } from "#types/ability-types";
import type { NonEmptyArray } from "#types/utility-types";
import {
  anyTypeMoveConversionCondition,
  getWeatherCondition,
  normalTypeMoveConversionCondition,
} from "#utils/ability-utils";
import { NumberHolder, toDmgValue } from "#utils/common-utils";
import { getStatKey } from "#utils/i18n-utils";
import { applyMoveAttrs } from "#utils/move-utils";
import i18next from "i18next";

export function initAbilities(): void {
  allAbilities.push(
    new AbBuilder(AbilityId.NONE, 3) //
      .build(),
    new AbBuilder(AbilityId.STENCH, 3) //
      .attr(
        PostAttackApplyBattlerTagAbAttr,
        false,
        (_user, target, move) =>
          !move.hasAttr(FlinchAttr) && !target.turnData.acted && move.category !== MoveCategory.STATUS ? 10 : 0,
        BattlerTagType.FLINCHED,
      )
      .build(),
    new AbBuilder(AbilityId.DRIZZLE, 3) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.RAIN)
      .build(),
    new AbBuilder(AbilityId.SPEED_BOOST, 3) //
      .attr(SpeedBoostAbAttr)
      .build(),
    new AbBuilder(AbilityId.BATTLE_ARMOR, 3) //
      .attr(BlockCritAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.STURDY, 3) //
      .attr(SturdyAbAttr)
      .attr(BlockOneHitKOAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.DAMP, 3) //
      .attr(FieldPreventExplosionLikeAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.LIMBER, 3) //
      .attr(StatusEffectImmunityAbAttr, StatusEffect.PARALYSIS)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SAND_VEIL, 3) //
      .attr(EvasivenessMultiplierAbAttr, 1.2)
      .attr(BlockWeatherDamageAbAttr, WeatherType.SANDSTORM)
      .condition(getWeatherCondition(WeatherType.SANDSTORM))
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.STATIC, 3) //
      .attr(PostDefendContactApplyStatusEffectAbAttr, 30, StatusEffect.PARALYSIS)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.VOLT_ABSORB, 3) //
      .attr(TypeImmunityHealAbAttr, ElementalType.ELECTRIC)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.WATER_ABSORB, 3) //
      .attr(TypeImmunityHealAbAttr, ElementalType.WATER)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.OBLIVIOUS, 3) //
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.INFATUATED, BattlerTagType.TAUNT)
      .attr(IntimidateImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.CLOUD_NINE, 3) //
      .attr(SuppressWeatherEffectAbAttr)
      .attr(PostSummonUnnamedMessageAbAttr, i18next.t("abilityTriggers:weatherEffectDisappeared"))
      .attr(PostSummonWeatherSuppressedFormChangeAbAttr)
      .attr(PostFaintUnsuppressedWeatherFormChangeAbAttr)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.COMPOUND_EYES, 3) //
      .attr(AccuracyMultiplierAbAttr, 1.3)
      .build(),
    new AbBuilder(AbilityId.INSOMNIA, 3) //
      .attr(StatusEffectImmunityAbAttr, StatusEffect.SLEEP)
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.DROWSY)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.COLOR_CHANGE, 3) //
      .attr(PostDefendTypeChangeAbAttr)
      .condition(getSheerForceHitDisableAbCondition())
      .build(),
    new AbBuilder(AbilityId.IMMUNITY, 3) //
      .attr(StatusEffectImmunityAbAttr, StatusEffect.POISON, StatusEffect.TOXIC)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.FLASH_FIRE, 3) //
      .attr(TypeImmunityAddBattlerTagAbAttr, ElementalType.FIRE, BattlerTagType.FIRE_BOOST, 1)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SHIELD_DUST, 3) //
      .attr(IgnoreMoveEffectsAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.OWN_TEMPO, 3) //
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.CONFUSED)
      .attr(IntimidateImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SUCTION_CUPS, 3) //
      .attr(ForceSwitchOutImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.INTIMIDATE, 3) //
      .attr(PostSummonStatStageChangeAbAttr, [Stat.ATK], -1, false, true)
      .build(),
    new AbBuilder(AbilityId.SHADOW_TAG, 3) //
      .attr(ArenaTrapAbAttr, (_user, target) => {
        if (target.hasAbility(AbilityId.SHADOW_TAG)) {
          return false;
        }
        return true;
      })
      .build(),
    new AbBuilder(AbilityId.ROUGH_SKIN, 3) //
      .attr(PostDefendContactDamageAbAttr, 8)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.WONDER_GUARD, 3) //
      .attr(NonSuperEffectiveImmunityAbAttr)
      .uncopiable()
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.LEVITATE, 3) //
      .attr(
        LevitateImmunityAbAttr,
        ElementalType.GROUND,
        (pokemon: Pokemon) =>
          !pokemon.hasTag(BattlerTagType.IGNORE_FLYING) && !globalScene.arena.hasTag(ArenaTagType.GRAVITY),
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.EFFECT_SPORE, 3) //
      .attr(EffectSporeAbAttr)
      .build(),
    new AbBuilder(AbilityId.SYNCHRONIZE, 3) //
      .attr(SyncEncounterNatureAbAttr)
      .attr(SynchronizeStatusAbAttr)
      .build(),
    new AbBuilder(AbilityId.CLEAR_BODY, 3) //
      .attr(ProtectStatAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.NATURAL_CURE, 3) //
      .attr(PreSwitchOutResetStatusAbAttr)
      .build(),
    new AbBuilder(AbilityId.LIGHTNING_ROD, 3) //
      .attr(RedirectTypeMoveAbAttr, ElementalType.ELECTRIC)
      .attr(TypeImmunityStatStageChangeAbAttr, ElementalType.ELECTRIC, Stat.SPATK, 1)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SERENE_GRACE, 3) //
      .attr(MoveEffectChanceMultiplierAbAttr, 2)
      .build(),
    new AbBuilder(AbilityId.SWIFT_SWIM, 3) //
      .attr(WeatherBasedSpeedDoublerAbAttr, ...RAINY_WEATHER_TYPES)
      .build(),
    new AbBuilder(AbilityId.CHLOROPHYLL, 3) //
      .attr(WeatherBasedSpeedDoublerAbAttr, ...SUNNY_WEATHER_TYPES)
      .build(),
    new AbBuilder(AbilityId.ILLUMINATE, 3) //
      .attr(ProtectStatAbAttr, Stat.ACC)
      .attr(DoubleBattleChanceAbAttr)
      .attr(IgnoreOpponentStatStagesAbAttr, [Stat.EVA])
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.TRACE, 3) //
      .attr(PostSummonCopyAbilityAbAttr)
      .uncopiable()
      .build(),
    new AbBuilder(AbilityId.HUGE_POWER, 3) //
      .attr(EffectiveStatMultiplierAbAttr, Stat.ATK, 2)
      .build(),
    new AbBuilder(AbilityId.POISON_POINT, 3) //
      .attr(PostDefendContactApplyStatusEffectAbAttr, 30, StatusEffect.POISON)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.INNER_FOCUS, 3) //
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.FLINCHED)
      .attr(IntimidateImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.MAGMA_ARMOR, 3) //
      .attr(StatusEffectImmunityAbAttr, StatusEffect.FREEZE)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.WATER_VEIL, 3) //
      .attr(StatusEffectImmunityAbAttr, StatusEffect.BURN)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.MAGNET_PULL, 3) //
      .attr(ArenaTrapAbAttr, (_user, target) => {
        if (
          target.getTypes(true).includes(ElementalType.STEEL)
          || (target.getTypes(true).includes(ElementalType.STELLAR) && target.getTypes().includes(ElementalType.STEEL))
        ) {
          return true;
        }
        return false;
      })
      .build(),
    new AbBuilder(AbilityId.SOUNDPROOF, 3) //
      .attr(MoveFlagImmunityAbAttr, MoveFlags.SOUND_MOVE)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.RAIN_DISH, 3) //
      .attr(PostWeatherLapseHealAbAttr, 1 / 16, ...RAINY_WEATHER_TYPES)
      .build(),
    new AbBuilder(AbilityId.SAND_STREAM, 3) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SANDSTORM)
      .build(),
    new AbBuilder(AbilityId.PRESSURE, 3) //
      .attr(IncreasePpAbAttr)
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonPressure", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      // Does not affect PP cost for field-targeting moves or Snatch
      .partial()
      .build(),
    new AbBuilder(AbilityId.THICK_FAT, 3) //
      .attr(ReceivedTypeDamageMultiplierAbAttr, ElementalType.FIRE, 0.5)
      .attr(ReceivedTypeDamageMultiplierAbAttr, ElementalType.ICE, 0.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.EARLY_BIRD, 3) //
      .attr(ReduceSleepDurationAbAttr)
      .build(),
    new AbBuilder(AbilityId.FLAME_BODY, 3) //
      .attr(PostDefendContactApplyStatusEffectAbAttr, 30, StatusEffect.BURN)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.RUN_AWAY, 3) //
      .attr(RunSuccessAbAttr)
      .build(),
    new AbBuilder(AbilityId.KEEN_EYE, 3) //
      .attr(ProtectStatAbAttr, Stat.ACC)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.HYPER_CUTTER, 3) //
      .attr(ProtectStatAbAttr, Stat.ATK)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.PICKUP, 3) //
      .attr(PostBattleLootAbAttr)
      .build(),
    new AbBuilder(AbilityId.TRUANT, 3) //
      .attr(PostSummonAddBattlerTagAbAttr, BattlerTagType.TRUANT, 1, false)
      .build(),
    new AbBuilder(AbilityId.HUSTLE, 3) //
      .attr(EffectiveStatMultiplierAbAttr, Stat.ATK, 1.5)
      .attr(AccuracyMultiplierAbAttr, 0.8, (_user, move) => move?.category === MoveCategory.PHYSICAL)
      .build(),
    new AbBuilder(AbilityId.CUTE_CHARM, 3) //
      .attr(PostDefendContactApplyTagChanceAbAttr, 30, BattlerTagType.INFATUATED)
      .build(),
    new AbBuilder(AbilityId.PLUS, 3) //
      .conditionalAttr(
        (p) =>
          globalScene.currentBattle.double && [AbilityId.PLUS, AbilityId.MINUS].some((a) => p.getAlly()?.hasAbility(a)),
        EffectiveStatMultiplierAbAttr,
        Stat.SPATK,
        1.5,
      )
      .build(),
    new AbBuilder(AbilityId.MINUS, 3) //
      .conditionalAttr(
        (p) =>
          globalScene.currentBattle.double && [AbilityId.PLUS, AbilityId.MINUS].some((a) => p.getAlly()?.hasAbility(a)),
        EffectiveStatMultiplierAbAttr,
        Stat.SPATK,
        1.5,
      )
      .build(),
    new AbBuilder(AbilityId.FORECAST, 3, -2) //
      .uncopiable()
      .unreplaceable()
      .attr(PostSummonFormChangeByWeatherAbAttr)
      .attr(
        PostWeatherChangeFormChangeAbAttr,
        WeatherType.NONE,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
      )
      .build(),
    new AbBuilder(AbilityId.STICKY_HOLD, 3) //
      .attr(BlockItemTheftAbAttr)
      .bypassFaint()
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SHED_SKIN, 3) //
      .conditionalAttr((pokemon) => !pokemon.randSeedInt(3), PostTurnResetStatusAbAttr)
      .build(),
    new AbBuilder(AbilityId.GUTS, 3) //
      .attr(BypassBurnDamageReductionAbAttr)
      .conditionalAttr((pokemon) => pokemon.hasNonVolatileStatusEffect(), EffectiveStatMultiplierAbAttr, Stat.ATK, 1.5)
      .build(),
    new AbBuilder(AbilityId.MARVEL_SCALE, 3) //
      .conditionalAttr((pokemon) => pokemon.hasNonVolatileStatusEffect(), EffectiveStatMultiplierAbAttr, Stat.DEF, 1.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.LIQUID_OOZE, 3) //
      .attr(ReverseDrainAbAttr)
      .build(),
    new AbBuilder(AbilityId.OVERGROW, 3) //
      .attr(LowHpMoveTypeAttackMultiplierAbAttr, ElementalType.GRASS)
      .build(),
    new AbBuilder(AbilityId.BLAZE, 3) //
      .attr(LowHpMoveTypeAttackMultiplierAbAttr, ElementalType.FIRE)
      .build(),
    new AbBuilder(AbilityId.TORRENT, 3) //
      .attr(LowHpMoveTypeAttackMultiplierAbAttr, ElementalType.WATER)
      .build(),
    new AbBuilder(AbilityId.SWARM, 3) //
      .attr(LowHpMoveTypeAttackMultiplierAbAttr, ElementalType.BUG)
      .build(),
    new AbBuilder(AbilityId.ROCK_HEAD, 3) //
      .attr(BlockRecoilDamageAbAttr)
      .build(),
    new AbBuilder(AbilityId.DROUGHT, 3) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SUNNY)
      .build(),
    new AbBuilder(AbilityId.ARENA_TRAP, 3) //
      .attr(ArenaTrapAbAttr, (_user, target) => target.isGrounded())
      .attr(DoubleBattleChanceAbAttr)
      .build(),
    new AbBuilder(AbilityId.VITAL_SPIRIT, 3) //
      .attr(StatusEffectImmunityAbAttr, StatusEffect.SLEEP)
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.DROWSY)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.WHITE_SMOKE, 3) //
      .attr(ProtectStatAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.PURE_POWER, 3) //
      .attr(EffectiveStatMultiplierAbAttr, Stat.ATK, 2)
      .build(),
    new AbBuilder(AbilityId.SHELL_ARMOR, 3) //
      .attr(BlockCritAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.AIR_LOCK, 3) //
      .attr(SuppressWeatherEffectAbAttr)
      .attr(PostSummonUnnamedMessageAbAttr, i18next.t("abilityTriggers:weatherEffectDisappeared"))
      .attr(PostSummonWeatherSuppressedFormChangeAbAttr)
      .attr(PostFaintUnsuppressedWeatherFormChangeAbAttr)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.TANGLED_FEET, 4) //
      .conditionalAttr((pokemon) => pokemon.hasTag(BattlerTagType.CONFUSED), EvasivenessMultiplierAbAttr, 2)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.MOTOR_DRIVE, 4) //
      .attr(TypeImmunityStatStageChangeAbAttr, ElementalType.ELECTRIC, Stat.SPD, 1)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.RIVALRY, 4) //
      .attr(
        MovePowerBoostAbAttr,
        (user, target, _move) =>
          user?.gender !== Gender.GENDERLESS && target?.gender !== Gender.GENDERLESS && user?.gender === target?.gender,
        1.25,
      )
      .attr(
        MovePowerBoostAbAttr,
        (user, target, _move) =>
          user?.gender !== Gender.GENDERLESS && target?.gender !== Gender.GENDERLESS && user?.gender !== target?.gender,
        0.75,
      )
      .build(),
    new AbBuilder(AbilityId.STEADFAST, 4) //
      .attr(FlinchStatStageChangeAbAttr, [Stat.SPD], 1)
      .build(),
    new AbBuilder(AbilityId.SNOW_CLOAK, 4) //
      .attr(EvasivenessMultiplierAbAttr, 1.2)
      .attr(BlockWeatherDamageAbAttr, WeatherType.HAIL)
      .condition(getWeatherCondition(...SNOWY_WEATHER_TYPES))
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.GLUTTONY, 4) //
      .attr(ReduceBerryUseThresholdAbAttr)
      .build(),
    new AbBuilder(AbilityId.ANGER_POINT, 4) //
      .attr(PostDefendCritStatStageChangeAbAttr, Stat.ATK, 12)
      .build(),
    new AbBuilder(AbilityId.UNBURDEN, 4) //
      .attr(PostItemLostApplyBattlerTagAbAttr, BattlerTagType.UNBURDEN)
      // Allows reviver seed to activate Unburden
      .bypassFaint()
      // Should not restore Unburden boost if Pokemon loses then regains Unburden ability
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.HEATPROOF, 4) //
      .attr(ReceivedTypeDamageMultiplierAbAttr, ElementalType.FIRE, 0.5)
      .attr(ReduceBurnDamageAbAttr, 0.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SIMPLE, 4) //
      .attr(StatStageChangeMultiplierAbAttr, 2)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.DRY_SKIN, 4) //
      .attr(PostWeatherLapseDamageAbAttr, 1 / 8, ...SUNNY_WEATHER_TYPES)
      .attr(PostWeatherLapseHealAbAttr, 1 / 8, ...RAINY_WEATHER_TYPES)
      .attr(ReceivedTypeDamageMultiplierAbAttr, ElementalType.FIRE, 1.25)
      .attr(TypeImmunityHealAbAttr, ElementalType.WATER)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.DOWNLOAD, 4) //
      .attr(DownloadAbAttr)
      .build(),
    new AbBuilder(AbilityId.IRON_FIST, 4) //
      .attr(MoveFlagPowerBoostAbAttr, MoveFlags.PUNCHING_MOVE, 1.2)
      .build(),
    new AbBuilder(AbilityId.POISON_HEAL, 4) //
      .attr(PostTurnStatusHealAbAttr, StatusEffect.TOXIC, StatusEffect.POISON)
      .attr(BlockStatusDamageAbAttr, StatusEffect.TOXIC, StatusEffect.POISON)
      .build(),
    new AbBuilder(AbilityId.ADAPTABILITY, 4) //
      .attr(StabBoostAbAttr)
      .build(),
    new AbBuilder(AbilityId.SKILL_LINK, 4) //
      .attr(MaxMultiHitAbAttr)
      .build(),
    new AbBuilder(AbilityId.HYDRATION, 4) //
      .attr(PostTurnResetStatusAbAttr)
      .condition(getWeatherCondition(...RAINY_WEATHER_TYPES))
      .build(),
    new AbBuilder(AbilityId.SOLAR_POWER, 4) //
      .attr(PostWeatherLapseDamageAbAttr, 1 / 8, ...SUNNY_WEATHER_TYPES)
      .attr(EffectiveStatMultiplierAbAttr, Stat.SPATK, 1.5, getWeatherCondition(...SUNNY_WEATHER_TYPES))
      .build(),
    new AbBuilder(AbilityId.QUICK_FEET, 4) //
      .attr(BypassParaSpeedReductionAbAttr)
      .conditionalAttr((pokemon) => pokemon.hasNonVolatileStatusEffect(), EffectiveStatMultiplierAbAttr, Stat.SPD, 1.5)
      .build(),
    new AbBuilder(AbilityId.NORMALIZE, 4) //
      .attr(MoveTypeChangeAbAttr, ElementalType.NORMAL, 1.2, anyTypeMoveConversionCondition)
      .build(),
    new AbBuilder(AbilityId.SNIPER, 4) //
      .attr(MultCritAbAttr, 1.5)
      .build(),
    new AbBuilder(AbilityId.MAGIC_GUARD, 4) //
      .attr(BlockNonDirectDamageAbAttr)
      .build(),
    new AbBuilder(AbilityId.NO_GUARD, 4) //
      .attr(AlwaysHitAbAttr)
      .attr(DoubleBattleChanceAbAttr)
      .build(),
    new AbBuilder(AbilityId.STALL, 4) //
      .attr(ChangeMovePriorityAbAttr, (_pokemon, _move: Move) => true, -0.2)
      .build(),
    new AbBuilder(AbilityId.TECHNICIAN, 4) //
      .attr(
        MovePowerBoostAbAttr,
        (user, target, move) => {
          if (!move || !user || !target) {
            return false;
          }
          const power = new NumberHolder(move.power);
          applyMoveAttrs(VariablePowerAttr, user, target, move, power);
          return power.value <= 60;
        },
        1.5,
      )
      .build(),
    new AbBuilder(AbilityId.LEAF_GUARD, 4) //
      .attr(StatusEffectImmunityAbAttr)
      .condition(getWeatherCondition(...SUNNY_WEATHER_TYPES))
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.KLUTZ, 4, 1) //
      .unimplemented()
      .build(),
    new AbBuilder(AbilityId.MOLD_BREAKER, 4) //
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonMoldBreaker", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(MoveAbilityBypassAbAttr)
      .build(),
    new AbBuilder(AbilityId.SUPER_LUCK, 4) //
      .attr(BonusCritAbAttr, 1)
      .build(),
    new AbBuilder(AbilityId.AFTERMATH, 4) //
      .attr(PostFaintContactDamageAbAttr, 4)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.ANTICIPATION, 4) //
      .attr(AnticipationAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonAnticipation", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .build(),
    new AbBuilder(AbilityId.FOREWARN, 4) //
      .attr(ForewarnAbAttr)
      .build(),
    new AbBuilder(AbilityId.UNAWARE, 4) //
      .attr(IgnoreOpponentStatStagesAbAttr, [Stat.ATK, Stat.DEF, Stat.SPATK, Stat.SPDEF, Stat.ACC, Stat.EVA])
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.TINTED_LENS, 4) //
      .attr(DamageBoostAbAttr, 2, (user, target, move) => {
        if (!user || !target || !move) {
          return false;
        }
        return target.getMoveEffectiveness(user, move) <= 0.5;
      })
      .build(),
    new AbBuilder(AbilityId.FILTER, 4) //
      .attr(
        ReceivedMoveDamageMultiplierAbAttr,
        (target, user, move) => target.getMoveEffectiveness(user, move) >= 2,
        0.75,
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SLOW_START, 4) //
      .attr(PostSummonAddBattlerTagAbAttr, BattlerTagType.SLOW_START, 5, false)
      .build(),
    new AbBuilder(AbilityId.SCRAPPY, 4) //
      .attr(IgnoreTypeImmunityAbAttr, ElementalType.GHOST, [ElementalType.NORMAL, ElementalType.FIGHTING])
      .attr(IntimidateImmunityAbAttr)
      .build(),
    new AbBuilder(AbilityId.STORM_DRAIN, 4) //
      .attr(RedirectTypeMoveAbAttr, ElementalType.WATER)
      .attr(TypeImmunityStatStageChangeAbAttr, ElementalType.WATER, Stat.SPATK, 1)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.ICE_BODY, 4) //
      .attr(BlockWeatherDamageAbAttr, WeatherType.HAIL)
      .attr(PostWeatherLapseHealAbAttr, 1 / 16, ...SNOWY_WEATHER_TYPES)
      .build(),
    new AbBuilder(AbilityId.SOLID_ROCK, 4) //
      .attr(
        ReceivedMoveDamageMultiplierAbAttr,
        (target, user, move) => target.getMoveEffectiveness(user, move) >= 2,
        0.75,
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SNOW_WARNING, 4) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SNOW)
      .build(),
    new AbBuilder(AbilityId.HONEY_GATHER, 4) //
      .attr(MoneyAbAttr)
      .build(),
    new AbBuilder(AbilityId.FRISK, 4) //
      .attr(FriskAbAttr)
      .build(),
    new AbBuilder(AbilityId.RECKLESS, 4) //
      .attr(MoveFlagPowerBoostAbAttr, MoveFlags.RECKLESS_MOVE, 1.2)
      .build(),
    new AbBuilder(AbilityId.MULTITYPE, 4) //
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .build(),
    new AbBuilder(AbilityId.FLOWER_GIFT, 4, -2) //
      .conditionalAttr(getWeatherCondition(...SUNNY_WEATHER_TYPES), EffectiveStatMultiplierAbAttr, Stat.ATK, 1.5)
      .conditionalAttr(getWeatherCondition(...SUNNY_WEATHER_TYPES), EffectiveStatMultiplierAbAttr, Stat.SPDEF, 1.5)
      .uncopiable()
      .unreplaceable()
      .attr(PostSummonFormChangeByWeatherAbAttr)
      .attr(
        PostWeatherChangeFormChangeAbAttr,
        WeatherType.NONE,
        ...RAINY_WEATHER_TYPES,
        ...SNOWY_WEATHER_TYPES,
        WeatherType.SANDSTORM,
        WeatherType.STRONG_WINDS,
        WeatherType.FOG,
      )
      // Should also boosts stats of ally
      .partial()
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.BAD_DREAMS, 4) //
      .attr(BadDreamsAbAttr)
      // When falling asleep, due to being drowsy, the ability flyout appears BEFORE the pokemon falls asleep
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.PICKPOCKET, 5) //
      .attr(PostDefendStealHeldItemAbAttr, (target, user, move) =>
        move.checkFlag(MoveFlags.MAKES_CONTACT, user, target),
      )
      .condition(getSheerForceHitDisableAbCondition())
      .build(),
    new AbBuilder(AbilityId.SHEER_FORCE, 5) //
      .attr(MovePowerBoostAbAttr, (_user, _target, move) => !!move && move.chance >= 1, 1.3)
      // Should disable life orb, eject button, red card, kee/maranga berry if they get implemented
      .attr(MoveEffectChanceMultiplierAbAttr, 0)
      .build(),
    new AbBuilder(AbilityId.CONTRARY, 5) //
      .attr(StatStageChangeMultiplierAbAttr, -1)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.UNNERVE, 5, 1) //
      .attr(PreventBerryUseAbAttr)
      .build(),
    new AbBuilder(AbilityId.DEFIANT, 5) //
      .attr(DefiantCompetitiveAbAttr, [Stat.ATK], 2)
      .build(),
    new AbBuilder(AbilityId.DEFEATIST, 5) //
      .attr(EffectiveStatMultiplierAbAttr, Stat.ATK, 0.5)
      .attr(EffectiveStatMultiplierAbAttr, Stat.SPATK, 0.5)
      .condition((pokemon) => pokemon.getHpRatio() <= 0.5)
      .build(),
    new AbBuilder(AbilityId.CURSED_BODY, 5) //
      .attr(PostDefendMoveDisableAbAttr, 30)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.HEALER, 5) //
      .conditionalAttr(
        (pokemon) => pokemon.getAlly() !== undefined && pokemon.randSeedInt(10) < 3,
        PostTurnResetStatusAbAttr,
        true,
      )
      .build(),
    new AbBuilder(AbilityId.FRIEND_GUARD, 5) //
      .attr(AlliedFieldDamageReductionAbAttr, 0.75)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.WEAK_ARMOR, 5) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, _user, move) => move.category === MoveCategory.PHYSICAL,
        Stat.DEF,
        -1,
      )
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, _user, move) => move.category === MoveCategory.PHYSICAL,
        Stat.SPD,
        2,
      )
      .build(),
    new AbBuilder(AbilityId.HEAVY_METAL, 5) //
      .attr(WeightMultiplierAbAttr, 2)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.LIGHT_METAL, 5) //
      .attr(WeightMultiplierAbAttr, 0.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.MULTISCALE, 5) //
      .attr(ReceivedMoveDamageMultiplierAbAttr, (target, _user, _move) => target.isFullHp(), 0.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.TOXIC_BOOST, 5) //
      .attr(
        MovePowerBoostAbAttr,
        (user, _target, move) =>
          move?.category === MoveCategory.PHYSICAL
          && !!user?.hasStatusEffect([StatusEffect.TOXIC, StatusEffect.POISON]),
        1.5,
      )
      .build(),
    new AbBuilder(AbilityId.FLARE_BOOST, 5) //
      .attr(
        MovePowerBoostAbAttr,
        (user, _target, move) => move?.category === MoveCategory.SPECIAL && !!user?.hasStatusEffect(StatusEffect.BURN),
        1.5,
      )
      .build(),
    new AbBuilder(AbilityId.HARVEST, 5) //
      .attr(
        PostTurnLootAbAttr,
        "EATEN_BERRIES",
        // Rate is doubled when under sun, see https://dex.pokemonshowdown.com/abilities/harvest
        (pokemon) => (getWeatherCondition(...SUNNY_WEATHER_TYPES)(pokemon) ? 1 : 0.5),
      )
      // Cannot recover berries used up by fling or natural gift (unimplemented)
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.TELEPATHY, 5) //
      .attr(MoveImmunityAbAttr, (pokemon, attacker, move) => pokemon.getAlly() === attacker && move.isAttackMove())
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.MOODY, 5) //
      .attr(MoodyAbAttr)
      .build(),
    new AbBuilder(AbilityId.OVERCOAT, 5) //
      .attr(BlockWeatherDamageAbAttr, WeatherType.HAIL, WeatherType.SANDSTORM)
      .attr(MoveFlagImmunityAbAttr, MoveFlags.POWDER_MOVE)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.POISON_TOUCH, 5) //
      .attr(PostAttackApplyStatusEffectAbAttr, true, 30, StatusEffect.POISON)
      // Does not inflict poison if user gets inflicted with target's Mummy
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.REGENERATOR, 5) //
      .attr(PreSwitchOutHealAbAttr)
      .build(),
    new AbBuilder(AbilityId.BIG_PECKS, 5) //
      .attr(ProtectStatAbAttr, Stat.DEF)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SAND_RUSH, 5) //
      .attr(WeatherBasedSpeedDoublerAbAttr, WeatherType.SANDSTORM)
      .attr(BlockWeatherDamageAbAttr, WeatherType.SANDSTORM)
      .build(),
    new AbBuilder(AbilityId.WONDER_SKIN, 5) //
      .attr(WonderSkinAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.ANALYTIC, 5) //
      .attr(MovePowerBoostAbAttr, () => globalScene.currentBattle.turnManager.isEmpty(), 1.3)
      .build(),
    new AbBuilder(AbilityId.ILLUSION, 5) //
      .uncopiable()
      .unimplemented()
      .build(),
    new AbBuilder(AbilityId.IMPOSTER, 5) //
      .attr(PostSummonTransformAbAttr)
      .uncopiable()
      .build(),
    new AbBuilder(AbilityId.INFILTRATOR, 5) //
      .attr(InfiltratorAbAttr)
      // does not bypass Mist
      .partial()
      .build(),
    new AbBuilder(AbilityId.MUMMY, 5) //
      .attr(PostDefendAbilityGiveAbAttr, AbilityId.MUMMY)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.MOXIE, 5) //
      .attr(PostVictoryStatStageChangeAbAttr, Stat.ATK, 1)
      .build(),
    new AbBuilder(AbilityId.JUSTIFIED, 5) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, user, move) => user.getMoveType(move) === ElementalType.DARK && move.category !== MoveCategory.STATUS,
        Stat.ATK,
        1,
      )
      .build(),
    new AbBuilder(AbilityId.RATTLED, 5) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, user, move) => {
          const rattledTypes: readonly ElementalType[] = [ElementalType.BUG, ElementalType.DARK, ElementalType.GHOST];
          return move.category !== MoveCategory.STATUS && rattledTypes.includes(user.getMoveType(move));
        },
        Stat.SPD,
        1,
      )
      .attr(PostIntimidateStatStageChangeAbAttr, [Stat.SPD], 1)
      .build(),
    new AbBuilder(AbilityId.MAGIC_BOUNCE, 5) //
      .attr(ReflectMovesAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SAP_SIPPER, 5) //
      .attr(TypeImmunityStatStageChangeAbAttr, ElementalType.GRASS, Stat.ATK, 1)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.PRANKSTER, 5) //
      .attr(ChangeMovePriorityAbAttr, (_pokemon, move: Move) => move.category === MoveCategory.STATUS, 1)
      .build(),
    new AbBuilder(AbilityId.SAND_FORCE, 5) //
      .attr(MoveTypePowerBoostAbAttr, ElementalType.ROCK, 1.3)
      .attr(MoveTypePowerBoostAbAttr, ElementalType.GROUND, 1.3)
      .attr(MoveTypePowerBoostAbAttr, ElementalType.STEEL, 1.3)
      .attr(BlockWeatherDamageAbAttr, WeatherType.SANDSTORM)
      .condition(getWeatherCondition(WeatherType.SANDSTORM))
      .build(),
    new AbBuilder(AbilityId.IRON_BARBS, 5) //
      .attr(PostDefendContactDamageAbAttr, 8)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.ZEN_MODE, 5) //
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PostSummonFormChangeAbAttr, (p) => (p.getHpRatio() <= 0.5 ? 1 : 0))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.getHpRatio() <= 0.5 ? 1 : 0))
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.VICTORY_STAR, 5) //
      .attr(FieldAccuracyMultiplierAbAttr, 1.1, (source, target) => !source.isOpponent(target))
      .build(),
    new AbBuilder(AbilityId.TURBOBLAZE, 5) //
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonTurboblaze", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(MoveAbilityBypassAbAttr)
      .build(),
    new AbBuilder(AbilityId.TERAVOLT, 5) //
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonTeravolt", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(MoveAbilityBypassAbAttr)
      .build(),
    new AbBuilder(AbilityId.AROMA_VEIL, 6) //
      .attr(
        UserFieldBattlerTagImmunityAbAttr,
        BattlerTagType.INFATUATED,
        BattlerTagType.TAUNT,
        BattlerTagType.DISABLED,
        BattlerTagType.TORMENT,
        BattlerTagType.HEAL_BLOCK,
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.FLOWER_VEIL, 6) //
      .ignorable()
      .unimplemented()
      .build(),
    new AbBuilder(AbilityId.CHEEK_POUCH, 6) //
      .attr(HealFromBerryUseAbAttr, 1 / 3)
      .build(),
    new AbBuilder(AbilityId.PROTEAN, 6) //
      .attr(PokemonTypeChangeAbAttr)
      .build(),
    new AbBuilder(AbilityId.FUR_COAT, 6) //
      // Doesn't boost defense on self inflicted confusion damage
      .attr(EffectiveStatMultiplierAbAttr, Stat.DEF, 2, (_user, target) => !!target)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.MAGICIAN, 6) //
      .attr(PostAttackStealHeldItemAbAttr)
      .build(),
    new AbBuilder(AbilityId.BULLETPROOF, 6) //
      .attr(MoveFlagImmunityAbAttr, MoveFlags.BULLET_MOVE)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.COMPETITIVE, 6) //
      .attr(DefiantCompetitiveAbAttr, [Stat.SPATK], 2)
      .build(),
    new AbBuilder(AbilityId.STRONG_JAW, 6) //
      .attr(MoveFlagPowerBoostAbAttr, MoveFlags.BITING_MOVE, 1.5)
      .build(),
    new AbBuilder(AbilityId.REFRIGERATE, 6) //
      .attr(MoveTypeChangeAbAttr, ElementalType.ICE, 1.2, normalTypeMoveConversionCondition)
      .build(),
    new AbBuilder(AbilityId.SWEET_VEIL, 6) //
      .attr(UserFieldStatusEffectImmunityAbAttr, StatusEffect.SLEEP)
      .attr(UserFieldBattlerTagImmunityAbAttr, BattlerTagType.DROWSY)
      .ignorable()
      // Mold Breaker ally should not be affected by Sweet Veil
      .partial()
      .build(),
    new AbBuilder(AbilityId.STANCE_CHANGE, 6) //
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .build(),
    new AbBuilder(AbilityId.GALE_WINGS, 6) //
      .attr(ChangeMovePriorityAbAttr, (pokemon, move) => pokemon.isFullHp() && move.type === ElementalType.FLYING, 1)
      .build(),
    new AbBuilder(AbilityId.MEGA_LAUNCHER, 6) //
      .attr(MoveFlagPowerBoostAbAttr, MoveFlags.PULSE_MOVE, 1.5)
      .attr(
        RecoveryBoostAbAttr,
        (pokemon, _target, move) => !!pokemon && !!move?.checkFlag(MoveFlags.PULSE_MOVE, pokemon),
        1.5,
      )
      .build(),
    new AbBuilder(AbilityId.GRASS_PELT, 6) //
      .conditionalAttr(getTerrainCondition(TerrainType.GRASSY), EffectiveStatMultiplierAbAttr, Stat.DEF, 1.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SYMBIOSIS, 6) //
      .unimplemented()
      .build(),
    new AbBuilder(AbilityId.TOUGH_CLAWS, 6) //
      .attr(MoveFlagPowerBoostAbAttr, MoveFlags.MAKES_CONTACT, 1.3)
      .build(),
    new AbBuilder(AbilityId.PIXILATE, 6) //
      .attr(MoveTypeChangeAbAttr, ElementalType.FAIRY, 1.2, normalTypeMoveConversionCondition)
      .build(),
    new AbBuilder(AbilityId.GOOEY, 6) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (target, user, move) => move.checkFlag(MoveFlags.MAKES_CONTACT, user, target),
        Stat.SPD,
        -1,
        false,
      )
      .build(),
    new AbBuilder(AbilityId.AERILATE, 6) //
      .attr(MoveTypeChangeAbAttr, ElementalType.FLYING, 1.2, normalTypeMoveConversionCondition)
      .build(),
    new AbBuilder(AbilityId.PARENTAL_BOND, 6) //
      .attr(AddSecondStrikeAbAttr)
      .attr(
        DamageBoostAbAttr,
        0.25,
        (user, target, move) =>
          !!user
          && user.turnData.hitCount > 1 // move was originally multi hit
          && user.turnData.hitsLeft === 1 // move is on its final strike
          && !!move?.canBeMultiStrikeEnhanced(user, target),
      )
      .build(),
    new AbBuilder(AbilityId.DARK_AURA, 6) //
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonDarkAura", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(FieldMoveTypePowerBoostAbAttr, ElementalType.DARK, 4 / 3)
      .build(),
    new AbBuilder(AbilityId.FAIRY_AURA, 6) //
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonFairyAura", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .attr(FieldMoveTypePowerBoostAbAttr, ElementalType.FAIRY, 4 / 3)
      .build(),
    new AbBuilder(AbilityId.AURA_BREAK, 6) //
      .ignorable()
      .conditionalAttr(
        (_pokemon) => globalScene.getField(true).some((p) => p.hasAbility(AbilityId.DARK_AURA)),
        FieldMoveTypePowerBoostAbAttr,
        ElementalType.DARK,
        9 / 16,
      )
      .conditionalAttr(
        (_pokemon) => globalScene.getField(true).some((p) => p.hasAbility(AbilityId.FAIRY_AURA)),
        FieldMoveTypePowerBoostAbAttr,
        ElementalType.FAIRY,
        9 / 16,
      )
      .conditionalAttr(
        (_pokemon) =>
          globalScene
            .getField(true)
            .some((p) => p.hasAbility(AbilityId.DARK_AURA) || p.hasAbility(AbilityId.FAIRY_AURA)),
        PostSummonMessageAbAttr,
        (pokemon: Pokemon) =>
          i18next.t("abilityTriggers:postSummonAuraBreak", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) }),
      )
      .build(),
    new AbBuilder(AbilityId.PRIMORDIAL_SEA, 6) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.HEAVY_RAIN)
      .attr(PreLeaveFieldClearWeatherAbAttr)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.DESOLATE_LAND, 6) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.HARSH_SUN)
      .attr(PreLeaveFieldClearWeatherAbAttr)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.DELTA_STREAM, 6) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.STRONG_WINDS)
      .attr(PreLeaveFieldClearWeatherAbAttr)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.STAMINA, 7) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        Stat.DEF,
        1,
      )
      .build(),
    new AbBuilder(AbilityId.WIMP_OUT, 7) //
      .attr(PostDamageForceSwitchAbAttr)
      // Should not trigger when hurting itself in confusion
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.EMERGENCY_EXIT, 7) //
      .attr(PostDamageForceSwitchAbAttr)
      // Should not trigger when hurting itself in confusion
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.WATER_COMPACTION, 7) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, user, move) =>
          user.getMoveType(move) === ElementalType.WATER && move.category !== MoveCategory.STATUS,
        Stat.DEF,
        2,
      )
      .build(),
    new AbBuilder(AbilityId.MERCILESS, 7) //
      .attr(
        ConditionalCritAbAttr,
        (_user, target, _move) => !!target?.hasStatusEffect([StatusEffect.POISON, StatusEffect.TOXIC]),
      )
      .build(),
    new AbBuilder(AbilityId.SHIELDS_DOWN, 7, -1) //
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PostSummonFormChangeAbAttr, (p) => (p.formIndex % 7) + (p.getHpRatio() <= 0.5 ? 7 : 0))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.formIndex % 7) + (p.getHpRatio() <= 0.5 ? 7 : 0))
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .bypassFaint()
      // Meteor form should protect against status effects and yawn
      .partial()
      .build(),
    new AbBuilder(AbilityId.STAKEOUT, 7) //
      .attr(MovePowerBoostAbAttr, (_user, target, _move) => !!target?.turnData.switchedInThisTurn, 2)
      .build(),
    new AbBuilder(AbilityId.WATER_BUBBLE, 7) //
      .attr(ReceivedTypeDamageMultiplierAbAttr, ElementalType.FIRE, 0.5)
      .attr(MoveTypePowerBoostAbAttr, ElementalType.WATER, 2)
      .attr(StatusEffectImmunityAbAttr, StatusEffect.BURN)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.STEELWORKER, 7) //
      .attr(MoveTypePowerBoostAbAttr, ElementalType.STEEL)
      .build(),
    new AbBuilder(AbilityId.BERSERK, 7) //
      .attr(
        PostDefendHpGatedStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        0.5,
        [Stat.SPATK],
        1,
      )
      .condition(getSheerForceHitDisableAbCondition())
      .build(),
    new AbBuilder(AbilityId.SLUSH_RUSH, 7) //
      .attr(WeatherBasedSpeedDoublerAbAttr, ...SNOWY_WEATHER_TYPES)
      .build(),
    new AbBuilder(AbilityId.LONG_REACH, 7) //
      .attr(IgnoreContactAbAttr)
      .build(),
    new AbBuilder(AbilityId.LIQUID_VOICE, 7) //
      .attr(
        MoveTypeChangeAbAttr,
        ElementalType.WATER,
        1,
        (user, target, move) => !!user && !!move?.checkFlag(MoveFlags.SOUND_MOVE, user, target),
      )
      .build(),
    new AbBuilder(AbilityId.TRIAGE, 7) //
      .attr(ChangeMovePriorityAbAttr, (pokemon, move) => move.checkFlag(MoveFlags.TRIAGE_MOVE, pokemon), 3)
      .build(),
    new AbBuilder(AbilityId.GALVANIZE, 7) //
      .attr(MoveTypeChangeAbAttr, ElementalType.ELECTRIC, 1.2, normalTypeMoveConversionCondition)
      .build(),
    new AbBuilder(AbilityId.SURGE_SURFER, 7) //
      .conditionalAttr(getTerrainCondition(TerrainType.ELECTRIC), EffectiveStatMultiplierAbAttr, Stat.SPD, 2)
      .build(),
    new AbBuilder(AbilityId.SCHOOLING, 7, -1) //
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PostSummonFormChangeAbAttr, (p) => (p.level < 20 || p.getHpRatio() <= 0.25 ? 0 : 1))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.level < 20 || p.getHpRatio() <= 0.25 ? 0 : 1))
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.DISGUISE, 7) //
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .noTransform()
      // Add BattlerTagType.DISGUISE if the pokemon is in its disguised form
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 0,
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.DISGUISE,
        0,
        false,
      )
      .attr(
        FormBlockDamageAbAttr,
        (target, user, move) => target.hasTag(BattlerTagType.DISGUISE) && target.getMoveEffectiveness(user, move) > 0,
        0,
        BattlerTagType.DISGUISE,
        (pokemon, abilityName) =>
          i18next.t("abilityTriggers:disguiseAvoidedDamage", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName,
          }),
        (pokemon) => toDmgValue(pokemon.getMaxHp() / 8),
      )
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .bypassFaint()
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.BATTLE_BOND, 7) //
      .attr(PostVictoryFormChangeAbAttr, () => 2)
      .attr(PostBattleInitFormChangeAbAttr, () => 1)
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.POWER_CONSTRUCT, 7) //
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 2 || pokemon.formIndex === 4,
        PostBattleInitFormChangeAbAttr,
        () => 2,
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 3 || pokemon.formIndex === 5,
        PostBattleInitFormChangeAbAttr,
        () => 3,
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 2 || pokemon.formIndex === 4,
        PostSummonFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "complete" ? 4 : 2),
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 2 || pokemon.formIndex === 4,
        PostTurnFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "complete" ? 4 : 2),
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 3 || pokemon.formIndex === 5,
        PostSummonFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "10-complete" ? 5 : 3),
      )
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 3 || pokemon.formIndex === 5,
        PostTurnFormChangeAbAttr,
        (p) => (p.getHpRatio() <= 0.5 || p.getFormKey() === "10-complete" ? 5 : 3),
      )
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.CORROSION, 7) //
      .attr(
        IgnoreTypeStatusEffectImmunityAbAttr,
        [StatusEffect.POISON, StatusEffect.TOXIC],
        [ElementalType.STEEL, ElementalType.POISON],
      )
      // fling with toxic orb (not implemented yet)
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.COMATOSE, 7) //
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .attr(MockStatusEffectAbAttr, StatusEffect.SLEEP)
      .attr(StatusEffectImmunityAbAttr, ...NON_VOLATILE_STATUS_EFFECTS)
      .attr(BattlerTagImmunityAbAttr, BattlerTagType.DROWSY)
      .build(),
    new AbBuilder(AbilityId.QUEENLY_MAJESTY, 7) //
      .attr(FieldPriorityMoveImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.INNARDS_OUT, 7) //
      .attr(PostFaintHPDamageAbAttr)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.DANCER, 7) //
      .attr(PostDancingMoveAbAttr)
      .build(),
    new AbBuilder(AbilityId.BATTERY, 7) //
      .attr(AllyMoveCategoryPowerBoostAbAttr, [MoveCategory.SPECIAL], 1.3)
      .build(),
    new AbBuilder(AbilityId.FLUFFY, 7) //
      .attr(
        ReceivedMoveDamageMultiplierAbAttr,
        (target, user, move) => move.checkFlag(MoveFlags.MAKES_CONTACT, user, target),
        0.5,
      )
      .attr(ReceivedTypeDamageMultiplierAbAttr, ElementalType.FIRE, 2)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.DAZZLING, 7) //
      .attr(FieldPriorityMoveImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SOUL_HEART, 7) //
      .attr(PostKnockOutStatStageChangeAbAttr, Stat.SPATK, 1)
      .build(),
    new AbBuilder(AbilityId.TANGLING_HAIR, 7) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (target, user, move) => move.checkFlag(MoveFlags.MAKES_CONTACT, user, target),
        Stat.SPD,
        -1,
        false,
      )
      .build(),
    new AbBuilder(AbilityId.RECEIVER, 7) //
      .attr(CopyFaintedAllyAbilityAbAttr)
      .uncopiable()
      .build(),
    new AbBuilder(AbilityId.POWER_OF_ALCHEMY, 7) //
      .attr(CopyFaintedAllyAbilityAbAttr)
      .uncopiable()
      .build(),
    new AbBuilder(AbilityId.BEAST_BOOST, 7) //
      .attr(
        PostVictoryStatStageChangeAbAttr,
        (p) => {
          let highestStat: EffectiveStat;
          let highestValue = 0;
          for (const s of EFFECTIVE_STATS) {
            const value = p.getStat(s, false);
            if (value > highestValue) {
              highestStat = s;
              highestValue = value;
            }
          }
          return highestStat!;
        },
        1,
      )
      .build(),
    new AbBuilder(AbilityId.RKS_SYSTEM, 7) //
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .build(),
    new AbBuilder(AbilityId.ELECTRIC_SURGE, 7) //
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.ELECTRIC)
      .build(),
    new AbBuilder(AbilityId.PSYCHIC_SURGE, 7) //
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.PSYCHIC)
      .build(),
    new AbBuilder(AbilityId.MISTY_SURGE, 7) //
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.MISTY)
      .build(),
    new AbBuilder(AbilityId.GRASSY_SURGE, 7) //
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.GRASSY)
      .build(),
    new AbBuilder(AbilityId.FULL_METAL_BODY, 7) //
      .attr(ProtectStatAbAttr)
      .build(),
    new AbBuilder(AbilityId.SHADOW_SHIELD, 7) //
      .attr(ReceivedMoveDamageMultiplierAbAttr, (target, _user, _move) => target.isFullHp(), 0.5)
      .build(),
    new AbBuilder(AbilityId.PRISM_ARMOR, 7) //
      .attr(
        ReceivedMoveDamageMultiplierAbAttr,
        (user, target, move) => {
          if (!user || !target || !move) {
            return false;
          }
          return target.getMoveEffectiveness(user, move) >= 2;
        },
        0.75,
      )
      .build(),
    new AbBuilder(AbilityId.NEUROFORCE, 7) //
      .attr(
        MovePowerBoostAbAttr,
        (user, target, move) => {
          if (!user || !target || !move) {
            return false;
          }
          return target.getMoveEffectiveness(user, move) >= 2;
        },
        1.25,
      )
      .build(),
    new AbBuilder(AbilityId.INTREPID_SWORD, 8) //
      .attr(PostSummonStatStageChangeAbAttr, [Stat.ATK], 1, true)
      .build(),
    new AbBuilder(AbilityId.DAUNTLESS_SHIELD, 8) //
      .attr(PostSummonStatStageChangeAbAttr, [Stat.DEF], 1, true)
      .build(),
    new AbBuilder(AbilityId.LIBERO, 8) //
      .attr(PokemonTypeChangeAbAttr)
      .build(),
    new AbBuilder(AbilityId.BALL_FETCH, 8) //
      .attr(FetchBallAbAttr)
      .condition(getOncePerBattleCondition(AbilityId.BALL_FETCH))
      .build(),
    new AbBuilder(AbilityId.COTTON_DOWN, 8) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        Stat.SPD,
        -1,
        false,
        true,
      )
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.PROPELLER_TAIL, 8) //
      .attr(BlockRedirectAbAttr)
      .build(),
    new AbBuilder(AbilityId.MIRROR_ARMOR, 8) //
      .attr(ReflectStatStageChangeAbAttr)
      .ignorable()
      .build(),
    /*
     * Right now, the logic is attached to Surf and Dive. Ideally, the post-defend/hit should be an
     * ability attribute but the current implementation of move effects for BattlerTag does not support this
     * in the case where Cramorant is fainted.
     *
     * See `GulpMissileTagAttr` and `GulpMissileTag` for Gulp Missile implementation
     */
    new AbBuilder(AbilityId.GULP_MISSILE, 8) //
      .noTransform()
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.STALWART, 8) //
      .attr(BlockRedirectAbAttr)
      .build(),
    new AbBuilder(AbilityId.STEAM_ENGINE, 8) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, user, move) => {
          const affectedTypes: readonly ElementalType[] = [ElementalType.FIRE, ElementalType.WATER];
          return move.category !== MoveCategory.STATUS && affectedTypes.includes(user.getMoveType(move));
        },
        Stat.SPD,
        6,
      )
      .build(),
    new AbBuilder(AbilityId.PUNK_ROCK, 8) //
      .attr(MoveFlagPowerBoostAbAttr, MoveFlags.SOUND_MOVE, 1.3)
      .attr(
        ReceivedMoveDamageMultiplierAbAttr,
        (target, user, move) => move.checkFlag(MoveFlags.SOUND_MOVE, user, target),
        0.5,
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SAND_SPIT, 8) //
      .bypassFaint()
      .attr(
        PostDefendWeatherChangeAbAttr,
        WeatherType.SANDSTORM,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
      )
      .build(),
    new AbBuilder(AbilityId.ICE_SCALES, 8) //
      .attr(ReceivedMoveDamageMultiplierAbAttr, (_target, _user, move) => move.category === MoveCategory.SPECIAL, 0.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.RIPEN, 8) //
      .attr(DoubleBerryEffectAbAttr)
      .build(),
    new AbBuilder(AbilityId.ICE_FACE, 8, -2) //
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .noTransform()
      // Add BattlerTagType.ICE_FACE if the pokemon is in ice face form
      .conditionalAttr(
        (pokemon) => pokemon.formIndex === 0,
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.ICE_FACE,
        0,
        false,
      )
      // When summoned with active HAIL or SNOW, add BattlerTagType.ICE_FACE
      .conditionalAttr(
        getWeatherCondition(...SNOWY_WEATHER_TYPES),
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.ICE_FACE,
        0,
        false,
      )
      // When weather changes to HAIL or SNOW while pokemon is fielded, add BattlerTagType.ICE_FACE
      .attr(PostWeatherChangeAddBattlerTagAbAttr, BattlerTagType.ICE_FACE, 0, ...SNOWY_WEATHER_TYPES)
      .attr(
        FormBlockDamageAbAttr,
        (target, _user, move) => move.category === MoveCategory.PHYSICAL && target.hasTag(BattlerTagType.ICE_FACE),
        0,
        BattlerTagType.ICE_FACE,
        (pokemon, abilityName) =>
          i18next.t("abilityTriggers:iceFaceAvoidedDamage", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName,
          }),
      )
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .bypassFaint()
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.POWER_SPOT, 8) //
      .attr(AllyMoveCategoryPowerBoostAbAttr, [MoveCategory.SPECIAL, MoveCategory.PHYSICAL], 1.3)
      .build(),
    new AbBuilder(AbilityId.MIMICRY, 8, -1) //
      .attr(TerrainEventTypeChangeAbAttr)
      .build(),
    new AbBuilder(AbilityId.SCREEN_CLEANER, 8) //
      .attr(PostSummonRemoveArenaTagAbAttr, [ArenaTagType.AURORA_VEIL, ArenaTagType.LIGHT_SCREEN, ArenaTagType.REFLECT])
      .build(),
    new AbBuilder(AbilityId.STEELY_SPIRIT, 8) //
      .attr(UserFieldMoveTypePowerBoostAbAttr, ElementalType.STEEL)
      .build(),
    new AbBuilder(AbilityId.PERISH_BODY, 8) //
      .attr(PostDefendPerishSongAbAttr)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.WANDERING_SPIRIT, 8) //
      .attr(PostDefendAbilitySwapAbAttr)
      .bypassFaint()
      // Interacts incorrectly with rock head.
      // It's meant to switch abilities before recoil would apply so that a pokemon with rock head
      // would lose rock head first and still take the recoil
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.GORILLA_TACTICS, 8) //
      .attr(GorillaTacticsAbAttr)
      .build(),
    new AbBuilder(AbilityId.NEUTRALIZING_GAS, 8, 2) //
      .attr(SuppressFieldAbilitiesAbAttr)
      .uncopiable()
      .noTransform()
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonNeutralizingGas", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        }),
      )
      // A bunch of weird interactions with other abilities being suppressed then unsuppressed
      .partial()
      .build(),
    new AbBuilder(AbilityId.PASTEL_VEIL, 8) //
      .attr(PostSummonUserFieldRemoveStatusEffectAbAttr, StatusEffect.POISON, StatusEffect.TOXIC)
      .attr(UserFieldStatusEffectImmunityAbAttr, StatusEffect.POISON, StatusEffect.TOXIC)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.HUNGER_SWITCH, 8) //
      .attr(PostTurnFormChangeAbAttr, (p) => (p.getFormKey() ? 0 : 1))
      .attr(PostTurnFormChangeAbAttr, (p) => (p.getFormKey() ? 1 : 0))
      .uncopiable()
      .unreplaceable()
      .noTransform()
      .condition((pokemon) => !pokemon.isTerastallized)
      .build(),
    new AbBuilder(AbilityId.QUICK_DRAW, 8) //
      .attr(BypassSpeedChanceAbAttr, 30)
      .build(),
    new AbBuilder(AbilityId.UNSEEN_FIST, 8) //
      .attr(IgnoreProtectOnContactAbAttr)
      .build(),
    new AbBuilder(AbilityId.CURIOUS_MEDICINE, 8) //
      .attr(PostSummonClearAllyStatStagesAbAttr)
      .build(),
    new AbBuilder(AbilityId.TRANSISTOR, 8) //
      .attr(MoveTypePowerBoostAbAttr, ElementalType.ELECTRIC, 1.3)
      .build(),
    new AbBuilder(AbilityId.DRAGONS_MAW, 8) //
      .attr(MoveTypePowerBoostAbAttr, ElementalType.DRAGON)
      .build(),
    new AbBuilder(AbilityId.CHILLING_NEIGH, 8) //
      .attr(PostVictoryStatStageChangeAbAttr, Stat.ATK, 1)
      .build(),
    new AbBuilder(AbilityId.GRIM_NEIGH, 8) //
      .attr(PostVictoryStatStageChangeAbAttr, Stat.SPATK, 1)
      .build(),
    new AbBuilder(AbilityId.AS_ONE_GLASTRIER, 8, 1) //
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonAsOneGlastrier", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        }),
      )
      .attr(PreventBerryUseAbAttr)
      .attr(PostVictoryStatStageChangeAbAttr, Stat.ATK, 1)
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .build(),
    new AbBuilder(AbilityId.AS_ONE_SPECTRIER, 8, 1) //
      .attr(PostSummonMessageAbAttr, (pokemon: Pokemon) =>
        i18next.t("abilityTriggers:postSummonAsOneSpectrier", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        }),
      )
      .attr(PreventBerryUseAbAttr)
      .attr(PostVictoryStatStageChangeAbAttr, Stat.SPATK, 1)
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .build(),
    new AbBuilder(AbilityId.LINGERING_AROMA, 9) //
      .attr(PostDefendAbilityGiveAbAttr, AbilityId.LINGERING_AROMA)
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.SEED_SOWER, 9) //
      .bypassFaint()
      .attr(PostDefendTerrainChangeAbAttr, TerrainType.GRASSY)
      .build(),
    new AbBuilder(AbilityId.THERMAL_EXCHANGE, 9) //
      .attr(
        PostDefendStatStageChangeAbAttr,
        (_target, user, move) => user.getMoveType(move) === ElementalType.FIRE && move.category !== MoveCategory.STATUS,
        Stat.ATK,
        1,
      )
      .attr(StatusEffectImmunityAbAttr, StatusEffect.BURN)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.ANGER_SHELL, 9) //
      .attr(
        PostDefendHpGatedStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        0.5,
        [Stat.ATK, Stat.SPATK, Stat.SPD],
        1,
      )
      .attr(
        PostDefendHpGatedStatStageChangeAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        0.5,
        [Stat.DEF, Stat.SPDEF],
        -1,
      )
      .condition(getSheerForceHitDisableAbCondition())
      .build(),
    new AbBuilder(AbilityId.PURIFYING_SALT, 9) //
      .attr(StatusEffectImmunityAbAttr)
      .attr(ReceivedTypeDamageMultiplierAbAttr, ElementalType.GHOST, 0.5)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.WELL_BAKED_BODY, 9) //
      .attr(TypeImmunityStatStageChangeAbAttr, ElementalType.FIRE, Stat.DEF, 2)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.WIND_RIDER, 9) //
      .attr(
        MoveImmunityStatStageChangeAbAttr,
        (pokemon, attacker, move) =>
          pokemon !== attacker
          && move.checkFlag(MoveFlags.WIND_MOVE, attacker, pokemon)
          && move.category !== MoveCategory.STATUS,
        Stat.ATK,
        1,
      )
      .attr(PostSummonStatStageChangeOnArenaAbAttr, ArenaTagType.TAILWIND)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.GUARD_DOG, 9) //
      .attr(IntimidateImmunityAbAttr, false)
      .attr(PostIntimidateStatStageChangeAbAttr, [Stat.ATK], 1)
      .attr(ForceSwitchOutImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.ROCKY_PAYLOAD, 9) //
      .attr(MoveTypePowerBoostAbAttr, ElementalType.ROCK)
      .build(),
    new AbBuilder(AbilityId.WIND_POWER, 9) //
      .attr(
        PostDefendApplyBattlerTagAbAttr,
        (target, user, move) => move.checkFlag(MoveFlags.WIND_MOVE, user, target),
        BattlerTagType.CHARGED,
      )
      .build(),
    new AbBuilder(AbilityId.ZERO_TO_HERO, 9) //
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .noTransform()
      .attr(PostBattleInitFormChangeAbAttr, () => 0)
      .attr(PreSwitchOutFormChangeAbAttr, (pokemon) => (pokemon.isFainted() ? pokemon.formIndex : 1))
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.COMMANDER, 9) //
      .attr(CommanderAbAttr)
      // Custom implementation to allow more double battles
      .attr(DoubleBattleChanceAbAttr)
      .uncopiable()
      .unreplaceable()
      // Encore, Frenzy, and other non-`TURN_END` tags don't lapse correctly on the commanding Pokemon.
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.ELECTROMORPHOSIS, 9) //
      .attr(
        PostDefendApplyBattlerTagAbAttr,
        (_target, _user, move) => move.category !== MoveCategory.STATUS,
        BattlerTagType.CHARGED,
      )
      .build(),
    new AbBuilder(AbilityId.PROTOSYNTHESIS, 9, -2) //
      .conditionalAttr(
        getWeatherCondition(...SUNNY_WEATHER_TYPES),
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.PROTOSYNTHESIS,
        0,
      )
      .attr(PostWeatherChangeAddBattlerTagAbAttr, BattlerTagType.PROTOSYNTHESIS, 0, ...SUNNY_WEATHER_TYPES)
      .uncopiable()
      .noTransform()
      .build(),
    new AbBuilder(AbilityId.QUARK_DRIVE, 9, -2) //
      .conditionalAttr(
        getTerrainCondition(TerrainType.ELECTRIC),
        PostSummonAddBattlerTagAbAttr,
        BattlerTagType.QUARK_DRIVE,
        0,
      )
      .attr(PostTerrainChangeAddBattlerTagAbAttr, BattlerTagType.QUARK_DRIVE, 0, TerrainType.ELECTRIC)
      .uncopiable()
      .noTransform()
      .build(),
    new AbBuilder(AbilityId.GOOD_AS_GOLD, 9) //
      .attr(
        MoveImmunityAbAttr,
        (pokemon, attacker, move) => pokemon !== attacker && move.category === MoveCategory.STATUS,
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.VESSEL_OF_RUIN, 9) //
      .attr(TreasureOfRuinAbAttr, Stat.SPATK)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonVesselOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.SPATK)),
        }),
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SWORD_OF_RUIN, 9) //
      .attr(TreasureOfRuinAbAttr, Stat.DEF)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonSwordOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.DEF)),
        }),
      )
      .build(),
    new AbBuilder(AbilityId.TABLETS_OF_RUIN, 9) //
      .attr(TreasureOfRuinAbAttr, Stat.ATK)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonTabletsOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.ATK)),
        }),
      )
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.BEADS_OF_RUIN, 9) //
      .attr(TreasureOfRuinAbAttr, Stat.SPDEF)
      .attr(PostSummonMessageAbAttr, (user) =>
        i18next.t("abilityTriggers:postSummonBeadsOfRuin", {
          pokemonNameWithAffix: getPokemonNameWithAffix(user),
          statName: i18next.t(getStatKey(Stat.SPDEF)),
        }),
      )
      .build(),
    new AbBuilder(AbilityId.ORICHALCUM_PULSE, 9) //
      .attr(PostSummonWeatherChangeAbAttr, WeatherType.SUNNY)
      .conditionalAttr(getWeatherCondition(...SUNNY_WEATHER_TYPES), EffectiveStatMultiplierAbAttr, Stat.ATK, 4 / 3)
      .build(),
    new AbBuilder(AbilityId.HADRON_ENGINE, 9) //
      .attr(PostSummonTerrainChangeAbAttr, TerrainType.ELECTRIC)
      .conditionalAttr(getTerrainCondition(TerrainType.ELECTRIC), EffectiveStatMultiplierAbAttr, Stat.SPATK, 4 / 3)
      .build(),
    new AbBuilder(AbilityId.OPPORTUNIST, 9) //
      .attr(StatStageChangeCopyAbAttr)
      .build(),
    new AbBuilder(AbilityId.CUD_CHEW, 9) //
      .unimplemented()
      .build(),
    new AbBuilder(AbilityId.SHARPNESS, 9) //
      .attr(MoveFlagPowerBoostAbAttr, MoveFlags.SLICING_MOVE, 1.5)
      .build(),
    new AbBuilder(AbilityId.SUPREME_OVERLORD, 9) //
      .attr(VariableMovePowerBoostAbAttr, (user, _target, _move) => {
        const { playerFaints, enemyFaints } = globalScene.currentBattle;
        return 1 + 0.1 * Math.min(user.isPlayer() ? playerFaints : enemyFaints, 5);
      })
      // Counter resets every wave instead of on arena reset
      .partial()
      .build(),
    new AbBuilder(AbilityId.COSTAR, 9, -2) //
      .attr(PostSummonCopyAllyStatsAbAttr)
      .build(),
    new AbBuilder(AbilityId.TOXIC_DEBRIS, 9) //
      .attr(
        PostDefendApplyEntryHazardTagAbAttr,
        (_target, _user, move) => move.category === MoveCategory.PHYSICAL,
        ArenaTagType.TOXIC_SPIKES,
      )
      .bypassFaint()
      .build(),
    new AbBuilder(AbilityId.ARMOR_TAIL, 9) //
      .attr(FieldPriorityMoveImmunityAbAttr)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.EARTH_EATER, 9) //
      .attr(TypeImmunityHealAbAttr, ElementalType.GROUND)
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.MYCELIUM_MIGHT, 9) //
      .attr(ChangeMovePriorityAbAttr, (_pokemon, move) => move.category === MoveCategory.STATUS, -0.2)
      .attr(PreventBypassSpeedChanceAbAttr, (_pokemon, move) => move.category === MoveCategory.STATUS)
      .attr(MoveAbilityBypassAbAttr, (_pokemon, move: Move) => move.category === MoveCategory.STATUS)
      .build(),
    new AbBuilder(AbilityId.MINDS_EYE, 9) //
      .attr(IgnoreTypeImmunityAbAttr, ElementalType.GHOST, [ElementalType.NORMAL, ElementalType.FIGHTING])
      .attr(ProtectStatAbAttr, Stat.ACC)
      .attr(IgnoreOpponentStatStagesAbAttr, [Stat.EVA])
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.SUPERSWEET_SYRUP, 9) //
      .attr(PostSummonStatStageChangeAbAttr, [Stat.EVA], -1)
      .build(),
    new AbBuilder(AbilityId.HOSPITALITY, 9, -2) //
      .attr(PostSummonAllyHealAbAttr, 4, true)
      .build(),
    new AbBuilder(AbilityId.TOXIC_CHAIN, 9) //
      .attr(PostAttackApplyStatusEffectAbAttr, false, 30, StatusEffect.TOXIC)
      // Does not inflict poison if user gets inflicted with target's Mummy
      .edgeCase()
      .build(),
    new AbBuilder(AbilityId.EMBODY_ASPECT_TEAL, 9) //
      .attr(PostTeraFormChangeStatChangeAbAttr, [Stat.SPD], 1)
      .attr(PostSummonStatStageChangeAbAttr, [Stat.SPD], 1, true)
      .uncopiable()
      // TODO: confirm if this is true
      .unreplaceable()
      .noTransform()
      .build(),
    new AbBuilder(AbilityId.EMBODY_ASPECT_WELLSPRING, 9) //
      .attr(PostTeraFormChangeStatChangeAbAttr, [Stat.SPDEF], 1)
      .attr(PostSummonStatStageChangeAbAttr, [Stat.SPDEF], 1, true)
      .uncopiable()
      // TODO: confirm if this is true
      .unreplaceable()
      .noTransform()
      .build(),
    new AbBuilder(AbilityId.EMBODY_ASPECT_HEARTHFLAME, 9) //
      .attr(PostTeraFormChangeStatChangeAbAttr, [Stat.ATK], 1)
      .attr(PostSummonStatStageChangeAbAttr, [Stat.ATK], 1, true)
      .uncopiable()
      // TODO: confirm if this is true
      .unreplaceable()
      .noTransform()
      .build(),
    new AbBuilder(AbilityId.EMBODY_ASPECT_CORNERSTONE, 9) //
      .attr(PostTeraFormChangeStatChangeAbAttr, [Stat.DEF], 1)
      .attr(PostSummonStatStageChangeAbAttr, [Stat.DEF], 1, true)
      .uncopiable()
      // TODO: confirm if this is true
      .unreplaceable()
      .noTransform()
      .build(),
    new AbBuilder(AbilityId.TERA_SHIFT, 9, 2) //
      .attr(PostSummonFormChangeAbAttr, (p) => (p.getFormKey() ? 0 : 1))
      .uncopiable()
      .unsuppressable()
      .unreplaceable()
      .noTransform()
      .build(),
    new AbBuilder(AbilityId.TERA_SHELL, 9) //
      .attr(FullHpResistTypeAbAttr)
      .uncopiable()
      .unreplaceable()
      .ignorable()
      .build(),
    new AbBuilder(AbilityId.TERAFORM_ZERO, 9) //
      .uncopiable()
      .unreplaceable()
      .attr(PostTeraFormChangeClearWeatherTerrainAbAttr)
      .build(),
    new AbBuilder(AbilityId.POISON_PUPPETEER, 9) //
      .uncopiable()
      // TODO: confirm if this is true
      .unreplaceable()
      .attr(ConfusionOnStatusEffectAbAttr, StatusEffect.POISON, StatusEffect.TOXIC)
      .build(),
  );
}

// #region Helpers

function getTerrainCondition(...terrainTypes: Readonly<NonEmptyArray<TerrainType>>): AbAttrCondition {
  return () => globalScene.arena.hasTerrain(...terrainTypes);
}

/**
 * Condition function to applied to abilities related to Sheer Force.
 * Checks if last move used against target was affected by a Sheer Force user and:
 * Disables: Color Change, Pickpocket, Berserk, Anger Shell
 * @returns If `false` disables the ability which the condition is applied to.
 */
function getSheerForceHitDisableAbCondition(): AbAttrCondition {
  return (pokemon: Pokemon) => {
    const lastReceivedAttack = pokemon.turnData.attacksReceived[0];
    if (!lastReceivedAttack) {
      return true;
    }

    const lastAttacker = pokemon.getOpponents().find((p) => p.id === lastReceivedAttack.sourceId);
    if (!lastAttacker) {
      return true;
    }

    /**if the last move chance is greater than or equal to cero, and the last attacker's ability is sheer force*/
    const SheerForceAffected =
      allMoves.get(lastReceivedAttack.moveId).chance >= 0 && lastAttacker.hasAbility(AbilityId.SHEER_FORCE);

    return !SheerForceAffected;
  };
}

/**
 * Creates an ability condition that causes the ability to fail if that ability
 * has already been used by that pokemon that battle. It requires an ability to
 * be specified due to current limitations in how conditions on abilities work.
 * @param ability The {@linkcode AbilityId | ability} to check if it's already been applied
 * @returns The {@linkcode AbAttrCondition | ability attribute condition}
 */
function getOncePerBattleCondition(ability: AbilityId): AbAttrCondition {
  return (pokemon: Pokemon) => {
    return !pokemon.waveData.abilitiesApplied.includes(ability);
  };
}

// #endregion
