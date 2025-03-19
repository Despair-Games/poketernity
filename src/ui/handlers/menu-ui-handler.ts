import { loggedInUser, updateUserInfo } from "#app/account";
import { bypassLogin, SESSION_ID_COOKIE } from "#app/constants";
import { globalScene } from "#app/global-scene";
import { type SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { api } from "#app/plugins/api/api";
import { handleTutorial } from "#app/tutorial";
import { GAME_HEIGHT, GAME_WIDTH } from "#app/ui-constants";
import { BgmBar } from "#app/ui/components/bgm-bar";
import type { ConfirmModeConfig } from "#app/ui/interfaces/confirm-menu-config";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { addTextObject } from "#app/ui/text/text-utils";
import { addWindow } from "#app/ui/ui-theme";
import { fixedNumber, getCookie, getEnumKeys, isBeta } from "#app/utils";
import { AdminMode } from "#enums/admin-mode";
import { Button } from "#enums/buttons";
import { GameDataType } from "#enums/game-data-type";
import { PhaseId } from "#enums/phase-id";
import { TextStyle } from "#enums/text-style";
import { Tutorial } from "#enums/tutorial";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";
import type { AdminUiHandler } from "./admin-ui-handler";
import { getAdminModeName } from "./admin-ui-handler";
import type { AwaitableUiHandler } from "./awaitable-ui-handler";
import { OptionSelectUiHandler } from "./option-select-ui-handler";

enum MenuOptions {
  GAME_SETTINGS,
  ACHIEVEMENTS,
  STATS,
  RUN_HISTORY,
  EGG_LIST,
  EGG_GACHA,
  MANAGE_DATA,
  COMMUNITY,
  SAVE_AND_QUIT,
  LOG_OUT,
}

const { VITE_WIKI_URL, VITE_DISCORD_URL, VITE_GITHUB_URL, VITE_REDDIT_URL, VITE_DONATE_URL } = import.meta.env;

export class MenuUiHandler extends OptionSelectUiHandler {
  private readonly textPadding = 8;

  private menuContainer: Phaser.GameObjects.Container;
  private menuMessageBoxContainer: Phaser.GameObjects.Container;
  private menuMessageBox: Phaser.GameObjects.NineSlice;
  private menuOverlay: Phaser.GameObjects.Rectangle;

  private excludedMenus: () => ConditionalMenu[];

  protected manageDataConfig: OptionSelectModeConfig;
  protected communityConfig: OptionSelectModeConfig;

  public bgmBar: BgmBar;

  constructor(mode: UiMode = UiMode.MENU) {
    super(mode);

    this.excludedMenus = () => [
      {
        excluded: globalScene.getCurrentPhase()?.is<SelectModifierPhase>(PhaseId.SELECT_MODIFIER) ?? false,
        options: [MenuOptions.EGG_GACHA, MenuOptions.EGG_LIST],
      },
      { excluded: bypassLogin, options: [MenuOptions.LOG_OUT] },
      { excluded: !globalScene.currentBattle, options: [MenuOptions.SAVE_AND_QUIT] },
    ];
  }

  override setup(): void {
    super.setup();

    const ui = this.getUi();

    this.bgmBar = new BgmBar();
    this.bgmBar.setup();

    ui.bgmBar = this.bgmBar;

    // Background overlay that sits below everything in the menu
    this.menuOverlay = new Phaser.GameObjects.Rectangle(
      globalScene,
      -GAME_WIDTH - 1,
      -GAME_HEIGHT - 1,
      GAME_WIDTH + 2,
      GAME_HEIGHT + 2,
      0xffffff,
      0.3,
    );
    this.menuOverlay.setName("menu-overlay");
    this.menuOverlay.setOrigin(0, 0);
    this.optionSelectContainer.addAt(this.menuOverlay, 0);

    this.menuContainer = globalScene.add.container(2 - GAME_WIDTH, 2 - GAME_HEIGHT);
    this.menuContainer.setName("menu");
    this.menuContainer.add(this.bgmBar);

    this.menuMessageBoxContainer = globalScene.add.container(0, 130);
    this.menuMessageBoxContainer.setName("menu-message-box");
    this.menuMessageBoxContainer.setVisible(false);

    this.menuMessageBox = addWindow(0, 0, GAME_WIDTH, 48);
    this.menuMessageBox.setOrigin(0, 0);
    this.menuMessageBoxContainer.add(this.menuMessageBox);

    this.message = addTextObject(this.textPadding, this.textPadding, "", TextStyle.WINDOW, { maxLines: 2 });
    this.message.setName("menu-message");
    this.message.setOrigin(0, 0);
    this.menuMessageBoxContainer.add(this.message);

    this.initTutorialOverlay(this.menuContainer);
    this.initPromptSprite(this.menuMessageBoxContainer);
    this.menuContainer.add(this.menuMessageBoxContainer);

    this.optionSelectContainer.add(this.menuContainer);

    this.initManageDataOptions();
    this.initCommunityMenuOptions();
  }

  override show(): boolean {
    const config = this.getMenuOptionsConfig();

    super.show(config);

    // Make sure the tutorial overlay sits above everything, but below the message box
    this.menuContainer.bringToTop(this.tutorialOverlay);
    this.menuContainer.bringToTop(this.menuMessageBoxContainer);

    this.getUi().hideTooltip();

    globalScene.audioManager.playSound("ui/menu_open");

    this.cursorObj?.setVisible(false);
    handleTutorial(Tutorial.MENU).then(() => {
      this.cursorObj?.setVisible(true);
      this.bgmBar.toggleBgmBar(true);
    });

    return true;
  }

  getMenuOptionsConfig(): OptionSelectModeConfig {
    const validOptions = getEnumKeys(MenuOptions)
      .map((m) => parseInt(MenuOptions[m]) as MenuOptions)
      .filter((m) => {
        return !this.excludedMenus().some((option) => option.excluded && option.options.includes(m));
      });

    const menuOptions: OptionSelectItem[] = validOptions.map((option: MenuOptions) => {
      return {
        label: `${i18next.t(`menuUiHandler:${MenuOptions[option]}`)}`,
        handler: () => this.optionSelected(option),
        keepOpen: true,
      };
    });

    return {
      options: menuOptions,
      maxOptions: 10,
      blockCancelButton: true, // we take care of closing the menu in this handler
      yOffset: 1,
      onResize: (w: number, _h: number) => {
        // Init the community and manage data menus config once the menu has its proper size
        this.initCommunityMenuOptions();
        this.initManageDataOptions();
        // Resize the message box so that it does not go over the menu
        this.menuMessageBox.setSize(GAME_WIDTH - w - 2, 48);
        this.message.setWordWrapWidth((GAME_WIDTH - w - 10) / this.message.scale);
      },
    };
  }

  override computeWindowHeight(): number {
    return GAME_HEIGHT - 2; // always fill the screen
  }

  private initManageDataOptions(): void {
    const ui = this.getUi();

    const manageDataOptions: OptionSelectItem[] = [];

    const confirmSlot = (message: string, slotFilter: (i: number) => boolean, callback: (i: number) => void) => {
      ui.revertMode();
      ui.showText(message, null, () => {
        const config: OptionSelectModeConfig = {
          options: new Array(5)
            .fill(null)
            .map((_, i) => i)
            .filter(slotFilter)
            .map((i) => {
              return {
                label: i18next.t("menuUiHandler:slot", { slotNumber: i + 1 }),
                handler: () => {
                  callback(i);
                  ui.revertMode();
                  ui.showText("", 0);
                  return true;
                },
              };
            })
            .concat([
              {
                label: i18next.t("menuUiHandler:cancel"),
                handler: () => {
                  ui.revertMode();
                  ui.showText("", 0);
                  return true;
                },
              },
            ]),
          xOffset: this.optionSelectBg.displayWidth,
          yOffset: this.menuMessageBox.displayHeight + 1,
        };
        ui.setOverlayMode(UiMode.MENU_OPTION_SELECT, config);
      });
    };
    // Import Session
    if (api.isLocal || isBeta) {
      manageDataOptions.push({
        label: i18next.t("menuUiHandler:importSession"),
        handler: () => {
          confirmSlot(
            i18next.t("menuUiHandler:importSlotSelect"),
            () => true,
            (slotId) => globalScene.gameData.importData(GameDataType.SESSION, slotId, this.optionSelectBg.displayWidth),
          );
          return true;
        },
        keepOpen: true,
      });
    }
    // Export Session
    manageDataOptions.push({
      label: i18next.t("menuUiHandler:exportSession"),
      handler: () => {
        const dataSlots: number[] = [];
        Promise.all(
          new Array(5).fill(null).map((_, i) => {
            const slotId = i;
            return globalScene.gameData.getSession(slotId).then((data) => {
              if (data) {
                dataSlots.push(slotId);
              }
            });
          }),
        ).then(() => {
          confirmSlot(
            i18next.t("menuUiHandler:exportSlotSelect"),
            (i) => dataSlots.indexOf(i) > -1,
            (slotId) => globalScene.gameData.tryExportData(GameDataType.SESSION, slotId),
          );
        });
        return true;
      },
      keepOpen: true,
    });
    // Import Run History
    manageDataOptions.push({
      label: i18next.t("menuUiHandler:importRunHistory"),
      handler: () => {
        globalScene.gameData.importData(GameDataType.RUN_HISTORY);
        return true;
      },
      keepOpen: true,
    });
    // Export Run History
    manageDataOptions.push({
      label: i18next.t("menuUiHandler:exportRunHistory"),
      handler: () => {
        globalScene.gameData.tryExportData(GameDataType.RUN_HISTORY);
        return true;
      },
      keepOpen: true,
    });
    // Import Data
    if (api.isLocal || isBeta) {
      manageDataOptions.push({
        label: i18next.t("menuUiHandler:importData"),
        handler: () => {
          ui.revertMode();
          globalScene.gameData.importData(GameDataType.SYSTEM);
          return true;
        },
        keepOpen: true,
      });
    }
    // Export Data
    manageDataOptions.push(
      {
        label: i18next.t("menuUiHandler:exportData"),
        handler: () => {
          globalScene.gameData.tryExportData(GameDataType.SYSTEM);
          return true;
        },
        keepOpen: true,
      },
      {
        label: i18next.t("menuUiHandler:consentPreferences"),
        handler: () => {
          const consentLink = document.querySelector(".termly-display-preferences") as HTMLInputElement;
          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          consentLink.dispatchEvent(clickEvent);
          consentLink.focus();
          return true;
        },
        keepOpen: true,
      },
    );

    // TODO: fully remove test dialogue option and related handlers
    if (api.isLocal || isBeta) {
      // this should make sure we don't have this option in live
      manageDataOptions.push({
        label: "Test Dialogue",
        handler: () => {
          ui.playSelect();
          const prefilledText = "";
          const buttonAction: any = {};
          buttonAction["buttonActions"] = [
            (sanitizedName: string) => {
              ui.revertMode();
              ui.playSelect();
              const dialogueTestName = sanitizedName;
              const dialogueName = decodeURIComponent(escape(atob(dialogueTestName)));
              const handler = ui.getHandler() as AwaitableUiHandler;
              handler.tutorialActive = true;
              const interpolatorOptions: any = {};
              const splitArr = dialogueName.split(" "); // this splits our inputted text into words to cycle through later
              const translatedString = splitArr[0]; // this is our outputted i18 string
              const regex = RegExp("\\{\\{(\\w*)\\}\\}", "g"); // this is a regex expression to find all the text between {{ }} in the i18 output
              const matches = i18next.t(translatedString).match(regex) ?? [];
              if (matches.length > 0) {
                for (let match = 0; match < matches.length; match++) {
                  // we add 1 here  because splitArr[0] is our first value for the translatedString, and after that is where the variables are
                  // the regex here in the replace (/\W/g) is to remove the {{ and }} and just give us all alphanumeric characters
                  if (typeof splitArr[match + 1] !== "undefined") {
                    interpolatorOptions[matches[match].replace(/\W/g, "")] = i18next.t(splitArr[match + 1]);
                  }
                }
              }
              // Switch to the dialog test window
              ui.showText(
                String(i18next.t(translatedString, interpolatorOptions)),
                null,
                () =>
                  globalScene.ui.showText("", 0, () => {
                    handler.tutorialActive = false;
                  }),
                null,
                true,
              );
            },
            () => {
              ui.revertMode();
            },
          ];
          ui.setMode(UiMode.TEST_DIALOGUE, buttonAction, prefilledText);
          return true;
        },
        keepOpen: true,
      });
    }

    // Cancel option
    manageDataOptions.push({
      label: i18next.t("menuUiHandler:cancel"),
      handler: () => {
        globalScene.ui.revertMode();
        return true;
      },
      keepOpen: true,
    });

    this.manageDataConfig = {
      xOffset: this.optionSelectBg.displayWidth,
      yOffset: this.menuMessageBox.displayHeight + 1,
      options: manageDataOptions,
      maxOptions: 7,
    };
  }

  private initCommunityMenuOptions(): void {
    const ui = this.getUi();

    const communityOptions: OptionSelectItem[] = [];

    if (VITE_WIKI_URL && VITE_WIKI_URL.startsWith("https://")) {
      communityOptions.push({
        label: "Wiki",
        handler: () => {
          window.open(VITE_WIKI_URL, "_blank")?.focus();
          return true;
        },
        keepOpen: true,
      });
    }

    if (VITE_DISCORD_URL && VITE_DISCORD_URL.startsWith("https://")) {
      communityOptions.push({
        label: "Discord",
        handler: () => {
          window.open(VITE_DISCORD_URL, "_blank")?.focus();
          return true;
        },
        keepOpen: true,
      });
    }

    if (VITE_GITHUB_URL && VITE_GITHUB_URL.startsWith("https://")) {
      communityOptions.push({
        label: "GitHub",
        handler: () => {
          window.open(VITE_GITHUB_URL, "_blank")?.focus();
          return true;
        },
        keepOpen: true,
      });
    }

    if (VITE_REDDIT_URL && VITE_REDDIT_URL.startsWith("https://")) {
      communityOptions.push({
        label: "Reddit",
        handler: () => {
          window.open(VITE_REDDIT_URL, "_blank")?.focus();
          return true;
        },
        keepOpen: true,
      });
    }

    if (VITE_DONATE_URL && VITE_DONATE_URL.startsWith("https://")) {
      communityOptions.push({
        label: i18next.t("menuUiHandler:donate"),
        handler: () => {
          window.open(VITE_DONATE_URL, "_blank")?.focus();
          return true;
        },
        keepOpen: true,
      });
    }

    if (!bypassLogin && loggedInUser?.hasAdminRole) {
      communityOptions.push({
        label: "Admin",
        handler: () => {
          const skippedAdminModes: AdminMode[] = [AdminMode.ADMIN]; // this is here so that we can skip the menu populating enums that aren't meant for the menu, such as the AdminMode.ADMIN
          const options: OptionSelectItem[] = [];
          Object.values(AdminMode)
            .filter((v) => !isNaN(Number(v)) && !skippedAdminModes.includes(v as AdminMode))
            .forEach((mode) => {
              // this gets all the enums in a way we can use
              options.push({
                label: getAdminModeName(mode as AdminMode),
                handler: () => {
                  ui.playSelect();
                  ui.setOverlayMode<AdminUiHandler>(
                    UiMode.ADMIN,
                    {
                      buttonActions: [
                        // we double revert here and below to go back 2 layers of menus
                        () => {
                          ui.revertMode();
                          ui.revertMode();
                        },
                        () => {
                          ui.revertMode();
                          ui.revertMode();
                        },
                      ],
                    },
                    mode as AdminMode,
                  ); // mode is our AdminMode enum
                  return true;
                },
              });
            });
          options.push({
            label: "Cancel",
            handler: () => {
              ui.revertMode();
              return true;
            },
          });
          globalScene.ui.setOverlayMode(UiMode.OPTION_SELECT, {
            options: options,
            yOffset: this.menuMessageBox.displayHeight + 1,
          });
          return true;
        },
        keepOpen: true,
      });
    }
    communityOptions.push({
      label: i18next.t("menuUiHandler:cancel"),
      handler: () => {
        globalScene.ui.revertMode();
        return true;
      },
    });

    this.communityConfig = {
      options: communityOptions,
      xOffset: this.optionSelectBg.displayWidth,
      yOffset: this.menuMessageBox.displayHeight + 1,
    };
  }

  optionSelected(option: MenuOptions): boolean {
    let success = false;
    const ui = this.getUi();
    switch (option) {
      case MenuOptions.GAME_SETTINGS:
        ui.setOverlayMode(UiMode.SETTINGS);
        success = true;
        break;
      case MenuOptions.ACHIEVEMENTS:
        ui.setOverlayMode(UiMode.ACHIEVEMENTS);
        success = true;
        break;
      case MenuOptions.STATS:
        ui.setOverlayMode(UiMode.GAME_STATS);
        success = true;
        break;
      case MenuOptions.RUN_HISTORY:
        ui.setOverlayMode(UiMode.RUN_HISTORY);
        success = true;
        break;
      case MenuOptions.EGG_LIST:
        if (globalScene.gameData.eggs.length) {
          ui.revertMode();
          ui.setOverlayMode(UiMode.EGG_LIST);
          success = true;
        } else {
          ui.showText(i18next.t("menuUiHandler:noEggs"), null, () => ui.showText(""), fixedNumber(1500));
        }
        break;
      case MenuOptions.EGG_GACHA:
        ui.revertMode();
        ui.setOverlayMode(UiMode.EGG_GACHA);
        success = true;
        break;
      case MenuOptions.MANAGE_DATA:
        if (
          !bypassLogin
          && !this.manageDataConfig.options.some(
            (o) =>
              o.label === i18next.t("menuUiHandler:linkDiscord")
              || o.label === i18next.t("menuUiHandler:unlinkDiscord"),
          )
        ) {
          this.manageDataConfig.options.splice(
            this.manageDataConfig.options.length - 1,
            0,
            {
              label:
                loggedInUser?.discordId === ""
                  ? i18next.t("menuUiHandler:linkDiscord")
                  : i18next.t("menuUiHandler:unlinkDiscord"),
              handler: () => {
                if (loggedInUser?.discordId === "") {
                  const token = getCookie(SESSION_ID_COOKIE);
                  const redirectUri = encodeURIComponent(`${import.meta.env.VITE_SERVER_URL}/auth/discord/callback`);
                  const discordId = import.meta.env.VITE_DISCORD_CLIENT_ID;
                  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=${token}&prompt=none`;
                  window.open(discordUrl, "_self");
                  return true;
                } else {
                  api.unlinkDiscord().then((_isSuccess) => {
                    updateUserInfo().then(() => globalScene.reset(true, true));
                  });
                  return true;
                }
              },
            },
            {
              label:
                loggedInUser?.googleId === ""
                  ? i18next.t("menuUiHandler:linkGoogle")
                  : i18next.t("menuUiHandler:unlinkGoogle"),
              handler: () => {
                if (loggedInUser?.googleId === "") {
                  const token = getCookie(SESSION_ID_COOKIE);
                  const redirectUri = encodeURIComponent(`${import.meta.env.VITE_SERVER_URL}/auth/google/callback`);
                  const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                  const googleUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}&response_type=code&redirect_uri=${redirectUri}&scope=openid&state=${token}`;
                  window.open(googleUrl, "_self");
                  return true;
                } else {
                  api.unlinkGoogle().then((_isSuccess) => {
                    updateUserInfo().then(() => globalScene.reset(true, true));
                  });
                  return true;
                }
              },
            },
          );
        }
        ui.setOverlayMode(UiMode.MENU_OPTION_SELECT, this.manageDataConfig);
        success = true;
        break;
      case MenuOptions.COMMUNITY:
        ui.setOverlayMode(UiMode.MENU_OPTION_SELECT, this.communityConfig);
        success = true;
        break;
      case MenuOptions.SAVE_AND_QUIT:
        if (globalScene.currentBattle) {
          success = true;
          const doSaveQuit = () => {
            ui.setMode(UiMode.LOADING, {
              buttonActions: [],
              fadeOut: () =>
                globalScene.gameData.saveAll(true, true, true, true).then(() => {
                  globalScene.reset(true);
                }),
            });
          };
          if (globalScene.currentBattle.turn > 1) {
            ui.showText(i18next.t("menuUiHandler:losingProgressionWarning"), null, () => {
              if (!this.active) {
                this.showText("", 0);
                return;
              }
              const options: ConfirmModeConfig = {
                yesHandler: doSaveQuit,
                noHandler: () => {
                  ui.revertMode();
                  this.showText("", 0);
                },
                xOffset: this.optionSelectBg.displayWidth,
              };
              ui.setOverlayMode(UiMode.CONFIRM, options);
            });
          } else {
            doSaveQuit();
          }
        }
        break;
      case MenuOptions.LOG_OUT:
        success = true;
        const doLogout = () => {
          ui.setMode(UiMode.LOADING, {
            buttonActions: [],
            fadeOut: () =>
              api.account.logout().then(() => {
                updateUserInfo().then(() => globalScene.reset(true, true));
              }),
          });
        };
        if (globalScene.currentBattle) {
          ui.showText(i18next.t("menuUiHandler:losingProgressionWarning"), null, () => {
            if (!this.active) {
              this.showText("", 0);
              return;
            }
            const options: ConfirmModeConfig = {
              yesHandler: doLogout,
              noHandler: () => {
                ui.revertMode();
                this.showText("", 0);
              },
              xOffset: this.optionSelectBg.displayWidth,
            };
            ui.setOverlayMode(UiMode.CONFIRM, options);
          });
        } else {
          doLogout();
        }
        break;
    }
    return success;
  }

  override processInput(button: Button): boolean {
    const ui = this.getUi();
    if (button === Button.CANCEL) {
      ui.playSelect();
      ui.revertMode().then((result) => {
        if (!result) {
          ui.setMode(UiMode.MESSAGE);
        }
      });
      return true;
    } else {
      return super.processInput(button);
    }
  }

  override showText(
    text: string,
    delay?: number,
    callback?: Function,
    callbackDelay?: number,
    prompt?: boolean,
    promptDelay?: number,
  ): void {
    this.menuMessageBoxContainer.setVisible(!!text);

    super.showText(text, delay, callback, callbackDelay, prompt, promptDelay);
  }

  override clear() {
    super.clear();
    this.bgmBar.toggleBgmBar(false);
  }
}

interface ConditionalMenu {
  excluded: boolean;
  options: MenuOptions[];
}
