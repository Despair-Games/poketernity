import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Telekinesis_(move) | Telekinesis'}
 * effect. Attacks against the target bypass accuracy checks for 3 turns.
 * @extends AddBattlerTagAttr
 */
export class TelekinesisAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.TELEKINESIS, false, { failOnOverlap: true });
  }

  /**
   * Grants 40%(+1) if the user or its ally have a move with an expected
   * accuracy of less than 80
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (
      user
        .getField()
        .some((p) => p.getMoveset().some((mv) => mv.getMove().calculateBattleAccuracy(p, target, true) < 80))
    ) {
      return this.getRandomScore(user, 40);
    }
    return 0;
  }
}
