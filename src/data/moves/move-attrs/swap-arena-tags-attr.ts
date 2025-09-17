import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { ArenaTag } from "#arena-tags/arena-tag";
import { MAJOR_EFFECT_SCORE_BONUS, MAJOR_EFFECT_SCORE_PENALTY, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { COURT_CHANGE_ARENA_TAG_TYPES, HARMFUL_COURT_CHANGE_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { EnemyPokemon } from "#field/enemy-pokemon";
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

  public override applyEffect(user: Pokemon, _target: Pokemon, _move: Move): boolean {
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

    phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:swapArenaTags", { pokemonName: getPokemonNameWithAffix(user) }),
    );
    return true;
  }

  /**
   * @returns The combined score from swapping all active Arena Tags of relevant {@linkcode COURT_CHANGE_ARENA_TAG_TYPES | type}.
   * Each relevant tag yields a {@linkcode MAJOR_EFFECT_SCORE_BONUS} or {@linkcode MAJOR_EFFECT_SCORE_PENALTY},
   * depending on which side the tag is located and whether it is {@link HARMFUL_COURT_CHANGE_ARENA_TAG_TYPES | harmful}.
   * The total bonus from this attribute cannot exceed the {@linkcode SOFT_EFFECT_SCORE_LIMIT}.
   */
  public override getEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const { arena } = globalScene;
    // Tags that will expire at the end of the turn are excluded
    const playerTags = arena.getTags(
      (t) => COURT_CHANGE_ARENA_TAG_TYPES.includes(t.tagType) && t.turnCount !== 1,
      ArenaTagSide.PLAYER,
    );
    const enemyTags = arena.getTags(
      (t) => COURT_CHANGE_ARENA_TAG_TYPES.includes(t.tagType) && t.turnCount !== 1,
      ArenaTagSide.ENEMY,
    );

    /**
     * @returns the total score from the given Arena Tags, assuming they are all on the Player's side of the field.
     * To score tags on the Enemy's side of the field, multiply this by -1.
     */
    const getScore = (tags: ArenaTag[] | undefined): number => {
      return (
        tags?.reduce(
          (score, tag) =>
            score
            + (HARMFUL_COURT_CHANGE_ARENA_TAG_TYPES.includes(tag.tagType)
              ? MAJOR_EFFECT_SCORE_PENALTY
              : MAJOR_EFFECT_SCORE_BONUS),
          0,
        ) ?? 0
      );
    };

    const totalScore = getScore(playerTags) - getScore(enemyTags);
    return Math.min(totalScore, SOFT_EFFECT_SCORE_LIMIT);
  }
}
