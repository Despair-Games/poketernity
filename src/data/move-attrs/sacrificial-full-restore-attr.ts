import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { SacrificialAttr } from "#app/data/move-attrs/sacrificial-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attr used for moves that faint the user but revive a different Pokemon
 * @protected restorePP - whether or not PP is restored to the revived Pokemon. Lunar dance does this
 * @protected moveMessage - the associated key for the move trigger message
 * Used by healing wish and lunar dance
 */
export class SacrificialFullRestoreAttr extends SacrificialAttr {
  protected restorePP: boolean;
  protected moveTriggerMessage: string;

  constructor(restorePP: boolean, moveTriggerMessage: string) {
    super();

    this.restorePP = restorePP;
    this.moveTriggerMessage = moveTriggerMessage;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }

    // We don't know which party member will be chosen, so pick the highest max HP in the party
    const maxPartyMemberHp = globalScene
      .getPlayerParty()
      .map((p) => p.getMaxHp())
      .reduce((maxHp: number, hp: number) => Math.max(hp, maxHp), 0);

    globalScene.pushPhase(
      new PokemonHealPhase(
        user.getBattlerIndex(),
        maxPartyMemberHp,
        i18next.t(this.moveTriggerMessage, { pokemonName: getPokemonNameWithAffix(user) }),
        true,
        false,
        false,
        true,
        false,
        this.restorePP,
      ),
      true,
    );

    return true;
  }

  override getUserBenefitScore(_user: Pokemon, _target: Pokemon, _move: Move): number {
    return -20;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) =>
      globalScene.getPlayerParty().filter((p) => p.isActive()).length > globalScene.currentBattle.getBattlerCount();
  }
}
