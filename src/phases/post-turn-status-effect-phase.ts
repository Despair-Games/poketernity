import type { BattlerIndex } from "#app/battle";
import { BlockNonDirectDamageAbAttr } from "#app/data/ab-attrs/block-non-direct-damage-ab-attr";
import { BlockStatusDamageAbAttr } from "#app/data/ab-attrs/block-status-damage-ab-attr";
import { PostDamageAbAttr } from "#app/data/ab-attrs/post-damage-ab-attr";
import { ReduceBurnDamageAbAttr } from "#app/data/ab-attrs/reduce-burn-damage-ab-attr";
import { applyAbAttrs, applyPostDamageAbAttrs } from "#app/data/ability";
import { CommonAnim, CommonBattleAnim } from "#app/data/battle-anims";
import { getStatusEffectActivationText } from "#app/data/status-effect";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, NumberHolder } from "#app/utils";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "./pokemon-phase";

export class PostTurnStatusEffectPhase extends PokemonPhase {
  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  public override start(): void {
    const pokemon = this.getPokemon();

    if (pokemon?.isActive(true) && pokemon.status && pokemon.status.isPostTurn() && !pokemon.switchOutStatus) {
      pokemon.status.incrementTurn();

      const cancelled = new BooleanHolder(false);
      applyAbAttrs(BlockNonDirectDamageAbAttr, pokemon, cancelled);
      applyAbAttrs(BlockStatusDamageAbAttr, pokemon, cancelled);

      if (!cancelled.value) {
        globalScene.queueMessage(
          getStatusEffectActivationText(pokemon.status.effect, getPokemonNameWithAffix(pokemon)),
        );

        const damage = new NumberHolder(0);
        switch (pokemon.status.effect) {
          case StatusEffect.POISON:
            damage.value = Math.max(pokemon.getMaxHp() >> 3, 1);
            break;
          case StatusEffect.TOXIC:
            damage.value = Math.max(Math.floor((pokemon.getMaxHp() / 16) * pokemon.status.toxicTurnCount), 1);
            break;
          case StatusEffect.BURN:
            damage.value = Math.max(pokemon.getMaxHp() >> 4, 1);
            applyAbAttrs(ReduceBurnDamageAbAttr, pokemon, null, false, damage);
            break;
        }

        if (damage.value) {
          // Set preventEndure flag to avoid pokemon surviving thanks to focus band, sturdy, endure ...
          globalScene.damageNumberHandler.add(this.getPokemon(), pokemon.damage(damage.value, false, true));
          pokemon.updateInfo();
          applyPostDamageAbAttrs(PostDamageAbAttr, pokemon, damage.value, pokemon.hasPassive(), false, []);
        }

        new CommonBattleAnim(CommonAnim.POISON + (pokemon.status.effect - 1), pokemon).play(false, () => this.end());
      }
    }

    this.end();
  }

  public override end(): void {
    if (globalScene.currentBattle.isClassicFinalBoss) {
      globalScene.initFinalBossPhaseTwo(this.getPokemon());
    } else {
      super.end();
    }
  }
}
