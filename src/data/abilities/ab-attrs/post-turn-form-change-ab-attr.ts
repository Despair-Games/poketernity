import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

type FormFunc = (p: Pokemon) => number;

export class PostTurnFormChangeAbAttr extends PostTurnAbAttr {
  private readonly formFunc: FormFunc;

  constructor(formFunc: FormFunc) {
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
