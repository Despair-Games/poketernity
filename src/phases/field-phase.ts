import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { BattlePhase } from "./battle-phase";

type PokemonFunc = (pokemon: Pokemon) => void;

/**
 * Abstract class that provides the {@linkcode executeForAll()} utility function that
 * applies a passed function to all pokemon on the field
 */
export abstract class FieldPhase extends BattlePhase {
  public executeForAll(func: PokemonFunc): void {
    const field = globalScene.getField(true).filter((p) => p.summonData);
    field.forEach((pokemon) => func(pokemon));
  }
}
