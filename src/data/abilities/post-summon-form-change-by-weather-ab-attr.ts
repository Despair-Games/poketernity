import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";
import { queueShowAbility } from "../ability";
import { SpeciesFormChangeRevertWeatherFormTrigger, SpeciesFormChangeWeatherTrigger } from "../pokemon-forms";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Triggers weather-based form change when summoned into an active weather.
 * Used by Forecast and Flower Gift.
 * @extends PostSummonAbAttr
 */

export class PostSummonFormChangeByWeatherAbAttr extends PostSummonAbAttr {
  private ability: Abilities;

  constructor(ability: Abilities) {
    super(false);

    this.ability = ability;
  }

  /**
   * Calls the {@linkcode BattleScene.triggerPokemonFormChange | triggerPokemonFormChange} for both
   * {@linkcode SpeciesFormChange.SpeciesFormChangeWeatherTrigger | SpeciesFormChangeWeatherTrigger} and
   * {@linkcode SpeciesFormChange.SpeciesFormChangeWeatherTrigger | SpeciesFormChangeRevertWeatherFormTrigger} if it
   * is the specific Pokemon and ability
   * @param {Pokemon} pokemon the Pokemon with this ability
   * @param passive n/a
   * @param _args n/a
   * @returns whether the form change was triggered
   */
  override applyPostSummon(pokemon: Pokemon, passive: boolean, simulated: boolean, _args: any[]): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === Species.CASTFORM && this.ability === Abilities.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === Species.CHERRIM && this.ability === Abilities.FLOWER_GIFT;

    if (isCastformWithForecast || isCherrimWithFlowerGift) {
      if (simulated) {
        return simulated;
      }

      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeWeatherTrigger);
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeRevertWeatherFormTrigger);
      queueShowAbility(pokemon, passive);
      return true;
    }
    return false;
  }
}