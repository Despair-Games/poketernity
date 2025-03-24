import { MoveLockTag } from "#app/data/battler-tags/move-lock-tag";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

/**
 * Puts the source {@linkcode Pokemon} into a "frenzy", locking them into using the tag's
 * move for `turnCount - 1` turns. If this effect isn't interrupted,
 * the source {@linkcode Pokemon} becomes confused at the end of those turns.
 * @extends MoveLockTag
 */
export class FrenzyTag extends MoveLockTag {
  constructor(turnCount: number, sourceMoveId: MoveId) {
    super(BattlerTagType.FRENZY, turnCount, sourceMoveId);
  }

  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    if (this.turnCount <= 0) {
      // Only add CONFUSED tag if a disruption occurs on the final confusion-inducing turn of FRENZY
      pokemon.addTag(BattlerTagType.CONFUSED, pokemon.randSeedIntRange(2, 4));
    }
  }
}
