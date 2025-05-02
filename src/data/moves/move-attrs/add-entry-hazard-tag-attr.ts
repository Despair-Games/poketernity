import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import type { EntryHazardTag } from "#app/data/arena-tag";
import { globalScene } from "#app/global-scene";
import { AddArenaTagAttr } from "./add-arena-tag-attr";

/**
 * Attribute to add a {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes | hazard} to the field.
 * @extends AddArenaTagAttr
 */
export class AddEntryHazardTagAttr extends AddArenaTagAttr {
  override getCondition(): MoveConditionFunc {
    return (user, _target, move) => {
      const side = this.getTagSide(user, move);
      const tag = globalScene.arena.findTag<EntryHazardTag>(this.tagType, side);
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    };
  }
}
