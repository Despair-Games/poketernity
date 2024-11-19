import BattleScene from "#app/battle-scene";
import { BattlerIndex } from "#app/battle";
import Pokemon from "#app/field/pokemon";
import { FieldPhase } from "./field-phase";

export abstract class PokemonPhase extends FieldPhase {
  protected battlerIndex: BattlerIndex | number;
  public player: boolean;
  public fieldIndex: number;

  constructor(scene: BattleScene, battlerIndex?: BattlerIndex | number) {
    super(scene);

    battlerIndex = battlerIndex ?? scene.getField().find(p => p?.isActive())!.getBattlerIndex();
    if (battlerIndex === undefined) {
      // TODO: figure out a suitable fallback behavior and remove above bang
      // (can this even happen?)
      console.warn("There are no Pokemon on the field!");
    }

    this.battlerIndex = battlerIndex;
    this.player = battlerIndex < 2;
    this.fieldIndex = battlerIndex % 2;
  }

  getPokemon(): Pokemon {
    if (this.battlerIndex > BattlerIndex.ENEMY_2) {
      return this.scene.getPokemonById(this.battlerIndex)!; //TODO: is this bang correct?
    }
    return this.scene.getField()[this.battlerIndex];
  }
}
