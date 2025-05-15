import { TypeHazardTag } from "#arena-tags/type-hazard-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";

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
