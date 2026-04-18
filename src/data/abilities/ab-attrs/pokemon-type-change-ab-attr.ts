import { PreAttackAbAttr } from "#abilities/pre-attack-ab-attr";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { PreAttackAbAttrParams } from "#types/ab-attr-param-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/** Ability attribute for changing a pokemon's type before using a move */
export class PokemonTypeChangeAbAttr extends PreAttackAbAttr {
  protected override readonly abAttrKey = "PokemonTypeChangeAbAttr";

  constructor() {
    super(true);
  }

  public override apply({ pokemon, simulated, move }: Omit<PreAttackAbAttrParams, "defender">): void {
    if (!simulated) {
      pokemon.setTemporaryTypes(pokemon.getMoveType(move));
      pokemon.updateInfo();
    }
  }

  public override canApply({ pokemon, move }: Parameters<this["apply"]>[0]): boolean {
    return (
      !pokemon.isTerastallized
      && move.id !== MoveId.STRUGGLE
      && !move.attrs.some((attr) => attr.callsOtherMoves)
      && pokemon.getTypes().some((t) => t !== pokemon.getMoveType(move))
    );
  }

  public override getTriggerMessage({ pokemon, move }: Parameters<this["apply"]>[0], _abilityName: string): string {
    return i18next.t("abilityTriggers:pokemonTypeChange", {
      pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
      moveType: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, pokemon.getMoveType(move))}`),
    });
  }
}
