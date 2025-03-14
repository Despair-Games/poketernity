import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT } from "#app/ui-constants";
import { TextStyle } from "#enums/text-style";
import type { TimedEvent } from "#app/@types/TimedEvent";
import i18next from "i18next";
import { addTextObject } from "#app/ui/text/text-utils";

export class TimedEventDisplay extends Phaser.GameObjects.Container {
  private event?: TimedEvent;

  private availableWidth: number;
  private eventTimerText?: Phaser.GameObjects.Text;
  private banner?: Phaser.GameObjects.Image;
  private eventTimer: NodeJS.Timeout | null;

  constructor(x: number, y: number, availableBannerWidth: number) {
    super(globalScene, x, y);
    this.availableWidth = availableBannerWidth;
    this.setVisible(false);
  }

  public setEvent(event: TimedEvent | undefined) {
    this.event = event;
    if (!this.displayBannerAndTimer()) {
      this.clear();
    }
  }

  /**
   * Show the banner and timer for the current event if applicable
   * @returns `true` if the event could get shown, `false` otherwise
   */
  private displayBannerAndTimer(): boolean {
    if (!this.event || !this.event.banner) {
      return false;
    }
    const { key, xOffset, yOffset, showTimer } = this.event.banner;
    const padding = 5;
    const xPosition = Math.floor(this.availableWidth / 2 + (xOffset ?? 0));
    const yPosition = GAME_HEIGHT - padding - (showTimer ? 10 : 0) - (yOffset ?? 0);
    if (!this.banner) {
      this.banner = globalScene.add.image(xPosition, yPosition - padding, key);
      this.banner.setName("img-event-banner");
      this.banner.setOrigin(0.5, 1);
      this.add(this.banner);
    } else {
      this.banner.setTexture(key);
      this.banner.setVisible(true);
    }
    if (showTimer) {
      if (!this.eventTimerText) {
        this.eventTimerText = addTextObject(
          this.banner.x,
          this.banner.y + 2,
          this.timeToGo(this.event.endDate),
          TextStyle.WINDOW,
        );
        this.eventTimerText.setName("text-event-timer");
        this.eventTimerText.setOrigin(0.5, 0);
        this.add(this.eventTimerText);
      } else {
        this.eventTimerText.setText(this.timeToGo(this.event.endDate));
        this.eventTimerText.setVisible(true);
      }
    }
    return true;
  }

  public show() {
    this.setVisible(true);
    this.updateCountdown();

    this.eventTimer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  public hide() {
    this.clear();
  }

  public clear() {
    this.setVisible(false);
    this.banner?.setVisible(false);
    this.eventTimerText?.setVisible(false);
    this.eventTimer && clearInterval(this.eventTimer);
    this.eventTimer = null;
  }

  private timeToGo(date: Date) {
    // Utility to add leading zero
    function z(n) {
      return (n < 10 ? "0" : "") + n;
    }
    const now = new Date();
    const diff = Math.max(date.getTime() - now.getTime(), 0); // Make sure the timer does not keep counting past zero

    // Get time components
    const days = (diff / 8.64e7) | 0;
    const hours = ((diff % 8.64e7) / 3.6e6) | 0;
    const mins = ((diff % 3.6e6) / 6e4) | 0;
    const secs = Math.round((diff % 6e4) / 1e3);

    // Return formatted string
    return i18next.t("menu:eventTimer", { days: z(days), hours: z(hours), mins: z(mins), secs: z(secs) });
  }

  updateCountdown() {
    if (this.eventTimerText && this.event?.banner?.showTimer) {
      this.eventTimerText.setText(this.timeToGo(this.event.endDate));
    }
  }
}
