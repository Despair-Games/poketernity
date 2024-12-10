import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { SpeciesFormChangeManualTrigger } from "../pokemon-forms";
import { PostVictoryAbAttr } from "./post-victory-ab-attr";

export class PostVictoryFormChangeAbAttr extends PostVictoryAbAttr {
  private formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override applyPostVictory(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
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
