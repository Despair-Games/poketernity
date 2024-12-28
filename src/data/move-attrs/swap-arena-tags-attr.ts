import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTagType } from "#enums/arena-tag-type";
import i18next from "i18next";
import { ArenaTagSide } from "../arena-tag";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

export const courtChangeArenaTags = [
  ArenaTagType.AURORA_VEIL,
  ArenaTagType.LIGHT_SCREEN,
  ArenaTagType.MIST,
  ArenaTagType.REFLECT,
  ArenaTagType.SPIKES,
  ArenaTagType.STEALTH_ROCK,
  ArenaTagType.STICKY_WEB,
  ArenaTagType.TAILWIND,
  ArenaTagType.TOXIC_SPIKES,
  ArenaTagType.SAFEGUARD,
  ArenaTagType.GRASS_WATER_PLEDGE,
  ArenaTagType.FIRE_GRASS_PLEDGE,
  ArenaTagType.WATER_FIRE_PLEDGE,
];

/**
 * Swaps arena effects between the player and enemy side
 * Used in Court Change
 * @extends MoveEffectAttr
 * @see {@linkcode apply}
 */
export class SwapArenaTagsAttr extends MoveEffectAttr {
  public SwapTags: ArenaTagType[];

  constructor(SwapTags: ArenaTagType[]) {
    super(true);
    this.SwapTags = SwapTags;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    const tagPlayerTemp = globalScene.arena.findTagsOnSide(
      (t) => this.SwapTags.includes(t.tagType),
      ArenaTagSide.PLAYER,
    );
    const tagEnemyTemp = globalScene.arena.findTagsOnSide((t) => this.SwapTags.includes(t.tagType), ArenaTagSide.ENEMY);

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
