import { SpeciesFormChangeManualTrigger } from "#app/data/pokemon-forms";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PostBattleInitAbAttr } from "./post-battle-init-ab-attr";

export class PostBattleInitFormChangeAbAttr extends PostBattleInitAbAttr {
  private readonly formFunc: (p: Pokemon) => integer;

  constructor(formFunc: (p: Pokemon) => integer) {
    super(true);

    this.formFunc = formFunc;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex && !simulated) {
      return globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }

    return false;
  }
}
