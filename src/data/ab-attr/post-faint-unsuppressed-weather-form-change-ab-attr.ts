import type Pokemon from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type Move from "../move";
import { getPokemonWithWeatherBasedForms } from "./ability-utils";
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
   * @param _pokemon the fainted {@linkcode Pokemon}
   * @param _passive n/a
   * @param _attacker n/a
   * @param _move n/a
   * @param _hitResult n/a
   * @param _args n/a
   * @returns whether the form change was triggered
   */
  override applyPostFaint(
    _pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _attacker: Pokemon,
    _move: Move,
    _hitResult: HitResult,
    _args: any[],
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
