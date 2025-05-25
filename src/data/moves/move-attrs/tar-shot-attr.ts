import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Tar_Shot_(move) | Tar Shot's}
 * secondary effect. Doubles the effectiveness of
 * Fire-type moves against the target.
 * @extends AddBattlerTagAttr
 */
export class TarShotAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.TAR_SHOT, false);
  }

  /** Grants 40%(+1) if the user or its ally knows a Fire-type attack */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const userSideKnowsFireAttack = user
      .getField()
      .some((p) => p.getAttackMoves(true).some((mv) => p.getMoveType(mv) === ElementalType.FIRE));

    return userSideKnowsFireAttack ? this.getRandomScore(user, 40) : 0;
  }
}
