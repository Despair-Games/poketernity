import * as EncounterPhaseUtils from "#app/data/mystery-encounters/utils/encounter-phase-utils";
import { CommandPhase } from "#app/phases/command-phase";
import { MysteryEncounterBattlePhase } from "#app/phases/mystery-encounter-phases/battle-phase";
import { MysteryEncounterOptionSelectedPhase } from "#app/phases/mystery-encounter-phases/option-selected-phase";
import { MysteryEncounterRewardsPhase } from "#app/phases/mystery-encounter-phases/rewards-phase";
import { PostKnockoutPhase } from "#app/phases/post-knockout-phase";
import type { MessageUiHandler } from "#app/ui/handlers/message-ui-handler";
import type { MysteryEncounterUiHandler } from "#app/ui/handlers/mystery-encounter-ui-handler";
import type { OptionSelectUiHandler } from "#app/ui/handlers/option-select-ui-handler";
import type { PartyUiHandler } from "#app/ui/handlers/party-ui-handler";
import { isNil } from "#app/utils/common-utils";
import { Button } from "#enums/buttons";
import { UiMode } from "#enums/ui-mode";
import type { GameManager } from "#test/test-utils/gameManager";
import { vi } from "vitest";

/**
 * Runs a {@linkcode MysteryEncounter} to either the start of a battle, or to the {@linkcode MysteryEncounterRewardsPhase}, depending on the option selected
 * @param game
 * @param optionNo Human number, not index
 * @param secondaryOptionSelect
 * @param isBattle If selecting option should lead to battle, set to `true`
 */
export async function runMysteryEncounterToEnd(
  game: GameManager,
  optionNo: number,
  secondaryOptionSelect?: { pokemonNo: number; optionNo?: number },
  isBattle: boolean = false,
) {
  vi.spyOn(EncounterPhaseUtils, "selectPokemonForOption");
  await runSelectMysteryEncounterOption(game, optionNo, secondaryOptionSelect);

  // run the selected options phase
  game.onNextPrompt(
    "MysteryEncounterOptionSelectedPhase",
    UiMode.MESSAGE,
    () => {
      const uiHandler = game.scene.ui.getHandler<MysteryEncounterUiHandler>();
      uiHandler.processInput(Button.ACTION);
    },
    () => game.isCurrentPhase(MysteryEncounterBattlePhase) || game.isCurrentPhase(MysteryEncounterRewardsPhase),
  );

  if (isBattle) {
    game.onNextPrompt(
      "CheckSwitchPhase",
      UiMode.CONFIRM,
      () => {
        game.setMode(UiMode.MESSAGE);
        game.endPhase();
      },
      () => game.isCurrentPhase(CommandPhase),
    );

    game.onNextPrompt(
      "CheckSwitchPhase",
      UiMode.MESSAGE,
      () => {
        game.setMode(UiMode.MESSAGE);
        game.endPhase();
      },
      () => game.isCurrentPhase(CommandPhase),
    );

    // If a battle is started, fast forward to end of the battle
    game.onNextPrompt("CommandPhase", UiMode.COMMAND, () => {
      game.scene.phaseManager.clearPhaseQueue();
      game.scene.phaseManager.clearPhaseQueueSplice();
      game.scene.phaseManager.unshiftPhase(new PostKnockoutPhase(0));
      game.endPhase();
    });

    // Handle end of battle trainer messages
    game.onNextPrompt("TrainerVictoryPhase", UiMode.MESSAGE, () => {
      const uiHandler = game.scene.ui.getHandler<MessageUiHandler>();
      uiHandler.processInput(Button.ACTION);
    });

    // Handle egg hatch dialogue
    game.onNextPrompt("EggLapsePhase", UiMode.MESSAGE, () => {
      const uiHandler = game.scene.ui.getHandler<MessageUiHandler>();
      uiHandler.processInput(Button.ACTION);
    });

    await game.phaseInterceptor.to("CommandPhase");
  } else {
    await game.phaseInterceptor.to("MysteryEncounterRewardsPhase");
  }
}

export async function runSelectMysteryEncounterOption(
  game: GameManager,
  optionNo: number,
  secondaryOptionSelect?: { pokemonNo: number; optionNo?: number },
) {
  await game.phaseInterceptor.to("MysteryEncounterPhase", true);

  // select the desired option
  const uiHandler = game.scene.ui.getHandler<MysteryEncounterUiHandler>();
  uiHandler.unblockInput(); // input are blocked by 1s to prevent accidental input. Tests need to handle that

  switch (optionNo) {
    default:
    case 1:
      // no movement needed. Default cursor position
      break;
    case 2:
      uiHandler.processInput(Button.RIGHT);
      break;
    case 3:
      uiHandler.processInput(Button.DOWN);
      break;
    case 4:
      uiHandler.processInput(Button.RIGHT);
      uiHandler.processInput(Button.DOWN);
      break;
  }

  if (!isNil(secondaryOptionSelect?.pokemonNo)) {
    await handleSecondaryOptionSelect(game, secondaryOptionSelect.pokemonNo, secondaryOptionSelect.optionNo);
  } else {
    uiHandler.processInput(Button.ACTION);
  }
}

/**
 * @param game - The {@linkcode GameManager}.
 * @param pokemonNo - The Pokemon to select, from 1 to 6.
 * @param optionNo - (Optional) If the Pokemon selection is followed by another menu,
 *   the number of the option to select for this menu, starting from 1.
 */
async function handleSecondaryOptionSelect(game: GameManager, pokemonNo: number, optionNo?: number) {
  // Queue prompt reaction to select the requested Pokemon in party screen
  game.onNextPrompt(
    "MysteryEncounterPhase",
    UiMode.PARTY,
    () => {
      const partyUiHandler = game.scene.ui.getHandler<PartyUiHandler>();
      // Move to the requested Pokemon, open menu and click "Select"
      for (let i = 1; i < pokemonNo; i++) {
        partyUiHandler.processInput(Button.DOWN);
      }
      partyUiHandler.processInput(Button.ACTION);
      partyUiHandler.processInput(Button.ACTION);
    },
    () => game.isCurrentPhase(MysteryEncounterOptionSelectedPhase),
  );

  // Queue prompt reaction to select the requested option in the Option Select menu
  if (!isNil(optionNo)) {
    game.onNextPrompt(
      "MysteryEncounterPhase",
      UiMode.OPTION_SELECT,
      () => {
        const optionUiHandler = game.scene.ui.getHandler<OptionSelectUiHandler>();
        // Navigate to and select the requestion option
        for (let i = 1; i < optionNo; i++) {
          optionUiHandler.processInput(Button.DOWN);
        }
        optionUiHandler.processInput(Button.ACTION);
      },
      () => game.isCurrentPhase(MysteryEncounterOptionSelectedPhase),
    );
  }

  const encounterUiHandler = game.scene.ui.getHandler<MysteryEncounterUiHandler>();
  encounterUiHandler.processInput(Button.ACTION);
}

/**
 * For any {@linkcode MysteryEncounter} that has a battle, can call this to skip battle and proceed to {@linkcode MysteryEncounterRewardsPhase}
 * @param game
 * @param runRewardsPhase
 */
export async function skipBattleRunMysteryEncounterRewardsPhase(game: GameManager, runRewardsPhase: boolean = true) {
  game.scene.phaseManager.clearPhaseQueue();
  game.scene.phaseManager.clearPhaseQueueSplice();
  game.scene.getEnemyParty().forEach((p) => {
    p.faint();
    game.scene.field.remove(p);
  });
  game.scene.phaseManager.pushPhase(new PostKnockoutPhase(0));
  game.phaseInterceptor.superEndPhase();
  game.setMode(UiMode.MESSAGE);
  await game.phaseInterceptor.to("MysteryEncounterRewardsPhase", runRewardsPhase);
}
