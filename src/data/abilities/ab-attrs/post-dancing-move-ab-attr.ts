import { PostMoveUsedAbAttr } from "#abilities/post-move-used-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BattlerIndex } from "#enums/battler-index";
import type { Pokemon } from "#field/pokemon";
import type { PostMoveUsedAbAttrParams } from "#types/ab-attr-param-types";

/** Triggers after a dance move is used either by the opponent or the player */
export class PostDancingMoveAbAttr extends PostMoveUsedAbAttr {
  public override apply({ pokemon, simulated, move, source, targets }: PostMoveUsedAbAttrParams): void {
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

  public override canApply({ pokemon, source }: Parameters<this["apply"]>[0]): boolean {
    return source.id !== pokemon.id && !pokemon.isSemiInvulnerable();
  }

  /**
   * Get the correct targets of Dancer ability
   *
   * @param dancer - The {@linkcode Pokemon} with the Dancer ability
   * @param source - The source of the dancing move
   * @param targets - The {@linkcode BattlerIndex | targets} of the dancing move
   */
  private getTarget(dancer: Pokemon, source: Pokemon, targets: BattlerIndex[]): BattlerIndex[] {
    if (dancer.isPlayer()) {
      return source.isPlayer() ? targets : [source.getBattlerIndex()];
    }
    return source.isPlayer() ? [source.getBattlerIndex()] : targets;
  }
}
