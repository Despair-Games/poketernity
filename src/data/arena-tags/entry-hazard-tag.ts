import { ArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Abstract class to implement arena entry hazards.
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

  override onOverlap(): void {
    if (this.layers < this.maxLayers) {
      this.layers++;

      this.onAdd();
    }
  }

  /**
   * Activates the hazard effect onto a Pokemon when it enters the field
   * @param simulated if `true`, only checks if the hazard would activate.
   * @param pokemon the {@linkcode Pokemon} triggering this hazard
   * @returns `true` if this hazard affects the given Pokemon; `false` otherwise.
   */
  override apply(simulated: boolean, pokemon: Pokemon): boolean {
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

  public abstract override modifyMatchupScore(_pokemon: Pokemon, _matchupScore: ValueHolder<number>): boolean;

  override loadTag(source: any): void {
    super.loadTag(source);
    this.layers = source.layers;
    this.maxLayers = source.maxLayers;
  }
}
