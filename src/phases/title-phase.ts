import { api } from "#api/api";
import { loggedInUser } from "#app/account";
import { GameMode, getGameMode } from "#app/game-mode";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { fetchDailyRunSeed, getDailyRunStarters } from "#data/daily-run";
import { BattleType } from "#enums/battle-type";
import { GameModes } from "#enums/game-modes";
import { ModifierPoolType } from "#enums/modifier-pool-type";
import { SaveSlotUiMode } from "#enums/save-slot-ui-mode";
import { UiMode } from "#enums/ui-mode";
import { Unlockables } from "#enums/unlockables";
import { getBiomeKey } from "#field/arena";
import type { Modifier } from "#modifier/modifier";
import { getDailyRunStarterModifiers, regenerateModifierPoolThresholds } from "#modifier/modifier-type";
import { modifierTypes } from "#modifier/modifier-types";
import { vouchers } from "#system/voucher";
import type { SessionSaveData } from "#types/session-data";
import type { GeneralSettingsUiHandler } from "#ui/general-settings-ui-handler";
import type { OptionSelectItem, OptionSelectModeConfig } from "#ui/option-select-config";
import type { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import type { SaveSlotSelectUiHandler } from "#ui/save-slot-select-ui-handler";
import type { TitleUiHandler } from "#ui/title-ui-handler";
import i18next from "i18next";

export class TitlePhase extends Phase {
  public override readonly phaseName = "TitlePhase";

  public gameMode: GameModes;

  private loaded: boolean = false;
  private lastSessionData: SessionSaveData;

  public override start(): void {
    super.start();
    const { arenaBg, gameData, ui } = globalScene;

    ui.clearText();
    ui.fadeIn(250);

    globalScene.audioManager.playBgm("title", true);

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
            ui.setMessageMode();
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
                globalScene.phaseManager.toTitleScreen({ clearPhaseQueue: true });
                super.end();
                return true;
              },
            });

            ui.showText(i18next.t("menu:selectGameMode"), {
              callback: () =>
                ui.setOverlayMode<OptionSelectUiHandler>(UiMode.OPTION_SELECT, {
                  options: options,
                  yOffset: 48,
                }),
            });
          } else {
            this.gameMode = GameModes.CLASSIC;
            ui.setMessageMode();
            ui.clearText();
            this.end();
          }
          return true;
        },
      },
      {
        label: i18next.t("menu:loadGame"),
        handler: () => {
          ui.setOverlayMode<SaveSlotSelectUiHandler>(UiMode.SAVE_SLOT, SaveSlotUiMode.LOAD, (slotId: number) => {
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
          ui.setOverlayMode<GeneralSettingsUiHandler>(UiMode.SETTINGS);
          return true;
        },
        keepOpen: true,
      },
    );
    const config: OptionSelectModeConfig = {
      options: options,
      blockCancelButton: true,
    };
    globalScene.ui.setMode<TitleUiHandler>(UiMode.TITLE, config);
  }

  public loadSaveSlot(slotId: number): void {
    const { gameData, ui } = globalScene;

    globalScene.sessionSlotId = slotId > -1 || !loggedInUser ? slotId : loggedInUser.lastSessionSlot;
    ui.resetHandlers();

    gameData
      .loadSession(slotId, slotId === -1 ? this.lastSessionData : undefined)
      .then((success: boolean) => {
        if (success) {
          this.loaded = true;
          ui.showText(i18next.t("menu:sessionSuccess"), { callback: () => this.end() });
        } else {
          this.end();
        }
      })
      .catch((err) => {
        console.error(err);
        ui.showText(i18next.t("menu:failedToLoadSession"));
      });
  }

  public initDailyRun(): void {
    const { gameData, time, ui } = globalScene;

    ui.setMode<SaveSlotSelectUiHandler>(UiMode.SAVE_SLOT, SaveSlotUiMode.SAVE, (slotId: number) => {
      globalScene.phaseManager.clearPhaseQueue();
      if (slotId === -1) {
        globalScene.phaseManager.toTitleScreen();
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
          const starterPokemon = globalScene.addPlayerPokemon(
            starter.species,
            startingLevel,
            starter.abilityIndex,
            starterFormIndex,
            starterProps.gender,
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
          time.delayedCall(500, () => globalScene.audioManager.playBgm());
          gameData.gameStats.dailyRunSessionsPlayed++;
          globalScene.newArena(gameMode.getStartingBiome());
          globalScene.newBattle();
          globalScene.arena.init();
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
        globalScene.phaseManager.createAndPushPhase("SelectChallengePhase");
      } else {
        globalScene.phaseManager.createAndPushPhase("SelectStarterPhase");
      }
      globalScene.newArena(globalScene.gameMode.getStartingBiome());
    } else {
      globalScene.audioManager.playBgm();
    }

    globalScene.phaseManager.createAndPushPhase("EncounterPhase", this.loaded);

    if (this.loaded) {
      const { battleType, double, waveIndex } = currentBattle;
      const availablePartyMembers = globalScene.getPokemonAllowedInBattle().length;

      globalScene.phaseManager.createAndPushPhase("SummonPhase", 0, true, true);
      if (double && availablePartyMembers > 1) {
        globalScene.phaseManager.createAndPushPhase("SummonPhase", 1, true, true);
      }

      if (battleType !== BattleType.TRAINER && (waveIndex > 1 || !globalScene.gameMode.isDaily)) {
        const minPartySize = double ? 2 : 1;
        if (availablePartyMembers > minPartySize) {
          globalScene.phaseManager.createAndPushPhase("CheckSwitchPhase", 0, double);
          if (double) {
            globalScene.phaseManager.createAndPushPhase("CheckSwitchPhase", 1, double);
          }
        }
      }
    }

    for (const achv of Object.keys(gameData.achvUnlocks)) {
      if (Object.hasOwn(vouchers, achv) && achv !== "CLASSIC_VICTORY") {
        globalScene.validateVoucher(vouchers[achv]);
      }
    }

    super.end();
  }
}
