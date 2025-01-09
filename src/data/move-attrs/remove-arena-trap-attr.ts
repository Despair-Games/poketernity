import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { RemoveArenaTagsAttr } from "./remove-arena-tags-attr";

/**
 * Attribute to remove {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes | hazards}
 * from the field.
 * @extends MoveEffectAttr
 */
export class RemoveArenaTrapAttr extends RemoveArenaTagsAttr {
  constructor(targetBothSides: boolean = false) {
    super(
      [ArenaTagType.SPIKES, ArenaTagType.TOXIC_SPIKES, ArenaTagType.STEALTH_ROCK, ArenaTagType.STICKY_WEB],
      targetBothSides ? ArenaTagRelativeSide.ALL : ArenaTagRelativeSide.USER,
    );
  }
}
