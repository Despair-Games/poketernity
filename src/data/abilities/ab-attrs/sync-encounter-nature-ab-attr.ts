import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class SyncEncounterNatureAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(AbAttrFlag.SYNC_ENCOUNTER_NATURE);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, opponent: Pokemon): boolean {
    opponent.setNature(pokemon.getNature());

    return true;
  }
}
