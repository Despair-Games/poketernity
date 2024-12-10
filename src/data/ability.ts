import type { BattlerIndex } from "#app/battle";
import { BattleType } from "#app/battle";
import { getStatusEffectDescriptor, getStatusEffectHealText } from "#app/data/status-effect";
import type { Weather } from "#app/data/weather";
import { BATTLE_STATS, EFFECTIVE_STATS, getStatKey, Stat, type BattleStat } from "#app/enums/stat";
import { SwitchType } from "#app/enums/switch-type";
import type Pokemon from "#app/field/pokemon";
import type { EnemyPokemon, PokemonMove } from "#app/field/pokemon";
import { HitResult, MoveResult, PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Localizable } from "#app/interfaces/locales";
import { BerryModifierType } from "#app/modifier/modifier-type";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { MovePhase } from "#app/phases/move-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { PokemonTransformPhase } from "#app/phases/pokemon-transform-phase";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { StatStageChangePhase } from "#app/phases/stat-stage-change-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import type { Constructor } from "#app/utils";
import { BooleanHolder, isNullOrUndefined, NumberHolder, randSeedInt, randSeedItem, toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { Moves } from "#enums/moves";
import { PokemonAnimType } from "#enums/pokemon-anim-type";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import { Type } from "#enums/type";
import { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { getPokemonNameWithAffix } from "../messages";
import { BerryModifier, HitHealModifier, PokemonHeldItemModifier } from "../modifier/modifier";
import { Command } from "../ui/command-ui-handler";
import { ArenaTagSide } from "./arena-tag";
import type { BattlerTag } from "./battler-tags";
import { BattlerTagLapseType } from "./battler-tags";
import type Move from "./move";
import {
  allMoves,
  AttackMove,
  MoveCategory,
  MoveFlags,
  MoveTarget,
  OneHitKOAttr,
  SelfStatusMove,
  StatusMove,
} from "./move";
import { getPokeballName } from "./pokeball";
import {
  SpeciesFormChangeManualTrigger,
  SpeciesFormChangeRevertWeatherFormTrigger,
  SpeciesFormChangeWeatherTrigger,
} from "./pokemon-forms";
import { AbAttr } from "./abilities/ab-attr";
import type { PostBattleInitAbAttr } from "./abilities/post-battle-init-ab-attr";
import { PostDamageAbAttr } from "./abilities/post-damage-ab-attr";
import { PostSummonAbAttr } from "./abilities/post-summon-ab-attr";
import type { PreAttackAbAttr } from "./abilities/pre-attack-ab-attr";
import { type PreDefendAbAttr } from "./abilities/pre-defend-ab-attr";
import { ReceivedMoveDamageMultiplierAbAttr } from "./abilities/received-move-damage-multiplier-ab-attr";
import { PostDefendAbAttr } from "./abilities/post-defend-ab-attr";
import type { PostStatStageChangeAbAttr } from "./abilities/post-stat-stage-change-ab-attr";
import { IgnoreMoveEffectsAbAttr } from "./abilities/ignore-move-effect-ab-attr";
import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import { FieldPreventExplosiveMovesAbAttr } from "./abilities/field-prevent-explosive-moves-ab-attr";
import type { FieldMultiplyStatAbAttr } from "./abilities/field-multiply-stat-ab-attr";
import type { PokemonAttackCondition } from "#app/@types/PokemonAttackCondition";
import type { PokemonDefendCondition } from "../@types/PokemonDefendCondition";
import { FieldMovePowerBoostAbAttr } from "./abilities/field-move-power-boost-ab-attr";

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

/**
 * Boosts the power of a specific type of move.
 * @extends FieldMovePowerBoostAbAttr
 */
export class PreAttackFieldMoveTypePowerBoostAbAttr extends FieldMovePowerBoostAbAttr {
  /**
   * @param boostedType - The type of move that will receive the power boost.
   * @param powerMultiplier - The multiplier to apply to the move's power, defaults to 1.5 if not provided.
   */
  constructor(boostedType: Type, powerMultiplier?: number) {
    super((pokemon, _defender, move) => pokemon?.getMoveType(move) === boostedType, powerMultiplier || 1.5);
  }
}

/**
 * Boosts the power of a specific type of move for all Pokemon in the field.
 * @extends PreAttackFieldMoveTypePowerBoostAbAttr
 */
export class FieldMoveTypePowerBoostAbAttr extends PreAttackFieldMoveTypePowerBoostAbAttr {}

/**
 * Boosts the power of a specific type of move for the user and its allies.
 * @extends PreAttackFieldMoveTypePowerBoostAbAttr
 */
export class UserFieldMoveTypePowerBoostAbAttr extends PreAttackFieldMoveTypePowerBoostAbAttr {}

/**
 * Boosts the power of moves in specified categories.
 * @extends FieldMovePowerBoostAbAttr
 */
export class AllyMoveCategoryPowerBoostAbAttr extends FieldMovePowerBoostAbAttr {
  /**
   * @param boostedCategories - The categories of moves that will receive the power boost.
   * @param powerMultiplier - The multiplier to apply to the move's power.
   */
  constructor(boostedCategories: MoveCategory[], powerMultiplier: number) {
    super((_pokemon, _defender, move) => boostedCategories.includes(move.category), powerMultiplier);
  }
}

export class StatMultiplierAbAttr extends AbAttr {
  private stat: BattleStat;
  private multiplier: number;
  private condition: PokemonAttackCondition | null;

  constructor(stat: BattleStat, multiplier: number, condition?: PokemonAttackCondition) {
    super(false);

    this.stat = stat;
    this.multiplier = multiplier;
    this.condition = condition ?? null;
  }

  applyStatStage(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    args: any[],
  ): boolean {
    const move = args[0] as Move;
    if (stat === this.stat && (!this.condition || this.condition(pokemon, null, move))) {
      statValue.value *= this.multiplier;
      return true;
    }

    return false;
  }
}

export class PostAttackAbAttr extends AbAttr {
  private attackCondition: PokemonAttackCondition;

  /** The default attackCondition requires that the selected move is a damaging move */
  constructor(
    attackCondition: PokemonAttackCondition = (_user, _target, move) => move.category !== MoveCategory.STATUS,
    showAbility: boolean = true,
  ) {
    super(showAbility);

    this.attackCondition = attackCondition;
  }

  /**
   * Please override {@link applyPostAttackAfterMoveTypeCheck} instead of this method. By default, this method checks that the move used is a damaging attack before
   * applying the effect of any inherited class. This can be changed by providing a different {@link attackCondition} to the constructor. See {@link ConfusionOnStatusEffectAbAttr}
   * for an example of an effect that does not require a damaging move.
   */
  applyPostAttack(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    hitResult: HitResult | null,
    args: any[],
  ): boolean {
    // When attackRequired is true, we require the move to be an attack move and to deal damage before checking secondary requirements.
    // If attackRequired is false, we always defer to the secondary requirements.
    if (this.attackCondition(pokemon, defender, move)) {
      return this.applyPostAttackAfterMoveTypeCheck(pokemon, passive, simulated, defender, move, hitResult, args);
    } else {
      return false;
    }
  }

  /**
   * This method is only called after {@link applyPostAttack} has already been applied. Use this for handling checks specific to the ability in question.
   */
  applyPostAttackAfterMoveTypeCheck(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    _hitResult: HitResult | null,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * Ability attribute for Gorilla Tactics
 * @extends PostAttackAbAttr
 */
export class GorillaTacticsAbAttr extends PostAttackAbAttr {
  constructor() {
    super((_user, _target, _move) => true, false);
  }

  /**
   *
   * @param {Pokemon} pokemon the {@linkcode Pokemon} with this ability
   * @param _passive n/a
   * @param simulated whether the ability is being simulated
   * @param _defender n/a
   * @param _move n/a
   * @param _hitResult n/a
   * @param _args n/a
   * @returns `true` if the ability is applied
   */
  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _defender: Pokemon,
    _move: Move,
    _hitResult: HitResult | null,
    _args: any[],
  ): boolean {
    if (simulated) {
      return simulated;
    }

    if (pokemon.getTag(BattlerTagType.GORILLA_TACTICS)) {
      return false;
    }

    pokemon.addTag(BattlerTagType.GORILLA_TACTICS);
    return true;
  }
}

export class PostAttackStealHeldItemAbAttr extends PostAttackAbAttr {
  private stealCondition: PokemonAttackCondition | null;

  constructor(stealCondition?: PokemonAttackCondition) {
    super();

    this.stealCondition = stealCondition ?? null;
  }

  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      !simulated
      && hitResult < HitResult.NO_EFFECT
      && (!this.stealCondition || this.stealCondition(pokemon, defender, move))
    ) {
      const heldItems = this.getTargetHeldItems(defender).filter((i) => i.isTransferable);
      if (heldItems.length) {
        const stolenItem = heldItems[pokemon.randSeedInt(heldItems.length)];
        if (globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
          globalScene.queueMessage(
            i18next.t("abilityTriggers:postAttackStealHeldItem", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              defenderName: defender.name,
              stolenItemType: stolenItem.type.name,
            }),
          );
          return true;
        }
      }
    }
    return false;
  }

  getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return globalScene.findModifiers(
      (m) => m instanceof PokemonHeldItemModifier && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }
}

export class PostAttackApplyStatusEffectAbAttr extends PostAttackAbAttr {
  private contactRequired: boolean;
  private chance: integer;
  private effects: StatusEffect[];

  constructor(contactRequired: boolean, chance: integer, ...effects: StatusEffect[]) {
    super();

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (pokemon !== attacker && move.hitsSubstitute(attacker, pokemon)) {
      return false;
    }

    /**Status inflicted by abilities post attacking are also considered additional effects.*/
    if (
      !attacker.hasAbilityWithAttr(IgnoreMoveEffectsAbAttr)
      && !simulated
      && pokemon !== attacker
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, pokemon))
      && pokemon.randSeedInt(100) < this.chance
      && !pokemon.status
    ) {
      const effect =
        this.effects.length === 1 ? this.effects[0] : this.effects[pokemon.randSeedInt(this.effects.length)];
      return attacker.trySetStatus(effect, true, pokemon);
    }

    return simulated;
  }
}

export class PostAttackContactApplyStatusEffectAbAttr extends PostAttackApplyStatusEffectAbAttr {
  constructor(chance: integer, ...effects: StatusEffect[]) {
    super(true, chance, ...effects);
  }
}

/**
 * Ability attribute that applies a battler tag to the target after an attack
 * Abilities using this attribute:
 * - Stench
 */
export class PostAttackApplyBattlerTagAbAttr extends PostAttackAbAttr {
  private contactRequired: boolean;
  private chance: (user: Pokemon, target: Pokemon, move: Move) => number;
  private effects: BattlerTagType[];

  constructor(
    contactRequired: boolean,
    chance: (user: Pokemon, target: Pokemon, move: Move) => number,
    ...effects: BattlerTagType[]
  ) {
    super();

    this.contactRequired = contactRequired;
    this.chance = chance;
    this.effects = effects;
  }

  override applyPostAttackAfterMoveTypeCheck(
    attacker: Pokemon,
    _passive: boolean,
    simulated: boolean,
    target: Pokemon,
    move: Move,
    _hitResult: HitResult,
    _args: any[],
  ): boolean {
    /**
     * The battler tag is only applied to the target if
     * - The attacker does not have a secondary ability that suppresses move effects
     * - The target is not the attacker
     * - If a contact move is required to activate the ability, the move should make contact
     * - If the target is behind a substitute, the move must be able to bypass the substitute
     * - The game rolls successfully based on the chance
     *
     * Note: Battler tags inflicted by abilities post attacking are also considered additional effects of moves.
     */
    if (
      !attacker.hasAbilityWithAttr(IgnoreMoveEffectsAbAttr)
      && target.id !== attacker.id
      && (!this.contactRequired || move.checkFlag(MoveFlags.MAKES_CONTACT, attacker, target))
      && (target.getTag(BattlerTagType.SUBSTITUTE) ? move.hitsSubstitute(attacker, target) : true)
      && target.randSeedInt(100) < this.getChance(attacker, target, move)
    ) {
      const effect =
        this.effects.length === 1 ? this.effects[0] : this.effects[target.randSeedInt(this.effects.length)];
      return simulated || attacker.addTag(effect);
    }
    return false;
  }

  /**
   * Calculates the ability's activation chance based on the conditional stored in this.chance
   */
  getChance(attacker: Pokemon, target: Pokemon, move: Move): number {
    return this.chance(attacker, target, move);
  }
}

export class PostDefendStealHeldItemAbAttr extends PostDefendAbAttr {
  private condition?: PokemonDefendCondition;

  constructor(condition?: PokemonDefendCondition) {
    super();

    this.condition = condition;
  }

  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (
      !simulated
      && hitResult < HitResult.NO_EFFECT
      && (!this.condition || this.condition(pokemon, attacker, move))
      && !move.hitsSubstitute(attacker, pokemon)
    ) {
      const heldItems = this.getTargetHeldItems(attacker).filter((i) => i.isTransferable);
      if (heldItems.length) {
        const stolenItem = heldItems[pokemon.randSeedInt(heldItems.length)];
        if (globalScene.tryTransferHeldItemModifier(stolenItem, pokemon, false)) {
          globalScene.queueMessage(
            i18next.t("abilityTriggers:postDefendStealHeldItem", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              attackerName: attacker.name,
              stolenItemType: stolenItem.type.name,
            }),
          );
          return true;
        }
      }
    }
    return false;
  }

  getTargetHeldItems(target: Pokemon): PokemonHeldItemModifier[] {
    return globalScene.findModifiers(
      (m) => m instanceof PokemonHeldItemModifier && m.pokemonId === target.id,
      target.isPlayer(),
    ) as PokemonHeldItemModifier[];
  }
}

/**
 * Base class for defining all {@linkcode Ability} Attributes after a status effect has been set.
 * @see {@linkcode applyPostSetStatus()}.
 */
export class PostSetStatusAbAttr extends AbAttr {
  /**
   * Does nothing after a status condition is set.
   * @param _pokemon {@linkcode Pokemon} that status condition was set on.
   * @param _sourcePokemon {@linkcode Pokemon} that that set the status condition. Is `null` if status was not set by a Pokemon.
   * @param _passive Whether this ability is a passive.
   * @param _effect {@linkcode StatusEffect} that was set.
   * @param _args Set of unique arguments needed by this attribute.
   * @returns `true` if application of the ability succeeds.
   */
  applyPostSetStatus(
    _pokemon: Pokemon,
    _sourcePokemon: Pokemon | null = null,
    _passive: boolean,
    _effect: StatusEffect,
    _simulated: boolean,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * If another Pokemon burns, paralyzes, poisons, or badly poisons this Pokemon,
 * that Pokemon receives the same non-volatile status condition as part of this
 * ability attribute. For Synchronize ability.
 */
export class SynchronizeStatusAbAttr extends PostSetStatusAbAttr {
  /**
   * If the `StatusEffect` that was set is Burn, Paralysis, Poison, or Toxic, and the status
   * was set by a source Pokemon, set the source Pokemon's status to the same `StatusEffect`.
   * @param pokemon {@linkcode Pokemon} that status condition was set on.
   * @param sourcePokemon {@linkcode Pokemon} that that set the status condition. Is null if status was not set by a Pokemon.
   * @param _passive Whether this ability is a passive.
   * @param effect {@linkcode StatusEffect} that was set.
   * @param _args Set of unique arguments needed by this attribute.
   * @returns `true` if application of the ability succeeds.
   */
  override applyPostSetStatus(
    pokemon: Pokemon,
    sourcePokemon: Pokemon | null = null,
    _passive: boolean,
    effect: StatusEffect,
    simulated: boolean,
    _args: any[],
  ): boolean {
    /** Synchronizable statuses */
    const syncStatuses = new Set<StatusEffect>([
      StatusEffect.BURN,
      StatusEffect.PARALYSIS,
      StatusEffect.POISON,
      StatusEffect.TOXIC,
    ]);

    if (sourcePokemon && syncStatuses.has(effect)) {
      if (!simulated) {
        sourcePokemon.trySetStatus(effect, true, pokemon);
      }
      return true;
    }

    return false;
  }
}

export class PostVictoryAbAttr extends AbAttr {
  applyPostVictory(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}

export class PostVictoryStatStageChangeAbAttr extends PostVictoryAbAttr {
  private stat: BattleStat | ((p: Pokemon) => BattleStat);
  private stages: number;

  constructor(stat: BattleStat | ((p: Pokemon) => BattleStat), stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  override applyPostVictory(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const stat = typeof this.stat === "function" ? this.stat(pokemon) : this.stat;
    if (!simulated) {
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [stat], this.stages));
    }
    return true;
  }
}

export class PostVictoryFormChangeAbAttr extends PostVictoryAbAttr {
  private formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override applyPostVictory(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex) {
      if (!simulated) {
        globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
      }
      return true;
    }

    return false;
  }
}

export class PostKnockOutAbAttr extends AbAttr {
  applyPostKnockOut(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _knockedOut: Pokemon,
    _args: any[],
  ): boolean {
    return false;
  }
}

export class PostKnockOutStatStageChangeAbAttr extends PostKnockOutAbAttr {
  private stat: BattleStat | ((p: Pokemon) => BattleStat);
  private stages: number;

  constructor(stat: BattleStat | ((p: Pokemon) => BattleStat), stages: number) {
    super();

    this.stat = stat;
    this.stages = stages;
  }

  override applyPostKnockOut(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _knockedOut: Pokemon,
    _args: any[],
  ): boolean {
    const stat = typeof this.stat === "function" ? this.stat(pokemon) : this.stat;
    if (!simulated) {
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [stat], this.stages));
    }
    return true;
  }
}

export class CopyFaintedAllyAbilityAbAttr extends PostKnockOutAbAttr {
  constructor() {
    super();
  }

  override applyPostKnockOut(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    knockedOut: Pokemon,
    _args: any[],
  ): boolean {
    if (pokemon.isPlayer() === knockedOut.isPlayer() && !knockedOut.getAbility().hasAttr(UncopiableAbilityAbAttr)) {
      if (!simulated) {
        pokemon.summonData.ability = knockedOut.getAbility().id;
        globalScene.queueMessage(
          i18next.t("abilityTriggers:copyFaintedAllyAbility", {
            pokemonNameWithAffix: getPokemonNameWithAffix(knockedOut),
            abilityName: allAbilities[knockedOut.getAbility().id].name,
          }),
        );
      }
      return true;
    }

    return false;
  }
}

/**
 * Ability attribute for ignoring the opponent's stat changes
 * @param stats the stats that should be ignored
 */
export class IgnoreOpponentStatStagesAbAttr extends AbAttr {
  private stats: readonly BattleStat[];

  constructor(stats?: BattleStat[]) {
    super(false);

    this.stats = stats ?? BATTLE_STATS;
  }

  /**
   * Modifies a BooleanHolder and returns the result to see if a stat is ignored or not
   * @param _pokemon n/a
   * @param _passive n/a
   * @param _simulated n/a
   * @param _cancelled n/a
   * @param args A BooleanHolder that represents whether or not to ignore a stat's stat changes
   * @returns true if the stat is ignored, false otherwise
   */
  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _cancelled: BooleanHolder, args: any[]) {
    if (this.stats.includes(args[0])) {
      (args[1] as BooleanHolder).value = true;
      return true;
    }
    return false;
  }
}

export class IntimidateImmunityAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

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

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:intimidateImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}

export class PostIntimidateStatStageChangeAbAttr extends AbAttr {
  private stats: BattleStat[];
  private stages: number;
  private overwrites: boolean;

  constructor(stats: BattleStat[], stages: number, overwrites?: boolean) {
    super(true);
    this.stats = stats;
    this.stages = stages;
    this.overwrites = !!overwrites;
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (!simulated) {
      globalScene.pushPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), false, this.stats, this.stages));
    }
    cancelled.value = this.overwrites;
    return true;
  }
}

/**
 * Removes specified arena tags when a Pokemon is summoned.
 */
export class PostSummonRemoveArenaTagAbAttr extends PostSummonAbAttr {
  private arenaTags: ArenaTagType[];

  /**
   * @param arenaTags {@linkcode ArenaTagType[]} - the arena tags to be removed
   */
  constructor(arenaTags: ArenaTagType[]) {
    super(true);

    this.arenaTags = arenaTags;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      for (const arenaTag of this.arenaTags) {
        globalScene.arena.removeTag(arenaTag);
      }
    }
    return true;
  }
}

export class PostSummonMessageAbAttr extends PostSummonAbAttr {
  private messageFunc: (pokemon: Pokemon) => string;

  constructor(messageFunc: (pokemon: Pokemon) => string) {
    super(true);

    this.messageFunc = messageFunc;
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      globalScene.queueMessage(this.messageFunc(pokemon));
    }

    return true;
  }
}

export class PostSummonUnnamedMessageAbAttr extends PostSummonAbAttr {
  //Attr doesn't force pokemon name on the message
  private message: string;

  constructor(message: string) {
    super(true);

    this.message = message;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      globalScene.queueMessage(this.message);
    }

    return true;
  }
}

export class PostSummonAddBattlerTagAbAttr extends PostSummonAbAttr {
  private tagType: BattlerTagType;
  private turnCount: integer;

  constructor(tagType: BattlerTagType, turnCount: integer, showAbility?: boolean) {
    super(showAbility);

    this.tagType = tagType;
    this.turnCount = turnCount;
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    } else {
      return pokemon.addTag(this.tagType, this.turnCount);
    }
  }
}

export class PostSummonStatStageChangeAbAttr extends PostSummonAbAttr {
  private stats: BattleStat[];
  private stages: number;
  private selfTarget: boolean;
  private intimidate: boolean;

  constructor(stats: BattleStat[], stages: number, selfTarget?: boolean, intimidate?: boolean) {
    super(false);

    this.stats = stats;
    this.stages = stages;
    this.selfTarget = !!selfTarget;
    this.intimidate = !!intimidate;
  }

  override applyPostSummon(pokemon: Pokemon, passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return true;
    }

    queueShowAbility(pokemon, passive); // TODO: Better solution than manually showing the ability here
    if (this.selfTarget) {
      // we unshift the StatStageChangePhase to put it right after the showAbility and not at the end of the
      // phase list (which could be after CommandPhase for example)
      globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, this.stats, this.stages));
      return true;
    }
    for (const opponent of pokemon.getOpponents()) {
      const cancelled = new BooleanHolder(false);
      if (this.intimidate) {
        applyAbAttrs(IntimidateImmunityAbAttr, opponent, cancelled, simulated);
        applyAbAttrs(PostIntimidateStatStageChangeAbAttr, opponent, cancelled, simulated);

        if (opponent.getTag(BattlerTagType.SUBSTITUTE)) {
          cancelled.value = true;
        }
      }
      if (!cancelled.value) {
        globalScene.unshiftPhase(new StatStageChangePhase(opponent.getBattlerIndex(), false, this.stats, this.stages));
      }
    }
    return true;
  }
}

export class PostSummonAllyHealAbAttr extends PostSummonAbAttr {
  private healRatio: number;
  private showAnim: boolean;

  constructor(healRatio: number, showAnim: boolean = false) {
    super();

    this.healRatio = healRatio || 4;
    this.showAnim = showAnim;
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const target = pokemon.getAlly();
    if (target?.isActive(true)) {
      if (!simulated) {
        globalScene.unshiftPhase(
          new PokemonHealPhase(
            target.getBattlerIndex(),
            toDmgValue(pokemon.getMaxHp() / this.healRatio),
            i18next.t("abilityTriggers:postSummonAllyHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(target),
              pokemonName: pokemon.name,
            }),
            true,
            !this.showAnim,
          ),
        );
      }

      return true;
    }

    return false;
  }
}

/**
 * Resets an ally's temporary stat boots to zero with no regard to
 * whether this is a positive or negative change
 * @param pokemon The {@link Pokemon} with this {@link AbAttr}
 * @param passive N/A
 * @param args N/A
 * @returns if the move was successful
 */
export class PostSummonClearAllyStatStagesAbAttr extends PostSummonAbAttr {
  constructor() {
    super();
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const target = pokemon.getAlly();
    if (target?.isActive(true)) {
      if (!simulated) {
        for (const s of BATTLE_STATS) {
          target.setStatStage(s, 0);
        }

        globalScene.queueMessage(
          i18next.t("abilityTriggers:postSummonClearAllyStats", {
            pokemonNameWithAffix: getPokemonNameWithAffix(target),
          }),
        );
      }

      return true;
    }

    return false;
  }
}

/**
 * Download raises either the Attack stat or Special Attack stat by one stage depending on the foe's currently lowest defensive stat:
 * it will raise Attack if the foe's current Defense is lower than its current Special Defense stat;
 * otherwise, it will raise Special Attack.
 * @extends PostSummonAbAttr
 * @see {applyPostSummon}
 */
export class DownloadAbAttr extends PostSummonAbAttr {
  private enemyDef: integer;
  private enemySpDef: integer;
  private enemyCountTally: integer;
  private stats: BattleStat[];

  /**
   * Checks to see if it is the opening turn (starting a new game), if so, Download won't work. This is because Download takes into account
   * vitamins and items, so it needs to use the Stat and the stat alone.
   * @param {Pokemon} pokemon Pokemon that is using the move, as well as seeing the opposing pokemon.
   * @param {boolean} _passive N/A
   * @param {any[]} _args N/A
   * @returns Returns true if ability is used successful, false if not.
   */
  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    this.enemyDef = 0;
    this.enemySpDef = 0;
    this.enemyCountTally = 0;

    for (const opponent of pokemon.getOpponents()) {
      this.enemyCountTally++;
      this.enemyDef += opponent.getEffectiveStat(Stat.DEF);
      this.enemySpDef += opponent.getEffectiveStat(Stat.SPDEF);
    }
    this.enemyDef = Math.round(this.enemyDef / this.enemyCountTally);
    this.enemySpDef = Math.round(this.enemySpDef / this.enemyCountTally);

    if (this.enemyDef < this.enemySpDef) {
      this.stats = [Stat.ATK];
    } else {
      this.stats = [Stat.SPATK];
    }

    if (this.enemyDef > 0 && this.enemySpDef > 0) {
      // only activate if there's actually an enemy to download from
      if (!simulated) {
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), false, this.stats, 1));
      }
      return true;
    }

    return false;
  }
}

export class PostSummonWeatherChangeAbAttr extends PostSummonAbAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (
      this.weatherType === WeatherType.HEAVY_RAIN
      || this.weatherType === WeatherType.HARSH_SUN
      || this.weatherType === WeatherType.STRONG_WINDS
      || !globalScene.arena.weather?.isImmutable()
    ) {
      if (simulated) {
        return globalScene.arena.weather?.weatherType !== this.weatherType;
      } else {
        return globalScene.arena.trySetWeather(this.weatherType, true);
      }
    }

    return false;
  }
}

export class PostSummonTerrainChangeAbAttr extends PostSummonAbAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return globalScene.arena.terrain?.terrainType !== this.terrainType;
    } else {
      return globalScene.arena.trySetTerrain(this.terrainType, true);
    }
  }
}

export class PostSummonFormChangeAbAttr extends PostSummonAbAttr {
  private formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex) {
      return simulated || globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }

    return false;
  }
}

/** Attempts to copy a pokemon's ability */
export class PostSummonCopyAbilityAbAttr extends PostSummonAbAttr {
  private target: Pokemon;
  private targetAbilityName: string;

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const targets = pokemon.getOpponents();
    if (!targets.length) {
      return false;
    }

    let target: Pokemon;
    if (targets.length > 1) {
      globalScene.executeWithSeedOffset(() => (target = randSeedItem(targets)), globalScene.currentBattle.waveIndex);
    } else {
      target = targets[0];
    }

    if (
      target!.getAbility().hasAttr(UncopiableAbilityAbAttr)
      // Wonder Guard is normally uncopiable so has the attribute, but Trace specifically can copy it
      && !(pokemon.hasAbility(Abilities.TRACE) && target!.getAbility().id === Abilities.WONDER_GUARD)
    ) {
      return false;
    }

    if (!simulated) {
      this.target = target!;
      this.targetAbilityName = allAbilities[target!.getAbility().id].name;
      pokemon.summonData.ability = target!.getAbility().id;
      setAbilityRevealed(target!);
      pokemon.updateInfo();
    }

    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:trace", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      targetName: getPokemonNameWithAffix(this.target),
      abilityName: this.targetAbilityName,
    });
  }
}

/**
 * Removes supplied status effects from the user's field.
 */
export class PostSummonUserFieldRemoveStatusEffectAbAttr extends PostSummonAbAttr {
  private statusEffect: StatusEffect[];

  /**
   * @param statusEffect - The status effects to be removed from the user's field.
   */
  constructor(...statusEffect: StatusEffect[]) {
    super(false);

    this.statusEffect = statusEffect;
  }

  /**
   * Removes supplied status effect from the user's field when user of the ability is summoned.
   *
   * @param pokemon - The Pokémon that triggered the ability.
   * @param _passive - n/a
   * @param _args - n/a
   * @returns A boolean or a promise that resolves to a boolean indicating the result of the ability application.
   */
  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const party = pokemon instanceof PlayerPokemon ? globalScene.getPlayerField() : globalScene.getEnemyField();
    const allowedParty = party.filter((p) => p.isAllowedInBattle());

    if (allowedParty.length < 1) {
      return false;
    }

    if (!simulated) {
      for (const pokemon of allowedParty) {
        if (pokemon.status && this.statusEffect.includes(pokemon.status.effect)) {
          globalScene.queueMessage(getStatusEffectHealText(pokemon.status.effect, getPokemonNameWithAffix(pokemon)));
          pokemon.resetStatus(false);
          pokemon.updateInfo();
        }
      }
    }
    return true;
  }
}

/** Attempt to copy the stat changes on an ally pokemon */
export class PostSummonCopyAllyStatsAbAttr extends PostSummonAbAttr {
  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!globalScene.currentBattle.double) {
      return false;
    }

    const ally = pokemon.getAlly();
    if (!ally || ally.getStatStages().every((s) => s === 0)) {
      return false;
    }

    if (!simulated) {
      for (const s of BATTLE_STATS) {
        pokemon.setStatStage(s, ally.getStatStage(s));
      }
      pokemon.updateInfo();
    }

    return true;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:costar", {
      pokemonName: getPokemonNameWithAffix(pokemon),
      allyName: getPokemonNameWithAffix(pokemon.getAlly()),
    });
  }
}

/**
 * Used by Imposter
 */
export class PostSummonTransformAbAttr extends PostSummonAbAttr {
  constructor() {
    super(true);
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const targets = pokemon.getOpponents();
    if (simulated || !targets.length) {
      return simulated;
    }

    let target: Pokemon;
    if (targets.length > 1) {
      globalScene.executeWithSeedOffset(() => {
        // in a double battle, if one of the opposing pokemon is fused the other one will be chosen
        // if both are fused, then Imposter will fail below
        if (targets[0].fusionSpecies) {
          target = targets[1];
          return;
        } else if (targets[1].fusionSpecies) {
          target = targets[0];
          return;
        }
        target = randSeedItem(targets);
      }, globalScene.currentBattle.waveIndex);
    } else {
      target = targets[0];
    }
    target = target!;

    // transforming from or into fusion pokemon causes various problems (including crashes and save corruption)
    if (target.fusionSpecies || pokemon.fusionSpecies) {
      return false;
    }

    globalScene.unshiftPhase(new PokemonTransformPhase(pokemon.getBattlerIndex(), target.getBattlerIndex(), true));

    globalScene.queueMessage(
      i18next.t("abilityTriggers:postSummonTransform", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        targetName: target.name,
      }),
    );

    return true;
  }
}

/**
 * Reverts weather-based forms to their normal forms when the user is summoned.
 * Used by Cloud Nine and Air Lock.
 * @extends PostSummonAbAttr
 */
export class PostSummonWeatherSuppressedFormChangeAbAttr extends PostSummonAbAttr {
  /**
   * Triggers {@linkcode Arena.triggerWeatherBasedFormChangesToNormal | triggerWeatherBasedFormChangesToNormal}
   * @param {Pokemon} _pokemon the Pokemon with this ability
   * @param _passive n/a
   * @param _args n/a
   * @returns whether a Pokemon was reverted to its normal form
   */
  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]) {
    const pokemonToTransform = getPokemonWithWeatherBasedForms();

    if (pokemonToTransform.length < 1) {
      return false;
    }

    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChangesToNormal();
    }

    return true;
  }
}

/**
 * Triggers weather-based form change when summoned into an active weather.
 * Used by Forecast and Flower Gift.
 * @extends PostSummonAbAttr
 */
export class PostSummonFormChangeByWeatherAbAttr extends PostSummonAbAttr {
  private ability: Abilities;

  constructor(ability: Abilities) {
    super(false);

    this.ability = ability;
  }

  /**
   * Calls the {@linkcode BattleScene.triggerPokemonFormChange | triggerPokemonFormChange} for both
   * {@linkcode SpeciesFormChange.SpeciesFormChangeWeatherTrigger | SpeciesFormChangeWeatherTrigger} and
   * {@linkcode SpeciesFormChange.SpeciesFormChangeWeatherTrigger | SpeciesFormChangeRevertWeatherFormTrigger} if it
   * is the specific Pokemon and ability
   * @param {Pokemon} pokemon the Pokemon with this ability
   * @param passive n/a
   * @param _args n/a
   * @returns whether the form change was triggered
   */
  override applyPostSummon(pokemon: Pokemon, passive: boolean, simulated: boolean, _args: any[]): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === Species.CASTFORM && this.ability === Abilities.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === Species.CHERRIM && this.ability === Abilities.FLOWER_GIFT;

    if (isCastformWithForecast || isCherrimWithFlowerGift) {
      if (simulated) {
        return simulated;
      }

      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeWeatherTrigger);
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeRevertWeatherFormTrigger);
      queueShowAbility(pokemon, passive);
      return true;
    }
    return false;
  }
}

/**
 * Attribute implementing the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Commander_(Ability) | Commander}.
 * When the source of an ability with this attribute detects a Dondozo as their active ally, the source "jumps
 * into the Dondozo's mouth," sharply boosting the Dondozo's stats, cancelling the source's moves, and
 * causing attacks that target the source to always miss.
 */
export class CommanderAbAttr extends AbAttr {
  constructor() {
    super(true);
  }

  override apply(pokemon: Pokemon, _passive: boolean, simulated: boolean, _cancelled: null, _args: any[]): boolean {
    // TODO: Should this work with X + Dondozo fusions?
    if (globalScene.currentBattle?.double && pokemon.getAlly()?.species.speciesId === Species.DONDOZO) {
      // If the ally Dondozo is fainted or was previously "commanded" by
      // another Pokemon, this effect cannot apply.
      if (pokemon.getAlly().isFainted() || pokemon.getAlly().getTag(BattlerTagType.COMMANDED)) {
        return false;
      }

      if (!simulated) {
        // Lapse the source's semi-invulnerable tags (to avoid visual inconsistencies)
        pokemon.lapseTags(BattlerTagLapseType.MOVE_EFFECT);
        // Play an animation of the source jumping into the ally Dondozo's mouth
        globalScene.triggerPokemonBattleAnim(pokemon, PokemonAnimType.COMMANDER_APPLY);
        // Apply boosts from this effect to the ally Dondozo
        pokemon.getAlly().addTag(BattlerTagType.COMMANDED, 0, Moves.NONE, pokemon.id);
        // Cancel the source Pokemon's next move (if a move is queued)
        globalScene.tryRemovePhase((phase) => phase instanceof MovePhase && phase.pokemon === pokemon);
      }
      return true;
    }
    return false;
  }
}

export class PreSwitchOutAbAttr extends AbAttr {
  constructor() {
    super(true);
  }

  applyPreSwitchOut(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}

export class PreSwitchOutResetStatusAbAttr extends PreSwitchOutAbAttr {
  override applyPreSwitchOut(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (pokemon.status) {
      if (!simulated) {
        pokemon.resetStatus();
        pokemon.updateInfo();
      }

      return true;
    }

    return false;
  }
}

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon switching out.
 */
export class PreSwitchOutClearWeatherAbAttr extends PreSwitchOutAbAttr {
  /**
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param _passive N/A
   * @param _args N/A
   * @returns {boolean} Returns true if the weather clears, otherwise false.
   */
  override applyPreSwitchOut(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const weatherType = globalScene.arena.weather?.weatherType;
    let turnOffWeather = false;

    // Clear weather only if user's ability matches the weather and no other pokemon has the ability.
    switch (weatherType) {
      case WeatherType.HARSH_SUN:
        if (
          pokemon.hasAbility(Abilities.DESOLATE_LAND)
          && globalScene
            .getField(true)
            .filter((p) => p !== pokemon)
            .filter((p) => p.hasAbility(Abilities.DESOLATE_LAND)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
      case WeatherType.HEAVY_RAIN:
        if (
          pokemon.hasAbility(Abilities.PRIMORDIAL_SEA)
          && globalScene
            .getField(true)
            .filter((p) => p !== pokemon)
            .filter((p) => p.hasAbility(Abilities.PRIMORDIAL_SEA)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
      case WeatherType.STRONG_WINDS:
        if (
          pokemon.hasAbility(Abilities.DELTA_STREAM)
          && globalScene
            .getField(true)
            .filter((p) => p !== pokemon)
            .filter((p) => p.hasAbility(Abilities.DELTA_STREAM)).length === 0
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

export class PreSwitchOutHealAbAttr extends PreSwitchOutAbAttr {
  override applyPreSwitchOut(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!pokemon.isFullHp()) {
      if (!simulated) {
        const healAmount = toDmgValue(pokemon.getMaxHp() * 0.33);
        pokemon.heal(healAmount);
        pokemon.updateInfo();
      }

      return true;
    }

    return false;
  }
}

/**
 * Attribute for form changes that occur on switching out
 * @extends PreSwitchOutAbAttr
 * @see {@linkcode applyPreSwitchOut}
 */
export class PreSwitchOutFormChangeAbAttr extends PreSwitchOutAbAttr {
  private formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super();

    this.formFunc = formFunc;
  }

  /**
   * On switch out, trigger the form change to the one defined in the ability
   * @param pokemon The pokemon switching out and changing form {@linkcode Pokemon}
   * @param _passive N/A
   * @param _args N/A
   * @returns true if the form change was successful
   */
  override applyPreSwitchOut(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex) {
      if (!simulated) {
        globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
      }
      return true;
    }

    return false;
  }
}

export class PreStatStageChangeAbAttr extends AbAttr {
  applyPreStatStageChange(
    _pokemon: Pokemon | null,
    _passive: boolean,
    _simulated: boolean,
    _stat: BattleStat,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * Protect one or all {@linkcode BattleStat} from reductions caused by other Pokémon's moves and Abilities
 */
export class ProtectStatAbAttr extends PreStatStageChangeAbAttr {
  /** {@linkcode BattleStat} to protect or `undefined` if **all** {@linkcode BattleStat} are protected */
  private protectedStat?: BattleStat;

  constructor(protectedStat?: BattleStat) {
    super();

    this.protectedStat = protectedStat;
  }

  /**
   * Apply the {@linkcode ProtectedStatAbAttr} to an interaction
   * @param _pokemon
   * @param _passive
   * @param simulated
   * @param stat the {@linkcode BattleStat} being affected
   * @param cancelled The {@linkcode BooleanHolder} that will be set to true if the stat is protected
   * @param _args
   * @returns true if the stat is protected, false otherwise
   */
  override applyPreStatStageChange(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    stat: BattleStat,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (isNullOrUndefined(this.protectedStat) || stat === this.protectedStat) {
      cancelled.value = true;
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:protectStat", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      statName: this.protectedStat ? i18next.t(getStatKey(this.protectedStat)) : i18next.t("battle:stats"),
    });
  }
}

/**
 * This attribute applies confusion to the target whenever the user
 * directly poisons them with a move, e.g. Poison Puppeteer.
 * Called in {@linkcode StatusEffectAttr}.
 * @extends PostAttackAbAttr
 * @see {@linkcode applyPostAttack}
 */
export class ConfusionOnStatusEffectAbAttr extends PostAttackAbAttr {
  /** List of effects to apply confusion after */
  private effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    /** This effect does not require a damaging move */
    super((_user, _target, _move) => true);
    this.effects = effects;
  }
  /**
   * Applies confusion to the target pokemon.
   * @param pokemon {@link Pokemon} attacking
   * @param _passive N/A
   * @param defender {@link Pokemon} defending
   * @param move {@link Move} used to apply status effect and confusion
   * @param _hitResult N/A
   * @param args [0] {@linkcode StatusEffect} applied by move
   * @returns true if defender is confused
   */
  override applyPostAttackAfterMoveTypeCheck(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    defender: Pokemon,
    move: Move,
    _hitResult: HitResult,
    args: any[],
  ): boolean {
    if (this.effects.indexOf(args[0]) > -1 && !defender.isFainted()) {
      if (simulated) {
        return defender.canAddTag(BattlerTagType.CONFUSED);
      } else {
        return defender.addTag(BattlerTagType.CONFUSED, pokemon.randSeedIntRange(2, 5), move.id, defender.id);
      }
    }
    return false;
  }
}

export class PreSetStatusAbAttr extends AbAttr {
  applyPreSetStatus(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _effect: StatusEffect | undefined,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * Provides immunity to status effects to specified targets.
 */
export class PreSetStatusEffectImmunityAbAttr extends PreSetStatusAbAttr {
  private immuneEffects: StatusEffect[];

  /**
   * @param immuneEffects - The status effects to which the Pokémon is immune.
   */
  constructor(...immuneEffects: StatusEffect[]) {
    super();

    this.immuneEffects = immuneEffects;
  }

  /**
   * Applies immunity to supplied status effects.
   *
   * @param _pokemon - The Pokémon to which the status is being applied.
   * @param _passive - n/a
   * @param effect - The status effect being applied.
   * @param cancelled - A holder for a boolean value indicating if the status application was cancelled.
   * @param _args - n/a
   * @returns A boolean indicating the result of the status application.
   */
  override applyPreSetStatus(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    effect: StatusEffect,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (this.immuneEffects.length < 1 || this.immuneEffects.includes(effect)) {
      cancelled.value = true;
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ...args: any[]): string {
    return this.immuneEffects.length
      ? i18next.t("abilityTriggers:statusEffectImmunityWithName", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
          statusEffectName: getStatusEffectDescriptor(args[0] as StatusEffect),
        })
      : i18next.t("abilityTriggers:statusEffectImmunity", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        });
  }
}

/**
 * Provides immunity to status effects to the user.
 * @extends PreSetStatusEffectImmunityAbAttr
 */
export class StatusEffectImmunityAbAttr extends PreSetStatusEffectImmunityAbAttr {}

/**
 * Provides immunity to status effects to the user's field.
 * @extends PreSetStatusEffectImmunityAbAttr
 */
export class UserFieldStatusEffectImmunityAbAttr extends PreSetStatusEffectImmunityAbAttr {}

export class PreApplyBattlerTagAbAttr extends AbAttr {
  applyPreApplyBattlerTag(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _tag: BattlerTag,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to specified targets.
 */
export class PreApplyBattlerTagImmunityAbAttr extends PreApplyBattlerTagAbAttr {
  private immuneTagTypes: BattlerTagType[];
  private battlerTag: BattlerTag;

  constructor(immuneTagTypes: BattlerTagType | BattlerTagType[]) {
    super();

    this.immuneTagTypes = Array.isArray(immuneTagTypes) ? immuneTagTypes : [immuneTagTypes];
  }

  override applyPreApplyBattlerTag(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    tag: BattlerTag,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (this.immuneTagTypes.includes(tag.tagType)) {
      cancelled.value = true;
      if (!simulated) {
        this.battlerTag = tag;
      }
      return true;
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:battlerTagImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      battlerTagName: this.battlerTag.getDescriptor(),
    });
  }
}

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to the user.
 * @extends PreApplyBattlerTagImmunityAbAttr
 */
export class BattlerTagImmunityAbAttr extends PreApplyBattlerTagImmunityAbAttr {}

/**
 * Provides immunity to BattlerTags {@linkcode BattlerTag} to the user's field.
 * @extends PreApplyBattlerTagImmunityAbAttr
 */
export class UserFieldBattlerTagImmunityAbAttr extends PreApplyBattlerTagImmunityAbAttr {}

/**
 * Provides immunity to critical hits
 * These abilities use this attribute:
 * - Battle Armor
 * - Shell Armor (Identical to Battle Armor in functionality, just has a different name)
 */
export class BlockCritAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as BooleanHolder).value = true;
    return true;
  }
}

export class BonusCritAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as BooleanHolder).value = true;
    return true;
  }
}

export class MultCritAbAttr extends AbAttr {
  public multAmount: number;

  constructor(multAmount: number) {
    super(true);

    this.multAmount = multAmount;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const critMult = args[0] as NumberHolder;
    if (critMult.value > 1) {
      critMult.value *= this.multAmount;
      return true;
    }

    return false;
  }
}

/**
 * Guarantees a critical hit according to the given condition, except if target prevents critical hits. ie. Merciless
 * @extends AbAttr
 * @see {@linkcode apply}
 */
export class ConditionalCritAbAttr extends AbAttr {
  private condition: PokemonAttackCondition;

  constructor(condition: PokemonAttackCondition, _checkUser?: Boolean) {
    super();

    this.condition = condition;
  }

  /**
   * @param pokemon {@linkcode Pokemon} user.
   * @param args [0] {@linkcode BooleanHolder} If true critical hit is guaranteed.
   *             [1] {@linkcode Pokemon} Target.
   *             [2] {@linkcode Move} used by ability user.
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const target = args[1] as Pokemon;
    const move = args[2] as Move;
    if (!this.condition(pokemon, target, move)) {
      return false;
    }

    (args[0] as BooleanHolder).value = true;
    return true;
  }
}

export class BlockNonDirectDamageAbAttr extends AbAttr {
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
 * This attribute will block any status damage that you put in the parameter.
 */
export class BlockStatusDamageAbAttr extends AbAttr {
  private effects: StatusEffect[];

  /**
   * @param {StatusEffect[]} effects The status effect(s) that will be blocked from damaging the ability pokemon
   */
  constructor(...effects: StatusEffect[]) {
    super(false);

    this.effects = effects;
  }

  /**
   * @param {Pokemon} pokemon The pokemon with the ability
   * @param {boolean} _passive N/A
   * @param {BooleanHolder} cancelled Whether to cancel the status damage
   * @param {any[]} _args N/A
   * @returns Returns true if status damage is blocked
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (pokemon.status && this.effects.includes(pokemon.status.effect)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}

export class BlockOneHitKOAbAttr extends AbAttr {
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
 * This governs abilities that alter the priority of moves
 * Abilities: Prankster, Gale Wings, Triage, Mycelium Might, Stall
 * Note - Quick Claw has a separate and distinct implementation outside of priority
 */
export class ChangeMovePriorityAbAttr extends AbAttr {
  private moveFunc: (pokemon: Pokemon, move: Move) => boolean;
  private changeAmount: number;

  /**
   * @param {(pokemon, move) => boolean} moveFunc applies priority-change to moves within a provided category
   * @param {number} changeAmount the amount of priority added or subtracted
   */
  constructor(moveFunc: (pokemon: Pokemon, move: Move) => boolean, changeAmount: number) {
    super(true);

    this.moveFunc = moveFunc;
    this.changeAmount = changeAmount;
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (!this.moveFunc(pokemon, args[0] as Move)) {
      return false;
    }

    (args[1] as NumberHolder).value += this.changeAmount;
    return true;
  }
}

export class IgnoreContactAbAttr extends AbAttr {}

export class PreWeatherEffectAbAttr extends AbAttr {
  applyPreWeatherEffect(
    _pokemon: Pokemon,
    _passive: Boolean,
    _simulated: boolean,
    _weather: Weather | null,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    return false;
  }
}

export class PreWeatherDamageAbAttr extends PreWeatherEffectAbAttr {}

export class BlockWeatherDamageAttr extends PreWeatherDamageAbAttr {
  private weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();

    this.weatherTypes = weatherTypes;
  }

  override applyPreWeatherEffect(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    weather: Weather,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (!this.weatherTypes.length || this.weatherTypes.indexOf(weather?.weatherType) > -1) {
      cancelled.value = true;
    }

    return true;
  }
}

export class SuppressWeatherEffectAbAttr extends PreWeatherEffectAbAttr {
  public affectsImmutable: boolean;

  constructor(affectsImmutable?: boolean) {
    super();

    this.affectsImmutable = !!affectsImmutable;
  }

  override applyPreWeatherEffect(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    weather: Weather,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (this.affectsImmutable || weather.isImmutable()) {
      cancelled.value = true;
      return true;
    }

    return false;
  }
}

function getWeatherCondition(...weatherTypes: WeatherType[]): AbAttrCondition {
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

export class ForewarnAbAttr extends PostSummonAbAttr {
  constructor() {
    super(true);
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    let maxPowerSeen = 0;
    let maxMove = "";
    let movePower = 0;
    for (const opponent of pokemon.getOpponents()) {
      for (const move of opponent.moveset) {
        if (move?.getMove() instanceof StatusMove) {
          movePower = 1;
        } else if (move?.getMove().hasAttr(OneHitKOAttr)) {
          movePower = 150;
        } else if (
          move?.getMove().id === Moves.COUNTER
          || move?.getMove().id === Moves.MIRROR_COAT
          || move?.getMove().id === Moves.METAL_BURST
        ) {
          movePower = 120;
        } else if (move?.getMove().power === -1) {
          movePower = 80;
        } else {
          movePower = move?.getMove().power ?? 0;
        }

        if (movePower > maxPowerSeen) {
          maxPowerSeen = movePower;
          maxMove = move?.getName() ?? "";
        }
      }
    }
    if (!simulated) {
      globalScene.queueMessage(
        i18next.t("abilityTriggers:forewarn", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          moveName: maxMove,
        }),
      );
    }
    return true;
  }
}

export class FriskAbAttr extends PostSummonAbAttr {
  constructor() {
    super(true);
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      for (const opponent of pokemon.getOpponents()) {
        globalScene.queueMessage(
          i18next.t("abilityTriggers:frisk", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            opponentName: opponent.name,
            opponentAbilityName: opponent.getAbility().name,
          }),
        );
        setAbilityRevealed(opponent);
      }
    }
    return true;
  }
}

export class PostWeatherChangeAbAttr extends AbAttr {
  applyPostWeatherChange(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _weather: WeatherType,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * Triggers weather-based form change when weather changes.
 * Used by Forecast and Flower Gift.
 * @extends PostWeatherChangeAbAttr
 */
export class PostWeatherChangeFormChangeAbAttr extends PostWeatherChangeAbAttr {
  private ability: Abilities;
  private formRevertingWeathers: WeatherType[];

  constructor(ability: Abilities, formRevertingWeathers: WeatherType[]) {
    super(false);

    this.ability = ability;
    this.formRevertingWeathers = formRevertingWeathers;
  }

  /**
   * Calls {@linkcode Arena.triggerWeatherBasedFormChangesToNormal | triggerWeatherBasedFormChangesToNormal} when the
   * weather changed to form-reverting weather, otherwise calls {@linkcode Arena.triggerWeatherBasedFormChanges | triggerWeatherBasedFormChanges}
   * @param {Pokemon} pokemon the Pokemon with this ability
   * @param _passive n/a
   * @param _weather n/a
   * @param _args n/a
   * @returns whether the form change was triggered
   */
  override applyPostWeatherChange(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _weather: WeatherType,
    _args: any[],
  ): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === Species.CASTFORM && this.ability === Abilities.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === Species.CHERRIM && this.ability === Abilities.FLOWER_GIFT;

    if (isCastformWithForecast || isCherrimWithFlowerGift) {
      if (simulated) {
        return simulated;
      }

      const weatherType = globalScene.arena.weather?.weatherType;

      if (weatherType && this.formRevertingWeathers.includes(weatherType)) {
        globalScene.arena.triggerWeatherBasedFormChangesToNormal();
      } else {
        globalScene.arena.triggerWeatherBasedFormChanges();
      }
      return true;
    }
    return false;
  }
}

export class PostWeatherChangeAddBattlerTagAttr extends PostWeatherChangeAbAttr {
  private tagType: BattlerTagType;
  private turnCount: integer;
  private weatherTypes: WeatherType[];

  constructor(tagType: BattlerTagType, turnCount: integer, ...weatherTypes: WeatherType[]) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.weatherTypes = weatherTypes;
  }

  override applyPostWeatherChange(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    weather: WeatherType,
    _args: any[],
  ): boolean {
    console.log(
      this.weatherTypes.find((w) => weather === w),
      WeatherType[weather],
    );
    if (!this.weatherTypes.find((w) => weather === w)) {
      return false;
    }

    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    } else {
      return pokemon.addTag(this.tagType, this.turnCount);
    }
  }
}

export class PostWeatherLapseAbAttr extends AbAttr {
  protected weatherTypes: WeatherType[];

  constructor(...weatherTypes: WeatherType[]) {
    super();

    this.weatherTypes = weatherTypes;
  }

  applyPostWeatherLapse(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _weather: Weather | null,
    _args: any[],
  ): boolean {
    return false;
  }

  override getCondition(): AbAttrCondition {
    return getWeatherCondition(...this.weatherTypes);
  }
}

export class PostWeatherLapseHealAbAttr extends PostWeatherLapseAbAttr {
  private healFactor: integer;

  constructor(healFactor: integer, ...weatherTypes: WeatherType[]) {
    super(...weatherTypes);

    this.healFactor = healFactor;
  }

  override applyPostWeatherLapse(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    _weather: Weather,
    _args: any[],
  ): boolean {
    if (!pokemon.isFullHp()) {
      const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
      if (!simulated) {
        globalScene.unshiftPhase(
          new PokemonHealPhase(
            pokemon.getBattlerIndex(),
            toDmgValue(pokemon.getMaxHp() / (16 / this.healFactor)),
            i18next.t("abilityTriggers:postWeatherLapseHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              abilityName,
            }),
            true,
          ),
        );
      }
      return true;
    }

    return false;
  }
}

export class PostWeatherLapseDamageAbAttr extends PostWeatherLapseAbAttr {
  private damageFactor: integer;

  constructor(damageFactor: integer, ...weatherTypes: WeatherType[]) {
    super(...weatherTypes);

    this.damageFactor = damageFactor;
  }

  override applyPostWeatherLapse(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    _weather: Weather,
    _args: any[],
  ): boolean {
    if (pokemon.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)) {
      return false;
    }

    if (!simulated) {
      const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
      globalScene.queueMessage(
        i18next.t("abilityTriggers:postWeatherLapseDamage", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        }),
      );
      pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / (16 / this.damageFactor)), HitResult.OTHER);
    }

    return true;
  }
}

export class PostTerrainChangeAbAttr extends AbAttr {
  applyPostTerrainChange(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _terrain: TerrainType,
    _args: any[],
  ): boolean {
    return false;
  }
}

export class PostTerrainChangeAddBattlerTagAttr extends PostTerrainChangeAbAttr {
  private tagType: BattlerTagType;
  private turnCount: integer;
  private terrainTypes: TerrainType[];

  constructor(tagType: BattlerTagType, turnCount: integer, ...terrainTypes: TerrainType[]) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.terrainTypes = terrainTypes;
  }

  override applyPostTerrainChange(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    terrain: TerrainType,
    _args: any[],
  ): boolean {
    if (!this.terrainTypes.find((t) => t === terrain)) {
      return false;
    }

    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    } else {
      return pokemon.addTag(this.tagType, this.turnCount);
    }
  }
}

export class PostTurnAbAttr extends AbAttr {
  applyPostTurn(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}

/**
 * This attribute will heal 1/8th HP if the ability pokemon has the correct status.
 */
export class PostTurnStatusHealAbAttr extends PostTurnAbAttr {
  private effects: StatusEffect[];

  /**
   * @param {StatusEffect[]} effects The status effect(s) that will qualify healing the ability pokemon
   */
  constructor(...effects: StatusEffect[]) {
    super(false);

    this.effects = effects;
  }

  /**
   * @param {Pokemon} pokemon The pokemon with the ability that will receive the healing
   * @param {Boolean} passive N/A
   * @param {any[]} _args N/A
   * @returns Returns true if healed from status, false if not
   */
  override applyPostTurn(pokemon: Pokemon, passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (pokemon.status && this.effects.includes(pokemon.status.effect)) {
      if (!pokemon.isFullHp()) {
        if (!simulated) {
          const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
          globalScene.unshiftPhase(
            new PokemonHealPhase(
              pokemon.getBattlerIndex(),
              toDmgValue(pokemon.getMaxHp() / 8),
              i18next.t("abilityTriggers:poisonHeal", { pokemonName: getPokemonNameWithAffix(pokemon), abilityName }),
              true,
            ),
          );
        }
        return true;
      }
    }
    return false;
  }
}

/**
 * After the turn ends, resets the status of either the ability holder or their ally
 * @param {boolean} allyTarget Whether to target ally, defaults to false (self-target)
 */
export class PostTurnResetStatusAbAttr extends PostTurnAbAttr {
  private allyTarget: boolean;
  private target: Pokemon;

  constructor(allyTarget: boolean = false) {
    super(true);
    this.allyTarget = allyTarget;
  }

  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (this.allyTarget) {
      this.target = pokemon.getAlly();
    } else {
      this.target = pokemon;
    }
    if (this.target?.status) {
      if (!simulated) {
        globalScene.queueMessage(
          getStatusEffectHealText(this.target.status?.effect, getPokemonNameWithAffix(this.target)),
        );
        this.target.resetStatus(false);
        this.target.updateInfo();
      }

      return true;
    }

    return false;
  }
}

/**
 * After the turn ends, try to create an extra item
 */
export class PostTurnLootAbAttr extends PostTurnAbAttr {
  /**
   * @param itemType - The type of item to create
   * @param procChance - Chance to create an item
   * @see {@linkcode applyPostTurn()}
   */
  constructor(
    /** Extend itemType to add more options */
    private itemType: "EATEN_BERRIES" | "HELD_BERRIES",
    private procChance: (pokemon: Pokemon) => number,
  ) {
    super();
  }

  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const pass = Phaser.Math.RND.realInRange(0, 1);
    // Clamp procChance to [0, 1]. Skip if didn't proc (less than pass)
    if (Math.max(Math.min(this.procChance(pokemon), 1), 0) < pass) {
      return false;
    }

    if (this.itemType === "EATEN_BERRIES") {
      return this.createEatenBerry(pokemon, simulated);
    } else {
      return false;
    }
  }

  /**
   * Create a new berry chosen randomly from the berries the pokemon ate this battle
   * @param pokemon The pokemon with this ability
   * @param simulated whether the associated ability call is simulated
   * @returns whether a new berry was created
   */
  createEatenBerry(pokemon: Pokemon, simulated: boolean): boolean {
    const berriesEaten = pokemon.battleData.berriesEaten;

    if (!berriesEaten.length) {
      return false;
    }

    if (simulated) {
      return true;
    }

    const randomIdx = randSeedInt(berriesEaten.length);
    const chosenBerryType = berriesEaten[randomIdx];
    const chosenBerry = new BerryModifierType(chosenBerryType);
    berriesEaten.splice(randomIdx); // Remove berry from memory

    const berryModifier = globalScene.findModifier(
      (m) => m instanceof BerryModifier && m.berryType === chosenBerryType,
      pokemon.isPlayer(),
    ) as BerryModifier | undefined;

    if (!berryModifier) {
      const newBerry = new BerryModifier(chosenBerry, pokemon.id, chosenBerryType, 1);
      if (pokemon.isPlayer()) {
        globalScene.addModifier(newBerry);
      } else {
        globalScene.addEnemyModifier(newBerry);
      }
    } else if (berryModifier.stackCount < berryModifier.getMaxHeldItemCount(pokemon)) {
      berryModifier.stackCount++;
    }

    globalScene.queueMessage(
      i18next.t("abilityTriggers:postTurnLootCreateEatenBerry", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        berryName: chosenBerry.name,
      }),
    );
    globalScene.updateModifiers(pokemon.isPlayer());

    return true;
  }
}

/**
 * Attribute used for {@linkcode Abilities.MOODY}
 */
export class MoodyAbAttr extends PostTurnAbAttr {
  constructor() {
    super(true);
  }
  /**
   * Randomly increases one stat stage by 2 and decreases a different stat stage by 1
   * @param {Pokemon} pokemon Pokemon that has this ability
   * @param _passive N/A
   * @param simulated true if applying in a simulated call.
   * @param _args N/A
   * @returns true
   *
   * Any stat stages at +6 or -6 are excluded from being increased or decreased, respectively
   * If the pokemon already has all stat stages raised to 6, it will only decrease one stat stage by 1
   * If the pokemon already has all stat stages lowered to -6, it will only increase one stat stage by 2
   */
  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const canRaise = EFFECTIVE_STATS.filter((s) => pokemon.getStatStage(s) < 6);
    let canLower = EFFECTIVE_STATS.filter((s) => pokemon.getStatStage(s) > -6);

    if (!simulated) {
      if (canRaise.length > 0) {
        const raisedStat = canRaise[pokemon.randSeedInt(canRaise.length)];
        canLower = canRaise.filter((s) => s !== raisedStat);
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [raisedStat], 2));
      }
      if (canLower.length > 0) {
        const loweredStat = canLower[pokemon.randSeedInt(canLower.length)];
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [loweredStat], -1));
      }
    }

    return true;
  }
}

export class SpeedBoostAbAttr extends PostTurnAbAttr {
  constructor() {
    super(true);
  }

  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      if (!pokemon.turnData.switchedInThisTurn && !pokemon.turnData.failedRunAway) {
        globalScene.unshiftPhase(new StatStageChangePhase(pokemon.getBattlerIndex(), true, [Stat.SPD], 1));
      } else {
        return false;
      }
    }
    return true;
  }
}

export class PostTurnHealAbAttr extends PostTurnAbAttr {
  override applyPostTurn(pokemon: Pokemon, passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!pokemon.isFullHp()) {
      if (!simulated) {
        const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
        globalScene.unshiftPhase(
          new PokemonHealPhase(
            pokemon.getBattlerIndex(),
            toDmgValue(pokemon.getMaxHp() / 16),
            i18next.t("abilityTriggers:postTurnHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              abilityName,
            }),
            true,
          ),
        );
      }

      return true;
    }

    return false;
  }
}

export class PostTurnFormChangeAbAttr extends PostTurnAbAttr {
  private formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex) {
      if (!simulated) {
        globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
      }

      return true;
    }

    return false;
  }
}

/**
 * Attribute used for abilities (Bad Dreams) that damages the opponents for being asleep
 */
export class PostTurnHurtIfSleepingAbAttr extends PostTurnAbAttr {
  /**
   * Deals damage to all sleeping opponents equal to 1/8 of their max hp (min 1)
   * @param pokemon Pokemon that has this ability
   * @param _passive N/A
   * @param simulated `true` if applying in a simulated call.
   * @param _args N/A
   * @returns `true` if any opponents are sleeping
   */
  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    let hadEffect: boolean = false;
    for (const opp of pokemon.getOpponents()) {
      if (
        (opp.status?.effect === StatusEffect.SLEEP || opp.hasAbility(Abilities.COMATOSE))
        && !opp.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)
        && !opp.switchOutStatus
      ) {
        if (!simulated) {
          opp.damageAndUpdate(toDmgValue(opp.getMaxHp() / 8), HitResult.OTHER);
          globalScene.queueMessage(
            i18next.t("abilityTriggers:badDreams", { pokemonName: getPokemonNameWithAffix(opp) }),
          );
        }
        hadEffect = true;
      }
    }
    return hadEffect;
  }
}

/**
 * Grabs the last failed Pokeball used
 * @extends PostTurnAbAttr
 * @see {@linkcode applyPostTurn} */
export class FetchBallAbAttr extends PostTurnAbAttr {
  constructor() {
    super();
  }
  /**
   * Adds the last used Pokeball back into the player's inventory
   * @param pokemon {@linkcode Pokemon} with this ability
   * @param _passive N/A
   * @param _args N/A
   * @returns true if player has used a pokeball and this pokemon is owned by the player
   */
  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (simulated) {
      return false;
    }
    const lastUsed = globalScene.currentBattle.lastUsedPokeball;
    if (lastUsed !== null && !!pokemon.isPlayer) {
      globalScene.pokeballCounts[lastUsed]++;
      globalScene.currentBattle.lastUsedPokeball = null;
      globalScene.queueMessage(
        i18next.t("abilityTriggers:fetchBall", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          pokeballName: getPokeballName(lastUsed),
        }),
      );
      return true;
    }
    return false;
  }
}

export class PostBiomeChangeAbAttr extends AbAttr {}

export class PostBiomeChangeWeatherChangeAbAttr extends PostBiomeChangeAbAttr {
  private weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (!globalScene.arena.weather?.isImmutable()) {
      if (simulated) {
        return globalScene.arena.weather?.weatherType !== this.weatherType;
      } else {
        return globalScene.arena.trySetWeather(this.weatherType, true);
      }
    }

    return false;
  }
}

export class PostBiomeChangeTerrainChangeAbAttr extends PostBiomeChangeAbAttr {
  private terrainType: TerrainType;

  constructor(terrainType: TerrainType) {
    super();

    this.terrainType = terrainType;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (simulated) {
      return globalScene.arena.terrain?.terrainType !== this.terrainType;
    } else {
      return globalScene.arena.trySetTerrain(this.terrainType, true);
    }
  }
}

/**
 * Triggers just after a move is used either by the opponent or the player
 * @extends AbAttr
 */
export class PostMoveUsedAbAttr extends AbAttr {
  applyPostMoveUsed(
    _pokemon: Pokemon,
    _move: PokemonMove,
    _source: Pokemon,
    _targets: BattlerIndex[],
    _simulated: boolean,
    _args: any[],
  ): boolean {
    return false;
  }
}

/**
 * Triggers after a dance move is used either by the opponent or the player
 * @extends PostMoveUsedAbAttr
 */
export class PostDancingMoveAbAttr extends PostMoveUsedAbAttr {
  /**
   * Resolves the Dancer ability by replicating the move used by the source of the dance
   * either on the source itself or on the target of the dance
   * @param dancer {@linkcode Pokemon} with Dancer ability
   * @param move {@linkcode PokemonMove} Dancing move used by the source
   * @param source {@linkcode Pokemon} that used the dancing move
   * @param targets {@linkcode BattlerIndex}Targets of the dancing move
   * @param _args N/A
   *
   * @return true if the Dancer ability was resolved
   */
  override applyPostMoveUsed(
    dancer: Pokemon,
    move: PokemonMove,
    source: Pokemon,
    targets: BattlerIndex[],
    simulated: boolean,
    _args: any[],
  ): boolean {
    // List of tags that prevent the Dancer from replicating the move
    const forbiddenTags = [
      BattlerTagType.FLYING,
      BattlerTagType.UNDERWATER,
      BattlerTagType.UNDERGROUND,
      BattlerTagType.HIDDEN,
    ];
    // The move to replicate cannot come from the Dancer
    if (
      source.getBattlerIndex() !== dancer.getBattlerIndex()
      && !dancer.summonData.tags.some((tag) => forbiddenTags.includes(tag.tagType))
    ) {
      if (!simulated) {
        // If the move is an AttackMove or a StatusMove the Dancer must replicate the move on the source of the Dance
        if (move.getMove() instanceof AttackMove || move.getMove() instanceof StatusMove) {
          const target = this.getTarget(dancer, source, targets);
          globalScene.unshiftPhase(new MovePhase(dancer, target, move, true, true));
        } else if (move.getMove() instanceof SelfStatusMove) {
          // If the move is a SelfStatusMove (ie. Swords Dance) the Dancer should replicate it on itself
          globalScene.unshiftPhase(new MovePhase(dancer, [dancer.getBattlerIndex()], move, true, true));
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Get the correct targets of Dancer ability
   *
   * @param dancer {@linkcode Pokemon} Pokemon with Dancer ability
   * @param source {@linkcode Pokemon} Source of the dancing move
   * @param targets {@linkcode BattlerIndex} Targets of the dancing move
   */
  getTarget(dancer: Pokemon, source: Pokemon, targets: BattlerIndex[]): BattlerIndex[] {
    if (dancer.isPlayer()) {
      return source.isPlayer() ? targets : [source.getBattlerIndex()];
    }
    return source.isPlayer() ? [source.getBattlerIndex()] : targets;
  }
}

/**
 * Triggers after the Pokemon loses or consumes an item
 * @extends AbAttr
 */
export class PostItemLostAbAttr extends AbAttr {
  applyPostItemLost(_pokemon: Pokemon, _simulated: boolean, _args: any[]): boolean {
    return false;
  }
}

/**
 * Applies a Battler Tag to the Pokemon after it loses or consumes item
 * @extends PostItemLostAbAttr
 */
export class PostItemLostApplyBattlerTagAbAttr extends PostItemLostAbAttr {
  private tagType: BattlerTagType;
  constructor(tagType: BattlerTagType) {
    super(true);
    this.tagType = tagType;
  }
  /**
   * Adds the last used Pokeball back into the player's inventory
   * @param pokemon {@linkcode Pokemon} with this ability
   * @param _args N/A
   * @returns true if BattlerTag was applied
   */
  override applyPostItemLost(pokemon: Pokemon, simulated: boolean, _args: any[]): boolean {
    if (!pokemon.getTag(this.tagType) && !simulated) {
      pokemon.addTag(this.tagType);
      return true;
    }
    return false;
  }
}

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  private multiplier: integer;

  constructor(multiplier: integer) {
    super(true);

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

export class StatStageChangeCopyAbAttr extends AbAttr {
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if (!simulated) {
      globalScene.unshiftPhase(
        new StatStageChangePhase(
          pokemon.getBattlerIndex(),
          true,
          args[0] as BattleStat[],
          args[1] as number,
          true,
          false,
          false,
        ),
      );
    }
    return true;
  }
}

export class BypassBurnDamageReductionAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

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
 * Causes Pokemon to take reduced damage from the {@linkcode StatusEffect.BURN | Burn} status
 * @param multiplier Multiplied with the damage taken
 */
export class ReduceBurnDamageAbAttr extends AbAttr {
  constructor(protected multiplier: number) {
    super(false);
  }

  /**
   * Applies the damage reduction
   * @param _pokemon N/A
   * @param _passive N/A
   * @param _cancelled N/A
   * @param args `[0]` {@linkcode NumberHolder} The damage value being modified
   * @returns `true`
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as NumberHolder).value = toDmgValue((args[0] as NumberHolder).value * this.multiplier);

    return true;
  }
}

export class DoubleBerryEffectAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as NumberHolder).value *= 2;

    return true;
  }
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

function queueShowAbility(pokemon: Pokemon, passive: boolean): void {
  globalScene.unshiftPhase(new ShowAbilityPhase(pokemon.id, passive));
  globalScene.clearPhaseQueueSplice();
}

/**
 * Sets the ability of a Pokémon as revealed.
 *
 * @param pokemon - The Pokémon whose ability is being revealed.
 */
function setAbilityRevealed(pokemon: Pokemon): void {
  if (pokemon.battleData) {
    pokemon.battleData.abilityRevealed = true;
  }
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
