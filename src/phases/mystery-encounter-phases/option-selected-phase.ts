// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type MysteryEncounterOption from "#app/data/mystery-encounters/mystery-encounter-option";
// -- end tsdoc imports --

import type { OptionPhaseCallback } from "#app/data/mystery-encounters/mystery-encounter-option";
import { transitionMysteryEncounterIntroVisuals } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";

/**
 * Will handle (in order):
 * - Execute {@linkcode MysteryEncounterOption.onOptionPhase} logic if it exists for the selected option
 *
 * It is important to point out that no phases are directly queued by any logic within this phase.
 *
 * Any phase that is meant to follow this one MUST be queued via the onOptionSelect() logic of the selected option
 *
 * @extends Phase
 */
export class MysteryEncounterOptionSelectedPhase extends Phase {
  protected onOptionSelect: OptionPhaseCallback =
    globalScene.currentBattle.mysteryEncounter!.selectedOption!.onOptionPhase;

  public override start(): void {
    super.start();
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
