import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Removes specified arena tags when a Pokemon is summoned. Used by Screen Cleaner.
 * @param arenaTags - The {@linkcode ArenaTagType | arena tags} to be removed
 */
export class PostSummonRemoveArenaTagAbAttr extends PostSummonAbAttr {
  private readonly arenaTags: ArenaTagType[];

  constructor(arenaTags: ArenaTagType[]) {
    super();

    this.arenaTags = arenaTags;
  }

  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      for (const arenaTag of this.arenaTags) {
        globalScene.arena.removeTag(arenaTag);
      }
    }
  }
}
