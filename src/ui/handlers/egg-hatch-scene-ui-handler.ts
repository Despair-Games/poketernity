import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT } from "#constants/ui-constants";
import { Button } from "#enums/button";
import { UiMode } from "#enums/ui-mode";
import { EggHatchPhase } from "#phases/egg-hatch-phase";
import { UiHandler } from "#ui/ui-handler";

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

  protected override setup() {
    this.eggHatchContainer = globalScene.add.container(0, -GAME_HEIGHT);
    globalScene.fieldUI.add(this.eggHatchContainer);

    if (!globalScene.anims.exists("egg_lightrays")) {
      const eggLightraysAnimFrames = globalScene.anims.generateFrameNames("egg_lightrays", { start: 0, end: 3 });
      globalScene.anims.create({
        key: "egg_lightrays",
        frames: eggLightraysAnimFrames,
        frameRate: 32,
      });
    }
  }

  protected override tearDown(): void {
    this.eggHatchContainer.destroy();
    globalScene.anims.remove("egg_lightrays");
  }

  public override show(): boolean {
    globalScene.ui.showText("", { delay: 0 });

    globalScene.setModifiersVisible(false);

    return true;
  }

  protected override clear() {
    this.eggHatchContainer.removeAll(true);
    this.getUi().hideTooltip();
  }

  public override processInput(button: Button): boolean {
    if (button === Button.ACTION || button === Button.CANCEL) {
      const phase = globalScene.phaseManager.getCurrentPhase();
      if (phase instanceof EggHatchPhase && phase.trySkip()) {
        return true;
      }
    }

    return globalScene.ui.getMessageHandler()?.processInput(button) ?? false;
  }

  public override setCursor(_cursor: number): boolean {
    return false;
  }

  /**
   * Prepare the handler to display another egg without changing ui mode.
   */
  public prepareForNextEgg() {
    this.clear();
  }
}
