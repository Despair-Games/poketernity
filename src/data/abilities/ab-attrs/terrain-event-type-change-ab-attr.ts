import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import { TerrainType } from "#enums/terrain-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import type { AbAttrKey, AbAttrMap } from "#types/ability-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

interface TerrainEventTypeChangeAbAttrParams extends BaseAbAttrParams {
  /** @defaultValue `true` */
  onSummon?: boolean;
}

/**
 * This applies a terrain-based type change to the Pokemon.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Mimicry_(Ability)}
 */
// TODO: split into 2 `AbAttr`s to remove `onSummon` and `.is` override jank
export class TerrainEventTypeChangeAbAttr extends PostSummonAbAttr {
  protected override readonly abAttrKey = "TerrainEventTypeChangeAbAttr";

  /**
   * @todo This is a temporary workaround for this attribute being recycled as a post-summon effect.
   * This attribute's behavior should probably be split into two attributes.
   */
  public override is<K extends AbAttrKey>(abAttrKey: K): this is AbAttrMap[K] {
    return super.is(abAttrKey) || abAttrKey === "PostSummonAbAttr";
  }

  public override apply({ pokemon, simulated, onSummon = true }: TerrainEventTypeChangeAbAttrParams): void {
    if (simulated) {
      return;
    }

    const currentTerrain = globalScene.arena.terrainType;
    if (currentTerrain === TerrainType.NONE) {
      // `onSummon` will never be `true` in `canApply()` so it cannot be checked there
      if (onSummon) {
        return;
      }
      pokemon.summonData.types = [];
      pokemon.updateInfo();
      return;
    }

    const typeChange = this.determineTypeChange(currentTerrain);
    if (typeChange !== ElementalType.UNKNOWN) {
      if (pokemon.summonData.addedType === typeChange) {
        pokemon.summonData.addedType = null;
      }
      pokemon.setTemporaryTypes(typeChange);
      pokemon.updateInfo();
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return !pokemon.isTerastallized;
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

  public override getTriggerMessage({ pokemon }: Parameters<this["apply"]>[0]) {
    const currentTerrain = globalScene.arena.terrainType;
    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);
    if (currentTerrain === TerrainType.NONE) {
      return i18next.t("abilityTriggers:pokemonTypeChangeRevert", { pokemonNameWithAffix });
    }
    const moveType = i18next.t(
      `pokemonInfo:Type.${enumValueToKey(ElementalType, this.determineTypeChange(currentTerrain))}`,
    );
    return i18next.t("abilityTriggers:pokemonTypeChange", { pokemonNameWithAffix, moveType });
  }
}
