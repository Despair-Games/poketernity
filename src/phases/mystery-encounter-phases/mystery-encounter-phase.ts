import type MysteryEncounterOption from "#app/data/mystery-encounters/mystery-encounter-option";
import { SeenEncounterData } from "#app/data/mystery-encounters/mystery-encounter-save-data";
import { getEncounterText } from "#app/data/mystery-encounters/utils/encounter-dialogue-utils";
import type { OptionSelectSettings } from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { Mode } from "#app/ui/ui";
import { isNullOrUndefined } from "#app/utils";
import { MysteryEncounterOptionSelectedPhase } from "./option-selected-phase";

/**
 * Will handle (in order):
 * - Clearing of phase queues to enter the Mystery Encounter game state
 * - Management of session data related to MEs
 * - Initialization of ME option select menu and UI
 * - Execute {@linkcode MysteryEncounter.onPreOptionPhase} logic if it exists for the selected option
 * - Display any `OptionTextDisplay.selected` type dialogue that is set in the {@linkcode MysteryEncounterDialogue} dialogue tree for selected option
 * - Queuing of the {@linkcode MysteryEncounterOptionSelectedPhase}
 */

export class MysteryEncounterPhase extends Phase {
  private readonly FIRST_DIALOGUE_PROMPT_DELAY = 300;
  protected optionSelectSettings?: OptionSelectSettings;

  /**
   * Mostly useful for having repeated queries during a single encounter, where the queries and options may differ each time
   * @param scene
   * @param optionSelectSettings allows overriding the typical options of an encounter with new ones
   */
  constructor(optionSelectSettings?: OptionSelectSettings) {
    super();
    this.optionSelectSettings = optionSelectSettings;
  }

  /**
   * Updates seed offset, sets seen encounter session data, sets UI mode
   */
  public override start(): void {
    super.start();

    const { currentBattle, mysteryEncounterSaveData, ui } = globalScene;
    const mysteryEncounter = currentBattle.mysteryEncounter!; // TODO: Resolve bang?

    // Clears out queued phases that are part of standard battle
    globalScene.clearPhaseQueue();
    globalScene.clearPhaseQueueSplice();

    mysteryEncounter.updateSeedOffset();

    if (!this.optionSelectSettings) {
      // Sets flag that ME was encountered, only if this is not a followup option select phase
      // Can be used in later MEs to check for requirements to spawn, run history, etc.
      mysteryEncounterSaveData.encounteredEvents.push(
        new SeenEncounterData(mysteryEncounter.encounterType, mysteryEncounter.encounterTier, currentBattle.waveIndex),
      );
    }

    // Initiates encounter dialogue window and option select
    ui.setMode(Mode.MYSTERY_ENCOUNTER, this.optionSelectSettings);
  }

  /**
   * Triggers after a player selects an option for the encounter
   * @param option
   * @param index
   */
  public handleOptionSelect(option: MysteryEncounterOption, index: number): boolean {
    const { currentBattle, mysteryEncounterSaveData } = globalScene;
    const mysteryEncounter = currentBattle.mysteryEncounter!; // TODO: Resolve bang?

    // Set option selected flag
    mysteryEncounter.selectedOption = option;

    if (!this.optionSelectSettings) {
      // Saves the selected option in the ME save data, only if this is not a followup option select phase
      // Can be used for analytics purposes to track what options are popular on certain encounters
      const encounterSaveData =
        mysteryEncounterSaveData.encounteredEvents[mysteryEncounterSaveData.encounteredEvents.length - 1];
      if (encounterSaveData.type === mysteryEncounter?.encounterType) {
        encounterSaveData.selectedOption = index;
      }
    }

    if (!option.onOptionPhase) {
      return false;
    }

    // Populate dialogue tokens for option requirements
    mysteryEncounter.populateDialogueTokensFromRequirements();

    if (option.onPreOptionPhase) {
      globalScene.executeWithSeedOffset(async () => {
        return await option.onPreOptionPhase!().then((result) => {
          if (isNullOrUndefined(result) || result) {
            this.continueEncounter();
          }
        });
      }, mysteryEncounter?.getSeedOffset() ?? 0);
    } else {
      this.continueEncounter();
    }

    return true;
  }

  /**
   * Queues {@linkcode MysteryEncounterOptionSelectedPhase}, displays option.selected dialogue and ends phase
   */
  public continueEncounter(): void {
    const { currentBattle, ui } = globalScene;

    const endDialogueAndContinueEncounter = (): void => {
      globalScene.pushPhase(new MysteryEncounterOptionSelectedPhase());
      this.end();
    };

    const optionSelectDialogue = currentBattle?.mysteryEncounter?.selectedOption?.dialogue;
    if (optionSelectDialogue?.selected && optionSelectDialogue.selected.length > 0) {
      // Handle intermediate dialogue (between player selection event and the onOptionSelect logic)
      ui.setMode(Mode.MESSAGE);
      const selectedDialogue = optionSelectDialogue.selected;
      let i = 0;
      const showNextDialogue = (): void => {
        const nextAction = i === selectedDialogue.length - 1 ? endDialogueAndContinueEncounter : showNextDialogue;
        const dialogue = selectedDialogue[i];
        let title: string | null = null;
        const text: string | null = getEncounterText(dialogue.text);
        if (dialogue.speaker) {
          title = getEncounterText(dialogue.speaker);
        }

        i++;
        if (title) {
          ui.showDialogue(text ?? "", title, null, nextAction, 0, i === 1 ? this.FIRST_DIALOGUE_PROMPT_DELAY : 0);
        } else {
          ui.showText(text ?? "", null, nextAction, i === 1 ? this.FIRST_DIALOGUE_PROMPT_DELAY : 0, true);
        }
      };

      showNextDialogue();
    } else {
      endDialogueAndContinueEncounter();
    }
  }

  /**
   * Ends phase
   */
  public override end(): void {
    globalScene.ui.setMode(Mode.MESSAGE).then(() => super.end());
  }
}
