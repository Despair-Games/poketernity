import { type Pokemon, MoveResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTrapTag } from "../arena-tag";
import type { Move } from "../move";
import { AddArenaTagAttr } from "./add-arena-tag-attr";

/**
 * Attribute used for Stone Axe and Ceaseless Edge.
 * Applies the given ArenaTrapTag when move is used.
 * @extends AddArenaTagAttr
 * @see {@linkcode apply}
 */
export class AddArenaTrapTagHitAttr extends AddArenaTagAttr {
  /**
   * @param user {@linkcode Pokemon} using this move
   * @param target {@linkcode Pokemon} target of this move
   * @param move {@linkcode Move} being used
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, _args: any[]): boolean {
    const moveChance = this.getMoveChance(user, target, move, this.selfTarget, true);
    const side = (this.selfSideTarget ? user : target).getArenaTagSide();
    const tag = globalScene.arena.getTagOnSide(this.tagType, side) as ArenaTrapTag;
    if (
      (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance)
      && user.getLastXMoves(1)[0]?.result === MoveResult.SUCCESS
    ) {
      globalScene.arena.addTag(this.tagType, user.id, 0, move.id, side);
      if (!tag) {
        return true;
      }
      return tag.layers < tag.maxLayers;
    }
    return false;
  }
}
