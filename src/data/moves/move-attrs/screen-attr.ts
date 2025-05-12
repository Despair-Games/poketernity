import { MAJOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_BONUS } from "#app/constants/ai-constants";
import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { isNil } from "#app/utils/common-utils";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";

/**
 * Attribute for moves that set a "screen" with a defensive effect on
 * the user's side for 5 turns.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Light_Screen_(move) | Light Screen} et al.,
 * {@link https://bulbapedia.bulbagarden.net/wiki/Safeguard_(move) | Safeguard},
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Lucky_Chant_(move) | Lucky Chant}.
 */
export class ScreenAttr extends AddArenaTagAttr {
  constructor(tagType: ArenaTagType, failOnOverlap: boolean = true) {
    super(tagType, ArenaTagRelativeSide.USER, { turnCount: 5, failOnOverlap });
  }

  /**
   * Grants a bonus that consists of two components:
   * - A base score bonus based on the move's {@linkcode ArenaTagType}
   * - A 50% chance of (+1) if the user has just entered the field
   * @see {@linkcode getBaseEffectScore}
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const baseScore = this.getBaseEffectScore();
    if (isNil(baseScore)) {
      console.warn(`${this.constructor.name}.getEffectScore: ${ArenaTagType[this.tagType]} tag is not scorable!`);
      return 0;
    }

    const firstTurnBonus = user.battleSummonData.waveTurnCount <= 1 ? this.getRandomScore(user, 50) : 0;

    return baseScore + firstTurnBonus;
  }

  private getBaseEffectScore(): number | undefined {
    switch (this.tagType) {
      case ArenaTagType.LIGHT_SCREEN:
      case ArenaTagType.REFLECT:
        return MINOR_EFFECT_SCORE_BONUS;
      case ArenaTagType.AURORA_VEIL:
        return MAJOR_EFFECT_SCORE_BONUS;
      case ArenaTagType.SAFEGUARD:
        return 0;
      case ArenaTagType.NO_CRIT:
        return 0;
    }
  }
}
