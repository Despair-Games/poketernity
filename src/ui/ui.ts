import { globalScene } from "#app/global-scene";
import { CANVAS_SCALE, GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import type { Button } from "#enums/button";
import { Device } from "#enums/devices";
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
import { BgmBar } from "#ui/bgm-bar";
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
import { UiHandler } from "#ui/ui-handler";
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

const permanentModes = [UiMode.MESSAGE, UiMode.MENU, UiMode.MENU_OPTION_SELECT, UiMode.OPTION_SELECT, UiMode.CONFIRM];

const DEFAULT_MODE = UiMode.MESSAGE;

export class UI extends Phaser.GameObjects.Container {
  private mode: UiMode;
  private modeChain: UiMode[];
  private handlers: Map<UiMode, UiHandler>;
  private overlay: Phaser.GameObjects.Rectangle;
  public achvBar: AchvBar; // TODO: make private and add helper functions
  public bgmBar: BgmBar; // TODO: make private and add helper functions
  public savingIcon: SavingIcon; // TODO: make private and add helper functions

  private tooltipContainer: Phaser.GameObjects.Container;
  private tooltipBg: Phaser.GameObjects.NineSlice;
  private tooltipTitle: Phaser.GameObjects.Text;
  private tooltipContent: Phaser.GameObjects.Text;

  private overlayActive: boolean;

  constructor() {
    super(globalScene, 0, GAME_HEIGHT);

    this.mode = DEFAULT_MODE;
    this.modeChain = [];
    this.handlers = new Map<UiMode, UiHandler>();
  }

  // TODO ensure this is only ever called once
  public setup(): void {
    this.setName(`ui-${UiMode[this.mode]}`);

    this.handlers.set(this.mode, this.initHandler(this.mode));
    this.getCurrentHandler().initialize();
    // TODO init permanent handlers?

    this.overlay = globalScene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0);
    this.overlay.setName("rect-ui-overlay");
    this.overlay.setOrigin(0, 0);
    globalScene.uiContainer.add(this.overlay);
    this.overlay.setVisible(false);
    this.setupTooltip();

    this.achvBar = new AchvBar();
    this.achvBar.setup();

    this.bgmBar = new BgmBar();
    this.bgmBar.setup();

    globalScene.uiContainer.add(this.achvBar);

    this.savingIcon = new SavingIcon();
    this.savingIcon.setup();

    globalScene.uiContainer.add(this.savingIcon);
  }

  private initHandler(mode: UiMode) {
    switch (mode) {
      case UiMode.MESSAGE:
        return new BattleMessageUiHandler();
      case UiMode.TITLE:
        return new TitleUiHandler();
      case UiMode.COMMAND:
        return new CommandUiHandler();
      case UiMode.FIGHT:
        return new FightUiHandler();
      case UiMode.BALL:
        return new BallUiHandler();
      case UiMode.TARGET_SELECT:
        return new TargetSelectUiHandler();
      case UiMode.MODIFIER_SELECT:
        return new ModifierSelectUiHandler();
      case UiMode.SAVE_SLOT:
        return new SaveSlotSelectUiHandler();
      case UiMode.PARTY:
        return new PartyUiHandler();
      case UiMode.SUMMARY:
        return new SummaryUiHandler();
      case UiMode.STARTER_SELECT:
        return new StarterSelectUiHandler();
      case UiMode.FORM_CHANGE_SCENE:
        return new FormChangeSceneUiHandler();
      case UiMode.EGG_HATCH_SCENE:
        return new EggHatchSceneUiHandler();
      case UiMode.EGG_HATCH_SUMMARY:
        return new EggHatchSummaryUiHandler();
      case UiMode.CONFIRM:
        return new ConfirmUiHandler();
      case UiMode.OPTION_SELECT:
        return new OptionSelectUiHandler();
      case UiMode.MENU:
        return new MenuUiHandler();
      case UiMode.MENU_OPTION_SELECT:
        return new OptionSelectUiHandler(UiMode.MENU_OPTION_SELECT);
      // settings
      case UiMode.SETTINGS:
        return new GeneralSettingsUiHandler();
      case UiMode.SETTINGS_DISPLAY:
        return new DisplaySettingsUiHandler();
      case UiMode.SETTINGS_AUDIO:
        return new AudioSettingsUiHandler();
      case UiMode.SETTINGS_GAMEPAD:
        return new GamepadSettingsUiHandler();
      case UiMode.GAMEPAD_BINDING:
        return new GamepadBindingUiHandler();
      case UiMode.SETTINGS_KEYBOARD:
        return new KeyboardSettingsUiHandler();
      case UiMode.KEYBOARD_BINDING:
        return new KeyboardBindingUiHandler();
      case UiMode.ACHIEVEMENTS:
        return new AchievementsUiHandler();
      case UiMode.GAME_STATS:
        return new GameStatsUiHandler();
      case UiMode.EGG_LIST:
        return new EggListUiHandler();
      case UiMode.EGG_GACHA:
        return new EggGachaUiHandler();
      case UiMode.LOGIN_FORM:
        return new LoginFormUiHandler();
      case UiMode.REGISTRATION_FORM:
        return new RegistrationFormUiHandler();
      case UiMode.LOADING:
        return new LoadingModalUiHandler();
      case UiMode.SESSION_RELOAD:
        return new SessionReloadModalUiHandler();
      case UiMode.UNAVAILABLE:
        return new UnavailableModalUiHandler();
      case UiMode.CHALLENGE_SELECT:
        return new ChallengeSelectUiHandler();
      case UiMode.RENAME_POKEMON:
        return new RenamePokemonUiHandler();
      case UiMode.RUN_HISTORY:
        return new RunHistoryUiHandler();
      case UiMode.RUN_INFO:
        return new RunInfoUiHandler();
      case UiMode.TEST_DIALOGUE:
        return new TestDialogueUiHandler();
      case UiMode.AUTO_COMPLETE:
        return new AutoCompleteUiHandler();
      case UiMode.ADMIN:
        return new AdminUiHandler();
      case UiMode.MYSTERY_ENCOUNTER:
        return new MysteryEncounterUiHandler();
    }
  }

  private getHandler(mode: UiMode): UiHandler {
    if (this.handlers.has(mode)) {
      return this.handlers.get(mode)!;
    }
    const handler = this.initHandler(mode);
    handler.initialize();
    this.handlers.set(mode, handler);
    return handler;
  }

  /**
   * Stop any active handler, clear the mode chain and go back to the default MESSAGE ui mode.
   *
   * For now, only used to reset all handlers between tests.
   */
  public resetHandlers(): void {
    this.mode = DEFAULT_MODE;
    const currentHandler = this.getCurrentHandler();
    this.handlers.forEach((handler) => {
      if (handler.active && handler !== currentHandler) {
        handler.stop();
      }
    });

    if (this.handlers.has(UiMode.STARTER_SELECT)) {
      (this.handlers.get(UiMode.STARTER_SELECT) as StarterSelectUiHandler).clearStarterPreferences();
    }
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
    for (const uiMode of this.handlers.keys()) {
      this.handlers.get(uiMode)?.destroy();
      //this.handlers.delete(uiMode); TODO: can't delete because some handler's clear method do stuff on other handlers
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

  public getCurrentHandler<H extends UiHandler = UiHandler>(): H {
    return this.handlers.get(this.mode) as H;
  }

  public getMessageHandler(): BattleMessageUiHandler {
    return this.handlers.get(UiMode.MESSAGE) as BattleMessageUiHandler;
  }

  private getCurrentMessageHandler(): MessageUiHandler {
    const handler = this.getCurrentHandler();
    if (handler instanceof MessageUiHandler && handler.message) {
      return handler;
    }
    return this.getMessageHandler();
  }

  public processInfoButton(pressed: boolean) {
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

  public processInput(button: Button): boolean {
    if (this.overlayActive) {
      return false;
    }

    const handler = this.getCurrentHandler();

    if (handler.isAwaitableUiHandler() && handler.tutorialActive) {
      return handler.processTutorialInput(button);
    }

    return handler.processInput(button);
  }

  public showTextPromise(
    text: string,
    callbackDelay: number = 0,
    prompt: boolean = true,
    promptDelay?: number | null,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.showText(text ?? "", null, () => resolve(), callbackDelay, prompt, promptDelay);
    });
  }

  public showText(
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

  public showDialogue(
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

  public shouldSkipDialogue(i18nKey: string): boolean {
    if (i18next.exists(i18nKey)) {
      if (settings.general.skipSeenDialogues && globalScene.gameData.getSeenDialogues()[i18nKey] === true) {
        return true;
      }
    }
    return false;
  }

  public getTooltip(): { visible: boolean; title: string; content: string } {
    return { visible: this.tooltipContainer.visible, title: this.tooltipTitle.text, content: this.tooltipContent.text };
  }

  public showTooltip(title: string, content: string, overlap?: boolean): void {
    this.tooltipContainer.setVisible(true);
    this.editTooltip(title, content);
    if (overlap) {
      globalScene.uiContainer.moveAbove(this.tooltipContainer, this);
    } else {
      globalScene.uiContainer.moveBelow(this.tooltipContainer, this);
    }
  }

  public editTooltip(title: string, content: string): void {
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

  public hideTooltip(): void {
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

  public clearText(): void {
    this.getCurrentMessageHandler().clearText();
  }

  // UNUSED?
  public setCursor(cursor: number): boolean {
    const changed = this.getCurrentHandler().setCursor(cursor);
    if (changed) {
      this.playSelect();
    }

    return changed;
  }

  public playSelect(): void {
    globalScene.audioManager.playSound("ui/select");
  }

  public playError(): void {
    globalScene.audioManager.playSound("ui/error");
  }

  public fadeOut(duration: number): Promise<void> {
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

  public fadeIn(duration: number): Promise<void> {
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

  public getMode(): UiMode {
    return this.mode;
  }

  public setMessageMode(): Promise<void> {
    return this.setMode<MessageUiHandler>(UiMode.MESSAGE);
  }

  public setMode<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, true, false, false, ...args);
  }

  public setModeForceTransition<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, true, true, false, ...args);
  }

  public setModeWithoutClear<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, false, false, false, ...args);
  }

  public setOverlayMode<THandler extends UiHandler = never>(
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
            // TODO see about destroying
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
          this.getHandler(mode).start(...params);
        } else if (!this.getCurrentHandler().active) {
          this.getHandler(mode).start(...params);
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

  public revertMode(): Promise<boolean> {
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

  // UNUSED?
  public revertModes(): Promise<void> {
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
   * TODO why is this here?
   */
  public getGamepadType(): string {
    if (globalScene.inputMethod === "gamepad") {
      return globalScene.inputController.getConfig(globalScene.inputController.selectedDevice[Device.GAMEPAD]).padType;
    }
    return globalScene.inputMethod;
  }
}
