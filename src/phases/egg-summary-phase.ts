import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { EggHatchData } from "#data/egg-hatch-data";
import { UiMode } from "#enums/ui-mode";
import type { EggHatchSummaryUiHandler } from "#ui/egg-hatch-summary-ui-handler";
import type { MessageUiHandler } from "#ui/message-ui-handler";

/**
 * Class that represents the egg summary phase.
 * It does some of the function for updating egg data.
 * Phase is handled mostly by the egg-hatch-scene-handler UI.
 */
export class EggSummaryPhase extends Phase {
  public override readonly phaseName = "EggSummaryPhase";

  private readonly eggHatchData: EggHatchData[];

  constructor(eggHatchData: EggHatchData[]) {
    super();
    this.eggHatchData = eggHatchData;
  }

  public override start(): void {
    // updates next pokemon once the current update has been completed
    const updateNextPokemon = (i: number): void => {
      if (i >= this.eggHatchData.length) {
        globalScene.ui
          .setModeForceTransition<EggHatchSummaryUiHandler>(UiMode.EGG_HATCH_SUMMARY, this.eggHatchData)
          .then(() => {
            globalScene.audioManager.fadeOutBgm(undefined, false);
          });
      } else {
        this.eggHatchData[i].setDex();
        this.eggHatchData[i].updatePokemon().then(() => {
          if (i < this.eggHatchData.length) {
            updateNextPokemon(i + 1);
          }
        });
      }
    };
    updateNextPokemon(0);
  }

  public override end(): void {
    this.eggHatchData.forEach((hatchData) => hatchData.pokemon.destroy());

    globalScene.time.delayedCall(250, () => globalScene.setModifiersVisible(true));
    globalScene.ui.setModeForceTransition<MessageUiHandler>(UiMode.MESSAGE).then(() => {
      super.end();
    });
  }
}
