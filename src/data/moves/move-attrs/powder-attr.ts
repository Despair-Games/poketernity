import { MAJOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Powder_(move) | Powder's}
 * effect. For the rest of the turn, if the target uses a Fire-type move,
 * the move is cancelled, dealing 1/4 max HP damage to the target.
 * @extends AddBattlerTagAttr
 */
export class PowderAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.POWDER, false, { failOnOverlap: true });
  }

  /** Grants (+1) + 60%(+1) if the target is estimated to have a Fire-type attack */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (target.estimateAttackMoves().some((mv) => target.getMoveType(mv) === ElementalType.FIRE)) {
      return this.getRandomScore(user, 60, MAJOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_BONUS);
    }
    return 0;
  }
}
