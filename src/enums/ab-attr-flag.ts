/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { AbAttr } from "#abilities/ab-attr";
import type { AccuracyMultiplierAbAttr } from "#abilities/accuracy-multiplier-ab-attr";
import type { AddSecondStrikeAbAttr } from "#abilities/add-second-strike-ab-attr";
import type { AlliedFieldDamageReductionAbAttr } from "#abilities/allied-field-damage-reduction-ab-attr";
import type { AllyMoveCategoryPowerBoostAbAttr } from "#abilities/ally-move-category-power-boost-ab-attr";
import type { AlwaysHitAbAttr } from "#abilities/always-hit-ab-attr";
import type { ArenaTrapAbAttr } from "#abilities/arena-trap-ab-attr";
import type { BadDreamsAbAttr } from "#abilities/bad-dreams-ab-attr";
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
import type { EffectiveStatMultiplier } from "#abilities/effective-stat-multiplier-ab-attr";
import type { EvasivenessMultiplierAbAttr } from "#abilities/evasiveness-multiplier-ab-attr";
import type { FieldAccuracyMultiplierAbAttr } from "#abilities/field-accuracy-multiplier-ab-attr";
import type { FieldMoveTypePowerBoostAbAttr } from "#abilities/field-move-type-power-boost-ab-attr";
import type { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import type { FieldPriorityMoveImmunityAbAttr } from "#abilities/field-priority-move-immunity-ab-attr";
import type { FieldStatMultiplierAbAttr } from "#abilities/field-stat-multiplier-ab-attr";
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
import type { StatStageChangeCopyAbAttr } from "#abilities/stat-stage-change-copy-ab-attr";
import type { StatStageChangeMultiplierAbAttr } from "#abilities/stat-stage-change-multiplier-ab-attr";
import type { StatusEffectImmunityAbAttr } from "#abilities/status-effect-immunity-ab-attr";
import type { SturdyAbAttr } from "#abilities/sturdy-ab-attr";
import type { SuppressFieldAbilitiesAbAttr } from "#abilities/suppress-field-abilities-ab-attr";
import type { SuppressWeatherEffectAbAttr } from "#abilities/suppress-weather-effect-ab-attr";
import type { SyncEncounterNatureAbAttr } from "#abilities/sync-encounter-nature-ab-attr";
import type { SynchronizeStatusAbAttr } from "#abilities/synchronize-status-ab-attr";
import type { TerrainEventTypeChangeAbAttr } from "#abilities/terrain-event-type-change-ab-attr";
import type { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import type { UserFieldBattlerTagImmunityAbAttr } from "#abilities/user-field-battler-tag-immunity-ab-attr";
import type { UserFieldMoveTypePowerBoostAbAttr } from "#abilities/user-field-move-type-power-boost-ab-attr";
import type { UserFieldStatusEffectImmunityAbAttr } from "#abilities/user-field-status-effect-immunity-ab-attr";
import type { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import type { WeightMultiplierAbAttr } from "#abilities/weight-multiplier-ab-attr";
import type { WonderSkinAbAttr } from "#abilities/wonder-skin-ab-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { ObjectValues } from "#types/utility-types";

export const AbAttrFlag = {
  /** @see {@linkcode AbAttr} */
  UNSPECIFIED: -1,
  /** @see {@linkcode PostDefendAbilityGiveAbAttr} */
  POST_DEFEND_ABILITY_GIVE: 3,
  /** @see {@linkcode PostDamageForceSwitchAbAttr} */
  POST_DAMAGE_FORCE_SWITCH: 5,
  /** @see {@linkcode SuppressFieldAbilitiesAbAttr} */
  SUPPRESS_FIELD_ABILITIES: 6,
  /** @see {@linkcode BlockRedirectAbAttr} */
  BLOCK_REDIRECT: 7,
  /** @see {@linkcode IgnoreMoveEffectsAbAttr} */
  IGNORE_MOVE_EFFECTS: 8,
  /** @see {@linkcode IgnoreTypeImmunityAbAttr} */
  IGNORE_TYPE_IMMUNITY: 9,
  /** @see {@linkcode CommanderAbAttr} */
  COMMANDER: 10,
  /** @see {@linkcode BlockNonDirectDamageAbAttr} */
  BLOCK_NON_DIRECT_DAMAGE: 11,
  /** @see {@linkcode ReverseDrainAbAttr} */
  REVERSE_DRAIN: 12,
  /** @see {@linkcode IgnoreContactAbAttr} */
  IGNORE_CONTACT: 13,
  /** @see {@linkcode MoveAbilityBypassAbAttr} */
  MOVE_ABILITY_BYPASS: 14,
  /** @see {@linkcode IgnoreProtectOnContactAbAttr} */
  IGNORE_PROTECT_ON_CONTACT: 15,
  /** @see {@linkcode IncreasePpAbAttr} */
  INCREASE_PP: 16,
  /** @see {@linkcode AlwaysHitAbAttr} */
  ALWAYS_HIT: 17,
  /** @see {@linkcode MaxMultiHitAbAttr} */
  MAX_MULTI_HIT: 18,
  /** @see {@linkcode SuppressWeatherEffectAbAttr} */
  SUPPRESS_WEATHER_EFFECT: 19,
  /** @see {@linkcode ReceivedMoveDamageMultiplierAbAttr} */
  RECEIVED_MOVE_DAMAGE_MULTIPLIER: 20,
  /** @see {@linkcode PostAttackApplyStatusEffectAbAttr} */
  POST_ATTACK_APPLY_STATUS_EFFECT: 21,
  /** @see {@linkcode PostDefendContactApplyStatusEffectAbAttr} */
  POST_DEFEND_CONTACT_APPLY_STATUS_EFFECT: 22,
  /** @see {@linkcode BypassSpeedChanceAbAttr} */
  BYPASS_SPEED_CHANCE: 23,
  /** @see {@linkcode PreventBypassSpeedChanceAbAttr} */
  PREVENT_BYPASS_SPEED_CHANCE: 24,
  /** @see {@linkcode EffectiveStatMultiplier} */
  EFFECTIVE_STAT_MULTIPLIER: 25,
  /** @see {@linkcode PostAttackApplyBattlerTagAbAttr} */
  POST_ATTACK_APPLY_BATTLER_TAG: 26,
  /** @see {@linkcode MoveEffectChanceMultiplierAbAttr} */
  MOVE_EFFECT_CHANCE_MULTIPLIER: 27,
  /** @see {@linkcode DoubleBattleChanceAbAttr} */
  DOUBLE_BATTLE_CHANCE: 28,
  /** @see {@linkcode PostBattleInitAbAttr} */
  POST_BATTLE_INIT: 29,
  /** @see {@linkcode PostItemLostAbAttr} */
  POST_ITEM_LOST: 30,
  /** @see {@linkcode BlockItemTheftAbAttr} */
  BLOCK_ITEM_THEFT: 31,
  /** @see {@linkcode ForceSwitchOutImmunityAbAttr} */
  FORCE_SWITCH_OUT_IMMUNITY: 32,
  /** @see {@linkcode FieldPreventExplosionLikeAbAttr} */
  FIELD_PREVENT_EXPLOSION_LIKE: 33,
  /** @see {@linkcode IntimidateImmunityAbAttr} */
  INTIMIDATE_IMMUNITY: 34,
  /** @see {@linkcode PostIntimidateStatStageChangeAbAttr} */
  POST_INTIMIDATE_STAT_STAGE_CHANGE: 35,
  /** @see {@linkcode InfiltratorAbAttr} */
  INFILTRATOR: 36,
  /** @see {@linkcode ProtectStatAbAttr} */
  PROTECT_STAT: 37,
  /** @see {@linkcode FlinchEffectAbAttr} */
  FLINCH_EFFECT: 38,
  /** @see {@linkcode ReduceBerryUseThresholdAbAttr} */
  REDUCE_BERRY_USE_THRESHOLD: 39,
  /** @see {@linkcode DoubleBerryEffectAbAttr} */
  DOUBLE_BERRY_EFFECT: 40,
  /** @see {@linkcode HealFromBerryUseAbAttr} */
  HEAL_FROM_BERRY_USE: 41,
  /** @see {@linkcode RecoveryBoostAbAttr} */
  RECOVERY_BOOST: 42,
  /** @see {@linkcode BlockOneHitKoAbAttr} */
  BLOCK_ONE_HIT_KO: 43,
  /** @see {@linkcode BlockRecoilDamageAbAttr} */
  BLOCK_RECOIL_DAMAGE: 44,
  /** @see {@linkcode ConfusionOnStatusEffectAbAttr} */
  CONFUSION_ON_STATUS_EFFECT: 45,
  /** @see {@linkcode StatStageChangeMultiplierAbAttr} */
  STAT_STAGE_CHANGE_MULTIPLIER: 46,
  /** @see {@linkcode WonderSkinAbAttr} */
  WONDER_SKIN: 47,
  /** @see {@linkcode MoveTypeChangeAbAttr} */
  MOVE_TYPE_CHANGE: 48,
  /** @see {@linkcode VariableMovePowerAbAttr} */
  VARIABLE_MOVE_POWER: 49,
  /** @see {@linkcode AllyMoveCategoryPowerBoostAbAttr} */
  ALLY_MOVE_CATEGORY_POWER_BOOST: 50,
  /** @see {@linkcode UserFieldMoveTypePowerBoostAbAttr} */
  USER_FIELD_MOVE_TYPE_POWER_BOOST: 51,
  /** @see {@linkcode ChangeMovePriorityAbAttr} */
  CHANGE_MOVE_PRIORITY: 52,
  /** @see {@linkcode PostWeatherChangeAbAttr} */
  POST_WEATHER_CHANGE: 53,
  /** @see {@linkcode PostTerrainChangeAbAttr} */
  POST_TERRAIN_CHANGE: 54,
  /** @see {@linkcode TerrainEventTypeChangeAbAttr} */
  TERRAIN_EVENT_TYPE_CHANGE: 55,
  /** @see {@linkcode BonusCritAbAttr} */
  BONUS_CRIT: 56,
  /** @see {@linkcode FieldStatMultiplierAbAttr} */
  FIELD_STAT_MULTIPLIER: 57,
  /** @see {@linkcode RunSuccessAbAttr} */
  RUN_SUCCESS: 58,
  /** @see {@linkcode PostBattleAbAttr} */
  POST_BATTLE: 59,
  /** @see {@linkcode PreventBerryUseAbAttr} */
  PREVENT_BERRY_USE: 60,
  /** @see {@linkcode SyncEncounterNatureAbAttr} */
  SYNC_ENCOUNTER_NATURE: 61,
  /** @see {@linkcode PostFaintAbAttr} */
  POST_FAINT: 62,
  /** @see {@linkcode PostKnockOutAbAttr} */
  POST_KNOCK_OUT: 63,
  /** @see {@linkcode PostVictoryAbAttr} */
  POST_VICTORY: 64,
  /** @see {@linkcode AddSecondStrikeAbAttr} */
  ADD_SECOND_STRIKE: 65,
  /** @see {@linkcode PostDamageAbAttr} */
  POST_DAMAGE: 66,
  /** @see {@linkcode PostAttackAbAttr} */
  POST_ATTACK: 67,
  /** @see {@linkcode PostDefendAbAttr} */
  POST_DEFEND: 68,
  /** @see {@linkcode WeightMultiplierAbAttr} */
  WEIGHT_MULTIPLIER: 69,
  /** @see {@linkcode ArenaTrapAbAttr} */
  ARENA_TRAP: 70,
  /** @see {@linkcode TypeImmunityAbAttr} */
  TYPE_IMMUNITY: 71,
  /** @see {@linkcode MoveImmunityAbAttr} */
  MOVE_IMMUNITY: 72,
  /** @see {@linkcode FieldPriorityMoveImmunityAbAttr} */
  FIELD_PRIORITY_MOVE_IMMUNITY: 73,
  /** @see {@linkcode FullHpResistTypeAbAttr} */
  FULL_HP_RESIST_TYPE: 74,
  /** @see {@linkcode IgnoreOpponentStatStagesAbAttr} */
  IGNORE_OPPONENT_STAT_STAGES: 75,
  /** @see {@linkcode MultCritAbAttr} */
  MULT_CRIT: 76,
  /** @see {@linkcode StabBoostAbAttr} */
  STAB_BOOST: 77,
  /** @see {@linkcode BypassBurnDamageReductionAbAttr} */
  BYPASS_BURN_DAMAGE_REDUCTION: 78,
  /** @see {@linkcode DamageBoostAbAttr} */
  DAMAGE_BOOST: 79,
  /** @see {@linkcode AlliedFieldDamageReductionAbAttr} */
  ALLIED_FIELD_DAMAGE_REDUCTION: 80,
  /** @see {@linkcode SturdyAbAttr} */
  STURDY: 81,
  /** @see {@linkcode ConditionalCritAbAttr} */
  CONDITIONAL_CRIT: 82,
  /** @see {@linkcode BlockCritAbAttr} */
  BLOCK_CRIT: 83,
  /** @see {@linkcode BattlerTagImmunityAbAttr} */
  BATTLER_TAG_IMMUNITY: 84,
  /** @see {@linkcode UserFieldBattlerTagImmunityAbAttr} */
  USER_FIELD_BATTLER_TAG_IMMUNITY: 85,
  /** @see {@linkcode IgnoreTypeStatusEffectImmunityAbAttr} */
  IGNORE_TYPE_STATUS_EFFECT_IMMUNITY: 86,
  /** @see {@linkcode StatusEffectImmunityAbAttr} */
  STATUS_EFFECT_IMMUNITY: 87,
  /** @see {@linkcode UserFieldStatusEffectImmunityAbAttr} */
  USER_FIELD_STATUS_EFFECT_IMMUNITY: 88,
  /** @see {@linkcode SynchronizeStatusAbAttr} */
  SYNCHRONIZE_STATUS: 89,
  /** @see {@linkcode ReduceSleepDurationAbAttr} */
  REDUCE_SLEEP_DURATION: 90,
  /** @see {@linkcode PokemonTypeChangeAbAttr} */
  POKEMON_TYPE_CHANGE: 91,
  /** @see {@linkcode PostMoveUsedAbAttr} */
  POST_MOVE_USED: 92,
  /** @see {@linkcode RedirectMoveAbAttr} */
  REDIRECT_MOVE: 93,
  /** @see {@linkcode PostBiomeChangeAbAttr} */
  POST_BIOME_CHANGE: 94,
  /** @see {@linkcode PostSummonAbAttr} */
  POST_SUMMON: 95,
  /** @see {@linkcode BlockStatusDamageAbAttr} */
  BLOCK_STATUS_DAMAGE: 96,
  /** @see {@linkcode ReduceBurnDamageAbAttr} */
  REDUCE_BURN_DAMAGE: 97,
  /** @see {@linkcode StatStageChangeCopyAbAttr} */
  STAT_STAGE_CHANGE_COPY: 98,
  /** @see {@linkcode PostStatStageChangeAbAttr} */
  POST_STAT_STAGE_CHANGE: 99,
  /** @see {@linkcode PreSwitchOutAbAttr} */
  PRE_SWITCH_OUT: 100,
  /** @see {@linkcode PostTurnAbAttr} */
  POST_TURN: 101,
  /** @see {@linkcode PreWeatherDamageAbAttr} */
  PRE_WEATHER_DAMAGE: 102,
  /** @see {@linkcode PostWeatherLapseAbAttr} */
  POST_WEATHER_LAPSE: 103,
  /** @see {@linkcode FieldMoveTypePowerBoostAbAttr} */
  FIELD_MOVE_TYPE_POWER_BOOST: 104,
  /** @see {@linkcode EffectSporeAbAttr} */
  EFFECT_SPORE: 105,
  /** @see {@linkcode ReflectStatStageChangeAbAttr} */
  REFLECT_STAT_STAGE_CHANGE: 106,
  /** @see {@linkcode BypassParaSpeedReductionAbAttr} */
  BYPASS_PARA_SPEED_REDUCTION: 107,
  /** @see {@linkcode MockStatusEffectAbAttr} */
  MOCK_STATUS_EFFECT: 108,
  /** @see {@linkcode ReflectMovesAbAttr} */
  REFLECT_MOVES: 109,
  /** @see {@linkcode PostTeraFormChangeStatChangeAbAttr} */
  POST_TERA_FORM_CHANGE_STAT_CHANGE: 110,
  /** @see {@linkcode PostTeraFormChangeClearWeatherTerrainAbAttr} */
  POST_TERA_FORM_CHANGE_CLEAR_WEATHER_TERRAIN: 111,
  /** @see {@linkcode BadDreamsAbAttr} */
  BAD_DREAMS: 112,
  /** @see {@linkcode AccuracyMultiplierAbAttr} */
  ACCURACY_MULTIPLIER: 113,
  /** @see {@linkcode FieldAccuracyMultiplierAbAttr} */
  FIELD_ACCURACY_MULTIPLIER: 114,
  /** @see {@linkcode EvasivenessMultiplierAbAttr} */
  EVASIVENESS_MULTIPLIER: 115,
} as const;

export type AbAttrFlag = ObjectValues<typeof AbAttrFlag>;
