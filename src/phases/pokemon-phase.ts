import { globalScene } from "#app/global-scene";
import { BattlerIndex } from "#app/battle";
import Pokemon from "#app/field/pokemon";
import { FieldPhase } from "./field-phase";

export abstract class PokemonPhase extends FieldPhase {
  protected battlerIndex: BattlerIndex | integer;
  public player: boolean;
  public fieldIndex: integer;

  constructor(battlerIndex?: BattlerIndex | integer) {
    super();

    if (battlerIndex === undefined) {
      battlerIndex = globalScene.getField().find(p => p?.isActive())!.getBattlerIndex(); // TODO: is the bang correct here?
    }

    this.battlerIndex = battlerIndex;
    this.player = battlerIndex < 2;
    this.fieldIndex = battlerIndex % 2;
  }

  getPokemon(): Pokemon {
    if (this.battlerIndex > BattlerIndex.ENEMY_2) {
      return globalScene.getPokemonById(this.battlerIndex)!; //TODO: is this bang correct?
    }
    return globalScene.getField()[this.battlerIndex]!; //TODO: is this bang correct?
  }
}
