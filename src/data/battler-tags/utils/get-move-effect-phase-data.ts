import type { Move } from "#app/data/moves/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { MoveEffectPhase } from "#app/phases/move-effect-phase";
import { PhaseId } from "#enums/phase-id";

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
  if (phase?.is<MoveEffectPhase>(PhaseId.MOVE_EFFECT)) {
    return {
      phase: phase,
      attacker: phase.getPokemon(),
      move: phase.move.getMove(),
    };
  }
  return null;
}
