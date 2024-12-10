import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { SpeciesFormChangeManualTrigger } from "../pokemon-forms";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

export class PostSummonFormChangeAbAttr extends PostSummonAbAttr {
  private formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override applyPostSummon(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex) {
      return simulated || globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }

    return false;
  }
}
