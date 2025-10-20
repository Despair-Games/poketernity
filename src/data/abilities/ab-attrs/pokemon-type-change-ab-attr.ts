import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Ability attribute for changing a pokemon's type before using a move
 */
export class PokemonTypeChangeAbAttr extends PreAttackAbAttr {
  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.POKEMON_TYPE_CHANGE);
  }

  public override apply(pokemon: Pokemon, simulated: boolean, move: Move): void {
    if (!simulated) {
      pokemon.setTemporaryTypes(pokemon.getMoveType(move));
      pokemon.updateInfo();
    }
  }

  public override canApply(...[pokemon, , move]: Parameters<this["apply"]>): boolean {
    return (
      !pokemon.isTerastallized
      && move.id !== MoveId.STRUGGLE
      && !move.attrs.some((attr) => attr.callsOtherMoves)
      && pokemon.getTypes().some((t) => t !== pokemon.getMoveType(move))
    );
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string, move: Move): string {
    return i18next.t("abilityTriggers:pokemonTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveType: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, pokemon.getMoveType(move))}`),
    });
  }
}
