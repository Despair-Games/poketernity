import { Moves } from "#enums/moves";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { IgnoreMoveEffectsAbAttr } from "#app/data/ab-attrs/ignore-move-effect-ab-attr";
import { type Move, getMoveTargets } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import { getStatusEffectHealText } from "#app/data/status-effect";

/**
 * Move attribute that signals that the move should cure a status effect
 * @extends MoveEffectAttr
 * @see {@linkcode apply()}
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

  /** Cures the target of any status effects included in this attribute's {@linkcode effects}. */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    // Special edge case for shield dust blocking Sparkling Aria curing burn
    const moveTargets = getMoveTargets(user, move.id);
    if (
      target.hasAbilityWithAttr(IgnoreMoveEffectsAbAttr)
      && move.id === Moves.SPARKLING_ARIA
      && moveTargets.targets.length === 1
    ) {
      return false;
    }

    const pokemon = this.selfTarget ? user : target;
    if (pokemon.status && this.effects.includes(pokemon.status.effect)) {
      globalScene.queueMessage(getStatusEffectHealText(pokemon.status.effect, getPokemonNameWithAffix(pokemon)));
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
    return user.status ? 10 : 0;
  }
}
