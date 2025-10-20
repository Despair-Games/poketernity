import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { getStatusEffectHealText } from "#utils/status-effect-utils";

/**
 * Removes supplied status effects from the user's field. Used by Pastel Veil.
 */
export class PostSummonUserFieldRemoveStatusEffectAbAttr extends PostSummonAbAttr {
  private readonly statusEffects: StatusEffect[];

  constructor(...statusEffect: StatusEffect[]) {
    super();

    this.statusEffects = statusEffect;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (simulated) {
      return;
    }

    const affectedPokemon = pokemon.getField().filter((p) => p.isActive(true));
    affectedPokemon.forEach((p) => {
      if (p.hasStatusEffect(this.statusEffects, false, true)) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          getStatusEffectHealText(p.getStatusEffect(true), getPokemonNameWithAffix(p)),
        );
        p.resetStatus();
        p.updateInfo();
      }
    });
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    return pokemon.getField().some((p) => p.isActive(true) && p.hasStatusEffect(this.statusEffects, false, true));
  }
}
