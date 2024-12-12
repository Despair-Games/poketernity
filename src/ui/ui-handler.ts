import { globalScene } from "#app/global-scene";
import type { TextStyle } from "./text";
import { getTextColor } from "./text";
import type { Mode } from "./ui";
import type { Button } from "#enums/buttons";
import { settings } from "#app/data/settings/settings-manager";

/**
 * A basic abstract class to act as a holder and processor for UI elements.
 */
export default abstract class UiHandler {
  protected mode: number | null;
  protected cursor: number = 0;
  public active: boolean = false;

  /**
   * @param scene The same scene as everything else.
   * @param mode The mode of the UI element. These should be unique.
   */
  constructor(mode: Mode | null = null) {
    this.mode = mode;
  }

  abstract setup(): void;

  show(_args: any[]): boolean {
    this.active = true;

    return true;
  }

  abstract processInput(button: Button): boolean;

  getUi() {
    return globalScene.ui;
  }

  getTextColor(style: TextStyle, shadow: boolean = false): string {
    return getTextColor(style, shadow, settings.display.uiTheme);
  }

  getCursor(): number {
    return this.cursor;
  }

  setCursor(cursor: number): boolean {
    const changed = this.cursor !== cursor;
    if (changed) {
      this.cursor = cursor;
    }

    return changed;
  }

  /**
   * Changes the style of the mouse cursor.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor}
   * @param cursorStyle cursor style to apply
   */
  protected setMouseCursorStyle(cursorStyle: "pointer" | "default") {
    globalScene.input.manager.canvas.style.cursor = cursorStyle;
  }

  clear() {
    this.active = false;
  }
}
