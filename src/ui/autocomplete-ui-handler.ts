import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";
import { Button } from "#enums/buttons";
import { UiMode } from "#enums/ui-mode";

export default class AutoCompleteUiHandler extends OptionSelectUiHandler {
  modalContainer: Phaser.GameObjects.Container;
  constructor(mode: UiMode = UiMode.OPTION_SELECT) {
    super(mode);
  }

  getWindowWidth(): number {
    return 64;
  }

  override show(args: any[]): boolean {
    if (args[0]?.modalContainer) {
      const { modalContainer } = args[0];
      this.modalContainer = modalContainer;

      return super.show(args);
    }
    return false;
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
