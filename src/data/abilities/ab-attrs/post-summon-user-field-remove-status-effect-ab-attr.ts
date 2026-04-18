import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { inSpeedOrder } from "#utils/speed-order-generator";
import { getStatusEffectHealText } from "#utils/status-effect-utils";

/**
 * Removes supplied status effects from the user's field.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Pastel_Veil_(Ability)}
 */
export class PostSummonUserFieldRemoveStatusEffectAbAttr extends PostSummonAbAttr {
  private readonly statusEffects: StatusEffect[];

  constructor(...statusEffects: StatusEffect[]) {
    super();

    this.statusEffects = statusEffects;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    for (const p of inSpeedOrder(pokemon.getArenaTagSide())) {
      if (p.hasStatusEffect(this.statusEffects, false, true)) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          getStatusEffectHealText(p.getStatusEffect(true), getPokemonNameWithAffix(p)),
        );
        p.resetStatus();
        p.updateInfo();
      }
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return pokemon.getField().some((p) => p.isActive(true) && p.hasStatusEffect(this.statusEffects, false, true));
  }
}
