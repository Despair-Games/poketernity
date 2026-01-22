import { PostAttackAbAttr } from "#abilities/post-attack-ab-attr";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { PostAttackAbAttrParams } from "#types/ab-attr-param-types";

/** Ability attribute for {@link https://bulbapedia.bulbagarden.net/wiki/Gorilla_Tactics_(Ability) | Gorilla Tactics (Bulbapedia)} */
export class GorillaTacticsAbAttr extends PostAttackAbAttr {
  constructor() {
    super(false);
  }

  public override apply({ pokemon, simulated }: PostAttackAbAttrParams): void {
    if (simulated) {
      return;
    }

    pokemon.addTag(BattlerTagType.GORILLA_TACTICS);
  }

  public override canApply(params: Parameters<this["apply"]>[0]): boolean {
    const { pokemon } = params;
    return super.canApply(params) && !pokemon.hasTag(BattlerTagType.GORILLA_TACTICS);
  }
}
