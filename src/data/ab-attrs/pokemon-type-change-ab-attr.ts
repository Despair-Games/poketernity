import { PreAttackAbAttr } from "#app/data/ab-attrs/pre-attack-ab-attr";
import type { Move } from "#app/data/move";
import { NaturePowerAttr } from "#app/data/move-attrs/nature-power-attr";
import { RandomMoveAttr } from "#app/data/move-attrs/random-move-attr";
import { RandomMovesetMoveAttr } from "#app/data/move-attrs/random-moveset-move-attr";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementType } from "#enums/element-type";
import { Moves } from "#enums/moves";
import i18next from "i18next";

/**
 * Ability attribute for changing a pokemon's type before using a move
 * @extends PreAttackAbAttr
 */
export class PokemonTypeChangeAbAttr extends PreAttackAbAttr {
  private moveType: ElementType;

  override apply(pokemon: Pokemon, simulated: boolean, move: Move): boolean {
    if (
      !pokemon.isTerastallized()
      && move.id !== Moves.STRUGGLE
      /**
       * Skip moves that call other moves because these moves generate a following move that will trigger this ability attribute
       * @see {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_call_other_moves}
       */
      && !move.findAttr(
        (attr) =>
          attr instanceof RandomMovesetMoveAttr
          || attr instanceof RandomMoveAttr
          || attr instanceof NaturePowerAttr
          || attr.isCopyMoveAttr(),
      )
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
      moveType: i18next.t(`pokemonInfo:Type.${ElementType[this.moveType]}`),
    });
  }
}
