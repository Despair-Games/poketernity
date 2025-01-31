import { type Pokemon } from "#app/field/pokemon";
import { toDmgValue, type BooleanHolder } from "#app/utils";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { SwitchType } from "#enums/switch-type";
import { PostDamageAbAttr } from "./post-damage-ab-attr";
import { ForceSwitchOutHelper } from "#app/data/ability";
import { allMoves } from "#app/data/all-moves";
import type { Move } from "#app/data/move";
import { BattlerTagType } from "#enums/battler-tag-type";
import { HitHealModifier } from "#app/modifier/modifier";

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
      if (forbiddenAttackingMoves.includes(lastMoveUsed.moveId)) {
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
        if (forbiddenDefendingMoves.includes(enemyLastMoveUsed.moveId) || pokemon.getTag(BattlerTagType.SKY_DROP)) {
          return false;
          // Will not activate if the Pokémon's HP falls below half by a move affected by Sheer Force.
        } else if (allMoves[enemyLastMoveUsed.moveId].chance >= 0 && source.hasAbility(Abilities.SHEER_FORCE)) {
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
  const shellBellModifier = pokemon.getHeldItems().find((m) => m instanceof HitHealModifier);
  if (shellBellModifier) {
    return toDmgValue(pokemon.turnData.totalDamageDealt / 8) * shellBellModifier.stackCount;
  }
  return 0;
}
