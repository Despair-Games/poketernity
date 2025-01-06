import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { RemoveArenaTagsAttr } from "./remove-arena-tags-attr";

export class RemoveArenaTrapAttr extends RemoveArenaTagsAttr {
  constructor(targetBothSides: boolean = false) {
    super(
      [ArenaTagType.SPIKES, ArenaTagType.TOXIC_SPIKES, ArenaTagType.STEALTH_ROCK, ArenaTagType.STICKY_WEB],
      targetBothSides ? ArenaTagRelativeSide.ALL : ArenaTagRelativeSide.USER,
    );
  }
}
