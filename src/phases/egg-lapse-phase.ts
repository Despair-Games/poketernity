import type { Egg } from "#app/data/egg";
import { EGG_SEED } from "#app/data/egg";
import { EggHatchData } from "#app/data/egg-hatch-data";
import { settings } from "#app/system/settings/settings-manager";
import { EggSkipPreference } from "#enums/egg-skip-preference";
import type { PlayerPokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import Overrides from "#app/overrides";
import { Phase } from "#app/phase";
import { achvs } from "#app/system/achv";
import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import { EggHatchPhase } from "./egg-hatch-phase";
import { EggSummaryPhase } from "./egg-summary-phase";
import { PhaseId } from "#enums/phase-id";

/**
 * Phase that handles updating eggs, and hatching any ready eggs.
 * Also handles prompts for skipping animation, and calling the egg summary phase.
 *
 * @extends Phase
 */
export class EggLapsePhase extends Phase {
  override readonly id = PhaseId.EGG_LAPSE;

  private eggHatchData: EggHatchData[] = [];
  private readonly minEggsToSkip: number = 2;

  public override start(): void {
    super.start();

    const eggsToHatch: Egg[] = globalScene.gameData.eggs.filter((egg: Egg) => {
      return Overrides.EGG_IMMEDIATE_HATCH_OVERRIDE ? true : --egg.hatchWaves < 1;
    });
    const eggsToHatchCount: number = eggsToHatch.length;
    this.eggHatchData = [];

    if (eggsToHatchCount > 0) {
      if (eggsToHatchCount >= this.minEggsToSkip && settings.general.eggSkipPreference === EggSkipPreference.ASK) {
        globalScene.ui.showText(
          i18next.t("battle:eggHatching"),
          0,
          () => {
            const options: ConfirmModeConfig = {
              yesHandler: () => {
                this.hatchEggsSkipped(eggsToHatch);
                this.showSummary();
              },
              noHandler: () => {
                this.hatchEggsRegular(eggsToHatch);
                this.end();
              },
              inputDelay: 1000,
            };
            // show prompt for skip, blocking inputs for 1 second
            globalScene.ui.showText(i18next.t("battle:eggSkipPrompt", { eggsToHatch: eggsToHatchCount }), 0);
            globalScene.ui.setModeWithoutClear(UiMode.CONFIRM, options);
          },
          100,
          true,
        );
      } else if (
        eggsToHatchCount >= this.minEggsToSkip
        && settings.general.eggSkipPreference === EggSkipPreference.ALWAYS
      ) {
        globalScene.queueMessage(i18next.t("battle:eggHatching"));
        this.hatchEggsSkipped(eggsToHatch);
        this.showSummary();
      } else {
        // regular hatches, no summary
        globalScene.queueMessage(i18next.t("battle:eggHatching"));
        this.hatchEggsRegular(eggsToHatch);
        this.end();
      }
    } else {
      this.end();
    }
  }

  /**
   * Hatches eggs normally one by one, showing animations
   * @param eggsToHatch list of eggs to hatch
   */
  protected hatchEggsRegular(eggsToHatch: Egg[]): void {
    let eggsToHatchCount: number = eggsToHatch.length;
    for (const egg of eggsToHatch) {
      globalScene.unshiftPhase(new EggHatchPhase(this, egg, eggsToHatchCount));
      eggsToHatchCount--;
    }
  }

  /**
   * Hatches eggs with no animations
   * @param eggsToHatch list of eggs to hatch
   */
  protected hatchEggsSkipped(eggsToHatch: Egg[]): void {
    for (const egg of eggsToHatch) {
      this.hatchEggSilently(egg);
    }
  }

  protected showSummary(): void {
    globalScene.unshiftPhase(new EggSummaryPhase(this.eggHatchData));
    this.end();
  }

  /**
   * Hatches an egg and stores it in the local EggHatchData array without animations
   * Also validates the achievements for the hatched pokemon and removes the egg
   * @param egg egg to hatch
   */
  protected hatchEggSilently(egg: Egg): void {
    const eggIndex = globalScene.gameData.eggs.findIndex((e) => e.id === egg.id);
    if (eggIndex === -1) {
      return this.end();
    }
    globalScene.gameData.eggs.splice(eggIndex, 1);

    const data = this.generatePokemon(egg);
    const pokemon = data.pokemon;

    if (pokemon.species.isLegendLike()) {
      if (pokemon.species.isSubLegendary()) {
        globalScene.validateAchv(achvs.HATCH_SUB_LEGENDARY);
      } else if (pokemon.species.isLegendary()) {
        globalScene.validateAchv(achvs.HATCH_LEGENDARY);
      } else if (pokemon.species.isMythical()) {
        globalScene.validateAchv(achvs.HATCH_MYTHICAL);
      }
    }

    if (pokemon.isShiny()) {
      globalScene.validateAchv(achvs.HATCH_SHINY);
    }
  }

  /**
   * Generates a Pokemon and creates a new EggHatchData instance for the given egg
   * @param egg the egg to hatch
   * @returns the hatched PlayerPokemon
   */
  public generatePokemon(egg: Egg): EggHatchData {
    let ret: PlayerPokemon;
    let newHatchData: EggHatchData;
    globalScene.executeWithSeedOffset(
      () => {
        ret = egg.generatePlayerPokemon();
        newHatchData = new EggHatchData(ret, egg.eggMoveIndex);
        newHatchData.setDex();
        this.eggHatchData.push(newHatchData);
      },
      egg.id,
      EGG_SEED.toString(),
    );
    return newHatchData!;
  }
}
