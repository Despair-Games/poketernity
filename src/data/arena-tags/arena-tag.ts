import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Base class for any special effects that apply to the {@linkcode Arena | field}
 * during battle.
 * @abstract
 */
export abstract class ArenaTag {
  constructor(
    /** An {@linkcode ArenaTagType | identifier} for the tag's effect. */
    public tagType: ArenaTagType,
    /**
     * The number of turns the tag is active. If set to a number less than
     * 1, the Arena Tag will last indefinitely (until its {@linkcode Arena} is reset).
     */
    public turnCount: number,
    /** (Optional) The {@linkcode MoveId | move} that created this effect. */
    public sourceMoveId?: MoveId,
    /** (Optional) The ID number of the {@linkcode Pokemon} that created this effect. */
    public sourceId?: number,
    /**
     * The {@linkcode ArenaTagSide} to which this effect applies. Tags can
     * affect the player's and/or the enemy's side of the field.
     */
    public side: ArenaTagSide = ArenaTagSide.BOTH,
  ) {}

  /**
   * Used to obtain localized keys for the tag's messages based on what
   * side of the field the tag affects.
   * @example
   * ```ts
   * i18next.t(`arenaTag:arenaOnRemove${this.i18nSideKey}`);
   * ```
   */
  public get i18nSideKey(): string {
    if (this.side === ArenaTagSide.PLAYER) {
      return "Player";
    }
    if (this.side === ArenaTagSide.ENEMY) {
      return "Enemy";
    }
    return "";
  }

  /**
   * Applies the tag's effect(s). Should be called via
   * {@linkcode Arena.applyTagsForSide} or {@linkcode Arena.applyTags}.
   * @param _arena - The {@linkcode Arena} to which the tag belongs
   * @param _simulated - If `true`, should suppress changes to game state
   * @param _args - Additional arguments
   * @returns `true` if effects are applied successfully.
   */
  public apply(_arena: Arena, _simulated: boolean, ..._args: unknown[]): boolean {
    return true;
  }

  /**
   * Applies effects when the tag is first added to the field.
   * @param _arena - The {@linkcode Arena} to which the tag belongs
   * @param _quiet - (Default `false`) If `true`, should suppress game messages during execution
   * @see {@linkcode Arena.addTag}
   */
  public onAdd(_arena: Arena, _quiet: boolean = false): void {}

  /**
   * Applies effects when the tag is removed from the field.
   * By default, this queues a localized on-remove message.
   * @param _arena - The {@linkcode Arena} to which the tag belongs
   * @param quiet - (Default `false`) If `true`, should suppress game messages during execution
   */
  public onRemove(_arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.queueMessagePhase(
        i18next.t(`arenaTag:arenaOnRemove${this.i18nSideKey}`, { moveName: this.getMoveName() }),
      );
    }
  }

  /**
   * Applies effects when a tag of the same {@linkcode ArenaTagType | type}
   * and {@linkcode ArenaTagSide | side} would be added to the field.
   * @param _arena - The {@linkcode Arena} to which the tag belongs
   */
  public onOverlap(_arena: Arena): void {}

  /**
   * Applies effects at the end of each turn.
   * If this returns `false`, the tag is removed from the field
   * after these effects are applied.
   * @param _arena - The {@linkcode Arena} to which the tag belongs
   * @returns `true` to retain the tag on the field after this call;
   * `false` to remove the tag.
   * @see {@linkcode Arena.lapseTags}
   */
  public lapse(_arena: Arena): boolean {
    return this.turnCount < 1 || --this.turnCount !== 0;
  }

  /**
   * @returns The name of the move corresponding with the tag's {@linkcode sourceMoveId},
   * or `null` if `sourceMoveId` isn't defined.
   */
  public getMoveName(): string | null {
    return this.sourceMoveId ? allMoves.get(this.sourceMoveId).name : null;
  }

  /**
   * When given a arena tag or json representing one, load the data for it.
   * This is meant to be inherited from by any arena tag with custom attributes
   * @param source - The {@linkcode ArenaTag} source to load from
   */
  public loadTag(source: ArenaTag | any): void {
    this.turnCount = source.turnCount;
    this.sourceMoveId = source.sourceMoveId;
    this.sourceId = source.sourceId;
    this.side = source.side;
  }

  /**
   * Helper function that retrieves the source Pokemon
   * @returns The source {@linkcode Pokemon} or `null` if none is found
   */
  public getSourcePokemon(): Pokemon | null {
    return this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
  }

  /**
   * Helper function that retrieves the Pokemon affected
   * @returns list of PlayerPokemon or EnemyPokemon on the field
   */
  public getAffectedPokemon(): Pokemon[] {
    switch (this.side) {
      case ArenaTagSide.PLAYER:
        return globalScene.getPlayerField() ?? [];
      case ArenaTagSide.ENEMY:
        return globalScene.getEnemyField() ?? [];
      case ArenaTagSide.BOTH:
      default:
        return globalScene.getField(true) ?? [];
    }
  }
}
