import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { OverrideMoveEffectAttr } from "#moves/override-move-effect-attr";
import type { BooleanHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute that cancels the associated move's effects when set to be combined
 * with the user's ally's subsequent move this turn.
 * Used for the {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Pledge_moves | Pledge moves}.
 */
export class AwaitCombinedPledgeAttr extends OverrideMoveEffectAttr {
  constructor() {
    super(true);
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move, overridden: BooleanHolder): boolean {
    if (user.turnData.combiningPledge) {
      // "The two moves have become one!\nIt's a combined move!"
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("moveTriggers:combiningPledge"));
      return false;
    }

    const { turnManager } = globalScene.currentBattle;

    const ret = turnManager.preemptFightCommand((tc) => {
      const { pokemon, turnMove } = tc;
      if (!turnMove || pokemon.isPlayer() !== user.isPlayer()) {
        return false;
      }
      const allyMove = turnMove.move;
      return allyMove !== move && allyMove.hasAttr(AwaitCombinedPledgeAttr);
    });

    if (ret) {
      const allyPokemon = user.getAlly();
      if (allyPokemon) {
        // "{userPokemonName} is waiting for {allyPokemonName}'s move..."
        globalScene.phaseManager.createAndUnshiftPhase(
          "MessagePhase",
          i18next.t("moveTriggers:awaitingPledge", {
            userPokemonName: getPokemonNameWithAffix(user),
            allyPokemonName: getPokemonNameWithAffix(allyPokemon),
          }),
        );
        allyPokemon.turnData.combiningPledge = move.id;
        overridden.value = true;
      }
    }

    return ret;
  }
}
