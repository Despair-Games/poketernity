import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { transitionMysteryEncounterIntroVisuals } from "#mystery-encounters/encounter-visuals-utils";
import type { MysteryEncounterOption, OptionPhaseCallback } from "#mystery-encounters/mystery-encounter-option";

/**
 * Will handle (in order):
 * - Execute {@linkcode MysteryEncounterOption.onOptionPhase} logic if it exists for the selected option
 *
 * It is important to point out that no phases are directly queued by any logic within this phase.
 *
 * Any phase that is meant to follow this one MUST be queued via the onOptionSelect() logic of the selected option
 */
export class MysteryEncounterOptionSelectedPhase extends Phase {
  public override readonly phaseName = "MysteryEncounterOptionSelectedPhase";

  protected onOptionSelect: OptionPhaseCallback =
    globalScene.currentBattle.mysteryEncounter!.selectedOption!.onOptionPhase;

  public override start(): void {
    const { mysteryEncounter } = globalScene.currentBattle;
    if (mysteryEncounter?.autoHideIntroVisuals) {
      transitionMysteryEncounterIntroVisuals().then(() => {
        globalScene.executeWithSeedOffset(
          () => {
            this.onOptionSelect().finally(() => {
              this.end();
            });
          },
          (mysteryEncounter?.getSeedOffset() ?? 0) * 500,
        );
      });
    } else {
      globalScene.executeWithSeedOffset(
        () => {
          this.onOptionSelect().finally(() => {
            this.end();
          });
        },
        (mysteryEncounter?.getSeedOffset() ?? 0) * 500,
      );
    }
  }
}
