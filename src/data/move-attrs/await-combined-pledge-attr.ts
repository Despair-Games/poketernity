import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MovePhase } from "#app/phases/move-phase";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

/**
 * Attribute that cancels the associated move's effects when set to be combined with the user's ally's
 * subsequent move this turn. Used for Grass Pledge, Water Pledge, and Fire Pledge.
 * @extends OverrideMoveEffectAttr
 */
export class AwaitCombinedPledgeAttr extends OverrideMoveEffectAttr {
  constructor() {
    super(true);
  }
  /**
   * If the user's ally is set to use a different move with this attribute,
   * defer this move's effects for a combined move on the ally's turn.
   * @param user the {@linkcode Pokemon} using this move
   * @param _target n/a
   * @param move the {@linkcode Move} being used
   * @param args
   * - [0] a {@linkcode BooleanHolder} indicating whether the move's base
   * effects should be overridden this turn.
   * @returns `true` if base move effects were overridden; `false` otherwise
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move, args: any[]): boolean {
    if (user.turnData.combiningPledge) {
      // "The two moves have become one!\nIt's a combined move!"
      globalScene.queueMessage(i18next.t("moveTriggers:combiningPledge"));
      return false;
    }

    const overridden = args[0] as BooleanHolder;

    const allyMovePhase = globalScene.findPhase<MovePhase>(
      (phase) => phase instanceof MovePhase && phase.pokemon.isPlayer() === user.isPlayer(),
    );
    if (allyMovePhase) {
      const allyMove = allyMovePhase.move.getMove();
      if (allyMove !== move && allyMove.hasAttr(AwaitCombinedPledgeAttr)) {
        [user, allyMovePhase.pokemon].forEach((p) => (p.turnData.combiningPledge = move.id));

        // "{userPokemonName} is waiting for {allyPokemonName}'s move..."
        globalScene.queueMessage(
          i18next.t("moveTriggers:awaitingPledge", {
            userPokemonName: getPokemonNameWithAffix(user),
            allyPokemonName: getPokemonNameWithAffix(allyMovePhase.pokemon),
          }),
        );

        // Move the ally's MovePhase (if needed) so that the ally moves next
        const allyMovePhaseIndex = globalScene.phaseQueue.indexOf(allyMovePhase);
        const firstMovePhaseIndex = globalScene.phaseQueue.findIndex((phase) => phase instanceof MovePhase);
        if (allyMovePhaseIndex !== firstMovePhaseIndex) {
          globalScene.prependToPhase(globalScene.phaseQueue.splice(allyMovePhaseIndex, 1)[0], MovePhase);
        }

        overridden.value = true;
        return true;
      }
    }
    return false;
  }
}
