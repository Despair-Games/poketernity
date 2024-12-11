import type { BattlerIndex } from "#app/battle";
import { AttackMove, SelfStatusMove, StatusMove } from "#app/data/move";
import type Pokemon from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PostMoveUsedAbAttr } from "./post-move-used-ab-attr";

/**
 * Triggers after a dance move is used either by the opponent or the player
 * @extends PostMoveUsedAbAttr
 */
export class PostDancingMoveAbAttr extends PostMoveUsedAbAttr {
  /**
   * Resolves the Dancer ability by replicating the move used by the source of the dance
   * either on the source itself or on the target of the dance
   * @param dancer {@linkcode Pokemon} with Dancer ability
   * @param move {@linkcode PokemonMove} Dancing move used by the source
   * @param source {@linkcode Pokemon} that used the dancing move
   * @param targets {@linkcode BattlerIndex} Targets of the dancing move
   * @param _args N/A
   *
   * @return true if the Dancer ability was resolved
   */
  override applyPostMoveUsed(
    dancer: Pokemon,
    move: PokemonMove,
    source: Pokemon,
    targets: BattlerIndex[],
    simulated: boolean,
    _args: any[],
  ): boolean {
    // List of tags that prevent the Dancer from replicating the move
    const forbiddenTags = [
      BattlerTagType.FLYING,
      BattlerTagType.UNDERWATER,
      BattlerTagType.UNDERGROUND,
      BattlerTagType.HIDDEN,
    ];
    // The move to replicate cannot come from the Dancer
    if (
      source.getBattlerIndex() !== dancer.getBattlerIndex()
      && !dancer.summonData.tags.some((tag) => forbiddenTags.includes(tag.tagType))
    ) {
      if (!simulated) {
        // If the move is an AttackMove or a StatusMove the Dancer must replicate the move on the source of the Dance
        if (move.getMove() instanceof AttackMove || move.getMove() instanceof StatusMove) {
          const target = this.getTarget(dancer, source, targets);
          globalScene.unshiftPhase(new MovePhase(dancer, target, move, true, true));
        } else if (move.getMove() instanceof SelfStatusMove) {
          // If the move is a SelfStatusMove (ie. Swords Dance) the Dancer should replicate it on itself
          globalScene.unshiftPhase(new MovePhase(dancer, [dancer.getBattlerIndex()], move, true, true));
        }
      }
      return true;
    }
    return false;
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
