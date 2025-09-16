import { api } from "#api/api";
import { clientSessionId } from "#app/account";
import { globalScene } from "#app/global-scene";
import { getCharVariantFromDialogue } from "#data/dialogue";
import type { PokemonSpecies } from "#data/pokemon-species";
import { AchvCategory } from "#enums/achv-category";
import { BattleType } from "#enums/battle-type";
import { BattlerIndex } from "#enums/battler-index";
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

  public override start(): void {
    super.start();

    const { currentBattle, gameData, gameMode, ui } = globalScene;

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

    if (this.isVictory && gameMode.isEndless) {
      const genderIndex = settings.display.playerGender ?? PlayerGender.UNSET;
      const genderStr = enumValueToKey(PlayerGender, genderIndex).toLowerCase();
      ui.showDialogue(
        i18next.t("miscDialogue:ending_endless", { context: genderStr }),
        i18next.t("miscDialogue:ending_name"),
        () => this.handleGameOver(),
        0,
      );
    } else if (this.isVictory || !settings.general.enableRetries) {
      this.handleGameOver();
    } else {
      const reloadGame = (): void => {
        ui.fadeOut(1250).then(() => {
          globalScene.reset();
          globalScene.phaseManager.clearPhaseQueue();
          gameData.loadSession(globalScene.sessionSlotId).then(() => {
            globalScene.phaseManager.createAndPushPhase("EncounterPhase", true);

            const availablePartyMembers = globalScene.getPokemonAllowedInBattle().length;

            globalScene.phaseManager.createAndPushPhase("SummonPhase", BattlerIndex.PLAYER, {
              loaded: true,
              delayPostSummon: true,
            });
            if (currentBattle.double && availablePartyMembers > 1) {
              globalScene.phaseManager.createAndPushPhase("SummonPhase", BattlerIndex.PLAYER_2, {
                loaded: true,
                delayPostSummon: true,
              });
            }
            // TODO: Should this also check `!gameMode.isDaily` like in `TitlePhase.end()`?
            if (currentBattle.waveIndex > 1 && currentBattle.battleType !== BattleType.TRAINER) {
              globalScene.phaseManager.createAndPushPhase("CheckSwitchPhase", 0, currentBattle.double);
              if (currentBattle.double && availablePartyMembers > 1) {
                globalScene.phaseManager.createAndPushPhase("CheckSwitchPhase", 1, currentBattle.double);
              }
            }

            ui.fadeIn(1250);
            this.end();
          });
        });
      };

      ui.showText(i18next.t("battle:retryBattle"), {
        callback: () => {
          const retryOptions: ConfirmModeConfig = {
            yesHandler: reloadGame,
            noHandler: () => {
              this.handleGameOver();
            },
            inputDelay: 1000,
          };
          ui.setMode<ConfirmUiHandler>(UiMode.CONFIRM, retryOptions);
        },
      });
    }
  }

  protected handleGameOver(): void {
    const { gameData, gameMode, ui } = globalScene;

    const doGameOver = (newClear: boolean): void => {
      globalScene.disableMenu = true;
      globalScene.time.delayedCall(1000, () => {
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
        globalScene.audioManager.fadeOutBgm(fadeDuration, true);
        const activeBattlers = globalScene.getField().filter((p) => p?.isActive(true));
        activeBattlers.map((p) => p.hideInfo());

        ui.fadeOut(fadeDuration).then(() => {
          activeBattlers.map((a) => a.setVisible(false));
          globalScene.setFieldScale(1, true);
          globalScene.phaseManager.clearPhaseQueue();
          ui.clearText();

          if (this.isVictory && gameMode.isChallenge) {
            gameMode.challenges.forEach((c) => globalScene.validateAchvs(AchvCategory.CHALLENGE, c));
          }

          const clear = (endCardPhase?: EndCardPhase): void => {
            if (this.isVictory && newClear) {
              this.handleUnlocks();

              for (const species of this.firstRibbons) {
                globalScene.phaseManager.createAndUnshiftPhase(
                  "RibbonModifierRewardPhase",
                  modifierTypes.VOUCHER_PLUS,
                  species,
                );
              }

              if (!firstClear) {
                globalScene.phaseManager.createAndUnshiftPhase(
                  "GameOverModifierRewardPhase",
                  modifierTypes.VOUCHER_PREMIUM,
                );
              }
            }

            this.getRunHistoryEntry().then((runHistoryEntry) => {
              gameData.saveRunHistory(runHistoryEntry, this.isVictory);
              globalScene.phaseManager.createAndPushPhase("PostGameOverPhase", endCardPhase);
              this.end();
            });
          };

          if (this.isVictory && gameMode.isClassic) {
            const dialogueKey = "miscDialogue:ending";
            const displayEndCard = (): void => {
              const endCardPhase = globalScene.phaseManager.createPhase("EndCardPhase");
              globalScene.phaseManager.unshiftPhase(endCardPhase);
              clear(endCardPhase);
            };

            const playerGender = settings.display.playerGender;
            if (ui.shouldSkipDialogue(dialogueKey)) {
              displayEndCard();
            } else {
              ui.fadeIn(500).then(() => {
                const genderIndex = playerGender ?? PlayerGender.UNSET;
                const genderStr = enumValueToKey(PlayerGender, genderIndex).toLowerCase();
                // Dialogue has to be retrieved so that the rival's expressions can be loaded and shown via getCharVariantFromDialogue
                const dialogue = i18next.t(dialogueKey, { context: genderStr });
                const rivalName =
                  playerGender === PlayerGender.FEMALE
                    ? allTrainerConfigs[TrainerType.RIVAL].name
                    : allTrainerConfigs[TrainerType.RIVAL].nameFemale;

                globalScene.charSprite
                  .showCharacter(
                    `rival_${playerGender === PlayerGender.FEMALE ? "m" : "f"}`,
                    getCharVariantFromDialogue(dialogue),
                  )
                  .then(() => {
                    ui.showDialogue(dialogueKey, rivalName, () => {
                      ui.fadeOut(500).then(() => {
                        globalScene.charSprite.hide().then(() => {
                          displayEndCard();
                        });
                      });
                    });
                  });
              });
            }
          } else {
            clear();
          }
        });
      });
    };

    /**
     * Check to see if the game is running offline
     * If Online, execute apiFetch as intended
     * If Offline, execute offlineNewClear() only for victory, a localStorage implementation of newClear daily run checks
     */
    if (!api.isLocal || api.isConnected) {
      api.savedata.session
        .newclear({ slot: globalScene.sessionSlotId, isVictory: this.isVictory, clientSessionId })
        .then((success) => doGameOver(success));
    } else if (this.isVictory) {
      gameData.offlineNewClear().then((result) => {
        doGameOver(result);
      });
    } else {
      doGameOver(false);
    }
  }

  protected handleUnlocks(): void {
    const { gameData, gameMode } = globalScene;

    if (this.isVictory && gameMode.isClassic) {
      if (!gameData.unlocks[Unlockables.ENDLESS_MODE]) {
        globalScene.phaseManager.createAndUnshiftPhase("UnlockPhase", Unlockables.ENDLESS_MODE);
      }

      if (!gameData.unlocks[Unlockables.MINI_BLACK_HOLE]) {
        globalScene.phaseManager.createAndUnshiftPhase("UnlockPhase", Unlockables.MINI_BLACK_HOLE);
      }

      if (
        !gameData.unlocks[Unlockables.EVIOLITE]
        && globalScene.getPlayerParty().some((p) => p.getSpeciesForm(true).speciesId in pokemonEvolutions)
      ) {
        globalScene.phaseManager.createAndUnshiftPhase("UnlockPhase", Unlockables.EVIOLITE);
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
    const { currentBattle, gameData } = globalScene;

    const preWaveSessionData = await gameData.getSession(globalScene.sessionSlotId);
    const sessionSaveData = gameData.getSessionSaveData();

    if (preWaveSessionData) {
      sessionSaveData.modifiers = preWaveSessionData.modifiers;
      sessionSaveData.enemyModifiers = preWaveSessionData.enemyModifiers;
    }
    sessionSaveData.trainer = currentBattle.trainer ? new TrainerData(currentBattle.trainer) : null;

    return sessionSaveData;
  }
}
