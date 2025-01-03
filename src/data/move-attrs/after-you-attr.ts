import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MovePhase } from "#app/phases/move-phase";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to allow the target to move immediately after the user
 * if the target hasn't moved yet this turn.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/After_You_(move) After You}.
 * @extends MoveEffectAttr
 */
export class AfterYouAttr extends MoveEffectAttr {
  override apply(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    globalScene.queueMessage(i18next.t("moveTriggers:afterYou", { targetName: getPokemonNameWithAffix(target) }));

    //Will find next acting phase of the targeted pokémon, delete it and queue it next on successful delete.
    const nextAttackPhase = globalScene.findPhase<MovePhase>((phase) => phase.pokemon === target);
    if (nextAttackPhase && globalScene.tryRemovePhase((phase: MovePhase) => phase.pokemon === target)) {
      globalScene.prependToPhase(new MovePhase(target, [...nextAttackPhase.targets], nextAttackPhase.move), MovePhase);
    }

    return true;
  }
}
