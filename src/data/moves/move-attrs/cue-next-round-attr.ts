import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

/**
 * Attribute for the "combo" effect of {@link https://bulbapedia.bulbagarden.net/wiki/Round_(move) | Round}.
 * Preempts the next move in the turn order with the first instance of any Pokemon
 * using Round. Also marks the Pokemon using the cued Round to double the move's power.
 * @extends MoveEffectAttr
 * @see {@linkcode RoundPowerAttr}
 */
export class CueNextRoundAttr extends MoveEffectAttr {
  constructor() {
    super(true, { lastHitOnly: true });
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const { turnManager } = globalScene.currentBattle;
    return turnManager.preemptFightCommand((tc) => {
      if (tc.turnMove?.move.id === MoveId.ROUND) {
        tc.pokemon.turnData.joinedRound = true;
        return true;
      }
      return false;
    });
  }
}
