import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import { Button } from "#enums/button";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { settings as settingsManager } from "#system/settings-manager";
import type { SettingsCategory, SettingsUiItem } from "#types/settings";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import type { InputsIcons } from "#ui/controls-settings-ui-handler";
import { MessageUiHandler } from "#ui/message-ui-handler";
import { SettingsNavigationManager } from "#ui/settings-navigation-manager";
import { ScrollBar } from "#ui/scroll-bar";
import { TextListContainer } from "#ui/text-list-container";
import { addTextObject, setTextColor } from "#ui/text-utils";
import { addWindow } from "#ui/ui-theme";
import { hasTouchscreen } from "#utils/app-utils";
import { isNil } from "#utils/common-utils";
import { capitalizeFirstLetter } from "#utils/string-utils";
import i18next from "i18next";

/**
 * Abstract class for handling UI elements related to settings.
 */
export abstract class SettingsUiHandler extends MessageUiHandler {
  private settingsContainer: Phaser.GameObjects.Container;
  private optionsContainer: Phaser.GameObjects.Container;
  private messageBoxContainer: Phaser.GameObjects.Container;

  private scrollCursor: number;
  private scrollBar: ScrollBar;

  private optionsBg: Phaser.GameObjects.NineSlice;

  /** The currently selected options for all settings. */
  private optionCursors: number[];

  /** The computed horizontal positionning of the options for all settings. */
  private settingValuesPosition: number[][];

  /** Container for all settings labels in a single TextObject. */
  private labelsTextList: TextListContainer;
  /**
   * The Text objects used to display each setting's options, for up to the maximum number of rows.
   * The text objects get recycled and reused when scrolling around the settings.
   */
  private optionValueLabels: Phaser.GameObjects.Text[][];

  private navigationIcons: InputsIcons;

  private cursorObj: Phaser.GameObjects.NineSlice | null;

  private reloadRequired: boolean;

  protected rowsToDisplay: number;

  protected uiItems: SettingsUiItem[];
  protected category: SettingsCategory;

  constructor(category: SettingsCategory, uiItems: SettingsUiItem[]) {
    super(null);
    this.category = category;

    if (!hasTouchscreen()) {
      this.uiItems = uiItems.filter((uiItem) => !uiItem.touchscreenOnly);
    } else {
      this.uiItems = uiItems;
    }
    this.rowsToDisplay = Math.min(8, this.uiItems.length);

    this.reloadRequired = false;

    this.settingValuesPosition = [];
  }

  /**
   * Setup UI elements
   */
  protected override setup() {
    const ui = this.getUi();

    this.settingsContainer = globalScene.add.container(1, -GAME_HEIGHT + 1);
    this.settingsContainer.setName(`settings-${capitalizeFirstLetter(this.category)}`);

    this.navigationIcons = {};

    const navigationContainer = SettingsNavigationManager.getInstance().addMenu(0, 0);

    this.optionsBg = addWindow(
      0,
      navigationContainer.height,
      GAME_WIDTH - 2,
      GAME_HEIGHT - 16 - navigationContainer.height - 2,
    );
    this.optionsBg.setName("window-options-bg");
    this.optionsBg.setOrigin(0, 0);

    const actionsBg = addWindow(0, GAME_HEIGHT - navigationContainer.height, GAME_WIDTH - 2, 22);
    actionsBg.setOrigin(0, 0);

    const iconAction = globalScene.add.sprite(0, 0, "keyboard");
    iconAction.setOrigin(0, -0.1);
    iconAction.setPositionRelative(actionsBg, navigationContainer.width - 32, 4);
    this.navigationIcons["BUTTON_ACTION"] = iconAction;

    const actionText = addTextObject(0, 0, i18next.t("settings:action"), TextStyle.SETTINGS_LABEL);
    actionText.setOrigin(0, 0.15);
    actionText.setPositionRelative(iconAction, -actionText.displayWidth - 2, 0);

    const iconCancel = globalScene.add.sprite(0, 0, "keyboard");
    iconCancel.setOrigin(0, -0.1);
    iconCancel.setPositionRelative(actionsBg, navigationContainer.width - 100, 4);
    this.navigationIcons["BUTTON_CANCEL"] = iconCancel;

    const cancelText = addTextObject(0, 0, i18next.t("settings:back"), TextStyle.SETTINGS_LABEL);
    cancelText.setOrigin(0, 0.15);
    cancelText.setPositionRelative(iconCancel, -cancelText.displayWidth - 2, 0);

    const requiresReloadInfoText = addTextObject(
      0,
      0,
      `*: ${i18next.t("settings:requireReload")}`,
      TextStyle.SETTINGS_LOCKED,
    );
    requiresReloadInfoText.setOrigin(0, 0.15);
    requiresReloadInfoText.setPositionRelative(actionsBg, 5, 5);

    this.optionsContainer = globalScene.add.container(0, 0);

    // Initialize the settings labels text object
    const settingLabels: string[] = [];
    this.uiItems.forEach((uiItem) => {
      let settingName = uiItem.label;
      if (uiItem?.requiresReload) {
        settingName += "*";
      }
      settingLabels.push(settingName);
    });
    this.labelsTextList = new TextListContainer(8, 28, TextStyle.SETTINGS_LABEL, this.rowsToDisplay);
    this.labelsTextList.setList(settingLabels, true);
    this.optionsContainer.add(this.labelsTextList);

    // Initialize text objects for the settings options
    this.optionValueLabels = [];
    for (let i = 0; i < this.rowsToDisplay; i++) {
      const yPosition = 28 + i * 16;
      // By default, create 2 textObjects for each setting. More will be added as needed when navigating the UI.
      this.optionValueLabels[i] = [
        addTextObject(100, yPosition, "", TextStyle.SETTINGS_VALUE).setOrigin(0, 0),
        addTextObject(100, yPosition, "", TextStyle.SETTINGS_VALUE).setOrigin(0, 0),
      ];
      this.optionsContainer.add(this.optionValueLabels[i]);
    }

    // Treat all settings as having the first options selected. These get properly updated in show()
    this.optionCursors = new Array(this.rowsToDisplay).fill(0);

    this.scrollBar = new ScrollBar(
      this.optionsBg.width - 9,
      this.optionsBg.y + 5,
      4,
      this.optionsBg.height - 11,
      this.rowsToDisplay,
    );
    this.scrollBar.setTotalRows(this.uiItems.length);

    // Two-lines message box
    this.messageBoxContainer = globalScene.add.container(0, GAME_HEIGHT);
    this.messageBoxContainer.setName("settings-message-box");
    this.messageBoxContainer.setVisible(false);

    const settingsMessageBox = addWindow(0, -1, GAME_WIDTH - 2, 48);
    settingsMessageBox.setOrigin(0, 1);
    this.messageBoxContainer.add(settingsMessageBox);

    const messageText = addTextObject(8, -40, "", TextStyle.WINDOW, { maxLines: 2 });
    messageText.setWordWrapWidth((GAME_WIDTH - 10) * TEXT_SCALE);
    messageText.setName("settings-message");
    messageText.setOrigin(0, 0);

    this.messageBoxContainer.add(messageText);
    this.message = messageText;

    this.settingsContainer.add(this.optionsBg);
    this.settingsContainer.add(this.scrollBar);
    this.settingsContainer.add(navigationContainer);
    this.settingsContainer.add(actionsBg);
    this.settingsContainer.add(this.optionsContainer);
    this.settingsContainer.add(iconAction);
    this.settingsContainer.add(iconCancel);
    this.settingsContainer.add(actionText);
    this.settingsContainer.add(cancelText);
    this.settingsContainer.add(requiresReloadInfoText);
    this.settingsContainer.add(this.messageBoxContainer);

    ui.add(this.settingsContainer);

    this.setCursor(0);
    this.setScrollCursor(0);

    this.settingsContainer.setVisible(false);
  }

  protected override tearDown(): void {
    this.settingsContainer.destroy();
  }

  /**
   * Update the bindings for the current active device configuration.
   */
  private updateNavigationIcons(): void {
    for (const settingName of Object.keys(this.navigationIcons)) {
      if (settingName === "BUTTON_HOME") {
        this.navigationIcons[settingName].setTexture("keyboard", "HOME.png");
        this.navigationIcons[settingName].alpha = 1;
        continue;
      }
      const icon = globalScene.inputController?.getIconForLatestInputRecorded(settingName);
      if (icon) {
        const type = globalScene.inputController?.getLastSourceType();
        this.navigationIcons[settingName].setTexture(type, icon);
        this.navigationIcons[settingName].alpha = 1;
      } else {
        this.navigationIcons[settingName].alpha = 0;
      }
    }
    SettingsNavigationManager.getInstance().updateIcons();
  }

  /**
   * Show the UI with the provided arguments.
   *
   * @returns `true` if successful.
   */
  public override show(): boolean {
    this.updateNavigationIcons();

    this.settingsContainer.setVisible(true);
    this.setCursor(0);
    this.setScrollCursor(0);

    this.getUi().moveTo(this.settingsContainer, this.getUi().length - 1);

    this.getUi().hideTooltip();

    return true;
  }

  /**
   * Processes input from a specified button.
   * This method handles navigation through a UI menu, including movement through menu items
   * and handling special actions like cancellation. Each button press may adjust the cursor
   * position or the menu scroll, and plays a sound effect if the action was successful.
   *
   * @param button - The button pressed by the user.
   * @returns `true` if the action associated with the button was successfully processed, `false` otherwise.
   */
  public override processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    if (button === Button.CANCEL) {
      success = true;
      SettingsNavigationManager.getInstance().reset();
      globalScene.ui.revertMode();
    } else {
      const { Wrap } = Phaser.Math;
      const settingIndex = this.cursor + this.scrollCursor;
      const optionCursor = this.optionCursors[this.cursor];
      const optionLabels = this.optionValueLabels[this.cursor];
      const maxOptionCursor = optionLabels.length;
      const uiItem = this.uiItems[settingIndex];

      switch (button) {
        case Button.UP:
          if (settingIndex) {
            if (this.cursor) {
              success = this.setCursor(this.cursor - 1);
            } else {
              success = this.setScrollCursor(this.scrollCursor - 1);
            }
          } else {
            // When at the top of the menu and pressing UP, move to the bottommost item.
            // First, set the cursor to the last visible element, preparing for the scroll to the end.
            const successA = this.setCursor(this.rowsToDisplay - 1);
            // Then, adjust the scroll to display the bottommost elements of the menu.
            const successB = this.setScrollCursor(this.uiItems.length - this.rowsToDisplay);
            success = successA || successB; // success is just there to play the little validation sound effect
          }
          break;
        case Button.DOWN:
          if (settingIndex < this.uiItems.length - 1) {
            if (this.cursor < this.rowsToDisplay - 1) {
              // if the visual cursor is in the frame of 0 to 8
              success = this.setCursor(this.cursor + 1);
            } else if (this.scrollCursor < this.uiItems.length - this.rowsToDisplay) {
              success = this.setScrollCursor(this.scrollCursor + 1);
            }
          } else {
            // When at the bottom of the menu and pressing DOWN, move to the topmost item.
            // First, set the cursor to the first visible element, resetting the scroll to the top.
            const successA = this.setCursor(0);
            // Then, reset the scroll to start from the first element of the menu.
            const successB = this.setScrollCursor(0);
            success = successA || successB; // Indicates a successful cursor and scroll adjustment.
          }
          break;
        case Button.LEFT:
          if (!isNil(optionCursor)) {
            // Moves the option cursor left (wrapping)
            if (uiItem.doWrap) {
              success = this.setOptionCursor(this.cursor, Wrap(optionCursor - 1, 0, maxOptionCursor), true);
            } else if (optionCursor > 0) {
              success = this.setOptionCursor(this.cursor, optionCursor - 1, true);
            }
          }
          break;
        case Button.RIGHT:
          // Moves the option cursor right (wrapping)
          if (!isNil(optionCursor)) {
            if (uiItem.doWrap) {
              success = this.setOptionCursor(this.cursor, Wrap(optionCursor + 1, 0, maxOptionCursor), true);
            } else if (optionCursor < optionLabels.length - 1) {
              success = this.setOptionCursor(this.cursor, optionCursor + 1, true);
            }
          }
          break;
        case Button.CYCLE_FORM:
        case Button.CYCLE_SHINY:
          success = SettingsNavigationManager.getInstance().processInput(button);
          break;
        case Button.ACTION:
          break;
      }
    }

    // Plays a select sound effect if an action was successfully processed.
    if (success) {
      ui.playSelect();
    }

    return success;
  }

  /**
   * Set the cursor to the specified position.
   *
   * @param cursor - The cursor position to set.
   * @returns `true` if the cursor was set successfully.
   */
  public override setCursor(cursor: number): boolean {
    const ret = super.setCursor(cursor);

    if (!this.cursorObj) {
      const cursorWidth = GAME_WIDTH - (this.scrollBar.visible ? 16 : 10);
      this.cursorObj = globalScene.add.nineslice(0, 0, "summary_moves_cursor", "select", cursorWidth, 16, 1, 1, 1, 1);
      this.cursorObj.setOrigin(0, 0);
      this.optionsContainer.add(this.cursorObj);
    }

    this.cursorObj.setPositionRelative(this.optionsBg, 4, 4 + this.cursor * 16);

    return ret;
  }

  /**
   * Set the option cursor to the specified position.
   *
   * @param settingCursor - Which setting to update, or -1 to change the currently selected setting
   * @param optionCursor - Which option to select for this setting.
   * @param save - Whether to save the setting to local storage.
   * @returns `true` if the option cursor was set successfully.
   */
  protected setOptionCursor(settingCursor: number, optionCursor: number, save?: boolean): boolean {
    if (settingCursor === -1) {
      settingCursor = this.cursor;
    }
    const uiItem = this.uiItems[settingCursor + this.scrollCursor];

    const lastCursor = this.optionCursors[settingCursor];

    const lastValueLabel = this.optionValueLabels[settingCursor][lastCursor];
    if (lastValueLabel) {
      setTextColor(lastValueLabel, TextStyle.SETTINGS_VALUE);
    } else {
      console.warn(
        "Could no determine lastValue label for ",
        uiItem.key,
        settingCursor,
        lastCursor,
        this.optionValueLabels[settingCursor].map((l) => l.text),
      );
    }

    this.optionCursors[settingCursor] = optionCursor;

    const newValueLabel = this.optionValueLabels[settingCursor][optionCursor];
    if (newValueLabel) {
      setTextColor(newValueLabel, TextStyle.SETTINGS_SELECTED);
    } else {
      console.warn(
        "Could no determine newValueLabel label for ",
        uiItem.key,
        settingCursor,
        optionCursor,
        this.optionValueLabels[settingCursor].map((l) => l.text),
      );
    }

    if (save) {
      const value = uiItem.options[optionCursor].value;
      // For settings that ask for confirmation, display confirmation message and a Yes/No prompt before saving the setting
      if (uiItem.options[optionCursor]?.requiresConfirmation) {
        const confirmUpdateSetting = () => {
          globalScene.ui.revertMode();
          this.showText("");
          this.handleSaveSetting(uiItem, value);
        };
        const cancelUpdateSetting = () => {
          globalScene.ui.revertMode();
          this.showText("");
          // Put the cursor back to its previous position without saving or asking for confirmation again
          this.setOptionCursor(settingCursor, lastCursor, false);
        };

        const confirmationMessage =
          uiItem.options[optionCursor].confirmationMessage ?? i18next.t("settings:defaultConfirmMessage");

        const confirmSettingOptions: ConfirmModeConfig = {
          yesHandler: confirmUpdateSetting,
          noHandler: cancelUpdateSetting,
          inputDelay: 750,
          canBypassInputDelay: true,
        };
        globalScene.ui.showText(confirmationMessage, null, () => {
          globalScene.ui.setOverlayMode<ConfirmUiHandler>(UiMode.CONFIRM, confirmSettingOptions);
        });
      } else {
        this.handleSaveSetting<typeof value>(uiItem, value);
      }
    }

    return true;
  }

  /**
   * Set the scroll cursor to the specified position.
   *
   * @param scrollCursor - The scroll cursor position to set.
   * @returns `true` if the scroll cursor was set successfully.
   */
  private setScrollCursor(scrollCursor: number): boolean {
    if (scrollCursor === this.scrollCursor) {
      return false;
    }

    this.scrollCursor = scrollCursor;
    this.scrollBar.setScrollCursor(this.scrollCursor);
    this.labelsTextList.setCursor(this.scrollCursor);

    this.displaySettingsOptions();

    this.setCursor(this.cursor);

    return true;
  }

  /**
   * Update the scroll position of the settings UI.
   */
  private displaySettingsOptions(): void {
    let tempTextObject: Phaser.GameObjects.Text | null = null;

    for (let i = 0; i < this.rowsToDisplay; i++) {
      const uiItem = this.uiItems[i + this.scrollCursor];
      const optionText = this.optionValueLabels[i];

      // If needed, create more text objects for this setting's options
      const yPosition = 28 + i * 16;
      for (let j = optionText.length; j < uiItem.options.length; j++) {
        const value = addTextObject(100, yPosition, "", TextStyle.SETTINGS_VALUE).setOrigin(0, 0);
        this.optionsContainer.add(value);
        optionText.push(value);
      }

      // Set text for each option
      for (let j = 0; j < optionText.length; j++) {
        if (j < uiItem.options.length) {
          optionText[j].setText(uiItem.options[j].label);
          optionText[j].setVisible(true);

          // By default, mark as unselected
          setTextColor(optionText[j], TextStyle.SETTINGS_VALUE);
        } else {
          optionText[j].setVisible(false);
        }
      }

      // If needed, compute the horizontal position of each option
      if (isNil(this.settingValuesPosition[i + this.scrollCursor])) {
        const positions: number[] = [];
        const totalWidth = optionText.map((o) => o.displayWidth).reduce((total, width) => (total += width), 0);
        if (!tempTextObject) {
          tempTextObject = addTextObject(0, 0, "", TextStyle.SETTINGS_LABEL);
        }
        tempTextObject.setText(uiItem.label + (uiItem.requiresReload ? "*" : ""));
        const labelWidth = Math.max(78, tempTextObject.displayWidth + 8);
        const totalSpace = 297 - labelWidth - totalWidth;
        const optionSpacing = Math.floor(totalSpace / (this.optionValueLabels[i].length - 1));

        let xPosition = labelWidth + this.labelsTextList.x;
        for (let j = 0; j < uiItem.options.length; j++) {
          positions.push(xPosition);
          xPosition += this.optionValueLabels[i][j].displayWidth + optionSpacing;
        }
        this.settingValuesPosition[i + this.scrollCursor] = positions;
      }

      // Set position for each option
      for (let j = 0; j < optionText.length; j++) {
        optionText[j].setX(this.settingValuesPosition[i + this.scrollCursor][j]);
      }

      // Mark the correct option as selected
      const value = settingsManager[this.category][uiItem.key];
      let index = 0;
      if (value !== undefined) {
        index = uiItem.options.findIndex((option) => option.value === value);
      }
      if (index < 0) {
        console.warn(
          `Could not find index for ${uiItem.key}.`,
          `\nExpected value: ${settingsManager[this.category][uiItem.key]}`,
          "\nAvailable values:",
          uiItem.options,
        );
        index = 0;
      }
      this.setOptionCursor(i, index);
    }

    if (tempTextObject) {
      tempTextObject.destroy();
    }
  }

  /**
   * Clear the UI elements and state.
   */
  protected override clear() {
    this.settingsContainer.setVisible(false);
    this.setScrollCursor(0);
    this.eraseCursor();
    this.getUi().bgmBar.toggleBgmBar(settingsManager.display.showBgmBar);
    if (this.reloadRequired) {
      this.reloadRequired = false;
      globalScene.reset(true, false);
    }
  }

  /**
   * Erase the cursor from the UI.
   */
  private eraseCursor() {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }

  public override showText(
    text: string,
    delay?: number,
    callback?: Function,
    callbackDelay?: number,
    prompt?: boolean,
    promptDelay?: number,
  ) {
    this.messageBoxContainer.setVisible(!!text?.length);
    super.showText(text, delay, callback, callbackDelay, prompt, promptDelay);
  }

  protected updateOptionValueLabel(settingIndex: number, optionIndex: number, newLabel: string) {
    this.optionValueLabels[settingIndex][optionIndex].setText(newLabel);
  }

  private handleSaveSetting<V = any>(uiItem: SettingsUiItem, newValue: V) {
    const { key, requiresReload } = uiItem;

    if (this.category === "display" && key === "language") {
      eventBus.emit("language/change", newValue);
    } else if (this.category === "general" && uiItem.key === "moveTouchControls") {
      eventBus.emit("touchControls/move/start");
      eventBus.once("touchControls/move/end", () => {
        this.setOptionCursor(-1, 0, false);
      });
    } else {
      /* Checks if the game is in a state where progress may be lost due to options with reloadRequired while in battle.
       * TODO: Handle lost progress from non battle MEs */
      if (requiresReload) {
        if (this.canLoseProgress()) {
          this.showConfirm(
            i18next.t("menuUiHandler:losingProgressionWarning"),
            () => settingsManager.updateAndReload(this.category, key as never, newValue),
            () => this.handleCancelConfirm(uiItem),
          );
        } else {
          settingsManager.updateAndReload(this.category, key as never, newValue);
        }
      } else {
        settingsManager.update(this.category, key as never, newValue);
      }
    }
  }

  protected canLoseProgress() {
    return globalScene.currentBattle && globalScene.currentBattle.turn > 1;
  }

  protected showConfirm(text: string, onConfirm: () => void, onCancel?: () => void) {
    const config: ConfirmModeConfig = {
      yesHandler: () => {
        SettingsNavigationManager.getInstance().reset();
        // revert confirm mode.
        globalScene.ui.revertMode();
        // revert settings mode.
        globalScene.ui.revertMode();
        this.showText("", 0);
        onConfirm();
      },
      noHandler: () => {
        globalScene.ui.revertMode();
        this.showText("", 0);
        onCancel?.();
      },
    };
    this.showText(text, undefined, () => {
      globalScene.ui.setOverlayMode<ConfirmUiHandler>(UiMode.CONFIRM, config);
    });
  }

  protected handleCancelConfirm(uiItem: SettingsUiItem) {
    const { options } = uiItem;

    const oldValue = settingsManager[this.category][uiItem.key];
    const oldOptionIndex = options.findIndex((option) => option.value === oldValue);
    this.setOptionCursor(-1, Math.max(oldOptionIndex, 0), false);
  }
}
