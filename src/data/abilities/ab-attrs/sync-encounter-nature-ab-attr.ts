import type { Pokemon } from "#app/field/pokemon";
import { abAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class SyncEncounterNatureAbAttr extends AbAttr {
  constructor() {
    super(false);
    this._flags.add(abAttrFlag.SYNC_ENCOUNTER_NATURE);
  }

  override apply(pokemon: Pokemon, _simulated: boolean, opponent: Pokemon): boolean {
    opponent.setNature(pokemon.getNature());

    return true;
  }
}
