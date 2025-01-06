import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { RemoveArenaTagsAttr } from "./remove-arena-tags-attr";

/**
 * Attribute to remove the effects of
 * {@link https://bulbapedia.bulbagarden.net/wiki/Light_Screen_(move) | Light Screen}
 * and similar effects.
 * @extends MoveEffectAttr
 */
export class RemoveScreensAttr extends RemoveArenaTagsAttr {
  constructor(targetBothSides: boolean = false) {
    super(
      [ArenaTagType.AURORA_VEIL, ArenaTagType.LIGHT_SCREEN, ArenaTagType.REFLECT],
      targetBothSides ? ArenaTagRelativeSide.ALL : ArenaTagRelativeSide.TARGET,
      MoveEffectTrigger.PRE_APPLY,
    );
  }
}
