import type { OptionPhaseCallback } from "#app/data/mystery-encounters/mystery-encounter-option";
import { getEncounterText } from "#app/data/mystery-encounters/utils/encounter-dialogue-utils";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { NewBattlePhase } from "#app/phases/new-battle-phase";
import { Mode } from "#app/ui/ui";
import { isNullOrUndefined } from "#app/utils";
// tsdoc imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type MysteryEncounterOption from "#app/data/mystery-encounters/mystery-encounter-option";

/**
 * Will handle (in order):
 * - {@linkcode MysteryEncounterOption.onPostOptionPhase} logic (based on an option that was selected)
 * - Showing any outro dialogue messages
 * - Cleanup of any leftover intro visuals
 * - Queuing of the next wave
 *
 * @extends Phase
 */
export class PostMysteryEncounterPhase extends Phase {
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
            if (isNullOrUndefined(result) || result) {
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
      globalScene.pushPhase(new NewBattlePhase());
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
        ui.setMode(Mode.MESSAGE);
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
