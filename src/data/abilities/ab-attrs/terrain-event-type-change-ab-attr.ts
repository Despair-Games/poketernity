import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { ElementalType } from "#enums/elemental-type";
import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * This applies a terrain-based type change to the Pokemon.
 * Used by Mimicry.
 */
export class TerrainEventTypeChangeAbAttr extends PostSummonAbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.TERRAIN_EVENT_TYPE_CHANGE);
  }

  public override apply(pokemon: Pokemon, _simulated: boolean, onSummon: boolean = true): boolean {
    if (pokemon.isTerastallized) {
      return false;
    }

    const currentTerrain = globalScene.arena.getTerrainType();

    // If there is no terrain, only apply ability if the terrain changed to become empty (i.e., `onSummon` is false)
    if (onSummon && currentTerrain === TerrainType.NONE) {
      return false;
    }
    if (currentTerrain === TerrainType.NONE) {
      pokemon.summonData.types = [];
      pokemon.updateInfo();
      return true;
    }

    const typeChange = this.determineTypeChange(currentTerrain);
    if (typeChange !== ElementalType.UNKNOWN) {
      if (pokemon.summonData.addedType === typeChange) {
        pokemon.summonData.addedType = null;
      }
      pokemon.setTemporaryTypes(typeChange);
      pokemon.updateInfo();
    }
    return true;
  }

  /**
   * Retrieves the type(s) the Pokemon should change to in response to a terrain
   * @param pokemon
   * @param currentTerrain {@linkcode TerrainType}
   * @returns a list of type(s)
   */
  private determineTypeChange(currentTerrain: TerrainType): ElementalType {
    switch (currentTerrain) {
      case TerrainType.ELECTRIC:
        return ElementalType.ELECTRIC;
      case TerrainType.MISTY:
        return ElementalType.FAIRY;
      case TerrainType.GRASSY:
        return ElementalType.GRASS;
      case TerrainType.PSYCHIC:
        return ElementalType.PSYCHIC;
      case TerrainType.NONE:
        return ElementalType.UNKNOWN;
    }
  }

  public override getTriggerMessage(pokemon: Pokemon, _abilityName: string) {
    const currentTerrain = globalScene.arena.getTerrainType();
    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);
    if (currentTerrain === TerrainType.NONE) {
      return i18next.t("abilityTriggers:pokemonTypeChangeRevert", { pokemonNameWithAffix });
    }
    const moveType = i18next.t(`pokemonInfo:Type.${ElementalType[this.determineTypeChange(currentTerrain)]}`);
    return i18next.t("abilityTriggers:pokemonTypeChange", { pokemonNameWithAffix, moveType });
  }
}
