import { type Ability } from "#app/data/ability";
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";
import { UnsuppressableAbilityAbAttr } from "./unsuppressable-ability-ab-attr";

export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    suppressed: BooleanHolder,
    ability: Ability,
  ): boolean {
    if (!ability.hasAttr(UnsuppressableAbilityAbAttr) && !ability.hasAttr(SuppressFieldAbilitiesAbAttr)) {
      suppressed.value = true;
      return true;
    }
    return false;
  }
}
