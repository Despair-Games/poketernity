import { Stat } from "#enums/stat";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Changes type based on the user's IVs
 * @extends VariableMoveTypeAttr
 */
export class HiddenPowerTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const moveType = args[0];
    if (!(moveType instanceof NumberHolder)) {
      return false;
    }

    const iv_val = Math.floor(
      (((user.ivs[Stat.HP] & 1)
        + (user.ivs[Stat.ATK] & 1) * 2
        + (user.ivs[Stat.DEF] & 1) * 4
        + (user.ivs[Stat.SPD] & 1) * 8
        + (user.ivs[Stat.SPATK] & 1) * 16
        + (user.ivs[Stat.SPDEF] & 1) * 32)
        * 15)
        / 63,
    );

    moveType.value = [
      Type.FIGHTING,
      Type.FLYING,
      Type.POISON,
      Type.GROUND,
      Type.ROCK,
      Type.BUG,
      Type.GHOST,
      Type.STEEL,
      Type.FIRE,
      Type.WATER,
      Type.GRASS,
      Type.ELECTRIC,
      Type.PSYCHIC,
      Type.ICE,
      Type.DRAGON,
      Type.DARK,
    ][iv_val];

    return true;
  }
}
