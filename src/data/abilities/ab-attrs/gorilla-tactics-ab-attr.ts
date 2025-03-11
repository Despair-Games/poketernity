import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PostAttackAbAttr } from "./post-attack-ab-attr";

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
