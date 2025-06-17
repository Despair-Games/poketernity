import { ElementalType } from "#enums/elemental-type";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveTypeAttr } from "#moves/variable-move-type-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change the move's type based on the user's IVs.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Hidden_Power_(move) | Hidden Power}
 */
export class HiddenPowerTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
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
      ElementalType.FIGHTING,
      ElementalType.FLYING,
      ElementalType.POISON,
      ElementalType.GROUND,
      ElementalType.ROCK,
      ElementalType.BUG,
      ElementalType.GHOST,
      ElementalType.STEEL,
      ElementalType.FIRE,
      ElementalType.WATER,
      ElementalType.GRASS,
      ElementalType.ELECTRIC,
      ElementalType.PSYCHIC,
      ElementalType.ICE,
      ElementalType.DRAGON,
      ElementalType.DARK,
    ][iv_val];

    return true;
  }
}
