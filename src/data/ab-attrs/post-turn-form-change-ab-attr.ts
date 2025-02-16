import { SpeciesFormChangeManualTrigger } from "../species-form-change-triggers/species-form-change-manual-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

export class PostTurnFormChangeAbAttr extends PostTurnAbAttr {
  private readonly formFunc: (p: Pokemon) => number;

  constructor(formFunc: (p: Pokemon) => number) {
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
