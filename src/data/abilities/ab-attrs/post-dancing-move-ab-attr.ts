import type { Pokemon } from "#app/field/pokemon";
import type { PokemonMove } from "#app/field/pokemon-move";
import { globalScene } from "#app/global-scene";
import { SemiInvulnerableBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import type { BattlerIndex } from "#enums/battler-index";
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
    // The move to replicate cannot come from the Dancer
    if (
      source.getBattlerIndex() !== pokemon.getBattlerIndex()
      && !pokemon.summonData.tags.some((tag) => SemiInvulnerableBattlerTagTypes.includes(tag.tagType))
    ) {
      if (!simulated) {
        if (move.getMove().isSelfStatusMove()) {
          // If the move is a SelfStatusMove (ie. Swords Dance), the Dancer should replicate it on itself
          globalScene.useMove({
            pokemon,
            targets: [pokemon.getBattlerIndex()],
            move,
            followUp: true,
            ignorePp: true,
            when: "eager",
          });
        } else {
          // Otherwise, the Dancer must replicate the move on the source of the Dance
          const target = this.getTarget(pokemon, source, targets);
          globalScene.useMove({ pokemon, targets: target, move, followUp: true, ignorePp: true, when: "eager" });
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
