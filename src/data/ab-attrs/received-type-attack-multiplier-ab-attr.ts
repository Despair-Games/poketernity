import type { Type } from "#enums/type";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import { StatMultiplierAbAttr } from "./stat-multiplier-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "../move";
import type { NumberHolder } from "#app/utils";
import { MoveCategory } from "#enums/move-category";

export class ReceivedTypeAttackMultiplierAbAttr extends StatMultiplierAbAttr {
  constructor(moveType: Type, attackMultiplier: number) {
    const condition = (_attacker: Pokemon, target: Pokemon, move: Move) => {
      if (target.getAbility().hasAttr(ReceivedTypeAttackMultiplierAbAttr)) {
        return moveType === move.type;
      }
      return false;
    };
    super(Stat.ATK, attackMultiplier, condition);
  }

  override applyStatStage(pokemon: Pokemon, passive: boolean, simulated: boolean, stat: BattleStat, statValue: NumberHolder, args: any[]): boolean {
      const move = args[0] as Move;
      this.stat = move.category === MoveCategory.PHYSICAL ? Stat.ATK : Stat.SPATK;
      super.applyStatStage(pokemon, passive, simulated, stat, statValue, args);
  }
}