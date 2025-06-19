import { globalScene } from "#app/global-scene";
import type { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import { AddArenaTagAttr } from "#moves/add-arena-tag-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";

/**
 * Attribute to add a {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes | hazard} to the field.
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
