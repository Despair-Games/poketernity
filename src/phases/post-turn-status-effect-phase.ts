import type { BattlerIndex } from "#enums/battler-index";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { CommonBattleAnim } from "#app/data/animations/common-battle-anim";
import { CommonAnim } from "#enums/common-anim";
import { getStatusEffectActivationText } from "#app/data/status-effect";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BooleanHolder, NumberHolder } from "#app/utils";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { PhaseId } from "#enums/phase-id";

export class PostTurnStatusEffectPhase extends PokemonPhase {
  override readonly id = PhaseId.POST_TURN_STATUS_EFFECT;

  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  public override start(): void {
    const pokemon = this.getPokemon();

    if (
      pokemon?.isActive(true)
      && pokemon.hasStatusEffect([StatusEffect.BURN, StatusEffect.POISON, StatusEffect.TOXIC], false, true)
    ) {
      pokemon.status!.incrementTurn();

      const cancelled = new BooleanHolder(false);
      applyAbAttrs(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);
      applyAbAttrs(AbAttrFlag.BLOCK_STATUS_DAMAGE, pokemon, false, cancelled);

      if (!cancelled.value) {
        globalScene.queueMessage(
          getStatusEffectActivationText(pokemon.getStatusEffect(true), getPokemonNameWithAffix(pokemon)),
        );

        const damage = new NumberHolder(0);
        switch (pokemon.getStatusEffect(true)) {
          case StatusEffect.POISON:
            damage.value = Math.max(pokemon.getMaxHp() >> 3, 1);
            break;
          case StatusEffect.TOXIC:
            damage.value = Math.max(Math.floor((pokemon.getMaxHp() / 16) * pokemon.status!.toxicTurnCount), 1);
            break;
          case StatusEffect.BURN:
            damage.value = Math.max(pokemon.getMaxHp() >> 4, 1);
            applyAbAttrs(AbAttrFlag.REDUCE_BURN_DAMAGE, pokemon, false, damage);
            break;
        }

        if (damage.value) {
          // Set preventEndure flag to avoid pokemon surviving thanks to focus band, sturdy, endure ...
          globalScene.damageNumberHandler.add(this.getPokemon(), pokemon.damage(damage.value, false, true));
          pokemon.updateInfo();
          applyAbAttrs(AbAttrFlag.POST_DAMAGE, pokemon, false, damage.value);
        }

        new CommonBattleAnim(CommonAnim.POISON + (pokemon.getStatusEffect(true) - 1), pokemon).play(false, () =>
          this.end(),
        );
      } else {
        this.end();
      }
    } else {
      this.end();
    }
  }

  public override end(): void {
    if (globalScene.currentBattle.isClassicFinalBoss) {
      globalScene.initFinalBossPhaseTwo(this.getPokemon());
    } else {
      super.end();
    }
  }
}
