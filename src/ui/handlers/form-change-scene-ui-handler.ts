import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import { Button } from "#enums/button";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { settings } from "#system/settings-manager";
import { MessageUiHandler } from "#ui/message-ui-handler";
import { addTextObject } from "#ui/text-utils";

/**
 * A handler for Pokemon form change and evolution scenes
 */
export class FormChangeSceneUiHandler extends MessageUiHandler {
  public container: Phaser.GameObjects.Container;
  public messageBg: Phaser.GameObjects.Image;
  public messageContainer: Phaser.GameObjects.Container;
  public canCancel: boolean;

  constructor() {
    super(UiMode.FORM_CHANGE_SCENE);
  }

  protected override setup() {
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

  protected override tearDown(): void {
    this.container.destroy();
    this.messageBg.destroy();
    this.messageContainer.destroy();
  }

  public override show(): boolean {
    globalScene.ui.bringToTop(this.container);
    globalScene.ui.bringToTop(this.messageBg);
    globalScene.ui.bringToTop(this.messageContainer);
    this.messageBg.setVisible(true);
    this.messageContainer.setVisible(true);

    return true;
  }

  public override processInput(button: Button): boolean {
    if (this.canCancel && button === Button.CANCEL) {
      this.canCancel = false;
      const currentPhase = globalScene.phaseManager.getCurrentPhase();
      if (currentPhase.is("EvolutionPhase")) {
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

  public override setCursor(_cursor: number): boolean {
    return false;
  }

  protected override clear() {
    this.clearText();
    this.canCancel = false;
    this.container.removeAll(true);
    this.messageContainer.setVisible(false);
    this.messageBg.setVisible(false);
  }
}
