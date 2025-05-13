// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AbAttr } from "#abilities/ab-attr";
import type { AddSecondStrikeAbAttr } from "#abilities/add-second-strike-ab-attr";
import type { AlliedFieldDamageReductionAbAttr } from "#abilities/allied-field-damage-reduction-ab-attr";
import type { AllyMoveCategoryPowerBoostAbAttr } from "#abilities/ally-move-category-power-boost-ab-attr";
import type { AlwaysHitAbAttr } from "#abilities/always-hit-ab-attr";
import type { ArenaTrapAbAttr } from "#abilities/arena-trap-ab-attr";
import type { BattlerTagImmunityAbAttr } from "#abilities/battler-tag-immunity-ab-attr";
import type { BlockCritAbAttr } from "#abilities/block-crit-ab-attr";
import type { BlockItemTheftAbAttr } from "#abilities/block-item-theft-ab-attr";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import type { BlockRedirectAbAttr } from "#abilities/block-redirect-ab-attr";
import type { BlockStatusDamageAbAttr } from "#abilities/block-status-damage-ab-attr";
import type { BonusCritAbAttr } from "#abilities/bonus-crit-ab-attr";
import type { BypassBurnDamageReductionAbAttr } from "#abilities/bypass-burn-damage-reduction-ab-attr";
import type { BypassParaSpeedReductionAbAttr } from "#abilities/bypass-para-speed-reduction-ab-attr";
import type { BypassSpeedChanceAbAttr } from "#abilities/bypass-speed-chance-ab-attr";
import type { CommanderAbAttr } from "#abilities/commander-ab-attr";
import type { ConditionalCritAbAttr } from "#abilities/conditional-crit-ab-attr";
import type { ConfusionOnStatusEffectAbAttr } from "#abilities/confusion-on-status-effect-ab-attr";
import type { DamageBoostAbAttr } from "#abilities/damage-boost-ab-attr";
import type { DoubleBattleChanceAbAttr } from "#abilities/double-battle-chance-ab-attr";
import type { DoubleBerryEffectAbAttr } from "#abilities/double-berry-effect-ab-attr";
import type { EffectSporeAbAttr } from "#abilities/effect-spore-ab-attr";
import type { FieldMoveTypePowerBoostAbAttr } from "#abilities/field-move-type-power-boost-ab-attr";
import type { FieldMultiplyStatAbAttr } from "#abilities/field-multiply-stat-ab-attr";
import type { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import type { FieldPriorityMoveImmunityAbAttr } from "#abilities/field-priority-move-immunity-ab-attr";
import type { FlinchEffectAbAttr } from "#abilities/flinch-effect-ab-attr";
import type { ForceSwitchOutImmunityAbAttr } from "#abilities/force-switch-out-immunity-ab-attr";
import type { FullHpResistTypeAbAttr } from "#abilities/full-hp-resist-type-ab-attr";
import type { HealFromBerryUseAbAttr } from "#abilities/heal-from-berry-use-ab-attr";
import type { IgnoreContactAbAttr } from "#abilities/ignore-contact-ab-attr";
import type { IgnoreMoveEffectsAbAttr } from "#abilities/ignore-move-effects-ab-attr";
import type { IgnoreOpponentStatStagesAbAttr } from "#abilities/ignore-opponent-stat-stages-ab-attr";
import type { IgnoreProtectOnContactAbAttr } from "#abilities/ignore-protect-on-contact-ab-attr";
import type { IgnoreTypeImmunityAbAttr } from "#abilities/ignore-type-immunity-ab-attr";
import type { IgnoreTypeStatusEffectImmunityAbAttr } from "#abilities/ignore-type-status-effect-immunity-ab-attr";
import type { IncreasePpAbAttr } from "#abilities/increase-pp-ab-attr";
import type { InfiltratorAbAttr } from "#abilities/infiltrator-ab-attr";
import type { IntimidateImmunityAbAttr } from "#abilities/intimidate-immunity-ab-attr";
import type { MaxMultiHitAbAttr } from "#abilities/max-multi-hit-ab-attr";
import type { MoveAbilityBypassAbAttr } from "#abilities/move-ability-bypass-ab-attr";
import type { MoveEffectChanceMultiplierAbAttr } from "#abilities/move-effect-chance-multiplier-ab-attr";
import type { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import type { MoveTypeChangeAbAttr } from "#abilities/move-type-change-ab-attr";
import type { PokemonTypeChangeAbAttr } from "#abilities/pokemon-type-change-ab-attr";
import type { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import type { PostAttackApplyBattlerTagAbAttr } from "#abilities/post-attack-apply-battler-tag-ab-attr";
import type { PostAttackApplyStatusEffectAbAttr } from "#abilities/post-attack-apply-status-effect-ab-attr";
import type { PostBattleAbAttr } from "#abilities/post-battle-ab-attr";
import type { PostBattleInitAbAttr } from "#abilities/post-battle-init-ab-attr";
import type { PostBiomeChangeAbAttr } from "#abilities/post-biome-change-ab-attr";
import type { PostDamageAbAttr } from "#abilities/post-damage-ab-attr";
import type { PostDamageForceSwitchAbAttr } from "#abilities/post-damage-force-switch-ab-attr";
import type { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import type { PostDefendAbilityGiveAbAttr } from "#abilities/post-defend-ability-give-ab-attr";
import type { PostDefendContactApplyStatusEffectAbAttr } from "#abilities/post-defend-contact-apply-status-effect-ab-attr";
import type { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import type { PostIntimidateStatStageChangeAbAttr } from "#abilities/post-intimidate-stat-stage-change-ab-attr";
import type { PostItemLostAbAttr } from "#abilities/post-item-lost-ab-attr";
import type { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import type { PostMoveUsedAbAttr } from "#abilities/post-move-used-ab-attr";
import type { PostStatStageChangeAbAttr } from "#abilities/post-stat-stage-change-ab-attr";
import type { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import type { PostTeraFormChangeClearWeatherTerrainAbAttr } from "#abilities/post-tera-form-change-clear-weather-terrain-ab-attr";
import type { PostTeraFormChangeStatChangeAbAttr } from "#abilities/post-tera-form-change-stat-change-ab-attr";
import type { PostTerrainChangeAbAttr } from "#abilities/post-terrain-change-ab-attr";
import type { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import type { PostVictoryAbAttr } from "#abilities/post-victory-ab-attr";
import type { PostWeatherChangeAbAttr } from "#abilities/post-weather-change-ab-attr";
import type { PostWeatherLapseAbAttr } from "#abilities/post-weather-lapse-ab-attr";
import type { PreDefendFullHpEndureAbAttr } from "#abilities/pre-defend-full-hp-endure-ab-attr";
import type { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import type { PreWeatherDamageAbAttr } from "#abilities/pre-weather-damage-ab-attr";
import type { PreventBerryUseAbAttr } from "#abilities/prevent-berry-use-ab-attr";
import type { PreventBypassSpeedChanceAbAttr } from "#abilities/prevent-bypass-speed-chance-ab-attr";
import type { ProtectStatAbAttr } from "#abilities/protect-stat-ab-attr";
import type { ReceivedMoveDamageMultiplierAbAttr } from "#abilities/received-move-damage-multiplier-ab-attr";
import type { RecoveryBoostAbAttr } from "#abilities/recovery-boost-ab-attr";
import type { RedirectMoveAbAttr } from "#abilities/redirect-move-ab-attr";
import type { ReduceBerryUseThresholdAbAttr } from "#abilities/reduce-berry-use-threshold-ab-attr";
import type { ReduceBurnDamageAbAttr } from "#abilities/reduce-burn-damage-ab-attr";
import type { ReduceSleepDurationAbAttr } from "#abilities/reduce-sleep-duration-ab-attr";
import type { ReflectMovesAbAttr } from "#abilities/reflect-moves-ab-attr";
import type { ReflectStatStageChangeAbAttr } from "#abilities/reflect-stat-stage-change-ab-attr";
import type { ReverseDrainAbAttr } from "#abilities/reverse-drain-ab-attr";
import type { RunSuccessAbAttr } from "#abilities/run-success-ab-attr";
import type { StabBoostAbAttr } from "#abilities/stab-boost-ab-attr";
import type { StatMultiplierAbAttr } from "#abilities/stat-multiplier-ab-attr";
import type { StatStageChangeCopyAbAttr } from "#abilities/stat-stage-change-copy-ab-attr";
import type { StatStageChangeMultiplierAbAttr } from "#abilities/stat-stage-change-multiplier-ab-attr";
import type { StatusEffectImmunityAbAttr } from "#abilities/status-effect-immunity-ab-attr";
import type { SuppressFieldAbilitiesAbAttr } from "#abilities/suppress-field-abilities-ab-attr";
import type { SuppressWeatherEffectAbAttr } from "#abilities/suppress-weather-effect-ab-attr";
import type { SyncEncounterNatureAbAttr } from "#abilities/sync-encounter-nature-ab-attr";
import type { SynchronizeStatusAbAttr } from "#abilities/synchronize-status-ab-attr";
import type { TerrainEventTypeChangeAbAttr } from "#abilities/terrain-event-type-change-ab-attr";
import type { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import type { UncopiableAbilityAbAttr } from "#abilities/uncopiable-ability-ab-attr";
import type { UnsuppressableAbilityAbAttr } from "#abilities/unsuppressable-ability-ab-attr";
import type { UnswappableAbilityAbAttr } from "#abilities/unswappable-ability-ab-attr";
import type { UserFieldBattlerTagImmunityAbAttr } from "#abilities/user-field-battler-tag-immunity-ab-attr";
import type { UserFieldMoveTypePowerBoostAbAttr } from "#abilities/user-field-move-type-power-boost-ab-attr";
import type { UserFieldStatusEffectImmunityAbAttr } from "#abilities/user-field-status-effect-immunity-ab-attr";
import type { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { WeightMultiplierAbAttr } from "#abilities/weight-multiplier-ab-attr";
import type { WonderSkinAbAttr } from "#abilities/wonder-skin-ab-attr";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

export enum AbAttrFlag {
  /** @see {@linkcode AbAttr} */
  UNSPECIFIED,
  /** @see {@linkcode UncopiableAbilityAbAttr} */
  UNCOPIABLE_ABILITY,
  /** @see {@linkcode UnsuppressableAbilityAbAttr} */
  UNSUPPRESSABLE_ABILITY,
  /** @see {@linkcode PostDefendAbilityGiveAbAttr} */
  POST_DEFEND_ABILITY_GIVE,
  /** @see {@linkcode UnswappableAbilityAbAttr} */
  UNSWAPPABLE_ABILITY,
  /** @see {@linkcode PostDamageForceSwitchAbAttr} */
  POST_DAMAGE_FORCE_SWITCH,
  /** @see {@linkcode SuppressFieldAbilitiesAbAttr} */
  SUPPRESS_FIELD_ABILITIES,
  /** @see {@linkcode BlockRedirectAbAttr} */
  BLOCK_REDIRECT,
  /** @see {@linkcode IgnoreMoveEffectsAbAttr} */
  IGNORE_MOVE_EFFECTS,
  /** @see {@linkcode IgnoreTypeImmunityAbAttr} */
  IGNORE_TYPE_IMMUNITY,
  /** @see {@linkcode CommanderAbAttr} */
  COMMANDER,
  /** @see {@linkcode BlockNonDirectDamageAbAttr} */
  BLOCK_NON_DIRECT_DAMAGE,
  /** @see {@linkcode ReverseDrainAbAttr} */
  REVERSE_DRAIN,
  /** @see {@linkcode IgnoreContactAbAttr} */
  IGNORE_CONTACT,
  /** @see {@linkcode MoveAbilityBypassAbAttr} */
  MOVE_ABILITY_BYPASS,
  /** @see {@linkcode IgnoreProtectOnContactAbAttr} */
  IGNORE_PROTECT_ON_CONTACT,
  /** @see {@linkcode IncreasePpAbAttr} */
  INCREASE_PP,
  /** @see {@linkcode AlwaysHitAbAttr} */
  ALWAYS_HIT,
  /** @see {@linkcode MaxMultiHitAbAttr} */
  MAX_MULTI_HIT,
  /** @see {@linkcode SuppressWeatherEffectAbAttr} */
  SUPPRESS_WEATHER_EFFECT,
  /** @see {@linkcode ReceivedMoveDamageMultiplierAbAttr} */
  RECEIVED_MOVE_DAMAGE_MULTIPLIER,
  /** @see {@linkcode PostAttackApplyStatusEffectAbAttr} */
  POST_ATTACK_APPLY_STATUS_EFFECT,
  /** @see {@linkcode PostDefendContactApplyStatusEffectAbAttr} */
  POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT,
  /** @see {@linkcode BypassSpeedChanceAbAttr} */
  BYPASS_SPEED_CHANCE,
  /** @see {@linkcode PreventBypassSpeedChanceAbAttr} */
  PREVENT_BYPASS_SPEED_CHANCE,
  /** @see {@linkcode StatMultiplierAbAttr} */
  STAT_MULTIPLIER,
  /** @see {@linkcode PostAttackApplyBattlerTagAbAttr} */
  POST_ATTACK_APPLY_BATTLER_TAG,
  /** @see {@linkcode MoveEffectChanceMultiplierAbAttr} */
  MOVE_EFFECT_CHANCE_MULTIPLIER,
  /** @see {@linkcode DoubleBattleChanceAbAttr} */
  DOUBLE_BATTLE_CHANCE,
  /** @see {@linkcode PostBattleInitAbAttr} */
  POST_BATTLE_INIT,
  /** @see {@linkcode PostItemLostAbAttr} */
  POST_ITEM_LOST,
  /** @see {@linkcode BlockItemTheftAbAttr} */
  BLOCK_ITEM_THEFT,
  /** @see {@linkcode ForceSwitchOutImmunityAbAttr} */
  FORCE_SWITCH_OUT_IMMUNITY,
  /** @see {@linkcode FieldPreventExplosionLikeAbAttr} */
  FIELD_PREVENT_EXPLOSION_LIKE,
  /** @see {@linkcode IntimidateImmunityAbAttr} */
  INTIMIDATE_IMMUNITY,
  /** @see {@linkcode PostIntimidateStatStageChangeAbAttr} */
  POST_INTIMIDATE_STAT_STAGE_CHANGE,
  /** @see {@linkcode InfiltratorAbAttr} */
  INFILTRATOR,
  /** @see {@linkcode ProtectStatAbAttr} */
  PROTECT_STAT,
  /** @see {@linkcode FlinchEffectAbAttr} */
  FLINCH_EFFECT,
  /** @see {@linkcode ReduceBerryUseThresholdAbAttr} */
  REDUCE_BERRY_USE_THRESHOLD,
  /** @see {@linkcode DoubleBerryEffectAbAttr} */
  DOUBLE_BERRY_EFFECT,
  /** @see {@linkcode HealFromBerryUseAbAttr} */
  HEAL_FROM_BERRY_USE,
  /** @see {@linkcode RecoveryBoostAbAttr} */
  RECOVERY_BOOST,
  /** @see {@linkcode BlockOneHitKoAbAttr} */
  BLOCK_ONE_HIT_KO,
  /** @see {@linkcode BlockRecoilDamageAbAttr} */
  BLOCK_RECOIL_DAMAGE,
  /** @see {@linkcode ConfusionOnStatusEffectAbAttr} */
  CONFUSION_ON_STATUS_EFFECT,
  /** @see {@linkcode StatStageChangeMultiplierAbAttr} */
  STAT_STAGE_CHANGE_MULTIPLIER,
  /** @see {@linkcode WonderSkinAbAttr} */
  WONDER_SKIN,
  /** @see {@linkcode MoveTypeChangeAbAttr} */
  MOVE_TYPE_CHANGE,
  /** @see {@linkcode VariableMovePowerAbAttr} */
  VARIABLE_MOVE_POWER,
  /** @see {@linkcode AllyMoveCategoryPowerBoostAbAttr} */
  ALLY_MOVE_CATEGORY_POWER_BOOST,
  /** @see {@linkcode UserFieldMoveTypePowerBoostAbAttr} */
  USER_FIELD_MOVE_TYPE_POWER_BOOST,
  /** @see {@linkcode ChangeMovePriorityAbAttr} */
  CHANGE_MOVE_PRIORITY,
  /** @see {@linkcode PostWeatherChangeAbAttr} */
  POST_WEATHER_CHANGE,
  /** @see {@linkcode PostTerrainChangeAbAttr} */
  POST_TERRAIN_CHANGE,
  /** @see {@linkcode TerrainEventTypeChangeAbAttr} */
  TERRAIN_EVENT_TYPE_CHANGE,
  /** @see {@linkcode BonusCritAbAttr} */
  BONUS_CRIT,
  /** @see {@linkcode FieldMultiplyStatAbAttr} */
  FIELD_MULTIPLY_STAT,
  /** @see {@linkcode RunSuccessAbAttr} */
  RUN_SUCCESS,
  /** @see {@linkcode PostBattleAbAttr} */
  POST_BATTLE,
  /** @see {@linkcode PreventBerryUseAbAttr} */
  PREVENT_BERRY_USE,
  /** @see {@linkcode SyncEncounterNatureAbAttr} */
  SYNC_ENCOUNTER_NATURE,
  /** @see {@linkcode PostFaintAbAttr} */
  POST_FAINT,
  /** @see {@linkcode PostKnockOutAbAttr} */
  POST_KNOCK_OUT,
  /** @see {@linkcode PostVictoryAbAttr} */
  POST_VICTORY,
  /** @see {@linkcode AddSecondStrikeAbAttr} */
  ADD_SECOND_STRIKE,
  /** @see {@linkcode PostDamageAbAttr} */
  POST_DAMAGE,
  /** @see {@linkcode PostAttackAbAttr} */
  POST_ATTACK,
  /** @see {@linkcode PostDefendAbAttr} */
  POST_DEFEND,
  /** @see {@linkcode WeightMultiplierAbAttr} */
  WEIGHT_MULTIPLIER,
  /** @see {@linkcode ArenaTrapAbAttr} */
  ARENA_TRAP,
  /** @see {@linkcode TypeImmunityAbAttr} */
  TYPE_IMMUNITY,
  /** @see {@linkcode MoveImmunityAbAttr} */
  MOVE_IMMUNITY,
  /** @see {@linkcode FieldPriorityMoveImmunityAbAttr} */
  FIELD_PRIORITY_MOVE_IMMUNITY,
  /** @see {@linkcode FullHpResistTypeAbAttr} */
  FULL_HP_RESIST_TYPE,
  /** @see {@linkcode IgnoreOpponentStatStagesAbAttr} */
  IGNORE_OPPONENT_STAT_STAGES,
  /** @see {@linkcode MultCritAbAttr} */
  MULT_CRIT,
  /** @see {@linkcode StabBoostAbAttr} */
  STAB_BOOST,
  /** @see {@linkcode BypassBurnDamageReductionAbAttr} */
  BYPASS_BURN_DAMAGE_REDUCTION,
  /** @see {@linkcode DamageBoostAbAttr} */
  DAMAGE_BOOST,
  /** @see {@linkcode AlliedFieldDamageReductionAbAttr} */
  ALLIED_FIELD_DAMAGE_REDUCTION,
  /** @see {@linkcode PreDefendFullHpEndureAbAttr} */
  PRE_DEFEND_FULL_HP_ENDURE,
  /** @see {@linkcode ConditionalCritAbAttr} */
  CONDITIONAL_CRIT,
  /** @see {@linkcode BlockCritAbAttr} */
  BLOCK_CRIT,
  /** @see {@linkcode BattlerTagImmunityAbAttr} */
  BATTLER_TAG_IMMUNITY,
  /** @see {@linkcode UserFieldBattlerTagImmunityAbAttr} */
  USER_FIELD_BATTLER_TAG_IMMUNITY,
  /** @see {@linkcode IgnoreTypeStatusEffectImmunityAbAttr} */
  IGNORE_TYPE_STATUS_EFFECT_IMMUNITY,
  /** @see {@linkcode StatusEffectImmunityAbAttr} */
  STATUS_EFFECT_IMMUNITY,
  /** @see {@linkcode UserFieldStatusEffectImmunityAbAttr} */
  USER_FIELD_STATUS_EFFECT_IMMUNITY,
  /** @see {@linkcode SynchronizeStatusAbAttr} */
  SYNCHRONIZE_STATUS,
  /** @see {@linkcode ReduceSleepDurationAbAttr} */
  REDUCE_SLEEP_DURATION,
  /** @see {@linkcode PokemonTypeChangeAbAttr} */
  POKEMON_TYPE_CHANGE,
  /** @see {@linkcode PostMoveUsedAbAttr} */
  POST_MOVE_USED,
  /** @see {@linkcode RedirectMoveAbAttr} */
  REDIRECT_MOVE,
  /** @see {@linkcode PostBiomeChangeAbAttr} */
  POST_BIOME_CHANGE,
  /** @see {@linkcode PostSummonAbAttr} */
  POST_SUMMON,
  /** @see {@linkcode BlockStatusDamageAbAttr} */
  BLOCK_STATUS_DAMAGE,
  /** @see {@linkcode ReduceBurnDamageAbAttr} */
  REDUCE_BURN_DAMAGE,
  /** @see {@linkcode StatStageChangeCopyAbAttr} */
  STAT_STAGE_CHANGE_COPY,
  /** @see {@linkcode PostStatStageChangeAbAttr} */
  POST_STAT_STAGE_CHANGE,
  /** @see {@linkcode PreSwitchOutAbAttr} */
  PRE_SWITCH_OUT,
  /** @see {@linkcode PostTurnAbAttr} */
  POST_TURN,
  /** @see {@linkcode PreWeatherDamageAbAttr} */
  PRE_WEATHER_DAMAGE,
  /** @see {@linkcode PostWeatherLapseAbAttr} */
  POST_WEATHER_LAPSE,
  /** @see {@linkcode FieldMoveTypePowerBoostAbAttr} */
  FIELD_MOVE_TYPE_POWER_BOOST,
  /** @see {@linkcode EffectSporeAbAttr} */
  EFFECT_SPORE,
  /** @see {@linkcode ReflectStatStageChangeAbAttr} */
  REFLECT_STAT_STAGE_CHANGE,
  /** @see {@linkcode BypassParaSpeedReductionAbAttr} */
  BYPASS_PARA_SPEED_REDUCTION,
  /** @see {@linkcode MockStatusEffectAbAttr} */
  MOCK_STATUS_EFFECT,
  /** @see {@linkcode ReflectMovesAbAttr} */
  REFLECT_MOVES,
  /** @see {@linkcode PostTeraFormChangeStatChangeAbAttr} */
  POST_TERA_FORM_CHANGE_STAT_CHANGE,
  /** @see {@linkcode PostTeraFormChangeClearWeatherTerrainAbAttr} */
  POST_TERA_FORM_CHANGE_CLEAR_WEATHER_TERRAIN,
}
