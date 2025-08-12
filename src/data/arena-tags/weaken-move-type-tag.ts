import { SerializableArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Weakens the power of moves of a specific {@linkcode ElementalType}
 */
export abstract class WeakenMoveTypeTag extends SerializableArenaTag {
  abstract override readonly tagType: typeof ArenaTagType.MUD_SPORT | typeof ArenaTagType.WATER_SPORT;

  abstract get weakenedType(): ElementalType;

  /**
   * Reduces an attack's power by 0.33x if it matches this tag's weakened type.
   * @param _simulated n/a
   * @param type the attack's {@linkcode ElementalType}
   * @param power a {@linkcode NumberHolder} containing the attack's power
   * @returns `true` if the attack's power was reduced; `false` otherwise.
   */
  override apply(_simulated: boolean, type: ElementalType, power: NumberHolder): boolean {
    if (type === this.weakenedType) {
      power.value *= 0.33;
      return true;
    }
    return false;
  }
}
