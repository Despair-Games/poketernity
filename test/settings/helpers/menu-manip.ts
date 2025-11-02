import { SettingKeyboard } from "#enums/setting-keyboard";
import {
  assign,
  canAssignKey,
  canOverrideOrDeleteSetting,
  deleteBind,
  getIconWithKeycode,
  getIconWithSettingName,
  getKeyWithKeycode,
  getSettingNameWithKeycode,
} from "#utils/inputs-utils";
import { expect } from "vitest";

export class MenuManip {
  private readonly config;
  private settingName;
  private keycode;
  private iconDisplayed;

  constructor(config) {
    this.config = config;
    this.settingName = null;
    this.iconDisplayed = null;
  }

  convertNameToButtonString(input) {
    // Check if the input starts with "Alt_Button"
    if (input.startsWith("Alt_Button")) {
      // Return the last part in uppercase
      return input.split("_").pop().toUpperCase();
    }

    // Split the input string by underscore
    const parts = input.split("_");

    // Skip the first part and join the rest with an underscore
    const result = parts
      .slice(1)
      .map((part) => part.toUpperCase())
      .join("_");

    return result;
  }

  whenCursorIsOnSetting(settingName) {
    if (!settingName.includes("Button_")) {
      settingName = "Button_" + settingName;
    }
    this.settingName = SettingKeyboard[settingName];
    return this;
  }

  iconDisplayedIs(icon) {
    if (!icon.toUpperCase().includes("KEY_")) {
      icon = "KEY_" + icon.toUpperCase();
    }
    this.iconDisplayed = this.config.icons[icon];
    expect(getIconWithSettingName(this.config, this.settingName)).toEqual(this.iconDisplayed);
    return this;
  }

  thereShouldBeNoIconAnymore() {
    const icon = getIconWithSettingName(this.config, this.settingName);
    expect(icon === undefined).toEqual(true);
    return this;
  }

  thereShouldBeNoIcon() {
    return this.thereShouldBeNoIconAnymore();
  }

  nothingShouldHappen() {
    const settingName = getSettingNameWithKeycode(this.config, this.keycode);
    expect(settingName).toEqual(-1);
    return this;
  }

  // TODO: evaluate `!`s for correctness
  weWantThisBindInstead(keycode) {
    this.keycode = Phaser.Input.Keyboard.KeyCodes[keycode];
    const icon = getIconWithKeycode(this.config, this.keycode)!;
    const key = getKeyWithKeycode(this.config, this.keycode)!;
    const _keys = key.toLowerCase().split("_");
    const iconIdentifier = _keys.at(-1)!;
    expect(icon.toLowerCase().includes(iconIdentifier)).toEqual(true);
    return this;
  }

  whenWeDelete(settingName?: string) {
    this.settingName = settingName ? SettingKeyboard[settingName] : this.settingName;
    // const key = getKeyWithSettingName(this.config, this.settingName);
    deleteBind(this.config, this.settingName);
    // expect(this.config.custom[key]).toEqual(-1);
    return this;
  }

  whenWeTryToDelete(settingName?: string) {
    this.settingName = settingName ? SettingKeyboard[settingName] : this.settingName;
    deleteBind(this.config, this.settingName);
    return this;
  }

  confirmAssignment() {
    assign(this.config, this.settingName, this.keycode);
  }

  butLetsForceIt() {
    this.confirm();
  }

  confirm() {
    assign(this.config, this.settingName, this.keycode);
  }

  weCantAssignThisKey() {
    const key = getKeyWithKeycode(this.config, this.keycode)!;
    expect(canAssignKey(this.config, key)).toEqual(false);
    return this;
  }

  weCantOverrideThisBind() {
    expect(canOverrideOrDeleteSetting(this.config, this.settingName)).toEqual(false);
    return this;
  }

  weCantDelete() {
    expect(canOverrideOrDeleteSetting(this.config, this.settingName)).toEqual(false);
    return this;
  }
}
