import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Attribute to allow the target to move immediately after the user
 * if the target hasn't moved yet this turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/After_You_(move) | After You}.
 * @extends MoveEffectAttr
 */
export class AfterYouAttr extends MoveEffectAttr {
  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:afterYou", { targetName: getPokemonNameWithAffix(target) }),
    );

    const { turnManager } = globalScene.currentBattle;

    return turnManager.preemptFightCommand((tc) => tc.pokemon === target);
  }
}
