import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MovePhase } from "#phases/move-phase";
import type { ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to apply the effects of {@linkcode https://bulbapedia.bulbagarden.net/wiki/Magic_Bounce_(Ability) | Magic Bounce}
 * on an incoming move, reflecting the move back to the user.
 * Most of the logic on whether the move meets conditions to be reflected
 * can be found in {@linkcode MovePhase.tryReflectMove}.
 */
export class ReflectMovesAbAttr extends PreDefendAbAttr {
  protected override readonly abAttrKey = "ReflectMovesAbAttr";

  constructor() {
    super(true);
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    reflected: ValueHolder<boolean>,
  ): void {
    reflected.value = true;
  }

  public override canApply(...[, , , , reflected]: Parameters<this["apply"]>): boolean {
    return !reflected.value;
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string, _attacker: Pokemon, move: Move): string {
    // "{pokemonNameWithAffix} bounced the {moveName} back!"
    return i18next.t("abilityTriggers:magicBounceOnReflect", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: move.name,
    });
  }
}
