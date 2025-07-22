import { globalScene } from "#app/global-scene";
import type { PokemonSpecies } from "#data/pokemon-species";
import type { ModifierTypeFunc } from "#modifier/modifier-type";
import { ModifierRewardPhase } from "#phases/modifier-reward-phase";
import i18next from "i18next";

export class RibbonModifierRewardPhase extends ModifierRewardPhase {
  public override readonly phaseName = "RibbonModifierRewardPhase";

  private readonly species: PokemonSpecies;

  constructor(modifierTypeFunc: ModifierTypeFunc, species: PokemonSpecies) {
    super(modifierTypeFunc);

    this.species = species;
  }

  protected override doReward(): Promise<void> {
    return new Promise<void>((resolve) => {
      const newModifier = this.modifierType.newModifier();
      globalScene.addModifier(newModifier);
      globalScene.audioManager.playSound("level_up_fanfare");
      globalScene.ui.setMessageMode();
      globalScene.ui.showText(
        i18next.t("battle:beatModeFirstTime", {
          speciesName: this.species.name,
          gameMode: globalScene.gameMode.getName(),
          newModifier: newModifier?.type.name,
        }),
        null,
        () => {
          resolve();
        },
        null,
        true,
        1500,
      );
    });
  }
}
