import { ENTRY_HAZARD_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { RemoveArenaTagsAttr } from "#moves/remove-arena-tags-attr";

/**
 * Attribute to remove {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Variations_of_Spikes | hazards}
 * from the field.
 */
export class RemoveEntryHazardAttr extends RemoveArenaTagsAttr {
  constructor(targetBothSides: boolean = false) {
    super([...ENTRY_HAZARD_ARENA_TAG_TYPES], targetBothSides ? ArenaTagRelativeSide.ALL : ArenaTagRelativeSide.USER);
  }
}
