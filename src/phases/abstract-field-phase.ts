import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { BattlePhase } from "#phases/abstract-battle-phase";

/**
 * Abstract class that provides the {@linkcode executeForAll()} utility function that
 * applies a passed function to all pokemon on the field
 */
export abstract class FieldPhase extends BattlePhase {
  public executeForAll(func: (pokemon: Pokemon) => void): void {
    const field = globalScene.getField(true);
    field.forEach((pokemon) => func(pokemon));
  }
}
