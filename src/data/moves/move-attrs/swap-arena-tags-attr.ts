import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ArenaTagType } from "#enums/arena-tag-type";
import i18next from "i18next";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "./move-effect-attr";

export const courtChangeArenaTags = [
  ArenaTagType.AURORA_VEIL,
  ArenaTagType.LIGHT_SCREEN,
  ArenaTagType.MIST,
  ArenaTagType.REFLECT,
  ArenaTagType.SPIKES,
  ArenaTagType.STEALTH_ROCK,
  ArenaTagType.SHARP_STEEL,
  ArenaTagType.STICKY_WEB,
  ArenaTagType.TAILWIND,
  ArenaTagType.TOXIC_SPIKES,
  ArenaTagType.SAFEGUARD,
  ArenaTagType.GRASS_WATER_PLEDGE,
  ArenaTagType.FIRE_GRASS_PLEDGE,
  ArenaTagType.WATER_FIRE_PLEDGE,
  ArenaTagType.G_MAX_VINE_LASH,
  ArenaTagType.G_MAX_WILDFIRE,
  ArenaTagType.G_MAX_CANNONADE,
  ArenaTagType.G_MAX_VOLCALITH,
];

/**
 * Swaps arena effects between the player and enemy side.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Court_Change_(move) | Court Change}
 * @extends MoveEffectAttr
 */
export class SwapArenaTagsAttr extends MoveEffectAttr {
  public swappableTags: ArenaTagType[];

  constructor(SwapTags: ArenaTagType[]) {
    super(true);
    this.swappableTags = SwapTags;
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
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
          swapTagsType.sourceId!,
          swapTagsType.turnCount,
          swapTagsType.sourceMoveId,
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
          swapTagsType.sourceId!,
          swapTagsType.turnCount,
          swapTagsType.sourceMoveId,
          ArenaTagSide.PLAYER,
          true,
        ); // TODO: is the bang correct?
      }
    }

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:swapArenaTags", { pokemonName: getPokemonNameWithAffix(user) }),
    );
    return true;
  }
}
