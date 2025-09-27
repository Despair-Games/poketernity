import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { AbAttrCondition } from "#types/ability-types";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Used by Wonder Guard
 */
export class NonSuperEffectiveImmunityAbAttr extends TypeImmunityAbAttr {
  constructor(condition?: AbAttrCondition) {
    // This `AbAttr` ignores the superclass's `immuneType` field and overrides the methods that make use of it
    // TODO: refactor this?
    super(null!, condition);
  }

  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: ValueHolder<boolean>,
    typeMultiplier: ValueHolder<number>,
  ): void {
    cancelled.value = true; // Suppresses "No Effect" message
    super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);
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
