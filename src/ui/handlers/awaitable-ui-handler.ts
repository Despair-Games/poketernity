import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH } from "#app/ui-constants";
import { Button } from "#enums/buttons";
import type { UiMode } from "#enums/ui-mode";
import { UiHandler } from "./abstract-ui-handler";

export abstract class AwaitableUiHandler extends UiHandler {
  protected awaitingActionInput: boolean;
  protected onActionInput: Function | null;
  public tutorialActive: boolean = false;
  public tutorialOverlay: Phaser.GameObjects.Rectangle;

  constructor(mode: UiMode | null = null) {
    super(mode);
  }

  processTutorialInput(button: Button): boolean {
    if ((button === Button.ACTION || button === Button.CANCEL) && this.onActionInput) {
      this.getUi().playSelect();
      const originalOnActionInput = this.onActionInput;
      this.onActionInput = null;
      originalOnActionInput();
      this.awaitingActionInput = false;
      return true;
    }

    return false;
  }

  /**
   * Create a semi transparent overlay that will get shown during tutorials
   * @param container the container to add the overlay to
   */
  initTutorialOverlay(container: Phaser.GameObjects.Container) {
    if (!this.tutorialOverlay) {
      this.tutorialOverlay = new Phaser.GameObjects.Rectangle(
        globalScene,
        -1,
        -1,
        GAME_WIDTH + 2,
        GAME_HEIGHT + 2,
        0x070707,
      );
      this.tutorialOverlay.setName("tutorial-overlay");
      this.tutorialOverlay.setOrigin(0, 0);
      this.tutorialOverlay.setAlpha(0);
    }

    if (container) {
      container.add(this.tutorialOverlay);
    }
  }

  override isAwaitableUiHandler(): this is this {
    return true;
  }
}
