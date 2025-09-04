import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { BlockNonDirectDamageAbAttr } from "#abilities/block-non-direct-damage-ab-attr";
import type { BlockStatusDamageAbAttr } from "#abilities/block-status-damage-ab-attr";
import type { ReduceBurnDamageAbAttr } from "#abilities/reduce-burn-damage-ab-attr";
import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { CommonAnim } from "#enums/common-anim";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { BooleanHolder, NumberHolder, toDmgValue } from "#utils/common-utils";
import { getStatusEffectActivationText } from "#utils/status-effect-utils";

export class PostTurnStatusEffectPhase extends PokemonPhase {
  public override readonly phaseName = "PostTurnStatusEffectPhase";

  public override start(): void {
    const pokemon = this.getPokemon();

    if (!pokemon?.isActive(true)) {
      this.end();
      return;
    }
    if (!pokemon.hasStatusEffect([StatusEffect.BURN, StatusEffect.POISON, StatusEffect.TOXIC], false, true)) {
      this.end();
      return;
    }

    pokemon.advanceStatusCounter();

    const cancelled = new BooleanHolder(false);
    applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);
    applyAbAttrs<BlockStatusDamageAbAttr>(AbAttrFlag.BLOCK_STATUS_DAMAGE, pokemon, false, cancelled);

    if (cancelled.value) {
      this.end();
      return;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      getStatusEffectActivationText(pokemon.getStatusEffect(true), getPokemonNameWithAffix(pokemon)),
    );

    const damage = new NumberHolder(0);
    switch (pokemon.getStatusEffect(true)) {
      case StatusEffect.POISON:
        damage.value = pokemon.getMaxHp() / 8;
        break;
      case StatusEffect.TOXIC:
        damage.value = (pokemon.getMaxHp() / 16) * pokemon.toxicTurnCount;
        break;
      case StatusEffect.BURN:
        damage.value = pokemon.getMaxHp() / 16;
        applyAbAttrs<ReduceBurnDamageAbAttr>(AbAttrFlag.REDUCE_BURN_DAMAGE, pokemon, false, damage);
        break;
    }

    if (damage.value) {
      // Set preventEndure flag to avoid pokemon surviving thanks to focus band, sturdy, endure ...
      pokemon.damageAndUpdate(toDmgValue(damage.value), { preventEndure: true });
    }

    // TODO: this should be handled by some sort of animation manager instead of instantiating a new `CommonBattleAnim` class
    new CommonBattleAnim((CommonAnim.POISON + (pokemon.getStatusEffect(true) - 1)) as CommonAnim, pokemon).play(
      false,
      () => this.end(),
    );
  }

  public override end(): void {
    if (globalScene.currentBattle.isClassicFinalBoss) {
      globalScene.initFinalBossPhaseTwo(this.getPokemon());
    } else {
      super.end();
    }
  }
}
