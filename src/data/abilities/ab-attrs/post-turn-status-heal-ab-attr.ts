import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * This attribute will heal 1/8th HP if the ability pokemon has the correct status.
 * @param effects - The {@linkcode StatusEffect | status effect(s)} that will qualify healing the ability pokemon
 */
export class PostTurnStatusHealAbAttr extends PostTurnAbAttr {
  // TODO: use `NonEmptyArray`
  private readonly effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    super();

    this.effects = effects;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    const abilityName = this.source.name;
    globalScene.phaseManager.createAndUnshiftPhase(
      "PokemonHealPhase",
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

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.hasStatusEffect(this.effects) && !pokemon.isFullHp();
  }
}
