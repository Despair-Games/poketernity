import { globalScene } from "#app/global-scene";
import { GAME_WIDTH } from "#constants/ui-constants";
import { Button } from "#enums/button";
import { Device } from "#enums/device";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import { getIconWithSettingName } from "#inputs/config-handler";
import { InputInterfaceConfig, InputKeys, InputSettings } from "#types/input-interface-config";
import { SettingsCategory, SettingsUiItem } from "#types/settings";
import { BindingUiHandler } from "#ui/binding-ui-handler";
import { SettingsUiHandler } from "#ui/settings-ui-handler";
import { TextListContainer } from "#ui/text-list-container";
import { getBBCodeFragment } from "#ui/text-utils";
import { isNil } from "#utils/common-utils";
import { camelizeString } from "#utils/string-utils";
import i18next from "i18next";

/**
 * Abstract class representing the settings UI handler for controls of a specific input type,
 * including control remapping.
 */
export abstract class ControlsSettingsUiHandler<
  K extends InputKeys,
  S extends InputSettings,
> extends SettingsUiHandler {
  /** Single text object for all "press action to bind" labels. */
  private mappingValuesText: TextListContainer;
  /** Rotating array of sprites for the button mappings. */
  private mappingIcons: Phaser.GameObjects.Sprite[];

  protected bindingUiMode: UiMode;
  protected device: Device;

  protected bindingText: string = i18next.t("settings:pressToBind");
  protected buttonsTextureMap: string;

  constructor(
    mode: UiMode,
    category: SettingsCategory,
    uiItems: SettingsUiItem[],
    device: Device,
    bindingMode: UiMode,
  ) {
    super(mode, category, uiItems, true);

    this.bindingUiMode = bindingMode;
    this.device = device;
    this.mappingIcons = [];
  }

  protected override setup() {
    super.setup();

    // Add instructions to reset all bindings
    this.addInstructionText("BUTTON_HOME", i18next.t("settings:reset"));

    // "Press action to bind" text, to be added in a single TextListContainer for performance
    const xPosition = this.labelsTextList.x + GAME_WIDTH - 24;
    const yPosition = this.labelsTextList.y;
    this.mappingValuesText = new TextListContainer(xPosition, yPosition, TextStyle.SETTINGS_VALUE, this.rowsToDisplay, {
      textAlign: "right",
    });
    this.optionsContainer.add(this.mappingValuesText);

    // Hide the options until a controller is plugged in
    this.optionsContainer.setVisible(false);
  }

  protected override displaySettingsOptions(): void {
    super.displaySettingsOptions();
    this.updateBindingIcons();
  }

  /**
   * Update the icons for the bindings currently shown on screen.
   * Reuses existing sprites if they exist, otherwise initializes them.
   */
  private updateBindingIcons(): void {
    const config = globalScene.inputController.getActiveConfig(this.device);
    if (!config) {
      return;
    }

    const settingOffset = this.scrollCursor - this.uiItems.length;
    for (let i = 0; i < this.rowsToDisplay; i++) {
      let icon = this.mappingIcons[i];
      if (!icon) {
        icon = globalScene.add.sprite(GAME_WIDTH * 0.45, 30 + i * 16, this.buttonsTextureMap ?? config.padType);
        icon.setOrigin(0.5, 0);
        this.mappingIcons[i] = icon;
        this.optionsContainer.add(icon);
      }
      icon.setVisible(false);

      // If the row corresponds to a mapping setting, set the correct frame and show the icon.
      if (i + this.scrollCursor >= this.uiItems.length) {
        const settingKey = Object.keys(config.settings)[i + settingOffset];
        const frame = getIconWithSettingName(config, settingKey);
        if (!isNil(frame)) {
          icon.setVisible(true);
          icon.setFrame(getIconWithSettingName(config, settingKey));
        }
      }
    }
  }

  protected initBindings(): void {
    const config: InputInterfaceConfig<K, S> = globalScene.inputController.getActiveConfig(this.device);
    if (!config) {
      return;
    }

    const settingLabels: string[] = [];
    const settingValues: string[] = [];
    for (const uiItem of this.uiItems) {
      const label = uiItem.label + (uiItem.requiresReload ? "*" : "");
      settingLabels.push(getBBCodeFragment(label, TextStyle.SETTINGS_LABEL, true));
      settingValues.push("");
    }

    for (const key of Object.keys(config.settings)) {
      // Convert the setting key from format 'Key_Name' to 'Key name' for display.
      const settingName = key.replace(/_/g, " ").toLowerCase();

      const isLock = config.settingsBlacklist?.includes(key as S);
      const labelStyle = isLock ? TextStyle.SETTINGS_LOCKED : TextStyle.SETTINGS_LABEL;

      let labelText: string;
      const i18nKey = camelizeString(settingName.replace("alt ", ""));
      if (settingName.includes("alt")) {
        labelText = `${i18next.t(`settings:${i18nKey}`)}${i18next.t("settings:alt")}`;
      } else {
        labelText = i18next.t(`settings:${i18nKey}`);
      }
      settingLabels.push(getBBCodeFragment(labelText, labelStyle, true));
      settingValues.push(isLock ? "" : this.bindingText);
    }
    this.labelsTextList.setList(settingLabels);
    this.mappingValuesText.setList(settingValues);
    this.setTotalRows(settingLabels.length);

    // Update textures for the binding icons
    for (const icon of this.mappingIcons) {
      icon.setTexture(config.padType);
    }

    this.displaySettingsOptions();
    if (this.active) {
      this.updateInstructionIcons();
    }
  }

  protected override setScrollCursor(scrollCursor: number): boolean {
    const result = super.setScrollCursor(scrollCursor);
    if (this.mappingValuesText && result) {
      return this.mappingValuesText.setCursor(scrollCursor);
    }
    return result;
  }

  protected override setTotalRows(rows: number): void {
    super.setTotalRows(rows);

    if (this.mappingValuesText) {
      this.mappingValuesText.setMaxLines(this.rowsToDisplay, true);
    }
  }

  public override processInput(button: Button): boolean {
    const config: InputInterfaceConfig<K, S> = globalScene.inputController.getActiveConfig(this.device);

    if (config && button === Button.ACTION && this.cursor + this.scrollCursor >= this.uiItems.length) {
      const settingIndex = this.cursor + this.scrollCursor - this.uiItems.length;
      const settingKey = Object.keys(config.settings)[settingIndex] as S;

      console.log(settingKey, Object.keys(config.settings)[settingIndex], config.settingsBlacklist);

      // Cannot remap blacklisted buttons
      if (config.settingsBlacklist?.includes(settingKey)) {
        globalScene.ui.playError();
        return false;
      }

      const callback = (success: boolean = false): boolean => {
        globalScene.ui.revertMode();
        if (success) {
          this.updateBindingIcons();
          this.updateInstructionIcons();
        }
        return success;
      };

      globalScene.ui.setOverlayMode<BindingUiHandler>(this.bindingUiMode, settingKey, callback);
      return true;
    }

    return super.processInput(button);
  }
}
