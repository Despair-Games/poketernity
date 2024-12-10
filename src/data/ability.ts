import type { BattlerIndex } from "#app/battle";
import { BattleType } from "#app/battle";
import type { Weather } from "#app/data/weather";
import { Stat, type BattleStat } from "#app/enums/stat";
import { SwitchType } from "#app/enums/switch-type";
import type Pokemon from "#app/field/pokemon";
import type { EnemyPokemon, PokemonMove } from "#app/field/pokemon";
import { HitResult, MoveResult, PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Localizable } from "#app/interfaces/locales";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import type { Constructor } from "#app/utils";
import { BooleanHolder, NumberHolder, randSeedItem, toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import type { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import { Type } from "#enums/type";
import { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { getPokemonNameWithAffix } from "../messages";
import { HitHealModifier } from "../modifier/modifier";
import { Command } from "../ui/command-ui-handler";
import { ArenaTagSide } from "./arena-tag";
import type { BattlerTag } from "./battler-tags";
import type Move from "./move";
import { allMoves, MoveCategory, MoveFlags, MoveTarget } from "./move";
import { AbAttr } from "./abilities/ab-attr";
import type { PostBattleInitAbAttr } from "./abilities/post-battle-init-ab-attr";
import { PostDamageAbAttr } from "./abilities/post-damage-ab-attr";
import { PostSummonAbAttr } from "./abilities/post-summon-ab-attr";
import type { PreAttackAbAttr } from "./abilities/pre-attack-ab-attr";
import { type PreDefendAbAttr } from "./abilities/pre-defend-ab-attr";
import { ReceivedMoveDamageMultiplierAbAttr } from "./abilities/received-move-damage-multiplier-ab-attr";
import type { PostDefendAbAttr } from "./abilities/post-defend-ab-attr";
import type { PostStatStageChangeAbAttr } from "./abilities/post-stat-stage-change-ab-attr";
import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { FieldPreventExplosiveMovesAbAttr } from "./abilities/field-prevent-explosive-moves-ab-attr";
import type { FieldMultiplyStatAbAttr } from "./abilities/field-multiply-stat-ab-attr";
import type { PokemonDefendCondition } from "../@types/PokemonDefendCondition";
import type { StatMultiplierAbAttr } from "./abilities/stat-multiplier-ab-attr";
import type { PostAttackAbAttr } from "./abilities/post-attack-ab-attr";
import type { PostSetStatusAbAttr } from "./abilities/post-set-status-ab-attr";
import type { PostVictoryAbAttr } from "./abilities/post-victory-ab-attr";
import type { PostKnockOutAbAttr } from "./abilities/post-knock-out-ab-attr";
import { PostSummonStatStageChangeAbAttr } from "./abilities/post-summon-stat-stage-change-ab-attr";
import type { PreSwitchOutAbAttr } from "./abilities/pre-switch-out-ab-attr";
import type { PreStatStageChangeAbAttr } from "./abilities/pre-stat-stage-change-ab-attr";
import type { PreSetStatusAbAttr } from "./abilities/pre-set-status-ab-attr";
import type { PreApplyBattlerTagAbAttr } from "./abilities/pre-apply-battler-tag-ab-attr";
import { BlockNonDirectDamageAbAttr } from "./abilities/block-non-direct-damage-ab-attr";
import type { PreWeatherEffectAbAttr } from "./abilities/pre-weather-effect-ab-attr";
import type { PreWeatherDamageAbAttr } from "./abilities/pre-weather-damage-ab-attr";
import type { PostWeatherChangeAbAttr } from "./abilities/post-weather-change-ab-attr";
import type { PostWeatherLapseAbAttr } from "./abilities/post-weather-lapse-ab-attr";
import type { PostTerrainChangeAbAttr } from "./abilities/post-terrain-change-ab-attr";
import type { PostTurnAbAttr } from "./abilities/post-turn-ab-attr";
import type { PostMoveUsedAbAttr } from "./abilities/post-move-used-ab-attr";
import type { PostItemLostAbAttr } from "./abilities/post-item-lost-ab-attr";

export class Ability implements Localizable {
  public id: Abilities;

  private nameAppend: string;
  public name: string;
  public description: string;
  public generation: integer;
  public isBypassFaint: boolean;
  public isIgnorable: boolean;
  public attrs: AbAttr[];
  public conditions: AbAttrCondition[];

  constructor(id: Abilities, generation: integer) {
    this.id = id;

    this.nameAppend = "";
    this.generation = generation;
    this.attrs = [];
    this.conditions = [];

    this.localize();
  }

  localize(): void {
    const i18nKey = Abilities[this.id]
      .split("_")
      .filter((f) => f)
      .map((f, i) => (i ? `${f[0]}${f.slice(1).toLowerCase()}` : f.toLowerCase()))
      .join("") as string;

    this.name = this.id ? `${i18next.t(`ability:${i18nKey}.name`) as string}${this.nameAppend}` : "";
    this.description = this.id ? (i18next.t(`ability:${i18nKey}.description`) as string) : "";
  }

  /**
   * Get all ability attributes that match `attrType`
   * @param attrType any attribute that extends {@linkcode AbAttr}
   * @returns Array of attributes that match `attrType`, Empty Array if none match.
   */
  getAttrs<T extends AbAttr>(attrType: Constructor<T>): T[] {
    return this.attrs.filter((a): a is T => a instanceof attrType);
  }

  /**
   * Check if an ability has an attribute that matches `attrType`
   * @param attrType any attribute that extends {@linkcode AbAttr}
   * @returns true if the ability has attribute `attrType`
   */
  hasAttr<T extends AbAttr>(attrType: Constructor<T>): boolean {
    return this.attrs.some((attr) => attr instanceof attrType);
  }

  attr<T extends Constructor<AbAttr>>(AttrType: T, ...args: ConstructorParameters<T>): Ability {
    const attr = new AttrType(...args);
    this.attrs.push(attr);

    return this;
  }

  conditionalAttr<T extends Constructor<AbAttr>>(
    condition: AbAttrCondition,
    AttrType: T,
    ...args: ConstructorParameters<T>
  ): Ability {
    const attr = new AttrType(...args);
    attr.addCondition(condition);
    this.attrs.push(attr);

    return this;
  }

  bypassFaint(): Ability {
    this.isBypassFaint = true;
    return this;
  }

  ignorable(): Ability {
    this.isIgnorable = true;
    return this;
  }

  condition(condition: AbAttrCondition): Ability {
    this.conditions.push(condition);

    return this;
  }

  partial(): this {
    this.nameAppend += " (P)";
    return this;
  }

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
}

type AbAttrApplyFunc<TAttr extends AbAttr> = (attr: TAttr, passive: boolean) => boolean;

export function getWeatherCondition(...weatherTypes: WeatherType[]): AbAttrCondition {
  return () => {
    if (!globalScene?.arena) {
      return false;
    }
    if (globalScene.arena.weather?.isEffectSuppressed()) {
      return false;
    }
    const weatherType = globalScene.arena.weather?.weatherType;
    return !!weatherType && weatherTypes.indexOf(weatherType) > -1;
  };
}

export class PreventBerryUseAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    cancelled.value = true;

    return true;
  }
}

/**
 * A Pokemon with this ability heals by a percentage of their maximum hp after eating a berry
 * @param healPercent - Percent of Max HP to heal
 * @see {@linkcode apply()} for implementation
 */
export class HealFromBerryUseAbAttr extends AbAttr {
  /** Percent of Max HP to heal */
  private healPercent: number;

  constructor(healPercent: number) {
    super();

    // Clamp healPercent so its between [0,1].
    this.healPercent = Math.max(Math.min(healPercent, 1), 0);
  }

  override apply(pokemon: Pokemon, passive: boolean, simulated: boolean, ..._args: [BooleanHolder, any[]]): boolean {
    const { name: abilityName } = passive ? pokemon.getPassiveAbility() : pokemon.getAbility();
    if (!simulated) {
      globalScene.unshiftPhase(
        new PokemonHealPhase(
          pokemon.getBattlerIndex(),
          toDmgValue(pokemon.getMaxHp() * this.healPercent),
          i18next.t("abilityTriggers:healFromBerryUse", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName,
          }),
          true,
        ),
      );
    }
    return true;
  }
}

export class RunSuccessAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as NumberHolder).value = 256;

    return true;
  }
}

type ArenaTrapCondition = (user: Pokemon, target: Pokemon) => boolean;

/**
 * Base class for checking if a Pokemon is trapped by arena trap
 * @extends AbAttr
 * @field {@linkcode arenaTrapCondition} Conditional for trapping abilities.
 * For example, Magnet Pull will only activate if opponent is Steel type.
 * @see {@linkcode applyCheckTrapped}
 */
export class CheckTrappedAbAttr extends AbAttr {
  protected arenaTrapCondition: ArenaTrapCondition;
  constructor(condition: ArenaTrapCondition) {
    super(false);
    this.arenaTrapCondition = condition;
  }

  applyCheckTrapped(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _trapped: BooleanHolder,
    _otherPokemon: Pokemon,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * Determines whether a Pokemon is blocked from switching/running away
 * because of a trapping ability or move.
 * @extends CheckTrappedAbAttr
 * @see {@linkcode applyCheckTrapped}
 */
export class ArenaTrapAbAttr extends CheckTrappedAbAttr {
  /**
   * Checks if enemy Pokemon is trapped by an Arena Trap-esque ability
   * If the enemy is a Ghost type, it is not trapped
   * If the enemy has the ability Run Away, it is not trapped.
   * If the user has Magnet Pull and the enemy is not a Steel type, it is not trapped.
   * If the user has Arena Trap and the enemy is not grounded, it is not trapped.
   * @param pokemon The {@link Pokemon} with this {@link AbAttr}
   * @param _passive N/A
   * @param trapped {@link BooleanHolder} indicating whether the other Pokemon is trapped or not
   * @param otherPokemon The {@link Pokemon} that is affected by an Arena Trap ability
   * @param _args N/A
   * @returns if enemy Pokemon is trapped or not
   */
  override applyCheckTrapped(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    trapped: BooleanHolder,
    otherPokemon: Pokemon,
    _args: any[],
  ): boolean {
    if (this.arenaTrapCondition(pokemon, otherPokemon)) {
      if (
        otherPokemon.getTypes(true).includes(Type.GHOST)
        || (otherPokemon.getTypes(true).includes(Type.STELLAR) && otherPokemon.getTypes().includes(Type.GHOST))
      ) {
        trapped.value = false;
        return false;
      } else if (otherPokemon.hasAbility(Abilities.RUN_AWAY)) {
        trapped.value = false;
        return false;
      }
      trapped.value = true;
      return true;
    }
    trapped.value = false;
    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:arenaTrap", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}

export class MaxMultiHitAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as NumberHolder).value = 0;

    return true;
  }
}

export class PostBattleAbAttr extends AbAttr {
  constructor() {
    super(true);
  }

  applyPostBattle(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}

export class PostBattleLootAbAttr extends PostBattleAbAttr {
  /**
   * @param args - `[0]`: boolean for if the battle ended in a victory
   * @returns `true` if successful
   */
  override applyPostBattle(pokemon: Pokemon, _passive: boolean, simulated: boolean, args: any[]): boolean {
    const postBattleLoot = globalScene.currentBattle.postBattleLoot;
    if (!simulated && postBattleLoot.length && args[0]) {
      const randItem = randSeedItem(postBattleLoot);
      //@ts-ignore - TODO see below
      if (globalScene.tryTransferHeldItemModifier(randItem, pokemon, true, 1, true, undefined, false)) {
        // TODO: fix. This is a promise!?
        postBattleLoot.splice(postBattleLoot.indexOf(randItem), 1);
        globalScene.queueMessage(
          i18next.t("abilityTriggers:postBattleLoot", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            itemName: randItem.type.name,
          }),
        );
        return true;
      }
    }

    return false;
  }
}

export class PostFaintAbAttr extends AbAttr {
  applyPostFaint(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _attacker?: Pokemon,
    _move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    return false;
  }
}

/**
 * Used for weather suppressing abilities to trigger weather-based form changes upon being fainted.
 * Used by Cloud Nine and Air Lock.
 * @extends PostFaintAbAttr
 */
export class PostFaintUnsuppressedWeatherFormChangeAbAttr extends PostFaintAbAttr {
  /**
   * Triggers {@linkcode Arena.triggerWeatherBasedFormChanges | triggerWeatherBasedFormChanges}
   * when the user of the ability faints
   * @param {Pokemon} _pokemon the fainted Pokemon
   * @param _passive n/a
   * @param _attacker n/a
   * @param _move n/a
   * @param _hitResult n/a
   * @param _args n/a
   * @returns whether the form change was triggered
   */
  override applyPostFaint(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    const pokemonToTransform = getPokemonWithWeatherBasedForms();

    if (pokemonToTransform.length < 1) {
      return false;
    }

    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChanges();
    }

    return true;
  }
}

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon fainting
 */
export class PostFaintClearWeatherAbAttr extends PostFaintAbAttr {
  /**
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param _passive N/A
   * @param _attacker N/A
   * @param _move N/A
   * @param _hitResult N/A
   * @param _args N/A
   * @returns {boolean} Returns true if the weather clears, otherwise false.
   */
  override applyPostFaint(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _attacker?: Pokemon,
    _move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    const weatherType = globalScene.arena.weather?.weatherType;
    let turnOffWeather = false;

    // Clear weather only if user's ability matches the weather and no other pokemon has the ability.
    switch (weatherType) {
      case WeatherType.HARSH_SUN:
        if (
          pokemon.hasAbility(Abilities.DESOLATE_LAND)
          && globalScene.getField(true).filter((p) => p.hasAbility(Abilities.DESOLATE_LAND)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
      case WeatherType.HEAVY_RAIN:
        if (
          pokemon.hasAbility(Abilities.PRIMORDIAL_SEA)
          && globalScene.getField(true).filter((p) => p.hasAbility(Abilities.PRIMORDIAL_SEA)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
      case WeatherType.STRONG_WINDS:
        if (
          pokemon.hasAbility(Abilities.DELTA_STREAM)
          && globalScene.getField(true).filter((p) => p.hasAbility(Abilities.DELTA_STREAM)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
    }

    if (simulated) {
      return turnOffWeather;
    }

    if (turnOffWeather) {
      globalScene.arena.trySetWeather(WeatherType.NONE, false);
      return true;
    }

    return false;
  }
}

export class PostFaintContactDamageAbAttr extends PostFaintAbAttr {
  private damageRatio: integer;

  constructor(damageRatio: integer) {
    super();

    this.damageRatio = damageRatio;
  }

  override applyPostFaint(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker?: Pokemon,
    move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    if (move !== undefined && attacker !== undefined && move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon)) {
      //If the mon didn't die to indirect damage
      const cancelled = new BooleanHolder(false);
      globalScene.getField(true).map((p) => applyAbAttrs(FieldPreventExplosiveMovesAbAttr, p, cancelled, simulated));
      if (cancelled.value || attacker.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)) {
        return false;
      }
      if (!simulated) {
        attacker.damageAndUpdate(toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio)), HitResult.OTHER);
        attacker.turnData.damageTaken += toDmgValue(attacker.getMaxHp() * (1 / this.damageRatio));
      }
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postFaintContactDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}

/**
 * Attribute used for abilities (Innards Out) that damage the opponent based on how much HP the last attack used to knock out the owner of the ability.
 */
export class PostFaintHPDamageAbAttr extends PostFaintAbAttr {
  constructor() {
    super();
  }

  override applyPostFaint(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker?: Pokemon,
    move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    if (move !== undefined && attacker !== undefined && !simulated) {
      //If the mon didn't die to indirect damage
      const damage = pokemon.turnData.attacksReceived[0].damage;
      attacker.damageAndUpdate(damage, HitResult.OTHER);
      attacker.turnData.damageTaken += damage;
    }
    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postFaintHpDamage", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}

export class RedirectMoveAbAttr extends AbAttr {
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (this.canRedirect(args[0] as Moves)) {
      const target = args[1] as NumberHolder;
      const newTarget = pokemon.getBattlerIndex();
      if (target.value !== newTarget) {
        target.value = newTarget;
        return true;
      }
    }

    return false;
  }

  canRedirect(moveId: Moves): boolean {
    const move = allMoves[moveId];
    return !![MoveTarget.NEAR_OTHER, MoveTarget.OTHER].find((t) => move.moveTarget === t);
  }
}

export class RedirectTypeMoveAbAttr extends RedirectMoveAbAttr {
  public type: Type;

  constructor(type: Type) {
    super();
    this.type = type;
  }

  override canRedirect(moveId: Moves): boolean {
    return super.canRedirect(moveId) && allMoves[moveId].type === this.type;
  }
}

export class BlockRedirectAbAttr extends AbAttr {}

/**
 * Used by Early Bird, makes the pokemon wake up faster
 * @param statusEffect - The {@linkcode StatusEffect} to check for
 * @see {@linkcode apply}
 */
export class ReduceStatusEffectDurationAbAttr extends AbAttr {
  private statusEffect: StatusEffect;

  constructor(statusEffect: StatusEffect) {
    super(true);

    this.statusEffect = statusEffect;
  }

  /**
   * Reduces the number of sleep turns remaining by an extra 1 when applied
   * @param args - The args passed to the `AbAttr`:
   * - `[0]` - The {@linkcode StatusEffect} of the Pokemon
   * - `[1]` - The number of turns remaining until the status is healed
   * @returns `true` if the ability was applied
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (!(args[1] instanceof NumberHolder)) {
      return false;
    }
    if (args[0] === this.statusEffect) {
      args[1].value -= 1;
      return true;
    }

    return false;
  }
}

export class FlinchEffectAbAttr extends AbAttr {
  constructor() {
    super(true);
  }
}

export class FlinchStatStageChangeAbAttr extends FlinchEffectAbAttr {
  private stats: BattleStat[];
  private stages: number;

  constructor(stats: BattleStat[], stages: number) {
    super();

    this.stats = Array.isArray(stats) ? stats : [stats];
    this.stages = stages;
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (!simulated) {
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, this.stats, this.stages));
    }
    return true;
  }
}

export class IncreasePpAbAttr extends AbAttr {}

export class ForceSwitchOutImmunityAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    cancelled.value = true;
    return true;
  }
}

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  constructor() {
    super();
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const hpRatio = pokemon.getHpRatio();

    if (args[0].value < hpRatio) {
      args[0].value *= 2;
      return args[0].value >= hpRatio;
    }

    return false;
  }
}

/**
 * Ability attribute used for abilites that change the ability owner's weight
 * Used for Heavy Metal (doubling weight) and Light Metal (halving weight)
 */
export class WeightMultiplierAbAttr extends AbAttr {
  private multiplier: integer;

  constructor(multiplier: integer) {
    super();

    this.multiplier = multiplier;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as NumberHolder).value *= this.multiplier;

    return true;
  }
}

export class SyncEncounterNatureAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as Pokemon).setNature(pokemon.getNature());

    return true;
  }
}

export class MoveAbilityBypassAbAttr extends AbAttr {
  private moveIgnoreFunc: (pokemon: Pokemon, move: Move) => boolean;

  constructor(moveIgnoreFunc?: (pokemon: Pokemon, move: Move) => boolean) {
    super(false);

    this.moveIgnoreFunc = moveIgnoreFunc || ((_pokemon, _move) => true);
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (this.moveIgnoreFunc(pokemon, args[0] as Move)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}

export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const ability = args[0] as Ability;
    if (!ability.hasAttr(UnsuppressableAbilityAbAttr) && !ability.hasAttr(SuppressFieldAbilitiesAbAttr)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}

export class AlwaysHitAbAttr extends AbAttr {}

/** Attribute for abilities that allow moves that make contact to ignore protection (i.e. Unseen Fist) */
export class IgnoreProtectOnContactAbAttr extends AbAttr {}

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Infiltrator_(Ability) | Infiltrator}.
 * Allows the source's moves to bypass the effects of opposing Light Screen, Reflect, Aurora Veil, Safeguard, Mist, and Substitute.
 */
export class InfiltratorAbAttr extends AbAttr {
  /**
   * Sets a flag to bypass screens, Substitute, Safeguard, and Mist
   * @param _pokemon n/a
   * @param _passive n/a
   * @param _simulated n/a
   * @param _cancelled n/a
   * @param args `[0]` a {@linkcode BooleanHolder | BooleanHolder} containing the flag
   * @returns `true` if the bypass flag was successfully set; `false` otherwise.
   */
  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _cancelled: null, args: any[]): boolean {
    const bypassed = args[0];
    if (args[0] instanceof BooleanHolder) {
      bypassed.value = true;
      return true;
    }
    return false;
  }
}

export class UncopiableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
  }
}

export class UnsuppressableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
  }
}

export class UnswappableAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
  }
}

export class NoTransformAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
  }
}

export class NoFusionAbilityAbAttr extends AbAttr {
  constructor() {
    super(false);
  }
}

export class IgnoreTypeImmunityAbAttr extends AbAttr {
  private defenderType: Type;
  private allowedMoveTypes: Type[];

  constructor(defenderType: Type, allowedMoveTypes: Type[]) {
    super(true);
    this.defenderType = defenderType;
    this.allowedMoveTypes = allowedMoveTypes;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (this.defenderType === (args[1] as Type) && this.allowedMoveTypes.includes(args[0] as Type)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}

/**
 * Gives money to the user after the battle.
 *
 * @extends PostBattleAbAttr
 * @see {@linkcode applyPostBattle}
 */
export class MoneyAbAttr extends PostBattleAbAttr {
  constructor() {
    super();
  }

  /**
   * @param _pokemon {@linkcode Pokemon} that is the user of this ability.
   * @param _passive N/A
   * @param args - `[0]`: boolean for if the battle ended in a victory
   * @returns `true` if successful
   */
  override applyPostBattle(_pokemon: Pokemon, _passive: boolean, simulated: boolean, args: any[]): boolean {
    if (!simulated && args[0]) {
      globalScene.currentBattle.moneyScattered += globalScene.getWaveMoneyAmount(0.2);
      return true;
    }
    return false;
  }
}

/**
 * Applies a stat change after a Pokémon is summoned,
 * conditioned on the presence of a specific arena tag.
 *
 * @extends PostSummonStatStageChangeAbAttr
 */
export class PostSummonStatStageChangeOnArenaAbAttr extends PostSummonStatStageChangeAbAttr {
  /**
   * The type of arena tag that conditions the stat change.
   * @private
   */
  private tagType: ArenaTagType;

  /**
   * Creates an instance of PostSummonStatStageChangeOnArenaAbAttr.
   * Initializes the stat change to increase Attack by 1 stage if the specified arena tag is present.
   *
   * @param {ArenaTagType} tagType - The type of arena tag to check for.
   */
  constructor(tagType: ArenaTagType) {
    super([Stat.ATK], 1, true, false);
    this.tagType = tagType;
  }

  /**
   * Applies the post-summon stat change if the specified arena tag is present on pokemon's side.
   * This is used in Wind Rider ability.
   *
   * @param {Pokemon} pokemon - The Pokémon being summoned.
   * @param {boolean} passive - Whether the effect is passive.
   * @param {any[]} args - Additional arguments.
   * @returns {boolean} - Returns true if the stat change was applied, otherwise false.
   */
  override applyPostSummon(pokemon: Pokemon, passive: boolean, simulated: boolean, args: any[]): boolean {
    const side = pokemon.isPlayer() ? ArenaTagSide.PLAYER : ArenaTagSide.ENEMY;

    if (globalScene.arena.getTagOnSide(this.tagType, side)) {
      return super.applyPostSummon(pokemon, passive, simulated, args);
    }
    return false;
  }
}

/**
 * Takes no damage from the first hit of a damaging move.
 * This is used in the Disguise and Ice Face abilities.
 * @extends ReceivedMoveDamageMultiplierAbAttr
 */
export class FormBlockDamageAbAttr extends ReceivedMoveDamageMultiplierAbAttr {
  private multiplier: number;
  private tagType: BattlerTagType;
  private recoilDamageFunc?: (pokemon: Pokemon) => number;
  private triggerMessageFunc: (pokemon: Pokemon, abilityName: string) => string;

  constructor(
    condition: PokemonDefendCondition,
    multiplier: number,
    tagType: BattlerTagType,
    triggerMessageFunc: (pokemon: Pokemon, abilityName: string) => string,
    recoilDamageFunc?: (pokemon: Pokemon) => number,
  ) {
    super(condition, multiplier);

    this.multiplier = multiplier;
    this.tagType = tagType;
    this.recoilDamageFunc = recoilDamageFunc;
    this.triggerMessageFunc = triggerMessageFunc;
  }

  /**
   * Applies the pre-defense ability to the Pokémon.
   * Removes the appropriate `BattlerTagType` when hit by an attack and is in its defense form.
   *
   * @param pokemon The Pokémon with the ability.
   * @param _passive n/a
   * @param attacker The attacking Pokémon.
   * @param move The move being used.
   * @param _cancelled n/a
   * @param args Additional arguments.
   * @returns `true` if the immunity was applied.
   */
  override applyPreDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (this.condition(pokemon, attacker, move) && !move.hitsSubstitute(attacker, pokemon)) {
      if (!simulated) {
        (args[0] as NumberHolder).value = this.multiplier;
        pokemon.removeTag(this.tagType);
        if (this.recoilDamageFunc) {
          pokemon.damageAndUpdate(this.recoilDamageFunc(pokemon), HitResult.OTHER, false, false, true, true);
        }
      }
      return true;
    }

    return false;
  }

  /**
   * Gets the message triggered when the Pokémon avoids damage using the form-changing ability.
   * @param pokemon The Pokémon with the ability.
   * @param abilityName The name of the ability.
   * @param _args n/a
   * @returns The trigger message.
   */
  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return this.triggerMessageFunc(pokemon, abilityName);
  }
}

/**
 * If a Pokémon with this Ability selects a damaging move, it has a 30% chance of going first in its priority bracket. If the Ability activates, this is announced at the start of the turn (after move selection).
 *
 * @extends AbAttr
 */
export class BypassSpeedChanceAbAttr extends AbAttr {
  public chance: integer;

  /**
   * @param {integer} chance probability of ability being active.
   */
  constructor(chance: integer) {
    super(true);
    this.chance = chance;
  }

  /**
   * bypass move order in their priority bracket when pokemon choose damaging move
   * @param {Pokemon} pokemon {@linkcode Pokemon}  the Pokemon applying this ability
   * @param {boolean} _passive N/A
   * @param {BooleanHolder} _cancelled N/A
   * @param {any[]} args [0] {@linkcode BooleanHolder} set to true when the ability activated
   * @returns {boolean} - whether the ability was activated.
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (simulated) {
      return false;
    }
    const bypassSpeed = args[0] as BooleanHolder;

    if (!bypassSpeed.value && pokemon.randSeedInt(100) < this.chance) {
      const turnCommand = globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
      const isCommandFight = turnCommand?.command === Command.FIGHT;
      const move = turnCommand?.move?.move ? allMoves[turnCommand.move.move] : null;
      const isDamageMove = move?.category === MoveCategory.PHYSICAL || move?.category === MoveCategory.SPECIAL;

      if (isCommandFight && isDamageMove) {
        bypassSpeed.value = true;
        return true;
      }
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:quickDraw", { pokemonName: getPokemonNameWithAffix(pokemon) });
  }
}

/**
 * This attribute checks if a Pokemon's move meets a provided condition to determine if the Pokemon can use Quick Claw
 * It was created because Pokemon with the ability Mycelium Might cannot access Quick Claw's benefits when using status moves.
 */
export class PreventBypassSpeedChanceAbAttr extends AbAttr {
  private condition: (pokemon: Pokemon, move: Move) => boolean;

  /**
   * @param {function} condition - checks if a move meets certain conditions
   */
  constructor(condition: (pokemon: Pokemon, move: Move) => boolean) {
    super(true);
    this.condition = condition;
  }

  /**
   * @argument {boolean} bypassSpeed - determines if a Pokemon is able to bypass speed at the moment
   * @argument {boolean} canCheckHeldItems - determines if a Pokemon has access to Quick Claw's effects or not
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const bypassSpeed = args[0] as BooleanHolder;
    const canCheckHeldItems = args[1] as BooleanHolder;

    const turnCommand = globalScene.currentBattle.turnCommands[pokemon.getBattlerIndex()];
    const isCommandFight = turnCommand?.command === Command.FIGHT;
    const move = turnCommand?.move?.move ? allMoves[turnCommand.move.move] : null;
    if (this.condition(pokemon, move!) && isCommandFight) {
      bypassSpeed.value = false;
      canCheckHeldItems.value = false;
      return false;
    }
    return true;
  }
}

/**
 * This applies a terrain-based type change to the Pokemon.
 * Used by Mimicry.
 */
export class TerrainEventTypeChangeAbAttr extends PostSummonAbAttr {
  constructor() {
    super(true);
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (pokemon.isTerastallized()) {
      return false;
    }
    const currentTerrain = globalScene.arena.getTerrainType();
    const typeChange: Type[] = this.determineTypeChange(pokemon, currentTerrain);
    if (typeChange.length !== 0) {
      if (pokemon.summonData.addedType && typeChange.includes(pokemon.summonData.addedType)) {
        pokemon.summonData.addedType = null;
      }
      pokemon.summonData.types = typeChange;
      pokemon.updateInfo();
    }
    return true;
  }

  /**
   * Retrieves the type(s) the Pokemon should change to in response to a terrain
   * @param pokemon
   * @param currentTerrain {@linkcode TerrainType}
   * @returns a list of type(s)
   */
  private determineTypeChange(pokemon: Pokemon, currentTerrain: TerrainType): Type[] {
    const typeChange: Type[] = [];
    switch (currentTerrain) {
      case TerrainType.ELECTRIC:
        typeChange.push(Type.ELECTRIC);
        break;
      case TerrainType.MISTY:
        typeChange.push(Type.FAIRY);
        break;
      case TerrainType.GRASSY:
        typeChange.push(Type.GRASS);
        break;
      case TerrainType.PSYCHIC:
        typeChange.push(Type.PSYCHIC);
        break;
      default:
        pokemon.getTypes(false, false, true).forEach((t) => {
          typeChange.push(t);
        });
        break;
    }
    return typeChange;
  }

  /**
   * Checks if the Pokemon should change types if summoned into an active terrain
   * @returns `true` if there is an active terrain requiring a type change | `false` if not
   */
  override applyPostSummon(pokemon: Pokemon, passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (globalScene.arena.getTerrainType() !== TerrainType.NONE) {
      return this.apply(pokemon, passive, simulated, new BooleanHolder(false), []);
    }
    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]) {
    const currentTerrain = globalScene.arena.getTerrainType();
    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);
    if (currentTerrain === TerrainType.NONE) {
      return i18next.t("abilityTriggers:pokemonTypeChangeRevert", { pokemonNameWithAffix });
    } else {
      const moveType = i18next.t(`pokemonInfo:Type.${Type[this.determineTypeChange(pokemon, currentTerrain)[0]]}`);
      return i18next.t("abilityTriggers:pokemonTypeChange", { pokemonNameWithAffix, moveType });
    }
  }
}

class ForceSwitchOutHelper {
  constructor(private switchType: SwitchType) {}

  /**
   * Handles the logic for switching out a Pokémon based on battle conditions, HP, and the switch type.
   *
   * @param pokemon The {@linkcode Pokemon} attempting to switch out.
   * @returns `true` if the switch is successful
   */
  public switchOutLogic(pokemon: Pokemon): boolean {
    const switchOutTarget = pokemon;
    /**
     * If the switch-out target is a player-controlled Pokémon, the function checks:
     * - Whether there are available party members to switch in.
     * - If the Pokémon is still alive (hp > 0), and if so, it leaves the field and a new SwitchPhase is initiated.
     */
    if (switchOutTarget instanceof PlayerPokemon) {
      if (globalScene.getPlayerParty().filter((p) => p.isAllowedInBattle() && !p.isOnField()).length < 1) {
        return false;
      }

      if (switchOutTarget.hp > 0) {
        switchOutTarget.leaveField(this.switchType === SwitchType.SWITCH);
        globalScene.prependToPhase(
          new SwitchPhase(this.switchType, switchOutTarget.getFieldIndex(), true, true),
          MoveEndPhase,
        );
        return true;
      }
      /**
       * For non-wild battles, it checks if the opposing party has any available Pokémon to switch in.
       * If yes, the Pokémon leaves the field and a new SwitchSummonPhase is initiated.
       */
    } else if (globalScene.currentBattle.battleType !== BattleType.WILD) {
      if (globalScene.getEnemyParty().filter((p) => p.isAllowedInBattle() && !p.isOnField()).length < 1) {
        return false;
      }
      if (switchOutTarget.hp > 0) {
        switchOutTarget.leaveField(this.switchType === SwitchType.SWITCH);
        const summonIndex = globalScene.currentBattle.trainer
          ? globalScene.currentBattle.trainer.getNextSummonIndex((switchOutTarget as EnemyPokemon).trainerSlot)
          : 0;
        globalScene.prependToPhase(
          new SwitchSummonPhase(this.switchType, switchOutTarget.getFieldIndex(), summonIndex, false, false),
          MoveEndPhase,
        );
        return true;
      }
      /**
       * For wild Pokémon battles, the Pokémon will flee if the conditions are met (waveIndex and double battles).
       * It will not flee if it is a Mystery Encounter with fleeing disabled (checked in `getSwitchOutCondition()`) or if it is a wave 10x wild boss
       */
    } else {
      if (!globalScene.currentBattle.waveIndex || globalScene.currentBattle.waveIndex % 10 === 0) {
        return false;
      }

      if (switchOutTarget.hp > 0) {
        switchOutTarget.leaveField(false);
        globalScene.queueMessage(
          i18next.t("moveTriggers:fled", { pokemonName: getPokemonNameWithAffix(switchOutTarget) }),
          null,
          true,
          500,
        );

        if (globalScene.currentBattle.double) {
          const allyPokemon = switchOutTarget.getAlly();
          globalScene.redirectPokemonMoves(switchOutTarget, allyPokemon);
        }
      }

      if (!switchOutTarget.getAlly()?.isActive(true)) {
        globalScene.clearEnemyHeldItemModifiers();

        if (switchOutTarget.hp) {
          globalScene.pushPhase(new BattleEndPhase(false));
          globalScene.pushPhase(new NewBattlePhase());
        }
      }
    }
    return false;
  }

  /**
   * Determines if a Pokémon can switch out based on its status, the opponent's status, and battle conditions.
   *
   * @param pokemon The Pokémon attempting to switch out.
   * @param opponent The opponent Pokémon.
   * @returns `true` if the switch-out condition is met
   */
  public getSwitchOutCondition(pokemon: Pokemon, opponent: Pokemon): boolean {
    const switchOutTarget = pokemon;
    const player = switchOutTarget instanceof PlayerPokemon;

    if (player) {
      const blockedByAbility = new BooleanHolder(false);
      applyAbAttrs(ForceSwitchOutImmunityAbAttr, opponent, blockedByAbility);
      return !blockedByAbility.value;
    }

    if (!player && globalScene.currentBattle.battleType === BattleType.WILD) {
      if (!globalScene.currentBattle.waveIndex && globalScene.currentBattle.waveIndex % 10 === 0) {
        return false;
      }
    }

    if (
      !player
      && globalScene.currentBattle.isBattleMysteryEncounter()
      && !globalScene.currentBattle.mysteryEncounter?.fleeAllowed
    ) {
      return false;
    }

    const party = player ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
    return (
      (!player && globalScene.currentBattle.battleType === BattleType.WILD)
      || party.filter(
        (p) =>
          p.isAllowedInBattle()
          && (player || (p as EnemyPokemon).trainerSlot === (switchOutTarget as EnemyPokemon).trainerSlot),
      ).length > globalScene.currentBattle.getBattlerCount()
    );
  }

  /**
   * Returns a message if the switch-out attempt fails due to ability effects.
   *
   * @param target The target Pokémon.
   * @returns The failure message, or `null` if no failure.
   */
  public getFailedText(target: Pokemon): string | null {
    const blockedByAbility = new BooleanHolder(false);
    applyAbAttrs(ForceSwitchOutImmunityAbAttr, target, blockedByAbility);
    return blockedByAbility.value
      ? i18next.t("moveTriggers:cannotBeSwitchedOut", { pokemonName: getPokemonNameWithAffix(target) })
      : null;
  }
}

/**
 * Calculates the amount of recovery from the Shell Bell item.
 *
 * If the Pokémon is holding a Shell Bell, this function computes the amount of health
 * recovered based on the damage dealt in the current turn. The recovery is multiplied by the
 * Shell Bell's modifier (if any).
 *
 * @param pokemon - The Pokémon whose Shell Bell recovery is being calculated.
 * @returns The amount of health recovered by Shell Bell.
 */
function calculateShellBellRecovery(pokemon: Pokemon): number {
  const shellBellModifier = pokemon.getHeldItems().find((m) => m instanceof HitHealModifier);
  if (shellBellModifier) {
    return toDmgValue(pokemon.turnData.totalDamageDealt / 8) * shellBellModifier.stackCount;
  }
  return 0;
}

/**
 * Ability attribute for forcing a Pokémon to switch out after its health drops below half.
 * This attribute checks various conditions related to the damage received, the moves used by the Pokémon
 * and its opponents, and determines whether a forced switch-out should occur.
 *
 * Used by Wimp Out and Emergency Exit
 *
 * @extends PostDamageAbAttr
 * @see {@linkcode applyPostDamage}
 */
export class PostDamageForceSwitchAbAttr extends PostDamageAbAttr {
  private helper: ForceSwitchOutHelper = new ForceSwitchOutHelper(SwitchType.SWITCH);
  private hpRatio: number;

  constructor(hpRatio: number = 0.5) {
    super();
    this.hpRatio = hpRatio;
  }

  /**
   * Applies the switch-out logic after the Pokémon takes damage.
   * Checks various conditions based on the moves used by the Pokémon, the opponents' moves, and
   * the Pokémon's health after damage to determine whether the switch-out should occur.
   *
   * @param pokemon The Pokémon that took damage.
   * @param damage The amount of damage taken by the Pokémon.
   * @param _passive N/A
   * @param _simulated Whether the ability is being simulated.
   * @param _args N/A
   * @param source The Pokemon that dealt damage
   * @returns `true` if the switch-out logic was successfully applied
   */
  public override applyPostDamage(
    pokemon: Pokemon,
    damage: number,
    _passive: boolean,
    _simulated: boolean,
    _args: any[],
    source?: Pokemon,
  ): boolean {
    const moveHistory = pokemon.getMoveHistory();
    // Will not activate when the Pokémon's HP is lowered by cutting its own HP
    const fordbiddenAttackingMoves = [Moves.BELLY_DRUM, Moves.SUBSTITUTE, Moves.CURSE, Moves.PAIN_SPLIT];
    if (moveHistory.length > 0) {
      const lastMoveUsed = moveHistory[moveHistory.length - 1];
      if (fordbiddenAttackingMoves.includes(lastMoveUsed.move)) {
        return false;
      }
    }

    // Dragon Tail and Circle Throw switch out Pokémon before the Ability activates.
    const fordbiddenDefendingMoves = [Moves.DRAGON_TAIL, Moves.CIRCLE_THROW];
    if (source) {
      const enemyMoveHistory = source.getMoveHistory();
      if (enemyMoveHistory.length > 0) {
        const enemyLastMoveUsed = enemyMoveHistory[enemyMoveHistory.length - 1];
        // Will not activate if the Pokémon's HP falls below half while it is in the air during Sky Drop.
        if (
          fordbiddenDefendingMoves.includes(enemyLastMoveUsed.move)
          || (enemyLastMoveUsed.move === Moves.SKY_DROP && enemyLastMoveUsed.result === MoveResult.OTHER)
        ) {
          return false;
          // Will not activate if the Pokémon's HP falls below half by a move affected by Sheer Force.
        } else if (allMoves[enemyLastMoveUsed.move].chance >= 0 && source.hasAbility(Abilities.SHEER_FORCE)) {
          return false;
          // Activate only after the last hit of multistrike moves
        } else if (source.turnData.hitsLeft > 1) {
          return false;
        }
        if (source.turnData.hitCount > 1) {
          damage = pokemon.turnData.damageTaken;
        }
      }
    }

    if (pokemon.hp + damage >= pokemon.getMaxHp() * this.hpRatio) {
      // Activates if it falls below half and recovers back above half from a Shell Bell
      const shellBellHeal = calculateShellBellRecovery(pokemon);
      if (pokemon.hp - shellBellHeal < pokemon.getMaxHp() * this.hpRatio) {
        for (const opponent of pokemon.getOpponents()) {
          if (!this.helper.getSwitchOutCondition(pokemon, opponent)) {
            return false;
          }
        }
        return this.helper.switchOutLogic(pokemon);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  public getFailedText(_user: Pokemon, target: Pokemon, _move: Move, _cancelled: BooleanHolder): string | null {
    return this.helper.getFailedText(target);
  }
}

function applyAbAttrsInternal<TAttr extends AbAttr>(
  attrType: Constructor<TAttr>,
  pokemon: Pokemon | null,
  applyFunc: AbAttrApplyFunc<TAttr>,
  args: any[],
  showAbilityInstant: boolean = false,
  simulated: boolean = false,
  messages: string[] = [],
): void {
  for (const passive of [false, true]) {
    if (!pokemon?.canApplyAbility(passive) || (passive && pokemon.getPassiveAbility().id === pokemon.getAbility().id)) {
      continue;
    }

    const ability = passive ? pokemon.getPassiveAbility() : pokemon.getAbility();
    for (const attr of ability.getAttrs(attrType)) {
      const condition = attr.getCondition();
      if (condition && !condition(pokemon)) {
        continue;
      }

      globalScene.setPhaseQueueSplice();

      const result = applyFunc(attr, passive);
      if (result) {
        if (pokemon.summonData && !pokemon.summonData.abilitiesApplied.includes(ability.id)) {
          pokemon.summonData.abilitiesApplied.push(ability.id);
        }
        if (pokemon.battleData && !simulated && !pokemon.battleData.abilitiesApplied.includes(ability.id)) {
          pokemon.battleData.abilitiesApplied.push(ability.id);
        }
        if (attr.showAbility && !simulated) {
          if (showAbilityInstant) {
            globalScene.abilityBar.showAbility(pokemon, passive);
          } else {
            queueShowAbility(pokemon, passive);
          }
        }
        const message = attr.getTriggerMessage(pokemon, ability.name, args);
        if (message) {
          if (!simulated) {
            globalScene.queueMessage(message);
          }
          messages.push(message);
        }
      }
    }
    globalScene.clearPhaseQueueSplice();
  }
}

export function applyAbAttrs(
  attrType: Constructor<AbAttr>,
  pokemon: Pokemon,
  cancelled: BooleanHolder | null,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<AbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.apply(pokemon, passive, simulated, cancelled, args),
    args,
    false,
    simulated,
  );
}

export function applyPostBattleInitAbAttrs(
  attrType: Constructor<PostBattleInitAbAttr>,
  pokemon: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostBattleInitAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostBattleInit(pokemon, passive, simulated, args),
    args,
    false,
    simulated,
  );
}

export function applyPreDefendAbAttrs(
  attrType: Constructor<PreDefendAbAttr>,
  pokemon: Pokemon,
  attacker: Pokemon,
  move: Move | null,
  cancelled: BooleanHolder | null,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PreDefendAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPreDefend(pokemon, passive, simulated, attacker, move, cancelled, args),
    args,
    false,
    simulated,
  );
}

export function applyPostDefendAbAttrs(
  attrType: Constructor<PostDefendAbAttr>,
  pokemon: Pokemon,
  attacker: Pokemon,
  move: Move,
  hitResult: HitResult | null,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostDefendAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostDefend(pokemon, passive, simulated, attacker, move, hitResult, args),
    args,
    false,
    simulated,
  );
}

export function applyPostMoveUsedAbAttrs(
  attrType: Constructor<PostMoveUsedAbAttr>,
  pokemon: Pokemon,
  move: PokemonMove,
  source: Pokemon,
  targets: BattlerIndex[],
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostMoveUsedAbAttr>(
    attrType,
    pokemon,
    (attr, _passive) => attr.applyPostMoveUsed(pokemon, move, source, targets, simulated, args),
    args,
    false,
    simulated,
  );
}

export function applyStatMultiplierAbAttrs(
  attrType: Constructor<StatMultiplierAbAttr>,
  pokemon: Pokemon,
  stat: BattleStat,
  statValue: NumberHolder,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<StatMultiplierAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyStatStage(pokemon, passive, simulated, stat, statValue, args),
    args,
  );
}
export function applyPostSetStatusAbAttrs(
  attrType: Constructor<PostSetStatusAbAttr>,
  pokemon: Pokemon,
  effect: StatusEffect,
  sourcePokemon?: Pokemon | null,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostSetStatusAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostSetStatus(pokemon, sourcePokemon, passive, effect, simulated, args),
    args,
    false,
    simulated,
  );
}

export function applyPostDamageAbAttrs(
  attrType: Constructor<PostDamageAbAttr>,
  pokemon: Pokemon,
  damage: number,
  _passive: boolean,
  simulated: boolean = false,
  args: any[],
  source?: Pokemon,
): void {
  applyAbAttrsInternal<PostDamageAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostDamage(pokemon, damage, passive, simulated, args, source),
    args,
  );
}

/**
 * Applies a field Stat multiplier attribute
 * @param attrType {@linkcode FieldMultiplyStatAbAttr} should always be FieldMultiplyBattleStatAbAttr for the time being
 * @param pokemon {@linkcode Pokemon} the Pokemon applying this ability
 * @param stat {@linkcode Stat} the type of the checked stat
 * @param statValue {@linkcode NumberHolder} the value of the checked stat
 * @param checkedPokemon {@linkcode Pokemon} the Pokemon with the checked stat
 * @param hasApplied {@linkcode BooleanHolder} whether or not a FieldMultiplyBattleStatAbAttr has already affected this stat
 * @param args unused
 */
export function applyFieldStatMultiplierAbAttrs(
  attrType: Constructor<FieldMultiplyStatAbAttr>,
  pokemon: Pokemon,
  stat: Stat,
  statValue: NumberHolder,
  checkedPokemon: Pokemon,
  hasApplied: BooleanHolder,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<FieldMultiplyStatAbAttr>(
    attrType,
    pokemon,
    (attr, passive) =>
      attr.applyFieldStat(pokemon, passive, simulated, stat, statValue, checkedPokemon, hasApplied, args),
    args,
  );
}

export function applyPreAttackAbAttrs(
  attrType: Constructor<PreAttackAbAttr>,
  pokemon: Pokemon,
  defender: Pokemon | null,
  move: Move,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PreAttackAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPreAttack(pokemon, passive, simulated, defender, move, args),
    args,
    false,
    simulated,
  );
}

export function applyPostAttackAbAttrs(
  attrType: Constructor<PostAttackAbAttr>,
  pokemon: Pokemon,
  defender: Pokemon,
  move: Move,
  hitResult: HitResult | null,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostAttackAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostAttack(pokemon, passive, simulated, defender, move, hitResult, args),
    args,
    false,
    simulated,
  );
}

export function applyPostKnockOutAbAttrs(
  attrType: Constructor<PostKnockOutAbAttr>,
  pokemon: Pokemon,
  knockedOut: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostKnockOutAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostKnockOut(pokemon, passive, simulated, knockedOut, args),
    args,
    false,
    simulated,
  );
}

export function applyPostVictoryAbAttrs(
  attrType: Constructor<PostVictoryAbAttr>,
  pokemon: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostVictoryAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostVictory(pokemon, passive, simulated, args),
    args,
    false,
    simulated,
  );
}

export function applyPostSummonAbAttrs(
  attrType: Constructor<PostSummonAbAttr>,
  pokemon: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostSummonAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostSummon(pokemon, passive, simulated, args),
    args,
    false,
    simulated,
  );
}

export function applyPreSwitchOutAbAttrs(
  attrType: Constructor<PreSwitchOutAbAttr>,
  pokemon: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PreSwitchOutAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPreSwitchOut(pokemon, passive, simulated, args),
    args,
    true,
    simulated,
  );
}

export function applyPreStatStageChangeAbAttrs(
  attrType: Constructor<PreStatStageChangeAbAttr>,
  pokemon: Pokemon | null,
  stat: BattleStat,
  cancelled: BooleanHolder,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PreStatStageChangeAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPreStatStageChange(pokemon, passive, simulated, stat, cancelled, args),
    args,
    false,
    simulated,
  );
}

export function applyPostStatStageChangeAbAttrs(
  attrType: Constructor<PostStatStageChangeAbAttr>,
  pokemon: Pokemon,
  stats: BattleStat[],
  stages: integer,
  selfTarget: boolean,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostStatStageChangeAbAttr>(
    attrType,
    pokemon,
    (attr, _passive) => attr.applyPostStatStageChange(pokemon, simulated, stats, stages, selfTarget, args),
    args,
    false,
    simulated,
  );
}

export function applyPreSetStatusAbAttrs(
  attrType: Constructor<PreSetStatusAbAttr>,
  pokemon: Pokemon,
  effect: StatusEffect | undefined,
  cancelled: BooleanHolder,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PreSetStatusAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPreSetStatus(pokemon, passive, simulated, effect, cancelled, args),
    args,
    false,
    simulated,
  );
}

export function applyPreApplyBattlerTagAbAttrs(
  attrType: Constructor<PreApplyBattlerTagAbAttr>,
  pokemon: Pokemon,
  tag: BattlerTag,
  cancelled: BooleanHolder,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PreApplyBattlerTagAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPreApplyBattlerTag(pokemon, passive, simulated, tag, cancelled, args),
    args,
    false,
    simulated,
  );
}

export function applyPreWeatherEffectAbAttrs(
  attrType: Constructor<PreWeatherEffectAbAttr>,
  pokemon: Pokemon,
  weather: Weather | null,
  cancelled: BooleanHolder,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PreWeatherDamageAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPreWeatherEffect(pokemon, passive, simulated, weather, cancelled, args),
    args,
    true,
    simulated,
  );
}

export function applyPostTurnAbAttrs(
  attrType: Constructor<PostTurnAbAttr>,
  pokemon: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostTurnAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostTurn(pokemon, passive, simulated, args),
    args,
    false,
    simulated,
  );
}

export function applyPostWeatherChangeAbAttrs(
  attrType: Constructor<PostWeatherChangeAbAttr>,
  pokemon: Pokemon,
  weather: WeatherType,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostWeatherChangeAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostWeatherChange(pokemon, passive, simulated, weather, args),
    args,
    false,
    simulated,
  );
}

export function applyPostWeatherLapseAbAttrs(
  attrType: Constructor<PostWeatherLapseAbAttr>,
  pokemon: Pokemon,
  weather: Weather | null,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostWeatherLapseAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostWeatherLapse(pokemon, passive, simulated, weather, args),
    args,
    false,
    simulated,
  );
}

export function applyPostTerrainChangeAbAttrs(
  attrType: Constructor<PostTerrainChangeAbAttr>,
  pokemon: Pokemon,
  terrain: TerrainType,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostTerrainChangeAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostTerrainChange(pokemon, passive, simulated, terrain, args),
    args,
    false,
    simulated,
  );
}

export function applyCheckTrappedAbAttrs(
  attrType: Constructor<CheckTrappedAbAttr>,
  pokemon: Pokemon,
  trapped: BooleanHolder,
  otherPokemon: Pokemon,
  messages: string[],
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<CheckTrappedAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyCheckTrapped(pokemon, passive, simulated, trapped, otherPokemon, args),
    args,
    false,
    simulated,
    messages,
  );
}

export function applyPostBattleAbAttrs(
  attrType: Constructor<PostBattleAbAttr>,
  pokemon: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostBattleAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostBattle(pokemon, passive, simulated, args),
    args,
    false,
    simulated,
  );
}

export function applyPostFaintAbAttrs(
  attrType: Constructor<PostFaintAbAttr>,
  pokemon: Pokemon,
  attacker?: Pokemon,
  move?: Move,
  hitResult?: HitResult,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostFaintAbAttr>(
    attrType,
    pokemon,
    (attr, passive) => attr.applyPostFaint(pokemon, passive, simulated, attacker, move, hitResult, args),
    args,
    false,
    simulated,
  );
}

export function applyPostItemLostAbAttrs(
  attrType: Constructor<PostItemLostAbAttr>,
  pokemon: Pokemon,
  simulated: boolean = false,
  ...args: any[]
): void {
  applyAbAttrsInternal<PostItemLostAbAttr>(
    attrType,
    pokemon,
    (attr, _passive) => attr.applyPostItemLost(pokemon, simulated, args),
    args,
  );
}

export function queueShowAbility(pokemon: Pokemon, passive: boolean): void {
  globalScene.unshiftPhase(new ShowAbilityPhase(pokemon.id, passive));
  globalScene.clearPhaseQueueSplice();
}

/**
 * Returns the Pokemon with weather-based forms
 */
function getPokemonWithWeatherBasedForms() {
  return globalScene
    .getField(true)
    .filter(
      (p) =>
        (p.hasAbility(Abilities.FORECAST) && p.species.speciesId === Species.CASTFORM)
        || (p.hasAbility(Abilities.FLOWER_GIFT) && p.species.speciesId === Species.CHERRIM),
    );
}

export const allAbilities = [new Ability(Abilities.NONE, 3)];
