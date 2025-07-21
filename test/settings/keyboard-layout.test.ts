import { Device } from "#enums/device";
import { KeyboardLayout } from "#enums/keyboard-layout";
import { settings } from "#system/settings-manager";
import { InGameManip } from "#test/settings/helpers/in-game-manip";
import { MenuManip } from "#test/settings/helpers/menu-manip";
import { GameManager } from "#test/test-utils/game-manager";
import type { InputInterfaceConfig } from "#types/input-types";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Test Keyboard Layout Update", () => {
  let config: InputInterfaceConfig;
  let inGame: InGameManip;
  let inTheSettingMenu: MenuManip;
  const configs: Map<string, InputInterfaceConfig> = new Map();

  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
    game = new GameManager(phaserGame);
    const inputsController = game.scene.inputController;
    inputsController.setupKeyboard();
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
    game.scene.inputController.resetConfig(Device.KEYBOARD);
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    const inputsController = game.scene.inputController;
    config = inputsController.getActiveConfig(Device.KEYBOARD)!;
    configs["qwerty"] = config;
    inGame = new InGameManip(configs, config, inputsController.selectedDevice);
    inTheSettingMenu = new MenuManip(config);
  });

  it("should initialize qwerty keyboard by default", () => {
    expect(config).not.toBeNull();
    expect(config.padID).toBe("qwerty");

    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Left").iconDisplayedIs("A");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Right").iconDisplayedIs("D");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("W");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Down").iconDisplayedIs("S");
    inGame.whenWePressOnKeyboard("A").weShouldTriggerTheButton("Alt_Button_Left");
    inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");
    inGame.whenWePressOnKeyboard("W").weShouldTriggerTheButton("Alt_Button_Up");
    inGame.whenWePressOnKeyboard("S").weShouldTriggerTheButton("Alt_Button_Down");
  });

  it("should allow switching to an 'azerty' keyboard layout", () => {
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Left").iconDisplayedIs("A");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Right").iconDisplayedIs("D");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("W");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Down").iconDisplayedIs("S");
    inGame.whenWePressOnKeyboard("A").weShouldTriggerTheButton("Alt_Button_Left");
    inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");
    inGame.whenWePressOnKeyboard("W").weShouldTriggerTheButton("Alt_Button_Up");
    inGame.whenWePressOnKeyboard("S").weShouldTriggerTheButton("Alt_Button_Down");

    const inputController = game.scene.inputController;
    settings.update("keyboard", "layout", KeyboardLayout.AZERTY);
    config = inputController.getActiveConfig(Device.KEYBOARD)!;
    configs["azerty"] = config;
    inGame = new InGameManip(configs, config, inputController);
    inTheSettingMenu = new MenuManip(config);

    expect(config).not.toBeNull();
    expect(config.padID).toBe("azerty");

    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Left").iconDisplayedIs("Q");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Right").iconDisplayedIs("D");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Up").iconDisplayedIs("Z");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Down").iconDisplayedIs("S");
    inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
    inGame.whenWePressOnKeyboard("D").weShouldTriggerTheButton("Alt_Button_Right");
    inGame.whenWePressOnKeyboard("Z").weShouldTriggerTheButton("Alt_Button_Up");
    inGame.whenWePressOnKeyboard("S").weShouldTriggerTheButton("Alt_Button_Down");
  });
});
