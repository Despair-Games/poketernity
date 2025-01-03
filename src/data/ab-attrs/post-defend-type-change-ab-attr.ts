import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { getPokemonNameWithAffix } from "#app/messages";
import { Type } from "#enums/type";
import i18next from "i18next";
import { PostDefendAbAttr } from "./post-defend-ab-attr";

export class PostDefendTypeChangeAbAttr extends PostDefendAbAttr {
  override applyPostDefend(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    hitResult: HitResult,
    _args: any[],
  ): boolean {
    if (hitResult < HitResult.NO_EFFECT) {
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
      typeName: i18next.t(`pokemonInfo:Type.${Type[pokemon.getTypes(true)[0]]}`),
    });
  }
}
