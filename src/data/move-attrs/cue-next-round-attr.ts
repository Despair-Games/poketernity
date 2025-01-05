import { Moves } from "#enums/moves";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

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

  override apply(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    const nextRoundPhase = globalScene.findPhase<MovePhase>(
      (phase) => phase instanceof MovePhase && phase.move.moveId === Moves.ROUND,
    );

    if (!nextRoundPhase) {
      return false;
    }

    // Update the phase queue so that the next Pokemon using Round moves next
    const nextRoundIndex = globalScene.phaseQueue.indexOf(nextRoundPhase);
    const nextMoveIndex = globalScene.phaseQueue.findIndex((phase) => phase instanceof MovePhase);
    if (nextRoundIndex !== nextMoveIndex) {
      globalScene.prependToPhase(globalScene.phaseQueue.splice(nextRoundIndex, 1)[0], MovePhase);
    }

    // Mark the corresponding Pokemon as having "joined the Round" (for doubling power later)
    nextRoundPhase.pokemon.turnData.joinedRound = true;
    return true;
  }
}
