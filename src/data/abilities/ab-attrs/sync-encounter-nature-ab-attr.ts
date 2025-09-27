import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";

export class SyncEncounterNatureAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.SYNC_ENCOUNTER_NATURE);
  }

  public override apply(pokemon: Pokemon, _simulated: boolean, opponent: Pokemon): void {
    opponent.setNature(pokemon.getNature());
  }
}
