import { allMoves } from "#app/data/all-moves";
import { Arena } from "#app/field/arena";
import { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import i18next from "#app/plugins/i18n";
import { ArenaTagType } from "#enums/arena-tag-type";
import { Moves } from "#app/server-data/moves";
import { ArenaTagSide } from "./arena-tag-side";

export abstract class ArenaTag {
  constructor(
    public tagType: ArenaTagType,
    public turnCount: number,
    public sourceMove?: Moves,
    public sourceId?: number,
    public side: ArenaTagSide = ArenaTagSide.BOTH,
  ) {}

  apply(_arena: Arena, _simulated: boolean, ..._args: unknown[]): boolean {
    return true;
  }

  onAdd(_arena: Arena, _quiet: boolean = false): void {}

  onRemove(_arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      globalScene.queueMessage(
        i18next.t(
          `arenaTag:arenaOnRemove${this.side === ArenaTagSide.PLAYER ? "Player" : this.side === ArenaTagSide.ENEMY ? "Enemy" : ""}`,
          { moveName: this.getMoveName() },
        ),
      );
    }
  }

  onOverlap(_arena: Arena): void {}

  lapse(_arena: Arena): boolean {
    return this.turnCount < 1 || !!--this.turnCount;
  }

  getMoveName(): string | null {
    return this.sourceMove ? allMoves[this.sourceMove].name : null;
  }

  /**
   * When given a arena tag or json representing one, load the data for it.
   * This is meant to be inherited from by any arena tag with custom attributes
   * @param source - The {@linkcode ArenaTag} source to load from
   */
  loadTag(source: ArenaTag | any): void {
    this.turnCount = source.turnCount;
    this.sourceMove = source.sourceMove;
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