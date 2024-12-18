import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class SyncEncounterNatureAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const opponent: Pokemon = args[0];
    opponent.setNature(pokemon.getNature());

    return true;
  }
}
