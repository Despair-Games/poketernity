import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * Ability attribute for Gorilla Tactics
 */
export class GorillaTacticsAbAttr extends PostAttackAbAttr {
  constructor() {
    super(false);
  }

  public override apply(pokemon: Pokemon, simulated: boolean, _defender: Pokemon, _move: Move): void {
    if (simulated) {
      return;
    }

    pokemon.addTag(BattlerTagType.GORILLA_TACTICS);
  }

  public override canApply(...params: Parameters<this["apply"]>): boolean {
    const [pokemon] = params;
    return super.canApply(...params) && !pokemon.hasTag(BattlerTagType.GORILLA_TACTICS);
  }
}
