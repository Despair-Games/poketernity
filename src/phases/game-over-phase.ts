import { clientSessionId } from "#app/account";
import { BattleType } from "#app/battle";
import { globalScene } from "#app/battle-scene";
import { getCharVariantFromDialogue } from "#app/data/dialogue";
import { pokemonEvolutions } from "#app/data/balance/pokemon-evolutions";
import PokemonSpecies, { getPokemonSpecies } from "#app/data/pokemon-species";
import { trainerConfigs } from "#app/data/trainer-config";
import Pokemon from "#app/field/pokemon";
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
import { achvs, ChallengeAchv } from "#app/system/achv";
import { Unlockables } from "#app/system/unlockables";
import { Mode } from "#app/ui/ui";
import * as Utils from "#app/utils";
import { PlayerGender } from "#enums/player-gender";
import { TrainerType } from "#enums/trainer-type";
import i18next from "i18next";

export class GameOverPhase extends BattlePhase {
  private victory: boolean;
  private firstRibbons: PokemonSpecies[] = [];

  constructor(victory?: boolean) {
    super();

    this.victory = !!victory;
  }

  start() {
    super.start();

    // Failsafe if players somehow skip floor 200 in classic mode
    if (globalScene.gameMode.isClassic && globalScene.currentBattle.waveIndex > 200) {
      this.victory = true;
    }

    // Handle Mystery Encounter special Game Over cases
    // Situations such as when player lost a battle, but it isn't treated as full Game Over
    if (!this.victory && globalScene.currentBattle.mysteryEncounter?.onGameOver && !globalScene.currentBattle.mysteryEncounter.onGameOver()) {
      // Do not end the game
      return this.end();
    }
    // Otherwise, continue standard Game Over logic

    if (this.victory && globalScene.gameMode.isEndless) {
      const genderIndex = globalScene.gameData.gender ?? PlayerGender.UNSET;
      const genderStr = PlayerGender[genderIndex].toLowerCase();
      globalScene.ui.showDialogue(i18next.t("miscDialogue:ending_endless", { context: genderStr }), i18next.t("miscDialogue:ending_name"), 0, () => this.handleGameOver());
    } else if (this.victory || !globalScene.enableRetries) {
      this.handleGameOver();
    } else {
      globalScene.ui.showText(i18next.t("battle:retryBattle"), null, () => {
        globalScene.ui.setMode(Mode.CONFIRM, () => {
          globalScene.ui.fadeOut(1250).then(() => {
            globalScene.reset();
            globalScene.clearPhaseQueue();
            globalScene.gameData.loadSession(globalScene.sessionSlotId).then(() => {
              globalScene.pushPhase(new EncounterPhase(true));

              const availablePartyMembers = globalScene.getParty().filter(p => p.isAllowedInBattle()).length;

              globalScene.pushPhase(new SummonPhase(0));
              if (globalScene.currentBattle.double && availablePartyMembers > 1) {
                globalScene.pushPhase(new SummonPhase(1));
              }
              if (globalScene.currentBattle.waveIndex > 1 && globalScene.currentBattle.battleType !== BattleType.TRAINER) {
                globalScene.pushPhase(new CheckSwitchPhase(0, globalScene.currentBattle.double));
                if (globalScene.currentBattle.double && availablePartyMembers > 1) {
                  globalScene.pushPhase(new CheckSwitchPhase(1, globalScene.currentBattle.double));
                }
              }

              globalScene.ui.fadeIn(1250);
              this.end();
            });
          });
        }, () => this.handleGameOver(), false, 0, 0, 1000);
      });
    }
  }

  handleGameOver(): void {
    const doGameOver = (newClear: boolean) => {
      globalScene.disableMenu = true;
      globalScene.time.delayedCall(1000, () => {
        let firstClear = false;
        if (this.victory && newClear) {
          if (globalScene.gameMode.isClassic) {
            firstClear = globalScene.validateAchv(achvs.CLASSIC_VICTORY);
            globalScene.validateAchv(achvs.UNEVOLVED_CLASSIC_VICTORY);
            globalScene.gameData.gameStats.sessionsWon++;
            for (const pokemon of globalScene.getParty()) {
              this.awardRibbon(pokemon);

              if (pokemon.species.getRootSpeciesId() !== pokemon.species.getRootSpeciesId(true)) {
                this.awardRibbon(pokemon, true);
              }
            }
          } else if (globalScene.gameMode.isDaily && newClear) {
            globalScene.gameData.gameStats.dailyRunSessionsWon++;
          }
        }
        globalScene.gameData.saveRunHistory(globalScene.gameData.getSessionSaveData(), this.victory);
        const fadeDuration = this.victory ? 10000 : 5000;
        globalScene.fadeOutBgm(fadeDuration, true);
        const activeBattlers = globalScene.getField().filter(p => p?.isActive(true));
        activeBattlers.map(p => p.hideInfo());
        globalScene.ui.fadeOut(fadeDuration).then(() => {
          activeBattlers.map(a => a.setVisible(false));
          globalScene.setFieldScale(1, true);
          globalScene.clearPhaseQueue();
          globalScene.ui.clearText();

          if (this.victory && globalScene.gameMode.isChallenge) {
            globalScene.gameMode.challenges.forEach(c => globalScene.validateAchvs(ChallengeAchv, c));
          }

          const clear = (endCardPhase?: EndCardPhase) => {
            if (newClear) {
              this.handleUnlocks();
            }
            if (this.victory && newClear) {
              for (const species of this.firstRibbons) {
                globalScene.unshiftPhase(new RibbonModifierRewardPhase(modifierTypes.VOUCHER_PLUS, species));
              }
              if (!firstClear) {
                globalScene.unshiftPhase(new GameOverModifierRewardPhase(modifierTypes.VOUCHER_PREMIUM));
              }
            }
            globalScene.pushPhase(new PostGameOverPhase(endCardPhase));
            this.end();
          };

          if (this.victory && globalScene.gameMode.isClassic) {
            const dialogueKey = "miscDialogue:ending";

            if (!globalScene.ui.shouldSkipDialogue(dialogueKey)) {
              globalScene.ui.fadeIn(500).then(() => {
                const genderIndex = globalScene.gameData.gender ?? PlayerGender.UNSET;
                const genderStr = PlayerGender[genderIndex].toLowerCase();
                // Dialogue has to be retrieved so that the rival's expressions can be loaded and shown via getCharVariantFromDialogue
                const dialogue = i18next.t(dialogueKey, { context: genderStr });
                globalScene.charSprite.showCharacter(`rival_${globalScene.gameData.gender === PlayerGender.FEMALE ? "m" : "f"}`, getCharVariantFromDialogue(dialogue)).then(() => {
                  globalScene.ui.showDialogue(dialogueKey, globalScene.gameData.gender === PlayerGender.FEMALE ? trainerConfigs[TrainerType.RIVAL].name : trainerConfigs[TrainerType.RIVAL].nameFemale, null, () => {
                    globalScene.ui.fadeOut(500).then(() => {
                      globalScene.charSprite.hide().then(() => {
                        const endCardPhase = new EndCardPhase();
                        globalScene.unshiftPhase(endCardPhase);
                        clear(endCardPhase);
                      });
                    });
                  });
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

    /* Added a local check to see if the game is running offline on victory
      If Online, execute apiFetch as intended
      If Offline, execute offlineNewClear(), a localStorage implementation of newClear daily run checks */
    if (this.victory) {
      if (!Utils.isLocal) {
        Utils.apiFetch(`savedata/session/newclear?slot=${globalScene.sessionSlotId}&clientSessionId=${clientSessionId}`, true)
          .then(response => response.json())
          .then(newClear => doGameOver(newClear));
      } else {
        globalScene.gameData.offlineNewClear().then(result => {
          doGameOver(result);
        });
      }
    } else {
      doGameOver(false);
    }
  }

  handleUnlocks(): void {
    if (this.victory && globalScene.gameMode.isClassic) {
      if (!globalScene.gameData.unlocks[Unlockables.ENDLESS_MODE]) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.ENDLESS_MODE));
      }
      if (globalScene.getParty().filter(p => p.fusionSpecies).length && !globalScene.gameData.unlocks[Unlockables.SPLICED_ENDLESS_MODE]) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.SPLICED_ENDLESS_MODE));
      }
      if (!globalScene.gameData.unlocks[Unlockables.MINI_BLACK_HOLE]) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.MINI_BLACK_HOLE));
      }
      if (!globalScene.gameData.unlocks[Unlockables.EVIOLITE] && globalScene.getParty().some(p => p.getSpeciesForm(true).speciesId in pokemonEvolutions)) {
        globalScene.unshiftPhase(new UnlockPhase(Unlockables.EVIOLITE));
      }
    }
  }

  awardRibbon(pokemon: Pokemon, forStarter: boolean = false): void {
    const speciesId = getPokemonSpecies(pokemon.species.speciesId);
    const speciesRibbonCount = globalScene.gameData.incrementRibbonCount(speciesId, forStarter);
    // first time classic win, award voucher
    if (speciesRibbonCount === 1) {
      this.firstRibbons.push(getPokemonSpecies(pokemon.species.getRootSpeciesId(forStarter)));
    }
  }
}

