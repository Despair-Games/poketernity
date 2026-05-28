import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class SyncEncounterNatureAbAttr extends AbAttr {
  protected override readonly abAttrKey = "SyncEncounterNatureAbAttr";

  public override apply(pokemon: Pokemon, _simulated: boolean, opponent: Pokemon, applied: ValueHolder<boolean>): void {
    if (!applied.value) {
      opponent.setNature(pokemon.getNature());
      applied.value = true;
    }
  }
}
