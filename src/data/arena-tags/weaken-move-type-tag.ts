import { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Weakens the power of moves of a specific {@linkcode ElementalType}
 */
export abstract class WeakenMoveTypeTag extends ArenaTag {
  private readonly weakenedType: ElementalType;

  /**
   * Creates a new instance of the WeakenMoveTypeTag class.
   *
   * @param tagType - The type of the arena tag.
   * @param turnCount - The number of turns the tag is active.
   * @param type - The type being weakened from this tag.
   * @param sourceMoveId - The move that created the tag.
   * @param sourceId - The ID of the source of the tag.
   */
  constructor(tagType: ArenaTagType, turnCount: number, type: ElementalType, sourceMoveId: MoveId, sourceId: number) {
    super(tagType, turnCount, sourceMoveId, sourceId);

    this.weakenedType = type;
  }

  /**
   * Reduces an attack's power by 0.33x if it matches this tag's weakened type.
   * @param _arena n/a
   * @param _simulated n/a
   * @param type the attack's {@linkcode ElementalType}
   * @param power a {@linkcode NumberHolder} containing the attack's power
   * @returns `true` if the attack's power was reduced; `false` otherwise.
   */
  override apply(_arena: Arena, _simulated: boolean, type: ElementalType, power: NumberHolder): boolean {
    if (type === this.weakenedType) {
      power.value *= 0.33;
      return true;
    }
    return false;
  }
}
