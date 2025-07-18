import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";

/**
 * Base class for moves like Trick Room which should negate their effect when used a second time.
 */
export abstract class ArenaRoomTag extends ArenaTag {
  override onOverlap(): void {
    globalScene.arena.removeTag(this.tagType);
  }
}
