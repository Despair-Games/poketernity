import { globalScene } from "#app/global-scene";
import type { PendingHealTag } from "#data/arena-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { SacrificialAttr } from "#moves/sacrificial-attr";
import type { MoveConditionFunc } from "#types/MoveConditionFunc";

/**
 * Attr used for moves that faint the user but revive a different Pokemon
 * @protected restorePP - whether or not PP is restored to the revived Pokemon. Lunar dance does this
 * @protected moveMessage - the associated key for the move trigger message
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Healing_Wish_(move) | Healing Wish}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Lunar_Dance_(move) | Lunar Dance}.
 * @extends SacrificialAttr
 */
export class SacrificialFullRestoreAttr extends SacrificialAttr {
  protected restorePP: boolean;
  protected moveTriggerMessage: string;

  constructor(restorePP: boolean, moveTriggerMessage: string) {
    super();

    this.restorePP = restorePP;
    this.moveTriggerMessage = moveTriggerMessage;
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    globalScene.arena.addTag(ArenaTagType.PENDING_HEAL, 0);

    const tag = globalScene.arena.findTag<PendingHealTag>(ArenaTagType.PENDING_HEAL);
    tag?.queueHeal(user.getBattlerIndex(), {
      sourceId: user.id,
      moveId: move.id,
      restorePP: this.restorePP,
      healMessageKey: this.moveTriggerMessage,
    });

    return super.applyEffect(user, target, move);
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return -20;
  }

  /**
   * Only works if there is at least 1 unfainted allowed Pokemon in the party and not already in battle
   * @returns the condition function to add to Move objects with this attribute
   */
  override getCondition(): MoveConditionFunc {
    return (user, _target, _move) =>
      user.getParty().filter((p) => p.isActive()).length > globalScene.currentBattle.getBattlerCount();
  }
}
