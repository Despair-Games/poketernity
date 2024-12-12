import type { Settings } from "#app/@types/Settings";
import { SETTINGS_LS_KEY } from "#app/constants";
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
export class SettingsManager {
  static readonly Event = {
    Initialized: "settings/initialized",
    InitFailed: "settings/init/failed",
    Updated: "settings/updated",
    UpdateFailed: "settings/update/failed",
    Loaded: "settings/loaded",
    Saved: "settings/saved",
    LoadFailed: "settings/load/failed",
    ChangeLanguage: "settings/language/change",
  };

  /** Local storage key for peristing settings. */
  public readonly lsKey: string;
  /** Event emitter for settings. */
  public readonly eventBus: Phaser.Events.EventEmitter;

  /** Internal buffer for current settings. */
  private _settings: Settings;

  constructor(init: SettingsManagerInit) {
    const { localStorageKey, settings } = init;

    this.eventBus = new Phaser.Events.EventEmitter();
    this.lsKey = localStorageKey;
    this._settings = settings;

    try {
      this.loadFromLocalStorage();
      this.eventBus.emit(SettingsManager.Event.Initialized, this._settings, this.lsKey);
    } catch (err) {
      console.error("Settings manager init failed::", err);
      this.eventBus.emit(SettingsManager.Event.InitFailed, { err }, this.lsKey);
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
  update<C extends keyof Settings>(category: C, key: keyof Settings[C], value: any) {
    if (!this._settings[category]) {
      this.eventBus.emit(SettingsManager.Event.UpdateFailed, { category, key, value });
      throw new Error(`Unknown category: ${category}`);
    }

    if (isNullOrUndefined(this._settings[category][key])) {
      this.eventBus.emit(SettingsManager.Event.UpdateFailed, { category, key, value });
      throw new Error(`Unknown key: ${category}.${String(key)}`);
    }
    console.log("Updated setting:", category, key, value);

    this._settings[category][key] = value;
    this.eventBus.emit(SettingsManager.Event.Updated, { category, key, value });
    this.saveToLocalStorage();
  }

  /**
   * Saves settings to local storage item with the key: {@linkcode lsKey}
   */
  private saveToLocalStorage() {
    localStorage.setItem(this.lsKey, JSON.stringify(this._settings));
    this.eventBus.emit(SettingsManager.Event.Saved, this._settings, this.lsKey);
  }

  /**
   * Loads and populates settings from local storage item with the key: {@linkcode lsKey}
   */
  private loadFromLocalStorage() {
    const lsSettingsStr = localStorage.getItem(this.lsKey);

    if (lsSettingsStr) {
      try {
        const lsSettings: Partial<Settings> = JSON.parse(lsSettingsStr);
        const { general, audio, display } = lsSettings;

        if (general) {
          this._settings.general = { ...this._settings.general, ...general };
        }

        if (audio) {
          this._settings.audio = { ...this._settings.audio, ...audio };
        }

        if (display) {
          this._settings.display = { ...this._settings.display, ...display };
        }

        this.eventBus.emit(SettingsManager.Event.Loaded, this._settings, this.lsKey);
      } catch (err) {
        console.error("Error loading settings from local storage:", err);
        this.eventBus.emit(SettingsManager.Event.LoadFailed, { err, raw: lsSettingsStr }, this.lsKey);
      }
    }
  }
}

/**
 * Singleton instance of {@linkcode SettingsManager}
 */
export const settings = new SettingsManager({ localStorageKey: SETTINGS_LS_KEY, settings: defaultSettings });
