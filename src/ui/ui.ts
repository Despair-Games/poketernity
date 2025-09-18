import { globalScene } from "#app/global-scene";
import { logUiDebug, logUiVerbose } from "#app/loggers";
import { CANVAS_SCALE, GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import { BattleSceneEventType } from "#enums/battle-scene-event-type";
import type { Button } from "#enums/button";
import { Device } from "#enums/device";
import { PlayerGender } from "#enums/player-gender";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import type { ShowTextOptions } from "#types/ui-types";
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
import { OptionSelectUiHandler } from "#ui/option-select-ui-handler";
import { PartyUiHandler } from "#ui/party-ui-handler";
import { RegistrationFormUiHandler } from "#ui/registration-form-ui-handler";
import { RenamePokemonUiHandler } from "#ui/rename-pokemon-ui-handler";
import { RunHistoryUiHandler } from "#ui/run-history-ui-handler";
import { RunInfoUiHandler } from "#ui/run-info-ui-handler";
import { SaveSlotSelectUiHandler } from "#ui/save-slot-select-ui-handler";
import { SavingIcon } from "#ui/saving-icon";
import { SessionReloadModalUiHandler } from "#ui/session-reload-modal-ui-handler";
import { SettingsNavigationManager } from "#ui/settings-navigation-manager";
import { StarterSelectUiHandler } from "#ui/starter-select-ui-handler";
import { SummaryUiHandler } from "#ui/summary-ui-handler";
import { TargetSelectUiHandler } from "#ui/target-select-ui-handler";
import { TestDialogueUiHandler } from "#ui/test-dialogue-ui-handler";
import { addTextObject } from "#ui/text-utils";
import { TitleUiHandler } from "#ui/title-ui-handler";
import type { UiHandler } from "#ui/ui-handler";
import { addWindow } from "#ui/ui-theme";
import { UnavailableModalUiHandler } from "#ui/unavailable-modal-ui-handler";
import { enumValueToKey, executeIf } from "#utils/common-utils";
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

/** Modes for which animations should play when changing to/from the mode. */
const transitionModes = [
  UiMode.SAVE_SLOT,
  UiMode.PARTY,
  UiMode.SUMMARY,
  UiMode.CHALLENGE_SELECT,
  UiMode.STARTER_SELECT,
  UiMode.FORM_CHANGE_SCENE,
  UiMode.EGG_HATCH_SCENE,
  UiMode.EGG_LIST,
  UiMode.EGG_GACHA,
  UiMode.RUN_HISTORY,
];

/**
 * Modes for which animations should **not** play when changing to/from the mode.
 *
 * Note: this list is not strictly the opposite of `transitionModes`,
 * as some UIs that are not in this list or transitionModes will still get animated
 * TODO: Figure out whether that is intended. If not, only keep a single list of the two.
 * If yes, clarify the different between the two.
 */
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

/** List of ui modes that can always be destroyed after use. */
const alwaysDestroyModes = [UiMode.UNAVAILABLE, UiMode.SESSION_RELOAD];
/** List of ui modes used during run preparation that can be destroyed when in a run. */
const runPrepModes = [UiMode.TITLE, UiMode.STARTER_SELECT, UiMode.CHALLENGE_SELECT, UiMode.SAVE_SLOT, UiMode.RUN_INFO];
/** List of ui battle modes that should always stay loaded when in a run. */
const permanentBattleModes = [
  UiMode.COMMAND,
  UiMode.BALL,
  UiMode.FIGHT,
  UiMode.TARGET_SELECT,
  UiMode.PARTY,
  UiMode.SUMMARY,
  UiMode.MODIFIER_SELECT,
];
/** List of ui battle modes that can be destroyed after each wave. */
const temporaryBattleModes = [
  UiMode.MYSTERY_ENCOUNTER,
  UiMode.FORM_CHANGE_SCENE,
  UiMode.EGG_HATCH_SCENE,
  UiMode.EGG_HATCH_SUMMARY,
];
/** List of ui modes accessed only from the main menu, that can be destroyed once the menu is closed. */
const mainMenuAccessedModes = [
  UiMode.ACHIEVEMENTS,
  UiMode.GAME_STATS,
  UiMode.EGG_GACHA,
  UiMode.EGG_LIST,
  UiMode.RUN_HISTORY,
  UiMode.RUN_INFO,
  UiMode.ADMIN,
  UiMode.TEST_DIALOGUE,
];

/** Mode that will be set by default when initializing the UI. */
const DEFAULT_MODE = UiMode.MESSAGE;

export class UI extends Phaser.GameObjects.Container {
  private mode: UiMode;
  private modeChain: UiMode[];
  private readonly handlers: Map<UiMode, UiHandler>;
  private overlay: Phaser.GameObjects.Rectangle;
  public achvBar: AchvBar; // TODO: make private and add helper functions
  public bgmBar: BgmBar; // TODO: make private and add helper functions
  public savingIcon: SavingIcon; // TODO: make private and add helper functions

  private tooltipContainer: Phaser.GameObjects.Container;
  private tooltipBg: Phaser.GameObjects.NineSlice;
  private tooltipTitle: Phaser.GameObjects.Text;
  private tooltipContent: Phaser.GameObjects.Text;

  private overlayActive: boolean;

  /** Callback used to destroy no longer needed handlers on new encounters. */
  private readonly onNextEncounterEvent = () => this.deleteUiHandlers(...runPrepModes, ...temporaryBattleModes);
  /** Callback used to destroy no longer needed handlers on run end (win or loss). */
  private readonly onGameOverEvent = () => this.deleteUiHandlers(...permanentBattleModes, ...temporaryBattleModes);

  constructor() {
    super(globalScene, 0, GAME_HEIGHT);

    this.mode = DEFAULT_MODE;
    this.modeChain = [];
    this.handlers = new Map<UiMode, UiHandler>();
  }

  public setup(): void {
    if (this.handlers.size > 0) {
      return; // Only setup once
    }

    logUiVerbose("Initializing UI and default handlers");

    this.setName(`ui-${UiMode[this.mode]}`);

    // Initialize the default handler
    this.addUiHandler(this.mode);

    // If this handler gets initialized just before being shown the input text flashes
    // so for now we initialize it during loading and never stop it.
    // note: all form modals that use 'inputText.setText' have this issue, but this is the only one players can see
    this.addUiHandler(UiMode.RENAME_POKEMON);

    // Init UI overlay
    this.overlay = globalScene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0);
    this.overlay.setName("rect-ui-overlay");
    this.overlay.setOrigin(0, 0);
    this.overlay.setVisible(false);
    globalScene.uiContainer.add(this.overlay);

    // Init tooltip window
    this.setupTooltip();

    // Init achievement bar
    this.achvBar = new AchvBar();
    this.achvBar.setup();
    globalScene.uiContainer.add(this.achvBar);

    // Init bgm bar (it will be added to the UI by the menu handler)
    this.bgmBar = new BgmBar();
    this.bgmBar.setup();

    // Init saving icon
    this.savingIcon = new SavingIcon();
    this.savingIcon.setup();
    globalScene.uiContainer.add(this.savingIcon);

    // Register listener to new encounter events and post game over events
    globalScene.eventTarget.addEventListener(BattleSceneEventType.ENCOUNTER_PHASE, this.onNextEncounterEvent);
    globalScene.eventTarget.addEventListener(BattleSceneEventType.POST_GAME_OVER, this.onGameOverEvent);
  }

  /**
   * Initialize the tooltip window.
   */
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

  /**
   * Instantiate a new UiHandler corresponding to the given mode.
   * @param mode - The {@linkcode UiMode} to consider
   * @returns the {@linkcode UiHandler} for that mode
   */
  private createUiHandler(mode: UiMode): UiHandler {
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

  /**
   * Initialize a new UiHandler for the given mode, and add it the handlers list.
   * @param mode - The {@linkcode UiMode} to a create handler for
   * @returns a ready to use {@linkcode UiHandler} for that mode
   */
  private addUiHandler(mode: UiMode): UiHandler {
    const handler = this.createUiHandler(mode);
    logUiVerbose(`Initializing Handler for mode: ${UiMode[mode]} (${mode})`);
    this.handlers.set(mode, handler);
    handler.initialize();
    return handler;
  }

  /**
   * Destroy the handlers for the given modes if they exist, and remove them from the handlers list.
   * @param modes - one or more {@linkcode UiMode}s
   */
  private deleteUiHandlers(...modes: UiMode[]): void {
    for (const mode of modes) {
      const handler = this.handlers.get(mode);
      if (handler && !handler.active) {
        logUiVerbose(`Destroying Handler for mode: ${UiMode[mode]} (${mode})`);
        this.handlers.delete(mode);
        if (handler.ready) {
          handler.destroy();
        }
      }
    }
  }

  /**
   * Get a handler from the list of active handlers if it exists, otherwise initialize it.
   * @param mode - The {@linkcode UiMode} we need the handler for
   * @returns an initialized {@linkcode UiHandler} for that mode
   */
  private getUiHandler(mode: UiMode): UiHandler {
    if (this.handlers.has(mode)) {
      return this.handlers.get(mode)!;
    }
    return this.addUiHandler(mode);
  }

  /**
   * Stop any active handler, clear the mode chain and go back to the default MESSAGE ui mode.
   */
  public resetHandlers(): void {
    this.mode = DEFAULT_MODE;
    const currentHandler = this.getCurrentHandler();

    for (const handler of this.handlers.values()) {
      if (handler.active && handler !== currentHandler) {
        handler.stop();
      }
    }

    if (this.handlers.has(UiMode.STARTER_SELECT)) {
      (this.handlers.get(UiMode.STARTER_SELECT) as StarterSelectUiHandler).clearStarterPreferences();
    }

    this.resetModeChain();
  }

  private resetModeChain(): void {
    this.modeChain = [];
    globalScene.updateGameInfo();
  }

  public override destroy(fromScene?: boolean): void {
    logUiVerbose("Destroying UI and all handlers");
    // Clear references to current handlers in the NavigationManager
    SettingsNavigationManager.getInstance().clearMenus();

    // Destroy all handlers
    for (const [uiMode, handler] of this.handlers.entries()) {
      handler.destroy();
      this.handlers.delete(uiMode);
    }

    globalScene.eventTarget.removeEventListener(BattleSceneEventType.POST_GAME_OVER, this.onGameOverEvent);
    globalScene.eventTarget.removeEventListener(BattleSceneEventType.ENCOUNTER_PHASE, this.onNextEncounterEvent);

    super.destroy(fromScene);
  }

  /**
   * @returns The currently active {@linkcode UiHandler}.
   */
  public getCurrentHandler<H extends UiHandler = UiHandler>(): H {
    return this.handlers.get(this.mode) as H;
  }

  /**
   * @returns The {@linkcode BattleMessageUiHandler} to use to display messages during gameplay.
   * @todo refactor message/dialogue handling to not require this.
   */
  public getMessageHandler(): BattleMessageUiHandler | undefined {
    return this.handlers.get(UiMode.MESSAGE) as BattleMessageUiHandler;
  }

  private getCurrentMessageHandler(): MessageUiHandler {
    const handler = this.getCurrentHandler();
    if (handler instanceof MessageUiHandler && handler.message) {
      return handler;
    }
    if (!this.handlers.get(UiMode.MESSAGE)) {
      this.addUiHandler(UiMode.MESSAGE);
    }
    return this.getMessageHandler()!;
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

  public async showTextPromise(
    text: string,
    callbackDelay: number = 0,
    prompt: boolean = true,
    promptDelay?: number,
  ): Promise<void> {
    if (text == null) {
      console.error("Missing `text` param for `UI#showTextPromise`!");
      text = "";
    }
    return new Promise<void>((resolve) => {
      this.showText(text, { callback: () => resolve(), callbackDelay, prompt, promptDelay });
    });
  }

  public showText(text: string, { delay, callback, callbackDelay, prompt, promptDelay }: ShowTextOptions = {}): void {
    if (prompt && text.indexOf("$") > -1) {
      const messagePages = text.split(/\$/g).map((m) => m.trim());
      let showMessageAndCallback = () => callback?.();
      for (let p = messagePages.length - 1; p >= 0; p--) {
        const originalFunc = showMessageAndCallback;
        showMessageAndCallback = () => this.showText(messagePages[p], { callback: originalFunc, prompt: true });
      }
      showMessageAndCallback();
    } else {
      this.getCurrentMessageHandler().showText(text, { delay, callback, callbackDelay, prompt, promptDelay });
    }
  }

  public showDialogue(
    keyOrText: string,
    name: string,
    callback: VoidFunction,
    delay?: number,
    callbackDelay?: number,
    promptDelay?: number,
  ): void {
    delay = delay ?? 0;
    // Get localized dialogue (if available)
    let hasi18n = false;
    let text = keyOrText;
    const genderIndex = settings.display.playerGender ?? PlayerGender.UNSET;
    const genderStr = enumValueToKey(PlayerGender, genderIndex).toLowerCase();

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
        showMessageAndCallback = () => this.showDialogue(messagePages[p], name, originalFunc);
      }
      showMessageAndCallback();
    } else {
      this.getCurrentMessageHandler().showDialogue(
        text,
        name,
        showMessageAndCallback,
        delay,
        callbackDelay,
        true,
        promptDelay,
      );
    }
  }

  /**
   * Check whether a dialogue should be shown or not, based on the "skip seen dialogues" setting.
   * @param i18nKey - The dialogue key
   * @returns `true` if the dialogue should be skipped.
   * @todo why is this here?
   */
  public shouldSkipDialogue(i18nKey: string): boolean {
    if (
      i18next.exists(i18nKey)
      && settings.general.skipSeenDialogues
      && globalScene.gameData.getSeenDialogues()[i18nKey] === true
    ) {
      return true;
    }
    return false;
  }

  /**
   * @returns the current state and contents of the tooltip window.
   */
  public getTooltip(): { visible: boolean; title: string; content: string } {
    return { visible: this.tooltipContainer.visible, title: this.tooltipTitle.text, content: this.tooltipContent.text };
  }

  /**
   * Make the tooltip window visible (it will be placed based on the mouse/touch cursor until hidden).
   * @param title - Header text for the tooltip. Can be empty.
   * @param content - The main content of the tooltip
   * @param overlap - `true` if the tooltip should be moved above the rest of the UI. Default: `false`
   */
  public showTooltip(title: string, content: string, overlap: boolean = false): void {
    this.tooltipContainer.setVisible(true);
    this.editTooltip(title, content);
    if (overlap) {
      globalScene.uiContainer.moveBelow(this.tooltipContainer, this);
    } else {
      globalScene.uiContainer.moveAbove(this.tooltipContainer, this);
    }
  }

  /**
   * Edit the tooltip window contents (assuming it is already being displayed)
   * @param title - Header text for the tooltip. Can be empty.
   * @param content - The main content of the tooltip
   */
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

  /** Hide the tooltip window. */
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

  /**
   * Clear text in the currently active message handler.
   */
  public clearText(): void {
    this.getCurrentMessageHandler().clearText();
  }

  /**
   * Play the 'select' sound effect.
   */
  public playSelect(): void {
    globalScene.audioManager.playSound("ui/select");
  }

  /**
   * Play the 'error' sound effect.
   */
  public playError(): void {
    globalScene.audioManager.playSound("ui/error");
  }

  /**
   * Fade out the Ui container to make it appear black.
   * @param duration - duration of the fading animation, in ms.
   * @returns Promise that resolves after the animation is done.
   */
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
        duration,
        ease: "Sine.easeOut",
        onComplete: () => resolve(),
      });
    });
  }

  /**
   * Fade in the Ui container to make it visible.
   * @param duration - duration of the fading animation, in ms.
   * @returns Promise that resolves after the animation is done.
   */
  public fadeIn(duration: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.overlayActive) {
        return resolve();
      }
      globalScene.tweens.add({
        targets: this.overlay,
        alpha: 0,
        duration,
        ease: "Sine.easeIn",
        onComplete: () => {
          this.overlay.setVisible(false);
          resolve();
        },
      });
      this.overlayActive = false;
    });
  }

  /**
   * @returns the currently active {@linkcode UiMode}
   */
  public getMode(): UiMode {
    return this.mode;
  }

  /**
   * Set the current ui mode to {@linkcode UiMode.MESSAGE}
   * @returns Promise that resolves once the mode is set.
   */
  public setMessageMode(): Promise<void> {
    return this.setMode<MessageUiHandler>(UiMode.MESSAGE);
  }

  /**
   * Change the current ui mode, clearing the current handler.
   * Won't have any effect if the requested mode is already active.
   * @param mode - The {@linkcode UiMode} to switch to.
   * @param args - Parameters for the UiMode's handler 'show' function
   * @returns Promise that resolves once the mode is set.
   */
  public setMode<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, true, false, false, ...args);
  }

  /**
   * Change the current ui mode, clearing the current handler.
   * This will take effect even if the requested mode is already active.
   * @param mode - The {@linkcode UiMode} to switch to.
   * @param args - Parameters for the requested UiMode's handler 'show' function
   * @returns Promise that resolves once the mode is set.
   */
  public setModeForceTransition<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, true, true, false, ...args);
  }

  /**
   * Change the current ui mode, without clearing the current handler.
   * This should be used carefully as it means the previous handler will not be cleared from memory.
   * @param mode - The {@linkcode UiMode} to switch to.
   * @param args - Parameters for the requested UiMode's handler 'show' function
   * @returns Promise that resolves once the mode is set.
   */
  public setModeWithoutClear<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, false, false, false, ...args);
  }

  /**
   * Change the current ui mode, showing the new mode handler above the current one, which is added to the mode chain.
   * Modes set in this way should be stopped through {@linkcode revertMode}, which will restore the previous mode.
   * @param mode - The {@linkcode UiMode} to switch to.
   * @param args - Parameters for the requested UiMode's handler 'show' function
   * @returns Promise that resolves once the mode is set.
   */
  public setOverlayMode<THandler extends UiHandler = never>(
    mode: UiMode,
    ...args: Parameters<THandler["show"]>
  ): Promise<void> {
    return this.setModeInternal<THandler>(mode, false, false, true, ...args);
  }

  /**
   * Change the current Ui Mode, clearing and destroying previous handlers if needed.
   * By default doesn't do anything if the requested mode is already active, but can be forced.
   * If not already initialized, create the UiHandler for this mode, then displays it,
   * playing a transition animation or not, depending on the source and target mode.
   *
   * @param mode - The {@linkcode UiMode} to switch to.
   * @param clear - Whether the clear the handler for the current mode.
   * @param forceTransition - Whether to force the switch to happen, even if the mode is the same as before.
   * @param chainMode - Whether to add the current mode to the mode chain, to be able to revert back to it.
   * @param params - Parameters for the requested UiMode's handler 'show' function.
   * @returns Promise that resolves once the mode is set.
   */
  private setModeInternal<THandler extends UiHandler = never>(
    mode: UiMode,
    clear: boolean,
    forceTransition: boolean,
    chainMode: boolean,
    ...params: Parameters<THandler["show"]>
  ): Promise<void> {
    logUiDebug(
      `Set ${UiMode[mode]} (${mode}) Mode${chainMode ? " as overlay" : ""}`,
      `(${clear ? "" : "not "}clearing ${UiMode[this.mode]})`,
    );
    return new Promise((resolve) => {
      if (this.mode === mode && !forceTransition) {
        resolve();
        return;
      }
      const doSetMode = () => {
        if (this.mode !== mode) {
          if (clear && this.getCurrentHandler().active) {
            this.stopCurrentHandler(mode);
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
          this.getUiHandler(mode).start(...params);
          // Arriving on title screen, remove login handlers from memory
          if (mode === UiMode.TITLE) {
            this.deleteUiHandlers(UiMode.LOGIN_FORM, UiMode.REGISTRATION_FORM);
          }
        } else if (!this.getCurrentHandler().active) {
          this.getUiHandler(mode).start(...params);
        }
        resolve();
      };

      if (
        (!chainMode
          && (transitionModes.includes(this.mode) || transitionModes.includes(mode))
          && !noTransitionModes.includes(this.mode)
          && !noTransitionModes.includes(mode))
        || (chainMode && !noTransitionModes.includes(mode))
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

  /**
   * Revert back to the previous mode in the mode chain and clears the current handler.
   * Should only be called if the current mode was set through {@linkcode setOverlayMode}.
   *
   * @returns Promise returning `true` if the mode was reverted, `false` if not (because the mode chain was empty).
   */
  public revertMode(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!this?.modeChain?.length) {
        return resolve(false);
      }

      const lastMode = this.mode;

      const doRevertMode = () => {
        const newMode = this.modeChain.pop()!;
        this.stopCurrentHandler(newMode);
        this.mode = newMode;
        globalScene.updateGameInfo();
        logUiDebug(`Set ${UiMode[this.mode]} (${this.mode}) Mode (reverting from ${UiMode[lastMode]})`);
        const touchControls = document.getElementById("touchControls");
        if (touchControls) {
          touchControls.dataset.uiMode = UiMode[this.mode];
        }
        resolve(true);
      };

      if (noTransitionModes.includes(lastMode)) {
        doRevertMode();
      } else {
        this.fadeOut(250).then(() => {
          globalScene.time.delayedCall(100, () => {
            doRevertMode();
            this.fadeIn(250);
          });
        });
      }
    });
  }

  /**
   * Stop the current Ui Handler, potentially destroying it to free it from memory.
   * If the stopped handler was the menu handler, destroy all handlers that depended on it.
   * If the stopped handler was part of the settings and we not switching to another settings handler,
   * destroy all settings handlers
   * @param nextMode if applicable, which Ui Mode will replace the current one.
   */
  private stopCurrentHandler(nextMode?: UiMode) {
    this.getCurrentHandler().stop();
    if (alwaysDestroyModes.includes(this.mode)) {
      this.deleteUiHandlers(this.mode);
    } else if (this.mode === UiMode.MENU) {
      // When stopping the menu destroy all handlers that depend on it
      this.deleteUiHandlers(...mainMenuAccessedModes);
    } else if (nextMode && settingsUiModes.includes(this.mode) && !settingsUiModes.includes(nextMode)) {
      // When existing the settings, clear the settings navigation menu and destroy all settings-related handlers
      SettingsNavigationManager.getInstance().clearMenus();
      this.deleteUiHandlers(...settingsUiModes);
    }
  }

  /**
   * Revert through all the modes currently in the mode chain.
   * @returns Promise that resolves when the mode chain is empty.
   */
  public revertModes(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this?.modeChain?.length) {
        return resolve();
      }
      this.revertMode().then((success) => executeIf(success, this.revertModes).then(() => resolve()));
    });
  }

  /**
   * @returns the array of {@linkcode UiMode}s currently in the modeChain, with the oldest mode first.
   */
  public getModeChain(): UiMode[] {
    return this.modeChain;
  }

  /**
   * getGamepadType - returns the type of gamepad being used
   * inputMethod could be "keyboard" or "touch" or "gamepad"
   * if inputMethod is "keyboard" or "touch", then the inputMethod is returned
   * if inputMethod is "gamepad", then the gamepad type is returned it could be "xbox" or "dualshock"
   * @returns gamepad type
   * @todo why is this here?
   */
  public getGamepadType(): string {
    if (globalScene.inputMethod === "gamepad") {
      return globalScene.inputController.getActiveConfig(Device.GAMEPAD)?.padType ?? globalScene.inputMethod;
    }
    return globalScene.inputMethod;
  }
}
