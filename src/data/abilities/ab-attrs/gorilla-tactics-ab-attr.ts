import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * Ability attribute for Gorilla Tactics
 * @extends PostAttackAbAttr
 */
export class GorillaTacticsAbAttr extends PostAttackAbAttr {
  constructor() {
    super(false, false);
  }

  override applyPostAttack(pokemon: Pokemon, simulated: boolean, _defender: Pokemon, _move: Move): boolean {
    if (simulated) {
      return simulated;
    }

    if (pokemon.getTag(BattlerTagType.GORILLA_TACTICS)) {
      return false;
    }

    pokemon.addTag(BattlerTagType.GORILLA_TACTICS);
    return true;
  }
}
