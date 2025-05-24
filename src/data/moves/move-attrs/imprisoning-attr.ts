import { SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Imprison_(move) | Imprison's} effect.
 * Prevents the user's opponents from selecting or using moves
 * known by the user.
 * @extends AddBattlerTagAttr
 */
export class ImprisoningAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.IMPRISONING, true, { failOnOverlap: true });
  }

  /**
   * Grants (+1) for every move an opponent has revealed that is also
   * known by the user, up to the {@linkcode SOFT_EFFECT_SCORE_LIMIT}.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const numOppMatchingMoves = user
      .getOpponents()
      .flatMap((opp) => [...opp.waveData.revealedMoves])
      .filter((moveId) => user.hasMove(moveId)).length;

    return Math.min(numOppMatchingMoves, SOFT_EFFECT_SCORE_LIMIT);
  }
}
