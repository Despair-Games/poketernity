import { globalScene } from "#app/global-scene";
import { CANVAS_SCALE, GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import type { Button } from "#enums/button";
import { Device } from "#enums/device";
import { PlayerGender } from "#enums/player-gender";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import { AchievementsUiHandler } from "#ui/achievements-ui-handler";
import { AchvBar } from "#ui/achv-bar";
import { AdminUiHandler } from "#ui/admin-ui-handler";
import { AudioSettingsUiHandler } from "#ui/audio-settings-ui-handler";
import { AutoCompleteUiHandler } from "#ui/autocomplete-ui-handler";
import { BallUiHandler } from "#ui/ball-ui-handler";
import { BattleMessageUiHandler } from "#ui/battle-message-ui-handler";
import type { BgmBar } from "#ui/bgm-bar";
import { ChallengeSelectUiHandler } from "#ui/challenges-select-ui-handler";
import { CommandUiHandler } from "#ui/command-ui-handler";
import { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import { DisplaySettingsUiHandler } from "#ui/display-settings-ui-handler";
import { EggGachaUiHandler } from "#ui/egg-gacha-ui-handler";
import { EggHatchSceneUiHandler } from "#ui/egg-hatch-scene-ui-handler";
import { EggHatchSummaryUiHandler } from "#ui/egg-hatch-summary-ui-handler";
import { EggListUiHandler } from "#ui/egg-list-ui-handler";
import { FightUiHandler } from "#ui/fight-ui-handler";
import { FormChangeSceneUiHandler } from "#ui/form-change-scene-ui-handler";
import { GameStatsUiHandler } from "#ui/game-stats-ui-handler";
import { GamepadBindingUiHandler } from "#ui/gamepad-binding-ui-handler";
import { GamepadSettingsUiHandler } from "#ui/gamepad-settings-ui-handler";
import { GeneralSettingsUiHandler } from "#ui/general-settings-ui-handler";
import { KeyboardBindingUiHandler } from "#ui/keyboard-binding-ui-handler";
import { KeyboardSettingsUiHandler } from "#ui/keyboard-settings-ui-handler";
import { LoadingModalUiHandler } from "#ui/loading-modal-ui-handler";
import { LoginFormUiHandler } from "#ui/login-form-ui-handler";
import { MenuUiHandler } from "#ui/menu-ui-handler";
import { MessageUiHandler } from "#ui/message-ui-handler";
import { ModifierSelectUiHandler } from "#ui/modifier-select-ui-handler";
import { MysteryEncounterUiHandler } from "#ui/mystery-encounter-ui-handler";
import { NavigationManager } from "#ui/navigation-menu";
import { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import { PartyUiHandler } from "#ui/party-ui-handler";
import { RegistrationFormUiHandler } from "#ui/registration-form-ui-handler";
import { RenamePokemonUiHandler } from "#ui/rename-pokemon-ui-handler";
import { RunHistoryUiHandler } from "#ui/run-history-ui-handler";
import { RunInfoUiHandler } from "#ui/run-info-ui-handler";
import { SaveSlotSelectUiHandler } from "#ui/save-slot-select-ui-handler";
import { SavingIcon } from "#ui/saving-icon";
import { SessionReloadModalUiHandler } from "#ui/session-reload-modal-ui-handler";
import { StarterSelectUiHandler } from "#ui/starter-select-ui-handler";
import { SummaryUiHandler } from "#ui/summary-ui-handler";
import { TargetSelectUiHandler } from "#ui/target-select-ui-handler";
import { TestDialogueUiHandler } from "#ui/test-dialogue-ui-handler";
import { addTextObject } from "#ui/text-utils";
import { TitleUiHandler } from "#ui/title-ui-handler";
import type { UiHandler } from "#ui/ui-handler";
import { addWindow } from "#ui/ui-theme";
import { UnavailableModalUiHandler } from "#ui/unavailable-modal-ui-handler";
import { executeIf } from "#utils/common-utils";
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

const DEFAULT_MODE = UiMode.MESSAGE;

export class UI extends Phaser.GameObjects.Container {
  private mode: UiMode;
  private modeChain: UiMode[];
  private handlers: UiHandler[];
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

    this.mode = DEFAULT_MODE;
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
      new GeneralSettingsUiHandler(),
      new DisplaySettingsUiHandler(),
      new AudioSettingsUiHandler(),
      new GamepadSettingsUiHandler(),
      new GamepadBindingUiHandler(),
      new KeyboardSettingsUiHandler(),
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
      handler.initialize();
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

  /**
   * Stop any active handler, clear the mode chain and go back to the default MESSAGE ui mode.
   *
   * For now, only used to reset all handlers between tests.
   */
  public resetHandlers(): void {
    this.mode = DEFAULT_MODE;
    const currentHandler = this.getCurrentHandler();
    for (const handler of this.handlers.filter((h) => h.active && h !== currentHandler)) {
      handler.stop();
    }
    (this.handlers[UiMode.STARTER_SELECT] as StarterSelectUiHandler).clearStarterPreferences();
    this.resetModeChain();
  }

  public resetModeChain(): void {
    this.modeChain = [];
    globalScene.updateGameInfo();
  }

  public override destroy(fromScene?: boolean): void {
    // Clear references to current handlers in the NavigationManager
    NavigationManager.getInstance().clearMenus();

    // Destroy all handlers
    for (const handler of this.handlers) {
      handler.destroy();
    }

    super.destroy(fromScene);
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

  getCurrentHandler<H extends UiHandler = UiHandler>(): H {
    return this.handlers[this.mode] as H;
  }

  getMessageHandler(): BattleMessageUiHandler {
    return this.handlers[UiMode.MESSAGE] as BattleMessageUiHandler;
  }

  getCurrentMessageHandler(): MessageUiHandler {
    const handler = this.getCurrentHandler();
    if (handler instanceof MessageUiHandler && handler.message) {
      return handler;
    }
    return this.getMessageHandler();
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

    const handler = this.getCurrentHandler();

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
    callback?: VoidFunction | null,
    callbackDelay?: number | null,
    prompt?: boolean | null,
    promptDelay?: number | null,
  ): void {
    if (prompt && text.indexOf("$") > -1) {
      const messagePages = text.split(/\$/g).map((m) => m.trim());
      let showMessageAndCallback = () => callback?.();
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
    delay: number | null,
    callback: VoidFunction,
    callbackDelay?: number,
    promptDelay?: number,
  ): void {
    delay = delay ?? 0;
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

  clearText(): void {
    this.getCurrentMessageHandler().clearText();
  }

  setCursor(cursor: number): boolean {
    const changed = this.getCurrentHandler().setCursor(cursor);
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
          if (clear && this.getCurrentHandler().active) {
            this.getCurrentHandler().stop();
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
          this.getCurrentHandler().start(...params);
        } else if (!this.getCurrentHandler().active) {
          this.getCurrentHandler().start(...params);
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

  revertMode(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!this?.modeChain?.length) {
        return resolve(false);
      }

      const lastMode = this.mode;

      const doRevertMode = () => {
        this.getCurrentHandler().stop();
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
    }
    return globalScene.inputMethod;
  }
}
