import { PostMoveUsedAbAttr } from "#abilities/post-move-used-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import type { Pokemon } from "#field/pokemon";
import type { PokemonMove } from "#field/pokemon-move";

/**
 * Triggers after a dance move is used either by the opponent or the player
 */
export class PostDancingMoveAbAttr extends PostMoveUsedAbAttr {
  public override apply(
    pokemon: Pokemon,
    simulated: boolean,
    move: PokemonMove,
    source: Pokemon,
    targets: BattlerIndex[],
  ): void {
    if (simulated) {
      return;
    }

    if (move.getMove().isSelfStatusMove()) {
      // If the move is a SelfStatusMove (ie. Swords Dance), the Dancer should replicate it on itself
      globalScene.phaseManager.createAndUnshiftPhase("MovePhase", pokemon, [pokemon.getBattlerIndex()], move, {
        followUp: true,
        ignorePp: true,
      });
    } else {
      // Otherwise, the Dancer must replicate the move on the source of the Dance
      const target = this.getTarget(pokemon, source, targets);
      globalScene.phaseManager.createAndUnshiftPhase("MovePhase", pokemon, target, move, {
        followUp: true,
        ignorePp: true,
      });
    }
  }

  public override canApply(...[pokemon, , , source]: Parameters<this["apply"]>): boolean {
    return source.id !== pokemon.id && !pokemon.isSemiInvulnerable();
  }

  /**
   * Get the correct targets of Dancer ability
   *
   * @param dancer {@linkcode Pokemon} Pokemon with Dancer ability
   * @param source {@linkcode Pokemon} Source of the dancing move
   * @param targets {@linkcode BattlerIndex} Targets of the dancing move
   */
  getTarget(dancer: Pokemon, source: Pokemon, targets: BattlerIndex[]): BattlerIndex[] {
    if (dancer.isPlayer()) {
      return source.isPlayer() ? targets : [source.getBattlerIndex()];
    }
    return source.isPlayer() ? [source.getBattlerIndex()] : targets;
  }
}
