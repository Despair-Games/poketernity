import type { OptionPhaseCallback } from "#app/data/mystery-encounters/mystery-encounter-option";
import { transitionMysteryEncounterIntroVisuals } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

const { mysteryEncounter } = globalScene.currentBattle;

/**
 * Will handle (in order):
 * - Execute {@linkcode MysteryEncounter.onOptionSelect} logic if it exists for the selected option
 *
 * It is important to point out that no phases are directly queued by any logic within this phase
 * Any phase that is meant to follow this one MUST be queued via the onOptionSelect() logic of the selected option
 */
export class MysteryEncounterOptionSelectedPhase extends Phase {
  protected onOptionSelect: OptionPhaseCallback;

  constructor() {
    super();
    this.onOptionSelect = mysteryEncounter!.selectedOption!.onOptionPhase; // TODO: resolve bangs?
  }

  /**
   * Will handle (in order):
   * - Execute {@linkcode MysteryEncounter.onOptionSelect} logic if it exists for the selected option
   *
   * It is important to point out that no phases are directly queued by any logic within this phase.
   * Any phase that is meant to follow this one MUST be queued via the {@linkcode MysteryEncounter.onOptionSelect} logic of the selected option.
   */
  public override start(): void {
    super.start();
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
