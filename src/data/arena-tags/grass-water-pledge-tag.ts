import { globalScene } from "#app/global-scene";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Arena Tag implementing the "swamp" effect from the combination
 * of {@link https://bulbapedia.bulbagarden.net/wiki/Grass_Pledge_(move) | Grass Pledge}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Water_Pledge_(move) | Water Pledge}.
 * Quarters the Speed of Pokemon on the given side of the field for 4 turns.
 */
export class GrassWaterPledgeTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.GRASS_WATER_PLEDGE;

  constructor(sourceId: number | undefined, side: ArenaTagSide) {
    super(4, MoveId.GRASS_PLEDGE, sourceId, side);
  }

  override onAdd(): void {
    // "A swamp enveloped your/the opposing team!"
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(`arenaTag:grassWaterPledgeOnAdd${this.i18nSideKey}`),
    );
  }
}
