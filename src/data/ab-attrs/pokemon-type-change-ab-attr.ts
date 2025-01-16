import type { Move } from "#app/data/move";
import { type CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type NaturePowerAttr } from "#app/data/move-attrs/nature-power-attr";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { Moves } from "#enums/moves";
import { Type } from "#enums/type";
import i18next from "i18next";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

/**
 * Ability attribute for changing a pokemon's type before using a move
 * @extends PreAttackAbAttr
 */
export class PokemonTypeChangeAbAttr extends PreAttackAbAttr {
  private moveType: Type;

  override apply(pokemon: Pokemon, simulated: boolean, move: Move): boolean {
    if (
      !pokemon.isTerastallized()
      && move.id !== Moves.STRUGGLE
      /**
       * Skip moves that call other moves because these moves generate a following move that will trigger this ability attribute
       * @see {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_call_other_moves}
       */
      && !move.findAttr((attr: CallMoveAttr | NaturePowerAttr) => attr.callsOtherMoves)
    ) {
      const moveType = pokemon.getMoveType(move);

      if (pokemon.getTypes().some((t) => t !== moveType)) {
        if (!simulated) {
          this.moveType = moveType;
          pokemon.summonData.types = [moveType];
          pokemon.updateInfo();
        }

        return true;
      }
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:pokemonTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveType: i18next.t(`pokemonInfo:Type.${Type[this.moveType]}`),
    });
  }
}
