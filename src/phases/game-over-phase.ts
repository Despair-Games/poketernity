import { api } from "#api/api";
import { clientSessionId } from "#app/account";
import { globalScene } from "#app/global-scene";
import { getCharVariantFromDialogue } from "#data/dialogue";
import type { PokemonSpecies } from "#data/pokemon-species";
import { AchvCategory } from "#enums/achv-category";
import { PlayerGender } from "#enums/player-gender";
import { TrainerType } from "#enums/trainer-type";
import { UiMode } from "#enums/ui-mode";
import { Unlockables } from "#enums/unlockables";
import type { Pokemon } from "#field/pokemon";
import { pokemonEvolutions } from "#init/init-pokemon-evolutions";
import { modifierTypes } from "#modifier/modifier-types";
import { BattlePhase } from "#phases/base/battle-phase";
import type { EndCardPhase } from "#phases/end-card-phase";
import { achvs } from "#system/achievements";
import { settings } from "#system/settings-manager";
import { TrainerData } from "#system/trainer-data";
import { allTrainerConfigs } from "#trainer-configs/all-trainer-configs";
import type { SessionSaveData } from "#types/session-data";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import { enumValueToKey } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import i18next from "i18next";

/**
 * Handles the effects of the player ending a run:
 * - If this is a Mystery Encounter that allows the player to lose without ending the run, end the phase early.
 * - Validate various achievements
 * - Award unlockables if necessary
 * - Award ribbons + vouchers per player pokemon if a victory
 */
export class GameOverPhase extends BattlePhase {
  public override readonly phaseName = "GameOverPhase";

  private isVictory: boolean;
  private readonly firstRibbons: PokemonSpecies[] = [];

  constructor(isVictory: boolean = false) {
    super();

    this.isVictory = isVictory;
  }

  public override async start(): Promise<void> {
    const { currentBattle, gameData, gameMode, phaseManager, ui, sessionSlotId } = globalScene;

    // Failsafe if players somehow skip floor 200 in classic mode
    if (gameMode.isClassic && currentBattle.waveIndex > 200) {
      this.isVictory = true;
    }

    // Handle Mystery Encounter special Game Over cases
    // Situations such as when player lost a battle, but it isn't treated as full Game Over
    if (!this.isVictory && currentBattle.mysteryEncounter?.onGameOver && !currentBattle.mysteryEncounter.onGameOver()) {
      this.end();
      return;
    }

    if (this.isVictory || !settings.general.enableRetries) {
      await this.handleGameOver();
    } else {
      const reloadGame = async (): Promise<void> => {
        await ui.fadeOut(1250);
        globalScene.reset();
        phaseManager.clear();
        await gameData.loadSession(sessionSlotId);
        phaseManager.createAndPushPhase("EncounterPhase", true);
        ui.fadeIn(1250);
        this.end();
      };

      ui.showText(i18next.t("battle:retryBattle"), {
        callback: () => {
          const retryOptions: ConfirmModeConfig = {
            yesHandler: reloadGame,
            noHandler: async () => {
              await this.handleGameOver();
            },
            inputDelay: 1000,
          };
          ui.setMode<ConfirmUiHandler>(UiMode.CONFIRM, retryOptions);
        },
      });
    }
  }

  protected async handleGameOver(): Promise<void> {
    const { audioManager, charSprite, gameData, gameMode, phaseManager, ui, sessionSlotId, time } = globalScene;

    const doGameOver = (newClear: boolean): void => {
      globalScene.disableMenu = true;
      time.delayedCall(1000, async () => {
        let firstClear = false;

        if (this.isVictory && newClear) {
          if (gameMode.isClassic) {
            firstClear = globalScene.validateAchv(achvs.CLASSIC_VICTORY);
            globalScene.validateAchv(achvs.UNEVOLVED_CLASSIC_VICTORY);
            gameData.gameStats.sessionsWon++;
            for (const pokemon of globalScene.getPlayerParty()) {
              this.awardRibbon(pokemon);

              if (pokemon.species.getRootSpeciesId() !== pokemon.species.getRootSpeciesId(true)) {
                this.awardRibbon(pokemon, true);
              }
            }
          } else if (gameMode.isDaily) {
            gameData.gameStats.dailyRunSessionsWon++;
          }
        }

        const fadeDuration = this.isVictory ? 10000 : 5000;
        audioManager.fadeOutBgm(fadeDuration, true);
        const activeBattlers = globalScene.getField().filter((p) => p?.isActive(true));
        activeBattlers.map((p) => p.hideInfo());

        await ui.fadeOut(fadeDuration);
        activeBattlers.map((a) => a.setVisible(false));
        globalScene.setFieldScale(1, true);
        phaseManager.clear();
        ui.clearText();

        if (this.isVictory && gameMode.isChallenge) {
          gameMode.challenges.forEach((c) => globalScene.validateAchvs(AchvCategory.CHALLENGE, c));
        }

        const clear = async (endCardPhase?: EndCardPhase): Promise<void> => {
          if (this.isVictory && newClear) {
            this.handleUnlocks();

            for (const species of this.firstRibbons) {
              phaseManager.createAndUnshiftPhase("RibbonModifierRewardPhase", modifierTypes.VOUCHER_PLUS, species);
            }

            if (!firstClear) {
              phaseManager.createAndUnshiftPhase("GameOverModifierRewardPhase", modifierTypes.VOUCHER_PREMIUM);
            }
          }

          const runHistoryEntry = await this.getRunHistoryEntry();
          gameData.saveRunHistory(runHistoryEntry, this.isVictory);
          phaseManager.createAndPushPhase("PostGameOverPhase", endCardPhase);
          this.end();
        };

        if (this.isVictory && gameMode.isClassic) {
          const dialogueKey = "miscDialogue:ending";
          const displayEndCard = async (): Promise<void> => {
            const endCardPhase = phaseManager.createPhase("EndCardPhase");
            phaseManager.unshiftPhase(endCardPhase);
            await clear(endCardPhase);
          };

          const playerGender = settings.display.playerGender;
          if (ui.shouldSkipDialogue(dialogueKey)) {
            await displayEndCard();
          } else {
            await ui.fadeIn(500);
            const genderIndex = playerGender ?? PlayerGender.UNSET;
            const genderStr = enumValueToKey(PlayerGender, genderIndex).toLowerCase();
            // Dialogue has to be retrieved so that the rival's expressions can be loaded and shown via getCharVariantFromDialogue
            const dialogue = i18next.t(dialogueKey, { context: genderStr });
            const rivalName =
              playerGender === PlayerGender.FEMALE
                ? allTrainerConfigs[TrainerType.RIVAL].name
                : allTrainerConfigs[TrainerType.RIVAL].nameFemale;

            await charSprite.showCharacter(
              `rival_${playerGender === PlayerGender.FEMALE ? "m" : "f"}`,
              getCharVariantFromDialogue(dialogue),
            );
            ui.showDialogue(dialogueKey, rivalName, async () => {
              await ui.fadeOut(500);
              await charSprite.hide();
              await displayEndCard();
            });
          }
        } else {
          await clear();
        }
      });
    };

    /**
     * Check to see if the game is running offline
     * If Online, execute apiFetch as intended
     * If Offline, execute offlineNewClear() only for victory, a localStorage implementation of newClear daily run checks
     */
    if (!api.isLocal || api.isConnected) {
      const success = await api.savedata.session.newclear({
        slot: sessionSlotId,
        isVictory: this.isVictory,
        clientSessionId,
      });
      doGameOver(success);
    } else if (this.isVictory) {
      const result = await gameData.offlineNewClear();
      doGameOver(result);
    } else {
      doGameOver(false);
    }
  }

  protected handleUnlocks(): void {
    const { gameData, gameMode, phaseManager } = globalScene;

    if (this.isVictory && gameMode.isClassic) {
      if (!gameData.unlocks[Unlockables.CHALLENGE_MODE]) {
        phaseManager.createAndUnshiftPhase("UnlockPhase", Unlockables.CHALLENGE_MODE);
      }

      if (!gameData.unlocks[Unlockables.MINI_BLACK_HOLE]) {
        phaseManager.createAndUnshiftPhase("UnlockPhase", Unlockables.MINI_BLACK_HOLE);
      }

      if (
        !gameData.unlocks[Unlockables.EVIOLITE]
        && globalScene.getPlayerParty().some((p) => p.getSpeciesForm(true).speciesId in pokemonEvolutions)
      ) {
        phaseManager.createAndUnshiftPhase("UnlockPhase", Unlockables.EVIOLITE);
      }
    }
  }

  protected awardRibbon(pokemon: Pokemon, forStarter: boolean = false): void {
    const speciesId = getPokemonSpecies(pokemon.species.speciesId);
    const speciesRibbonCount = globalScene.gameData.incrementRibbonCount(speciesId, forStarter);
    // first time classic win, award voucher
    if (speciesRibbonCount === 1) {
      this.firstRibbons.push(getPokemonSpecies(pokemon.species.getRootSpeciesId(forStarter)));
    }
  }

  /**
   * Slightly modified version of {@linkcode GameData.getSessionSaveData}.
   * @returns A promise containing the {@linkcode SessionSaveData}
   */
  private async getRunHistoryEntry(): Promise<SessionSaveData> {
    const { currentBattle, gameData, sessionSlotId } = globalScene;

    const preWaveSessionData = await gameData.getSession(sessionSlotId);
    const sessionSaveData = gameData.getSessionSaveData();

    if (preWaveSessionData) {
      sessionSaveData.modifiers = preWaveSessionData.modifiers;
      sessionSaveData.enemyModifiers = preWaveSessionData.enemyModifiers;
    }
    sessionSaveData.trainer = currentBattle.trainer ? new TrainerData(currentBattle.trainer) : null;

    return sessionSaveData;
  }
}
