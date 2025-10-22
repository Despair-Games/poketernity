import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { getPokemonWithWeatherBasedForms } from "#utils/ability-utils";

/**
 * Used for weather suppressing abilities to trigger weather-based form changes upon being fainted.
 * Used by Cloud Nine and Air Lock.
 */
export class PostFaintUnsuppressedWeatherFormChangeAbAttr extends PostFaintAbAttr {
  public override apply(_pokemon: Pokemon, simulated: boolean, _attacker: Pokemon, _move: Move): void {
    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChanges();
    }
  }

  public override canApply(..._params: Parameters<this["apply"]>): boolean {
    return getPokemonWithWeatherBasedForms().length > 0;
  }
}
