import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import type { EggHatchData } from "#data/egg-hatch-data";
import { UiMode } from "#enums/ui-mode";
import type { EggHatchSummaryUiHandler } from "#ui/egg-hatch-summary-ui-handler";
import type { MessageUiHandler } from "#ui/message-ui-handler";

/**
 * Class that represents the egg summary phase. \
 * It does some of the function for updating egg data. \
 * Phase is handled mostly by the egg-hatch-scene-handler UI.
 */
export class EggSummaryPhase extends Phase {
  public override readonly phaseName = "EggSummaryPhase";

  private readonly eggHatchData: EggHatchData[];

  constructor(eggHatchData: EggHatchData[]) {
    super();
    this.eggHatchData = eggHatchData;
  }

  public override async start(): Promise<void> {
    await this.updateNextPokemon(0);
  }

  public override async end(): Promise<void> {
    const { time, ui } = globalScene;

    this.eggHatchData.forEach((hatchData) => hatchData.pokemon.destroy());

    time.delayedCall(250, () => globalScene.setModifiersVisible(true));
    await ui.setModeForceTransition<MessageUiHandler>(UiMode.MESSAGE);
    super.end();
  }

  private async updateNextPokemon(index: number): Promise<void> {
    const { audioManager, ui } = globalScene;

    if (index >= this.eggHatchData.length) {
      await ui.setModeForceTransition<EggHatchSummaryUiHandler>(UiMode.EGG_HATCH_SUMMARY, this.eggHatchData);
      audioManager.fadeOutBgm(undefined, false);
    } else {
      this.eggHatchData[index].setDex();
      await this.eggHatchData[index].updatePokemon();
      if (index < this.eggHatchData.length) {
        await this.updateNextPokemon(index + 1);
      }
    }
  }
}
