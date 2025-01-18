import { BattleType } from "#enums/battle-type";
import { SwitchType } from "#app/enums/switch-type";
import type { Pokemon } from "#app/field/pokemon";
import type { EnemyPokemon } from "#app/field/pokemon";
import { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Localizable } from "#app/interfaces/locales";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { MoveEndPhase } from "#app/phases/move-end-phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import type { AbstractConstructor, Constructor } from "#app/utils";
import { BooleanHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import i18next from "i18next";
import { getPokemonNameWithAffix } from "../messages";
import type { AbAttr } from "./ab-attrs/ab-attr";
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
  getAttrs<T extends AbAttr>(attrType: AbstractConstructor<T>): T[] {
    return this.attrs.filter((a): a is T => a instanceof attrType);
  }

  /**
   * Check if an ability has an attribute that matches `attrType`
   * @param attrType any attribute that extends {@linkcode AbAttr}
   * @returns true if the ability has attribute `attrType`
   */
  hasAttr<T extends AbAttr>(attrType: AbstractConstructor<T>): boolean {
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

export class ForceSwitchOutHelper {
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
  public getSwitchOutCondition(pokemon: Pokemon, _opponent: Pokemon): boolean {
    const switchOutTarget = pokemon;
    const player = switchOutTarget instanceof PlayerPokemon;

    if (player) {
      const blockedByAbility = new BooleanHolder(false);
      applyAbAttrs(ForceSwitchOutImmunityAbAttr, pokemon, false, blockedByAbility);
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
  attrType: AbstractConstructor<TAttr>,
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
      }
      if (result) {
        const message = attr.getTriggerMessage(pokemon, ability.name, ...args);
        if (message) {
          if (!simulated) {
            globalScene.queueMessage(message);
          }
          messages.push(message);
        }
      }

      globalScene.clearPhaseQueueSplice();
    });
  }

  return messages;
}

export const allAbilities = [new Ability(Abilities.NONE, 3)];
