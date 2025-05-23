import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to add a {@linkcode BattlerTag} to the user or target
 * with no change to the move's {@linkcode Move.getEffectScore | Effect Score}.
 * @extends AddBattlerTagAttr
 */
export class AddUnscoredBattlerTagAttr extends AddBattlerTagAttr {
  public override getEffectScore(_user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    return 0;
  }
}
