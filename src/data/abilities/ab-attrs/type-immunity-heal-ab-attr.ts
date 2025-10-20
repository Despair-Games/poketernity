import { TypeImmunityAbAttr } from "#abilities/type-immunity-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { toDmgValue, type ValueHolder } from "#utils/common-utils";
import i18next from "i18next";

export class TypeImmunityHealAbAttr extends TypeImmunityAbAttr {
  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    attacker: Pokemon,
    move: Move,
    cancelled: ValueHolder<boolean>,
    typeMultiplier: ValueHolder<number>,
  ): void {
    super.apply(pokemon, simulated, attacker, move, cancelled, typeMultiplier);

    if (pokemon.isFullHp() || simulated) {
      return;
    }

    const abilityName = this.source.name;
    globalScene.phaseManager.createAndUnshiftPhase(
      "PokemonHealPhase",
      pokemon.getBattlerIndex(),
      toDmgValue(pokemon.getMaxHp() / 4),
      {
        message: i18next.t("abilityTriggers:typeImmunityHeal", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        }),
      },
    );
  }

  // The healing effect from this attribute takes the place of the trigger message if it can be applied
  public override getTriggerMessage(pokemon: Pokemon, abilityName: string): string | null {
    return pokemon.isFullHp() ? super.getTriggerMessage(pokemon, abilityName) : null;
  }
}
