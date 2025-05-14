import { globalScene } from "#app/global-scene";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Generic class for removing arena tags
 * @param tagTypes The types of tags that can be removed
 * @param relativeSide The {@linkcode ArenaTagRelativeSide side}
 * (relative to the user) to remove tags from.
 */
export class RemoveArenaTagsAttr extends MoveEffectAttr {
  public tagTypes: ArenaTagType[];
  public relativeSide: ArenaTagRelativeSide;

  constructor(
    tagTypes: ArenaTagType[],
    relativeSide: ArenaTagRelativeSide,
    trigger: MoveEffectTrigger = MoveEffectTrigger.POST_APPLY,
  ) {
    super(true, { trigger });

    this.tagTypes = tagTypes;
    this.relativeSide = relativeSide;
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const sides: ArenaTagSide[] = [];

    switch (this.relativeSide) {
      case ArenaTagRelativeSide.USER:
        sides.push(user.getArenaTagSide());
        break;
      case ArenaTagRelativeSide.TARGET:
        sides.push(target.getArenaTagSide());
        break;
      case ArenaTagRelativeSide.ALL:
        sides.push(ArenaTagSide.PLAYER, ArenaTagSide.ENEMY);
        break;
    }

    sides.forEach((side) => this.tagTypes.forEach((tagType) => globalScene.arena.removeTagOnSide(tagType, side)));

    return true;
  }
}
