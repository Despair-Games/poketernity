import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/** @see {@link https://bulbapedia.bulbagarden.net/wiki/Color_Change_(Ability) | Color Change (Bulbapedia)} */
export class PostDefendTypeChangeAbAttr extends PostDefendAbAttr {
  public override apply({ pokemon, simulated, attacker, move }: PostDefendAbAttrParams): void {
    if (simulated) {
      return;
    }

    const moveType = attacker.getMoveType(move);
    pokemon.setTemporaryTypes(moveType);
  }

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    const moveType = attacker.getMoveType(move);
    const pokemonTypes = pokemon.getTypes(true, true);
    return move.isAttackMove(attacker, pokemon) && !pokemon.isTerastallized && !pokemonTypes.includes(moveType);
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, pokemon.getTypes(true)[0])}`),
    });
  }
}
