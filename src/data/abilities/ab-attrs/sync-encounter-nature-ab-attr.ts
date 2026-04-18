import { AbAttr } from "#abilities/ab-attr";
import type { SyncEncounterNatureAbAttrParams } from "#types/ab-attr-param-types";

export class SyncEncounterNatureAbAttr extends AbAttr {
  protected override readonly abAttrKey = "SyncEncounterNatureAbAttr";

  public override apply({ pokemon, opponent }: SyncEncounterNatureAbAttrParams): void {
    opponent.setNature(pokemon.getNature());
  }
}
