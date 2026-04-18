import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { MovePhase } from "#phases/move-phase";
import type { ReflectMovesAbAttrParams } from "#types/ab-attr-param-types";
import i18next from "i18next";

/**
 * Attribute to reflect a move back to the user.
 * @remarks
 * Most of the logic on whether the move meets conditions to be reflected
 * can be found in {@linkcode MovePhase.tryReflectMove}.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Magic_Bounce_(Ability)}
 */
export class ReflectMovesAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "ReflectMovesAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ reflected }: ReflectMovesAbAttrParams): void {
    reflected.value = true;
  }

  public override canApply({ reflected }: Parameters<this["apply"]>[0]): boolean {
    return !reflected.value;
  }

  public override getTriggerMessage({ pokemon, move }: Parameters<this["apply"]>[0]): string {
    // "{pokemonNameWithAffix} bounced the {moveName} back!"
    return i18next.t("abilityTriggers:magicBounceOnReflect", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: move.name,
    });
  }
}
