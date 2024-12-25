import type { Type } from "#enums/type";
import { StatMultiplierAbAttr } from "./stat-multiplier-ab-attr";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "../move";
import type { NumberHolder } from "#app/utils";
import { MoveCategory } from "#enums/move-category";

/**
 * Ability attribute that multiplies the ability holder's attack/special attack stat (depends on the move's category) by 1.5 if it uses a move of a specific type at less than 1/3 HP
 * These abilities use this attribute:
 * ```
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
export class LowHpMoveTypePowerBoostAbAttr extends StatMultiplierAbAttr {
  /**
   * The constructor defaults to Stat.ATK since at the moment of the attribute's construction, the game does not know what move will be used.
   */
  constructor(boostedType: Type) {
    const condition = (pokemon: Pokemon, _target: Pokemon, move: Move) => {
      return pokemon.getHpRatio() <= 0.33 && move.type === boostedType;
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
    const move = args[0] as Move;
    // The class variable `stat` is checked and possibly changed to special attack when the game now has access to the move used at the moment.
    this.stat = move && move.category === MoveCategory.SPECIAL ? Stat.SPATK : Stat.ATK;
    return super.applyStatStage(pokemon, passive, simulated, stat, statValue, args);
  }
}
