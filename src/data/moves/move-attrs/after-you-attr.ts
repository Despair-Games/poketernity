import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to allow the target to move immediately after the user
 * if the target hasn't moved yet this turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/After_You_(move) | After You}.
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
