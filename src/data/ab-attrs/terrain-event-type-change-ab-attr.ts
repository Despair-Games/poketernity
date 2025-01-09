import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { TerrainType } from "#enums/terrain-type";
import { Type } from "#enums/type";
import i18next from "i18next";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * This applies a terrain-based type change to the Pokemon.
 * Used by Mimicry.
 * @extends PostSummonAbAttr
 */
export class TerrainEventTypeChangeAbAttr extends PostSummonAbAttr {
  override apply(pokemon: Pokemon, _simulated: boolean): boolean {
    if (pokemon.isTerastallized()) {
      return false;
    }

    const currentTerrain = globalScene.arena.getTerrainType();

    const typeChange: Type[] = this.determineTypeChange(pokemon, currentTerrain);
    if (typeChange.length !== 0) {
      if (pokemon.summonData.addedType && typeChange.includes(pokemon.summonData.addedType)) {
        pokemon.summonData.addedType = null;
      }
      pokemon.summonData.types = typeChange;
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
  private determineTypeChange(pokemon: Pokemon, currentTerrain: TerrainType): Type[] {
    const typeChange: Type[] = [];
    switch (currentTerrain) {
      case TerrainType.ELECTRIC:
        typeChange.push(Type.ELECTRIC);
        break;
      case TerrainType.MISTY:
        typeChange.push(Type.FAIRY);
        break;
      case TerrainType.GRASSY:
        typeChange.push(Type.GRASS);
        break;
      case TerrainType.PSYCHIC:
        typeChange.push(Type.PSYCHIC);
        break;
      default:
        pokemon.getTypes(false, false, true).forEach((t) => {
          typeChange.push(t);
        });
        break;
    }
    return typeChange;
  }

  override getTriggerMessage(pokemon: Pokemon, _abilityName: string, ..._args: any[]) {
    const currentTerrain = globalScene.arena.getTerrainType();
    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);
    if (currentTerrain === TerrainType.NONE) {
      return i18next.t("abilityTriggers:pokemonTypeChangeRevert", { pokemonNameWithAffix });
    } else {
      const moveType = i18next.t(`pokemonInfo:Type.${Type[this.determineTypeChange(pokemon, currentTerrain)[0]]}`);
      return i18next.t("abilityTriggers:pokemonTypeChange", { pokemonNameWithAffix, moveType });
    }
  }
}
