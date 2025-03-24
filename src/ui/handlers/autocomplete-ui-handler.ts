import type { OptionSelectModeConfig } from "#app/ui/interfaces/option-select-config";
import { Button } from "#enums/buttons";
import { OptionSelectUiHandler } from "./option-select-ui-handler";

export class AutoCompleteUiHandler extends OptionSelectUiHandler {
  private modalContainer: Phaser.GameObjects.Container;

  override show(config: OptionSelectModeConfig, container: Phaser.GameObjects.Container): boolean {
    this.modalContainer = container;

    return super.show(config);
  }

  override updateSizeForOptions(options: any): void {
    super.updateSizeForOptions(options);
    if (this.modalContainer) {
      this.optionSelectContainer.setPositionRelative(
        this.modalContainer,
        this.optionSelectBg.width,
        this.optionSelectBg.height + 50,
      );
    }
  }

  override processInput(button: Button): boolean {
    const ui = this.getUi();
    if (button === Button.SUBMIT) {
      const option = this.getCurrentOption();
      if (option?.handler()) {
        if (!option.keepOpen) {
          this.clear();
        }
        if (!option.noSoundEffects) {
          ui.playSelect();
        }
      } else {
        ui.playError();
      }
      return true;
    } else if (button !== Button.CANCEL && button !== Button.ACTION) {
      return super.processInput(button);
    }
    return false;
  }
}
