import type { SettingsCategory, SettingsUiItem } from "#app/@types/Settings";
import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { settings as settingsManager } from "#app/system/settings/settings-manager";
import MessageUiHandler from "#app/ui/message-ui-handler";
import { ScrollBar } from "#app/ui/scroll-bar";
import type { InputsIcons } from "#app/ui/settings/abstract-control-settings-ui-handler";
import NavigationMenu, { NavigationManager } from "#app/ui/settings/navigationMenu";
import { TextStyle, addTextObject } from "#app/ui/text";
import { Mode } from "#app/ui/ui";
import { addWindow } from "#app/ui/ui-theme";
import { capitalize, hasTouchscreen } from "#app/utils";
import { Button } from "#enums/buttons";
import i18next from "i18next";

/**
 * Abstract class for handling UI elements related to settings.
 */
export default class AbstractSettingsUiHandler extends MessageUiHandler {
  private settingsContainer: Phaser.GameObjects.Container;
  private optionsContainer: Phaser.GameObjects.Container;
  private messageBoxContainer: Phaser.GameObjects.Container;
  private navigationContainer: NavigationMenu;

  private scrollCursor: number;
  private scrollBar: ScrollBar;

  private optionsBg: Phaser.GameObjects.NineSlice;

  private optionCursors: number[];

  private settingLabels: Phaser.GameObjects.Text[];
  private optionValueLabels: Phaser.GameObjects.Text[][];

  protected navigationIcons: InputsIcons;

  private cursorObj: Phaser.GameObjects.NineSlice | null;

  private reloadRequired: boolean;

  protected rowsToDisplay: number;
  protected title: string;

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

    this.category = category;

    this.reloadRequired = false;
    this.rowsToDisplay = 8;
    this.title = capitalize(category);
  }

  /**
   * Setup UI elements
   */
  setup() {
    const ui = this.getUi();

    this.settingsContainer = globalScene.add.container(1, -(globalScene.game.canvas.height / 6) + 1);
    this.settingsContainer.setName(`settings-${this.title}`);
    this.settingsContainer.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, globalScene.game.canvas.width / 6, globalScene.game.canvas.height / 6 - 20),
      Phaser.Geom.Rectangle.Contains,
    );

    this.navigationIcons = {};

    this.navigationContainer = new NavigationMenu(0, 0);

    this.optionsBg = addWindow(
      0,
      this.navigationContainer.height,
      globalScene.game.canvas.width / 6 - 2,
      globalScene.game.canvas.height / 6 - 16 - this.navigationContainer.height - 2,
    );
    this.optionsBg.setName("window-options-bg");
    this.optionsBg.setOrigin(0, 0);

    const actionsBg = addWindow(
      0,
      globalScene.game.canvas.height / 6 - this.navigationContainer.height,
      globalScene.game.canvas.width / 6 - 2,
      22,
    );
    actionsBg.setOrigin(0, 0);

    const iconAction = globalScene.add.sprite(0, 0, "keyboard");
    iconAction.setOrigin(0, -0.1);
    iconAction.setPositionRelative(actionsBg, this.navigationContainer.width - 32, 4);
    this.navigationIcons["BUTTON_ACTION"] = iconAction;

    const actionText = addTextObject(0, 0, i18next.t("settings:action"), TextStyle.SETTINGS_LABEL);
    actionText.setOrigin(0, 0.15);
    actionText.setPositionRelative(iconAction, -actionText.width / 6 - 2, 0);

    const iconCancel = globalScene.add.sprite(0, 0, "keyboard");
    iconCancel.setOrigin(0, -0.1);
    iconCancel.setPositionRelative(actionsBg, this.navigationContainer.width - 100, 4);
    this.navigationIcons["BUTTON_CANCEL"] = iconCancel;

    const cancelText = addTextObject(0, 0, i18next.t("settings:back"), TextStyle.SETTINGS_LABEL);
    cancelText.setOrigin(0, 0.15);
    cancelText.setPositionRelative(iconCancel, -cancelText.width / 6 - 2, 0);

    const requiresReloadInfoText = addTextObject(
      0,
      0,
      `*: ${i18next.t("settings:requireReload")}`,
      TextStyle.SUMMARY_GRAY,
      {
        fontSize: "5rem",
      },
    );
    requiresReloadInfoText.setOrigin(0, 0.35);
    requiresReloadInfoText.setPositionRelative(actionsBg, 10, 10);

    this.optionsContainer = globalScene.add.container(0, 0);

    this.settingLabels = [];
    this.optionValueLabels = [];

    this.uiItems.forEach((uiItem, i) => {
      let settingName = uiItem.label;
      if (uiItem?.requiresReload) {
        settingName += "*";
      }

      this.settingLabels[i] = addTextObject(8, 28 + i * 16, settingName, TextStyle.SETTINGS_LABEL);
      this.settingLabels[i].setOrigin(0, 0);

      this.optionsContainer.add(this.settingLabels[i]);
      this.optionValueLabels.push(
        uiItem.options.map((option) => {
          const valueLabel = addTextObject(
            0,
            0,
            option.label,
            option.value === settingsManager[this.category][uiItem.key]
              ? TextStyle.SETTINGS_SELECTED
              : TextStyle.SETTINGS_VALUE,
          );
          valueLabel.setOrigin(0, 0);

          this.optionsContainer.add(valueLabel);

          return valueLabel;
        }),
      );

      const totalWidth = this.optionValueLabels[i].map((o) => o.width).reduce((total, width) => (total += width), 0);

      const labelWidth = Math.max(78, this.settingLabels[i].displayWidth + 8);

      const totalSpace = 297 - labelWidth - totalWidth / 6;
      const optionSpacing = Math.floor(totalSpace / (this.optionValueLabels[i].length - 1));

      let xOffset = 0;

      for (const value of this.optionValueLabels[i]) {
        value.setPositionRelative(this.settingLabels[i], labelWidth + xOffset, 0);
        xOffset += value.width / 6 + optionSpacing;
      }
    });

    this.optionCursors = this.uiItems.map((uiItem) => {
      const value = settingsManager[this.category][uiItem.key];
      let index = 0;

      if (value !== undefined) {
        index = uiItem.options.findIndex((o) => {
          return o.value === value;
        });
      }

      if (index < 0) {
        console.warn(
          `Could not find index for ${uiItem.key}.`,
          `\nExpected value: ${settingsManager[this.category][uiItem.key]}`,
          `\nAvailable values:`,
          uiItem.options,
        );
      }
      return Math.max(index, 0);
    });

    this.scrollBar = new ScrollBar(
      this.optionsBg.width - 9,
      this.optionsBg.y + 5,
      4,
      this.optionsBg.height - 11,
      this.rowsToDisplay,
    );
    this.scrollBar.setTotalRows(this.uiItems.length);

    // Two-lines message box
    this.messageBoxContainer = globalScene.add.container(0, globalScene.scaledCanvas.height);
    this.messageBoxContainer.setName("settings-message-box");
    this.messageBoxContainer.setVisible(false);

    const settingsMessageBox = addWindow(0, -1, globalScene.scaledCanvas.width - 2, 48);
    settingsMessageBox.setOrigin(0, 1);
    this.messageBoxContainer.add(settingsMessageBox);

    const messageText = addTextObject(8, -40, "", TextStyle.WINDOW, { maxLines: 2 });
    messageText.setWordWrapWidth(globalScene.game.canvas.width - 60);
    messageText.setName("settings-message");
    messageText.setOrigin(0, 0);

    this.messageBoxContainer.add(messageText);
    this.message = messageText;

    this.settingsContainer.add(this.optionsBg);
    this.settingsContainer.add(this.scrollBar);
    this.settingsContainer.add(this.navigationContainer);
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
  /**
   * Update the bindings for the current active device configuration.
   */
  updateBindings(): void {
    for (const settingName of Object.keys(this.navigationIcons)) {
      if (settingName === "BUTTON_HOME") {
        this.navigationIcons[settingName].setTexture("keyboard");
        this.navigationIcons[settingName].setFrame("HOME.png");
        this.navigationIcons[settingName].alpha = 1;
        continue;
      }
      const icon = globalScene.inputController?.getIconForLatestInputRecorded(settingName);
      if (icon) {
        const type = globalScene.inputController?.getLastSourceType();
        this.navigationIcons[settingName].setTexture(type);
        this.navigationIcons[settingName].setFrame(icon);
        this.navigationIcons[settingName].alpha = 1;
      } else {
        this.navigationIcons[settingName].alpha = 0;
      }
    }
    NavigationManager.getInstance().updateIcons();
  }

  /**
   * Show the UI with the provided arguments.
   *
   * @param args - Arguments to be passed to the show method.
   * @returns `true` if successful.
   */
  override show(args: any[]): boolean {
    super.show(args);
    this.updateBindings();

    this.uiItems.forEach((uiItem, s) => {
      const value = settingsManager.settings[this.category][uiItem.key];
      let index = 0;

      if (value !== undefined) {
        index = uiItem.options.findIndex((option) => option.value === value);
      }

      if (index < 0) {
        console.warn(
          `Could not find index for ${uiItem.key}.`,
          `\nExpected value: ${settingsManager[this.category][uiItem.key]}`,
          `\nAvailable values:`,
          uiItem.options,
        );
      }
      this.setOptionCursor(s, index > 0 ? index : 0);
    });

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
  processInput(button: Button): boolean {
    const ui = this.getUi();
    // Defines the maximum number of rows that can be displayed on the screen.

    let success = false;

    /**
     * Checks if the game is in a state where progress may be lost due to changes options with reloadRequired while at battle.
     * @returns `false` if the warning process is triggered, `true` otherwise.
     */
    if (button === Button.CANCEL) {
      success = true;
      NavigationManager.getInstance().reset();
      globalScene.ui.revertMode();
    } else {
      const cursor = this.cursor + this.scrollCursor;
      switch (button) {
        case Button.UP:
          if (cursor) {
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
            const successB = this.setScrollCursor(this.optionValueLabels.length - this.rowsToDisplay);
            success = successA || successB; // success is just there to play the little validation sound effect
          }
          break;
        case Button.DOWN:
          if (cursor < this.optionValueLabels.length - 1) {
            if (this.cursor < this.rowsToDisplay - 1) {
              // if the visual cursor is in the frame of 0 to 8
              success = this.setCursor(this.cursor + 1);
            } else if (this.scrollCursor < this.optionValueLabels.length - this.rowsToDisplay) {
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
          if (this.optionCursors[cursor]) {
            // Moves the option cursor left, if possible.
            success = this.setOptionCursor(cursor, this.optionCursors[cursor] - 1, true);
          }
          break;
        case Button.RIGHT:
          // Moves the option cursor right, if possible.
          if (this.optionCursors[cursor] < this.optionValueLabels[cursor].length - 1) {
            success = this.setOptionCursor(cursor, this.optionCursors[cursor] + 1, true);
          }
          break;
        case Button.CYCLE_FORM:
        case Button.CYCLE_SHINY:
          success = this.navigationContainer.navigate(button);
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
  override setCursor(cursor: number): boolean {
    const ret = super.setCursor(cursor);

    if (!this.cursorObj) {
      const cursorWidth = globalScene.game.canvas.width / 6 - (this.scrollBar.visible ? 16 : 10);
      this.cursorObj = globalScene.add.nineslice(0, 0, "summary_moves_cursor", undefined, cursorWidth, 16, 1, 1, 1, 1);
      this.cursorObj.setOrigin(0, 0);
      this.optionsContainer.add(this.cursorObj);
    }

    this.cursorObj.setPositionRelative(this.optionsBg, 4, 4 + (this.cursor + this.scrollCursor) * 16);

    return ret;
  }

  /**
   * Set the option cursor to the specified position.
   *
   * @param settingIndex - The index of the setting or -1 to change the current setting
   * @param cursor - The cursor position to set.
   * @param save - Whether to save the setting to local storage.
   * @returns `true` if the option cursor was set successfully.
   */
  setOptionCursor(settingIndex: number, cursor: number, save?: boolean): boolean {
    if (settingIndex === -1) {
      settingIndex = this.cursor + this.scrollCursor;
    }
    const uiItem = this.uiItems[settingIndex];

    const lastCursor = this.optionCursors[settingIndex];

    const lastValueLabel = this.optionValueLabels[settingIndex][lastCursor];
    if (lastValueLabel) {
      lastValueLabel.setColor(this.getTextColor(TextStyle.SETTINGS_VALUE));
      lastValueLabel.setShadowColor(this.getTextColor(TextStyle.SETTINGS_VALUE, true));
    } else {
      console.warn(
        "Could no determine lastValue label for ",
        uiItem.key,
        settingIndex,
        lastCursor,
        this.optionValueLabels[settingIndex].map((l) => l.text),
      );
    }

    this.optionCursors[settingIndex] = cursor;

    const newValueLabel = this.optionValueLabels[settingIndex][cursor];
    if (newValueLabel) {
      newValueLabel.setColor(this.getTextColor(TextStyle.SETTINGS_SELECTED));
      newValueLabel.setShadowColor(this.getTextColor(TextStyle.SETTINGS_SELECTED, true));
    } else {
      console.warn(
        "Could no determine newValueLabel label for ",
        uiItem.key,
        settingIndex,
        cursor,
        this.optionValueLabels[settingIndex].map((l) => l.text),
      );
    }

    if (save) {
      const value = uiItem.options[cursor].value;
      // For settings that ask for confirmation, display confirmation message and a Yes/No prompt before saving the setting
      if (uiItem.options[cursor]?.needConfirmation) {
        const confirmUpdateSetting = () => {
          globalScene.ui.revertMode();
          this.showText("");
          this.handleSaveSetting(uiItem, value);
        };
        const cancelUpdateSetting = () => {
          globalScene.ui.revertMode();
          this.showText("");
          // Put the cursor back to its previous position without saving or asking for confirmation again
          this.setOptionCursor(settingIndex, lastCursor, false);
        };

        const confirmationMessage =
          uiItem.options[cursor].confirmationMessage ?? i18next.t("settings:defaultConfirmMessage");
        globalScene.ui.showText(confirmationMessage, null, () => {
          globalScene.ui.setOverlayMode(Mode.CONFIRM, confirmUpdateSetting, cancelUpdateSetting, null, null, 1, 750);
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
  setScrollCursor(scrollCursor: number): boolean {
    if (scrollCursor === this.scrollCursor) {
      return false;
    }

    this.scrollCursor = scrollCursor;
    this.scrollBar.setScrollCursor(this.scrollCursor);

    this.updateSettingsScroll();

    this.setCursor(this.cursor);

    return true;
  }

  /**
   * Update the scroll position of the settings UI.
   */
  updateSettingsScroll(): void {
    this.optionsContainer.setY(-16 * this.scrollCursor);

    for (let s = 0; s < this.settingLabels.length; s++) {
      const visible = s >= this.scrollCursor && s < this.scrollCursor + this.rowsToDisplay;
      this.settingLabels[s].setVisible(visible);
      for (const option of this.optionValueLabels[s]) {
        option.setVisible(visible);
      }
    }
  }

  /**
   * Clear the UI elements and state.
   */
  override clear() {
    super.clear();
    this.settingsContainer.setVisible(false);
    this.setScrollCursor(0);
    this.eraseCursor();
    this.getUi().bgmBar.toggleBgmBar(settingsManager.display.showBgmBar);
    if (this.reloadRequired) {
      this.reloadRequired = false;
      globalScene.reset(true, false, true);
    }
  }

  /**
   * Erase the cursor from the UI.
   */
  eraseCursor() {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }

  override showText(
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
      } else if (this.category === "general" && key === "enableTouchControls" && newValue === false) {
        this.showConfirm(
          i18next.t("settings:confirmDisableTouch"),
          () => settingsManager.update(this.category, key as never, newValue),
          () => this.handleCancelConfirm(uiItem),
        );
      } else {
        settingsManager.update(this.category, key as never, newValue);
      }
    }
  }

  protected canLoseProgress() {
    return globalScene.currentBattle && globalScene.currentBattle.turn > 1;
  }

  protected showConfirm(text: string, onConfirm: () => void, onCancel?: () => void) {
    this.showText(text, undefined, () => {
      globalScene.ui.setOverlayMode(
        Mode.CONFIRM,
        () => {
          NavigationManager.getInstance().reset();
          // revert confirm mode.
          globalScene.ui.revertMode();
          // revert settings mode.
          globalScene.ui.revertMode();
          this.showText("", 0);
          onConfirm();
        },
        () => {
          globalScene.ui.revertMode();
          this.showText("", 0);
          onCancel && onCancel();
        },
        false,
        0,
        0,
      );
    });
  }

  protected handleCancelConfirm(uiItem: SettingsUiItem) {
    const { options } = uiItem;

    const oldValue = settingsManager.settings[this.category][uiItem.key];
    const oldOptionIndex = options.findIndex((option) => option.value === oldValue);
    this.setOptionCursor(-1, Math.max(oldOptionIndex, 0), false);
  }
}
