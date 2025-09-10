import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { UiMode } from "#enums/ui-mode";
import type { SettingsUiItem } from "#types/settings";
import { SettingsUiHandler } from "#ui/settings-ui-handler";
import { generalSettingsUiItems } from "#ui/settings-ui-items";
import { hasTouchscreen, isLandscapeMode } from "#utils/app-utils";
import { t } from "i18next";
import Phaser from "phaser";

export class GeneralSettingsUiHandler extends SettingsUiHandler {
  /** Buffer to be able to unsubscribe on {@linkcode tearDown} */
  private readonly onOrientationChange = () => this.updateMoveTouchControlsSettingsLabel();

  constructor() {
    super(UiMode.SETTINGS, "general", generalSettingsUiItems);
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

  protected override handleSaveSetting<V = any>(uiItem: SettingsUiItem, newValue: V): void {
    if (uiItem.key === "moveTouchControls" && newValue) {
      eventBus.emit("touchControls/move/start");
      eventBus.once("touchControls/move/end", () => {
        this.setOptionCursor(-1, 0, false);
      });
    } else {
      super.handleSaveSetting(uiItem, newValue);
    }
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
