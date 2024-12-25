import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { type BooleanHolder, toDmgValue } from "#app/utils";
import type { Type } from "#enums/type";
import i18next from "i18next";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

export class TypeImmunityHealAbAttr extends TypeImmunityAbAttr {
  constructor(immuneType: Type) {
    super(immuneType);
  }

  override applyPreDefend(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const ret = super.applyPreDefend(pokemon, passive, simulated, attacker, move, cancelled, args);

    if (ret) {
      if (!pokemon.isFullHp() && !simulated) {
        const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
        globalScene.unshiftPhase(
          new PokemonHealPhase(pokemon.getBattlerIndex(), toDmgValue(pokemon.getMaxHp() / 4), {
            message: i18next.t("abilityTriggers:typeImmunityHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              abilityName,
            }),
          }),
        );
        cancelled.value = true; // Suppresses "No Effect" message
      }
      return true;
    }

    return false;
  }
}
