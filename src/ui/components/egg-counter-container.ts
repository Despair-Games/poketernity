import { globalScene } from "#app/global-scene";
import { addWindow } from "../ui-theme";
import { addTextObject } from "#app/ui/text/text-utils";
import { TextStyle } from "#enums/text-style";
import type { EggCountChangedEvent } from "#app/events/egg";
import { EggEventType } from "#enums/egg-event-type";
import type { EggHatchSceneUiHandler } from "../handlers/egg-hatch-scene-ui-handler";

/**
 * A container that displays the count of hatching eggs.
 * @extends Phaser.GameObjects.Container
 */
export class EggCounterContainer extends Phaser.GameObjects.Container {
  private readonly WINDOW_DEFAULT_WIDTH = 40;
  private readonly WINDOW_MEDIUM_WIDTH = 46;
  private readonly WINDOW_HEIGHT = 26;
  private readonly onEggCountChangedEvent = (event: Event) => this.onEggCountChanged(event);

  private eggCount: number;
  private eggCountWindow: Phaser.GameObjects.NineSlice;
  public eggCountText: Phaser.GameObjects.Text;

  /**
   * @param eggCount - The number of eggs to hatch.
   */
  constructor(eggCount: number) {
    super(globalScene, 0, 0);
    this.eggCount = eggCount;

    const uiHandler = globalScene.ui.getHandler() as EggHatchSceneUiHandler;

    uiHandler.eventTarget.addEventListener(EggEventType.EGG_COUNT_CHANGED, this.onEggCountChangedEvent);
    this.setup();
  }

  /**
   * Sets up the container, creating the window, egg sprite, and egg count text.
   */
  private setup(): void {
    const windowWidth = this.eggCount > 9 ? this.WINDOW_MEDIUM_WIDTH : this.WINDOW_DEFAULT_WIDTH;

    this.eggCountWindow = addWindow(1, 1, windowWidth, this.WINDOW_HEIGHT);
    this.setVisible(this.eggCount > 1);

    this.add(this.eggCountWindow);

    const eggSprite = globalScene.add.sprite(10, 1 + this.WINDOW_HEIGHT / 2, "egg", "egg_0");
    eggSprite.setScale(0.4);
    eggSprite.setOrigin(0, 0.5);

    this.eggCountText = addTextObject(26, 1 + this.WINDOW_HEIGHT / 2, `${this.eggCount}`, TextStyle.WINDOW);
    this.eggCountText.setName("text-egg-count");
    this.eggCountText.setOrigin(0, 0.5);

    this.add(eggSprite);
    this.add(this.eggCountText);
  }

  /**
   * Resets the window size to the default width and height.
   */
  private setWindowToDefaultSize(): void {
    this.eggCountWindow.setSize(this.WINDOW_DEFAULT_WIDTH, this.WINDOW_HEIGHT);
  }

  /**
   * Handles window size, the egg count to show, and whether it should be displayed.
   *
   * @param event {@linkcode Event} being sent
   */
  private onEggCountChanged(event: Event): void {
    const eggCountChangedEvent = event as EggCountChangedEvent;
    if (!eggCountChangedEvent || !this.eggCountText?.data) {
      return;
    }

    const eggCount = eggCountChangedEvent.eggCount;

    if (eggCount < 10) {
      this.setWindowToDefaultSize();
    }

    if (eggCount > 0) {
      this.eggCountText.setText(eggCount.toString());
    } else {
      this.eggCountText.setVisible(false);
    }
  }
}
