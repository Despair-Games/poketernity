import { PreAttackAbAttr } from "#app/data/ab-attrs/pre-attack-ab-attr";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Ability attribute for changing a pokemon's type before using a move
 * @extends PreAttackAbAttr
 */
export class PokemonTypeChangeAbAttr extends PreAttackAbAttr {
  private moveType: ElementalType;

  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POKEMON_TYPE_CHANGE);
  }

  override apply(pokemon: Pokemon, simulated: boolean, move: Move): boolean {
    if (
      !pokemon.isTerastallized()
      && move.id !== MoveId.STRUGGLE
      /**
       * Skip moves that call other moves because these moves generate a following move that will trigger this ability attribute
       * @see {@link https://bulbapedia.bulbagarden.net/wiki/Category:Moves_that_call_other_moves}
       */
      && !move.findAttr(
        (attr) =>
          attr.isRandomMovesetMoveAttr()
          || attr.isRandomMoveAttr()
          || attr.isNaturePowerAttr()
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
      moveType: i18next.t(`pokemonInfo:Type.${ElementalType[this.moveType]}`),
    });
  }
}
