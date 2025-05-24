import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Torment_(move) | Torment}.
 * Prevents the target from using the same move twice in a row.
 * @extends AddBattlerTagAttr
 */
export class TormentAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.TORMENT, false, { failOnOverlap: true });
  }

  /** Has a 40% chance to grant (+1) */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return this.getRandomScore(user, 40);
  }
}
