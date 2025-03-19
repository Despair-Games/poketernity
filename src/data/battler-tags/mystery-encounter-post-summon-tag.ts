import { BattlerTag } from "#app/data/battler-tags/battler-tag";
import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";

/**
 * Tag that adds extra post-summon effects to a battle for a specific Pokemon.
 * These post-summon effects are performed through {@linkcode Pokemon.mysteryEncounterBattleEffects},
 * and can be used to unshift special phases, etc.
 * Currently used only in MysteryEncounters to provide start of fight stat buffs.
 * @extends BattlerTag
 */
export class MysteryEncounterPostSummonTag extends BattlerTag {
  constructor() {
    super(BattlerTagType.MYSTERY_ENCOUNTER_POST_SUMMON, BattlerTagLapseType.CUSTOM, 1);
  }

  /** Event when tag is added */
  override onAdd(pokemon: Pokemon): void {
    super.onAdd(pokemon);
  }

  /** Performs post-summon effects through {@linkcode Pokemon.mysteryEncounterBattleEffects} */
  override lapse(pokemon: Pokemon, lapseType: BattlerTagLapseType): boolean {
    const ret = super.lapse(pokemon, lapseType);

    if (lapseType === BattlerTagLapseType.CUSTOM) {
      if (pokemon.mysteryEncounterBattleEffects) {
        pokemon.mysteryEncounterBattleEffects(pokemon);
      }
    }

    return ret;
  }

  /** Event when tag is removed */
  override onRemove(pokemon: Pokemon): void {
    super.onRemove(pokemon);
  }

  override isMysteryEncounterPostSummonTag(): this is this {
    return true;
  }
}
