import { allMoves } from "#app/data/all-moves";
import { BattlerTagLapseType } from "#app/data/battler-tags";
import { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattlerTagType } from "#app/server-data/battler-tag-type";
import { Moves } from "#app/server-data/moves";

export class BattlerTag {
  public tagType: BattlerTagType;
  public lapseTypes: BattlerTagLapseType[];
  public turnCount: number;
  public sourceMove: Moves;
  public sourceId?: number;
  public isBatonPassable: boolean;

  constructor(
    tagType: BattlerTagType,
    lapseType: BattlerTagLapseType | BattlerTagLapseType[],
    turnCount: number,
    sourceMove?: Moves,
    sourceId?: number,
    isBatonPassable: boolean = false,
  ) {
    this.tagType = tagType;
    this.lapseTypes = Array.isArray(lapseType) ? lapseType : [lapseType];
    this.turnCount = turnCount;
    this.sourceMove = sourceMove!; // TODO: is this bang correct?
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
    return this.sourceMove ? allMoves[this.sourceMove].name : null;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * This is meant to be inherited from by any battler tag with custom attributes
   * @param source - The source {@linkcode BattlerTag}
   */
  loadTag(source: BattlerTag | any): void {
    this.turnCount = source.turnCount;
    this.sourceMove = source.sourceMove;
    this.sourceId = source.sourceId;
  }

  /**
   * Helper function that retrieves the source Pokemon object
   * @returns The source {@linkcode Pokemon} or `null` if none is found
   */
  public getSourcePokemon(): Pokemon | null {
    return this.sourceId ? globalScene.getPokemonById(this.sourceId) : null;
  }
}
