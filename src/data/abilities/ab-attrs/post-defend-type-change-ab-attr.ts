import { PostDefendAbAttr } from "#abilities/post-defend-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import { TypelessAttr } from "#moves/typeless-attr";
import type { PostDefendAbAttrParams } from "#types/ab-attr-param-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/** @see {@link https://bulbapedia.bulbagarden.net/wiki/Color_Change_(Ability)} */
export class PostDefendTypeChangeAbAttr extends PostDefendAbAttr {
  private type: ElementalType;

  public override canApply({ pokemon, attacker, move }: Parameters<this["apply"]>[0]): boolean {
    if (pokemon.isTerastallized) {
      return false;
    }

    if (!move.isAttackMove(attacker, pokemon)) {
      return false;
    }

    if (move.hasAttr(TypelessAttr)) {
      return false;
    }

    if (attacker.turnData.hitsLeft > 1) {
      return false;
    }

    this.type = attacker.getMoveType(move);

    if (pokemon.isOfType(this.type, true, true)) {
      return false;
    }

    return true;
  }

  public override apply({ pokemon, simulated }: PostDefendAbAttrParams): void {
    if (simulated) {
      return;
    }

    pokemon.setTemporaryTypes(this.type);
  }

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0], abilityName: string): string {
    return i18next.t("abilityTriggers:postDefendTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      abilityName,
      typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, this.type)}`),
    });
  }
}
