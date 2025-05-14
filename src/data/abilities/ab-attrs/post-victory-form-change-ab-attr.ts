import { PostVictoryAbAttr } from "#abilities/post-victory-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";

export class PostVictoryFormChangeAbAttr extends PostVictoryAbAttr {
  private readonly formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex) {
      if (!simulated) {
        globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
      }
      return true;
    }

    return false;
  }
}
