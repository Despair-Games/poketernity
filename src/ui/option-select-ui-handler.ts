import { globalScene } from "#app/global-scene";
import type { OptionSelectModeConfig, OptionSelectItem } from "#app/ui/interfaces/option-select-config";
import { TextStyle, addBBCodeTextObject, getTextStyleOptions } from "#app/ui/text";
import MessageUiHandler from "#app/ui/message-ui-handler";
import { Mode } from "#app/ui/ui";
import { addWindow } from "#app/ui/ui-theme";
import { fixedNumber, getNumberValue, isNullOrUndefined, NumberHolder } from "#app/utils";
import { Button } from "#enums/buttons";
import type BBCodeText from "phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText";
import { settings } from "#app/system/settings/settings-manager";

const WINDOW_PADDING = 23;
const DEFAULT_MAX_OPTIONS = 10;
const NUM_PRE_COMPUTED_OPTIONS = 15;
const DEFAULT_TEXT_STYLE = TextStyle.WINDOW;

const SCROLL_UP_ITEM: UIOptionSelectItem = {
  label: "↑",
  handler: () => true,
  initialized: true,
  displayLabel: "↑",
};
const SCROLL_DOWN_ITEM: UIOptionSelectItem = {
  label: "↓",
  handler: () => true,
  initialized: true,
  displayLabel: "↓",
};

interface UIOptionSelectItem extends OptionSelectItem {
  initialized: boolean;
  displayLabel: string;
  iconsWidth?: number;
}

export default class OptionSelectUiHandler extends MessageUiHandler {
  private config: OptionSelectModeConfig | null;
  private options: UIOptionSelectItem[];
  private currentOptions: UIOptionSelectItem[];
  private fullyInitialized: boolean;
  private maxOptions: number;

  protected readonly DEFAULT_Y_OFFSET = -48;
  protected readonly windowWidth: NumberHolder;
  protected readonly windowHeight: NumberHolder;

  protected optionSelectContainer: Phaser.GameObjects.Container;
  protected optionSelectBg: Phaser.GameObjects.NineSlice;
  protected optionSelectText: BBCodeText;
  protected optionSelectIcons: Phaser.GameObjects.Sprite[];
  protected cursorObj: Phaser.GameObjects.Image | null;

  protected blockInput: boolean;

  protected scrollCursor: number = 0;

  protected scale: number = 0.1666666667;

  constructor(mode: Mode = Mode.OPTION_SELECT) {
    super(mode);

    this.windowWidth = new NumberHolder(0);
    this.windowHeight = new NumberHolder(0);
  }

  public getWindowWidth(): number {
    return this.windowWidth.value;
  }

  public getWindowHeight(): number {
    return this.windowHeight.value;
  }

  protected computeWindowHeight(): number {
    return (this.maxOptions + 1) * 96 * this.scale - 2;
  }

  override setup() {
    const ui = this.getUi();

    this.scale = getTextStyleOptions(DEFAULT_TEXT_STYLE, settings.display.uiTheme).scale;

    this.optionSelectContainer = globalScene.add.container(globalScene.scaledCanvas.width - 1, this.DEFAULT_Y_OFFSET);
    this.optionSelectContainer.setName(`option-select-${this.mode ? Mode[this.mode] : "UNKNOWN"}`);
    this.optionSelectContainer.setVisible(false);
    ui.add(this.optionSelectContainer);

    this.optionSelectBg = addWindow(0, 0, this.getWindowWidth(), this.getWindowHeight());
    this.optionSelectBg.setName("option-select-bg");
    this.optionSelectBg.setOrigin(1, 1);
    this.optionSelectContainer.add(this.optionSelectBg);

    this.optionSelectText = addBBCodeTextObject(0, 0, "", DEFAULT_TEXT_STYLE, { lineSpacing: this.scale * 72 });
    this.optionSelectText.setOrigin(0, 0);
    this.optionSelectText.setName("text-option-select");
    this.optionSelectContainer.add(this.optionSelectText);

    this.optionSelectIcons = [];

    this.setCursor(0);
  }

  override show(args: any[]): boolean {
    if (!args.length || !args[0].hasOwnProperty("options") || !args[0].options.length) {
      return false;
    }

    super.show(args);

    this.initOptions(args[0] as OptionSelectModeConfig);

    globalScene.ui.bringToTop(this.optionSelectContainer);

    this.optionSelectContainer.setVisible(true);
    this.scrollCursor = 0;
    this.setCursor(0);

    if (this.config?.inputDelay) {
      this.blockInput = true;
      this.optionSelectText.setAlpha(0.5);
      this.cursorObj?.setAlpha(0.8);
      globalScene.time.delayedCall(fixedNumber(this.config.inputDelay), () => this.unblockInput());
    }

    return true;
  }

  private initOptions(config: OptionSelectModeConfig) {
    this.config = config;
    this.options = (config.options ?? []).map((option) => {
      return {
        ...option,
        initialized: false,
        displayLabel: option.label,
      };
    });
    this.maxOptions = Math.min(this.options.length, config.maxOptions ?? DEFAULT_MAX_OPTIONS);

    this.optionSelectText.setMaxLines(this.maxOptions);

    // Set window size based on the dimensions of the first {@linkcode DEFAULT_PRE_COMPUTED_OPTIONS} options
    this.updateSizeForOptions(this.options.slice(0, NUM_PRE_COMPUTED_OPTIONS));

    this.updateCurrentOptions();
  }

  /**
   * Compute the width required to display all given options.
   * Creates temporary sprite and Text objects and set to be able to infer the required space
   * For options with an icon, adds the appropriate number of space before the label to give the sprite the space it needs
   * Note, by default this is called with all options in a menu, which may cause performance issues
   * for longer lists. If your menu contains many element it might be wiser to use a different solution
   * @param configOptions array of {@linkcode OptionSelectItem} to consider
   * @returns the maximum width that will be taken by all elements of the menu
   */
  private getOptionsMaxWidth(configOptions: UIOptionSelectItem[]): number {
    const nonInitializedOptions = configOptions.filter((o) => !o.initialized);
    if (nonInitializedOptions.length === 0) {
      return 0;
    }

    const tempTextObject = addBBCodeTextObject(0, 0, " ", DEFAULT_TEXT_STYLE);
    const tempSprite = globalScene.add.sprite(0, 0, "items");
    const singleSpaceWidth = tempTextObject.displayWidth;

    for (const option of nonInitializedOptions) {
      this.initializeOption(option, singleSpaceWidth, tempSprite);
    }

    tempTextObject.setText(nonInitializedOptions.map((o) => o.displayLabel).join("\n"));
    const totalWidth = tempTextObject.displayWidth;

    tempTextObject.destroy();
    tempSprite.destroy();

    return totalWidth;
  }

  protected initializeOption(
    option: UIOptionSelectItem,
    singleSpaceWidth: number,
    tempSprite: Phaser.GameObjects.Sprite,
  ) {
    let label = option.displayLabel ?? option.label;

    // Measure the width of the icon(s) to show before the label
    if (option.iconsConfig) {
      let maxIconWidth = 0;
      for (const iconConfig of option.iconsConfig) {
        tempSprite.setTexture(iconConfig.name, iconConfig.frame);
        tempSprite.setScale(iconConfig.scale);
        maxIconWidth = Math.max(maxIconWidth, tempSprite.frame.width * tempSprite.scale);
      }
      // Pad the label with as many spaces as needed to make room for the icon
      if (maxIconWidth > 0) {
        const neededSpaces = Math.ceil(maxIconWidth / singleSpaceWidth);
        label = label.padStart(label.length + neededSpaces);
      }
      option.iconsWidth = maxIconWidth;
    }

    option.displayLabel = label;
    option.initialized = true;
  }

  protected updateSizeForOptions(options: UIOptionSelectItem[]) {
    if (this.fullyInitialized) {
      return;
    }

    // Get the max width amongst the given options, and use it for everything
    const currentWidth = this.windowWidth.value;
    const maxWidth = this.getOptionsMaxWidth(options) + WINDOW_PADDING;

    // Check if all options are now initialized.
    this.fullyInitialized = this.options.every((o) => o.initialized);

    if (maxWidth <= currentWidth) {
      return;
    }

    const xOffset = getNumberValue(this.config?.xOffset ?? 0);
    const yOffset = getNumberValue(this.config?.yOffset ?? 0);

    // Make sure the window is not larger than the screen
    const bgWidth = Math.min(maxWidth, globalScene.scaledCanvas.width - 2);
    const bgHeight = this.computeWindowHeight();
    // Make sure the window doesn't go past the left side of the screen
    const xPosition = Math.max(bgWidth + 1, globalScene.scaledCanvas.width - 1 - Math.abs(xOffset));

    this.optionSelectContainer.setPosition(xPosition, this.DEFAULT_Y_OFFSET + yOffset);
    this.optionSelectBg.setSize(bgWidth, bgHeight);
    this.optionSelectText.setPosition(
      this.optionSelectBg.x - bgWidth + 11 + 24 * this.scale,
      this.optionSelectBg.y - bgHeight + 42 * this.scale,
    );

    this.windowWidth.value = bgWidth;
    this.windowHeight.value = bgHeight;
  }

  protected updateCurrentOptions(): void {
    if (!this.config) {
      return;
    }

    const options = this.options.slice(0);
    const totalOptions = options.length;

    if (this.maxOptions < totalOptions) {
      const optionStartIndex = this.scrollCursor;
      let optionEndIndex = Math.min(this.scrollCursor + this.maxOptions - 1, options.length);
      if (this.scrollCursor > 0 && optionEndIndex < totalOptions - 1) {
        optionEndIndex -= 1;
      }

      options.splice(optionEndIndex, totalOptions);
      options.splice(0, optionStartIndex);

      if (optionStartIndex > 0) {
        options.unshift(SCROLL_UP_ITEM);
      }
      if (optionEndIndex < totalOptions - 1) {
        options.push(SCROLL_DOWN_ITEM);
      }
    }

    this.currentOptions = options;
    this.updateSizeForOptions(options);
    this.displayCurrentOptions();
  }

  protected displayCurrentOptions(): void {
    this.optionSelectText.setText(this.currentOptions.map((o) => o.displayLabel).join("\n"));

    // Hide existing icons
    for (const iconSprite of this.optionSelectIcons) {
      iconSprite.setVisible(false);
    }

    // Display the icons before each option, if any
    let currentIconIndex = 0;
    this.currentOptions.forEach((option: UIOptionSelectItem, i: number) => {
      if (option.iconsConfig) {
        const iconY = 7 + i * (114 * this.scale - 3);
        const iconX = Math.floor((option.iconsWidth ?? 0) / 2);
        for (const config of option.iconsConfig!) {
          let iconSprite = this.optionSelectIcons[currentIconIndex++];
          if (!iconSprite) {
            iconSprite = globalScene.add.sprite(0, 0, config.name, config.frame);
            this.optionSelectIcons.push(iconSprite);
            this.optionSelectContainer.add(iconSprite);
          } else {
            iconSprite.setTexture(config.name, config.frame);
            iconSprite.setVisible(true);
          }

          iconSprite.setScale(config.scale);
          iconSprite.setPositionRelative(this.optionSelectText, iconX, iconY);
          if (config.tint) {
            iconSprite.setTint(config.tint);
          }
        }
      }
    });
  }

  protected getCurrentOption(): OptionSelectItem {
    return this.options[this.cursor + (this.scrollCursor - (this.scrollCursor ? 1 : 0))];
  }

  override processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;
    let playSound = true;

    if (button === Button.ACTION || button === Button.CANCEL) {
      if (this.blockInput) {
        if (button === Button.CANCEL && this.config?.canCancelDelay) {
          this.unblockInput();
        } else {
          ui.playError();
          return false;
        }
      }

      success = true;
      if (button === Button.CANCEL) {
        if (this.options.length > this.maxOptions) {
          this.scrollCursor = this.options.length - this.maxOptions + 1;
          this.cursor = this.currentOptions.length - 1; // Why is this not using setcursor..
        } else if (!this.config?.noCancel) {
          this.setCursor(this.currentOptions.length - 1);
        } else {
          return false;
        }
      }
      const option = this.getCurrentOption();
      if (option?.handler()) {
        if (!option.keepOpen) {
          this.clear();
        }
        playSound = !option.overrideSound;
      } else {
        ui.playError();
      }
    } else {
      switch (button) {
        case Button.UP:
          if (this.cursor > 0) {
            success = this.setCursor(this.cursor - 1);
          } else if (this.cursor === 0) {
            success = this.setCursor(this.currentOptions.length - 1);
          }
          break;
        case Button.DOWN:
          if (this.cursor < this.currentOptions.length - 1) {
            success = this.setCursor(this.cursor + 1);
          } else {
            success = this.setCursor(0);
          }
          break;
      }
      if (success) {
        // handle hover code if the option has a handler for it
        const optionIndex = this.cursor + (this.scrollCursor - (this.scrollCursor ? 1 : 0));
        if (!isNullOrUndefined(this.config?.options[optionIndex].onHover)) {
          this.config.options[optionIndex].onHover();
        }
      }
    }

    if (success && playSound) {
      ui.playSelect();
    }

    return success;
  }

  protected unblockInput(): void {
    if (!this.blockInput) {
      return;
    }

    this.blockInput = false;
    this.optionSelectText.setAlpha(1);
    this.cursorObj?.setAlpha(1);
  }

  override setCursor(cursor: number): boolean {
    const changed = this.cursor !== cursor;

    let scrollUpdated = false;

    if (changed && this.options.length > this.maxOptions) {
      if (Math.abs(cursor - this.cursor) === this.currentOptions.length - 1) {
        // Wrap around the list
        const maxScrollCursor = this.options.length - (this.maxOptions - 1);
        this.scrollCursor = cursor > 0 ? maxScrollCursor : 0;
        this.cursor = cursor;
        scrollUpdated = true;
      } else {
        // Move the cursor up or down by 1
        const isDown = cursor > 0 && cursor > this.cursor;
        if (isDown) {
          if (this.currentOptions[cursor].label === SCROLL_DOWN_ITEM.label) {
            scrollUpdated = true;
            this.scrollCursor++;
          }
        } else if (cursor === 0 && this.scrollCursor > 0) {
          scrollUpdated = true;
          this.scrollCursor--;
        }
        if (scrollUpdated && this.scrollCursor === 1) {
          // Skip over the "arrow up" option
          this.scrollCursor += isDown ? 1 : -1;
        }
      }
    }

    if (scrollUpdated) {
      this.updateCurrentOptions();
    } else {
      this.cursor = cursor;
    }

    if (!this.cursorObj) {
      this.cursorObj = globalScene.add.image(0, 0, "cursor");
      this.optionSelectContainer.add(this.cursorObj);
      this.cursorObj.setScale(this.scale * 6);
    }

    this.cursorObj.setPositionRelative(
      this.optionSelectBg,
      10,
      102 * this.scale + this.cursor * (114 * this.scale - 3) - 2,
    );

    return changed;
  }

  override clear(): void {
    super.clear();

    this.config = null;
    this.options = [];
    this.currentOptions = [];
    this.maxOptions = DEFAULT_MAX_OPTIONS;
    this.windowWidth.value = 0;
    this.windowHeight.value = 0;
    this.fullyInitialized = false;

    this.clearIconSprites();
    this.optionSelectContainer.setVisible(false);
    this.scrollCursor = 0;
    this.eraseCursor();
  }

  protected clearIconSprites(): void {
    for (const iconSprite of this.optionSelectIcons) {
      iconSprite.destroy();
    }
    this.optionSelectIcons = [];
  }

  protected eraseCursor(): void {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }
}
