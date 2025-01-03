import type { Type } from "#enums/type";
import { StatMultiplierAbAttr } from "./stat-multiplier-ab-attr";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "../move";
import { isNullOrUndefined, type NumberHolder } from "#app/utils";
import { MoveCategory } from "#enums/move-category";

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
 * @extends StatMultiplierAbAttr
 */
export class LowHpMoveTypeAttackMultiplierAbAttr extends StatMultiplierAbAttr {
  /**
   * The constructor defaults to Stat.ATK since at the moment of the attribute's construction, the game does not know what move will be used.
   */
  constructor(boostedType: Type) {
    const condition = (pokemon: Pokemon, _target: Pokemon, move: Move): boolean => {
      return move && pokemon.getHpRatio() <= 1/3 && pokemon.getMoveType(move) === boostedType;
    };
    super(Stat.ATK, 1.5, condition);
  }

  override applyStatStage(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    args: any[],
  ): boolean {
    const move: Move | null = args[0];
    const target: Pokemon | null = args[1];
    const category =
      !isNullOrUndefined(move) && !isNullOrUndefined(target) ? pokemon.getMoveCategory(target, move) : move?.category;
    this.stat = category === MoveCategory.SPECIAL ? Stat.SPATK : Stat.ATK;
    return super.applyStatStage(pokemon, passive, simulated, stat, statValue, args);
  }
}
