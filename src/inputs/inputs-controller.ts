import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import { TouchControl } from "#app/touch-controls";
import { Button } from "#enums/button";
import { Device } from "#enums/device";
import { KeyboardLayout } from "#enums/keyboard-layout";
import { SettingGamepad } from "#enums/setting-gamepad";
import { SettingKeyboard } from "#enums/setting-keyboard";
import { UiMode } from "#enums/ui-mode";
import { pad_dualshock, pad_generic, pad_procon, pad_unlicensedSNES, pad_xbox360 } from "#inputs/gamepad-configs";
import { cfg_keyboard_azerty, cfg_keyboard_qwerty, cfg_keyboard_qwertz } from "#inputs/keyboard-configs";
import { settings } from "#system/settings-manager";
import type {
  GamepadInterfaceConfig,
  InputInterfaceConfig,
  InputKeys,
  InputMappings,
  InputSettings,
  KeyboardInterfaceConfig,
  KeyboardKeys,
} from "#types/inputs-types";
import type { SettingsUpdateEventArgs } from "#types/settings";
import { MoveTouchControlsHandler } from "#ui/move-touch-controls-handler";
import { deepCopy, enumValueToKey, isNil } from "#utils/common-utils";
import { assign, getButtonWithKeycode, getIconForLatestInput, swap } from "#utils/inputs-utils";
import Phaser from "phaser";

const repeatInputDelayMillis = 250;

/**
 * Array of Keyboard Settings that shouldn't be allowed to be remapped.
 * Keys mapped to these settings by default will be blocked from being mapped to other settings.
 */
const KEYBOARD_LOCKED_BINDINGS: readonly SettingKeyboard[] = Object.freeze([
  SettingKeyboard.Button_Submit,
  SettingKeyboard.Button_Menu,
  SettingKeyboard.Button_Action,
  SettingKeyboard.Button_Cancel,
  SettingKeyboard.Button_Up,
  SettingKeyboard.Button_Down,
  SettingKeyboard.Button_Left,
  SettingKeyboard.Button_Right,
  SettingKeyboard.Button_Cycle_Form, // Needed to navigate the settings
  SettingKeyboard.Button_Cycle_Shiny, // Needed to navigate the settings
]);

/** Array of Keyboard Keys that should not mapped to any input. */
const KEYBOARD_KEYS_BLACKLIST: readonly KeyboardKeys[] = Object.freeze([
  "KEY_DEL", // Used in keyboard settings to delete the existing binding
  "KEY_HOME", // Used in keyboard/gamepad settings to reset all bindings
]);

/**
 * Array of Gamepad Settings that shouldn't be allowed to be remapped.
 * Buttons mapped to these settings by default will be blocked from being mapped to other settings.
 */
const GAMEPAD_LOCKED_BINDINGS: readonly SettingGamepad[] = Object.freeze([
  SettingGamepad.Button_Up,
  SettingGamepad.Button_Down,
  SettingGamepad.Button_Left,
  SettingGamepad.Button_Right,
]);

/**
 * Manages and handles all input controls for the game, including keyboard and gamepad interactions.
 *
 * @remarks
 * This class is designed to centralize input management across the game. It facilitates the setup,
 * configuration, and handling of all game inputs, making it easier to manage various input devices
 * such as keyboards and gamepads. The class provides methods for setting up input devices, handling
 * their events, and responding to changes in input state (e.g., button presses, releases).
 *
 * The `InputsController` class also includes mechanisms to handle game focus events to ensure input
 * states are correctly reset and managed when the game loses or regains focus, maintaining robust
 * and responsive control handling throughout the game's lifecycle.
 *
 * Key responsibilities include:
 * - Initializing and configuring gamepad and keyboard controls.
 * - Emitting events related to specific input actions.
 * - Responding to external changes such as gamepad connection/disconnection.
 * - Managing game state transitions in response to input events, particularly focus loss and recovery.
 *
 * Usage of this class is intended to simplify input management across various parts of the game,
 * providing a unified interface for all input-related interactions.
 */
export class InputsController {
  private gamepads: Phaser.Input.Gamepad.Gamepad[] = [];
  public events: Phaser.Events.EventEmitter;

  private buttonLock: Button[] = [];

  // TODO: interactions is defined as a map but used as an object
  private readonly interactions: Map<Button, Map<string, boolean>> = new Map();

  /** Configurations for device that have been used within the current session. */
  private readonly configs: { [key: string]: InputInterfaceConfig } = {};
  /** Used to store custom mappings from local storage until the proper configuration gets initialized. */
  private readonly customMappings: { [key: string]: InputMappings } = {};

  public gamepadSupport: boolean = true;
  public selectedDevice: Record<Device, string | null>;

  private disconnectedGamepads: string[] = [];

  // TODO: add proper typing and handle touch
  public lastSource: string = "keyboard";
  private readonly inputInterval: Partial<Record<Button, NodeJS.Timeout>> = {};
  private touchControls: TouchControl;
  public moveTouchControlsHandler: MoveTouchControlsHandler;

  /**
   * Initializes a new instance of the game control system, setting up initial state and configurations.
   *
   * @remarks
   * This constructor initializes the game control system with necessary setups for handling inputs.
   * It prepares an interactions array indexed by button identifiers and configures default states for each button.
   * Specific buttons like MENU and STATS are set not to repeat their actions.
   * It concludes by calling the `init` method to complete the setup.
   */

  constructor() {
    this.selectedDevice = {
      [Device.GAMEPAD]: null,
      [Device.KEYBOARD]: enumValueToKey(KeyboardLayout, settings.keyboard.layout).toLowerCase(),
    };

    for (const b of Object.values(Button)) {
      this.interactions[b] = {
        pressTime: false,
        isPressed: false,
        source: null,
      };
    }
    // We don't want the menu key to be repeated
    delete this.interactions[Button.MENU];
    delete this.interactions[Button.STATS];
    this.init();
  }

  /**
   * Sets up event handlers and initializes gamepad and keyboard controls.
   *
   * @remarks
   * This method configures event listeners for both gamepad and keyboard inputs.
   * It handles gamepad connections/disconnections and button press events, and ensures keyboard controls are set up.
   * Additionally, it manages the game's behavior when it loses focus to prevent unwanted game actions during this state.
   */
  private init(): void {
    this.events = globalScene.game.events;

    globalScene.game.events.on(Phaser.Core.Events.BLUR, () => {
      this.loseFocus();
    });

    if (typeof globalScene.input.gamepad !== "undefined") {
      const connectedListenerFunc = (thisGamepad: Phaser.Input.Gamepad.Gamepad) => {
        if (!thisGamepad) {
          return;
        }
        this.refreshGamepads();
        this.setupGamepad();
        this.onReconnect(thisGamepad);
      };
      globalScene.input.gamepad?.on("connected", connectedListenerFunc, this);

      const disconnectedListenerFunc = (thisGamepad: Phaser.Input.Gamepad.Gamepad) => this.onDisconnect(thisGamepad);
      globalScene.input.gamepad?.on("disconnected", disconnectedListenerFunc, this);

      // Check to see if the gamepad has already been setup by the browser
      globalScene.input.gamepad?.refreshPads();
      if (globalScene.input.gamepad?.total) {
        this.refreshGamepads();
        for (const thisGamepad of this.gamepads) {
          globalScene.input.gamepad.emit("connected", thisGamepad);
        }
      }

      globalScene.input.gamepad?.on("down", this.gamepadButtonDown, this);
      globalScene.input.gamepad?.on("up", this.gamepadButtonUp, this);
      globalScene.input.keyboard?.on("keydown", this.keyboardKeyDown, this);
      globalScene.input.keyboard?.on("keyup", this.keyboardKeyUp, this);
    }

    this.touchControls = new TouchControl();
    this.moveTouchControlsHandler = new MoveTouchControlsHandler(this.touchControls);
    this.touchControls.render();

    this.setGamepadSupport(settings.gamepad.enabled);

    // Note: at the moment we don't need to remove this listener because only a single instance
    // Of InputController is ever created, during 'BattleScene.create'.
    eventBus.on("settings/updated", ({ category, key, value }: SettingsUpdateEventArgs) => {
      if (category === "gamepad" && key === "enabled" && typeof value === "boolean") {
        this.setGamepadSupport(value);
      } else if (category === "keyboard" && key === "layout" && typeof value === "number") {
        this.setChosenKeyboardLayout(value as KeyboardLayout);
      }
    });
  }

  /**
   * Handles actions to take when the game loses focus, such as deactivating pressed keys.
   *
   * @remarks
   * This method is triggered when the game or the browser tab loses focus. It ensures that any keys pressed are deactivated to prevent stuck keys affecting gameplay when the game is not active.
   */
  private loseFocus(): void {
    this.deactivatePressedKeys();
    this.touchControls.deactivatePressedKey();
  }

  /**
   * Enables or disables support for gamepad input.
   *
   * @param value - A boolean indicating whether gamepad support should be enabled (true) or disabled (false).
   *
   * @remarks
   * This method toggles gamepad support. If disabled, it also ensures that all currently pressed gamepad buttons are deactivated to avoid stuck inputs.
   */
  private setGamepadSupport(value: boolean): void {
    this.gamepadSupport = value;
    if (!value) {
      this.deactivatePressedKeys();
    }
  }

  /**
   * Sets the currently chosen gamepad and initializes related settings.
   * This method first deactivates any active key presses and then initializes the gamepad settings.
   *
   * @param gamepad - The identifier of the gamepad to set as chosen.
   * @param emitInitEvent - Whether to send a gamepad initialization event. Default: `true`.
   */
  public setChosenGamepad(gamepad: string, emitInitEvent: boolean = true): void {
    this.deactivatePressedKeys();
    this.initChosenGamepad(gamepad, emitInitEvent);
  }

  /**
   * Sets the currently chosen keyboard layout and initializes related settings.
   *
   * @param layout - The {@linkcode KeyboardLayout} to set as chosen.
   */
  private setChosenKeyboardLayout(layout: KeyboardLayout): void {
    this.deactivatePressedKeys();

    const layoutKey = enumValueToKey(KeyboardLayout, layout).toLowerCase();
    this.selectedDevice[Device.KEYBOARD] = layoutKey;
    if (this.configs[layoutKey]) {
      this.initChosenLayoutKeyboard(layoutKey);
    } else {
      this.setupKeyboard(layout);
    }
  }

  /**
   * Retrieves the identifiers of all connected gamepads, excluding any that are currently marked as disconnected.
   * @returns Array<String> An array of strings representing the IDs of the connected gamepads.
   */
  public getGamepadsName(): string[] {
    return this.gamepads.filter((g) => !this.disconnectedGamepads.includes(g.id)).map((g) => g.id);
  }

  /**
   * Initializes the chosen gamepad by setting its identifier in the local storage and updating the UI to reflect the chosen gamepad.
   * If a gamepad name is provided, it uses that as the chosen gamepad; otherwise, it defaults to the currently chosen gamepad.
   * @param gamepadName - Name of the gamepad to initialize as chosen.
   * @param emitInitEvent - Whether to send a gamepad initialization event. Default: `true`.
   */
  private initChosenGamepad(gamepadName: string, emitInitEvent: boolean = true): void {
    this.selectedDevice[Device.GAMEPAD] = gamepadName.toLowerCase();
    if (emitInitEvent) {
      eventBus.emit("gamepad/init");
    }
  }

  /**
   * Initializes the chosen keyboard layout by setting its identifier in the local storage and updating the UI to reflect the chosen layout.
   * If a layout name is provided, it uses that as the chosen layout; otherwise, it defaults to the currently chosen layout.
   * @param layoutKey - A unique key corresponding to the {@linkcode KeyboardLayout} to use.
   */
  private initChosenLayoutKeyboard(layoutKey: string): void {
    this.selectedDevice[Device.KEYBOARD] = layoutKey;
    eventBus.emit("keyboard/init");
  }

  /**
   * Handles the disconnection of a gamepad by adding its identifier to a list of disconnected gamepads.
   * This is necessary because Phaser retains memory of previously connected gamepads, and without tracking
   * disconnections, it would be impossible to determine the connection status of gamepads. This method ensures
   * that disconnected gamepads are recognized and can be appropriately hidden in the gamepad selection menu.
   *
   * @param thisGamepad The gamepad that has been disconnected.
   */
  private onDisconnect(thisGamepad: Phaser.Input.Gamepad.Gamepad): void {
    this.disconnectedGamepads.push(thisGamepad.id);
  }

  /**
   * Updates the tracking of disconnected gamepads when a gamepad is reconnected.
   * It removes the reconnected gamepad's identifier from the `disconnectedGamepads` array,
   * effectively updating its status to connected.
   *
   * @param thisGamepad The gamepad that has been reconnected.
   */
  private onReconnect(thisGamepad: Phaser.Input.Gamepad.Gamepad): void {
    this.disconnectedGamepads = this.disconnectedGamepads.filter((g) => g !== thisGamepad.id);
  }

  /**
   * Initializes or updates configurations for connected gamepads.
   * It retrieves the names of all connected gamepads, sets up their configurations according to stored or default settings,
   * and ensures these configurations are saved.
   */
  private setupGamepad(): void {
    const allGamepads = this.getGamepadsName();
    for (const gamepad of allGamepads) {
      const gamepadID = gamepad.toLowerCase();
      if (!this.selectedDevice[Device.GAMEPAD]) {
        this.setChosenGamepad(gamepadID, false);
      }
      this.initGamepadConfig(gamepadID);
    }
    this.lastSource = "gamepad";

    eventBus.emit("gamepad/init");
  }

  /**
   * Initializes or updates configurations for connected keyboards.
   * @param layout - The {@linkcode KeyboardLayout} to use for configuration.
   *   If not provided, uses the layout defined in settings (by default, QWERTY)
   */
  private setupKeyboard(layout: KeyboardLayout = settings.keyboard.layout): void {
    const layoutKey = enumValueToKey(KeyboardLayout, layout).toLowerCase();
    this.initKeyboardConfig(layout, layoutKey);
    this.initChosenLayoutKeyboard(layoutKey);
  }

  /**
   * Initializes the config object for the given gamepad.
   * @param gamepadID - unique string id for this gamepad.
   */
  private initGamepadConfig(gamepadID: string): void {
    this.initConfig(gamepadID, this.getGamepadConfig(gamepadID), GAMEPAD_LOCKED_BINDINGS);
  }

  /**
   * Initializes the config object for the given keyboard layout.
   * @param - The {@linkcode KeyboardLayout}
   * @param - Unique string corresponding to this layout
   */
  private initKeyboardConfig(layout: KeyboardLayout, layoutKey: string): void {
    this.initConfig(
      layoutKey,
      this.getKeyboardConfig(layout) as InputInterfaceConfig,
      KEYBOARD_LOCKED_BINDINGS,
      KEYBOARD_KEYS_BLACKLIST,
    );
  }

  /**
   * Initializes and stores a config object for a given device.
   * @param id - unique string id for this device
   * @param baseConfig - the default {@linkcode InputInterfaceConfig} for this device type
   * @param lockedSettings - Optional. Array of binding settings that are not allowed to be remapped for this device
   * @param lockedBindings - Optional. Array of keys/buttons that are not allowed to be mapped for this device
   */
  private initConfig(
    id: string,
    baseConfig: InputInterfaceConfig,
    lockedSettings: readonly InputSettings[] = [],
    lockedBindings: readonly InputKeys[] = [],
  ): void {
    const config = deepCopy(baseConfig);

    // Copy existing custom bindings if any, otherwise use the default bindings
    if (this.customMappings[id]) {
      config.custom = this.customMappings[id];
      delete this.customMappings[id];
    } else {
      config.custom = { ...config.default };
    }

    // Initialize locked settings and locks the keys/buttons assigned to those settings by default.
    config.settingsBlacklist = [...(config.settingsBlacklist ?? []), ...lockedSettings];
    config.keysBlacklist = [...(config.keysBlacklist ?? []), ...lockedBindings];
    for (const key of Object.keys(config.default)) {
      if (config.settingsBlacklist.includes(config.default[key])) {
        config.keysBlacklist.push(key as InputKeys);
      }
    }

    this.configs[id] = config;
    globalScene.gameData?.saveMappingConfigs(id, this.configs[id]);
  }

  /**
   * Refreshes and re-indexes the list of connected gamepads.
   *
   * @remarks
   * This method updates the list of gamepads to exclude any that are undefined.
   * It corrects the index of each gamepad to account for any previously undefined entries,
   * ensuring that all gamepads are properly indexed and can be accurately referenced within the game.
   */
  private refreshGamepads(): void {
    // Sometimes, gamepads are undefined. For some reason.
    this.gamepads = globalScene.input.gamepad?.gamepads.filter((el) => el !== null) ?? [];

    for (const [index, thisGamepad] of this.gamepads.entries()) {
      thisGamepad.index = index; // Overwrite the gamepad index, in case we had undefined gamepads earlier
    }
  }

  /**
   * Ensures the keyboard is initialized by checking if there is an active configuration for the keyboard.
   * If not, it sets up the keyboard with default configurations.
   */
  public ensureKeyboardIsInit(): void {
    if (!this.getActiveConfig(Device.KEYBOARD)) {
      this.setupKeyboard();
    }
  }

  /**
   * Handles the keydown event for the keyboard.
   *
   * @param event The keyboard event.
   */
  private keyboardKeyDown(event: KeyboardEvent): void {
    this.lastSource = "keyboard";

    this.ensureKeyboardIsInit(); // ensure the active keyboard config is defined
    // TODO: event.keyCode is deprecated, we should use event.key or event.code
    const buttonDown = getButtonWithKeycode(this.getActiveConfig(Device.KEYBOARD)!, event.keyCode);
    if (isNil(buttonDown) || this.buttonLock.includes(buttonDown)) {
      return;
    }

    // Create interval for repeating inputs when the button stays pressed
    this.createInputDownInterval(buttonDown, "keyboard");

    /* Emit input down event *after* the interval was created in case the event results
     * in the interval needing to be cleared, typically when remapping inputs */
    this.events.emit("input_down", {
      controller_type: "keyboard",
      button: buttonDown,
    });
  }

  /**
   * Handles the keyup event for the keyboard.
   *
   * @param event The keyboard event.
   */
  private keyboardKeyUp(event: KeyboardEvent): void {
    this.lastSource = "keyboard";
    const config = this.getActiveConfig(Device.KEYBOARD);
    if (!config) {
      return; // The keyboard isn't setup, ignore the input
    }
    // TODO: event.keyCode is deprecated, we should use event.key or event.code
    const buttonUp = getButtonWithKeycode(config, event.keyCode);
    if (!isNil(buttonUp)) {
      this.events.emit("input_up", {
        controller_type: "keyboard",
        button: buttonUp,
      });
      const index = this.buttonLock.indexOf(buttonUp);
      this.buttonLock.splice(index, 1);
      clearInterval(this.inputInterval[buttonUp]);
    }
  }

  private createInputDownInterval(buttonDown: Button, controllerType: string): void {
    // Clear any previously existing interval
    clearInterval(this.inputInterval[buttonDown]);

    // Mark the button as locked down
    this.buttonLock.push(buttonDown);

    this.inputInterval[buttonDown] = setInterval(() => {
      if (!this.buttonLock.includes(buttonDown)) {
        clearInterval(this.inputInterval[buttonDown]);
        return;
      }
      this.events.emit("input_down", {
        controller_type: controllerType,
        button: buttonDown,
      });
    }, repeatInputDelayMillis);
  }

  /**
   * Handles button press events on a gamepad. This method sets the gamepad as chosen on the first input if no gamepad is currently chosen.
   * It checks if gamepad support is enabled and if the event comes from the chosen gamepad. If so, it maps the button press to a specific
   * action using a custom configuration, emits an event for the button press, and records the time of the action.
   *
   * @param pad The gamepad on which the button was pressed.
   * @param button The specific button that was pressed.
   * @param value The intensity or value of the button press, if applicable.
   */
  private gamepadButtonDown(
    pad: Phaser.Input.Gamepad.Gamepad,
    button: Phaser.Input.Gamepad.Button,
    _value: number,
  ): void {
    if (!this.getActiveConfig(Device.KEYBOARD)) {
      // TODO: why do we care about keyboard config here?
      this.setupKeyboard();
    }
    if (!pad) {
      return;
    }
    this.lastSource = "gamepad";
    let gamepadID = this.selectedDevice[Device.GAMEPAD];
    if (!gamepadID || (globalScene.ui.getMode() !== UiMode.GAMEPAD_BINDING && gamepadID !== pad.id.toLowerCase())) {
      this.setChosenGamepad(pad.id);
      gamepadID = this.selectedDevice[Device.GAMEPAD];
    }
    if (!this.gamepadSupport || !gamepadID || pad.id.toLowerCase() !== gamepadID.toLowerCase()) {
      return;
    }
    const activeConfig = this.getActiveConfig(Device.GAMEPAD);
    const buttonDown = activeConfig && getButtonWithKeycode(activeConfig, button.index);
    if (isNil(buttonDown) || this.buttonLock.includes(buttonDown)) {
      return;
    }

    // Create interval for repeating inputs when the button keeps being pressed
    this.createInputDownInterval(buttonDown, "gamepad");

    /* Emit input down event *after* the interval was created in case the event results
     * in the interval needing to be cleared, typically when remapping inputs */
    this.events.emit("input_down", {
      controller_type: "gamepad",
      button: buttonDown,
    });
  }

  /**
   * Responds to a button release event on a gamepad by checking if the gamepad is supported and currently chosen.
   * If conditions are met, it identifies the configured action for the button, emits an event signaling the button release,
   * and clears the record of the button.
   *
   * @param pad The gamepad from which the button was released.
   * @param button The specific button that was released.
   * @param value The intensity or value of the button release, if applicable.
   */
  private gamepadButtonUp(
    pad: Phaser.Input.Gamepad.Gamepad,
    button: Phaser.Input.Gamepad.Button,
    _value: number,
  ): void {
    if (!pad) {
      return;
    }
    this.lastSource = "gamepad";
    const config = this.getActiveConfig(Device.GAMEPAD);
    if (!this.gamepadSupport || pad.id.toLowerCase() !== this.selectedDevice[Device.GAMEPAD] || !config) {
      return;
    }

    const buttonUp = getButtonWithKeycode(config, button.index);
    if (!isNil(buttonUp)) {
      this.events.emit("input_up", {
        controller_type: "gamepad",
        button: buttonUp,
      });
      const index = this.buttonLock.indexOf(buttonUp);
      this.buttonLock.splice(index, 1);
      clearInterval(this.inputInterval[buttonUp]);
    }
  }

  /**
   * Retrieves the configuration object for a gamepad based on its identifier. The method identifies specific gamepad models
   * based on substrings in the identifier and returns predefined configurations for recognized models.
   * If no specific configuration matches, it defaults to a generic gamepad configuration.
   *
   * @param id The identifier string of the gamepad.
   * @returns InterfaceConfig The configuration object corresponding to the identified gamepad type.
   */
  private getGamepadConfig(id: string): GamepadInterfaceConfig<any> {
    id = id.toLowerCase();

    if (id.includes("081f") && id.includes("e401")) {
      return pad_unlicensedSNES;
    }
    if (id.includes("xbox") && id.includes("360")) {
      return pad_xbox360;
    }
    if (id.includes("054c")) {
      return pad_dualshock;
    }
    if (id.includes("057e") && id.includes("2009")) {
      return pad_procon;
    }

    return pad_generic;
  }

  /**
   * Retrieves the configuration object for a given keyboard layout.
   * @param layout The {@linkcode KeyboardLayout} identifier string of the keyboard layout.
   * @returns The {@linkcode KeyboardInterfaceConfig} for this layout.
   */
  private getKeyboardConfig(layout: KeyboardLayout): KeyboardInterfaceConfig {
    switch (layout) {
      case KeyboardLayout.AZERTY:
        return cfg_keyboard_azerty;
      case KeyboardLayout.QWERTY:
        return cfg_keyboard_qwerty;
      case KeyboardLayout.QWERTZ:
        return cfg_keyboard_qwertz;
    }
  }

  /**
   * Deactivates all currently pressed keys and clears any repeating input.
   * TODO: should we remove the cleared intervals from `this.inputInterval`?
   */
  private deactivatePressedKeys(): void {
    for (const key of Object.keys(this.inputInterval)) {
      clearInterval(this.inputInterval[key]);
    }
    this.buttonLock = [];
  }

  /**
   * Retrieves the active configuration for the currently chosen device.
   * It checks if a specific device ID is stored in configurations and returns it.
   *
   * @returns The {@linkcode InputInterfaceConfig} for the active gamepad, or `undefined` if not set.
   */
  public getActiveConfig(device: Device): InputInterfaceConfig | undefined {
    const selectedDevice = this.selectedDevice[device];
    if (selectedDevice && this.configs[selectedDevice]) {
      return this.configs[selectedDevice];
    }
    return;
  }

  public getIconForLatestInputRecorded(settingName: InputSettings): string | undefined {
    if (this.lastSource === "keyboard") {
      this.ensureKeyboardIsInit();
    }
    const configs: Record<Device, InputInterfaceConfig | undefined> = {
      [Device.KEYBOARD]: this.getActiveConfig(Device.KEYBOARD),
      [Device.GAMEPAD]: this.getActiveConfig(Device.GAMEPAD),
    };
    return getIconForLatestInput(configs, this.lastSource, settingName);
  }

  private getLastSourceDevice(): Device {
    if (this.lastSource === "gamepad") {
      return Device.GAMEPAD;
    }
    return Device.KEYBOARD;
  }

  private getLastSourceConfig(): InputInterfaceConfig | undefined {
    const sourceDevice = this.getLastSourceDevice();
    if (sourceDevice === Device.KEYBOARD) {
      this.ensureKeyboardIsInit();
    }
    // TODO: we should have a specific config for touch input
    // to ensure the icons remain correct even with keyboard remappings
    return this.getActiveConfig(sourceDevice);
  }

  public getLastSourceType(): string | undefined {
    const config = this.getLastSourceConfig();
    return config?.padType;
  }

  /**
   * Injects a custom mapping configuration into the configuration for a specific device.
   * If the device does not have an existing configuration, it stores the custom mappings in a temporary object.
   *
   * @param selectedDevice The identifier of the device to configure.
   * @param mappingConfigs The mapping configuration to apply to the device.
   */
  public injectConfig(selectedDevice: string, mappingConfigs: Partial<InputInterfaceConfig>): void {
    if (this.configs[selectedDevice]) {
      this.configs[selectedDevice].custom = mappingConfigs.custom;
    } else if (mappingConfigs.custom) {
      this.customMappings[selectedDevice] = deepCopy(mappingConfigs.custom);
    }
  }

  /**
   * Reset the mapping config for the selected device.
   * If it's a Gamepad, only reset the config for the one currently in use
   * @param device the {@linkcode Device} to reset config for
   */
  public resetConfig(device: Device): void {
    const deviceName = this.selectedDevice[device];
    if (deviceName && this.configs[deviceName]) {
      delete this.configs[deviceName];
      switch (device) {
        case Device.KEYBOARD:
          this.setupKeyboard();
          break;
        case Device.GAMEPAD:
          this.setupGamepad();
          break;
      }
    }
  }

  /**
   * Swaps a binding in the configuration.
   *
   * @param config The configuration object.
   * @param settingName The name of the setting to swap.
   * @param keycode The button that was pressed.
   */
  public assignBinding(config: InputInterfaceConfig, settingName: InputSettings, keycode: number): boolean {
    this.deactivatePressedKeys();
    if (config.padType === "keyboard") {
      return assign(config, settingName, keycode);
    }
    return swap(config, settingName, keycode);
  }
}
