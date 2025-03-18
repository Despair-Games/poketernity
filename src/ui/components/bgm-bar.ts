import { addTextObject } from "#app/ui/text/text-utils";
import { TextStyle } from "#enums/text-style";
import i18next from "i18next";
import { formatText } from "#app/utils";
import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { TEXT_SCALE } from "#app/ui-constants";

const hiddenX = -150;
const shownX = 0;
const baseY = 0;

export class BgmBar extends Phaser.GameObjects.Container {
  private maxWidth: number;
  private maxHeight: number;

  private bg: Phaser.GameObjects.NineSlice;
  private musicText: Phaser.GameObjects.Text;

  public shown: boolean;

  constructor() {
    super(globalScene, hiddenX, baseY);
  }

  setup(): void {
    this.maxWidth = 150;
    this.maxHeight = 100;

    this.bg = globalScene.add.nineslice(-5, -5, "bgm_bar", undefined, this.maxWidth, this.maxHeight, 0, 0, 10, 10);
    this.bg.setOrigin(0, 0);

    this.add(this.bg);

    this.musicText = addTextObject(5, 5, "", TextStyle.NOTIFICATION_BAR_LIGHT);
    this.musicText.setOrigin(0, 0);
    this.musicText.setWordWrapWidth((this.maxWidth - 12) * TEXT_SCALE);

    this.add(this.musicText);

    this.setVisible(false);
    this.shown = false;
  }

  /*
   * Set the BGM Name to the BGM bar.
   * @param bgmName The name of the BGM to set.
   */
  setBgmToBgmBar(bgmName: string): void {
    this.musicText.setText(`${i18next.t("bgmName:music")}${this.getRealBgmName(bgmName)}`);

    this.bg.width = Math.min(this.maxWidth, this.musicText.displayWidth + 23);
    this.bg.height = Math.min(this.maxHeight, this.musicText.displayHeight + 20);

    globalScene.fieldUI.bringToTop(this);

    this.y = baseY;
  }

  /*
    Show or hide the BGM bar.
    @param visible Whether to show or hide the BGM bar.
   */
  public toggleBgmBar(visible: boolean): void {
    /*
      Prevents the bar from being displayed if musicText is completely empty.
      This can be the case, for example, when the game's 1st music track takes a long time to reach the client,
      and the menu is opened before it is played.
    */
    if (this.musicText.text === "") {
      this.setVisible(false);
      return;
    }

    if (!settings.display.showBgmBar) {
      this.setVisible(false);
      return;
    }
    globalScene.tweens.add({
      targets: this,
      x: visible ? shownX : hiddenX,
      duration: 500,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.setVisible(true);
      },
    });
  }

  getRealBgmName(bgmName: string): string {
    return i18next.t([`bgmName:${bgmName}`, "bgmName:missing_entries"], { name: formatText(bgmName) });
  }
}
