import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";

export class PostSummonFormChangeAbAttr extends PostSummonAbAttr {
  private readonly formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex) {
      return simulated || globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }

    return false;
  }
}
