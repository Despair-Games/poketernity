import type { Type } from "#enums/type";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import { StatMultiplierAbAttr } from "./stat-multiplier-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "../move";
import type { NumberHolder } from "#app/utils";
import { MoveCategory } from "#enums/move-category";

/**
 * Used to determine if the attacking pokemon's attack/special attack should be multiplied by an ability-provided factor if it is attacking a Pokemon with such an ability
 * This attribute is used by abilities like:
 * - Thick Fat
 */
export class ReceivedTypeAttackMultiplierAbAttr extends StatMultiplierAbAttr {
  constructor(moveType: Type, attackMultiplier: number) {
    const condition = (_attacker: Pokemon, target: Pokemon, move: Move) => {
      if (target.hasAbilityWithAttr(ReceivedTypeAttackMultiplierAbAttr)) {
        return moveType === move.type;
      }
      return false;
    };
    super(Stat.ATK, attackMultiplier, condition);
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
    const attacker = args[1] as Pokemon;
    if (move && pokemon.hasAbilityWithAttr(ReceivedTypeAttackMultiplierAbAttr)) {
      console.log(attacker.getAbility());
      console.log(attacker.getAbility().hasAttr(ReceivedTypeAttackMultiplierAbAttr));
      this.stat = attacker.getMoveCategory(pokemon, move) === MoveCategory.PHYSICAL ? Stat.ATK : Stat.SPATK;
      return super.applyStatStage(pokemon, passive, simulated, stat, statValue, args);
    }
    return false;
  }
}
