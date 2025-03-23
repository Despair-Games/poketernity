import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BooleanHolder } from "#app/utils";
import i18next from "i18next";
import type { Move } from "#app/data/moves/move";
import { OverrideMoveEffectAttr } from "#app/data/moves/move-attrs/override-move-effect-attr";

/**
 * Attribute that cancels the associated move's effects when set to be combined
 * with the user's ally's subsequent move this turn.
 * Used for the {@link https://bulbapedia.bulbagarden.net/wiki/Move_variations#Pledge_moves | Pledge moves}.
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
        globalScene.queueMessage(
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
