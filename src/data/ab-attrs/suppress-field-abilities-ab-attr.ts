import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { type Ability } from "../ability";
import { UnsuppressableAbilityAbAttr } from "./unsuppressable-ability-ab-attr";
import { AbAttr } from "./ab-attr";

export class SuppressFieldAbilitiesAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const ability = args[0] as Ability;
    if (!ability.hasAttr(UnsuppressableAbilityAbAttr) && !ability.hasAttr(SuppressFieldAbilitiesAbAttr)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
