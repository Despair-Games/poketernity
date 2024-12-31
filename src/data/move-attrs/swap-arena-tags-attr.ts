import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { ArenaTagType } from "#enums/arena-tag-type";
import i18next from "i18next";
import { ArenaTagSide } from "../arena-tag";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Swaps arena effects between the player and enemy side
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class SwapArenaTagsAttr extends MoveEffectAttr {
  public swappableTags: ArenaTagType[];

  constructor(SwapTags: ArenaTagType[]) {
    super(true);
    this.swappableTags = SwapTags;
  }

  /** Swaps sides of all arena tags that are {@linkcode SwapTags swappable} */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const tagPlayerTemp = globalScene.arena.findTagsOnSide(
      (t) => this.swappableTags.includes(t.tagType),
      ArenaTagSide.PLAYER,
    );
    const tagEnemyTemp = globalScene.arena.findTagsOnSide(
      (t) => this.swappableTags.includes(t.tagType),
      ArenaTagSide.ENEMY,
    );

    if (tagPlayerTemp) {
      for (const swapTagsType of tagPlayerTemp) {
        globalScene.arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.PLAYER, true);
        globalScene.arena.addTag(
          swapTagsType.tagType,
          swapTagsType.turnCount,
          swapTagsType.sourceMove,
          swapTagsType.sourceId!,
          ArenaTagSide.ENEMY,
          true,
        ); // TODO: is the bang correct?
      }
    }
    if (tagEnemyTemp) {
      for (const swapTagsType of tagEnemyTemp) {
        globalScene.arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.ENEMY, true);
        globalScene.arena.addTag(
          swapTagsType.tagType,
          swapTagsType.turnCount,
          swapTagsType.sourceMove,
          swapTagsType.sourceId!,
          ArenaTagSide.PLAYER,
          true,
        ); // TODO: is the bang correct?
      }
    }

    globalScene.queueMessage(i18next.t("moveTriggers:swapArenaTags", { pokemonName: getPokemonNameWithAffix(user) }));
    return true;
  }
}
