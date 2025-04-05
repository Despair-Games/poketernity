import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { type BooleanHolder, type NumberHolder, toDmgValue } from "#app/utils";
import type { ElementalType } from "#enums/elemental-type";
import i18next from "i18next";
import { TypeImmunityAbAttr } from "./type-immunity-ab-attr";

export class TypeImmunityHealAbAttr extends TypeImmunityAbAttr {
  constructor(immuneType: ElementalType) {
    super(immuneType);
  }

  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: BooleanHolder,
    typeMultiplier: NumberHolder,
  ): boolean {
    const ret = super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);

    if (ret) {
      if (!pokemon.isFullHp() && !simulated) {
        const abilityName = this.source.name;
        globalScene.phaseManager.queuePokemonHealPhase(
          true,
          pokemon.getBattlerIndex(),
          toDmgValue(pokemon.getMaxHp() / 4),
          {
            message: i18next.t("abilityTriggers:typeImmunityHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              abilityName,
            }),
          },
        );
        cancelled.value = true; // Suppresses "No Effect" message
      }
      return true;
    }

    return false;
  }
}
