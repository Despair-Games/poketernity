import type { Pokemon } from "#app/field/pokemon";
import { AbAttr } from "./ab-attr";

export class SyncEncounterNatureAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  override apply(pokemon: Pokemon, _passive: boolean, _simulated: boolean, opponent: Pokemon): boolean {
    opponent.setNature(pokemon.getNature());

    return true;
  }
}
