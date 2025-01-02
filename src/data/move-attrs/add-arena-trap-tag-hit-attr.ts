import { type Pokemon, MoveResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTrapTag } from "../arena-tag";
import type { Move } from "../move";
import { AddArenaTagAttr } from "./add-arena-tag-attr";

/**
 * Attribute used for Stone Axe and Ceaseless Edge.
 * Applies the given ArenaTrapTag when move is used.
 * Also can be negated by {@link https://bulbapedia.bulbagarden.net/wiki/Sheer_Force_(Ability) Sheer Force}.
 * @extends AddArenaTagAttr
 */
export class AddArenaTrapTagHitAttr extends AddArenaTagAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    const side = (this.selfSideTarget ? user : target).getArenaTagSide();
    const tag = globalScene.arena.getTagOnSide(this.tagType, side) as ArenaTrapTag;
    if (
      (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance)
      && user.getLastXMoves(1)[0]?.result === MoveResult.SUCCESS
    ) {
      globalScene.arena.addTag(this.tagType, 0, move.id, user.id, side);
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    }
    return false;
  }
}
