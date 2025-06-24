import { PostBattleInitAbAttr } from "#abilities/post-battle-init-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";

export class PostBattleInitFormChangeAbAttr extends PostBattleInitAbAttr {
  private readonly formFunc: (p: Pokemon) => number;

  constructor(formFunc: (p: Pokemon) => number) {
    super(true);

    this.formFunc = formFunc;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const formIndex = this.formFunc(pokemon);
    if (formIndex !== pokemon.formIndex && !simulated) {
      return globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }

    return false;
  }
}
