import { getPokemonWithWeatherBasedForms } from "#app/data/ability-utils";
import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#enums/hit-result";
import { globalScene } from "#app/global-scene";
import { PostFaintAbAttr } from "./post-faint-ab-attr";

/**
 * Used for weather suppressing abilities to trigger weather-based form changes upon being fainted.
 * Used by Cloud Nine and Air Lock.
 * @extends PostFaintAbAttr
 */
export class PostFaintUnsuppressedWeatherFormChangeAbAttr extends PostFaintAbAttr {
  /**
   * Triggers {@linkcode Arena.triggerWeatherBasedFormChanges | triggerWeatherBasedFormChanges}
   * when the user of the ability faints
   * @param pokemon the fainted {@linkcode Pokemon}
   * @param passive n/a
   * @param attacker n/a
   * @param move n/a
   * @param hitResult n/a
   * @returns whether the form change was triggered
   */
  override apply(
    _pokemon: Pokemon,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _hitResult: HitResult,
  ): boolean {
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
