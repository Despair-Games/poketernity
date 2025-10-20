import { PreSwitchOutAbAttr } from "#abilities/pre-switch-out-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { SpeciesFormChangeManualTrigger } from "#form-change-triggers/species-form-change-manual-trigger";

/**
 * Attribute for form changes that occur on switching out
 * @see {@linkcode applyPreSwitchOut}
 */
export class PreSwitchOutFormChangeAbAttr extends PreSwitchOutAbAttr {
  private readonly formFunc: (p: Pokemon) => number;

  constructor(formFunc: (p: Pokemon) => number) {
    super();

    this.formFunc = formFunc;
  }

  public override apply(pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeManualTrigger, false);
    }
  }

  public override canApply(...[pokemon]: Parameters<this["apply"]>): boolean {
    const formIndex = this.formFunc(pokemon);
    return formIndex !== pokemon.formIndex;
  }
}
