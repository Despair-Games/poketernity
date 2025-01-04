import { globalScene } from "#app/global-scene";
import type { OptionSelectConfig, OptionSelectItem } from "#app/ui/interfaces/option-select-config";
import { TextStyle, addBBCodeTextObject, getTextStyleOptions } from "#app/ui/text";
import { Mode } from "#app/ui/ui";
import UiHandler from "#app/ui/ui-handler";
import { addWindow } from "#app/ui/ui-theme";
import { fixedInt } from "#app/utils";
import { Button } from "#enums/buttons";
import type BBCodeText from "phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText";

const scrollUpLabel = "↑";
const scrollDownLabel = "↓";

export default class OptionSelectUiHandler extends UiHandler {
  protected optionSelectContainer: Phaser.GameObjects.Container;
  protected optionSelectBg: Phaser.GameObjects.NineSlice;
  protected optionSelectText: BBCodeText;
  protected optionSelectIcons: Phaser.GameObjects.Sprite[];

  protected config: OptionSelectConfig | null;

  protected blockInput: boolean;

  protected scrollCursor: number = 0;

  protected scale: number = 0.1666666667;

  private cursorObj: Phaser.GameObjects.Image | null;

  constructor(mode: Mode = Mode.OPTION_SELECT) {
    super(mode);
  }

  public getWindowWidth(): number {
    // TODO
    return 64;
  }

  public getWindowHeight(): number {
    return (Math.min((this.config?.options || []).length, this.config?.maxOptions || 99) + 1) * 96 * this.scale;
  }

  override setup() {
    const ui = this.getUi();

    this.optionSelectContainer = globalScene.add.container(globalScene.game.canvas.width / 6 - 1, -48);
    this.optionSelectContainer.setName(`option-select-${this.mode ? Mode[this.mode] : "UNKNOWN"}`);
    this.optionSelectContainer.setVisible(false);
    ui.add(this.optionSelectContainer);

    this.optionSelectBg = addWindow(0, 0, this.getWindowWidth(), this.getWindowHeight());
    this.optionSelectBg.setName("option-select-bg");
    this.optionSelectBg.setOrigin(1, 1);
    this.optionSelectContainer.add(this.optionSelectBg);

    this.optionSelectIcons = [];

    this.scale = getTextStyleOptions(TextStyle.WINDOW, globalScene.uiTheme).scale;

    this.setCursor(0);
  }

  protected setupOptions() {
    const configOptions = this.config?.options ?? [];

    let options: OptionSelectItem[];

    // for performance reasons, this limits how many options we can see at once. Without this, it would try to make text options for every single options
    // which makes the performance take a hit. If there's not enough options to do this (set to 10 at the moment) and the ui mode !== Mode.AUTO_COMPLETE,
    // this is ignored and the original code is untouched, with the options array being all the options from the config
    if (configOptions.length >= 10 && globalScene.ui.getMode() === Mode.AUTO_COMPLETE) {
      const optionsScrollTotal = configOptions.length;
      const optionStartIndex = this.scrollCursor;
      const optionEndIndex = Math.min(
        optionsScrollTotal,
        optionStartIndex
          + (!optionStartIndex || this.scrollCursor + (this.config?.maxOptions! - 1) >= optionsScrollTotal
            ? this.config?.maxOptions! - 1
            : this.config?.maxOptions! - 2),
      );
      options = configOptions.slice(optionStartIndex, optionEndIndex + 2);
    } else {
      options = configOptions;
    }

    if (this.optionSelectText) {
      this.optionSelectText.destroy();
    }
    if (this.optionSelectIcons?.length) {
      this.optionSelectIcons.map((i) => i.destroy());
      this.optionSelectIcons.splice(0, this.optionSelectIcons.length);
    }

    this.optionSelectText = addBBCodeTextObject(
      0,
      0,
      // TODO handle icon size properly
      options.map((o) => (o.iconsConfig ? `    ${o.label}` : o.label)).join("\n"),
      TextStyle.WINDOW,
      { maxLines: options.length, lineSpacing: this.scale * 72 },
    );
    this.optionSelectText.setOrigin(0, 0);
    this.optionSelectText.setName("text-option-select");
    this.optionSelectContainer.add(this.optionSelectText);

    // Make sure the window is not larger than the screen
    const bgWidth = Math.max(this.optionSelectText.displayWidth + 24, this.getWindowWidth());
    this.optionSelectBg.width = bgWidth; // TODO based on label size etc

    // Make sure the window doesn't go past the left side of the screen
    const xPosition = Math.max(bgWidth + 1, globalScene.scaledCanvas.width - 1 - Math.abs(this.config?.xOffset ?? 0));
    this.optionSelectContainer.setPosition(xPosition, -48 + (this.config?.yOffset ?? 0));

    this.optionSelectBg.width = Math.max(this.optionSelectText.displayWidth + 24, this.getWindowWidth());

    if (this.config?.options && this.config?.options.length > this.config?.maxOptions!) {
      // TODO: is this bang correct?
      this.optionSelectText.setText(
        this.getOptionsWithScroll()
          .map((o) => o.label)
          .join("\n"),
      );
    }

    this.optionSelectBg.height = this.getWindowHeight();

    this.optionSelectText.setPosition(
      this.optionSelectBg.x - this.optionSelectBg.width + 12 + 24 * this.scale,
      this.optionSelectBg.y - this.optionSelectBg.height + 2 + 42 * this.scale,
    );

    options.forEach((option: OptionSelectItem, i: number) => {
      if (option.iconsConfig) {
        for (const config of option.iconsConfig) {
          const iconSprite = globalScene.add.sprite(0, 0, config.name, config.frame);
          iconSprite.setScale(config.scale ?? this.scale);
          iconSprite.setPositionRelative(this.optionSelectText, 36 * this.scale, 7 + i * (114 * this.scale - 3));

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

    this.config = args[0] as OptionSelectConfig;
    this.setupOptions();

    globalScene.ui.bringToTop(this.optionSelectContainer);

    this.optionSelectContainer.setVisible(true);
    this.scrollCursor = 0;
    this.setCursor(0);

    if (this.config.inputDelay) {
      this.blockInput = true;
      this.optionSelectText.setAlpha(0.5);
      this.cursorObj?.setAlpha(0.8);
      globalScene.time.delayedCall(fixedInt(this.config.inputDelay), () => this.unblockInput());
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
    } else if (button === Button.SUBMIT && ui.getMode() === Mode.AUTO_COMPLETE) {
      // this is here to differentiate between a Button.SUBMIT vs Button.ACTION within the autocomplete handler
      // this is here because Button.ACTION is picked up as z on the keyboard, meaning if you're typing and hit z, it'll select the option you've chosen
      success = true;
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
      if (this.config?.supportHover) {
        // TODO why need to check supportHover and not just that onHover exists
        // handle hover code if the element supports hover-handlers and the option has the optional hover-handler set.
        this.config?.options[this.cursor + (this.scrollCursor - (this.scrollCursor ? 1 : 0))]?.onHover?.();
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

    let isScroll = false;
    const options = this.getOptionsWithScroll();
    if (changed && this.config?.maxOptions && this.config.options.length > this.config.maxOptions) {
      if (Math.abs(cursor - this.cursor) === options.length - 1) {
        // Wrap around the list
        const optionsScrollTotal = this.config.options.length;
        this.scrollCursor = cursor ? optionsScrollTotal - (this.config.maxOptions - 1) : 0;
        this.setupOptions();
      } else {
        // Move the cursor up or down by 1
        const isDown = cursor && cursor > this.cursor;
        if (isDown) {
          if (options[cursor].label === scrollDownLabel) {
            isScroll = true;
            this.scrollCursor++;
          }
        } else {
          if (!cursor && this.scrollCursor) {
            isScroll = true;
            this.scrollCursor--;
          }
        }
        if (isScroll && this.scrollCursor === 1) {
          this.scrollCursor += isDown ? 1 : -1;
        }
      }
    }
    if (isScroll) {
      this.setupOptions();
    } else {
      this.cursor = cursor;
    }

    if (!this.cursorObj) {
      this.cursorObj = globalScene.add.image(0, 0, "cursor");
      this.optionSelectContainer.add(this.cursorObj);
    }

    this.cursorObj.setScale(this.scale * 6);
    this.cursorObj.setPositionRelative(
      this.optionSelectBg,
      12,
      102 * this.scale + this.cursor * (114 * this.scale - 3),
    );

    return changed;
  }

  override clear() {
    super.clear();
    this.config = null;
    this.optionSelectContainer.setVisible(false);
    this.scrollCursor = 0;
    this.eraseCursor();
  }

  protected eraseCursor() {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }
}
