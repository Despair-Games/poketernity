import { globalScene } from "#app/global-scene";
import { generalSettingsUiItems } from "#app/ui/settings/settings-ui-items";
import { hasTouchscreen, isLandscapeMode } from "#app/utils/app-utils";
import { t } from "i18next";
import { AbstractSettingsUiHandler } from "./abstract-settings-ui-handler";

export class GeneralSettingsUiHandler extends AbstractSettingsUiHandler {
  private onWindowResizeEvent = () => this.updateMoveTouchControlsSettingsLabel();

  constructor() {
    super("general", generalSettingsUiItems);
  }

  protected override setup(): void {
    super.setup();

    if (hasTouchscreen()) {
      // TODO: we should user Phaser's scale 'orientationchange' event instead
      window.addEventListener("resize", this.onWindowResizeEvent);
    }
  }

  protected override tearDown(): void {
    if (hasTouchscreen()) {
      window.removeEventListener("resize", this.onWindowResizeEvent);
    }
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
    if (!hasTouchscreen()) return;

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
