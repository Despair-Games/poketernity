import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { allMoves } from "#data/data-lists";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveFlags } from "#enums/move-flags";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Throat_Chop_(move) | Throat Chop's}
 * secondary effect. Prevents the target from selecting or using
 * {@link MoveFlags.SOUND_MOVE | sound-based moves} for 2 turns.
 * @extends AddBattlerTagAttr
 */
export class ThroatChopAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.THROAT_CHOPPED);
  }

  /**
   * Grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} if the target
   * is known to have a {@link MoveFlags.SOUND_MOVE | sound-based move}
   */
  public override getEffectScore(_user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if ([...target.waveData.revealedMoves].some((mvId) => allMoves.get(mvId).checkFlag(MoveFlags.SOUND_MOVE, target))) {
      return MINOR_EFFECT_SCORE_BONUS;
    }
    return 0;
  }
}
