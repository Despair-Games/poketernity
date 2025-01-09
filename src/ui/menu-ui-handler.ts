import { bypassLogin } from "#app/battle-scene";
import { SESSION_ID_COOKIE } from "#app/constants";
import { globalScene } from "#app/global-scene";
import { SelectModifierPhase } from "#app/phases/select-modifier-phase";
import { api } from "#app/plugins/api/api";
import BgmBar from "#app/ui/bgm-bar";
import { fixedNumber, getCookie, getEnumKeys, isBeta, isLocal } from "#app/utils";
import { Button } from "#enums/buttons";
import { GameDataType } from "#enums/game-data-type";
import i18next from "i18next";
import { loggedInUser, updateUserInfo } from "#app/account";
import { Tutorial, handleTutorial } from "#app/tutorial";
import type { OptionSelectConfig, OptionSelectItem } from "#app/ui/interfaces/option-select-config";
import { AdminMode, getAdminModeName } from "#app/ui/admin-ui-handler";
import { TextStyle, addTextObject } from "#app/ui/text";
import { Mode } from "#app/ui/ui";
import { addWindow } from "#app/ui/ui-theme";
import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";

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

export default class MenuUiHandler extends OptionSelectUiHandler {
  private readonly textPadding = 8;

  private menuContainer: Phaser.GameObjects.Container;
  private menuMessageBoxContainer: Phaser.GameObjects.Container;
  private menuMessageBox: Phaser.GameObjects.NineSlice;
  private menuOverlay: Phaser.GameObjects.Rectangle;

  private excludedMenus: () => ConditionalMenu[];
  private menuOptions: MenuOptions[];

  protected manageDataConfig: OptionSelectConfig;
  protected communityConfig: OptionSelectConfig;

  public bgmBar: BgmBar;

  constructor(mode: Mode = Mode.MENU) {
    super(mode);

    this.excludedMenus = () => [
      {
        condition: [Mode.COMMAND, Mode.TITLE].includes(mode ?? Mode.TITLE),
        options: [MenuOptions.EGG_GACHA, MenuOptions.EGG_LIST],
      },
      { condition: bypassLogin, options: [MenuOptions.LOG_OUT] },
    ];

    this.menuOptions = getEnumKeys(MenuOptions)
      .map((m) => parseInt(MenuOptions[m]) as MenuOptions)
      .filter((m) => {
        return !this.excludedMenus().some((exclusion) => exclusion.condition && exclusion.options.includes(m));
      });
  }

  override setup(): void {
    const ui = this.getUi();

    this.bgmBar = new BgmBar();
    this.bgmBar.setup();

    ui.bgmBar = this.bgmBar;

    this.menuContainer = globalScene.add.container(1, -(globalScene.game.canvas.height / 6) + 1);
    this.menuContainer.setName("menu");
    this.menuContainer.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, globalScene.game.canvas.width / 6, globalScene.game.canvas.height / 6),
      Phaser.Geom.Rectangle.Contains,
    );

    this.menuOverlay = new Phaser.GameObjects.Rectangle(
      globalScene,
      -1,
      -1,
      globalScene.scaledCanvas.width + 2,
      globalScene.scaledCanvas.height + 2,
      0xffffff,
      0.3,
    );
    this.menuOverlay.setName("menu-overlay");
    this.menuOverlay.setOrigin(0, 0);

    this.menuContainer.add(this.bgmBar);

    this.menuContainer.setVisible(false);

    super.setup();
  }

  render() {
    const ui = this.getUi();
    ui.add(this.menuOverlay);

    this.menuMessageBoxContainer = globalScene.add.container(0, 130);
    this.menuMessageBoxContainer.setName("menu-message-box");
    this.menuMessageBoxContainer.setVisible(false);

    // Window for general messages
    this.menuMessageBox = addWindow(0, 0, globalScene.scaledCanvas.width, 48);
    this.menuMessageBox.setOrigin(0, 0);
    this.menuMessageBoxContainer.add(this.menuMessageBox);

    const menuMessageText = addTextObject(this.textPadding, this.textPadding, "", TextStyle.WINDOW, { maxLines: 2 });
    menuMessageText.setName("menu-message");
    menuMessageText.setOrigin(0, 0);
    menuMessageText.setWordWrapWidth(1224);
    this.menuMessageBoxContainer.add(menuMessageText);

    this.initTutorialOverlay(this.menuContainer);
    this.initPromptSprite(this.menuMessageBoxContainer);

    this.message = menuMessageText;

    this.menuContainer.add(this.menuMessageBoxContainer);
  }

  private initManageDataOptions(): void {
    const ui = this.getUi();

    const manageDataOptions: OptionSelectItem[] = [];

    const confirmSlot = (message: string, slotFilter: (i: number) => boolean, callback: (i: number) => void) => {
      ui.revertMode();
      ui.showText(message, null, () => {
        const config: OptionSelectConfig = {
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
          xOffset: this.getWindowWidth(),
        };
        ui.setOverlayMode(Mode.MENU_OPTION_SELECT, config);
      });
    };

    if (isLocal || isBeta) {
      manageDataOptions.push({
        label: i18next.t("menuUiHandler:importSession"),
        handler: () => {
          confirmSlot(
            i18next.t("menuUiHandler:importSlotSelect"),
            () => true,
            (slotId) => globalScene.gameData.importData(GameDataType.SESSION, slotId),
          );
          return true;
        },
        keepOpen: true,
      });
    }
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
    manageDataOptions.push({
      label: i18next.t("menuUiHandler:importRunHistory"),
      handler: () => {
        globalScene.gameData.importData(GameDataType.RUN_HISTORY);
        return true;
      },
      keepOpen: true,
    });
    manageDataOptions.push({
      label: i18next.t("menuUiHandler:exportRunHistory"),
      handler: () => {
        globalScene.gameData.tryExportData(GameDataType.RUN_HISTORY);
        return true;
      },
      keepOpen: true,
    });
    if (isLocal || isBeta) {
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
    manageDataOptions.push({
      label: i18next.t("menuUiHandler:cancel"),
      handler: () => {
        globalScene.ui.revertMode();
        return true;
      },
      keepOpen: true,
    });
    this.manageDataConfig = {
      xOffset: this.getWindowWidth(),
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
                  ui.setOverlayMode(
                    Mode.ADMIN,
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
                    mode,
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
          globalScene.ui.setOverlayMode(Mode.OPTION_SELECT, {
            options: options,
            delay: 0,
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
      xOffset: this.getWindowWidth(),
      options: communityOptions,
    };
  }

  override show(_args: any[]): boolean {
    this.render();

    this.excludedMenus = () => [
      {
        condition: globalScene.getCurrentPhase() instanceof SelectModifierPhase,
        options: [MenuOptions.EGG_GACHA, MenuOptions.EGG_LIST],
      },
      { condition: bypassLogin, options: [MenuOptions.LOG_OUT] },
    ];

    this.menuOptions = getEnumKeys(MenuOptions)
      .map((m) => parseInt(MenuOptions[m]) as MenuOptions)
      .filter((m) => {
        return !this.excludedMenus().some((exclusion) => exclusion.condition && exclusion.options.includes(m));
      });

    const menuOptions: OptionSelectItem[] = this.menuOptions.map((option: MenuOptions) => {
      return {
        label: `${i18next.t(`menuUiHandler:${MenuOptions[option]}`)}`,
        handler: () => this.optionSelected(option),
        keepOpen: true,
      };
    });

    const config: OptionSelectConfig = {
      options: menuOptions,
      yOffset: -this.defaultYOffset - 1,
      maxOptions: 10,
      noCancel: true, // we take care of closing the menu in this handler
    };

    super.show([config]);

    // Add the container after the option selection menu was initialized, so that it shows above it
    this.getUi().add(this.menuContainer);
    this.menuContainer.setVisible(true);

    // Make sure the tutorial overlay sits above everything, but below the message box
    this.menuContainer.bringToTop(this.tutorialOverlay);
    this.menuContainer.bringToTop(this.menuMessageBoxContainer);

    // Needs to be done after super.show that it offsets everything properly based on the menu's width
    // TODO remove that need by using a NumberHolder for the window's width?
    this.menuMessageBox.setDisplaySize(globalScene.scaledCanvas.width - this.getWindowWidth() - 2, 48);
    this.initManageDataOptions();
    this.initCommunityMenuOptions();

    this.getUi().hideTooltip();

    globalScene.playSound("ui/menu_open");

    handleTutorial(Tutorial.Menu);

    this.bgmBar.toggleBgmBar(true);

    return true;
  }

  public override getWindowHeight(): number {
    return globalScene.scaledCanvas.height - 2;
  }

  optionSelected(option: MenuOptions): boolean {
    let success = false;
    const ui = this.getUi();
    switch (option) {
      case MenuOptions.GAME_SETTINGS:
        ui.setOverlayMode(Mode.SETTINGS);
        success = true;
        break;
      case MenuOptions.ACHIEVEMENTS:
        ui.setOverlayMode(Mode.ACHIEVEMENTS);
        success = true;
        break;
      case MenuOptions.STATS:
        ui.setOverlayMode(Mode.GAME_STATS);
        success = true;
        break;
      case MenuOptions.RUN_HISTORY:
        ui.setOverlayMode(Mode.RUN_HISTORY);
        success = true;
        break;
      case MenuOptions.EGG_LIST:
        if (globalScene.gameData.eggs.length) {
          ui.revertMode();
          ui.setOverlayMode(Mode.EGG_LIST);
          success = true;
        } else {
          ui.showText(i18next.t("menuUiHandler:noEggs"), null, () => ui.showText(""), fixedNumber(1500));
        }
        break;
      case MenuOptions.EGG_GACHA:
        ui.revertMode();
        ui.setOverlayMode(Mode.EGG_GACHA);
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
        ui.setOverlayMode(Mode.MENU_OPTION_SELECT, this.manageDataConfig);
        success = true;
        break;
      case MenuOptions.COMMUNITY:
        ui.setOverlayMode(Mode.MENU_OPTION_SELECT, this.communityConfig);
        success = true;
        break;
      case MenuOptions.SAVE_AND_QUIT:
        if (globalScene.currentBattle) {
          success = true;
          const doSaveQuit = () => {
            ui.setMode(Mode.LOADING, {
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
              ui.setOverlayMode(
                Mode.CONFIRM,
                doSaveQuit,
                () => {
                  ui.revertMode();
                  this.showText("", 0);
                },
                false,
                -this.getWindowWidth(),
              );
            });
          } else {
            doSaveQuit();
          }
        }
        break;
      case MenuOptions.LOG_OUT:
        success = true;
        const doLogout = () => {
          ui.setMode(Mode.LOADING, {
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
            ui.setOverlayMode(
              Mode.CONFIRM,
              doLogout,
              () => {
                ui.revertMode();
                this.showText("", 0);
              },
              false,
              -this.getWindowWidth(),
            );
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
          ui.setMode(Mode.MESSAGE);
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
    this.menuContainer.setVisible(false);
    this.bgmBar.toggleBgmBar(false);
  }
}

interface ConditionalMenu {
  condition: boolean;
  options: MenuOptions[];
}
