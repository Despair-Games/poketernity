import { globalScene } from "#app/global-scene";
import { MAJOR_EFFECT_SCORE_BONUS, MAJOR_EFFECT_SCORE_PENALTY, SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { DEFOG_REMOVABLE_ARENA_TAG_TYPES, ENTRY_HAZARD_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Generic class for removing arena tags
 * @param tagTypes The types of tags that can be removed
 * @param relativeSide The {@linkcode ArenaTagRelativeSide side}
 * (relative to the user) to remove tags from.
 */
export class RemoveArenaTagsAttr extends MoveEffectAttr {
  public tagTypes: ArenaTagType[];
  public relativeSide: ArenaTagRelativeSide;

  constructor(
    tagTypes: ArenaTagType[],
    relativeSide: ArenaTagRelativeSide,
    trigger: MoveEffectTrigger = MoveEffectTrigger.POST_APPLY,
  ) {
    super(true, { trigger });

    this.tagTypes = tagTypes;
    this.relativeSide = relativeSide;
  }

  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const sides: ArenaTagSide[] = [];

    switch (this.relativeSide) {
      case ArenaTagRelativeSide.USER:
        sides.push(user.getArenaTagSide());
        break;
      case ArenaTagRelativeSide.TARGET:
        sides.push(target.getArenaTagSide());
        break;
      case ArenaTagRelativeSide.ALL:
        sides.push(ArenaTagSide.PLAYER, ArenaTagSide.ENEMY);
        break;
    }

    sides.forEach((side) => this.tagTypes.forEach((tagType) => globalScene.arena.removeTagOnSide(tagType, side)));

    return true;
  }

  /**
   * @returns The cumulative score for removing all active tags of relevant {@link tagTypes | type}.
   * Each relevant tag is given a {@link getTagRemovalBonus | base score} according to its
   * tag type, which is then multiplied based on where the tag is located on the field.
   * The total Effect Score from this attribute cannot exceed the {@linkcode SOFT_EFFECT_SCORE_LIMIT}.
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const sides = this.getAffectedTagSides(user, target);
    const affectedTags = globalScene.arena.getTags(
      (t) => this.tagTypes.includes(t.tagType) && [ArenaTagSide.BOTH, ...sides].includes(t.side),
    );

    /**
     * Each {@link affectedTags | tag} contributes its {@link getTagRemovalBonus | base score},
     * multiplied by -1 if the tag only exists on the enemy's (i.e. user's) side
     */
    const totalScore =
      affectedTags?.reduce(
        (score, tag) => score + this.getTagRemovalBonus(tag.tagType) * (tag.side === ArenaTagSide.ENEMY ? -1 : 1),
        0,
      ) ?? 0;

    return Math.min(totalScore, SOFT_EFFECT_SCORE_LIMIT);
  }

  /**
   * @param user - The {@linkcode Pokemon} using the move
   * @param target - The {@linkcode Pokemon} targeted by the move
   * @returns the {@linkcode ArenaTagSide | ArenaTagSides} to which this attribute's effects apply
   */
  private getAffectedTagSides(user: Pokemon, target: Pokemon): ArenaTagSide[] {
    switch (this.relativeSide) {
      case ArenaTagRelativeSide.ALL:
        return [ArenaTagSide.PLAYER, ArenaTagSide.ENEMY];
      case ArenaTagRelativeSide.USER:
        return [user.getArenaTagSide()];
      case ArenaTagRelativeSide.TARGET:
        return [target.getArenaTagSide()];
    }
  }

  /**
   * @returns The base score given for removing an Arena Tag of the given {@linkcode tagType}.
   */
  protected getTagRemovalBonus(tagType: ArenaTagType): number {
    if (ENTRY_HAZARD_ARENA_TAG_TYPES.includes(tagType)) {
      return MAJOR_EFFECT_SCORE_PENALTY;
    }

    if (DEFOG_REMOVABLE_ARENA_TAG_TYPES.includes(tagType)) {
      return MAJOR_EFFECT_SCORE_BONUS;
    }

    return 0;
  }
}
