import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * This attribute will heal 1/8th HP if the ability pokemon has the correct status.
 * @param effects The {@linkcode StatusEffect | status effect(s)} that will qualify healing the ability pokemon
 * @extends PostTurnAbAttr
 */
export class PostTurnStatusHealAbAttr extends PostTurnAbAttr {
  private readonly statusEffects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    super(false);

    this.statusEffects = effects;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (pokemon.hasStatusEffect(this.statusEffects)) {
      if (!pokemon.isFullHp()) {
        if (!simulated) {
          const abilityName = this.source.name;
          globalScene.phaseManager.queuePokemonHealPhase(
            pokemon.getBattlerIndex(),
            toDmgValue(pokemon.getMaxHp() / 8),
            {
              message: i18next.t("abilityTriggers:poisonHeal", {
                pokemonName: getPokemonNameWithAffix(pokemon),
                abilityName,
              }),
            },
          );
        }
        return true;
      }
    }
    return false;
  }
}
