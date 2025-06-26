import { TypeHazardTag } from "#arena-tags/type-hazard-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";

/**
 * Represents the {@link https://bulbapedia.bulbagarden.net/wiki/Stealth_Rock_(move) | Stealth Rock} effect.
 * Deals damage to Pokemon entering the afflicted {@linkcode ArenaTagSide | side}
 * of the field based on the effectiveness of {@linkcode ElementalType.STEEL | Rock}
 * against them.
 */
export class StealthRockTag extends TypeHazardTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(
      ArenaTagType.STEALTH_ROCK,
      ElementalType.ROCK,
      sourceId,
      side,
      MoveId.STEALTH_ROCK,
      "arenaTag:stealthRockOnAdd",
      "arenaTag:stealthRockActivateTrap",
    );
  }
}
