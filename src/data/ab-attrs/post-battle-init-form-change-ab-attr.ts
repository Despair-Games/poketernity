import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { SpeciesFormChangeManualTrigger } from "../pokemon-forms";
import { PostBattleInitAbAttr } from "./post-battle-init-ab-attr";

export class PostBattleInitFormChangeAbAttr extends PostBattleInitAbAttr {
  private formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override applyPostBattleInit(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex && !simulated) {
      return globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }

    return false;
  }
}
