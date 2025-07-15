import { Device } from "#enums/device";
import type { GamepadKeys, InputInterfaceConfig, InputKeys, KeyboardKeys } from "#types/input-interface-config";
import { isNil } from "#utils/common-utils";

/**
 * Retrieves the key associated with the specified keycode from the mapping.
 *
 * @param config - The configuration object containing the mapping.
 * @param keycode - The keycode to search for.
 * @returns The key associated with the specified keycode.
 */
export function getKeyWithKeycode(config: InputInterfaceConfig, keycode: number) {
  return Object.keys(config.deviceMapping).find((key) => config.deviceMapping[key] === keycode);
}

/**
 * Retrieves the setting name associated with the specified keycode.
 *
 * @param config - The configuration object containing custom settings.
 * @param keycode - The keycode to search for.
 * @returns The setting name associated with the specified keycode.
 */
export function getSettingNameWithKeycode(config: InputInterfaceConfig, keycode: number) {
  const key = getKeyWithKeycode(config, keycode);
  return key && config.custom ? config.custom[key] : null;
}

/**
 * Retrieves the icon associated with the specified keycode.
 *
 * @param config - The configuration object containing icons.
 * @param keycode - The keycode to search for.
 * @returns The icon associated with the specified keycode.
 */
export function getIconWithKeycode(config: InputInterfaceConfig, keycode: number) {
  const key = getKeyWithKeycode(config, keycode);
  return key ? config.icons[key] : null;
}

/**
 * Retrieves the button associated with the specified keycode.
 *
 * @param config - The configuration object containing settings.
 * @param keycode - The keycode to search for.
 * @returns The button associated with the specified keycode.
 */
export function getButtonWithKeycode(config: InputInterfaceConfig, keycode: number) {
  const settingName = getSettingNameWithKeycode(config, keycode);
  return settingName ? config.settings[settingName] : null;
}

/**
 * Retrieves the key associated with the specified setting name.
 *
 * @param config - The configuration object containing custom settings.
 * @param settingName - The setting name to search for.
 * @returns The key associated with the specified setting name.
 */
export function getKeyWithSettingName<K extends InputKeys>(
  config: InputInterfaceConfig<K, any>,
  settingName,
): K | null {
  if (isNil(config.custom)) {
    return null;
  }
  return (Object.keys(config.custom).find((key) => config.custom![key] === settingName) as K) ?? null;
}

/**
 * Retrieves the setting name associated with the specified key.
 *
 * @param config - The configuration object containing custom settings.
 * @param key - The key to search for.
 * @returns The setting name associated with the specified key.
 * TODO add proper return type
 */
export function getSettingNameWithKey(config: InputInterfaceConfig, key: string) {
  return config.custom ? config.custom[key] : "";
}

/**
 * Retrieves the icon associated with the specified key.
 *
 * @param config - The configuration object containing icons.
 * @param key - The key to search for.
 * @returns The icon associated with the specified key.
 */
export function getIconWithKey(config, key) {
  return config.icons[key];
}

/**
 * Retrieves the icon associated with the specified setting name.
 *
 * @param config - The configuration object containing icons.
 * @param settingName - The setting name to search for.
 * @returns The icon associated with the specified setting name.
 */
export function getIconWithSettingName(config: InputInterfaceConfig, settingName: string) {
  const key = getKeyWithSettingName(config, settingName);
  return getIconWithKey(config, key);
}

export function getIconForLatestInput(configs, source: string, devices, settingName: string): string {
  let config: InputInterfaceConfig;
  if (source === "gamepad") {
    config = configs[devices[Device.GAMEPAD]];
  } else {
    config = configs[devices[Device.KEYBOARD]];
  }
  const icon = getIconWithSettingName(config, settingName);
  if (!icon) {
    const isAlt = settingName.startsWith("ALT_");
    let altSettingName: string;
    if (isAlt) {
      altSettingName = settingName.slice(4);
      //altSettingName = settingName.split("ALT_").splice(1)[0];
    } else {
      altSettingName = `ALT_${settingName}`;
    }
    return getIconWithSettingName(config, altSettingName);
  }
  return icon;
}

export function assign(config, settingNameTarget, keycode): boolean {
  // first, we need to check if this keycode is already used on another settingName
  if (
    !canIAssignThisKey(config, getKeyWithKeycode(config, keycode))
    || !canIOverrideThisSetting(config, settingNameTarget)
  ) {
    return false;
  }
  const previousSettingName = getSettingNameWithKeycode(config, keycode);
  // if it was already bound, we delete the bind
  if (previousSettingName) {
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

export function swap(config, settingNameTarget, keycode) {
  // only for gamepad
  if (config.padType === "keyboard") {
    return false;
  }
  const prev_key = getKeyWithSettingName(config, settingNameTarget)!;
  const prev_settingName = getSettingNameWithKey(config, prev_key);

  const new_key = getKeyWithKeycode(config, keycode)!; // TODO
  const new_settingName = getSettingNameWithKey(config, new_key);

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
 */
export function deleteBind(config: InputInterfaceConfig, settingName) {
  const key = getKeyWithSettingName(config, settingName);
  if (isNil(config.custom) || isNil(key) || config.bindingBlacklist?.includes(key)) {
    return false;
  }
  config.custom[key] = -1;
  return true;
}

export function canIAssignThisKey(config: InputInterfaceConfig, key) {
  const settingName = getSettingNameWithKey(config, key);
  if (config.bindingBlacklist?.includes(key)) {
    return false;
  }
  if (settingName === -1) {
    return true;
  }
  // if (isTheLatestBind(config, settingName)) {
  //   return false;
  // }
  return true;
}

export function canIOverrideThisSetting(config: InputInterfaceConfig, settingName) {
  const key = getKeyWithSettingName(config, settingName);
  // If the setting is mapped to a protected key, we can't change it
  if (!isNil(key) && config.bindingBlacklist?.includes(key)) {
    return false;
  }
  return true;
}

export function canIDeleteThisKey(config, key) {
  return canIAssignThisKey(config, key);
}

// export function isTheLatestBind(config, settingName) {
//   if (config.padType !== "keyboard") {
//     return false;
//   }
//   const isAlt = settingName.includes("ALT_");
//   let altSettingName;
//   if (isAlt) {
//     altSettingName = settingName.split("ALT_").splice(1)[0];
//   } else {
//     altSettingName = `ALT_${settingName}`;
//   }
//   const secondButton = getKeyWithSettingName(config, altSettingName);
//   return secondButton === undefined;
// }
