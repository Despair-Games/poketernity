import { globalScene } from "#app/global-scene";
import type { OptionSelectItem, OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import MessageUiHandler from "#app/ui/message-ui-handler";
import { ScrollBar } from "#app/ui/scroll-bar";
import { addBBCodeTextObject, getBBCodeFragment } from "#app/ui/text";
import { addWindow } from "#app/ui/ui-theme";
import { fixedNumber, isNullOrUndefined } from "#app/utils";
import { Button } from "#enums/buttons";
import type BBCodeText from "phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText";
import type { UIOptionSelectItem } from "./interfaces/option-select-ui-item";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { GAME_WIDTH, TEXT_SCALE } from "#app/ui-constants";

const SCROLLBAR_PADDING = 5;
const SCROLLBAR_WIDTH = 3;
const WINDOW_PADDING = 23;
const DEFAULT_MAX_OPTIONS = 10;
const NUM_PRE_COMPUTED_OPTIONS = 15;
const DEFAULT_TEXT_STYLE = TextStyle.WINDOW;

/**
 * Generic handler for a menu with several options to choose from with a cursor.
 * Given the proper {@linkcode OptionSelectModeConfig} the handler takes care of:
 *  - Measure the size of all elements in the menu, including the size of any icon.
 *  - Apply the required BBCode if an elements asks for a specific color.
 *  - Creating the window of the appropriate size to hold all elements.
 *  - Handle scrolling through the menu items, resizing as needed.
 *  - Handle selecting the menu items, or cancelling out of the menu.
 *
 * At initialization the size of the first {@linkcode NUM_PRE_COMPUTED_OPTIONS} is measured.
 * Then the window's size is updated as needed when a non initialized option needs to be displayed.
 *
 * @template T the specifc type of {@linkcode OptionSelectItem} that this handler displays
 */
export default abstract class AbstractOptionSelectUiHandler<T extends OptionSelectItem> extends MessageUiHandler {
  private config: OptionSelectModeConfig<T> | null;
  private options: (UIOptionSelectItem & T)[];
  private maxOptions: number;
  protected fullyInitialized: boolean;

  protected optionSelectContainer: Phaser.GameObjects.Container;
  protected optionSelectBg: Phaser.GameObjects.NineSlice;
  protected optionSelectText: BBCodeText;
  protected optionSelectIcons: Phaser.GameObjects.Sprite[];
  protected cursorObj: Phaser.GameObjects.Image | null;
  protected scrollBar: ScrollBar | null;

  protected blockInput: boolean;

  protected scrollCursor: number = 0;

  protected readonly scale: number = 1 / TEXT_SCALE;

  constructor(mode: UiMode = UiMode.OPTION_SELECT) {
    super(mode);
    this.optionSelectIcons = [];
  }

  protected computeWindowHeight(): number {
    return (this.maxOptions + 1) * 96 * this.scale - 2;
  }

  override setup() {
    const ui = this.getUi();

    this.optionSelectContainer = globalScene.add.container(GAME_WIDTH - 1, -1);
    this.optionSelectContainer.setName(`option-select-${this.mode ? UiMode[this.mode] : "UNKNOWN"}`);
    this.optionSelectContainer.setVisible(false);
    ui.add(this.optionSelectContainer);

    this.optionSelectBg = addWindow(0, 0, 0, 0);
    this.optionSelectBg.setName("option-select-bg");
    this.optionSelectBg.setOrigin(1, 1);
    this.optionSelectContainer.add(this.optionSelectBg);

    this.optionSelectText = addBBCodeTextObject(0, 0, "", DEFAULT_TEXT_STYLE);
    this.optionSelectText.setLineSpacing(this.scale * 72);
    this.optionSelectText.setOrigin(0, 0);
    this.optionSelectText.setName("text-option-select");
    this.optionSelectContainer.add(this.optionSelectText);

    this.setCursor(0);
  }

  override show(args: any[]): boolean {
    if (!args.length || !args[0].options || !args[0].options.length) {
      console.error("Missing `OptionSelectModeConfig` argument for Mode.OPTION_SELECT");
      return false;
    }

    super.show(args);

    this.initOptions(args[0] as OptionSelectModeConfig<T>);

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

  private initOptions(config: OptionSelectModeConfig<T>) {
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

    // Set window size based on the first {@linkcode DEFAULT_PRE_COMPUTED_OPTIONS} options
    this.updateSizeForOptions(this.options.slice(0, Math.max(this.maxOptions, NUM_PRE_COMPUTED_OPTIONS)));
    this.displayCurrentOptions(true);

    if (this.options.length > this.maxOptions) {
      this.scrollBar = new ScrollBar(
        0,
        0,
        SCROLLBAR_WIDTH,
        this.optionSelectBg.displayHeight - SCROLLBAR_PADDING * 2,
        this.maxOptions,
      );
      this.scrollBar.setTotalRows(this.options.length);
      this.scrollBar.setPositionRelative(
        this.optionSelectBg,
        this.optionSelectBg.displayWidth - SCROLLBAR_PADDING * 2,
        SCROLLBAR_PADDING,
      );
      this.optionSelectContainer.add(this.scrollBar);
    }
  }

  /**
   * Automatically set the menu's size for the given options.
   * Preserves the current size if they are all smaller, otherwise expands as needed.
   * @param options the {@linkcode UIOptionSelectItem} to consider
   */
  protected updateSizeForOptions(options: (UIOptionSelectItem & T)[]): void {
    const currentWidth = this.optionSelectBg.displayWidth;
    const scrollBarWidth = this.options.length > this.maxOptions ? SCROLLBAR_PADDING : 0;

    // Get the max width amongst the given options, and use it for everything
    const maxWidth = this.getOptionsMaxWidth(options) + WINDOW_PADDING + scrollBarWidth;

    if (maxWidth <= currentWidth) {
      return;
    }

    const xOffset = Math.abs(this.config?.xOffset ?? 0);
    const yOffset = Math.abs(this.config?.yOffset ?? 0);

    // Make sure the window is not larger than the screen
    const bgWidth = Math.min(maxWidth, GAME_WIDTH - 2);
    const bgHeight = this.computeWindowHeight();
    // Make sure the window doesn't go past the left side of the screen
    const xPosition = Math.max(bgWidth + 1, GAME_WIDTH - 1 - xOffset);

    this.optionSelectContainer.setPosition(xPosition, -yOffset);
    this.optionSelectText.setPosition(
      this.optionSelectBg.x - bgWidth + 11 + 24 * this.scale,
      this.optionSelectBg.y - bgHeight + 42 * this.scale,
    );

    this.optionSelectBg.setSize(bgWidth, bgHeight);
    if (this.config?.onResize) {
      this.config.onResize(bgWidth, bgHeight);
    }
  }

  /**
   * Compute the width required to display all given options and readies them for display.
   * Creates temporary sprite and Text objects and set to be able to infer the required space.
   * Only considers the options that have not been initialized, and marks them as initialized once done.
   * @param configOptions array of {@linkcode UIOptionSelectItem} to consider
   * @returns the maximum width that will be taken by those elements
   */
  private getOptionsMaxWidth(configOptions: (UIOptionSelectItem & T)[]): number {
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

    // Check if all options are now initialized.
    this.fullyInitialized = this.options.every((o) => o.initialized);

    tempTextObject.setText(nonInitializedOptions.map((o) => o.displayLabel).join("\n"));
    const totalWidth = tempTextObject.displayWidth;

    tempTextObject.destroy();
    tempSprite.destroy();

    return totalWidth;
  }

  /**
   * Readies the given {@linkcode UIOptionSelectItem} for display.
   * For options with icon(s), adds the appropriate number of space before the label to give the sprite the space it needs
   * For options with color, adds the appropriate BBCode to the label
   * @param option the {@linkcode UIOptionSelectItem} to consider
   * @param singleSpaceWidth the width of a single space, used to offset the label if there is a icon to show
   * @param tempSprite a Sprite object that can be used to measure the needed space of the item's icon, if any
   */
  protected initializeOption(
    option: UIOptionSelectItem & T,
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
        // Change the label color to fit the required text style
        if (!isNullOrUndefined(option.color) && option.color !== DEFAULT_TEXT_STYLE) {
          label = getBBCodeFragment(label, option.color, true);
        }
      }
      option.iconsWidth = maxIconWidth;
    }

    option.displayLabel = label;
    option.initialized = true;
  }

  /**
   * Display the current options based on the cursor and scroll cursor.
   * Can handle automatic resizing of the menu window as needed.
   * @param skipResizing Set to `true` to skip the automatic resizing step; default: `false`.
   */
  protected displayCurrentOptions(skipResizing: boolean = false): void {
    const currentOptions = this.options.slice(this.scrollCursor, this.scrollCursor + this.maxOptions);

    if (!skipResizing && !this.fullyInitialized) {
      this.updateSizeForOptions(currentOptions);
    }

    this.optionSelectText.setText(currentOptions.map((o) => o.displayLabel).join("\n"));

    // Hide existing icons
    for (const iconSprite of this.optionSelectIcons) {
      iconSprite.setVisible(false);
    }

    // Display the icons before each option, if any
    let currentIconIndex = 0;
    currentOptions.forEach((option: UIOptionSelectItem, i: number) => {
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

  protected getCurrentOption(): UIOptionSelectItem & T {
    return this.options[this.cursor + this.scrollCursor];
  }

  override processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;
    let playSound = true;

    if (button === Button.ACTION || button === Button.CANCEL) {
      if (this.blockInput) {
        if (button === Button.CANCEL && this.config?.canBypassInputDelay) {
          this.unblockInput();
        } else {
          ui.playError();
          return false;
        }
      }

      success = true;
      if (button === Button.CANCEL) {
        if (this.config?.blockCancelButton) {
          return false;
        }
        // Cancelling, move the cursors to the last option to act as if it was being selected
        if (this.options.length > this.maxOptions) {
          this.scrollCursor = this.options.length - this.maxOptions;
        }
        this.cursor = this.maxOptions - 1;
      }

      const option = this.getCurrentOption();
      if (option?.handler()) {
        if (!option.keepOpen) {
          this.clear();
        }
        playSound = !option.noSoundEffects;
      } else {
        ui.playError();
      }
    } else {
      switch (button) {
        case Button.UP:
          if (this.cursor > 0) {
            success = this.setCursor(this.cursor - 1);
          } else if (this.scrollCursor > 0) {
            success = this.setScrollCursor(this.scrollCursor - 1);
          } else {
            if (this.options.length > this.maxOptions) {
              this.setScrollCursor(this.options.length - this.maxOptions);
            }
            success = this.setCursor(this.maxOptions - 1);
          }
          break;
        case Button.DOWN:
          if (this.cursor < this.maxOptions - 1) {
            success = this.setCursor(this.cursor + 1);
          } else if (this.scrollCursor < this.options.length - this.maxOptions) {
            success = this.setScrollCursor(this.scrollCursor + 1);
          } else {
            if (this.scrollCursor > 0) {
              this.setScrollCursor(0);
            }
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

    if (changed) {
      this.cursor = cursor;
    }

    if (!this.cursorObj) {
      this.cursorObj = globalScene.add.image(0, 0, "cursor");
      this.optionSelectContainer.add(this.cursorObj);
    }

    this.cursorObj.setScale(this.scale * 6);
    this.cursorObj.setPositionRelative(
      this.optionSelectBg,
      10,
      102 * this.scale + this.cursor * (114 * this.scale - 3) - 2,
    );

    return changed;
  }

  setScrollCursor(scrollCursor: number) {
    if (scrollCursor !== this.scrollCursor) {
      this.scrollCursor = scrollCursor;
      this.displayCurrentOptions();
      this.scrollBar?.setScrollCursor(this.scrollCursor);
      return true;
    }
    return false;
  }

  override clear(): void {
    super.clear();

    this.config = null;
    this.options = [];
    this.maxOptions = DEFAULT_MAX_OPTIONS;
    this.fullyInitialized = false;

    this.optionSelectBg.setSize(0, 0);
    this.optionSelectContainer.setVisible(false);
    this.scrollCursor = 0;
    this.clearIconSprites();
    this.clearCursor();
    this.clearScrollBar();
  }

  protected clearIconSprites(): void {
    for (const iconSprite of this.optionSelectIcons) {
      iconSprite.destroy();
    }
    this.optionSelectIcons = [];
  }

  protected clearCursor(): void {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }

  protected clearScrollBar(): void {
    if (this.scrollBar) {
      this.scrollBar.destroy();
      this.scrollBar = null;
    }
  }
}
