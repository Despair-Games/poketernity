import { WEAKEN_MOVE_SCREEN_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { RemoveArenaTagsAttr } from "#moves/remove-arena-tags-attr";

/**
 * Attribute to remove the effects of
 * {@link https://bulbapedia.bulbagarden.net/wiki/Light_Screen_(move) | Light Screen}
 * and similar effects.
 */
export class RemoveScreensAttr extends RemoveArenaTagsAttr {
  constructor(targetBothSides: boolean = false) {
    super(
      [...WEAKEN_MOVE_SCREEN_ARENA_TAG_TYPES],
      targetBothSides ? ArenaTagRelativeSide.ALL : ArenaTagRelativeSide.TARGET,
      MoveEffectTrigger.PRE_APPLY,
    );
  }
}
