import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import { Button } from "#enums/button";
import type { Device } from "#enums/device";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import { addTextObject, setTextColor } from "#ui/text-utils";
import { UiHandler } from "#ui/ui-handler";
import { addWindow } from "#ui/ui-theme";
import { isNil } from "#utils/common-utils";
import i18next from "i18next";

type FinishCallback = (succes?: boolean) => boolean;

/**
 * Abstract class for handling UI elements related to button bindings.
 */
export abstract class BindingUiHandler extends UiHandler {
  protected device: Device;

  // Containers for different segments of the UI.
  protected optionSelectContainer: Phaser.GameObjects.Container;
  protected actionsContainer: Phaser.GameObjects.Container;

  // Background elements for titles and action areas.
  protected titleBg: Phaser.GameObjects.NineSlice;
  protected actionBg: Phaser.GameObjects.NineSlice;
  protected optionSelectBg: Phaser.GameObjects.NineSlice;

  // Text elements for displaying instructions and actions.
  protected unlockText: Phaser.GameObjects.Text;
  protected timerText: Phaser.GameObjects.Text;
  protected swapText: Phaser.GameObjects.Text;
  protected actionLabel: Phaser.GameObjects.Text;
  protected cancelLabel: Phaser.GameObjects.Text;

  protected listening: boolean = false;
  protected buttonPressed: number | null = null;

  // Icons for displaying current and new button assignments.
  protected newButtonIcon: Phaser.GameObjects.Sprite;
  protected targetButtonIcon: Phaser.GameObjects.Sprite;

  // Function to call on cancel or completion of binding.
  protected callback: FinishCallback | null;

  protected timeLeftAutoClose: number = 5;
  protected countdownTimer;

  // The specific setting being modified.
  protected target;

  constructor(mode: UiMode, device: Device) {
    super(mode);
    this.device = device;
  }

  protected override setup() {
    const ui = this.getUi();
    this.optionSelectContainer = globalScene.add.container(0, 0);
    this.actionsContainer = globalScene.add.container(0, 0);
    // Initially, containers are not visible.
    this.optionSelectContainer.setVisible(false);
    this.actionsContainer.setVisible(false);

    // Add containers to the UI.
    ui.add(this.optionSelectContainer);
    ui.add(this.actionsContainer);

    // Setup backgrounds and text objects for UI.
    this.titleBg = addWindow(GAME_WIDTH - this.getWindowWidth(), -GAME_HEIGHT + 28 + 21, this.getWindowWidth(), 24);
    this.titleBg.setOrigin(0.5);
    this.optionSelectContainer.add(this.titleBg);

    this.actionBg = addWindow(
      GAME_WIDTH - this.getWindowWidth(),
      -GAME_HEIGHT + this.getWindowHeight() + 28 + 21 + 21,
      this.getWindowWidth(),
      24,
    );
    this.actionBg.setOrigin(0.5);
    this.actionsContainer.add(this.actionBg);

    // Text prompts and instructions for the user.
    // TODO: fix placement
    this.unlockText = addTextObject(0, 0, i18next.t("settings:pressButton"), TextStyle.WINDOW);
    this.unlockText.setOrigin(0, 0);
    this.unlockText.setPositionRelative(this.titleBg, 36, 4);
    this.optionSelectContainer.add(this.unlockText);

    this.timerText = addTextObject(0, 0, "(5)", TextStyle.WINDOW);
    this.timerText.setOrigin(0, 0);
    this.timerText.setPositionRelative(this.unlockText, this.unlockText.displayWidth + 5, 0);
    this.optionSelectContainer.add(this.timerText);

    this.optionSelectBg = addWindow(
      GAME_WIDTH - this.getWindowWidth(),
      -GAME_HEIGHT + this.getWindowHeight() + 28,
      this.getWindowWidth(),
      this.getWindowHeight(),
    );
    this.optionSelectBg.setOrigin(0.5);
    this.optionSelectContainer.add(this.optionSelectBg);

    this.cancelLabel = addTextObject(0, 0, i18next.t("settings:back"), TextStyle.SETTINGS_LABEL);
    this.cancelLabel.setOrigin(0, 0.5);
    this.cancelLabel.setPositionRelative(this.actionBg, 10, this.actionBg.height / 2);
    this.actionsContainer.add(this.cancelLabel);
  }

  protected override tearDown(): void {
    this.optionSelectContainer.destroy();
    this.actionsContainer.destroy();
  }

  manageAutoCloseTimer() {
    clearTimeout(this.countdownTimer);
    this.countdownTimer = setTimeout(() => {
      this.timeLeftAutoClose -= 1;
      this.timerText.setText(`(${this.timeLeftAutoClose})`);
      if (this.timeLeftAutoClose >= 0) {
        this.manageAutoCloseTimer();
      } else {
        this.callback?.();
      }
    }, 1000);
  }

  /**
   * Show the UI with the provided arguments.
   *
   * @param target - The binding to update
   * @param finishHandler - Handler to call when the binding gets changed or cancelled
   * @returns `true` if successful.
   */
  public override show(target: string, finishHandler: FinishCallback): boolean {
    this.buttonPressed = null;
    this.timeLeftAutoClose = 5;
    this.callback = finishHandler;
    this.target = target;

    // Bring the option and action containers to the front of the UI.
    this.getUi().bringToTop(this.optionSelectContainer);
    this.getUi().bringToTop(this.actionsContainer);

    this.optionSelectContainer.setVisible(true);
    setTimeout(() => {
      this.listening = true;
      this.manageAutoCloseTimer();
    }, 100);
    return true;
  }

  /**
   * Get the width of the window.
   *
   * @returns The window width.
   */
  private getWindowWidth(): number {
    return 160;
  }

  /**
   * Get the height of the window.
   *
   * @returns The window height.
   */
  private getWindowHeight(): number {
    return 64;
  }

  /**
   * Process the input for the given button.
   *
   * @param button - The button to process.
   * @returns `true` if the input was processed successfully.
   */
  public override processInput(button: Button): boolean {
    if (this.buttonPressed === null) {
      return false; // TODO: is false correct as default? (previously was `undefined`)
    }
    const ui = this.getUi();
    let playSuccess = false;
    let playError = false;
    switch (button) {
      case Button.LEFT:
      case Button.RIGHT: {
        // Toggle between action and cancel options.
        const cursor = this.cursor ? 0 : 1;
        playSuccess = this.setCursor(cursor);
        break;
      }
      case Button.ACTION:
        if (this.cursor === 0) {
          playSuccess = true;
          this.callback?.(); // Cancel out without remapping
        } else {
          // Validate the remap
          const remapSuccess = this.swapAction();
          playSuccess = remapSuccess;
          playError = !remapSuccess;
          this.callback?.(remapSuccess);
        }
        break;
    }

    // Plays success or error sound effect, depending.
    if (playSuccess) {
      ui.playSelect();
    } else if (playError) {
      ui.playError();
    }

    return playSuccess;
  }

  /**
   * Set the cursor to the specified position.
   *
   * @param cursor - The cursor position to set.
   * @returns `true` if the cursor was set successfully.
   */
  public override setCursor(cursor: number): boolean {
    this.cursor = cursor;
    if (cursor === 1) {
      setTextColor(this.actionLabel, TextStyle.SETTINGS_SELECTED);
      setTextColor(this.cancelLabel, TextStyle.WINDOW);
    } else {
      setTextColor(this.actionLabel, TextStyle.WINDOW);
      setTextColor(this.cancelLabel, TextStyle.SETTINGS_SELECTED);
    }
    return true;
  }

  protected override clear() {
    clearTimeout(this.countdownTimer);
    this.timerText.setText("(5)");
    this.timeLeftAutoClose = 5;
    this.listening = false;
    this.target = null;
    this.callback = null;
    this.optionSelectContainer.setVisible(false);
    this.actionsContainer.setVisible(false);
    this.newButtonIcon.setVisible(false);
    this.buttonPressed = null;
  }

  /**
   * Handle input down events.
   *
   * @param buttonIcon - The icon of the button that was pressed.
   * @param assignedButtonIcon - The icon of the button that is assigned.
   * @param type - The type of button press.
   */
  onInputDown(buttonIcon: string, assignedButtonIcon: string | null, type: string): void {
    clearTimeout(this.countdownTimer);
    this.timerText.setText("");
    this.newButtonIcon.setTexture(type);
    this.newButtonIcon.setFrame(buttonIcon);
    if (assignedButtonIcon) {
      this.targetButtonIcon.setTexture(type);
      this.targetButtonIcon.setFrame(assignedButtonIcon);
      this.targetButtonIcon.setVisible(true);
      this.swapText.setVisible(true);
    }
    this.newButtonIcon.setVisible(true);
    this.setCursor(0);
    this.actionsContainer.setVisible(true);
  }

  protected getSelectedDevice(): string | null {
    return globalScene.inputController?.selectedDevice[this.device];
  }

  protected swapAction() {
    const selectedDevice = this.getSelectedDevice();
    if (isNil(selectedDevice)) {
      return false;
    }
    const activeConfig = globalScene.inputController.getActiveConfig(this.device);
    if (activeConfig && globalScene.inputController.assignBinding(activeConfig, this.target, this.buttonPressed)) {
      globalScene.gameData.saveMappingConfigs(selectedDevice, activeConfig);
      return true;
    }
    return false;
  }
}
