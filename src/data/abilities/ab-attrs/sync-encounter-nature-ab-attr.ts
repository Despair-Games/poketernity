import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";

export class SyncEncounterNatureAbAttr extends AbAttr {
  protected override readonly abAttrKey = "SyncEncounterNatureAbAttr";

  public override apply(pokemon: Pokemon, _simulated: boolean, opponent: Pokemon): void {
    opponent.setNature(pokemon.getNature());
  }
}
