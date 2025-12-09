/* biome-ignore-start lint/correctness/noUnusedImports: TSDoc imports */
import type { MoveId } from "#enums/move-id";
/* biome-ignore-end lint/correctness/noUnusedImports: TSDoc imports */

import type { AbAttr } from "#abilities/ab-attr";
import { AccuracyMultiplierAbAttr } from "#abilities/accuracy-multiplier-ab-attr";
import { AddSecondStrikeAbAttr } from "#abilities/add-second-strike-ab-attr";
import { AlliedFieldDamageReductionAbAttr } from "#abilities/allied-field-damage-reduction-ab-attr";
import { AllyMoveCategoryPowerBoostAbAttr } from "#abilities/ally-move-category-power-boost-ab-attr";
import { AlwaysHitAbAttr } from "#abilities/always-hit-ab-attr";
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
import { BonusCritAbAttr } from "#abilities/bonus-crit-ab-attr";
import { BypassBurnDamageReductionAbAttr } from "#abilities/bypass-burn-damage-reduction-ab-attr";
import { BypassParaSpeedReductionAbAttr } from "#abilities/bypass-para-speed-reduction-ab-attr";
import { BypassSpeedChanceAbAttr } from "#abilities/bypass-speed-chance-ab-attr";
import { ChangeMovePriorityAbAttr } from "#abilities/change-move-priority-ab-attr";
import { CommanderAbAttr } from "#abilities/commander-ab-attr";
import { ConditionalCritAbAttr } from "#abilities/conditional-crit-ab-attr";
import { ConfusionOnStatusEffectAbAttr } from "#abilities/confusion-on-status-effect-ab-attr";
import { DamageBoostAbAttr } from "#abilities/damage-boost-ab-attr";
import { DoubleBattleChanceAbAttr } from "#abilities/double-battle-chance-ab-attr";
import { DoubleBerryEffectAbAttr } from "#abilities/double-berry-effect-ab-attr";
import { EffectSporeAbAttr } from "#abilities/effect-spore-ab-attr";
import { EffectiveStatMultiplierAbAttr } from "#abilities/effective-stat-multiplier-ab-attr";
import { EvasivenessMultiplierAbAttr } from "#abilities/evasiveness-multiplier-ab-attr";
import { FieldAccuracyMultiplierAbAttr } from "#abilities/field-accuracy-multiplier-ab-attr";
import { FieldMoveTypePowerBoostAbAttr } from "#abilities/field-move-type-power-boost-ab-attr";
import { FieldPreventExplosionLikeAbAttr } from "#abilities/field-prevent-explosion-like-ab-attr";
import { FieldPriorityMoveImmunityAbAttr } from "#abilities/field-priority-move-immunity-ab-attr";
import { FieldStatMultiplierAbAttr } from "#abilities/field-stat-multiplier-ab-attr";
import { FlinchEffectAbAttr } from "#abilities/flinch-effect-ab-attr";
import { ForceSwitchOutImmunityAbAttr } from "#abilities/force-switch-out-immunity-ab-attr";
import { FullHpResistTypeAbAttr } from "#abilities/full-hp-resist-type-ab-attr";
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
import { MaxMultiHitAbAttr } from "#abilities/max-multi-hit-ab-attr";
import { MockStatusEffectAbAttr } from "#abilities/mock-status-effect-ab-attr";
import { MoveAbilityBypassAbAttr } from "#abilities/move-ability-bypass-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "#abilities/move-effect-chance-multiplier-ab-attr";
import { MoveImmunityAbAttr } from "#abilities/move-immunity-ab-attr";
import { MoveTypeChangeAbAttr } from "#abilities/move-type-change-ab-attr";
import { MultCritAbAttr } from "#abilities/mult-crit-ab-attr";
import { PokemonTypeChangeAbAttr } from "#abilities/pokemon-type-change-ab-attr";
import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { PostAttackApplyBattlerTagAbAttr } from "#abilities/post-attack-apply-battler-tag-ab-attr";
import { PostAttackApplyStatusEffectAbAttr } from "#abilities/post-attack-apply-status-effect-ab-attr";
import { PostBattleAbAttr } from "#abilities/post-battle-ab-attr";
import { PostBattleInitAbAttr } from "#abilities/post-battle-init-ab-attr";
import { PostDamageAbAttr } from "#abilities/post-damage-ab-attr";
import { PostDamageForceSwitchAbAttr } from "#abilities/post-damage-force-switch-ab-attr";
import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { PostDefendAbilityGiveAbAttr } from "#abilities/post-defend-ability-give-ab-attr";
import { PostDefendContactApplyStatusEffectAbAttr } from "#abilities/post-defend-contact-apply-status-effect-ab-attr";
import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { PostIntimidateStatStageChangeAbAttr } from "#abilities/post-intimidate-stat-stage-change-ab-attr";
import { PostItemLostAbAttr } from "#abilities/post-item-lost-ab-attr";
import { PostKnockOutAbAttr } from "#abilities/post-knock-out-ab-attr";
import { PostMoveUsedAbAttr } from "#abilities/post-move-used-ab-attr";
import { PostStatStageChangeAbAttr } from "#abilities/post-stat-stage-change-ab-attr";
import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { PostTeraFormChangeClearWeatherTerrainAbAttr } from "#abilities/post-tera-form-change-clear-weather-terrain-ab-attr";
import { PostTeraFormChangeStatChangeAbAttr } from "#abilities/post-tera-form-change-stat-change-ab-attr";
import { PostTerrainChangeAbAttr } from "#abilities/post-terrain-change-ab-attr";
import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { PostVictoryAbAttr } from "#abilities/post-victory-ab-attr";
import { PostWeatherChangeAbAttr } from "#abilities/post-weather-change-ab-attr";
import { PostWeatherLapseAbAttr } from "#abilities/post-weather-lapse-ab-attr";
import { PreLeaveFieldAbAttr } from "#abilities/pre-leave-field-ab-attrs";
import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import { PreWeatherDamageAbAttr } from "#abilities/pre-weather-damage-ab-attr";
import { PreventBerryUseAbAttr } from "#abilities/prevent-berry-use-ab-attr";
import { PreventBypassSpeedChanceAbAttr } from "#abilities/prevent-bypass-speed-chance-ab-attr";
import { ProtectStatAbAttr } from "#abilities/protect-stat-ab-attr";
import { ReceivedMoveDamageMultiplierAbAttr } from "#abilities/received-move-damage-multiplier-ab-attr";
import { RecoveryBoostAbAttr } from "#abilities/recovery-boost-ab-attr";
import { RedirectMoveAbAttr } from "#abilities/redirect-move-ab-attr";
import { ReduceBerryUseThresholdAbAttr } from "#abilities/reduce-berry-use-threshold-ab-attr";
import { ReduceBurnDamageAbAttr } from "#abilities/reduce-burn-damage-ab-attr";
import { ReduceSleepDurationAbAttr } from "#abilities/reduce-sleep-duration-ab-attr";
import { ReflectMovesAbAttr } from "#abilities/reflect-moves-ab-attr";
import { ReflectStatStageChangeAbAttr } from "#abilities/reflect-stat-stage-change-ab-attr";
import { ReverseDrainAbAttr } from "#abilities/reverse-drain-ab-attr";
import { RunSuccessAbAttr } from "#abilities/run-success-ab-attr";
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
import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { UserFieldBattlerTagImmunityAbAttr } from "#abilities/user-field-battler-tag-immunity-ab-attr";
import { UserFieldMoveTypePowerBoostAbAttr } from "#abilities/user-field-move-type-power-boost-ab-attr";
import { UserFieldStatusEffectImmunityAbAttr } from "#abilities/user-field-status-effect-immunity-ab-attr";
import { VariableMovePowerAbAttr } from "#abilities/variable-move-power-ab-attr";
import { WeightMultiplierAbAttr } from "#abilities/weight-multiplier-ab-attr";
import { WonderSkinAbAttr } from "#abilities/wonder-skin-ab-attr";
import { AbilityId } from "#enums/ability-id";
import type { AbAttrCondition, AbAttrKey, AbAttrMap } from "#types/ability-types";
import type { Constructor } from "#types/utility-types";
import { toCamelCaseString } from "#utils/string-utils";
import i18next from "i18next";

export class Ability {
  public id: AbilityId;
  private nameAppend: string = "";
  public generation: number;
  /**
   * If `true`, the ability will activate even if the pokemon faints.
   * @defaultValue `false`
   */
  public isBypassFaint: boolean = false;
  /**
   * If `true`, the ability can be ignored by effects like {@linkcode AbilityId.MOLD_BREAKER | Mold Breaker}.
   * @defaultValue `false`
   */
  public isIgnorable: boolean = false;
  /**
   * If `true`, the ability can be suppressed by effects like {@linkcode AbilityId.NEUTRALIZING_GAS | Neutralizing Gas}.
   * @defaultValue `true`
   */
  public isSuppressable: boolean = true;
  /**
   * If `true`, the ability can be copied by effects like {@linkcode MoveId.ROLE_PLAY | Role Play}.
   * @defaultValue `true`
   */
  public isCopiable: boolean = true;
  /**
   * If `true`, the ability can be replaced by effects like {@linkcode MoveId.ROLE_PLAY | Role Play}.
   * @defaultValue `true`
   */
  public isReplaceable: boolean = true;
  /**
   * If `true`, the ability will activate if the pokemon is transformed (such as by {@linkcode MoveId.TRANSFORM | Transform}).
   * @defaultValue `true`
   * @todo Implement the effects of the flag
   */
  public worksWhenTransformed: boolean = true;
  /** Determines priority bracket for post-summon ability activation */
  // TODO: implement its effects
  public postSummonPriority: number;
  public attrs: AbAttr[] = [];
  public conditions: AbAttrCondition[] = [];

  constructor(id: AbilityId, generation: number, postSummonPriority: number = 0) {
    this.id = id;
    this.generation = generation;
    this.postSummonPriority = postSummonPriority;
  }

  /**
   * The ability's localized name. May include a {@linkcode nameAppend | tag}
   * if the ability isn't fully implemented.
   */
  public get name(): string {
    return this.id ? `${i18next.t(`ability:${this.i18nKey}.name`)}${this.nameAppend}` : "";
  }

  /** The ability's localized description. */
  public get description(): string {
    return this.id ? i18next.t(`ability:${this.i18nKey}.description`) : "";
  }

  /**
   * The i18n key for this ability in camel-case, i.e. "abilityName".
   * Used to localize the ability's {@linkcode name} and {@linkcode description}.
   */
  private get i18nKey(): string {
    return toCamelCaseString(AbilityId[this.id]);
  }

  /** @returns `true` if both {@linkcode isCopiable} and {@linkcode isReplaceable} are `true` */
  public get isSwappable(): boolean {
    return this.isCopiable && this.isReplaceable;
  }

  /**
   * Get all ability attributes that match the given {@linkcode key}
   * @param key - The {@linkcode AbAttrKey} to check for
   * @returns An array of attributes that match the given {@linkcode key} (can be empty if none match).
   */
  getAttrs<K extends AbAttrKey>(key: K): AbAttrMap[K][] {
    // TODO: Figure out how to remove `as AbAttrMap[K][]`.
    // It's likely required due to `apply` and `canApply` not following LSP.
    return this.attrs.filter((abAttr): abAttr is AbAttrMap[K] => abAttr.is(key)) as AbAttrMap[K][];
  }

  /**
   * Check if an ability has an attribute that matches the given {@linkcode key}
   * @param key - The {@linkcode AbAttrKey} to check
   * @returns Whether the ability has an attribute with a matching key
   */
  hasAttr<K extends AbAttrKey>(key: K): boolean {
    return this.attrs.some((abAttr) => abAttr.is(key));
  }

  //#region Builder methods

  attr<T extends Constructor<AbAttr>>(AttrType: T, ...args: ConstructorParameters<T>): Ability {
    const attr = new AttrType(...args);
    attr.source = this;
    this.attrs.push(attr);

    return this;
  }

  conditionalAttr<T extends Constructor<AbAttr>>(
    condition: AbAttrCondition,
    AttrType: T,
    ...args: ConstructorParameters<T>
  ): Ability {
    const attr = new AttrType(...args);
    attr.source = this;
    attr.setCondition(condition);
    this.attrs.push(attr);

    return this;
  }

  /** Marks the ability as able to activate even if the ability holder faints. */
  bypassFaint(): Ability {
    this.isBypassFaint = true;
    return this;
  }

  /** Marks the ability as able to be ignored by effects like {@linkcode AbilityId.MOLD_BREAKER | Mold Breaker} */
  ignorable(): Ability {
    this.isIgnorable = true;
    return this;
  }

  /** Marks the ability as unable to be suppressed by effects like {@linkcode AbilityId.NEUTRALIZING_GAS | Neutralizing Gas} */
  unsuppressable(): Ability {
    this.isSuppressable = false;
    return this;
  }

  /** Marks the ability as unable to be copied by effects like {@linkcode MoveId.ROLE_PLAY | Role Play} */
  uncopiable(): Ability {
    this.isCopiable = false;
    return this;
  }

  /** Marks the ability as unable to be replaced by effects like {@linkcode MoveId.SIMPLE_BEAM | Simple Beam} */
  unreplaceable(): Ability {
    this.isReplaceable = false;
    return this;
  }

  /**
   * Marks the ability as unable to activate if the user is transformed (such as from {@linkcode MoveId.TRANSFORM | Transform}).
   * @todo Implement the effects of this flag
   */
  noTransform(): Ability {
    this.worksWhenTransformed = false;
    return this;
  }

  condition(condition: AbAttrCondition): Ability {
    this.conditions.push(condition);

    return this;
  }

  /** Marks the ability as being incomplete (missing functionality) in some way */
  partial(): this {
    this.nameAppend += " (P)";
    return this;
  }

  /** Marks the ability as being unimplemented (no functionality) */
  unimplemented(): this {
    this.nameAppend += " (N)";
    return this;
  }

  /**
   * Internal flag used for developers to document edge cases. When using this, please be sure to document the edge case.
   * @returns the ability
   */
  edgeCase(): this {
    return this;
  }

  // #endregion
}

/**
 * The complete list of referable {@linkcode AbAttr} types.
 * All calls to look up and/or apply attributes of a specific type
 * use an {@linkcode AbAttrKey} based on this object.
 */
const AbilityAttrs = {
  AccuracyMultiplierAbAttr,
  AddSecondStrikeAbAttr,
  AllyMoveCategoryPowerBoostAbAttr,
  AlliedFieldDamageReductionAbAttr,
  AlwaysHitAbAttr,
  ArenaTrapAbAttr,
  BadDreamsAbAttr,
  BattlerTagImmunityAbAttr,
  BlockCritAbAttr,
  BlockItemTheftAbAttr,
  BlockNonDirectDamageAbAttr,
  BlockOneHitKOAbAttr,
  BlockRecoilDamageAbAttr,
  BlockRedirectAbAttr,
  BlockStatusDamageAbAttr,
  BonusCritAbAttr,
  BypassBurnDamageReductionAbAttr,
  BypassParaSpeedReductionAbAttr,
  BypassSpeedChanceAbAttr,
  ChangeMovePriorityAbAttr,
  CommanderAbAttr,
  ConfusionOnStatusEffectAbAttr,
  ConditionalCritAbAttr,
  DamageBoostAbAttr,
  DoubleBattleChanceAbAttr,
  DoubleBerryEffectAbAttr,
  EffectSporeAbAttr,
  EffectiveStatMultiplierAbAttr,
  EvasivenessMultiplierAbAttr,
  FieldAccuracyMultiplierAbAttr,
  FieldMoveTypePowerBoostAbAttr,
  FieldPreventExplosionLikeAbAttr,
  FieldPriorityMoveImmunityAbAttr,
  FieldStatMultiplierAbAttr,
  FlinchEffectAbAttr,
  ForceSwitchOutImmunityAbAttr,
  FullHpResistTypeAbAttr,
  HealFromBerryUseAbAttr,
  IgnoreContactAbAttr,
  IgnoreMoveEffectsAbAttr,
  IgnoreOpponentStatStagesAbAttr,
  IgnoreProtectOnContactAbAttr,
  IgnoreTypeImmunityAbAttr,
  IgnoreTypeStatusEffectImmunityAbAttr,
  IncreasePpAbAttr,
  InfiltratorAbAttr,
  IntimidateImmunityAbAttr,
  MaxMultiHitAbAttr,
  MockStatusEffectAbAttr,
  MoveAbilityBypassAbAttr,
  MoveEffectChanceMultiplierAbAttr,
  MoveImmunityAbAttr,
  MoveTypeChangeAbAttr,
  PokemonTypeChangeAbAttr,
  MultCritAbAttr,
  PostAttackAbAttr,
  PostAttackApplyBattlerTagAbAttr,
  PostAttackApplyStatusEffectAbAttr,
  PostBattleAbAttr,
  PostBattleInitAbAttr,
  PostDamageAbAttr,
  PostDamageForceSwitchAbAttr,
  PostDefendAbAttr,
  PostDefendAbilityGiveAbAttr,
  PostDefendContactApplyStatusEffectAbAttr,
  PostFaintAbAttr,
  PostIntimidateStatStageChangeAbAttr,
  PostItemLostAbAttr,
  PostKnockOutAbAttr,
  PostMoveUsedAbAttr,
  PostStatStageChangeAbAttr,
  PostSummonAbAttr,
  PostTeraFormChangeClearWeatherTerrainAbAttr,
  PostTeraFormChangeStatChangeAbAttr,
  PostTerrainChangeAbAttr,
  PostTurnAbAttr,
  PostVictoryAbAttr,
  PostWeatherChangeAbAttr,
  PostWeatherLapseAbAttr,
  PreLeaveFieldAbAttr,
  PreSwitchOutAbAttr,
  PreWeatherDamageAbAttr,
  PreventBerryUseAbAttr,
  PreventBypassSpeedChanceAbAttr,
  ProtectStatAbAttr,
  ReceivedMoveDamageMultiplierAbAttr,
  RedirectMoveAbAttr,
  RecoveryBoostAbAttr,
  ReduceBerryUseThresholdAbAttr,
  ReduceBurnDamageAbAttr,
  ReduceSleepDurationAbAttr,
  ReflectMovesAbAttr,
  ReflectStatStageChangeAbAttr,
  ReverseDrainAbAttr,
  RunSuccessAbAttr,
  StabBoostAbAttr,
  StatStageChangeCopyAbAttr,
  StatStageChangeMultiplierAbAttr,
  StatusEffectImmunityAbAttr,
  SturdyAbAttr,
  SuppressFieldAbilitiesAbAttr,
  SuppressWeatherEffectAbAttr,
  SynchronizeStatusAbAttr,
  SyncEncounterNatureAbAttr,
  TerrainEventTypeChangeAbAttr,
  TypeImmunityAbAttr,
  UserFieldBattlerTagImmunityAbAttr,
  UserFieldMoveTypePowerBoostAbAttr,
  UserFieldStatusEffectImmunityAbAttr,
  VariableMovePowerAbAttr,
  WeightMultiplierAbAttr,
  WonderSkinAbAttr,
} as const;

/**
 * A map of all {@linkcode AbAttr} constructors.
 * @see {@linkcode AbilityAttrs}
 */
export type AbAttrConstructorMap = typeof AbilityAttrs;
