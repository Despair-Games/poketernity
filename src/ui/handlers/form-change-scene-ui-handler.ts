import MessageUiHandler from "./message-ui-handler";
import { addTextObject } from "#app/ui/text/text-utils";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { Button } from "#enums/buttons";
import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#app/ui-constants";
import { type EvolutionPhase } from "#app/phases/evolution-phase";
import { PhaseId } from "#enums/phase-id";

/**
 * A handler for Pokemon form change and evolution scenes
 * @extends MessageUiHandler
 */
export default class FormChangeSceneUiHandler extends MessageUiHandler {
  public container: Phaser.GameObjects.Container;
  public messageBg: Phaser.GameObjects.Image;
  public messageContainer: Phaser.GameObjects.Container;
  public canCancel: boolean;

  constructor() {
    super(UiMode.FORM_CHANGE_SCENE);
  }

  setup() {
    this.canCancel = false;

    const ui = this.getUi();

    this.container = globalScene.add.container(0, -GAME_HEIGHT);
    ui.add(this.container);

    const messageBg = globalScene.add.sprite(0, 0, "battle_message_box", settings.display.uiWindowStyle);
    messageBg.setOrigin(0, 1);
    messageBg.setVisible(false);
    ui.add(messageBg);

    this.messageBg = messageBg;

    this.messageContainer = globalScene.add.container(12, -39);
    this.messageContainer.setVisible(false);
    ui.add(this.messageContainer);

    const message = addTextObject(0, 0, "", TextStyle.MESSAGE, {
      maxLines: 2,
      wordWrap: {
        width: (GAME_WIDTH - 24) * TEXT_SCALE,
      },
    });
    this.messageContainer.add(message);

    this.message = message;

    this.initPromptSprite(this.messageContainer);
  }

  override show(_args: any[]): boolean {
    super.show(_args);

    globalScene.ui.bringToTop(this.container);
    globalScene.ui.bringToTop(this.messageBg);
    globalScene.ui.bringToTop(this.messageContainer);
    this.messageBg.setVisible(true);
    this.messageContainer.setVisible(true);

    return true;
  }

  processInput(button: Button): boolean {
    if (this.canCancel && button === Button.CANCEL) {
      this.canCancel = false;
      const currentPhase = globalScene.getCurrentPhase();
      if (currentPhase?.is<EvolutionPhase>(PhaseId.EVOLUTION)) {
        currentPhase.cancelEvolution();
      }
      return true;
    }

    const ui = this.getUi();
    if (this.awaitingActionInput && (button === Button.CANCEL || button === Button.ACTION) && this.onActionInput) {
      ui.playSelect();
      const originalOnActionInput = this.onActionInput;
      this.onActionInput = null;
      originalOnActionInput();
      return true;
    }

    return false;
  }

  override setCursor(_cursor: number): boolean {
    return false;
  }

  override clear() {
    this.clearText();
    this.canCancel = false;
    this.container.removeAll(true);
    this.messageContainer.setVisible(false);
    this.messageBg.setVisible(false);
  }
}
