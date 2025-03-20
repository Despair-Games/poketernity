import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { CommonBattleAnim } from "#app/data/animations/common-battle-anim";
import { getStatusEffectActivationText } from "#app/data/status-effect";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonPhase } from "#app/phases/abstract-pokemon-phase";
import { BooleanHolder, NumberHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { BattlerIndex } from "#enums/battler-index";
import { CommonAnim } from "#enums/common-anim";
import { PhaseId } from "#enums/phase-id";
import { StatusEffect } from "#enums/status-effect";

export class PostTurnStatusEffectPhase extends PokemonPhase {
  override readonly id = PhaseId.POST_TURN_STATUS_EFFECT;

  constructor(battlerIndex: BattlerIndex) {
    super(battlerIndex);
  }

  public override start(): void {
    const pokemon = this.getPokemon();

    if (!pokemon?.isActive(true)) {
      return this.end();
    }
    if (!pokemon.hasStatusEffect([StatusEffect.BURN, StatusEffect.POISON, StatusEffect.TOXIC], false, true)) {
      return this.end();
    }

    pokemon.status!.incrementTurn();

    const cancelled = new BooleanHolder(false);
    applyAbAttrs(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);
    applyAbAttrs(AbAttrFlag.BLOCK_STATUS_DAMAGE, pokemon, false, cancelled);

    if (cancelled.value) {
      return this.end();
    }

    globalScene.queueMessage(
      getStatusEffectActivationText(pokemon.getStatusEffect(true), getPokemonNameWithAffix(pokemon)),
    );

    const damage = new NumberHolder(0);
    switch (pokemon.getStatusEffect(true)) {
      case StatusEffect.POISON:
        damage.value = pokemon.getMaxHp() / 8;
        break;
      case StatusEffect.TOXIC:
        damage.value = (pokemon.getMaxHp() / 16) * pokemon.status!.toxicTurnCount;
        break;
      case StatusEffect.BURN:
        damage.value = pokemon.getMaxHp() / 16;
        applyAbAttrs(AbAttrFlag.REDUCE_BURN_DAMAGE, pokemon, false, damage);
        break;
    }

    if (damage.value) {
      // Set preventEndure flag to avoid pokemon surviving thanks to focus band, sturdy, endure ...
      pokemon.damageAndUpdate(toDmgValue(damage.value), { preventEndure: true });
      applyAbAttrs(AbAttrFlag.POST_DAMAGE, pokemon, false, damage.value);
    }

    // TODO: this should be handled by some sort of animation manager instead of instantiating a new `CommonBattleAnim` class
    new CommonBattleAnim(CommonAnim.POISON + (pokemon.getStatusEffect(true) - 1), pokemon).play(false, () =>
      this.end(),
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
