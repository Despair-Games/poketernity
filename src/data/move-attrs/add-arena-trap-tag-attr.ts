import { globalScene } from "#app/global-scene";
import type { ArenaTrapTag } from "../arena-tag";
import type { MoveConditionFunc } from "../move-conditions";
import { AddArenaTagAttr } from "./add-arena-tag-attr";

export class AddArenaTrapTagAttr extends AddArenaTagAttr {
  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const side = (this.selfSideTarget ? user : target).getArenaTagSide();
      const tag = globalScene.arena.getTagOnSide(this.tagType, side) as ArenaTrapTag;
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    };
  }
}
