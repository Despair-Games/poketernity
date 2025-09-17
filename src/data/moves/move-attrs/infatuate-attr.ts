import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

export class InfatuateAttr extends AddBattlerTagAttr {
  constructor(isAttack: boolean = false) {
    super(BattlerTagType.INFATUATED, false, { failOnOverlap: !isAttack });
  }

  /** Has an 80% chance to grant (+1) if the target is the opposite gender of the user */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    if (user.isOppositeGender(target)) {
      return this.getRandomScore(user, 80);
    }
    return 0;
  }
}
