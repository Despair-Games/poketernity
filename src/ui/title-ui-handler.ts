import { UiMode } from "#enums/ui-mode";
import { fixedNumber, randItem } from "#app/utils";
import { addTextObject } from "#app/ui/text";
import { TextStyle } from "#enums/text-style";
import { getSplashMessages } from "#app/data/splash-messages";
import i18next from "i18next";
import { TimedEventDisplay } from "#app/ui/timed-event-display";
import { version } from "../../package.json";
import { api } from "#app/plugins/api/api";
import { globalScene } from "#app/global-scene";
import OptionSelectUiHandler from "#app/ui/option-select-ui-handler";
import { GAME_HEIGHT, GAME_WIDTH } from "#app/ui-constants";
import { timedEventManager } from "#app/timed-event-manager";

export default class TitleUiHandler extends OptionSelectUiHandler {
  /** If the stats can not be retrieved, use this fallback value */
  private static readonly BATTLES_WON_FALLBACK: number = -99999999;

  private titleContainer: Phaser.GameObjects.Container;
  private playerCountLabel: Phaser.GameObjects.Text;
  private splashMessage: string;
  private splashMessageText: Phaser.GameObjects.Text;
  private appVersionText: Phaser.GameObjects.Text;
  private eventDisplay?: TimedEventDisplay;

  private titleStatsTimer: NodeJS.Timeout | null;

  constructor(mode: UiMode = UiMode.TITLE) {
    super(mode);
  }

  override setup() {
    super.setup();

    const ui = this.getUi();

    this.titleContainer = globalScene.add.container(0, -GAME_HEIGHT);
    this.titleContainer.setName("title");
    this.titleContainer.setAlpha(0);
    ui.add(this.titleContainer);

    const logo = globalScene.add.image(GAME_WIDTH / 2, 8, "logo");
    logo.setOrigin(0.5, 0);
    this.titleContainer.add(logo);

    this.playerCountLabel = addTextObject(
      GAME_WIDTH - 5,
      0,
      `? ${i18next.t("menu:playersOnline")}`,
      TextStyle.TITLE_SCREEN,
    );
    this.playerCountLabel.setOrigin(1, 1);
    this.titleContainer.add(this.playerCountLabel);

    this.splashMessageText = addTextObject(logo.x + 64, logo.y + logo.displayHeight - 8, "", TextStyle.TITLE_SCREEN);
    this.splashMessageText.setOrigin(0.5, 0.5);
    this.splashMessageText.setAngle(-20);
    this.titleContainer.add(this.splashMessageText);

    const originalSplashMessageScale = this.splashMessageText.scale;

    globalScene.tweens.add({
      targets: this.splashMessageText,
      duration: fixedNumber(350),
      scale: originalSplashMessageScale * 1.25,
      loop: -1,
      yoyo: true,
    });

    this.appVersionText = addTextObject(logo.x - 60, logo.y + logo.displayHeight + 4, "", TextStyle.TITLE_SCREEN);
    this.appVersionText.setOrigin(0.5, 0.5);
    this.appVersionText.setAngle(0);
    this.titleContainer.add(this.appVersionText);
  }

  updateTitleStats(): void {
    api
      .getGameTitleStats()
      .then((stats) => {
        if (stats) {
          this.playerCountLabel.setText(`${stats.playerCount} ${i18next.t("menu:playersOnline")}`);
          if (this.splashMessage === "splashMessages:battlesWon") {
            this.splashMessageText.setText(i18next.t(this.splashMessage, { count: stats.battleCount }));
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch title stats:\n", err);
      });
  }

  override show(args: any[]): boolean {
    const ret = super.show(args);

    if (ret) {
      this.splashMessage = randItem(getSplashMessages());
      this.splashMessageText.setText(i18next.t(this.splashMessage, { count: TitleUiHandler.BATTLES_WON_FALLBACK }));

      this.appVersionText.setText("v" + version);

      const ui = this.getUi();

      const activeBannerEvent = timedEventManager.getActiveEvent(true);
      if (activeBannerEvent) {
        if (!this.eventDisplay) {
          const availableBannerWidth = GAME_WIDTH - this.optionSelectBg.width - this.optionSelectBg.x;
          this.eventDisplay = new TimedEventDisplay(0, 0, availableBannerWidth);
          this.titleContainer.add(this.eventDisplay);
        }
        this.eventDisplay.setEvent(activeBannerEvent);
        this.eventDisplay.show();
      } else {
        this.eventDisplay?.hide();
      }

      this.playerCountLabel.y = GAME_HEIGHT - this.optionSelectBg.height - 3;

      this.updateTitleStats();

      this.titleStatsTimer = setInterval(() => {
        this.updateTitleStats();
      }, 60000);

      globalScene.tweens.add({
        targets: [this.titleContainer, ui.getMessageHandler().bg],
        duration: fixedNumber(325),
        alpha: (target: any) => (target === this.titleContainer ? 1 : 0),
        ease: "Sine.easeInOut",
      });
    }

    return ret;
  }

  override clear(): void {
    super.clear();

    const ui = this.getUi();

    this.eventDisplay?.clear();

    this.titleStatsTimer && clearInterval(this.titleStatsTimer);
    this.titleStatsTimer = null;

    globalScene.tweens.add({
      targets: [this.titleContainer, ui.getMessageHandler().bg],
      duration: fixedNumber(325),
      alpha: (target: any) => (target === this.titleContainer ? 0 : 1),
      ease: "Sine.easeInOut",
    });
  }
}
