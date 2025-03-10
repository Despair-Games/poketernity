import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";
import { MoveCategory } from "#enums/move-category";

export class PostDefendTypeChangeAbAttr extends PostDefendAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): boolean {
    if (attacker.getMoveCategory(pokemon, move) !== MoveCategory.STATUS) {
      if (simulated) {
        return true;
      }
      const type = attacker.getMoveType(move);
      const pokemonTypes = pokemon.getTypes(true);
      if (pokemonTypes.length !== 1 || pokemonTypes[0] !== type) {
        pokemon.summonData.types = [type];
        return true;
      }
    }

    return false;
  }

  override getTriggerMessage(pokemon: Pokemon, abilityName: string, ..._args: any[]): string {
    return i18next.t("abilityTriggers:postDefendTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      typeName: i18next.t(`pokemonInfo:Type.${ElementalType[pokemon.getTypes(true)[0]]}`),
    });
  }
}
