import { PostDamageAbAttr } from "#abilities/post-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { BattleType } from "#enums/battle-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { AddSubstituteAttr } from "#moves/add-substitute-attr";
import { CurseAttr } from "#moves/curse-attr";
import { CutHpStatStageBoostAttr } from "#moves/cut-hp-stat-stage-boost-attr";
import { HpSplitAttr } from "#moves/hp-split-attr";
import { toDmgValue } from "#utils/common-utils";

/**
 * Ability attribute for forcing a Pokémon to switch out after its health drops below half.
 * This attribute checks various conditions related to the damage received, the moves used by the Pokémon
 * and its opponents, and determines whether a forced switch-out should occur.
 *
 * Used by Wimp Out and Emergency Exit
 */
export class PostDamageForceSwitchAbAttr extends PostDamageAbAttr {
  private readonly hpRatio: number;

  constructor(hpRatio: number = 0.5) {
    super();
    this._flags.add(AbAttrFlag.POST_DAMAGE_FORCE_SWITCH);
    this.hpRatio = hpRatio;
  }

  public override apply(pokemon: Pokemon, _simulated: boolean, damage: number, source?: Pokemon): boolean {
    const moveHistory = pokemon.getMoveHistory();
    // Will not activate when the Pokémon's HP is lowered by cutting its own HP
    const forbiddenAttackingAttrs = [AddSubstituteAttr, CurseAttr, CutHpStatStageBoostAttr, HpSplitAttr];
    if (moveHistory.length > 0) {
      const lastMoveUsed = moveHistory.at(-1)!.move;
      if (forbiddenAttackingAttrs.some((attr) => lastMoveUsed.hasAttr(attr))) {
        return false;
      }
    }

    // Dragon Tail and Circle Throw switch out Pokémon before the Ability activates.
    const forbiddenDefendingMoves = [MoveId.DRAGON_TAIL, MoveId.CIRCLE_THROW];
    if (source) {
      const enemyMoveHistory = source.getMoveHistory();
      if (enemyMoveHistory.length > 0) {
        const enemyLastMoveUsed = enemyMoveHistory.at(-1)!;
        // Will not activate if the Pokémon's HP falls below half while it is in the air during Sky Drop.
        if (forbiddenDefendingMoves.includes(enemyLastMoveUsed.move.id) || pokemon.hasTag(BattlerTagType.SKY_DROP)) {
          return false;
        }
        // Will not activate if the Pokémon's HP falls below half by a move affected by Sheer Force.
        if (allMoves.get(enemyLastMoveUsed.move.id).chance >= 0 && source.hasAbility(AbilityId.SHEER_FORCE)) {
          return false;
        }
        // Activate only after the last hit of multistrike moves
        if (source.turnData.hitsLeft > 1) {
          return false;
        }
        if (source.turnData.hitCount > 1) {
          damage = pokemon.turnData.damageTaken;
        }
      }
    }

    if (pokemon.hp + damage >= pokemon.getMaxHp() * this.hpRatio) {
      // Activates if it falls below half and recovers back above half from a Shell Bell
      // TODO: This is a bandaid fix for on-hit effects being applied in the wrong order
      const shellBellHeal = calculateShellBellRecovery(pokemon);
      if (pokemon.hp - shellBellHeal < pokemon.getMaxHp() * this.hpRatio) {
        const pokemonIndex = pokemon.getBattlerIndex();

        if (pokemon.isEnemy() && globalScene.currentBattle.battleType === BattleType.WILD) {
          return globalScene.tryForceFleePokemon(pokemonIndex, pokemon);
        }
        return globalScene.tryForceSwitchPokemon(pokemonIndex);
      }
    }
    return false;
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
  const shellBellModifier = pokemon.getHeldItems().find((m) => m.isHitHealModifier());
  if (shellBellModifier) {
    return toDmgValue(pokemon.turnData.totalDamageDealt / 8) * shellBellModifier.stackCount;
  }
  return 0;
}
