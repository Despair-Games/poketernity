import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { COURT_CHANGE_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Swaps arena effects between the player and enemy side.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Court_Change_(move) | Court Change}
 */
export class SwapArenaTagsAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const { arena, phaseManager } = globalScene;

    const playerTags = arena.getTags((t) => COURT_CHANGE_ARENA_TAG_TYPES.includes(t.tagType), ArenaTagSide.PLAYER);
    const enemyTags = arena.getTags((t) => COURT_CHANGE_ARENA_TAG_TYPES.includes(t.tagType), ArenaTagSide.ENEMY);

    if (playerTags) {
      for (const swapTagsType of playerTags) {
        arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.PLAYER, true);
        arena.addTag(
          swapTagsType.tagType,
          swapTagsType.sourceId!, // TODO: is the bang correct?
          swapTagsType.turnCount,
          swapTagsType.sourceMoveId,
          ArenaTagSide.ENEMY,
          true,
        );
      }
    }
    if (enemyTags) {
      for (const swapTagsType of enemyTags) {
        arena.removeTagOnSide(swapTagsType.tagType, ArenaTagSide.ENEMY, true);
        arena.addTag(
          swapTagsType.tagType,
          swapTagsType.sourceId!, // TODO: is the bang correct?
          swapTagsType.turnCount,
          swapTagsType.sourceMoveId,
          ArenaTagSide.PLAYER,
          true,
        );
      }
    }

    phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:swapArenaTags", { pokemonName: getPokemonNameWithAffix(user) }),
    );
    return true;
  }
}
