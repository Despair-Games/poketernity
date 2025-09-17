import type { Button } from "#enums/button";
import { Device } from "#enums/device";
import type { InputInterfaceConfig, InputKeys, InputSettings } from "#types/inputs-types";

// #region Helpers

/**
 * Retrieves the setting name associated with the specified key.
 *
 * @param config - The configuration object containing custom settings.
 * @param key - The key to search for.
 * @returns The setting associated with the specified key, or -1 if none.
 */
function getSettingNameWithKey(config: InputInterfaceConfig, key: InputKeys): InputSettings | -1 {
  return config.custom?.[key] ?? -1;
}

// #endregion
// #region Exports

// TODO: Most of these are only used in the inputs controller and tests,
// should they really be here rather than in the inputs controller?

/**
 * Retrieves the key associated with the specified keycode from the mapping.
 *
 * @param config - The configuration object containing the mapping.
 * @param keycode - The keycode to search for.
 * @returns The key associated with the specified keycode, or undefined if none.
 */
export function getKeyWithKeycode(config: InputInterfaceConfig, keycode: number): InputKeys | undefined {
  return Object.keys(config.deviceMapping).find((key) => config.deviceMapping[key] === keycode) as InputKeys;
}

/**
 * Retrieves the setting name associated with the specified keycode.
 *
 * @param config - The configuration object containing custom settings.
 * @param keycode - The keycode to search for.
 * @returns The setting name associated with the specified keycode, or -1 if there is no mapping
 */
export function getSettingNameWithKeycode(config: InputInterfaceConfig, keycode: number): InputSettings | -1 {
  const key = getKeyWithKeycode(config, keycode);
  return key && config.custom ? config.custom[key] : -1;
}

/**
 * Retrieves the icon associated with the specified keycode.
 *
 * @param config - The configuration object containing icons.
 * @param keycode - The keycode to search for.
 * @returns The icon associated with the specified keycode, or undefined if none.
 */
export function getIconWithKeycode(config: InputInterfaceConfig, keycode: number): string | undefined {
  const key = getKeyWithKeycode(config, keycode);
  return key ? config.icons[key] : undefined;
}

/**
 * Retrieves the button associated with the specified keycode.
 *
 * @param config - The configuration object containing settings.
 * @param keycode - The keycode to search for.
 * @returns The button associated with the specified keycode, or undefined if none.
 */
export function getButtonWithKeycode(config: InputInterfaceConfig, keycode: number): Button | undefined {
  const settingName = getSettingNameWithKeycode(config, keycode);
  return config.settings[settingName];
}

/**
 * Retrieves the key associated with the specified setting name.
 *
 * @param config - The configuration object containing custom settings.
 * @param settingName - The setting name to search for.
 * @returns The key associated with the specified setting name, or undefined if none.
 */
export function getKeyWithSettingName(config: InputInterfaceConfig, settingName: InputSettings): InputKeys | undefined {
  const { custom } = config;
  if (custom == null) {
    return;
  }
  return Object.keys(custom).find((key) => custom[key] === settingName) as InputKeys;
}

/**
 * Retrieves the icon associated with the specified setting name.
 *
 * @param config - The configuration object containing icons.
 * @param settingName - The setting name to search for.
 * @returns The icon associated with the specified setting name.
 */
export function getIconWithSettingName(config: InputInterfaceConfig, settingName: InputSettings): string | undefined {
  const key = getKeyWithSettingName(config, settingName);
  return key ? config.icons[key] : undefined;
}

/* TODO: refactor this function. It should probably be part of inputsController to have access to its configs directly
 * and remove the need for the configs parameter. It's only called from the inputs controller and tests,
 * and shouldn't be exported/made public just for tests. */
export function getIconForLatestInput(
  configs: Record<Device, InputInterfaceConfig | undefined>,
  source: string,
  settingName: InputSettings,
): string | undefined {
  let config: InputInterfaceConfig | undefined;
  if (source === "gamepad") {
    config = configs[Device.GAMEPAD];
  } else {
    config = configs[Device.KEYBOARD];
  }
  if (!config) {
    return;
  }

  const icon = getIconWithSettingName(config, settingName);
  if (!icon) {
    const isAlt = settingName.startsWith("ALT_");
    let altSettingName: InputSettings;
    if (isAlt) {
      altSettingName = settingName.slice(4) as InputSettings;
    } else {
      altSettingName = `ALT_${settingName}` as InputSettings;
    }
    return getIconWithSettingName(config, altSettingName);
  }
  return icon;
}

export function assign(config: InputInterfaceConfig, settingNameTarget: InputSettings, keycode: number): boolean {
  // first, we need to check if this keycode is already used on another settingName
  const key = getKeyWithKeycode(config, keycode);
  if (!config.custom || !key || !canAssignKey(config, key) || !canOverrideOrDeleteSetting(config, settingNameTarget)) {
    return false;
  }
  const previousSettingName = getSettingNameWithKeycode(config, keycode);
  // if it was already bound, we delete the bind
  if (previousSettingName !== -1) {
    const previousKey = getKeyWithSettingName(config, previousSettingName);
    if (previousKey) {
      config.custom[previousKey] = -1;
    }
  }
  // then, we need to delete the current key for this settingName
  const currentKey = getKeyWithSettingName(config, settingNameTarget);
  if (currentKey) {
    config.custom[currentKey] = -1;
  }

  // then, the new key is assigned to the new settingName
  const newKey = getKeyWithKeycode(config, keycode);
  if (newKey) {
    config.custom[newKey] = settingNameTarget;
  }
  return true;
}

export function swap(config: InputInterfaceConfig, settingNameTarget: InputSettings, keycode: number): boolean {
  // only for gamepad
  if (config.padType === "keyboard" || config.custom == null) {
    return false;
  }
  const prev_key = getKeyWithSettingName(config, settingNameTarget);
  const prev_settingName = prev_key ? getSettingNameWithKey(config, prev_key) : -1;

  const new_key = getKeyWithKeycode(config, keycode);
  const new_settingName = new_key ? getSettingNameWithKey(config, new_key) : -1;

  if (prev_key) {
    config.custom[prev_key] = new_settingName;
  }
  if (new_key) {
    config.custom[new_key] = prev_settingName;
  }
  return true;
}

/**
 * Deletes the existing binding of the specified setting name unless it is a locked binding.
 *
 * @param config - The configuration object containing custom settings.
 * @param settingName - The setting name to delete.
 * @returns `true` if the binding was deleted succcessfully, `false` otherwise.
 */
export function deleteBind(config: InputInterfaceConfig, settingName: InputSettings): boolean {
  const key = getKeyWithSettingName(config, settingName);
  if (config.custom == null || key == null || !canOverrideOrDeleteSetting(config, settingName)) {
    return false;
  }
  config.custom[key] = -1;
  return true;
}

export function canAssignKey(config: InputInterfaceConfig, key: InputKeys): boolean {
  const settingName = getSettingNameWithKey(config, key);
  if (config.keysBlacklist?.includes(key) || (settingName !== -1 && config.settingsBlacklist?.includes(settingName))) {
    return false;
  }
  return true;
}

export function canOverrideOrDeleteSetting(config: InputInterfaceConfig, settingName: InputSettings): boolean {
  const { settingsBlacklist, keysBlacklist } = config;
  const key = getKeyWithSettingName(config, settingName);
  // If the setting is mapped to a protected key, we can't change it
  if (settingsBlacklist?.includes(settingName) || (key != null && keysBlacklist?.includes(key))) {
    return false;
  }
  return true;
}

// #endregion
