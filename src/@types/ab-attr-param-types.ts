import type { Ability } from "#abilities/ability";
import type { BattlerTag } from "#battler-tags/battler-tag";
import type { Weather } from "#data/weather";
import type { AbilityId } from "#enums/ability-id";
import type { BattlerIndex } from "#enums/battler-index";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { BattleStat, EffectiveStat } from "#enums/stat";
import type { StatusEffect } from "#enums/status-effect";
import type { TerrainType } from "#enums/terrain-type";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";
import type { Move } from "#moves/move";
import type { ValueHolder } from "#utils/common-utils";

/** Base set of parameters passed to every ability attribute's apply method */
export interface BaseAbAttrParams {
  /** The pokemon that has the ability being applied */
  readonly pokemon: Pokemon;

  /**
   * Whether the ability's effects are being simulated (for instance, during AI damage calculations).
   * @remarks
   * Used to prevent message flyouts and other effects from being triggered.
   * @defaultValue `false`
   */
  readonly simulated: boolean;
}

export interface MoveAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode Move} being used */
  move: Move;
}

export interface AccuracyMultiplierAbAttrParams extends MoveAbAttrParams {
  accuracyMultiplier: ValueHolder<number>;
}

export interface DefenderAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode Pokemon} targeted by the move */
  defender: Pokemon;
}

export interface PreAttackAbAttrParams extends MoveAbAttrParams, DefenderAbAttrParams {}

export interface MoveTypeChangeAbAttrParams extends PreAttackAbAttrParams {
  moveType: ValueHolder<ElementalType>;
}

export interface AddSecondStrikeAbAttrParams extends PreAttackAbAttrParams {
  /** A {@linkcode ValueHolder} containing the number of strikes this move currently has */
  hitCount: ValueHolder<number>;
}

export interface AttackerAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode Pokemon} attacking the ability holder */
  attacker: Pokemon;
}

export interface PreDefendAbAttrParams extends MoveAbAttrParams, AttackerAbAttrParams {}

export interface PostDefendAbAttrParams extends MoveAbAttrParams, AttackerAbAttrParams {}

export interface PreDefendModifyMultiplierAbAttrParams extends PreDefendAbAttrParams {
  multiplier: ValueHolder<number>;
}

export interface ArenaTrapAbAttrParams extends BaseAbAttrParams {
  /** A {@link ValueHolder} indicating whether the other Pokemon is trapped or not */
  isTrapped: ValueHolder<boolean>;
  /** The {@link Pokemon} that is affected by an Arena Trap ability */
  trappedPokemon: Pokemon;
}

export interface IsCriticalAbAttrParams extends BaseAbAttrParams {
  /** A {@linkcode ValueHolder} that sets whether a move is a critical hit or not */
  isCritical: ValueHolder<boolean>;
}

export interface CancelledAbAttrParams extends BaseAbAttrParams {
  cancelled: ValueHolder<boolean>;
}

export interface PreWeatherEffectAbAttrParams extends CancelledAbAttrParams {
  /** The active {@linkcode Weather} on the field */
  weather: Weather;
}

export interface BonusCritAbAttrParams extends BaseAbAttrParams {
  critStage: ValueHolder<number>;
}

export interface ChangeMovePriorityAbAttrParams extends MoveAbAttrParams {
  priority: ValueHolder<number>;
}

export interface TargetAbAttrParams extends BaseAbAttrParams {
  target: Pokemon;
}

export interface ConditionalCritAbAttrParams extends MoveAbAttrParams, TargetAbAttrParams, IsCriticalAbAttrParams {}

export interface DefenderAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode Pokemon} targeted by the move */
  defender: Pokemon;
}

export interface StatusEffectAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode StatusEffect} applied by the move */
  effect: StatusEffect;
}

export interface ConfusionOnStatusEffectAbAttrParams extends DefenderAbAttrParams, StatusEffectAbAttrParams {}

export interface PostKnockOutAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode Pokemon} that fainted */
  knockedOutPokemon: Pokemon;
}

export interface DamageBoostAbAttrParams extends PreAttackAbAttrParams {
  /** A {@linkcode ValueHolder} containing a damage multiplier for the current attack. */
  multiplier: ValueHolder<number>;
}

export interface PostStatStageChangeAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode BattleStat}s being changed */
  statsChanged: BattleStat[];
  /** The change in stat stages */
  stagesChanged: number;
  /** (Optional) The source Pokemon that inflicted/activated the stat change */
  source?: Pokemon;
  /** Whether the stat stage change was caused by Sticky Webs */
  isStickyWeb: boolean;
}

export interface DoubleBattleChanceAbAttrParams extends BaseAbAttrParams {
  doubleBattleChance: ValueHolder<number>;
}

export interface DoubleBerryEffectAbAttrParams extends BaseAbAttrParams {
  berryEffect: ValueHolder<number>;
}

export interface EffectiveStatMultiplierAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode BattleStat} being evaluated */
  stat: BattleStat;
  /** A {@linkcode ValueHolder} containing the value of the evaluated stat */
  statValue: ValueHolder<number>;
  /** (Optional) The {@linkcode Move} being used at the time of evaluation */
  move?: Move;
  /** (Optional) The {@linkcode Pokemon} targeted by the move */
  target?: Pokemon;
}

export interface EvasionMultiplierAbAttrParams extends BaseAbAttrParams {
  evasionMultiplier: ValueHolder<number>;
}

export interface FieldAccuracyMultiplierAbAttrParams extends TargetAbAttrParams {
  accuracyMultiplier: ValueHolder<number>;
}

export interface FieldMovePowerBoostAbAttrParams extends PreAttackAbAttrParams {
  power: ValueHolder<number>;
}

export interface FieldPreventExplosionLikeAbAttrParams
  extends CancelledAbAttrParams,
    AttackerAbAttrParams,
    MoveAbAttrParams {}

export interface FieldPriorityMoveImmunityAbAttrParams extends PreDefendAbAttrParams, CancelledAbAttrParams {}

export interface FieldStatMultiplierAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode EffectiveStat} being checked */
  stat: EffectiveStat;
  /** A {@linkcode ValueHolder} containing the value of the stat being checked */
  statValue: ValueHolder<number>;
  /** The {@linkcode Pokemon} to which the ability may apply */
  target: Pokemon;
  /** A `Set` containing all of the abilities applied by the ability holder */
  abilitiesApplied: Set<AbilityId>;
}

export interface ReceivedMoveDamageMultiplierAbAttrParams extends PreDefendAbAttrParams {
  /** The damage multiplier */
  multiplier: ValueHolder<number>;
}

export interface FullHpResistTypeAbAttrParams extends PreDefendAbAttrParams {
  /** A {@linkcode ValueHolder} containing the move's current type effectiveness multiplier */
  typeMultiplier: ValueHolder<number>;
}

export interface PostAttackAbAttrParams extends DefenderAbAttrParams, MoveAbAttrParams {}

export interface IgnoreMoveEffectsAbAttrParams extends PreDefendAbAttrParams {
  effectChance: ValueHolder<number>;
}

export interface IgnoreOpponentStatStagesAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode BattleStat} whose stages may be ignored */
  stat: BattleStat;
  /** A {@linkcode ValueHolder} that, if set to `true`, causes stat stages for the given stat to be ignored */
  ignoreStatStage: ValueHolder<boolean>;
}

export interface IgnoreTypeImmunityAbAttrParams extends CancelledAbAttrParams {
  moveType: ElementalType;
  defType: ElementalType;
}

export interface IgnoreTypeStatusEffectImmunityAbAttrParams extends CancelledAbAttrParams, StatusEffectAbAttrParams {
  defType: ElementalType;
}

export interface InfiltratorAbAttrParams extends BaseAbAttrParams {
  bypassed: ValueHolder<boolean>;
}

export interface TypeImmunityAbAttrParams extends PreDefendAbAttrParams, CancelledAbAttrParams {
  /** A {@linkcode ValueHolder} containing the move's running effectiveness multiplier */
  typeMultiplier: ValueHolder<number>;
}

export interface MaxMultiHitAbAttrParams extends BaseAbAttrParams {
  hitValue: ValueHolder<number>;
}

export interface MockStatusEffectAbAttrParams extends BaseAbAttrParams {
  statusEffect: ValueHolder<StatusEffect>;
}

export interface PostBattleAbAttrParams extends BaseAbAttrParams {
  /** Whether the result of the battle was a victory for the player */
  isVictory: boolean;
}

export interface MoveAbilityBypassAbAttrParams extends MoveAbAttrParams, CancelledAbAttrParams {}

export interface MoveEffectChanceMultiplierAbAttrParams extends MoveAbAttrParams {
  /** A {@linkcode ValueHolder} containing the additional effect chance */
  moveChance: ValueHolder<number>;
}

export interface MoveImmunityAbAttrParams extends PreDefendAbAttrParams, CancelledAbAttrParams {}

export interface VariableMovePowerAbAttrParams extends PreAttackAbAttrParams {
  /** A {@linkcode ValueHolder} containing the move's power for the current turn */
  power: ValueHolder<number>;
}

export interface MultCritAbAttrParams extends BaseAbAttrParams {
  critMultiplier: ValueHolder<number>;
}

export interface PostDamageAbAttrParams extends BaseAbAttrParams {
  /** The last instance of damage dealt to the Pokemon */
  damage: number;
  /** (Optional) The {@linkcode Pokemon} who dealt damage to the ability owner */
  source?: Pokemon;
}

export interface PostMoveUsedAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode PokemonMove} used */
  move: PokemonMove;
  /** The {@linkcode Pokemon} using the move */
  source: Pokemon;
  /** The {@linkcode BattlerIndex | targets} of the move */
  targets: BattlerIndex[];
}

export interface PostFaintAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode Pokemon} that caused the source to faint */
  attacker?: Pokemon;
  /** The {@linkcode Move} that caused the source to faint */
  move?: Move;
}

export interface PostTerrainChangeAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode TerrainType | terrain} being set */
  terrain: TerrainType;
}

export interface PostWeatherChangeAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode WeatherType | weather} being set */
  weather: WeatherType;
}

export interface PreApplyBattlerTagImmunityAbAttrParams extends CancelledAbAttrParams {
  battlerTag: BattlerTag;
}

export interface PreSetStatusEffectImmunityAbAttrParams extends StatusEffectAbAttrParams, CancelledAbAttrParams {}

export interface PreStatStageChangeAbAttrParams extends CancelledAbAttrParams {
  /** The {@linkcode BattleStat} being changed */
  stat: BattleStat;
}

export interface PreventBerryUseAbAttrParams extends TargetAbAttrParams, CancelledAbAttrParams {}

export interface RecoveryBoostAbAttrParams extends DefenderAbAttrParams, MoveAbAttrParams {
  healRatio: ValueHolder<number>;
}

export interface RedirectMoveAbAttrParams extends BaseAbAttrParams {
  moveId: MoveId;
  user: Pokemon;
  target: ValueHolder<number>;
}

export interface ReduceBerryUseThresholdAbAttrParams extends BaseAbAttrParams {
  threshold: ValueHolder<number>;
}

export interface ReduceBurnDamageAbAttrParams extends BaseAbAttrParams {
  /** The damage dealt to the Pokemon */
  damage: ValueHolder<number>;
}

export interface ReflectMovesAbAttrParams extends PreDefendAbAttrParams {
  reflected: ValueHolder<boolean>;
}

export interface StatStageChangeAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode BattleStat | stats} being changed */
  stats: BattleStat[];
  /** The number of stages the stats are being changed by */
  stages: number;
}

export interface ReflectStatStageChangeAbAttrParams extends StatStageChangeAbAttrParams {
  /** The {@linkcode Pokemon} applying the original stat change, or `undefined` if it was not caused by a Pokemon */
  source: Pokemon | undefined;
  /** A {@linkcode ValueHolder} which indicates whether the stat stage changes were reflected */
  reflected: ValueHolder<boolean>;
}

export interface ReverseDrainAbAttrParams extends AttackerAbAttrParams {
  reversed: ValueHolder<boolean>;
}

export interface RunSuccessAbAttrParams extends BaseAbAttrParams {
  escapeChance: ValueHolder<number>;
}

export interface StabBoostAbAttrParams extends MoveAbAttrParams {
  /** A {@linkcode ValueHolder} containing the STAB multiplier for the current attack */
  stabMultiplier: ValueHolder<number>;
}

export interface StatStageChangeMultiplierAbAttrParams extends BaseAbAttrParams {
  /** The number of stages the stats are being changed by */
  stages: ValueHolder<number>;
}

export interface SturdyAbAttrParams extends PreDefendAbAttrParams {
  damage: ValueHolder<number>;
}

export interface SuppressFieldAbilitiesAbAttrParams extends BaseAbAttrParams {
  suppressed: ValueHolder<boolean>;
  ability: Ability;
}

export interface SyncEncounterNatureAbAttrParams extends BaseAbAttrParams {
  opponent: Pokemon;
}

export interface SynchronizeStatusAbAttrParams extends BaseAbAttrParams {
  /** The {@linkcode Pokemon} applying the status effect */
  source: Pokemon;
  /** The {@linkcode StatusEffect} being applied */
  effect: StatusEffect;
}

export interface WeightMultiplierAbAttrParams extends BaseAbAttrParams {
  weight: ValueHolder<number>;
}

export interface WonderSkinAbAttrParams extends AttackerAbAttrParams, MoveAbAttrParams {
  moveAccuracy: ValueHolder<number>;
}
