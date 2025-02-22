import { MoveId } from "#enums/move-id";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { type Move, getMoveTargets } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import { getStatusEffectHealText } from "#app/data/status-effect";
import { AbAttrFlag } from "#enums/ab-attr-flag";

/**
 * Move attribute to cure a set of {@linkcode StatusEffect | status effects}
 * from the user or target, depending on if the effect is {@linkcode selfTarget | self-targeted}.
 * @extends MoveEffectAttr
 */
export class HealStatusEffectAttr extends MoveEffectAttr {
  /** List of Status Effects to cure */
  private effects: StatusEffect[];

  /**
   * @param selfTarget - Whether this move targets the user
   * @param effects - status effect or list of status effects to cure
   */
  constructor(selfTarget: boolean, effects: StatusEffect | StatusEffect[]) {
    super(selfTarget, { lastHitOnly: true });
    this.effects = [effects].flat(1);
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    // Special edge case for shield dust blocking Sparkling Aria curing burn
    const moveTargets = getMoveTargets(user, move.id);
    if (
      target.hasAbilityWithAttr(AbAttrFlag.IGNORE_MOVE_EFFECTS)
      && move.id === MoveId.SPARKLING_ARIA
      && moveTargets.targets.length === 1
    ) {
      return false;
    }

    const pokemon = this.selfTarget ? user : target;
    if (pokemon.hasStatusEffect(this.effects, false, true)) {
      globalScene.queueMessage(getStatusEffectHealText(pokemon.getStatusEffect(true), getPokemonNameWithAffix(pokemon)));
      pokemon.resetStatus();
      pokemon.updateInfo();

      return true;
    }

    return false;
  }

  isOfEffect(effect: StatusEffect): boolean {
    return this.effects.includes(effect);
  }

  override getUserBenefitScore(user: Pokemon, _target: Pokemon, _move: Move): number {
    return user.hasNonVolatileStatusEffect(false, true) ? 10 : 0;
  }
}
