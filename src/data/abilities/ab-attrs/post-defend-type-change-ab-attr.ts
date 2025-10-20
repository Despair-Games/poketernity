import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

export class PostDefendTypeChangeAbAttr extends PostDefendAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean, attacker: Pokemon, move: Move): void {
    if (simulated) {
      return;
    }

    const moveType = attacker.getMoveType(move);
    const pokemonTypes = pokemon.getTypes(true, true);
    if (pokemonTypes.length !== 1 || pokemonTypes[0] !== moveType) {
      pokemon.setTemporaryTypes(moveType);
    }
  }

  public override canApply(...[pokemon, , attacker, move]: Parameters<this["apply"]>): boolean {
    return move.isAttackMove(attacker, pokemon) && !pokemon.isTerastallized;
  }

  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, pokemon.getTypes(true)[0])}`),
    });
  }
}
