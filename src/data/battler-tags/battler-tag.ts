import type { MysteryEncounterPostSummonTag } from "./mystery-encounter-post-summon-tag";
import type { TypeBoostTag } from "./type-boost-tag";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

/**
 * Represents an ongoing in-battle effect associated with a {@linkcode Pokemon}.
 * Battler Tags are added to the "owner" via their {@linkcode PokemonSummonData | summon data},
 * and can be {@linkcode apply | applied} or {@linkcode lapse | lapsed}
 * under one or more {@linkcode BattlerTagLapseType | lapse types}
 */
export class BattlerTag {
  /** The {@linkcode BattlerTagType} associated with this tag */
  public tagType: BattlerTagType;
  /**
   * The {@linkcode BattlerTagLapseType | lapse types} under which this tag
   * triggers its {@linkcode lapse} function.
   */
  public lapseTypes: BattlerTagLapseType[];
  /**
   * The number of turns this tag is in effect.
   * By default, {@linkcode lapse | lapsing} when this is
   * depleted causes the tag to be removed.
   */
  public turnCount: number;
  /**
   * The {@linkcode MoveId | move} from which this
   * tag was created.
   */
  public sourceMoveId: MoveId;
  /**
   * The identifier for the {@linkcode Pokemon} that
   * created this tag.
   */
  public sourceId?: number;
  /**
   * `true` if this tag can be transferred to another Pokemon
   * via {@link http://bulbapedia.bulbagarden.net/wiki/Baton_Pass_(move) | Baton Pass}.
   * @default false
   */
  public isBatonPassable: boolean;

  constructor(
    tagType: BattlerTagType,
    lapseType: BattlerTagLapseType | BattlerTagLapseType[],
    turnCount: number,
    sourceMoveId?: MoveId,
    sourceId?: number,
    isBatonPassable: boolean = false,
  ) {
    this.tagType = tagType;
    this.lapseTypes = Array.isArray(lapseType) ? lapseType : [lapseType];
    this.turnCount = turnCount;
    this.sourceMoveId = sourceMoveId!; // TODO: is this bang correct?
    this.sourceId = sourceId;
    this.isBatonPassable = isBatonPassable;
  }

  /**
   * Used to determine if this tag can be added to the given Pokemon
   * @param pokemon the {@linkcode Pokemon} to which the tag may be added
   * @returns `true` if the tag can be added successfully.
   * @see {@linkcode Pokemon.addTag}
   */
  canAdd(_pokemon: Pokemon): boolean {
    return true;
  }

  /**
   * Contains logic to execute when this tag is successfully added to
   * the given Pokemon
   * @param pokemon the {@linkcode Pokemon} receiving the tag
   * @see {@linkcode Pokemon.addTag}
   */
  onAdd(_pokemon: Pokemon): void {}

  /**
   * Contains logic to execute when this tag is removed from its owner
   * @param pokemon the {@linkcode Pokemon} with the tag
   * @see {@linkcode Pokemon.removeTag}
   */
  onRemove(_pokemon: Pokemon): void {}

  /**
   * Contains logic to execute when the given Pokemon is prompted to
   * receive this tag, but already has a tag of the same {@linkcode BattlerTagType}.
   * @param pokemon the {@linkcode Pokemon} receiving the tag
   * @see {@linkcode Pokemon.addTag}
   */
  onOverlap(_pokemon: Pokemon): void {}

  /**
   * Advances this tag under the given lapse type.
   * By default, this decrements {@linkcode turnCount}, marking the tag
   * for removal once depleted.
   * @param pokemon the {@linkcode Pokemon} with the tag
   * @param lapseType the {@linkcode BattlerTagLapseType} under which the tag
   * is advanced
   * @returns whether the tag should be kept (`true`) or removed (`false`)
   * after lapsing
   * @see {@linkcode Pokemon.lapseTags}
   * @see {@linkcode Pokemon.lapseTag}
   */
  lapse(_pokemon: Pokemon, _lapseType: BattlerTagLapseType): boolean {
    return --this.turnCount > 0;
  }

  /**
   * Applies effects from this tag outside of the pre-defined
   * {@linkcode BattlerTagLapseType | lapse types} and without advancing the tag's
   * {@linkcode turnCount turn counter}. This should only be invoked
   * via {@linkcode applyBattlerTags}.
   * @param pokemon the {@linkcode Pokemon} with the tag
   * @param simulated if `true`, suppresses changes to game state while applying
   * @param args any additional arguments for the tag's application.
   * @returns `true` to prevent other tags under the same {@linkcode BattlerTagType}
   * from applying.
   */
  apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): boolean {
    return true;
  }

  /** @returns a localized descriptor for this tag's effect (currently unused) */
  getDescriptor(): string {
    return "";
  }

  /**
   * Determines if this tag should be removed when the {@linkcode Pokemon}
   * that created it is removed from the field
   * @todo Should this be converted to a field instead of a method?
   * @returns `true` if the tag should be removed when the source is removed
   */
  isSourceLinked(): boolean {
    return false;
  }

  /** @returns the localized name of the move that created this tag */
  getMoveName(): string | null {
    return this.sourceMoveId ? allMoves.get(this.sourceMoveId).name : null;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * This is meant to be inherited from by any battler tag with custom attributes
   * @param source - The source {@linkcode BattlerTag}
   */
  loadTag(source: BattlerTag | any): void {
    this.turnCount = source.turnCount;
    this.sourceMoveId = source.sourceMoveId;
    this.sourceId = source.sourceId;
  }

  /**
   * Helper function that retrieves the source Pokemon object
   * @returns The source {@linkcode Pokemon} or `null` if none is found
   */
  public getSourcePokemon(): Pokemon | null {
    return this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
  }

  /** @returns `true` if this tag is derived from an initial effect in a Mystery Encounter battle */
  isMysteryEncounterPostSummonTag(): this is MysteryEncounterPostSummonTag {
    return false;
  }

  /** @returns `true` if this tag is a {@linkcode TypeBoostTag} */
  isTypeBoostTag(): this is TypeBoostTag {
    return false;
  }
}
