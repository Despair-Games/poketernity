import type { Settings, SettingsCategory } from "#app/@types/Settings";
import { SETTINGS_LS_KEY } from "#app/constants";
import { eventBus } from "#app/event-bus";
import { isNullOrUndefined } from "#app/utils";
import { defaultSettings } from "./default-settings";

//#region Types

interface SettingsManagerInit {
  localStorageKey: string;
  settings: Settings;
}

//#endregion

/**
 * Manages game settings
 */
class SettingsManager {
  /** Local storage key for peristing settings. */
  public readonly lsKey: string;

  /** Internal buffer for current settings. */
  private _settings: Settings;

  constructor(init: SettingsManagerInit) {
    const { localStorageKey, settings } = init;

    this.lsKey = localStorageKey;
    this._settings = settings;

    try {
      this.loadFromLocalStorage();
    } catch (err) {
      console.error("Settings manager init failed:", err);
    }
  }

  /**
   * Getter for {@linkcode _settings}. No public setter!
   */
  get settings() {
    return this._settings;
  }

  /**
   * Quick access to general settings
   */
  get general() {
    return this._settings.general;
  }

  /**
   * Quick access to display settings
   */
  get display() {
    return this._settings.display;
  }

  /**
   * Quick access to audio settings
   */
  get audio() {
    return this._settings.audio;
  }

  /**
   * Quick access to gamepad settings
   */
  get gamepad() {
    return this._settings.gamepad;
  }

  /**
   * Getter for bgm volume after applying the master volume multiplier
   */
  get effectiveBgmVolume() {
    return this._settings.audio.bgmVolume * this._settings.audio.masterVolume;
  }

  /**
   * Getter for field volume after applying the master volume multiplier
   */
  get effectiveFieldVolume() {
    return this._settings.audio.fieldVolume * this._settings.audio.masterVolume;
  }

  /**
   * Getter for sound effects volume after applying the master volume multiplier
   */
  get effectiveSoundEffectsVolume() {
    return this._settings.audio.soundEffectsVolume * this._settings.audio.masterVolume;
  }

  /**
   * Getter for ui volume after applying the master volume multiplier
   */
  get effectiveUiVolume() {
    return this._settings.audio.uiVolume * this._settings.audio.masterVolume;
  }

  /**
   * Updates a setting. Takes care of dispatching events and saving to local storage
   * @param category The category of the setting
   * @param key the key of the setting
   * @param value the updated value
   */
  update<C extends SettingsCategory>(category: C, key: keyof Settings[C], value: any) {
    if (!this._settings[category]) {
      eventBus.emit("settings/update/failed", { category, key, value });
      throw new Error(`Unknown category: ${category}`);
    }

    if (isNullOrUndefined(this._settings[category][key])) {
      eventBus.emit("settings/update/failed", { category, key, value });
      throw new Error(`Unknown key: ${category}.${String(key)}`);
    }

    this._settings[category][key] = value;
    eventBus.emit("settings/updated", { category, key, value });
    this.saveToLocalStorage();
  }

  /**
   * Exectues a window reload after updating the setting.
   * @see The {@linkcode update} method for more information
   * @param category The category of the setting
   * @param key the key of the setting
   * @param value the updated value
   */
  updateAndReload<C extends SettingsCategory>(category: C, key: keyof Settings[C], value: any) {
    this.update(category, key, value);
    window.location.reload();
  }

  /**
   * Saves settings to local storage item with the key: {@linkcode lsKey}
   */
  private saveToLocalStorage() {
    localStorage.setItem(this.lsKey, JSON.stringify(this._settings));
    eventBus.emit("settings/saved", this._settings, this.lsKey);
  }

  /**
   * Loads and populates settings from local storage item with the key: {@linkcode lsKey}
   */
  private loadFromLocalStorage() {
    const lsItem = localStorage.getItem(this.lsKey);

    if (lsItem) {
      try {
        const lsSettings: Partial<Settings> = JSON.parse(lsItem);
        const { general, audio, display, gamepad } = lsSettings;

        if (general) {
          this._settings.general = { ...this._settings.general, ...general };
        }

        if (audio) {
          this._settings.audio = { ...this._settings.audio, ...audio };
        }

        if (display) {
          this._settings.display = { ...this._settings.display, ...display };
        }

        if (gamepad) {
          this._settings.gamepad = { ...this._settings.gamepad, ...gamepad };
        }
      } catch (err) {
        console.error("Error loading settings from local storage:", err);
      }
    }
  }
}

/**
 * Singleton instance of {@linkcode SettingsManager}
 */
export const settings = new SettingsManager({ localStorageKey: SETTINGS_LS_KEY, settings: defaultSettings });
