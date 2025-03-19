import { globalScene } from "#app/global-scene";
import { Achievement } from "#app/system/achievements";
import type { Voucher } from "#app/system/voucher";
import { addTextObject } from "#app/ui/text/text-utils";
import { TextStyle } from "#enums/text-style";
import { GAME_WIDTH, TEXT_SCALE } from "#app/ui-constants";

export class AchvBar extends Phaser.GameObjects.Container {
  private defaultWidth: number;
  private defaultHeight: number;

  private bg: Phaser.GameObjects.NineSlice;
  private icon: Phaser.GameObjects.Sprite;
  private titleText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;

  private queue: (Achievement | Voucher)[] = [];

  public shown: boolean;

  constructor() {
    super(globalScene, GAME_WIDTH, 0);
  }

  setup(): void {
    this.defaultWidth = 200;
    this.defaultHeight = 40;

    this.bg = globalScene.add.nineslice(
      0,
      0,
      "achv_bar",
      undefined,
      this.defaultWidth,
      this.defaultHeight,
      41,
      6,
      16,
      4,
    );
    this.bg.setOrigin(0, 0);

    this.add(this.bg);

    this.icon = globalScene.add.sprite(4, 4, "items");
    this.icon.setOrigin(0, 0);
    this.add(this.icon);

    this.titleText = addTextObject(40, 3, "", TextStyle.NOTIFICATION_BAR_LIGHT);
    this.titleText.setOrigin(0, 0);
    this.add(this.titleText);

    this.scoreText = addTextObject(150, 3, "", TextStyle.NOTIFICATION_BAR_LIGHT);
    this.scoreText.setOrigin(1, 0);
    this.add(this.scoreText);

    this.descriptionText = addTextObject(43, 16, "", TextStyle.NOTIFICATION_BAR_DARK);
    this.descriptionText.setOrigin(0, 0);
    this.add(this.descriptionText);

    this.descriptionText.setWordWrapWidth(110 * TEXT_SCALE);
    this.descriptionText.setLineSpacing(-5);

    this.setScale(0.5);

    this.shown = false;
  }

  showAchv(achv: Achievement | Voucher): void {
    if (this.shown) {
      this.queue.push(achv);
      return;
    }

    this.bg.setTexture(`achv_bar`);
    this.icon.setFrame(achv.iconImage);
    this.titleText.setText(achv.name);
    this.scoreText.setVisible(achv instanceof Achievement);
    this.descriptionText.setText(achv.description);

    // Take the width of the default interface or the title if longest
    this.bg.width = Math.max(
      this.defaultWidth,
      this.icon.displayWidth + this.titleText.displayWidth + this.scoreText.displayWidth + 16,
    );

    this.scoreText.x = this.bg.width - 2;
    this.descriptionText.width = this.bg.width - this.icon.displayWidth - 16;
    this.descriptionText.setWordWrapWidth(this.descriptionText.width * TEXT_SCALE);

    // Take the height of the default interface or the description if longest
    this.bg.height = Math.max(
      this.defaultHeight,
      this.titleText.displayHeight + this.descriptionText.displayHeight + 8,
    );
    this.icon.y = this.bg.height / 2 - this.icon.height / 2;

    globalScene.audioManager.playSound("se/achv");

    globalScene.tweens.add({
      targets: this,
      x: GAME_WIDTH - this.bg.width / 2,
      duration: 500,
      ease: "Sine.easeOut",
    });

    globalScene.time.delayedCall(10000, () => this.hide());

    this.setVisible(true);
    this.shown = true;
  }

  protected hide(): void {
    if (!this.shown) {
      return;
    }

    globalScene.tweens.add({
      targets: this,
      x: GAME_WIDTH,
      duration: 500,
      ease: "Sine.easeIn",
      onComplete: () => {
        this.shown = false;
        this.setVisible(false);
        if (this.queue.length) {
          const shifted = this.queue.shift();
          shifted && this.showAchv(shifted);
        }
      },
    });
  }
}
