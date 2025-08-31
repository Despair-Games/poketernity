import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { MoveEffectPhase } from "#phases/move-effect-phase";

/**
 * Helper function to verify that the current phase is a MoveEffectPhase and provide quick access to commonly used fields
 *
 * @param pokemon {@linkcode Pokemon} The Pokémon used to access the current phase
 * @returns null if current phase is not MoveEffectPhase, otherwise Object containing the {@linkcode MoveEffectPhase}, and its
 * corresponding {@linkcode Move} and user {@linkcode Pokemon}
 */
export function getMoveEffectPhaseData(
  _pokemon: Pokemon,
): { phase: MoveEffectPhase; attacker: Pokemon; move: Move } | null {
  const phase = globalScene.phaseManager.getCurrentPhase();
  if (phase?.is("MoveEffectPhase")) {
    return {
      phase,
      attacker: phase.getPokemon(),
      move: phase.move.getMove(),
    };
  }
  return null;
}
