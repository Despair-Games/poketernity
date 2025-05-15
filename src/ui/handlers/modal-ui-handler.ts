import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import type { Button } from "#enums/buttons";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import { WindowVariant } from "#enums/window-variant";
import type { ModalConfig } from "#ui/modal-config";
import { addTextObject } from "#ui/text-utils";
import { UiHandler } from "#ui/ui-handler";
import { addWindow } from "#ui/ui-theme";

export abstract class ModalUiHandler extends UiHandler {
  protected modalContainer: Phaser.GameObjects.Container;
  protected modalBg: Phaser.GameObjects.NineSlice;
  protected titleText: Phaser.GameObjects.Text;
  protected buttonContainers: Phaser.GameObjects.Container[];
  protected buttonBgs: Phaser.GameObjects.NineSlice[];
  protected buttonLabels: Phaser.GameObjects.Text[];

  constructor(mode: UiMode | null = null) {
    super(mode);

    this.buttonContainers = [];
    this.buttonBgs = [];
    this.buttonLabels = [];
  }

  protected abstract getModalTitle(config?: ModalConfig): string;

  protected abstract getWidth(config?: ModalConfig): number;

  protected abstract getHeight(config?: ModalConfig): number;

  protected abstract getMargin(config?: ModalConfig): [number, number, number, number];

  protected abstract getButtonLabels(config?: ModalConfig): string[];

  protected getButtonTopMargin(): number {
    return 0;
  }

  protected override setup() {
    const ui = this.getUi();

    this.modalContainer = globalScene.add.container(0, 0);

    this.modalContainer.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT),
      Phaser.Geom.Rectangle.Contains,
    );

    this.modalBg = addWindow(0, 0, 0, 0);

    this.modalContainer.add(this.modalBg);

    this.titleText = addTextObject(0, 4, "", TextStyle.SETTINGS_LABEL);
    this.titleText.setOrigin(0.5, 0);

    this.modalContainer.add(this.titleText);

    ui.add(this.modalContainer);

    const buttonLabels = this.getButtonLabels();

    for (const label of buttonLabels) {
      this.addButton(label);
    }

    this.modalContainer.setVisible(false);
  }

  protected override tearDown(): void {
    this.modalContainer.destroy();
  }

  private addButton(label: string) {
    const buttonTopMargin = this.getButtonTopMargin();
    const buttonLabel = addTextObject(0, 8, label, TextStyle.TOOLTIP_CONTENT);
    buttonLabel.setOrigin(0.5, 0.5);

    const buttonBg = addWindow(0, 0, buttonLabel.getBounds().width + 11, 16, false, false, 0, 0, WindowVariant.THIN);
    buttonBg.setOrigin(0.5, 0);
    buttonBg.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, buttonBg.width, buttonBg.height),
      Phaser.Geom.Rectangle.Contains,
    );

    const buttonContainer = globalScene.add.container(0, buttonTopMargin);

    this.buttonLabels.push(buttonLabel);
    this.buttonBgs.push(buttonBg);
    this.buttonContainers.push(buttonContainer);

    buttonContainer.add(buttonBg);
    buttonContainer.add(buttonLabel);

    this.addInteractionHoverEffect(buttonBg);

    this.modalContainer.add(buttonContainer);
  }

  public override show(config: ModalConfig | any, ..._args: unknown[]): boolean {
    if (!config.hasOwnProperty("buttonActions")) {
      return false;
    }

    if (config.fadeOut) {
      const [marginTop, marginRight, marginBottom, marginLeft] = this.getMargin();

      const overlay = globalScene.add.rectangle(
        (this.getWidth() + marginLeft + marginRight) / 2,
        (this.getHeight() + marginTop + marginBottom) / 2,
        GAME_WIDTH,
        GAME_HEIGHT,
        0,
      );
      overlay.setOrigin(0.5, 0.5);
      overlay.setName("rect-ui-overlay-modal");
      overlay.setAlpha(0);

      this.modalContainer.add(overlay);
      this.modalContainer.moveTo(overlay, 0);

      globalScene.tweens.add({
        targets: overlay,
        alpha: 1,
        duration: 250,
        ease: "Sine.easeOut",
        onComplete: config.fadeOut,
      });
    }

    this.updateContainer(config);

    this.modalContainer.setVisible(true);

    this.getUi().moveTo(this.modalContainer, this.getUi().length - 1);

    for (let a = 0; a < this.buttonBgs.length; a++) {
      if (a < this.buttonBgs.length) {
        this.buttonBgs[a].on("pointerdown", (_) => config.buttonActions[a]());
      }
    }

    return true;
  }

  protected updateContainer(config?: ModalConfig): void {
    const [marginTop, marginRight, marginBottom, marginLeft] = this.getMargin(config);

    const [width, height] = [this.getWidth(config), this.getHeight(config)];
    this.modalContainer.setPosition(
      (GAME_WIDTH - (width + (marginRight - marginLeft))) / 2,
      (-GAME_HEIGHT - (height + (marginBottom - marginTop))) / 2,
    );

    this.modalBg.setSize(width, height);

    const title = this.getModalTitle(config);

    this.titleText.setText(title);
    this.titleText.setX(width / 2);
    this.titleText.setVisible(!!title);

    for (let b = 0; b < this.buttonContainers.length; b++) {
      const sliceWidth = width / (this.buttonContainers.length + 1);

      this.buttonContainers[b].setPosition(sliceWidth * (b + 1), this.modalBg.height - (this.buttonBgs[b].height + 8));
    }
  }

  public override processInput(_button: Button): boolean {
    return false;
  }

  protected override clear() {
    this.modalContainer.setVisible(false);

    this.buttonBgs.map((bg) => bg.off("pointerdown"));
  }

  /**
   * Adds a hover effect to a game object which changes the cursor to a `pointer` and tints it slighly
   * @param gameObject the game object to add hover events/effects to
   */
  protected addInteractionHoverEffect(
    gameObject: Phaser.GameObjects.Image | Phaser.GameObjects.NineSlice | Phaser.GameObjects.Sprite,
  ) {
    gameObject.on("pointerover", () => {
      this.setMouseCursorStyle("pointer");
      gameObject.setTint(0xbbbbbb);
    });

    gameObject.on("pointerout", () => {
      this.setMouseCursorStyle("default");
      gameObject.clearTint();
    });
  }
}
