import type { BattlerIndex } from "#app/battle";
import { BattleType } from "#app/battle";
import type { Weather } from "#app/data/weather";
import { type Stat, type BattleStat } from "#app/enums/stat";
import { SwitchType } from "#app/enums/switch-type";
import type { Pokemon } from "#app/field/pokemon";
import type { EnemyPokemon, PokemonMove, HitResult } from "#app/field/pokemon";
import { MoveResult, PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Localizable } from "#app/interfaces/locales";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import type { Constructor, NumberHolder } from "#app/utils";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import type { StatusEffect } from "#enums/status-effect";
import type { TerrainType } from "#enums/terrain-type";
import type { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { getPokemonNameWithAffix } from "../messages";
import { HitHealModifier } from "../modifier/modifier";
import type { BattlerTag } from "./battler-tags";
import type { Move } from "./move";
import { allMoves } from "#app/data/all-moves";
import type { AbAttr } from "./ab-attrs/ab-attr";
import type { PostBattleInitAbAttr } from "./ab-attrs/post-battle-init-ab-attr";
import { PostDamageAbAttr } from "./ab-attrs/post-damage-ab-attr";
import type { PostSummonAbAttr } from "./ab-attrs/post-summon-ab-attr";
import type { PreAttackAbAttr } from "./ab-attrs/pre-attack-ab-attr";
import { type PreDefendAbAttr } from "./ab-attrs/pre-defend-ab-attr";
import type { PostDefendAbAttr } from "./ab-attrs/post-defend-ab-attr";
import type { PostStatStageChangeAbAttr } from "./ab-attrs/post-stat-stage-change-ab-attr";
import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
import type { FieldMultiplyStatAbAttr } from "./ab-attrs/field-multiply-stat-ab-attr";
import type { StatMultiplierAbAttr } from "./ab-attrs/stat-multiplier-ab-attr";
import type { PostAttackAbAttr } from "./ab-attrs/post-attack-ab-attr";
import type { PostSetStatusAbAttr } from "./ab-attrs/post-set-status-ab-attr";
import type { PostVictoryAbAttr } from "./ab-attrs/post-victory-ab-attr";
import type { PostKnockOutAbAttr } from "./ab-attrs/post-knock-out-ab-attr";
import type { PreSwitchOutAbAttr } from "./ab-attrs/pre-switch-out-ab-attr";
import type { PreStatStageChangeAbAttr } from "./ab-attrs/pre-stat-stage-change-ab-attr";
import type { PreSetStatusAbAttr } from "./ab-attrs/pre-set-status-ab-attr";
import type { PreApplyBattlerTagAbAttr } from "./ab-attrs/pre-apply-battler-tag-ab-attr";
import type { PreWeatherEffectAbAttr } from "./ab-attrs/pre-weather-effect-ab-attr";
import type { PreWeatherDamageAbAttr } from "./ab-attrs/pre-weather-damage-ab-attr";
import type { PostWeatherChangeAbAttr } from "./ab-attrs/post-weather-change-ab-attr";
import type { PostWeatherLapseAbAttr } from "./ab-attrs/post-weather-lapse-ab-attr";
import type { PostTerrainChangeAbAttr } from "./ab-attrs/post-terrain-change-ab-attr";
import type { PostTurnAbAttr } from "./ab-attrs/post-turn-ab-attr";
import type { PostMoveUsedAbAttr } from "./ab-attrs/post-move-used-ab-attr";
import type { PostItemLostAbAttr } from "./ab-attrs/post-item-lost-ab-attr";
import type { CheckTrappedAbAttr } from "./ab-attrs/check-trapped-ab-attr";
import type { PostBattleAbAttr } from "./ab-attrs/post-battle-ab-attr";
import type { PostFaintAbAttr } from "./ab-attrs/post-faint-ab-attr";
import { ForceSwitchOutImmunityAbAttr } from "./ab-attrs/force-switch-out-immunity-ab-attr";
import { queueShowAbility } from "./ability-utils";

export class Ability implements Localizable {
  public id: Abilities;

  private nameAppend: string;
  public name: string;
  public description: string;
  public generation: number;
  public isBypassFaint: boolean;
  public isIgnorable: boolean;
  public attrs: AbAttr[];
  public conditions: AbAttrCondition[];

  constructor(id: Abilities, generation: number) {
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
  stages: number,
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

export const allAbilities = [new Ability(Abilities.NONE, 3)];
