import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import { RemoveArenaTagsAttr } from "./remove-arena-tags-attr";

export class RemoveScreensAttr extends RemoveArenaTagsAttr {
  constructor(targetBothSides: boolean = false) {
    super(
      [ArenaTagType.AURORA_VEIL, ArenaTagType.LIGHT_SCREEN, ArenaTagType.REFLECT],
      targetBothSides ? ArenaTagRelativeSide.ALL : ArenaTagRelativeSide.TARGET,
      MoveEffectTrigger.PRE_APPLY,
    );
  }
}
