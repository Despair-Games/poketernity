import { ArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { Pokemon } from "#field/pokemon";

/**
 * Abstract class to implement arena entry hazards.
 * @abstract
 * @extends ArenaTag
 */
export abstract class EntryHazardTag extends ArenaTag {
  public layers: number;
  public maxLayers: number;

  /**
   * @param tagType - The type of the arena tag.
   * @param sourceMoveId - The move that created the tag.
   * @param sourceId - The ID of the source of the tag.
   * @param side - The side (player or enemy) the tag affects.
   * @param maxLayers - The maximum amount of layers this tag can have.
   */
  constructor(tagType: ArenaTagType, sourceMoveId: MoveId, sourceId: number, side: ArenaTagSide, maxLayers: number) {
    super(tagType, 0, sourceMoveId, sourceId, side);

    this.layers = 1;
    this.maxLayers = maxLayers;
  }

  override onOverlap(arena: Arena): void {
    if (this.layers < this.maxLayers) {
      this.layers++;

      this.onAdd(arena);
    }
  }

  /**
   * Activates the hazard effect onto a Pokemon when it enters the field
   * @param _arena the {@linkcode Arena} containing this tag
   * @param simulated if `true`, only checks if the hazard would activate.
   * @param pokemon the {@linkcode Pokemon} triggering this hazard
   * @returns `true` if this hazard affects the given Pokemon; `false` otherwise.
   */
  override apply(_arena: Arena, simulated: boolean, pokemon: Pokemon): boolean {
    if (this.side !== ArenaTagSide.BOTH && (this.side === ArenaTagSide.PLAYER) !== pokemon.isPlayer()) {
      return false;
    }

    return this.activateTrap(pokemon, simulated);
  }

  /**
   * Inflicts the hazard's effects on a Pokemon
   * @param _pokemon - The afflicted {@linkcode Pokemon}
   * @param _simulated - If `true`, suppresses changes to game state
   * @returns `true` if effects applied successfully
   */
  protected abstract activateTrap(_pokemon: Pokemon, _simulated: boolean): boolean;

  /**
   * Calculates the tag's effect on a Pokemon's matchup score (for enemy switching)
   * @param pokemon - The {@linkcode Pokemon} to evaluate
   * @returns the multiplier to the given Pokemon's matchup score
   * @deprecated To be replaced in the AI Rework
   * ({@link https://github.com/Despair-Games/poketernity/issues/945 | #945})
   */
  public getMatchupScoreMultiplier(pokemon: Pokemon): number {
    return pokemon.isGrounded()
      ? 1
      : Phaser.Math.Linear(0, 1 / Math.pow(2, this.layers), Math.min(pokemon.getHpRatio(), 0.5) * 2);
  }

  override loadTag(source: any): void {
    super.loadTag(source);
    this.layers = source.layers;
    this.maxLayers = source.maxLayers;
  }
}
