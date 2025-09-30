import { EffectiveStatMultiplier } from "#abilities/effective-stat-multiplier-ab-attr";
import type { ElementalType } from "#enums/elemental-type";
import { MoveCategory } from "#enums/move-category";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Ability attribute that multiplies the ability holder's attack/special attack stat (depends on the move's category) by 1.5 if it uses a move of a specific type at less than 1/3 HP
 * These abilities use this attribute:
 * ```text
+--------------+-------+
| Ability Name | Type  |
+--------------+-------+
| Overgrow     | Grass |
| Blaze        | Fire  |
| Torrent      | Water |
| Swarm        | Bug   |
+--------------+-------+
 * ```
 */
export class LowHpMoveTypeAttackMultiplierAbAttr extends EffectiveStatMultiplier {
  /**
   * The constructor defaults to Stat.ATK since at the moment of the attribute's construction, the game does not know what move will be used.
   */
  constructor(boostedType: ElementalType) {
    const condition = (pokemon: Pokemon, _target: Pokemon, move: Move): boolean => {
      return move && pokemon.getHpRatio() <= 1 / 3 && pokemon.getMoveType(move) === boostedType;
    };
    super(Stat.ATK, 1.5, condition);
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    move: Move,
    target: Pokemon,
  ): boolean {
    const category = move != null && target != null ? pokemon.getMoveCategory(target, move) : move?.category;
    this.stat = category === MoveCategory.SPECIAL ? Stat.SPATK : Stat.ATK;
    return super.apply(pokemon, simulated, stat, statValue, move, target);
  }
}
