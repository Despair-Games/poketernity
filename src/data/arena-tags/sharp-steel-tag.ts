import { TypeHazardTag } from "#arena-tags/type-hazard-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";

/**
 * Implements the secondary effect of {@link https://bulbapedia.bulbagarden.net/wiki/G-Max_Steelsurge_(move) | G-Max Steelsurge}.
 * Deals damage to Pokemon entering the afflicted {@linkcode ArenaTagSide | side}
 * of the field based on the effectiveness of {@linkcode ElementalType.STEEL | Steel}
 * against them.
 */
export class SharpSteelTag extends TypeHazardTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(
      ArenaTagType.SHARP_STEEL,
      ElementalType.STEEL,
      sourceId,
      side,
      MoveId.G_MAX_STEELSURGE,
      "arenaTag:sharpSteelOnAdd",
      "arenaTag:sharpSteelActivateTrap",
    );
  }
}
