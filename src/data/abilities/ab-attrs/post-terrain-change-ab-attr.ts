import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";

export abstract class PostTerrainChangeAbAttr extends AbAttr {
  constructor(showAbility: boolean = true, showAbilityInstant: boolean = false) {
    super(showAbility, showAbilityInstant);
    this._flags.add(AbAttrFlag.POST_TERRAIN_CHANGE);
  }

  /**
   * Applies an effect after the terrain on the field changes
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param terrain The {@linkcode TerrainType | terrain} being set
   * @returns `true` if effects successfully applied
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, _terrain: TerrainType): boolean {
    return false;
  }
}
