// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type AbAttr } from "#app/data/ab-attrs/ab-attr";
import { type AddSecondStrikeAbAttr } from "#app/data/ab-attrs/add-second-strike-ab-attr";
import { type AlliedFieldDamageReductionAbAttr } from "#app/data/ab-attrs/allied-field-damage-reduction-ab-attr";
import { type AllyMoveCategoryPowerBoostAbAttr } from "#app/data/ab-attrs/ally-move-category-power-boost-ab-attr";
import { type AlwaysHitAbAttr } from "#app/data/ab-attrs/always-hit-ab-attr";
import { type ArenaTrapAbAttr } from "#app/data/ab-attrs/arena-trap-ab-attr";
import { type BattlerTagImmunityAbAttr } from "#app/data/ab-attrs/battler-tag-immunity-ab-attr";
import { type BlockCritAbAttr } from "#app/data/ab-attrs/block-crit-ab-attr";
import { type BlockItemTheftAbAttr } from "#app/data/ab-attrs/block-item-theft-ab-attr";
import { type BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import { type BlockRedirectAbAttr } from "#app/data/ab-attrs/block-redirect-ab-attr";
import { type BlockStatusDamageAbAttr } from "#app/data/ab-attrs/block-status-damage-ab-attr";
import { type BonusCritAbAttr } from "#app/data/ab-attrs/bonus-crit-ab-attr";
import { type BypassBurnDamageReductionAbAttr } from "#app/data/ab-attrs/bypass-burn-damage-reduction-ab-attr";
import { type BypassSpeedChanceAbAttr } from "#app/data/ab-attrs/bypass-speed-chance-ab-attr";
import { type CommanderAbAttr } from "#app/data/ab-attrs/commander-ab-attr";
import { type ConditionalCritAbAttr } from "#app/data/ab-attrs/conditional-crit-ab-attr";
import { type ConfusionOnStatusEffectAbAttr } from "#app/data/ab-attrs/confusion-on-status-effect-ab-attr";
import { type DamageBoostAbAttr } from "#app/data/ab-attrs/damage-boost-ab-attr";
import { type DoubleBattleChanceAbAttr } from "#app/data/ab-attrs/double-battle-chance-ab-attr";
import { type DoubleBerryEffectAbAttr } from "#app/data/ab-attrs/double-berry-effect-ab-attr";
import { type FieldMultiplyStatAbAttr } from "#app/data/ab-attrs/field-multiply-stat-ab-attr";
import { type FieldPreventExplosionLikeAbAttr } from "#app/data/ab-attrs/field-prevent-explosion-like-ab-attr";
import { type FieldPriorityMoveImmunityAbAttr } from "#app/data/ab-attrs/field-priority-move-immunity-ab-attr";
import { type FlinchEffectAbAttr } from "#app/data/ab-attrs/flinch-effect-ab-attr";
import { type ForceSwitchOutImmunityAbAttr } from "#app/data/ab-attrs/force-switch-out-immunity-ab-attr";
import { type FullHpResistTypeAbAttr } from "#app/data/ab-attrs/full-hp-resist-type-ab-attr";
import { type HealFromBerryUseAbAttr } from "#app/data/ab-attrs/heal-from-berry-use-ab-attr";
import { type IgnoreContactAbAttr } from "#app/data/ab-attrs/ignore-contact-ab-attr";
import { type IgnoreMoveEffectsAbAttr } from "#app/data/ab-attrs/ignore-move-effects-ab-attr";
import { type IgnoreOpponentStatStagesAbAttr } from "#app/data/ab-attrs/ignore-opponent-stat-stages-ab-attr";
import { type IgnoreProtectOnContactAbAttr } from "#app/data/ab-attrs/ignore-protect-on-contact-ab-attr";
import { type IgnoreTypeImmunityAbAttr } from "#app/data/ab-attrs/ignore-type-immunity-ab-attr";
import { type IgnoreTypeStatusEffectImmunityAbAttr } from "#app/data/ab-attrs/ignore-type-status-effect-immunity-ab-attr";
import { type IncreasePpAbAttr } from "#app/data/ab-attrs/increase-pp-ab-attr";
import { type InfiltratorAbAttr } from "#app/data/ab-attrs/infiltrator-ab-attr";
import { type IntimidateImmunityAbAttr } from "#app/data/ab-attrs/intimidate-immunity-ab-attr";
import { type MaxMultiHitAbAttr } from "#app/data/ab-attrs/max-multi-hit-ab-attr";
import { type MoveAbilityBypassAbAttr } from "#app/data/ab-attrs/move-ability-bypass-ab-attr";
import { type MoveEffectChanceMultiplierAbAttr } from "#app/data/ab-attrs/move-effect-chance-multiplier-ab-attr";
import { type MoveImmunityAbAttr } from "#app/data/ab-attrs/move-immunity-ab-attr";
import { type MoveTypeChangeAbAttr } from "#app/data/ab-attrs/move-type-change-ab-attr";
import { type NoFusionAbilityAbAttr } from "#app/data/ab-attrs/no-fusion-ability-ab-attr";
import { type PokemonTypeChangeAbAttr } from "#app/data/ab-attrs/pokemon-type-change-ab-attr";
import { type PostAttackAbAttr } from "#app/data/ab-attrs/post-attack-ab-attr";
import { type PostAttackApplyBattlerTagAbAttr } from "#app/data/ab-attrs/post-attack-apply-battler-tag-ab-attr";
import { type PostAttackApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-attack-apply-status-effect-ab-attr";
import { type PostBattleAbAttr } from "#app/data/ab-attrs/post-battle-ab-attr";
import { type PostBattleInitAbAttr } from "#app/data/ab-attrs/post-battle-init-ab-attr";
import { type PostBiomeChangeAbAttr } from "#app/data/ab-attrs/post-biome-change-ab-attr";
import { type PostDamageAbAttr } from "#app/data/ab-attrs/post-damage-ab-attr";
import { type PostDamageForceSwitchAbAttr } from "#app/data/ab-attrs/post-damage-force-switch-ab-attr";
import { type PostDefendAbAttr } from "#app/data/ab-attrs/post-defend-ab-attr";
import { type PostDefendAbilityGiveAbAttr } from "#app/data/ab-attrs/post-defend-ability-give-ab-attr";
import { type PostDefendContactApplyStatusEffectAbAttr } from "#app/data/ab-attrs/post-defend-contact-apply-status-effect-ab-attr";
import { type PostFaintAbAttr } from "#app/data/ab-attrs/post-faint-ab-attr";
import { type PostIntimidateStatStageChangeAbAttr } from "#app/data/ab-attrs/post-intimidate-stat-stage-change-ab-attr";
import { type PostItemLostAbAttr } from "#app/data/ab-attrs/post-item-lost-ab-attr";
import { type PostKnockOutAbAttr } from "#app/data/ab-attrs/post-knock-out-ab-attr";
import { type PostMoveUsedAbAttr } from "#app/data/ab-attrs/post-move-used-ab-attr";
import { type PostStatStageChangeAbAttr } from "#app/data/ab-attrs/post-stat-stage-change-ab-attr";
import { type PostSummonAbAttr } from "#app/data/ab-attrs/post-summon-ab-attr";
import { type PostTerrainChangeAbAttr } from "#app/data/ab-attrs/post-terrain-change-ab-attr";
import { type PostTurnAbAttr } from "#app/data/ab-attrs/post-turn-ab-attr";
import { type PostVictoryAbAttr } from "#app/data/ab-attrs/post-victory-ab-attr";
import { type PostWeatherChangeAbAttr } from "#app/data/ab-attrs/post-weather-change-ab-attr";
import { type PreDefendFullHpEndureAbAttr } from "#app/data/ab-attrs/pre-defend-full-hp-endure-ab-attr";
import { type PreSwitchOutAbAttr } from "#app/data/ab-attrs/pre-switch-out-ab-attr";
import { type PreventBerryUseAbAttr } from "#app/data/ab-attrs/prevent-berry-use-ab-attr";
import { type PreventBypassSpeedChanceAbAttr } from "#app/data/ab-attrs/prevent-bypass-speed-chance-ab-attr";
import { type ProtectStatAbAttr } from "#app/data/ab-attrs/protect-stat-ab-attr";
import { type ReceivedMoveDamageMultiplierAbAttr } from "#app/data/ab-attrs/received-move-damage-multiplier-ab-attr";
import { type RecoveryBoostAbAttr } from "#app/data/ab-attrs/recovery-boost-ab-attr";
import { type RedirectMoveAbAttr } from "#app/data/ab-attrs/redirect-move-ab-attr";
import { type ReduceBerryUseThresholdAbAttr } from "#app/data/ab-attrs/reduce-berry-use-threshold-ab-attr";
import { type ReduceBurnDamageAbAttr } from "#app/data/ab-attrs/reduce-burn-damage-ab-attr";
import { type ReduceSleepDurationAbAttr } from "#app/data/ab-attrs/reduce-sleep-duration-ab-attr";
import { type ReverseDrainAbAttr } from "#app/data/ab-attrs/reverse-drain-ab-attr";
import { type RunSuccessAbAttr } from "#app/data/ab-attrs/run-success-ab-attr";
import { type StabBoostAbAttr } from "#app/data/ab-attrs/stab-boost-ab-attr";
import { type StatMultiplierAbAttr } from "#app/data/ab-attrs/stat-multiplier-ab-attr";
import { type StatStageChangeCopyAbAttr } from "#app/data/ab-attrs/stat-stage-change-copy-ab-attr";
import { type StatStageChangeMultiplierAbAttr } from "#app/data/ab-attrs/stat-stage-change-multiplier-ab-attr";
import { type StatusEffectImmunityAbAttr } from "#app/data/ab-attrs/status-effect-immunity-ab-attr";
import { type SuppressFieldAbilitiesAbAttr } from "#app/data/ab-attrs/suppress-field-abilities-ab-attr";
import { type SuppressWeatherEffectAbAttr } from "#app/data/ab-attrs/suppress-weather-effect-ab-attr";
import { type SyncEncounterNatureAbAttr } from "#app/data/ab-attrs/sync-encounter-nature-ab-attr";
import { type SynchronizeStatusAbAttr } from "#app/data/ab-attrs/synchronize-status-ab-attr";
import { type TerrainEventTypeChangeAbAttr } from "#app/data/ab-attrs/terrain-event-type-change-ab-attr";
import { type TypeImmunityAbAttr } from "#app/data/ab-attrs/type-immunity-ab-attr";
import { type UncopiableAbilityAbAttr } from "#app/data/ab-attrs/uncopiable-ability-ab-attr";
import { type UnsuppressableAbilityAbAttr } from "#app/data/ab-attrs/unsuppressable-ability-ab-attr";
import { type UnswappableAbilityAbAttr } from "#app/data/ab-attrs/unswappable-ability-ab-attr";
import { type UserFieldBattlerTagImmunityAbAttr } from "#app/data/ab-attrs/user-field-battler-tag-immunity-ab-attr";
import { type UserFieldMoveTypePowerBoostAbAttr } from "#app/data/ab-attrs/user-field-move-type-power-boost-ab-attr";
import { type UserFieldStatusEffectImmunityAbAttr } from "#app/data/ab-attrs/user-field-status-effect-immunity-ab-attr";
import { type VariableMovePowerAbAttr } from "#app/data/ab-attrs/variable-move-power-ab-attr";
import { type WeightMultiplierAbAttr } from "#app/data/ab-attrs/weight-multiplier-ab-attr";
import { type WonderSkinAbAttr } from "#app/data/ab-attrs/wonder-skin-ab-attr";
import { type PreWeatherDamageAbAttr } from "#app/data/ab-attrs/pre-weather-damage-ab-attr";
import { type PostWeatherLapseAbAttr } from "#app/data/ab-attrs/post-weather-lapse-ab-attr";
import { type FieldMoveTypePowerBoostAbAttr } from "#app/data/ab-attrs/field-move-type-power-boost-ab-attr";
import { type EffectSporeAbAttr } from "#app/data/ab-attrs/effect-spore-ab-attr";
import { type ReflectStatStageChangeAbAttr } from "#app/data/ab-attrs/reflect-stat-stage-change-ab-attr";
import { type BypassParaSpeedReductionAbAttr } from "#app/data/ab-attrs/bypass-para-speed-reduction-ab-attr";
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
  /** @see {@linkcode NoFusionAbilityAbAttr} */
  NO_FUSION_ABILITY,
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
  INITIMIDATE_IMMUNITY,
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
}
