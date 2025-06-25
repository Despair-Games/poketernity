// -- start tsdoc imports
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { MovePhase } from "#phases/move-phase";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports

import { PreDefendAbAttr } from "#abilities/pre-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to apply the effects of {@linkcode https://bulbapedia.bulbagarden.net/wiki/Magic_Bounce_(Ability) | Magic Bounce}
 * on an incoming move, reflecting the move back to the user.
 * Most of the logic on whether the move meets conditions to be reflected
 * can be found in {@linkcode MovePhase.tryReflectMove}.
 */
export class ReflectMovesAbAttr extends PreDefendAbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.REFLECT_MOVES);
  }

  public override apply(
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

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string, _attacker: Pokemon, move: Move): string {
    // "{pokemonNameWithAffix} bounced the {moveName} back!"
    return i18next.t("abilityTriggers:magicBounceOnReflect", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveName: move.name,
    });
  }
}
