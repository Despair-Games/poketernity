import { type EnemyPokemon, type Pokemon } from "#app/field/pokemon";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { SwitchType } from "#enums/switch-type";
import { PostDamageAbAttr } from "./post-damage-ab-attr";
import { allMoves } from "#app/data/data-lists";
import type { Move } from "#app/data/move";
import { BattlerTagType } from "#enums/battler-tag-type";
import { globalScene } from "#app/global-scene";
import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import { getPokemonNameWithAffix } from "#app/messages";
import { SwitchPhase } from "#app/phases/switch-phase";
import { SwitchSummonPhase } from "#app/phases/switch-summon-phase";
import { BattleType } from "#enums/battle-type";
import i18next from "i18next";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";

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
    this._flags.add(AbAttrFlag.POST_DAMAGE_FORCE_SWITCH);
    this.hpRatio = hpRatio;
  }

  /**
   * Applies the switch-out logic after the Pokémon takes damage.
   * Checks various conditions based on the moves used by the Pokémon, the opponents' moves, and
   * the Pokémon's health after damage to determine whether the switch-out should occur.
   *
   * @param pokemon The Pokémon that took damage.
   * @param simulated Whether the ability is being simulated.
   * @param damage The amount of damage taken by the Pokémon.
   * @param source The Pokemon that dealt damage
   * @returns `true` if the switch-out logic was successfully applied
   */
  public override apply(pokemon: Pokemon, _simulated: boolean, damage: number, source?: Pokemon): boolean {
    const moveHistory = pokemon.getMoveHistory();
    // Will not activate when the Pokémon's HP is lowered by cutting its own HP
    const forbiddenAttackingMoves = [MoveId.BELLY_DRUM, MoveId.SUBSTITUTE, MoveId.CURSE, MoveId.PAIN_SPLIT];
    if (moveHistory.length > 0) {
      const lastMoveUsed = moveHistory[moveHistory.length - 1];
      if (forbiddenAttackingMoves.includes(lastMoveUsed.move.id)) {
        return false;
      }
    }

    // Dragon Tail and Circle Throw switch out Pokémon before the Ability activates.
    const forbiddenDefendingMoves = [MoveId.DRAGON_TAIL, MoveId.CIRCLE_THROW];
    if (source) {
      const enemyMoveHistory = source.getMoveHistory();
      if (enemyMoveHistory.length > 0) {
        const enemyLastMoveUsed = enemyMoveHistory[enemyMoveHistory.length - 1];
        // Will not activate if the Pokémon's HP falls below half while it is in the air during Sky Drop.
        if (forbiddenDefendingMoves.includes(enemyLastMoveUsed.move.id) || pokemon.getTag(BattlerTagType.SKY_DROP)) {
          return false;
          // Will not activate if the Pokémon's HP falls below half by a move affected by Sheer Force.
        } else if (allMoves.get(enemyLastMoveUsed.move.id).chance >= 0 && source.hasAbility(Abilities.SHEER_FORCE)) {
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
 * Calculates the amount of recovery from the Shell Bell item.
 *
 * If the Pokémon is holding a Shell Bell, this function computes the amount of health
 * recovered based on the damage dealt in the current turn. The recovery is multiplied by the
 * Shell Bell's modifier (if any).
 *
 * @param pokemon - The Pokémon whose Shell Bell recovery is being calculated.
 * @returns The amount of health recovered by Shell Bell.
 */
export function calculateShellBellRecovery(pokemon: Pokemon): number {
  const shellBellModifier = pokemon.getHeldItems().find((m) => m.isHitHealModifier());
  if (shellBellModifier) {
    return toDmgValue(pokemon.turnData.totalDamageDealt / 8) * shellBellModifier.stackCount;
  }
  return 0;
}

//#region Helpers

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
    if (switchOutTarget.isPlayer()) {
      if (globalScene.getPlayerParty().filter((p) => p.isAllowedInBattle() && !p.isOnField()).length < 1) {
        return false;
      }

      if (switchOutTarget.hp > 0) {
        switchOutTarget.leaveField(this.switchType === SwitchType.SWITCH);
        globalScene.prependToPhase(
          new SwitchPhase(this.switchType, switchOutTarget.getFieldIndex(), true, true),
          PhaseId.MOVE_END,
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
          PhaseId.MOVE_END,
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
          globalScene.nextBattle(false);
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
    const player = switchOutTarget.isPlayer();

    if (player) {
      const blockedByAbility = new BooleanHolder(false);
      applyAbAttrs(AbAttrFlag.FORCE_SWITCH_OUT_IMMUNITY, pokemon, false, blockedByAbility);
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
    applyAbAttrs(AbAttrFlag.FORCE_SWITCH_OUT_IMMUNITY, target, false, blockedByAbility);
    return blockedByAbility.value
      ? i18next.t("moveTriggers:cannotBeSwitchedOut", { pokemonName: getPokemonNameWithAffix(target) })
      : null;
  }
}

//#endregion
