import type { Move } from "#app/data/moves/move";
import { AddArenaTagAttr } from "#app/data/moves/move-attrs/add-arena-tag-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import { ArenaTagType } from "#enums/arena-tag-type";

/**
 * Attribute to apply the effect of {@link https://bulbapedia.bulbagarden.net/wiki/Mist_(move) | Mist}.
 * Protects the user and its party from having their stat stages
 * reduced by other Pokemon for 5 turns.
 * @extends AddArenaTagAttr
 */
export class MistAttr extends AddArenaTagAttr {
  constructor() {
    super(ArenaTagType.MIST, ArenaTagRelativeSide.USER, { turnCount: 5, failOnOverlap: true });
  }

  /** Has a 30% chance to grant (+1) on the user's first turn after entering battle */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (user.battleSummonData.waveTurnCount <= 1) {
      return this.getRandomScore(user, 30);
    }
    return 0;
  }
}
