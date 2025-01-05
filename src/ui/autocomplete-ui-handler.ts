import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";
import { Button } from "#enums/buttons";

export default class AutoCompleteUiHandler extends OptionSelectUiHandler {
  modalContainer: Phaser.GameObjects.Container;

  override show(args: any[]): boolean {
    if (args[0].modalContainer) {
      const { modalContainer } = args[0];
      const show = super.show(args);
      this.modalContainer = modalContainer;
      this.setupOptions();

      return show;
    }
    return false;
  }

  protected override setupOptions() {
    super.setupOptions();
    if (this.modalContainer) {
      this.optionSelectContainer.setSize(
        this.optionSelectContainer.height,
        Math.max(this.optionSelectText.displayWidth + 24, this.getWindowWidth()),
      );
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
      const option = this.config?.options[this.cursor + (this.scrollCursor - (this.scrollCursor ? 1 : 0))];
      if (option?.handler()) {
        if (!option.keepOpen) {
          this.clear();
        }
        if (!option.overrideSound) {
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
