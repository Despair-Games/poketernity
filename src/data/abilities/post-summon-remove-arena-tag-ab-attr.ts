import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Removes specified arena tags when a Pokemon is summoned.
 */

export class PostSummonRemoveArenaTagAbAttr extends PostSummonAbAttr {
  private arenaTags: ArenaTagType[];

  /**
   * @param arenaTags {@linkcode ArenaTagType[]} - the arena tags to be removed
   */
  constructor(arenaTags: ArenaTagType[]) {
    super(true);

    this.arenaTags = arenaTags;
  }

  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (!simulated) {
      for (const arenaTag of this.arenaTags) {
        globalScene.arena.removeTag(arenaTag);
      }
    }
    return true;
  }
}
