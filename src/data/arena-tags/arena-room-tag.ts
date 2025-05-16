import { ArenaTag } from "#arena-tags/arena-tag";
import type { Arena } from "#field/arena";

/**
 * Base class for moves like Trick Room which should negate their effect when used a second time.
 * @extends ArenaTag
 */
export abstract class ArenaRoomTag extends ArenaTag {
  override onOverlap(arena: Arena): void {
    arena.removeTag(this.tagType);
  }
}
