import type { MysteryEncounterPostSummonTag } from "./mystery-encounter-post-summon-tag";
import type { TypeBoostTag } from "./type-boost-tag";
import { allMoves } from "#app/data/data-lists";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { MoveId } from "#enums/move-id";

export class BattlerTag {
  public tagType: BattlerTagType;
  public lapseTypes: BattlerTagLapseType[];
  public turnCount: number;
  public sourceMoveId: MoveId;
  public sourceId?: number;
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

  canAdd(_pokemon: Pokemon): boolean {
    return true;
  }

  onAdd(_pokemon: Pokemon): void {}

  onRemove(_pokemon: Pokemon): void {}

  onOverlap(_pokemon: Pokemon): void {}

  lapse(_pokemon: Pokemon, _lapseType: BattlerTagLapseType): boolean {
    return --this.turnCount > 0;
  }

  apply(_pokemon: Pokemon, _simulated: boolean, ..._args: unknown[]): boolean {
    return true;
  }

  getDescriptor(): string {
    return "";
  }

  isSourceLinked(): boolean {
    return false;
  }

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

  isMysteryEncounterPostSummonTag(): this is MysteryEncounterPostSummonTag {
    return false;
  }

  isTypeBoostTag(): this is TypeBoostTag {
    return false;
  }
}
