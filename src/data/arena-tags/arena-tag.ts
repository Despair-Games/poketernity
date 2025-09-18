/**
 * ArenaTags are are meant for effects that are tied to the arena (as opposed to a specific pokemon).
 * Examples include (but are not limited to)
 * - Cross-turn effects that persist even if the user/target switches out, such as Happy Hour
 * - Effects that are applied to a specific side of the field, such as Crafty Shield, Reflect, and Spikes
 * - Field-Effects, like Gravity and Trick Room
 *
 * Any arena tag that persists across turns *must* extend from `SerializableArenaTag` in the class definition signature.
 *
 * Serializable ArenaTags have strict rules for their fields.
 * These rules ensure that only the data necessary to reconstruct the tag is serialized, and that the
 * session loader is able to deserialize saved tags correctly.
 *
 * If the data is static (i.e. it is always the same for all instances of the class, such as the
 * type that is weakened by Mud Sport/Water Sport), then it must not be defined as a field, and must
 * instead be defined as a getter.
 * A static property is also acceptable, though static properties are less ergonomic with inheritance.
 *
 * If the data is mutable (i.e. it can change over the course of the tag's lifetime), then it *must*
 * be defined as a field, and it must be set in the `loadTag` method.
 * Such fields cannot be marked as `private`/`protected`; if they were, Typescript would omit them from
 * types that are based off of the class, namely, `ArenaTagTypeData`. It is preferrable to trade the
 * type-safety of private/protected fields for the type safety when deserializing arena tags from save data.
 *
 * For data that is mutable only within a turn (e.g. SuppressAbilitiesTag's beingRemoved field),
 * where it does not make sense to be serialized, the field should use ES2020's
 * [private field syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements#private_fields).
 * If the field should be accessible outside of the class, then a public getter should be used.
 *
 *  If any new serializable fields *are* added, then the class *must* override the
 * `loadTag` method to set the new fields. Its signature *must* match the example below,
 * ```
 * class ExampleTag extends SerializableArenaTag {
 *   // Example, if we add 2 new fields that should be serialized:
 *   public a: string;
 *   public b: number;
 *   // Then we must also define a loadTag method with one of the following signatures
 *   public override loadTag(source: BaseArenaTag & Pick<ExampleTag, "tagType" | "a" | "b"): void;
 *   public override loadTag<const T extends this>(source: BaseArenaTag & Pick<T, "tagType" | "a" | "b">): void;
 * }
 * ```
 * Notes
 * - If the class has any subclasses, then the second form of `loadTag` *must* be used.
 *
 * @module
 */

import { globalScene } from "#app/global-scene";
import { allMoves } from "#data/data-lists";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import type { BaseArenaTag, SerializableArenaTagType } from "#types/arena-tag-types";
import i18next from "i18next";

/** Base class for any special effects that apply to the {@linkcode Arena | field} during battle. */
export abstract class ArenaTag implements BaseArenaTag {
  /** An {@linkcode ArenaTagType | identifier} for the tag's effect. */
  public abstract readonly tagType: ArenaTagType;
  /**
   * The number of turns the tag is active. If set to a number less than
   * 1, the Arena Tag will last indefinitely (until its {@linkcode Arena} is reset).
   */
  public turnCount: number;
  /** (Optional) The {@linkcode MoveId | move} that created this effect. */
  public sourceMoveId?: MoveId;
  /**
   * (Optional) The ID number of the {@linkcode Pokemon} that created this effect,
   * or `undefined` if not created by a Pokemon.
   */
  public sourceId: number | undefined;
  /**
   * The {@linkcode ArenaTagSide} to which this effect applies. Tags can
   * affect the player's and/or the enemy's side of the field.
   */
  public side: ArenaTagSide;

  constructor(turnCount: number, sourceMoveId?: MoveId, sourceId?: number, side: ArenaTagSide = ArenaTagSide.BOTH) {
    this.turnCount = turnCount;
    this.sourceMoveId = sourceMoveId;
    this.sourceId = sourceId;
    this.side = side;
  }

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
   * Applies the tag's effect(s). Should be called via {@linkcode Arena.applyTags}.
   * @param _simulated - If `true`, should suppress changes to game state
   * @param _args - Additional arguments
   * @returns `true` if effects are applied successfully.
   */
  public apply(_simulated: boolean, ..._args: unknown[]): boolean {
    return true;
  }

  /**
   * Applies effects when the tag is first added to the field.
   * @param _quiet - (Default `false`) If `true`, should suppress game messages during execution
   * @see {@linkcode Arena.addTag}
   */
  public onAdd(_quiet: boolean = false): void {}

  /**
   * Applies effects when the tag is removed from the field.
   * By default, this queues a localized on-remove message.
   * @param quiet - (Default `false`) If `true`, should suppress game messages during execution
   */
  public onRemove(quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(`arenaTag:arenaOnRemove${this.i18nSideKey}`, { moveName: this.getMoveName() }),
      );
    }
  }

  /**
   * Applies effects when a tag of the same {@linkcode ArenaTagType | type}
   * and {@linkcode ArenaTagSide | side} would be added to the field.
   */
  public onOverlap(): void {}

  /**
   * Applies effects at the end of each turn.
   * If this returns `false`, the tag is removed from the field
   * after these effects are applied.
   * @returns `true` to retain the tag on the field after this call;
   * `false` to remove the tag.
   * @see {@linkcode Arena.lapseTags}
   */
  public lapse(): boolean {
    return this.turnCount < 1 || --this.turnCount !== 0;
  }

  /**
   * @returns The name of the move corresponding with the tag's {@linkcode sourceMoveId},
   * or `null` if `sourceMoveId` isn't defined.
   * @todo Should this use `PokemonMove.name`?
   */
  public getMoveName(): string | null {
    return this.sourceMoveId ? allMoves.get(this.sourceMoveId).name : null;
  }

  /**
   * When given a arena tag or json representing one, load the data for it.
   * This is meant to be inherited from by any arena tag with custom attributes
   * @param source - The {@linkcode BaseArenaTag} being loaded
   */
  public loadTag<const T extends this>(source: BaseArenaTag & Pick<T, "tagType">): void {
    this.turnCount = source.turnCount;
    this.sourceMoveId = source.sourceMoveId;
    this.sourceId = source.sourceId;
    this.side = source.side;
  }

  /**
   * Helper function that retrieves the source Pokemon
   * @returns The source {@linkcode Pokemon} or `undefined` if none is found
   */
  public getSourcePokemon(): Pokemon | undefined {
    if (this.sourceId != null) {
      return globalScene.getPokemonById(this.sourceId);
    }
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

/**
 * Abstract class for arena tags that can persist across turns.
 */
export abstract class SerializableArenaTag extends ArenaTag {
  abstract override readonly tagType: SerializableArenaTagType;
}
