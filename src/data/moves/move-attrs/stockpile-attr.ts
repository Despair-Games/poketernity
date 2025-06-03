import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Stockpile_(move) | Stockpile}.
 * Adds a {@linkcode BattlerTagType.STOCKPILING | STOCKPILING} stack to the user,
 * which increases the user's defenses and powers up their next use of Spit Up or Swallow.
 * @extends AddBattlerTagAttr
 */
export class StockpileAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.STOCKPILING, true);
  }

  /**
   * Grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} for each of
   * Spit Up and Swallow that the user knows.
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const synergyMoves = [MoveId.SPIT_UP, MoveId.SWALLOW];
    return synergyMoves.filter((mv) => user.hasMove(mv)).length * MINOR_EFFECT_SCORE_BONUS;
  }
}
