import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Used by Wonder Guard
 */
export class NonSuperEffectiveImmunityAbAttr extends TypeImmunityAbAttr {
  constructor() {
    // This `AbAttr` ignores the superclass's `immuneType` field and overrides the methods that make use of it
    // TODO: refactor this?
    super(null!);
  }

  public override canApply(...[, , , move, , typeMultiplier]: Parameters<this["apply"]>): boolean {
    return move.isAttackMove() && typeMultiplier.value < 2;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:nonSuperEffectiveImmunity", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
    });
  }
}
