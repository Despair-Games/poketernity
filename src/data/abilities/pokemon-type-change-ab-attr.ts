import type Pokemon from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { Moves } from "#enums/moves";
import { Type } from "#enums/type";
import i18next from "i18next";
import type Move from "../move";
import { CopyMoveAttr, NaturePowerAttr, RandomMoveAttr, RandomMovesetMoveAttr } from "../move";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

/** Ability attribute for changing a pokemon's type before using a move */
export class PokemonTypeChangeAbAttr extends PreAttackAbAttr {
  private moveType: Type;

  constructor() {
    super(true);
  }

  override applyPreAttack(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _defender: Pokemon,
    move: Move,
    _args: any[],
  ): boolean {
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
          || attr instanceof CopyMoveAttr,
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
      moveType: i18next.t(`pokemonInfo:Type.${Type[this.moveType]}`),
    });
  }
}
