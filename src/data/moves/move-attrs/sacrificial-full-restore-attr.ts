import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { SacrificialAttr } from "#app/data/moves/move-attrs/sacrificial-attr";
import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";

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
    const party = user.getParty();

    // We don't know which party member will be chosen, so pick the highest max HP in the party
    const maxPartyMemberHp = Math.max(...party.map((p) => p.getMaxHp()));

    /**
     * @todo If the incoming Pokemon does not get any HP healed, status healed, or PP restored,
     * There should be an arena tag applied to the field which should expire whenever the heal
     * would be needed
     */
    globalScene.queuePokemonHeal(false, user.getBattlerIndex(), maxPartyMemberHp, {
      message: i18next.t(this.moveTriggerMessage, { pokemonName: getPokemonNameWithAffix(user) }),
      healStatus: true,
      fullRestorePP: this.restorePP,
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
