import { getPokemonNameWithAffix } from "#app/messages";
import { DamagingTrapTag } from "#battler-tags/damaging-trap-tag";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

export abstract class VortexTrapTag extends DamagingTrapTag {
  override getTrapMessage(pokemon: Pokemon): string {
    return i18next.t("battlerTags:vortexOnTrap", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
}
