import type { BattlerIndex } from "#enums/battler-index";
import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import { MovePhase } from "#app/phases/move-phase";
import { BattlerTagType } from "#enums/battler-tag-type";
import { PostMoveUsedAbAttr } from "./post-move-used-ab-attr";

/**
 * Triggers after a dance move is used either by the opponent or the player
 * @extends PostMoveUsedAbAttr
 */
export class PostDancingMoveAbAttr extends PostMoveUsedAbAttr {
  override apply(
    pokemon: Pokemon,
    simulated: boolean,
    move: PokemonMove,
    source: Pokemon,
    targets: BattlerIndex[],
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
      source.getBattlerIndex() !== pokemon.getBattlerIndex()
      && !pokemon.summonData.tags.some((tag) => forbiddenTags.includes(tag.tagType))
    ) {
      if (!simulated) {
        if (move.getMove().isSelfStatusMove()) {
          // If the move is a SelfStatusMove (ie. Swords Dance), the Dancer should replicate it on itself
          globalScene.unshiftPhase(new MovePhase(pokemon, [pokemon.getBattlerIndex()], move, true, true));
        } else {
          // Otherwise, the Dancer must replicate the move on the source of the Dance
          const target = this.getTarget(pokemon, source, targets);
          globalScene.unshiftPhase(new MovePhase(pokemon, target, move, true, true));
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
