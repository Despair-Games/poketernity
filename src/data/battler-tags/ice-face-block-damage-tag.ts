import { globalScene } from "#app/global-scene";
import { FormBlockDamageTag } from "#battler-tags/form-block-damage-tag";
import { SNOWY_WEATHER_TYPES } from "#constants/weather-constants";
import { AbilityId } from "#enums/ability-id";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Provides the additional weather-based effects of the Ice Face ability
 */
export class IceFaceBlockDamageTag extends FormBlockDamageTag {
  constructor(tagType: BattlerTagType) {
    super(tagType, AbilityId.ICE_FACE);
  }

  /**
   * Determines if the tag can be added to the Pokémon.
   * @param pokemon The Pokémon to which the tag might be added.
   * @returns True if the tag can be added, false otherwise.
   */
  override canAdd(pokemon: Pokemon): boolean {
    return super.canAdd(pokemon) || globalScene.arena.hasWeather(...SNOWY_WEATHER_TYPES);
  }
}
