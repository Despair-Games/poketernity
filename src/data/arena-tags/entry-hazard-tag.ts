import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { BaseArenaTag, EntryHazardTagType } from "#types/arena-tag-types";
import type { Mutable } from "#types/utility-types";

/**
 * Abstract class to implement arena entry hazards.
 */
export abstract class EntryHazardTag extends SerializableArenaTag {
  public abstract override readonly tagType: EntryHazardTagType;
  public readonly layers: number = 1;

  /**
   * The max layers the entry hazard can have.
   * @privateRemarks
   * This is a getter so that it will not be serialized to save data, since it's a static value.
   */
  public abstract get maxLayers(): number;

  /**
   * @param sourceMoveId - The move that created the tag.
   * @param sourceId - The ID of the source of the tag.
   * @param side - The side (player or enemy) the tag affects.
   */
  constructor(sourceMoveId: MoveId, sourceId: number | undefined, side: ArenaTagSide) {
    super(0, sourceMoveId, sourceId, side);
  }

  override onOverlap(): void {
    if (this.layers < this.maxLayers) {
      (this as Mutable<this>).layers++;

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

  override loadTag<const T extends this>(source: BaseArenaTag & Pick<T, "tagType" | "layers">): void {
    super.loadTag(source);
    (this as Mutable<this>).layers = source.layers;
  }
}
