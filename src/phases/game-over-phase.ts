import { clientSessionId } from "#app/account";
import { BattleType } from "#app/battle";
import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions";
import { getCharVariantFromDialogue } from "#app/data/dialogue";
import type PokemonSpecies from "#app/data/pokemon-species";
import { getPokemonSpecies } from "#app/data/pokemon-species";
import { trainerConfigs } from "#app/data/trainer-config";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { modifierTypes } from "#app/modifier/modifier-type";
import { BattlePhase } from "#app/phases/battle-phase";
import { CheckSwitchPhase } from "#app/phases/check-switch-phase";
import { EncounterPhase } from "#app/phases/encounter-phase";
import { EndCardPhase } from "#app/phases/end-card-phase";
import { GameOverModifierRewardPhase } from "#app/phases/game-over-modifier-reward-phase";
import { PostGameOverPhase } from "#app/phases/post-game-over-phase";
import { RibbonModifierRewardPhase } from "#app/phases/ribbon-modifier-reward-phase";
import { SummonPhase } from "#app/phases/summon-phase";
import { UnlockPhase } from "#app/phases/unlock-phase";
import { api } from "#app/plugins/api/api";
import { achvs, ChallengeAchv } from "#app/system/achv";
import type { SessionSaveData } from "#app/system/game-data";
import TrainerData from "#app/system/trainer-data";
import { Unlockables } from "#app/system/unlockables";
import { Mode } from "#app/ui/ui";
import { isLocal, isLocalServerConnected } from "#app/utils";
import { PlayerGender } from "#enums/player-gender";
import { TrainerType } from "#enums/trainer-type";
import i18next from "i18next";

export class GameOverPhase extends BattlePhase {
  private isVictory: boolean;
  private firstRibbons: PokemonSpecies[] = [];

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
    if (!this.isVictory && !currentBattle.mysteryEncounter?.onGameOver?.()) {
      return this.end();
    }

    if (this.isVictory && gameMode.isEndless) {
      const genderIndex = gameData.gender ?? PlayerGender.UNSET;
      const genderStr = PlayerGender[genderIndex].toLowerCase();
      ui.showDialogue(
        i18next.t("miscDialogue:ending_endless", { context: genderStr }),
        i18next.t("miscDialogue:ending_name"),
        0,
        () => this.handleGameOver(),
      );
    } else if (this.isVictory || !globalScene.enableRetries) {
      this.handleGameOver();
    } else {
      ui.showText(i18next.t("battle:retryBattle"), null, () => {
        ui.setMode(
          Mode.CONFIRM,
          () => {
            ui.fadeOut(1250).then(() => {
              globalScene.reset();
              globalScene.clearPhaseQueue();
              gameData.loadSession(globalScene.sessionSlotId).then(() => {
                globalScene.pushPhase(new EncounterPhase(true));

                const availablePartyMembers = globalScene.getPokemonAllowedInBattle().length;

                globalScene.pushPhase(new SummonPhase(0));
                if (currentBattle.double && availablePartyMembers > 1) {
                  globalScene.pushPhase(new SummonPhase(1));
                }
                if (currentBattle.waveIndex > 1 && currentBattle.battleType !== BattleType.TRAINER) {
                  globalScene.pushPhase(new CheckSwitchPhase(0, currentBattle.double));
                  if (currentBattle.double && availablePartyMembers > 1) {
                    globalScene.pushPhase(new CheckSwitchPhase(1, currentBattle.double));
                  }
                }

                ui.fadeIn(1250);
                this.end();
              });
            });
          },
          () => this.handleGameOver(),
          false,
          0,
          0,
          1000,
        );
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
          } else if (gameMode.isDaily && newClear) {
            gameData.gameStats.dailyRunSessionsWon++;
          }
        }

        const fadeDuration = this.isVictory ? 10000 : 5000;
        globalScene.fadeOutBgm(fadeDuration, true);
        const activeBattlers = globalScene.getField().filter((p) => p?.isActive(true));
        activeBattlers.map((p) => p.hideInfo());
        ui.fadeOut(fadeDuration).then(() => {
          activeBattlers.map((a) => a.setVisible(false));
          globalScene.setFieldScale(1, true);
          globalScene.clearPhaseQueue();
          ui.clearText();

          if (this.isVictory && gameMode.isChallenge) {
            gameMode.challenges.forEach((c) => globalScene.validateAchvs(ChallengeAchv, c));
          }

          const clear = (endCardPhase?: EndCardPhase): void => {
            if (this.isVictory && newClear) {
              this.handleUnlocks();

              for (const species of this.firstRibbons) {
                globalScene.unshiftPhase(new RibbonModifierRewardPhase(modifierTypes.VOUCHER_PLUS, species));
              }
              if (!firstClear) {
                globalScene.unshiftPhase(new GameOverModifierRewardPhase(modifierTypes.VOUCHER_PREMIUM));
              }
            }
            this.getRunHistoryEntry().then((runHistoryEntry) => {
              gameData.saveRunHistory(runHistoryEntry, this.isVictory);
              globalScene.pushPhase(new PostGameOverPhase(endCardPhase));
              this.end();
            });
          };

          if (this.isVictory && gameMode.isClassic) {
            const dialogueKey = "miscDialogue:ending";

            if (!ui.shouldSkipDialogue(dialogueKey)) {
              ui.fadeIn(500).then(() => {
                const genderIndex = gameData.gender ?? PlayerGender.UNSET;
                const genderStr = PlayerGender[genderIndex].toLowerCase();
                // Dialogue has to be retrieved so that the rival's expressions can be loaded and shown via getCharVariantFromDialogue
                const dialogue = i18next.t(dialogueKey, { context: genderStr });
                globalScene.charSprite
                  .showCharacter(
                    `rival_${gameData.gender === PlayerGender.FEMALE ? "m" : "f"}`,
                    getCharVariantFromDialogue(dialogue),
                  )
                  .then(() => {
                    ui.showDialogue(
                      dialogueKey,
                      gameData.gender === PlayerGender.FEMALE
                        ? trainerConfigs[TrainerType.RIVAL].name
                        : trainerConfigs[TrainerType.RIVAL].nameFemale,
                      null,
                      () => {
                        ui.fadeOut(500).then(() => {
                          globalScene.charSprite.hide().then(() => {
                            const endCardPhase = new EndCardPhase();
                            globalScene.unshiftPhase(endCardPhase);
                            clear(endCardPhase);
                          });
                        });
                      },
                    );
                  });
              });
            } else {
              const endCardPhase = new EndCardPhase();
              globalScene.unshiftPhase(endCardPhase);
              clear(endCardPhase);
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
    if (!isLocal || isLocalServerConnected) {
      api.savedata.session
        .newclear({ slot: globalScene.sessionSlotId, isVictory: this.isVictory, clientSessionId: clientSessionId })
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
    const { gameData } = globalScene;
    if (this.isVictory && globalScene.gameMode.isClassic) {
      if (!gameData.unlocks[Unlockables.ENDLESS_MODE]) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.ENDLESS_MODE));
      }
      if (
        globalScene.getPlayerParty().filter((p) => p.fusionSpecies).length
        && !gameData.unlocks[Unlockables.SPLICED_ENDLESS_MODE]
      ) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.SPLICED_ENDLESS_MODE));
      }
      if (!gameData.unlocks[Unlockables.MINI_BLACK_HOLE]) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.MINI_BLACK_HOLE));
      }
      if (
        !gameData.unlocks[Unlockables.EVIOLITE]
        && globalScene.getPlayerParty().some((p) => p.getSpeciesForm(true).speciesId in pokemonEvolutions)
      ) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.EVIOLITE));
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
    const preWaveSessionData = await globalScene.gameData.getSession(globalScene.sessionSlotId);
    const sessionSaveData = globalScene.gameData.getSessionSaveData();
    if (preWaveSessionData) {
      sessionSaveData.modifiers = preWaveSessionData.modifiers;
      sessionSaveData.enemyModifiers = preWaveSessionData.enemyModifiers;
    }
    sessionSaveData.trainer = globalScene.currentBattle.trainer
      ? new TrainerData(globalScene.currentBattle.trainer)
      : null;
    return sessionSaveData;
  }
}
