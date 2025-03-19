// -- start tsdoc imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MovePhase } from "#app/phases/move-phase";
// -- end tsdoc imports
import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import i18next from "i18next";
import { PreDefendAbAttr } from "./pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Move } from "#app/data/moves/move";

/**
 * Attribute to apply the effects of {@linkcode https://bulbapedia.bulbagarden.net/wiki/Magic_Bounce_(Ability) | Magic Bounce}
 * on an incoming move, reflecting the move back to the user.
 * Most of the logic on whether the move meets conditions to be reflected
 * can be found in {@linkcode MovePhase.tryReflectMove}.
 * @extends PreDefendAbAttr
 */
export class ReflectMovesAbAttr extends PreDefendAbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.REFLECT_MOVES);
  }

  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    reflected: BooleanHolder,
  ): boolean {
    if (!reflected.value) {
      reflected.value = true;
      return true;
    }
    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, _attacker: Pokemon, move: Move): string {
    // "{pokemonNameWithAffix} bounced the {moveName} back!"
    return i18next.t("abilityTriggers:magicBounceOnReflect", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: move.name,
    });
  }
}
