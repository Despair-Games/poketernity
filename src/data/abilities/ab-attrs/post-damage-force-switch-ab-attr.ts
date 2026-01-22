import { PostDamageAbAttr } from "#abilities/post-damage-ab-attr";
import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattleType } from "#enums/battle-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { AddSubstituteAttr } from "#moves/add-substitute-attr";
import { CurseAttr } from "#moves/curse-attr";
import { CutHpStatStageBoostAttr } from "#moves/cut-hp-stat-stage-boost-attr";
import { HpSplitAttr } from "#moves/hp-split-attr";
import type { PostDamageAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue } from "#utils/common-utils";

/**
 * Ability attribute for forcing a Pokémon to switch out after its health drops below half.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Emergency_Exit_(Ability) | Emergency Exit (Bulbapedia)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Wimp_Out_(Ability) | Wimp Out (Bulbapedia)}
 */
export class PostDamageForceSwitchAbAttr extends PostDamageAbAttr {
  private readonly hpRatio: number;

  constructor(hpRatio: number = 0.5) {
    super();
    this.hpRatio = hpRatio;
  }

  public override apply({ pokemon, simulated }: PostDamageAbAttrParams): void {
    if (simulated) {
      return;
    }

    const pokemonIndex = pokemon.getBattlerIndex();
    if (pokemon.isEnemy() && globalScene.currentBattle.battleType === BattleType.WILD) {
      globalScene.tryForceFleePokemon(pokemonIndex, pokemon);
    }
    globalScene.tryForceSwitchPokemon(pokemonIndex);
  }

  public override canApply({ pokemon, damage, source }: Parameters<this["apply"]>[0]): boolean {
    // TODO: should other forms of semi-invulnerability cancel this effect?
    if (pokemon.hasTag(BattlerTagType.SKY_DROP)) {
      return false;
    }

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
        if (
          source.turnData.hitsLeft > 1
          || forbiddenDefendingMoves.includes(enemyLastMoveUsed.move.id)
          || (allMoves.get(enemyLastMoveUsed.move.id).chance >= 0 && source.hasAbility(AbilityId.SHEER_FORCE))
        ) {
          return false;
        }
      }
    }

    const totalDamage = source == null || source.turnData.hitCount <= 1 ? damage : pokemon.turnData.damageTaken;

    if (pokemon.hp + totalDamage >= pokemon.getMaxHp() * this.hpRatio) {
      // Activates if it falls below half and recovers back above half from a Shell Bell
      // TODO: This is a bandaid fix for on-hit effects being applied in the wrong order
      const shellBellHeal = calculateShellBellRecovery(pokemon);
      if (pokemon.hp - shellBellHeal < pokemon.getMaxHp() * this.hpRatio) {
        if (pokemon.isEnemy() && globalScene.currentBattle.battleType === BattleType.WILD) {
          return globalScene.canForceFleePokemon(pokemon, pokemon);
        }
        return globalScene.canForceSwitchPokemon(pokemon);
      }
    }
    return false;
  }
}

/**
 * If the Pokémon is holding a Shell Bell, this function computes the amount of health
 * recovered based on the damage dealt in the current turn. \
 * The recovery is multiplied by the Shell Bell's modifier (if any).
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
