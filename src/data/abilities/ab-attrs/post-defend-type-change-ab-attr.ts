import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import i18next from "i18next";

export class PostDefendTypeChangeAbAttr extends PostDefendAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS) {
      if (simulated) {
        return true;
      }
      const moveType = attacker.getMoveType(move);
      const pokemonTypes = pokemon.getTypes(true);
      if (pokemonTypes.length !== 1 || pokemonTypes[0] !== moveType) {
        pokemon.setTemporaryTypes(moveType);
        return true;
      }
    }

    return false;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      typeName: i18next.t(`pokemonInfo:Type.${ElementalType[pokemon.getTypes(true)[0]]}`),
    });
  }
}
