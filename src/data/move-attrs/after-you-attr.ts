import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MovePhase } from "#app/phases/move-phase";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute for {@linkcode Moves.AFTER_YOU}
 *
 * [After You - Move | Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/After_You_(move))
 */
export class AfterYouAttr extends MoveEffectAttr {
  /**
   * Allows the target of this move to act right after the user.
   *
   * @param _user {@linkcode Pokemon} that is using the move.
   * @param target {@linkcode Pokemon} that will move right after this move is used.
   * @param move {@linkcode Move} {@linkcode Moves.AFTER_YOU}
   * @param _args N/A
   * @returns true
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, _args: any[]): boolean {
    globalScene.queueMessage(i18next.t("moveTriggers:afterYou", { targetName: getPokemonNameWithAffix(target) }));

    //Will find next acting phase of the targeted pokémon, delete it and queue it next on successful delete.
    const nextAttackPhase = globalScene.findPhase<MovePhase>((phase) => phase.pokemon === target);
    if (nextAttackPhase && globalScene.tryRemovePhase((phase: MovePhase) => phase.pokemon === target)) {
      globalScene.prependToPhase(new MovePhase(target, [...nextAttackPhase.targets], nextAttackPhase.move), MovePhase);
    }

    return true;
  }
}
