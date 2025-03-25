import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { CANVAS_SCALE, GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#app/ui-constants";
import { AchvBar } from "#app/ui/components/achv-bar";
import type { BgmBar } from "#app/ui/components/bgm-bar";
import { SavingIcon } from "#app/ui/components/saving-icon";
import type { UiHandler } from "#app/ui/handlers/abstract-ui-handler";
import { AchievementsUiHandler } from "#app/ui/handlers/achievements-ui-handler";
import { AdminUiHandler } from "#app/ui/handlers/admin-ui-handler";
import { AutoCompleteUiHandler } from "#app/ui/handlers/autocomplete-ui-handler";
import { BallUiHandler } from "#app/ui/handlers/ball-ui-handler";
import { BattleMessageUiHandler } from "#app/ui/handlers/battle-message-ui-handler";
import { ChallengeSelectUiHandler } from "#app/ui/handlers/challenges-select-ui-handler";
import { CommandUiHandler } from "#app/ui/handlers/command-ui-handler";
import { ConfirmUiHandler } from "#app/ui/handlers/confirm-ui-handler";
import { EggGachaUiHandler } from "#app/ui/handlers/egg-gacha-ui-handler";
import { EggHatchSceneUiHandler } from "#app/ui/handlers/egg-hatch-scene-ui-handler";
import { EggListUiHandler } from "#app/ui/handlers/egg-list-ui-handler";
import { EggHatchSummaryUiHandler } from "#app/ui/handlers/egg-hatch-summary-ui-handler";
import { FightUiHandler } from "#app/ui/handlers/fight-ui-handler";
import { FormChangeSceneUiHandler } from "#app/ui/handlers/form-change-scene-ui-handler";
import { GameStatsUiHandler } from "#app/ui/handlers/game-stats-ui-handler";
import { LoadingModalUiHandler } from "#app/ui/handlers/loading-modal-ui-handler";
import { LoginFormUiHandler } from "#app/ui/handlers/login-form-ui-handler";
import { MenuUiHandler } from "#app/ui/handlers/menu-ui-handler";
import { MessageUiHandler } from "#app/ui/handlers/message-ui-handler";
import { ModifierSelectUiHandler } from "#app/ui/handlers/modifier-select-ui-handler";
import { MysteryEncounterUiHandler } from "#app/ui/handlers/mystery-encounter-ui-handler";
import { OptionSelectUiHandler } from "#app/ui/handlers/option-select-ui-handler";
import { PartyUiHandler } from "#app/ui/handlers/party-ui-handler";
import { RegistrationFormUiHandler } from "#app/ui/handlers/registration-form-ui-handler";
import { RenamePokemonUiHandler } from "#app/ui/handlers/rename-pokemon-ui-handler";
import { RunHistoryUiHandler } from "#app/ui/handlers/run-history-ui-handler";
import { RunInfoUiHandler } from "#app/ui/handlers/run-info-ui-handler";
import { SaveSlotSelectUiHandler } from "#app/ui/handlers/save-slot-select-ui-handler";
import { SessionReloadModalUiHandler } from "#app/ui/handlers/session-reload-modal-ui-handler";
import { StarterSelectUiHandler } from "#app/ui/handlers/starter-select-ui-handler";
import { SummaryUiHandler } from "#app/ui/handlers/summary-ui-handler";
import { TargetSelectUiHandler } from "#app/ui/handlers/target-select-ui-handler";
import { TestDialogueUiHandler } from "#app/ui/handlers/test-dialogue-ui-handler";
import { TitleUiHandler } from "#app/ui/handlers/title-ui-handler";
import { UnavailableModalUiHandler } from "#app/ui/handlers/unavailable-modal-ui-handler";
import { GamepadBindingUiHandler } from "#app/ui/settings/gamepad-binding-ui-handler";
import { KeyboardBindingUiHandler } from "#app/ui/settings/keyboard-binding-ui-handler";
import { NavigationManager } from "#app/ui/settings/navigation-menu";
import { SettingsAudioUiHandler } from "#app/ui/settings/settings-audio-ui-handler";
import { SettingsDisplayUiHandler } from "#app/ui/settings/settings-display-ui-handler";
import { SettingsGamepadUiHandler } from "#app/ui/settings/settings-gamepad-ui-handler";
import { SettingsKeyboardUiHandler } from "#app/ui/settings/settings-keyboard-ui-handler";
import { SettingsUiHandler } from "#app/ui/settings/settings-ui-handler";
import { addTextObject } from "#app/ui/text/text-utils";
import { addWindow } from "#app/ui/ui-theme";
import { executeIf } from "#app/utils";
import type { Button } from "#enums/buttons";
import { Device } from "#enums/devices";
import { PlayerGender } from "#enums/player-gender";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import i18next from "i18next";

/** All modes that are part of the settings UI. */
export const settingsUiModes = [
  UiMode.SETTINGS,
  UiMode.SETTINGS_AUDIO,
  UiMode.SETTINGS_DISPLAY,
  UiMode.SETTINGS_KEYBOARD,
  UiMode.KEYBOARD_BINDING,
  UiMode.SETTINGS_GAMEPAD,
  UiMode.GAMEPAD_BINDING,
];

const transitionModes = [
  UiMode.SAVE_SLOT,
  UiMode.PARTY,
  UiMode.SUMMARY,
  UiMode.STARTER_SELECT,
  UiMode.FORM_CHANGE_SCENE,
  UiMode.EGG_HATCH_SCENE,
  UiMode.EGG_LIST,
  UiMode.EGG_GACHA,
  UiMode.CHALLENGE_SELECT,
  UiMode.RUN_HISTORY,
];

const noTransitionModes = [
  UiMode.TITLE,
  UiMode.CONFIRM,
  UiMode.OPTION_SELECT,
  UiMode.MENU,
  UiMode.MENU_OPTION_SELECT,
  UiMode.GAMEPAD_BINDING,
  UiMode.KEYBOARD_BINDING,
  UiMode.SETTINGS,
  UiMode.SETTINGS_AUDIO,
  UiMode.SETTINGS_DISPLAY,
  UiMode.SETTINGS_GAMEPAD,
  UiMode.SETTINGS_KEYBOARD,
  UiMode.ACHIEVEMENTS,
  UiMode.GAME_STATS,
  UiMode.LOGIN_FORM,
  UiMode.REGISTRATION_FORM,
  UiMode.LOADING,
  UiMode.SESSION_RELOAD,
  UiMode.UNAVAILABLE,
  UiMode.RENAME_POKEMON,
  UiMode.TEST_DIALOGUE,
  UiMode.AUTO_COMPLETE,
  UiMode.ADMIN,
  UiMode.MYSTERY_ENCOUNTER,
  UiMode.RUN_INFO,
];

export class UI extends Phaser.GameObjects.Container {
  private mode: UiMode;
  private modeChain: UiMode[];
  public handlers: UiHandler[];
  private overlay: Phaser.GameObjects.Rectangle;
  public achvBar: AchvBar;
  public bgmBar: BgmBar;
  public savingIcon: SavingIcon;

  private tooltipContainer: Phaser.GameObjects.Container;
  private tooltipBg: Phaser.GameObjects.NineSlice;
  private tooltipTitle: Phaser.GameObjects.Text;
  private tooltipContent: Phaser.GameObjects.Text;

  private overlayActive: boolean;

  constructor() {
    super(globalScene, 0, GAME_HEIGHT);

    this.mode = UiMode.MESSAGE;
    this.modeChain = [];
    this.handlers = [
      new BattleMessageUiHandler(),
      new TitleUiHandler(),
      new CommandUiHandler(),
      new FightUiHandler(),
      new BallUiHandler(),
      new TargetSelectUiHandler(),
      new ModifierSelectUiHandler(),
      new SaveSlotSelectUiHandler(),
      new PartyUiHandler(),
      new SummaryUiHandler(),
      new StarterSelectUiHandler(),
      new FormChangeSceneUiHandler(),
      new EggHatchSceneUiHandler(),
      new EggHatchSummaryUiHandler(),
      new ConfirmUiHandler(),
      new OptionSelectUiHandler(),
      new MenuUiHandler(),
      new OptionSelectUiHandler(UiMode.MENU_OPTION_SELECT),
      // settings
      new SettingsUiHandler(),
      new SettingsDisplayUiHandler(),
      new SettingsAudioUiHandler(),
      new SettingsGamepadUiHandler(),
      new GamepadBindingUiHandler(),
      new SettingsKeyboardUiHandler(),
      new KeyboardBindingUiHandler(),
      new AchievementsUiHandler(),
      new GameStatsUiHandler(),
      new EggListUiHandler(),
      new EggGachaUiHandler(),
      new LoginFormUiHandler(),
      new RegistrationFormUiHandler(),
      new LoadingModalUiHandler(),
      new SessionReloadModalUiHandler(),
      new UnavailableModalUiHandler(),
      new ChallengeSelectUiHandler(),
      new RenamePokemonUiHandler(),
      new RunHistoryUiHandler(),
      new RunInfoUiHandler(),
      new TestDialogueUiHandler(),
      new AutoCompleteUiHandler(),
      new AdminUiHandler(),
      new MysteryEncounterUiHandler(),
    ];
  }

  setup(): void {
    this.setName(`ui-${UiMode[this.mode]}`);
    for (const handler of this.handlers) {
      handler.setup();
    }
    this.overlay = globalScene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0);
    this.overlay.setName("rect-ui-overlay");
    this.overlay.setOrigin(0, 0);
    globalScene.uiContainer.add(this.overlay);
    this.overlay.setVisible(false);
    this.setupTooltip();

    this.achvBar = new AchvBar();
    this.achvBar.setup();

    globalScene.uiContainer.add(this.achvBar);

    this.savingIcon = new SavingIcon();
    this.savingIcon.setup();

    globalScene.uiContainer.add(this.savingIcon);
  }

  private setupTooltip() {
    this.tooltipContainer = globalScene.add.container(0, 0);
    this.tooltipContainer.setName("tooltip");
    this.tooltipContainer.setVisible(false);

    this.tooltipBg = addWindow(0, 0, 128, 31);
    this.tooltipBg.setName("window-tooltip-bg");
    this.tooltipBg.setOrigin(0, 0);

    this.tooltipTitle = addTextObject(64, 4, "", TextStyle.TOOLTIP_TITLE);
    this.tooltipTitle.setName("text-tooltip-title");
    this.tooltipTitle.setOrigin(0.5, 0);

    this.tooltipContent = addTextObject(6, 16, "", TextStyle.TOOLTIP_CONTENT);
    this.tooltipContent.setName("text-tooltip-content");
    this.tooltipContent.setWordWrapWidth(120 * TEXT_SCALE);

    this.tooltipContainer.add(this.tooltipBg);
    this.tooltipContainer.add(this.tooltipTitle);
    this.tooltipContainer.add(this.tooltipContent);

    globalScene.uiContainer.add(this.tooltipContainer);
  }

  getHandler<H extends UiHandler = UiHandler>(): H {
    return this.handlers[this.mode] as H;
  }

  getMessageHandler(): BattleMessageUiHandler {
    return this.handlers[UiMode.MESSAGE] as BattleMessageUiHandler;
  }

  getCurrentMessageHandler(): MessageUiHandler {
    const handler = this.getHandler();
    if (handler instanceof MessageUiHandler && handler.message) {
      return handler;
    } else {
      return this.getMessageHandler();
    }
  }

  processInfoButton(pressed: boolean) {
    if (this.overlayActive) {
      return false;
    }

    if ([UiMode.CONFIRM, UiMode.COMMAND, UiMode.FIGHT, UiMode.MESSAGE].includes(this.mode)) {
      globalScene?.processInfoButton(pressed);
      return true;
    }
    globalScene?.processInfoButton(false);
    return true;
  }

  processInput(button: Button): boolean {
    if (this.overlayActive) {
      return false;
    }

    const handler = this.getHandler();

    if (handler.isAwaitableUiHandler() && handler.tutorialActive) {
      return handler.processTutorialInput(button);
    }

    return handler.processInput(button);
  }

  showTextPromise(
    text: string,
    callbackDelay: number = 0,
    prompt: boolean = true,
    promptDelay?: number | null,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.showText(text ?? "", null, () => resolve(), callbackDelay, prompt, promptDelay);
    });
  }

  showText(
    text: string,
    delay?: number | null,
    callback?: Function | null,
    callbackDelay?: number | null,
    prompt?: boolean | null,
    promptDelay?: number | null,
  ): void {
    if (prompt && text.indexOf("$") > -1) {
      const messagePages = text.split(/\$/g).map((m) => m.trim());
      let showMessageAndCallback = () => callback && callback();
      for (let p = messagePages.length - 1; p >= 0; p--) {
        const originalFunc = showMessageAndCallback;
        showMessageAndCallback = () => this.showText(messagePages[p], null, originalFunc, null, true);
      }
      showMessageAndCallback();
    } else {
      this.getCurrentMessageHandler().showText(text, delay, callback, callbackDelay, prompt, promptDelay);
    }
  }

  showDialogue(
    keyOrText: string,
    name: string | undefined,
    delay: number | null = 0,
    callback: Function,
    callbackDelay?: number,
    promptDelay?: number,
  ): void {
    // Get localized dialogue (if available)
    let hasi18n = false;
    let text = keyOrText;
    const genderIndex = settings.display.playerGender ?? PlayerGender.UNSET;
    const genderStr = PlayerGender[genderIndex].toLowerCase();

    if (i18next.exists(keyOrText)) {
      const i18nKey = keyOrText;
      hasi18n = true;

      text = i18next.t(i18nKey, { context: genderStr }); // override text with translation

      // Skip dialogue if the player has enabled the option and the dialogue has been already seen
      if (this.shouldSkipDialogue(i18nKey)) {
        console.log(`Dialogue ${i18nKey} skipped`);
        callback();
        return;
      }
    }
    let showMessageAndCallback = () => {
      hasi18n && globalScene.gameData.saveSeenDialogue(keyOrText);
      callback();
    };
    if (text.indexOf("$") > -1) {
      const messagePages = text.split(/\$/g).map((m) => m.trim());
      for (let p = messagePages.length - 1; p >= 0; p--) {
        const originalFunc = showMessageAndCallback;
        showMessageAndCallback = () => this.showDialogue(messagePages[p], name, null, originalFunc);
      }
      showMessageAndCallback();
    } else {
      this.getCurrentMessageHandler().showDialogue(
        text,
        name,
        delay,
        showMessageAndCallback,
        callbackDelay,
        true,
        promptDelay,
      );
    }
  }

  shouldSkipDialogue(i18nKey: string): boolean {
    if (i18next.exists(i18nKey)) {
      if (settings.general.skipSeenDialogues && globalScene.gameData.getSeenDialogues()[i18nKey] === true) {
        return true;
      }
    }
    return false;
  }

  getTooltip(): { visible: boolean; title: string; content: string } {
    return { visible: this.tooltipContainer.visible, title: this.tooltipTitle.text, content: this.tooltipContent.text };
  }

  showTooltip(title: string, content: string, overlap?: boolean): void {
    this.tooltipContainer.setVisible(true);
    this.editTooltip(title, content);
    if (overlap) {
      globalScene.uiContainer.moveAbove(this.tooltipContainer, this);
    } else {
      globalScene.uiContainer.moveBelow(this.tooltipContainer, this);
    }
  }

  editTooltip(title: string, content: string): void {
    this.tooltipTitle.setText(title || "");
    const wrappedContent = this.tooltipContent.runWordWrap(content);
    this.tooltipContent.setText(wrappedContent);
    this.tooltipContent.y = title ? 16 : 4;
    this.tooltipBg.width = Math.min(
      Math.max(this.tooltipTitle.displayWidth, this.tooltipContent.displayWidth) + 12,
      838,
    );
    this.tooltipBg.height = (title ? 31 : 19) + 10.5 * (wrappedContent.split("\n").length - 1);
    this.tooltipTitle.x = this.tooltipBg.width / 2;
  }

  hideTooltip(): void {
    this.tooltipContainer.setVisible(false);
    this.tooltipTitle.clearTint();
  }

  override update(): void {
    if (this.tooltipContainer.visible) {
      const isTouch = globalScene.inputMethod === "touch";
      const pointerX = globalScene.game.input.activePointer.x / CANVAS_SCALE;
      const pointerY = globalScene.game.input.activePointer.y / CANVAS_SCALE;
      const tooltipWidth = this.tooltipBg.width;
      const tooltipHeight = this.tooltipBg.height;
      const padding = 2;

      // Default placement is top left corner of the screen on mobile. Otherwise below the cursor, to the right
      let x = isTouch ? padding : pointerX + padding;
      let y = isTouch ? padding : pointerY + padding;

      if (isTouch) {
        // If we are in the top left quadrant on mobile, move the tooltip to the top right corner
        if (pointerX <= GAME_WIDTH / 2 && pointerY <= GAME_HEIGHT / 2) {
          x = GAME_WIDTH - tooltipWidth - padding;
        }
      } else {
        // If the tooltip would go offscreen on the right, or is close to it, move to the left of the cursor
        if (x + tooltipWidth + padding > GAME_WIDTH) {
          x = Math.max(padding, pointerX - tooltipWidth - padding);
        }
        // If the tooltip would go offscreen at the bottom, or is close to it, move above the cursor
        if (y + tooltipHeight + padding > GAME_HEIGHT) {
          y = Math.max(padding, pointerY - tooltipHeight - padding);
        }
      }

      this.tooltipContainer.setPosition(x, y);
    }
  }

  override destroy(fromScene?: boolean): void {
    NavigationManager.getInstance().clearMenus();
    this.removeAll(true);
    super.destroy(fromScene);
  }

  clearText(): void {
    this.getCurrentMessageHandler().clearText();
  }

  setCursor(cursor: number): boolean {
    const changed = this.getHandler().setCursor(cursor);
    if (changed) {
      this.playSelect();
    }

    return changed;
  }

  playSelect(): void {
    globalScene.audioManager.playSound("ui/select");
  }

  playError(): void {
    globalScene.audioManager.playSound("ui/error");
  }

  fadeOut(duration: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.overlayActive) {
        return resolve();
      }
      this.overlayActive = true;
      this.overlay.setAlpha(0);
      this.overlay.setVisible(true);
      globalScene.tweens.add({
        targets: this.overlay,
        alpha: 1,
        duration: duration,
        ease: "Sine.easeOut",
        onComplete: () => resolve(),
      });
    });
  }

  fadeIn(duration: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.overlayActive) {
        return resolve();
      }
      globalScene.tweens.add({
        targets: this.overlay,
        alpha: 0,
        duration: duration,
        ease: "Sine.easeIn",
        onComplete: () => {
          this.overlay.setVisible(false);
          resolve();
        },
      });
      this.overlayActive = false;
    });
  }

  getMode(): UiMode {
    return this.mode;
  }

  setMessageMode(): Promise<void> {
    return this.setMode<MessageUiHandler>(UiMode.MESSAGE);
  }

  setMode<THandler extends UiHandler = never>(mode: UiMode, ...args: Parameters<THandler["show"]>): Promise<void> {
    return this.setModeInternal<THandler>(mode, true, false, false, ...args);
  }

  setModeForceTransition<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, true, true, false, ...args);
  }

  setModeWithoutClear<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, false, false, false, ...args);
  }

  setOverlayMode<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, false, false, true, ...args);
  }

  private setModeInternal<THandler extends UiHandler = never>(
    mode: UiMode,
    clear: boolean,
    forceTransition: boolean,
    chainMode: boolean,
    ...params: Parameters<THandler["show"]>
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.mode === mode && !forceTransition) {
        resolve();
        return;
      }
      const doSetMode = () => {
        if (this.mode !== mode) {
          if (clear) {
            this.getHandler().clear();
          }
          if (chainMode && this.mode && !clear) {
            this.modeChain.push(this.mode);
            globalScene.updateGameInfo();
          }
          this.mode = mode;
          const touchControls = document?.getElementById("touchControls");
          if (touchControls) {
            touchControls.dataset.uiMode = UiMode[mode];
          }
          this.getHandler().show(...params);
        }
        resolve();
      };
      if (
        (!chainMode
          && (transitionModes.indexOf(this.mode) > -1 || transitionModes.indexOf(mode) > -1)
          && noTransitionModes.indexOf(this.mode) === -1
          && noTransitionModes.indexOf(mode) === -1)
        || (chainMode && noTransitionModes.indexOf(mode) === -1)
      ) {
        this.fadeOut(250).then(() => {
          globalScene.time.delayedCall(100, () => {
            doSetMode();
            this.fadeIn(250);
          });
        });
      } else {
        doSetMode();
      }
    });
  }

  resetModeChain(): void {
    this.modeChain = [];
    globalScene.updateGameInfo();
  }

  revertMode(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!this?.modeChain?.length) {
        return resolve(false);
      }

      const lastMode = this.mode;

      const doRevertMode = () => {
        this.getHandler().clear();
        this.mode = this.modeChain.pop()!; // TODO: is this bang correct?
        globalScene.updateGameInfo();
        const touchControls = document.getElementById("touchControls");
        if (touchControls) {
          touchControls.dataset.uiMode = UiMode[this.mode];
        }
        resolve(true);
      };

      if (noTransitionModes.indexOf(lastMode) === -1) {
        this.fadeOut(250).then(() => {
          globalScene.time.delayedCall(100, () => {
            doRevertMode();
            this.fadeIn(250);
          });
        });
      } else {
        doRevertMode();
      }
    });
  }

  revertModes(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this?.modeChain?.length) {
        return resolve();
      }
      this.revertMode().then((success) => executeIf(success, this.revertModes).then(() => resolve()));
    });
  }

  public getModeChain(): UiMode[] {
    return this.modeChain;
  }

  /**
   * getGamepadType - returns the type of gamepad being used
   * inputMethod could be "keyboard" or "touch" or "gamepad"
   * if inputMethod is "keyboard" or "touch", then the inputMethod is returned
   * if inputMethod is "gamepad", then the gamepad type is returned it could be "xbox" or "dualshock"
   * @returns gamepad type
   */
  public getGamepadType(): string {
    if (globalScene.inputMethod === "gamepad") {
      return globalScene.inputController.getConfig(globalScene.inputController.selectedDevice[Device.GAMEPAD]).padType;
    } else {
      return globalScene.inputMethod;
    }
  }
}
