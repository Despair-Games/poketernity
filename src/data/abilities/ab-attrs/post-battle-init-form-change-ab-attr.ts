import { PostBattleInitAbAttr } from "#abilities/post-battle-init-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

export class PostBattleInitFormChangeAbAttr extends PostBattleInitAbAttr {
  private readonly formFunc: (p: Pokemon) => number;

  constructor(formFunc: (p: Pokemon) => number) {
    super();

    this.formFunc = formFunc;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    const formIndex = this.formFunc(pokemon);
    return formIndex !== pokemon.formIndex;
  }
}
