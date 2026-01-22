import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Removes specified arena tags when a Pokemon is summoned.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Screen_Cleaner_(Ability) | Screen Cleaner (Bulbapedia)}
 * @param arenaTags - The {@linkcode ArenaTagType | arena tags} to be removed
 */
export class PostSummonRemoveArenaTagAbAttr extends PostSummonAbAttr {
  private readonly arenaTags: ArenaTagType[];

  constructor(arenaTags: ArenaTagType[]) {
    super();

    this.arenaTags = arenaTags;
  }

  public override apply({ simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      for (const arenaTag of this.arenaTags) {
        globalScene.arena.removeTag(arenaTag);
      }
    }
  }
}
