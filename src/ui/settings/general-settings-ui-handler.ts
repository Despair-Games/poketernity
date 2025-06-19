import { globalScene } from "#app/global-scene";
import { SettingsUiHandler } from "#ui/settings-ui-handler";
import { generalSettingsUiItems } from "#ui/settings-ui-items";
import { hasTouchscreen, isLandscapeMode } from "#utils/app-utils";
import { t } from "i18next";
import Phaser from "phaser";

export class GeneralSettingsUiHandler extends SettingsUiHandler {
  /** Buffer to be able to unsubscribe on {@linkcode tearDown} */
  private onOrientationChange = () => this.updateMoveTouchControlsSettingsLabel();

  constructor() {
    super("general", generalSettingsUiItems);
  }

  protected override setup(): void {
    super.setup();

    if (hasTouchscreen()) {
      globalScene.scale.on(Phaser.Scale.Events.ORIENTATION_CHANGE, this.onOrientationChange);
    }
  }

  protected override tearDown(): void {
    // Always remove listener. No error is thrown if listener was never present
    globalScene.scale.off(Phaser.Scale.Events.ORIENTATION_CHANGE, this.onOrientationChange);
    super.tearDown();
  }

  public override show(): boolean {
    super.show();

    if (hasTouchscreen()) {
      this.updateMoveTouchControlsSettingsLabel();
    }
    return true;
  }

  private updateMoveTouchControlsSettingsLabel() {
    if (!hasTouchscreen()) {
      return;
    }

    const settingIndex = this.uiItems.findIndex((uiItem) => uiItem.key === "moveTouchControls");
    if (settingIndex === -1) {
      console.warn("Could not find moveTouchControls setting label!");
      return;
    }

    this.updateOptionValueLabel(
      settingIndex,
      0,
      isLandscapeMode(globalScene) ? t("settings:landscape") : t("settings:portrait"),
    );
  }
}
