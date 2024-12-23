import { BattlerIndex } from "#app/battle";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { FieldPhase } from "./abstract-field-phase";

export abstract class PokemonPhase extends FieldPhase {
  protected battlerIndex: BattlerIndex | number;
  public isPlayer: boolean;
  public fieldIndex: number;

  constructor(battlerIndex?: BattlerIndex | number) {
    super();

    battlerIndex =
      battlerIndex
      ?? globalScene
        .getField()
        .find((p) => p?.isActive())! // TODO: is the bang correct here?
        .getBattlerIndex();
    if (battlerIndex === undefined) {
      console.warn("There are no Pokemon on the field!"); // TODO: figure out a suitable fallback behavior
    }

    this.battlerIndex = battlerIndex;
    this.isPlayer = battlerIndex < 2;
    this.fieldIndex = battlerIndex % 2;
  }

  public getPokemon(): Pokemon {
    if (this.battlerIndex > BattlerIndex.ENEMY_2) {
      return globalScene.getPokemonById(this.battlerIndex)!; //TODO: is this bang correct?
    }
    return globalScene.getField()[this.battlerIndex];
  }

  public getParty(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerParty() : globalScene.getEnemyParty();
  }

  public getField(): Pokemon[] {
    return this.isPlayer ? globalScene.getPlayerField() : globalScene.getEnemyField();
  }
}
