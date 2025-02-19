import { globalScene } from "#app/global-scene";
import type { ArenaHazardTag } from "../arena-tag";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { AddArenaTagAttr } from "./add-arena-tag-attr";

/**
 * Attribute to add a {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes | hazard} to the field.
 * @extends AddArenaTagAttr
 */
export class AddArenaHazardTagAttr extends AddArenaTagAttr {
  override getCondition(): MoveConditionFunc {
    return (user, _target, move) => {
      const side = this.getTagSide(user, move);
      const tag = globalScene.arena.getTagOnSide(this.tagType, side) as ArenaHazardTag;
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    };
  }
}
