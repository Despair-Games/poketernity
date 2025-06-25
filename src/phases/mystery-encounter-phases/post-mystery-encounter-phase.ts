// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type MysteryEncounterOption from "#mystery-encounters/mystery-encounter-option";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PhaseId } from "#enums/phase-id";
import { getEncounterText } from "#mystery-encounters/encounter-dialogue-utils";
import type { OptionPhaseCallback } from "#mystery-encounters/mystery-encounter-option";
import { NewBattlePhase } from "#phases/new-battle-phase";
import { isNil } from "#utils/common-utils";
/**
 * Will handle (in order):
 * - {@linkcode MysteryEncounterOption.onPostOptionPhase} logic (based on an option that was selected)
 * - Showing any outro dialogue messages
 * - Cleanup of any leftover intro visuals
 * - Queuing of the next wave
 */
export class PostMysteryEncounterPhase extends Phase {
  override readonly id = PhaseId.ME_POST;

  private readonly FIRST_DIALOGUE_PROMPT_DELAY = 750;
  protected onPostOptionSelect?: OptionPhaseCallback =
    globalScene.currentBattle.mysteryEncounter?.selectedOption?.onPostOptionPhase;

  /**
   * Runs {@linkcode MysteryEncounterOption.onPostOptionPhase} then continues encounter
   */
  public override start(): void {
    super.start();

    const { mysteryEncounter } = globalScene.currentBattle;

    if (this.onPostOptionSelect) {
      globalScene.executeWithSeedOffset(
        async () => {
          return await this.onPostOptionSelect!().then((result) => {
            if (isNil(result) || result) {
              this.continueEncounter();
            }
          });
        },
        (mysteryEncounter?.getSeedOffset() ?? 0) * 2000,
      );
    } else {
      this.continueEncounter();
    }
  }

  /**
   * Queues {@linkcode NewBattlePhase}, plays outro dialogue and ends phase
   */
  protected continueEncounter(): void {
    const { currentBattle, ui } = globalScene;
    const { mysteryEncounter } = currentBattle;

    const endPhase = (): void => {
      globalScene.phaseManager.pushPhase(new NewBattlePhase());
      this.end();
    };

    const outroDialogue = mysteryEncounter?.dialogue?.outro;
    if (outroDialogue && outroDialogue.length > 0) {
      let i = 0;
      const showNextDialogue = (): void => {
        const nextAction = i === outroDialogue.length - 1 ? endPhase : showNextDialogue;
        const dialogue = outroDialogue[i];
        let title: string | null = null;
        const text: string | null = getEncounterText(dialogue.text);
        if (dialogue.speaker) {
          title = getEncounterText(dialogue.speaker);
        }

        i++;
        ui.setMessageMode();
        if (title) {
          ui.showDialogue(text ?? "", title, null, nextAction, 0, i === 1 ? this.FIRST_DIALOGUE_PROMPT_DELAY : 0);
        } else {
          ui.showText(text ?? "", null, nextAction, i === 1 ? this.FIRST_DIALOGUE_PROMPT_DELAY : 0, true);
        }
      };

      showNextDialogue();
    } else {
      endPhase();
    }
  }
}
