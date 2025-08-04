import { Device } from "#enums/device";
import { KeyboardLayout } from "#enums/keyboard-layout";
import { settings } from "#system/settings-manager";
import { InGameManip } from "#test/settings/helpers/in-game-manip";
import { MenuManip } from "#test/settings/helpers/menu-manip";
import { GameManager } from "#test/test-utils/game-manager";
import type { InputInterfaceConfig } from "#types/inputs-types";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Keyboard Layout Change", () => {
  const configs: Record<Device, InputInterfaceConfig | undefined> = {
    [Device.KEYBOARD]: undefined,
    [Device.GAMEPAD]: undefined,
  };
  let config: InputInterfaceConfig;
  let inGame: InGameManip;
  let inTheSettingMenu: MenuManip;

  let phaserGame: Phaser.Game;
  let game: GameManager;

  function switchKeyboardLayout(layout: KeyboardLayout) {
    const inputController = game.scene.inputController;
    settings.update("keyboard", "layout", layout);
    config = inputController.getActiveConfig(Device.KEYBOARD)!;
    configs[Device.KEYBOARD] = config;
    inGame = new InGameManip(configs, config);
    inTheSettingMenu = new MenuManip(config);
  }

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
    game.scene.inputController.resetConfig(Device.KEYBOARD);
    if (config.padID !== "qwerty") {
      settings.update("keyboard", "layout", KeyboardLayout.QWERTY);
      game.scene.inputController.resetConfig(Device.KEYBOARD);
    }
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    const inputsController = game.scene.inputController;
    inputsController.ensureKeyboardIsInit();
    config = inputsController.getActiveConfig(Device.KEYBOARD)!;
    configs[Device.KEYBOARD] = config;
    inGame = new InGameManip(configs, config);
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

    switchKeyboardLayout(KeyboardLayout.AZERTY);

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

  it("should not preserve custom mappings when switching to another layout", () => {
    expect(config.padID).toBe("qwerty");
    inGame.whenWePressOnKeyboard("A").weShouldTriggerTheButton("Alt_Button_Left");
    inGame.whenWePressOnKeyboard("U").nothingShouldHappen();
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Left").iconDisplayedIs("A").weWantThisBindInstead("U").confirm();
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Left").iconDisplayedIs("U");
    inGame.whenWePressOnKeyboard("A").nothingShouldHappen();
    inGame.whenWePressOnKeyboard("U").weShouldTriggerTheButton("Alt_Button_Left");

    switchKeyboardLayout(KeyboardLayout.AZERTY);
    expect(config.padID).toBe("azerty");
    inTheSettingMenu.whenCursorIsOnSetting("Alt_Button_Left").iconDisplayedIs("Q");
    inGame.whenWePressOnKeyboard("Q").weShouldTriggerTheButton("Alt_Button_Left");
    inGame.whenWePressOnKeyboard("A").nothingShouldHappen();
    inGame.whenWePressOnKeyboard("U").nothingShouldHappen();
  });
});
