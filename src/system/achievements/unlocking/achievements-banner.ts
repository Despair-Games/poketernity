import { globalScene } from "#app/global-scene";
import type { Achievement } from "#app/system/achievements/achievements";
import { achievementsBus } from "#app/system/achievements/achievements-events";
import { settings } from "#app/system/settings/settings-manager";
import { addTextObject } from "#app/ui/text/text-utils";
import { CANVAS_SCALE, GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import { PlayerGender } from "#enums/player-gender";
import { TextStyle } from "#enums/text-style";
import i18next from "i18next";

export default class AchvBanner extends Phaser.GameObjects.Container {
  private defaultWidth: number;
  private defaultHeight: number;
  private bannerScale: number = CANVAS_SCALE / 2;

  private bg: Phaser.GameObjects.NineSlice;
  private icon: Phaser.GameObjects.Sprite;
  private titleText: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;

  private achv: Achievement;

  public shown: boolean;
  public tween: Phaser.Tweens.Tween;

  constructor(achievement: Achievement) {
    super(globalScene, GAME_WIDTH, GAME_HEIGHT);
    this.achv = achievement;
    this.setup();
  }

  setup(): void {
    this.defaultWidth = 200;
    this.defaultHeight = 40;

    this.bg = globalScene.add
      .nineslice(0, 0, "achv_bar", undefined, this.defaultWidth, this.defaultHeight, 41, 6, 16, 4)
      .setOrigin(0);

    this.add(this.bg);

    this.icon = globalScene.add.sprite(4, 4, "items").setOrigin(0);
    this.add(this.icon);

    this.titleText = addTextObject(40, 3, "", TextStyle.MESSAGE, { fontSize: "72px" }).setOrigin(0);
    this.add(this.titleText);

    this.descriptionText = addTextObject(43, 16, "", TextStyle.WINDOW_ALT, { fontSize: "72px" })
      .setOrigin(0)
      .setWordWrapWidth(664)
      .setLineSpacing(-5);

    this.add([this.bg, this.icon, this.titleText, this.descriptionText]);

    this.loadAchievement();
    this.setScale(this.bannerScale);
    this.setX(GAME_WIDTH * CANVAS_SCALE + 9);
  }

  private loadAchievement(): void {
    this.bg.setTexture("achv_bar");
    this.icon.setFrame(this.achv.iconKey);
    this.titleText.setText(this.getName());
    this.descriptionText.setText(this.getDescription());

    // Take the width of the default interface or the title if longest
    this.bg.width = Math.max(this.defaultWidth, this.icon.displayWidth + this.titleText.displayWidth + 16);

    this.descriptionText.width = this.bg.width - this.icon.displayWidth - 16;
    this.descriptionText.setWordWrapWidth(this.descriptionText.width * 6);

    // Take the height of the default interface or the description if longest
    this.bg.height = Math.max(
      this.defaultHeight,
      this.titleText.displayHeight + this.descriptionText.displayHeight + 8,
    );
    this.icon.y = this.bg.height / 2 - this.icon.height / 2;

    this.tween = globalScene.tweens.add({
      targets: this,
      x: (GAME_WIDTH - this.bg.width) * (CANVAS_SCALE * 2) - 72,
      duration: 500,
      ease: "Sine.easeOut",
      yoyo: true,
      paused: true,
      onStart: () => {
        this.setVisible(true);
        globalScene.add.existing(this);
        globalScene.audioManager.playSound("se/achv");
      },
      hold: 10000,
      completeDelay: 100,
      onComplete: () => achievementsBus.emit("achievements/queue_next_banner"),
    });
  }

  /**
   * Get the name of the achievement based on the gender of the player
   * @returns the name of the achievement localized for the player gender
   */
  private getName(): string {
    const playerGender = settings.display.playerGender ?? PlayerGender.MALE;
    const genderStr = PlayerGender[playerGender].toLowerCase();
    // Localization key is used to get the name of the achievement
    return i18next.t(`achv:${this.achv.localizationInformation.nameKey}.name`, { context: genderStr });
  }

  /**
   * Get the description of the achievement based on the gender of the player
   * @returns the description of the achievement localized for the player gender
   */
  private getDescription(): string {
    const playerGender = settings.display.playerGender ?? PlayerGender.MALE;
    const genderStr = PlayerGender[playerGender].toLowerCase();
    const locOptions = { context: genderStr, ...(this.achv.localizationInformation.descriptionArgs ?? {}) };
    return i18next.t(`achv:${this.achv.localizationInformation.descriptionKey}.description`, locOptions);
  }

  protected hide(): void {
    if (!this.shown) {
      return;
    }
  }
}
