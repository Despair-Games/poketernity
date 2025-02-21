import { getPokemonWithWeatherBasedForms } from "#app/utils/ability-utils";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PostFaintAbAttr } from "./post-faint-ab-attr";

/**
 * Used for weather suppressing abilities to trigger weather-based form changes upon being fainted.
 * Used by Cloud Nine and Air Lock.
 * @extends PostFaintAbAttr
 */
export class PostFaintUnsuppressedWeatherFormChangeAbAttr extends PostFaintAbAttr {
  override apply(_pokemon: Pokemon, simulated: boolean, _attacker: Pokemon, _move: Move): boolean {
    const pokemonToTransform = getPokemonWithWeatherBasedForms();

    if (pokemonToTransform.length < 1) {
      return false;
    }

    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChanges();
    }

    return true;
  }
}
