import type { SessionSaveData } from "#app/@types/SessionData";
import { loggedInUser } from "#app/account";
import { BattleType } from "#enums/battle-type";
import { fetchDailyRunSeed, getDailyRunStarters } from "#app/data/daily-run";
import { getBiomeKey } from "#app/field/arena";
import { GameMode, getGameMode } from "#app/game-mode";
import { GameModes } from "#enums/game-modes";
import { globalScene } from "#app/global-scene";
import type { Modifier } from "#app/modifier/modifier";
import { getDailyRunStarterModifiers, regenerateModifierPoolThresholds } from "#app/modifier/modifier-type";
import { modifierTypes } from "#app/modifier/modifier-types";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import { Phase } from "#app/phase";
import { Unlockables } from "#enums/unlockables";
import { vouchers } from "#app/system/voucher";
import type { OptionSelectModeConfig, OptionSelectItem } from "#app/ui/interfaces/option-select-config";
import { SaveSlotUiMode } from "#enums/save-slot-ui-mode";
import { UiMode } from "#enums/ui-mode";
import { Gender } from "#enums/gender";
import i18next from "i18next";
import { CheckSwitchPhase } from "./check-switch-phase";
import { EncounterPhase } from "./encounter-phase";
import { SelectChallengePhase } from "./select-challenge-phase";
import { SelectStarterPhase } from "./select-starter-phase";
import { SummonPhase } from "./summon-phase";
import { api } from "#app/plugins/api/api";
import { PhaseId } from "#enums/phase-id";

export class TitlePhase extends Phase {
  override readonly id = PhaseId.TITLE;
  public gameMode: GameModes;

  private loaded: boolean = false;
  private lastSessionData: SessionSaveData;

  public override start(): void {
    super.start();
    const { arenaBg, gameData, ui } = globalScene;

    ui.clearText();
    ui.fadeIn(250);

    globalScene.playBgm("title", true);

    gameData
      .getSession(loggedInUser?.lastSessionSlot ?? -1)
      .then((sessionData) => {
        if (sessionData) {
          this.lastSessionData = sessionData;
          const biomeKey = getBiomeKey(sessionData.arena.biome);
          const bgTexture = `${biomeKey}_bg`;
          arenaBg.setTexture(bgTexture);
        }
        this.showOptions();
      })
      .catch((err) => {
        console.error(err);
        this.showOptions();
      });
  }

  protected showOptions(): void {
    const { gameData, ui } = globalScene;
    const options: OptionSelectItem[] = [];

    if (loggedInUser && loggedInUser.lastSessionSlot > -1) {
      options.push({
        label: i18next.t("continue", { ns: "menu" }),
        handler: () => {
          this.loadSaveSlot(this.lastSessionData || !loggedInUser ? -1 : loggedInUser.lastSessionSlot);
          return true;
        },
      });
    }

    options.push(
      {
        label: i18next.t("menu:newGame"),
        handler: () => {
          const setModeAndEnd = (gameMode: GameModes): void => {
            this.gameMode = gameMode;
            ui.setMode(UiMode.MESSAGE);
            ui.clearText();
            this.end();
          };

          if (gameData.isUnlocked(Unlockables.ENDLESS_MODE)) {
            const options: OptionSelectItem[] = [
              {
                label: GameMode.getModeName(GameModes.CLASSIC),
                handler: () => {
                  setModeAndEnd(GameModes.CLASSIC);
                  return true;
                },
              },
              {
                label: GameMode.getModeName(GameModes.CHALLENGE),
                handler: () => {
                  setModeAndEnd(GameModes.CHALLENGE);
                  return true;
                },
              },
              {
                label: GameMode.getModeName(GameModes.ENDLESS),
                handler: () => {
                  setModeAndEnd(GameModes.ENDLESS);
                  return true;
                },
              },
            ];

            options.push({
              label: i18next.t("menu:cancel"),
              handler: () => {
                globalScene.toTitleScreen({ clearPhaseQueue: true });
                super.end();
                return true;
              },
            });

            ui.showText(i18next.t("menu:selectGameMode"), null, () =>
              ui.setOverlayMode(UiMode.OPTION_SELECT, {
                options: options,
                yOffset: 48,
              }),
            );
          } else {
            this.gameMode = GameModes.CLASSIC;
            ui.setMode(UiMode.MESSAGE);
            ui.clearText();
            this.end();
          }
          return true;
        },
      },
      {
        label: i18next.t("menu:loadGame"),
        handler: () => {
          ui.setOverlayMode(UiMode.SAVE_SLOT, SaveSlotUiMode.LOAD, (slotId: number) => {
            if (slotId === -1) {
              return this.showOptions();
            }
            this.loadSaveSlot(slotId);
          });
          return true;
        },
      },
      {
        label: i18next.t("menu:dailyRun"),
        handler: () => {
          this.initDailyRun();
          return true;
        },
        keepOpen: true,
      },
      {
        label: i18next.t("menu:settings"),
        handler: () => {
          ui.setOverlayMode(UiMode.SETTINGS);
          return true;
        },
        keepOpen: true,
      },
    );
    const config: OptionSelectModeConfig = {
      options: options,
      blockCancelButton: true,
    };
    globalScene.ui.setMode(UiMode.TITLE, config);
  }

  public loadSaveSlot(slotId: number): void {
    const { gameData, ui } = globalScene;

    globalScene.sessionSlotId = slotId > -1 || !loggedInUser ? slotId : loggedInUser.lastSessionSlot;
    ui.setMode(UiMode.MESSAGE);
    ui.resetModeChain();

    gameData
      .loadSession(slotId, slotId === -1 ? this.lastSessionData : undefined)
      .then((success: boolean) => {
        if (success) {
          this.loaded = true;
          ui.showText(i18next.t("menu:sessionSuccess"), null, () => this.end());
        } else {
          this.end();
        }
      })
      .catch((err) => {
        console.error(err);
        ui.showText(i18next.t("menu:failedToLoadSession"), null);
      });
  }

  public initDailyRun(): void {
    const { gameData, time, ui } = globalScene;

    ui.setMode(UiMode.SAVE_SLOT, SaveSlotUiMode.SAVE, (slotId: number) => {
      globalScene.clearPhaseQueue();
      if (slotId === -1) {
        globalScene.toTitleScreen();
        return super.end();
      }
      globalScene.sessionSlotId = slotId;

      const generateDaily = (seed: string): void => {
        const gameMode = getGameMode(GameModes.DAILY);
        globalScene.gameMode = gameMode;

        globalScene.setSeed(seed);
        globalScene.resetSeed(0);

        globalScene.money = gameMode.getStartingMoney();

        const starters = getDailyRunStarters(seed);
        const startingLevel = gameMode.getStartingLevel();
        const party = globalScene.getPlayerParty();
        const loadPokemonAssets: Promise<void>[] = [];

        for (const starter of starters) {
          const starterProps = gameData.getSpeciesDexAttrProps(starter.species, starter.dexAttr);
          const starterFormIndex = Math.min(starterProps.formIndex, Math.max(starter.species.forms.length - 1, 0));
          const starterGender =
            starter.species.malePercent !== null
              ? !starterProps.female
                ? Gender.MALE
                : Gender.FEMALE
              : Gender.GENDERLESS;
          const starterPokemon = globalScene.addPlayerPokemon(
            starter.species,
            startingLevel,
            starter.abilityIndex,
            starterFormIndex,
            starterGender,
            starterProps.shiny,
            starterProps.variant,
            undefined,
            starter.nature,
          );
          starterPokemon.setVisible(false);
          party.push(starterPokemon);
          loadPokemonAssets.push(starterPokemon.loadAssets());
        }

        regenerateModifierPoolThresholds(party, ModifierPoolType.DAILY_STARTER);

        const modifiers: Modifier[] = Array(3)
          .fill(null)
          .map(() => modifierTypes.EXP_SHARE().withIdFromFunc(modifierTypes.EXP_SHARE).newModifier())
          .concat(
            Array(3)
              .fill(null)
              .map(() => modifierTypes.GOLDEN_EXP_CHARM().withIdFromFunc(modifierTypes.GOLDEN_EXP_CHARM).newModifier()),
          )
          .concat([modifierTypes.MAP().withIdFromFunc(modifierTypes.MAP).newModifier()])
          .concat(getDailyRunStarterModifiers(party))
          .filter((m) => m !== null);

        for (const m of modifiers) {
          globalScene.addModifier(m, true, false, false, true);
        }
        globalScene.updateModifiers(true, true);

        Promise.all(loadPokemonAssets).then(() => {
          time.delayedCall(500, () => globalScene.playBgm());
          gameData.gameStats.dailyRunSessionsPlayed++;
          const arena = globalScene.newArena(gameMode.getStartingBiome());
          globalScene.newBattle();
          arena.init();
          globalScene.sessionPlayTime = 0;
          globalScene.lastSavePlayTime = 0;
          this.end();
        });
      };

      // If Online, calls seed fetch from db to generate daily run. If Offline, generates a daily run based on current date.
      if (!api.isLocal || api.isConnected) {
        fetchDailyRunSeed()
          .then((seed) => {
            if (seed) {
              generateDaily(seed);
            } else {
              throw new Error("Daily run seed is null!");
            }
          })
          .catch((err) => {
            console.error("Failed to load daily run:\n", err);
          });
      } else {
        generateDaily(btoa(new Date().toISOString().substring(0, 10)));
      }
    });
  }

  public override end(): void {
    const { arena, currentBattle, gameData } = globalScene;

    if (!this.loaded && !globalScene.gameMode.isDaily) {
      arena.preloadBgm();
      globalScene.gameMode = getGameMode(this.gameMode);
      if (this.gameMode === GameModes.CHALLENGE) {
        globalScene.pushPhase(new SelectChallengePhase());
      } else {
        globalScene.pushPhase(new SelectStarterPhase());
      }
      globalScene.newArena(globalScene.gameMode.getStartingBiome());
    } else {
      globalScene.playBgm();
    }

    globalScene.pushPhase(new EncounterPhase(this.loaded));

    if (this.loaded) {
      const { battleType, double, waveIndex } = currentBattle;
      const availablePartyMembers = globalScene.getPokemonAllowedInBattle().length;

      globalScene.pushPhase(new SummonPhase(0, true, true));
      if (double && availablePartyMembers > 1) {
        globalScene.pushPhase(new SummonPhase(1, true, true));
      }

      if (battleType !== BattleType.TRAINER && (waveIndex > 1 || !globalScene.gameMode.isDaily)) {
        const minPartySize = double ? 2 : 1;
        if (availablePartyMembers > minPartySize) {
          globalScene.pushPhase(new CheckSwitchPhase(0, double));
          if (double) {
            globalScene.pushPhase(new CheckSwitchPhase(1, double));
          }
        }
      }
    }

    for (const achv of Object.keys(gameData.achvUnlocks)) {
      if (vouchers.hasOwnProperty(achv) && achv !== "CLASSIC_VICTORY") {
        globalScene.validateVoucher(vouchers[achv]);
      }
    }

    super.end();
  }
}
