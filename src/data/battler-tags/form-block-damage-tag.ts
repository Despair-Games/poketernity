import { AbilityBattlerTag } from "#app/data/battler-tags/ability-battler-tag";
import { SpeciesFormChangeManualTrigger } from "#app/data/species-form-change-triggers/species-form-change-manual-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Abilities } from "#enums/abilities";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Common attributes of form change abilities that block damage
 * @extends AbilityBattlerTag
 */
export class FormBlockDamageTag extends AbilityBattlerTag {
  constructor(tagType: BattlerTagType, ability: Abilities) {
    super(tagType, ability, BattlerTagLapseType.CUSTOM, 1);
  }

  /**
   * Determines if the tag can be added to the Pokémon.
   * @param pokemon The Pokémon to which the tag might be added.
   * @returns True if the tag can be added, false otherwise.
   */
  override canAdd(pokemon: Pokemon): boolean {
    return pokemon.formIndex === 0;
  }

  /**
   * Applies the tag to the Pokémon.
   * Triggers a form change if the Pokémon is not in its defense form.
   * @param pokemon The Pokémon to which the tag is added.
   */
  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);

    if (pokemon.formIndex !== 0) {
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger);
    }
  }

  /**
   * Removes the tag from the Pokémon.
   * Triggers a form change when the tag is removed.
   * @param pokemon The Pokémon from which the tag is removed.
   */
  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);

    globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger);
  }
}
