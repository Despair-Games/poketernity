import { globalScene } from "#app/global-scene";
import { EggHatchPhase } from "#app/phases/egg-hatch-phase";
import { GAME_HEIGHT } from "#app/ui-constants";
import { Button } from "#enums/buttons";
import { UiMode } from "#enums/ui-mode";
import { UiHandler } from "./abstract-ui-handler";

export class EggHatchSceneUiHandler extends UiHandler {
  public eggHatchContainer: Phaser.GameObjects.Container;

  /**
   * Allows subscribers to listen for events
   *
   * Current Events:
   * - {@linkcode EggEventType.EGG_COUNT_CHANGED} {@linkcode EggCountChangedEvent}
   */
  public readonly eventTarget: EventTarget = new EventTarget();

  constructor() {
    super(UiMode.EGG_HATCH_SCENE);
  }

  setup() {
    this.eggHatchContainer = globalScene.add.container(0, -GAME_HEIGHT);
    globalScene.fieldUI.add(this.eggHatchContainer);

    const eggLightraysAnimFrames = globalScene.anims.generateFrameNames("egg_lightrays", { start: 0, end: 3 });
    if (!globalScene.anims.exists("egg_lightrays")) {
      globalScene.anims.create({
        key: "egg_lightrays",
        frames: eggLightraysAnimFrames,
        frameRate: 32,
      });
    }
  }

  override show(): boolean {
    super.show();

    this.getUi().showText("", 0);

    globalScene.setModifiersVisible(false);

    return true;
  }

  processInput(button: Button): boolean {
    if (button === Button.ACTION || button === Button.CANCEL) {
      const phase = globalScene.getCurrentPhase();
      if (phase instanceof EggHatchPhase && phase.trySkip()) {
        return true;
      }
    }

    return globalScene.ui.getMessageHandler().processInput(button);
  }

  override setCursor(_cursor: number): boolean {
    return false;
  }

  override clear() {
    super.clear();
    this.eggHatchContainer.removeAll(true);
    this.getUi().hideTooltip();
  }
}
