import type { EggHatchData } from "#app/data/egg-hatch-data";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { Mode } from "#app/ui/ui";

/**
 * Class that represents the egg summary phase
 * It does some of the function for updating egg data
 * Phase is handled mostly by the egg-hatch-scene-handler UI
 */
export class EggSummaryPhase extends Phase {
  private readonly eggHatchData: EggHatchData[];

  constructor(eggHatchData: EggHatchData[]) {
    super();
    this.eggHatchData = eggHatchData;
  }

  public override start(): void {
    super.start();

    // updates next pokemon once the current update has been completed
    const updateNextPokemon = (i: number): void => {
      if (i >= this.eggHatchData.length) {
        globalScene.ui.setModeForceTransition(Mode.EGG_HATCH_SUMMARY, this.eggHatchData).then(() => {
          globalScene.fadeOutBgm(undefined, false);
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
    globalScene.time.delayedCall(250, () => globalScene.setModifiersVisible(true));
    globalScene.ui.setModeForceTransition(Mode.MESSAGE).then(() => {
      super.end();
    });
  }
}
