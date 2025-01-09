import { BattleType } from "#app/battle";
import { SwitchType } from "#app/enums/switch-type";
import type { Pokemon } from "#app/field/pokemon";
import type { EnemyPokemon } from "#app/field/pokemon";
import { MoveResult, PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Localizable } from "#app/interfaces/locales";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import type { Constructor } from "#app/utils";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import i18next from "i18next";
import { getPokemonNameWithAffix } from "../messages";
import { HitHealModifier } from "../modifier/modifier";
import type { Move } from "./move";
import { allMoves } from "#app/data/all-moves";
import type { AbAttr } from "./ab-attrs/ab-attr";
import { PostDamageAbAttr } from "./ab-attrs/post-damage-ab-attr";
import type { AbAttrCondition } from "#app/@types/AbAttrCondition";
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
      applyAbAttrs(ForceSwitchOutImmunityAbAttr, opponent, false, blockedByAbility);
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
    applyAbAttrs(ForceSwitchOutImmunityAbAttr, target, false, blockedByAbility);
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
   * @param _simulated Whether the ability is being simulated.
   * @param damage The amount of damage taken by the Pokémon.
   * @param _passive N/A
   * @param _args N/A
   * @param source The Pokemon that dealt damage
   * @returns `true` if the switch-out logic was successfully applied
   */
  public override apply(pokemon: Pokemon, _simulated: boolean, damage: number, source?: Pokemon): boolean {
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

/**
 * Applies a Pokemon's ability attributes of matching type
 * @param attrType The type of attribute to apply
 * @param params The parameters for the given attribute's `apply` function. This should include:
 * - `pokemon`: The {@linkcode Pokemon} with the ability
 * - `simulated`: If `true`, suppresses changes to game state when applying.
 * - Any additional necessary arguments for the specific attribute type
 * @returns The message(s) displayed when the ability applies
 * @see {@linkcode AbAttr}
 */
export function applyAbAttrs<TAttr extends AbAttr>(
  attrType: Constructor<TAttr>,
  ...params: Parameters<TAttr["apply"]>
): string[] {
  const messages: string[] = [];
  const [pokemon, simulated, ...args] = params;
  for (const passive of [false, true]) {
    if (!pokemon.canApplyAbility(passive) || (passive && pokemon.getPassiveAbility().id === pokemon.getAbility().id)) {
      continue;
    }

    const ability = passive ? pokemon.getPassiveAbility() : pokemon.getAbility();
    const matchingAttrs = ability.getAttrs(attrType).filter((attr) => {
      const condition = attr.getCondition();
      return !condition || condition(pokemon);
    });

    matchingAttrs.forEach((attr) => {
      globalScene.setPhaseQueueSplice();

      const result = attr.apply(pokemon, simulated, ...args);
      if (result && !simulated) {
        if (pokemon.summonData && !pokemon.summonData.abilitiesApplied.includes(ability.id)) {
          pokemon.summonData.abilitiesApplied.push(ability.id);
        }
        if (pokemon.battleData && !pokemon.battleData.abilitiesApplied.includes(ability.id)) {
          pokemon.battleData.abilitiesApplied.push(ability.id);
        }
        if (attr.showAbility) {
          if (attr.showAbilityInstant) {
            globalScene.abilityBar.showAbility(pokemon, passive);
          } else {
            queueShowAbility(pokemon, passive);
          }
        }

        const message = attr.getTriggerMessage(pokemon, ability.name, ...args);
        if (message) {
          globalScene.queueMessage(message);
          messages.push(message);
        }
      }

      globalScene.clearPhaseQueueSplice();
    });
  }

  return messages;
}

export const allAbilities = [new Ability(Abilities.NONE, 3)];
