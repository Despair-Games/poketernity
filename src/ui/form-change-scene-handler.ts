import MessageUiHandler from "./message-ui-handler";
import { TextStyle, addTextObject } from "./text";
import { Mode } from "./ui";
import { Button } from "#enums/buttons";
import { globalScene } from "#app/global-scene";

/**
 * A handler for Pokemon form change and evolution scenes
 * @extends MessageUiHandler
 */
export default class FormChangeSceneHandler extends MessageUiHandler {
  public container: Phaser.GameObjects.Container;
  public messageBg: Phaser.GameObjects.Image;
  public messageContainer: Phaser.GameObjects.Container;
  public canCancel: boolean;
  public cancelled: boolean;

  constructor() {
    super(Mode.FORM_CHANGE_SCENE);
  }

  setup() {
    this.canCancel = false;
    this.cancelled = false;

    const ui = this.getUi();

    this.container = globalScene.add.container(0, -globalScene.game.canvas.height / 6);
    ui.add(this.container);

    const messageBg = globalScene.add.sprite(0, 0, "bg", globalScene.windowType);
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
        width: 1780,
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
    if (this.canCancel && !this.cancelled && button === Button.CANCEL) {
      this.cancelled = true;
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
    this.cancelled = false;
    this.container.removeAll(true);
    this.messageContainer.setVisible(false);
    this.messageBg.setVisible(false);
  }
}
