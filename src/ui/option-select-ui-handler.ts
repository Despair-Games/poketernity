import { globalScene } from "#app/global-scene";
import type { OptionSelectModeConfig, OptionSelectItem } from "#app/ui/interfaces/option-select-config";
import { TextStyle, addBBCodeTextObject, getTextStyleOptions } from "#app/ui/text";
import MessageUiHandler from "#app/ui/message-ui-handler";
import { Mode } from "#app/ui/ui";
import { addWindow } from "#app/ui/ui-theme";
import { fixedNumber, isNullOrUndefined } from "#app/utils";
import { Button } from "#enums/buttons";
import type BBCodeText from "phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText";

const scrollUpLabel = "↑";
const scrollDownLabel = "↓";

export default class OptionSelectUiHandler extends MessageUiHandler {
  private singleSpaceWidth: number;

  protected readonly defaultYOffset = -48;

  protected optionSelectContainer: Phaser.GameObjects.Container;
  protected optionSelectBg: Phaser.GameObjects.NineSlice;
  protected optionSelectText: BBCodeText;
  protected optionSelectIcons: Phaser.GameObjects.Sprite[];

  protected config: OptionSelectModeConfig | null;

  protected blockInput: boolean;

  protected scrollCursor: number = 0;

  protected scale: number = 0.1666666667;

  protected displayWidth: number;

  private cursorObj: Phaser.GameObjects.Image | null;

  constructor(mode: Mode = Mode.OPTION_SELECT) {
    super(mode);
  }

  public getWindowWidth(): number {
    return this.displayWidth;
  }

  public getWindowHeight(): number {
    return (Math.min((this.config?.options || []).length, this.config?.maxOptions || 99) + 1) * 96 * this.scale - 2;
  }

  override setup() {
    const ui = this.getUi();

    this.scale = getTextStyleOptions(TextStyle.WINDOW, globalScene.uiTheme).scale;

    this.optionSelectContainer = globalScene.add.container(globalScene.scaledCanvas.width - 1, this.defaultYOffset);
    this.optionSelectContainer.setName(`option-select-${this.mode ? Mode[this.mode] : "UNKNOWN"}`);
    this.optionSelectContainer.setVisible(false);
    ui.add(this.optionSelectContainer);

    this.optionSelectBg = addWindow(0, 0, this.getWindowWidth(), this.getWindowHeight());
    this.optionSelectBg.setName("option-select-bg");
    this.optionSelectBg.setOrigin(1, 1);
    this.optionSelectContainer.add(this.optionSelectBg);

    this.optionSelectText = addBBCodeTextObject(0, 0, "", TextStyle.WINDOW, { lineSpacing: this.scale * 72 });
    this.optionSelectText.setOrigin(0, 0);
    this.optionSelectText.setName("text-option-select");
    this.optionSelectContainer.add(this.optionSelectText);

    this.optionSelectIcons = [];

    this.setCursor(0);
  }

  protected setupOptions() {
    const configOptions: OptionSelectItem[] = this.config?.options ?? [];

    const maxWidth = this.getOptionsWidth(configOptions);

    // Save the max width amongst all options, and use it for everything
    this.displayWidth = maxWidth + 23;

    this.optionSelectText.setMaxLines(this.config?.maxOptions ?? configOptions.length);

    // Make sure the window is not larger than the screen
    const bgWidth = Math.min(this.getWindowWidth(), globalScene.scaledCanvas.width - 2);

    // Make sure the window doesn't go past the left side of the screen
    const xPosition = Math.max(bgWidth + 1, globalScene.scaledCanvas.width - 1 - Math.abs(this.config?.xOffset ?? 0));
    this.optionSelectContainer.setPosition(xPosition, this.defaultYOffset + (this.config?.yOffset ?? 0));

    this.optionSelectBg.width = bgWidth;
    this.optionSelectBg.height = this.getWindowHeight();

    this.optionSelectText.setPosition(
      this.optionSelectBg.x - this.optionSelectBg.width + 11 + 24 * this.scale,
      this.optionSelectBg.y - this.optionSelectBg.height + 42 * this.scale,
    );

    this.displayCurrentOptions();
  }

  /**
   * Compute the width required to display all given options.
   * Creates temporary sprite and Text objects and set to be able to infer the required space
   * For options with an icon, adds the appropriate number of space before the label to give the sprite the space it needs
   * TODO ^ is that really needed or too much computation for little benefit?
   * Note, by default this is called with all options in a menu, which may cause performance issues
   * for longer lists. If your menu contains many element it might be wiser to use a different solution
   * @param configOptions array of {@linkcode OptionSelectItem} to consider
   * @returns the maximum width that will be taken by all elements of the menu
   */
  protected getOptionsWidth(configOptions: OptionSelectItem[]): number {
    const tempTextObject = addBBCodeTextObject(0, 0, " ", TextStyle.WINDOW);
    const tempSprite = globalScene.add.sprite(0, 0, "items");
    const singleSpaceWidth = tempTextObject.displayWidth;
    this.singleSpaceWidth = singleSpaceWidth;
    let maxWidth = 0;

    // Go through all options, and find out their actual display width
    for (const option of configOptions) {
      let labelWidth = 0;

      // Measure the width of the icon(s) to show before the label
      if (option.iconsConfig && !option.label.startsWith(" ")) {
        let maxIconWidth = 0;
        for (const iconConfig of option.iconsConfig) {
          tempSprite.setTexture(iconConfig.name, iconConfig.frame);
          tempSprite.setScale(iconConfig.scale);
          maxIconWidth = Math.max(maxIconWidth, tempSprite.frame.width * tempSprite.scale);
        }
        // Pad the label with as many spaces as needed to make room for the icon
        if (maxIconWidth > 0) {
          const neededSpaces = Math.ceil(maxIconWidth / singleSpaceWidth);
          option.label = option.label.padStart(option.label.length + neededSpaces);
        }
      }

      // Measure the width of the label
      tempTextObject.setText(option.label);
      labelWidth += tempTextObject.displayWidth;

      maxWidth = Math.max(maxWidth, labelWidth);
    }

    tempTextObject.destroy();
    tempSprite.destroy();

    return maxWidth;
  }

  protected displayCurrentOptions(): void {
    // Destroy any existing icon sprite. TODO: improve performance
    this.clearIconSprites();

    const options: OptionSelectItem[] = this.getOptionsWithScroll();

    this.optionSelectText.setText(options.map((o) => o.label).join("\n"));

    options.forEach((option: OptionSelectItem, i: number) => {
      const iconY = 7 + i * (114 * this.scale - 3);
      if (option.iconsConfig) {
        const iconX = Math.floor(((option.label.length - option.label.trimStart().length) * this.singleSpaceWidth) / 2);
        for (const config of option.iconsConfig) {
          const iconSprite = globalScene.add.sprite(0, 0, config.name, config.frame);
          iconSprite.setScale(config.scale);
          iconSprite.setPositionRelative(this.optionSelectText, iconX, iconY);

          if (config.tint) {
            iconSprite.setTint(config.tint);
          }

          this.optionSelectIcons.push(iconSprite);
          this.optionSelectContainer.add(iconSprite);
        }
      }
    });
  }

  override show(args: any[]): boolean {
    if (!args.length || !args[0].hasOwnProperty("options") || !args[0].options.length) {
      return false;
    }

    super.show(args);

    this.config = args[0] as OptionSelectModeConfig;
    this.setupOptions();

    globalScene.ui.bringToTop(this.optionSelectContainer);

    this.optionSelectContainer.setVisible(true);
    this.scrollCursor = 0;
    this.setCursor(0);

    if (this.config.inputDelay) {
      this.blockInput = true;
      this.optionSelectText.setAlpha(0.5);
      this.cursorObj?.setAlpha(0.8);
      globalScene.time.delayedCall(fixedNumber(this.config.inputDelay), () => this.unblockInput());
    }

    return true;
  }

  override processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    const options = this.getOptionsWithScroll();

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
        if (this.config?.maxOptions && this.config.options.length > this.config.maxOptions) {
          this.scrollCursor = this.config.options.length - this.config.maxOptions + 1;
          this.cursor = options.length - 1;
        } else if (!this.config?.noCancel) {
          this.setCursor(options.length - 1);
        } else {
          return false;
        }
      }
      const option = this.config?.options[this.cursor + (this.scrollCursor - (this.scrollCursor ? 1 : 0))];
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
          if (this.cursor) {
            success = this.setCursor(this.cursor - 1);
          } else if (this.cursor === 0) {
            success = this.setCursor(options.length - 1);
          }
          break;
        case Button.DOWN:
          if (this.cursor < options.length - 1) {
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

  public getOptionsWithScroll(): OptionSelectItem[] {
    if (!this.config) {
      return [];
    }

    const options = this.config.options.slice(0);

    if (!this.config.maxOptions || this.config.options.length < this.config.maxOptions) {
      return options;
    }

    const optionsScrollTotal = options.length;
    const optionStartIndex = this.scrollCursor;
    const optionEndIndex = Math.min(
      optionsScrollTotal,
      optionStartIndex
        + (!optionStartIndex || this.scrollCursor + (this.config.maxOptions - 1) >= optionsScrollTotal
          ? this.config.maxOptions - 1
          : this.config.maxOptions - 2),
    );

    if (this.config?.maxOptions && options.length > this.config.maxOptions) {
      options.splice(optionEndIndex, optionsScrollTotal);
      options.splice(0, optionStartIndex);
      if (optionStartIndex) {
        options.unshift({
          label: scrollUpLabel,
          handler: () => true,
        });
      }
      if (optionEndIndex < optionsScrollTotal) {
        options.push({
          label: scrollDownLabel,
          handler: () => true,
        });
      }
    }

    return options;
  }

  override setCursor(cursor: number): boolean {
    const changed = this.cursor !== cursor;

    let scrollUpdated = false;
    const options = this.getOptionsWithScroll();
    // TODO rewrite this mess
    if (changed && this.config?.maxOptions && this.config.options.length > this.config.maxOptions) {
      if (Math.abs(cursor - this.cursor) === options.length - 1) {
        // Wrap around the list
        const maxScrollCursor = this.config.options.length - (this.config.maxOptions - 1);
        this.scrollCursor = cursor > 0 ? maxScrollCursor : 0;
        this.cursor = cursor;
        scrollUpdated = true;
      } else {
        // Move the cursor up or down by 1
        const isDown = cursor && cursor > this.cursor;
        if (isDown) {
          if (options[cursor].label === scrollDownLabel) {
            scrollUpdated = true;
            this.scrollCursor++;
          }
        } else {
          if (!cursor && this.scrollCursor) {
            scrollUpdated = true;
            this.scrollCursor--;
          }
        }
        if (scrollUpdated && this.scrollCursor === 1) {
          // TODO ???
          this.scrollCursor += isDown ? 1 : -1;
        }
      }
    }
    if (scrollUpdated) {
      this.displayCurrentOptions();
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
