import { globalScene } from "#app/global-scene";
import type { FormChangeItem } from "#enums/form-change-item";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeTrigger } from "#form-change-triggers/species-form-change-trigger";

export class SpeciesFormChangeItemTrigger extends SpeciesFormChangeTrigger {
  public item: FormChangeItem;
  public active: boolean;

  constructor(item: FormChangeItem, active: boolean = true) {
    super();
    this.item = item;
    this.active = active;
  }

  override canChange(pokemon: Pokemon): boolean {
    return !!globalScene.findModifier(
      (m) =>
        m.isPokemonFormChangeItemModifier()
        && m.pokemonId === pokemon.id
        && m.formChangeItem === this.item
        && m.active === this.active,
    );
  }
}
