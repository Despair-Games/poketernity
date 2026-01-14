import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import { Button } from "#enums/button";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { settings as settingsManager } from "#system/settings-manager";
import type { InputSettings } from "#types/inputs-types";
import type { SettingsCategory, SettingsUiItem } from "#types/settings";
import type { ShowTextOptions } from "#types/ui-types";
import type { ConfirmModeConfig } from "#ui/confirm-menu-config";
import type { ConfirmUiHandler } from "#ui/confirm-ui-handler";
import { MessageUiHandler } from "#ui/message-ui-handler";
import { ScrollBar } from "#ui/scroll-bar";
import { SettingsNavigationManager } from "#ui/settings-navigation-manager";
import { TextListContainer } from "#ui/text-list-container";
import { addTextObject, getBBCodeFragment, setTextColor } from "#ui/text-utils";
import { addWindow } from "#ui/ui-theme";
import { hasTouchscreen } from "#utils/app-utils";
import { capitalizeFirstLetter } from "#utils/string-utils";
import i18next from "i18next";

interface OptionLabelData {
  labels: string[];
  positions: number[];
}
interface IconWithLabel {
  sprite: Phaser.GameObjects.Sprite;
  label: Phaser.GameObjects.Text;
}

/**
 * Abstract class for handling UI elements related to settings.
 */
export abstract class SettingsUiHandler extends MessageUiHandler {
  /** Main container for the ui handler. */
  protected settingsContainer: Phaser.GameObjects.Container;
  /** Container with the setting labels, options and cursor. */
  protected optionsContainer: Phaser.GameObjects.Container;
  /** Container for instructions with button icons at the bottom of the screen. */
  private instructionsContainer: Phaser.GameObjects.Container;
  /** Container for a message box. */
  private messageBoxContainer: Phaser.GameObjects.Container;

  /** Background window of the options. */
  private optionsBg: Phaser.GameObjects.NineSlice;
  /** Sprite for the selected setting cursor. */
  private cursorObj: Phaser.GameObjects.NineSlice | null;
  /** Scrollbar at the side of the screen. */
  protected scrollBar: ScrollBar;
  /** Container for all settings labels in a single TextObject. */
  protected labelsTextList: TextListContainer;
  /** References to the Sprites for the button corresponding to each instruction. */
  protected instructionIcons: Partial<Record<InputSettings, IconWithLabel>>;
  /**
   * References to the Text objects used to display each setting's options, for up to the maximum number of rows.
   * The text objects get recycled and reused when scrolling around the settings.
   */
  private optionValueLabels: Phaser.GameObjects.Text[][];

  /** The currently selected options for all settings. */
  private optionCursors: number[];
  /** Numbers of scrolled down rows. */
  protected scrollCursor: number;
  /** Horizontal positionning and labels of the options for all settings. */
  private settingValuesData: OptionLabelData[];

  /** Maximum number of rows to show on screen. */
  protected rowsToDisplay: number;
  /** Total number of rows to display (= total number of settings). */
  protected totalRows: number;

  /** Which SettingsCategory gets updated by the handler. */
  protected category: SettingsCategory;
  /** Display information on the settings for this handler. */
  protected uiItems: SettingsUiItem[];
  /** Whether the settings labels should use a BBCodeText object. Default: `false`. */
  private readonly useBBCodeLabels: boolean;

  constructor(mode: UiMode, category: SettingsCategory, uiItems: SettingsUiItem[], useBBCodeLabels: boolean = false) {
    super(mode);
    this.category = category;

    if (hasTouchscreen()) {
      this.uiItems = uiItems;
    } else {
      this.uiItems = uiItems.filter((uiItem) => !uiItem.touchscreenOnly);
    }
    this.useBBCodeLabels = useBBCodeLabels;
    this.setTotalRows(this.uiItems.length);
  }

  protected override setup() {
    const ui = this.getUi();

    this.settingsContainer = globalScene.add.container(1, -GAME_HEIGHT + 1);
    this.settingsContainer.setName(`settings-${capitalizeFirstLetter(this.category)}`);

    this.instructionIcons = {};

    const navigationHeader = SettingsNavigationManager.getInstance().addMenu(0, 0);

    this.optionsBg = addWindow(
      0,
      navigationHeader.height,
      GAME_WIDTH - 2,
      GAME_HEIGHT - 16 - navigationHeader.height - 2,
    );
    this.optionsBg.setName("window-options-bg");
    this.optionsBg.setOrigin(0, 0);

    const actionsBg = addWindow(0, GAME_HEIGHT - navigationHeader.height, GAME_WIDTH - 2, 22);
    actionsBg.setOrigin(0, 0);

    this.instructionsContainer = globalScene.add.container(
      actionsBg.x + actionsBg.width,
      actionsBg.y + actionsBg.height / 2,
    );

    this.addInstructionText("BUTTON_ACTION", i18next.t("settings:action"));
    this.addInstructionText("BUTTON_CANCEL", i18next.t("settings:back"));

    this.optionsContainer = globalScene.add.container(0, 0);

    // Initialize the settings labels text object and option label values
    const settingValuesData: OptionLabelData[] = [];
    const settingLabels: string[] = [];
    for (const uiItem of this.uiItems) {
      let label = uiItem.label + (uiItem.requiresReload ? "*" : "");
      if (this.useBBCodeLabels) {
        label = getBBCodeFragment(label, TextStyle.SETTINGS_LABEL, true);
      }
      settingLabels.push(label);

      settingValuesData.push({
        labels: uiItem.options.map((option) => option.label),
        positions: [],
      });
    }
    this.settingValuesData = settingValuesData;
    this.labelsTextList = new TextListContainer(8, 28, TextStyle.SETTINGS_LABEL, this.rowsToDisplay, {
      useBBCode: this.useBBCodeLabels,
    });
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

    this.scrollBar = new ScrollBar(this.optionsBg.width - 9, this.optionsBg.y + 5, 4, this.optionsBg.height - 11, 8);
    this.scrollBar.setTotalRows(this.totalRows);

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
    this.settingsContainer.add(navigationHeader);
    this.settingsContainer.add(actionsBg);
    this.settingsContainer.add(this.instructionsContainer);

    // If there is at least one setting that requires reloading, add text to show that
    if (this.uiItems.some((uiItem) => uiItem.requiresReload)) {
      const requiresReloadInfoText = addTextObject(
        0,
        0,
        `*: ${i18next.t("settings:requireReload")}`,
        TextStyle.SETTINGS_LOCKED,
      );
      requiresReloadInfoText.setOrigin(0, 0.15);
      requiresReloadInfoText.setPositionRelative(actionsBg, 5, 5);
      this.settingsContainer.add(requiresReloadInfoText);
    }

    this.settingsContainer.add(this.optionsContainer);
    this.settingsContainer.add(this.messageBoxContainer);

    ui.add(this.settingsContainer);

    this.settingsContainer.setVisible(false);
  }

  protected override tearDown(): void {
    this.settingsContainer.destroy();
  }

  /**
   * Add a button and label instruction at the bottom of the screen.
   * The button sprite will depend on the last used input device and can be updated with {@linkcode updateInstructionIcons}.
   * @param buttonId - The id of the button to map. eg: `BUTTON_CANCEL`.
   * @param label - The label to display next to the button. eg: `Cancel`.
   */
  protected addInstructionText(buttonId: InputSettings | "BUTTON_HOME" | "BUTTON_DELETE", label: string) {
    let x = -5;
    if (this.instructionsContainer.length > 0) {
      const previousLabel = this.instructionsContainer.last as Phaser.GameObjects.Text;
      x = previousLabel.x - previousLabel.displayWidth - 5;
    }
    // Base the icon location on the widest icon possible
    const icon = globalScene.add.sprite(0, 0, "keyboard", "ACTION.png");
    icon.setOrigin(0, 0.5);
    icon.setX(x - icon.displayWidth);
    const text = addTextObject(icon.x - 2, 0, label, TextStyle.SETTINGS_LABEL);
    text.setOrigin(1, 0.5);
    this.instructionsContainer.add([icon, text]);

    // keep a reference to the icon so that it can be updated based on the input method
    this.instructionIcons[buttonId] = { sprite: icon, label: text };
  }

  /**
   * Update the icons for instructions at the bottom of the screen and in the navigation header
   * based on the latest used input device.
   */
  protected updateInstructionIcons(): void {
    const specialIcons = {
      BUTTON_HOME: "HOME.png",
      BUTTON_DELETE: "DEL.png",
    };
    for (const settingName of Object.keys(this.instructionIcons)) {
      const icon = this.instructionIcons[settingName].sprite;
      if (Object.keys(specialIcons).includes(settingName)) {
        icon.setTexture("keyboard", specialIcons[settingName]);
        icon.alpha = 1;
        continue;
      }
      const frame = globalScene.inputController?.getIconForLatestInputRecorded(settingName as InputSettings);
      const type = globalScene.inputController?.getLastSourceType();
      if (frame && type) {
        icon.setTexture(type, frame);
        icon.alpha = 1;
      } else {
        icon.alpha = 0;
      }
    }

    SettingsNavigationManager.getInstance().updateIcons();
  }

  public override show(): boolean {
    this.updateInstructionIcons();

    this.settingsContainer.setVisible(true);
    this.setCursor(0);
    this.setScrollCursor(0);

    this.getUi().moveTo(this.settingsContainer, this.getUi().length - 1);

    this.getUi().hideTooltip();

    eventBus.on("gamepad/init", this.updateInstructionIcons, this);

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
      // Exit the settings
      success = true;
      SettingsNavigationManager.getInstance().reset();
      globalScene.ui.revertMode();
    } else {
      const { Wrap } = Phaser.Math;
      const settingIndex = this.cursor + this.scrollCursor;
      const optionCursor = this.optionCursors[this.cursor];
      const optionLabels = this.optionValueLabels[this.cursor];
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
            const successB = this.setScrollCursor(this.totalRows - this.rowsToDisplay);
            success = successA || successB; // success is just there to play the little validation sound effect
          }
          break;
        case Button.DOWN:
          if (settingIndex < this.totalRows - 1) {
            if (this.cursor < this.rowsToDisplay - 1) {
              // if the visual cursor is in the frame of 0 to 8
              success = this.setCursor(this.cursor + 1);
            } else if (this.scrollCursor < this.totalRows - this.rowsToDisplay) {
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
          if (optionCursor != null) {
            // Moves the option cursor left (wrapping)
            if (uiItem.doWrap) {
              success = this.setOptionCursor(this.cursor, Wrap(optionCursor - 1, 0, optionLabels.length), true);
            } else if (optionCursor > 0) {
              success = this.setOptionCursor(this.cursor, optionCursor - 1, true);
            }
          }
          break;
        case Button.RIGHT:
          // Moves the option cursor right (wrapping)
          if (optionCursor != null) {
            if (uiItem.doWrap) {
              success = this.setOptionCursor(this.cursor, Wrap(optionCursor + 1, 0, optionLabels.length), true);
            } else if (optionCursor < optionLabels.length - 1) {
              success = this.setOptionCursor(this.cursor, optionCursor + 1, true);
            }
          }
          break;
        case Button.CYCLE_FORM:
        case Button.CYCLE_SHINY:
          success = SettingsNavigationManager.getInstance().processInput(button);
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
        globalScene.ui.showText(confirmationMessage, {
          callback: () => globalScene.ui.setOverlayMode<ConfirmUiHandler>(UiMode.CONFIRM, confirmSettingOptions),
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
  protected setScrollCursor(scrollCursor: number): boolean {
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
   * Set the total number of settings shown by the UI, updating the other elements of the UI like the scrollbar as needed.
   * This is useful if the handler should show extra rows not included in {@linkcode uiItems},
   * otherwise this doesn't need to be called.
   * @param rows - How many settings the ui has to handle in total.
   */
  protected setTotalRows(rows: number): void {
    this.totalRows = rows;
    this.rowsToDisplay = Math.min(8, this.totalRows);

    // Update the settings labels to show the new correct number
    if (this.labelsTextList) {
      this.labelsTextList.setMaxLines(this.rowsToDisplay, true);
    }

    // Update the status of the scrollbar and cursor size if they have already been initialized
    if (this.scrollBar) {
      const scrollBarVisibleBefore = this.scrollBar.visible;
      this.scrollBar.setTotalRows(this.totalRows);
      if (this.scrollBar.visible !== scrollBarVisibleBefore && this.cursorObj) {
        const cursorWidth = GAME_WIDTH - (this.scrollBar.visible ? 16 : 10);
        this.cursorObj.setSize(cursorWidth, 16);
      }
    }
  }

  /**
   * Display the settings and their options based on the current scrolling position.
   * Reuses existing Text objects from {@linkcode optionValueLabels}, adding more if needed.
   * If a setting is being displayed for the first time, computes the position to use for its options
   * and stores those positions for the next time.
   */
  protected displaySettingsOptions(): void {
    let tempTextObject: Phaser.GameObjects.Text | null = null;

    for (let i = 0; i < this.rowsToDisplay; i++) {
      const uiItem = this.uiItems[i + this.scrollCursor];

      // If the handler shows more rows than there are uiItems, hide the scrolled out option values
      if (uiItem == null) {
        if (i < this.uiItems.length) {
          for (const text of this.optionValueLabels[i]) {
            text.setVisible(false);
          }
        }
        continue;
      }

      // All existing text objects for the current row on screen
      const optionTextObjects = this.optionValueLabels[i];

      // If needed, create more text objects for this setting's options
      const yPosition = 28 + i * 16;
      for (let j = optionTextObjects.length; j < uiItem.options.length; j++) {
        const value = addTextObject(100, yPosition, "", TextStyle.SETTINGS_VALUE).setOrigin(0, 0);
        this.optionsContainer.add(value);
        optionTextObjects.push(value);
      }

      const optionData = this.settingValuesData[i + this.scrollCursor];

      // Set text for each option, treating them all as unselected and hiding extra Text objects not needed for this setting
      for (let j = 0; j < optionTextObjects.length; j++) {
        if (j < uiItem.options.length) {
          optionTextObjects[j].setText(optionData.labels[j] ?? uiItem.options[j]);
          optionTextObjects[j].setVisible(true);
          setTextColor(optionTextObjects[j], TextStyle.SETTINGS_VALUE);
        } else {
          optionTextObjects[j].setVisible(false);
        }
      }

      // Only work on the labels needed for the current setting
      const visibleOptionLabels = optionTextObjects.filter((o) => o.visible);

      // If needed, compute the horizontal position of each option
      if (optionData.positions.length === 0) {
        if (!tempTextObject) {
          tempTextObject = addTextObject(0, 0, "", TextStyle.SETTINGS_LABEL);
        }
        tempTextObject.setText(uiItem.label + (uiItem.requiresReload ? "*" : ""));
        this.computeLabelsPosition(tempTextObject.displayWidth, visibleOptionLabels, optionData.positions);
      }

      // Set position for each option
      for (let j = 0; j < visibleOptionLabels.length; j++) {
        visibleOptionLabels[j].setX(optionData.positions[j]);
      }

      // Mark the correct option as selected
      const value = settingsManager[this.category][uiItem.key];
      let index = 0;
      if (uiItem.overrideSelectedIndex != null) {
        index = uiItem.overrideSelectedIndex;
      } else if (value !== undefined) {
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
   * Compute the position of the options of the given uiItem and stores them for future use.
   *
   * @param labelDisplayWidth - The width needed for the setting's label.
   * @param labels - Array of Text objects for all options of this setting.
   * @param positions - Array to edit with the computed positions of each label.
   */
  computeLabelsPosition(labelDisplayWidth: number, labels: Phaser.GameObjects.Text[], positions: number[]): void {
    // width needed for all option values, without space between them
    const totalWidth = labels.map((o) => o.displayWidth).reduce((total, width) => total + width, 0);

    const labelWidth = Math.max(78, labelDisplayWidth + 8);

    // Attempt to align the options starting at 40% of the screen, and if not possible extend to 50%/30%
    // If none of these fit, the placement will use all available space
    let labelsOffset = 0;
    for (const ratio of [4, 5, 3]) {
      const breakingPoint = Math.floor((this.optionsBg.width * ratio) / 10);
      const availableSpace = this.optionsBg.width - breakingPoint;
      const neededSpace = totalWidth + 16 * (labels.length - 1);
      if (labelsOffset === 0 && labelWidth < breakingPoint && neededSpace < availableSpace) {
        labelsOffset = breakingPoint - labelWidth;
      }
    }

    const totalSpace = 297 - labelWidth - totalWidth - labelsOffset;
    const optionSpacing = Math.floor(totalSpace / (labels.length - 1));

    let xPosition = this.labelsTextList.x + labelWidth + labelsOffset;
    for (const optionLabel of labels) {
      positions.push(xPosition);
      xPosition += optionLabel.displayWidth + optionSpacing;
    }
  }

  protected override clear() {
    this.settingsContainer.setVisible(false);
    this.setScrollCursor(0);
    this.eraseCursor();
    this.getUi().bgmBar.toggleBgmBar(settingsManager.display.showBgmBar);

    eventBus.off("gamepad/init", this.updateInstructionIcons, this);
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
    { delay, callback, callbackDelay, prompt, promptDelay }: ShowTextOptions = {},
  ) {
    this.messageBoxContainer.setVisible(!!text?.length);
    super.showText(text, { delay, callback, callbackDelay, prompt, promptDelay });
  }

  /**
   * Update the text of an option for a given setting.
   * If the option is not currently on screen, store the new label to be used when the settings gets scrolled.
   * @param settingIndex - The index of the settings (in uiItems).
   * @param optionIndex - The indew of the option to change.
   * @param newLabel - The new label to set.
   */
  protected updateOptionValueLabel(settingIndex: number, optionIndex: number, newLabel: string) {
    // Save the new label
    this.settingValuesData[settingIndex].labels[optionIndex] = newLabel;

    // If the option is currently shown on screen, update the text object
    if (this.optionValueLabels[settingIndex - this.scrollCursor] != null) {
      this.optionValueLabels[settingIndex - this.scrollCursor][optionIndex].setText(newLabel);
    }
  }

  protected handleSaveSetting<V = any>(uiItem: SettingsUiItem, newValue: V) {
    const { key, requiresReload } = uiItem;

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
        this.showText("", { delay: 0 });
        onConfirm();
      },
      noHandler: () => {
        globalScene.ui.revertMode();
        this.showText("", { delay: 0 });
        onCancel?.();
      },
    };
    this.showText(text, { callback: () => globalScene.ui.setOverlayMode<ConfirmUiHandler>(UiMode.CONFIRM, config) });
  }

  protected handleCancelConfirm(uiItem: SettingsUiItem) {
    const { options } = uiItem;

    const oldValue = settingsManager[this.category][uiItem.key];
    const oldOptionIndex = options.findIndex((option) => option.value === oldValue);
    this.setOptionCursor(-1, Math.max(oldOptionIndex, 0), false);
  }
}
