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
 * subsequent move this turn.
 * Used for the {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Pledge_moves Pledge moves}.
 * @extends OverrideMoveEffectAttr
 */
export class AwaitCombinedPledgeAttr extends OverrideMoveEffectAttr {
  constructor() {
    super(true);
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move, overridden: BooleanHolder): boolean {
    if (user.turnData.combiningPledge) {
      // "The two moves have become one!\nIt's a combined move!"
      globalScene.queueMessage(i18next.t("moveTriggers:combiningPledge"));
      return false;
    }

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
