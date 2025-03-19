import { globalScene } from "#app/global-scene";
import type { UiMode } from "#enums/ui-mode";
import type { Button } from "#enums/buttons";
import type { AwaitableUiHandler } from "#app/ui/handlers/awaitable-ui-handler";

/**
 * A basic abstract class to act as a holder and processor for UI elements.
 */
export abstract class UiHandler {
  protected mode: number | null;
  protected cursor: number = 0;
  public active: boolean = false;

  /**
   * @param mode The mode of the UI element. These should be unique.
   */
  constructor(mode: UiMode | null = null) {
    this.mode = mode;
  }

  abstract setup(): void;

  show(..._args: unknown[]): boolean {
    this.active = true;

    return true;
  }

  abstract processInput(button: Button): boolean;

  getUi() {
    return globalScene.ui;
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

  isAwaitableUiHandler(): this is AwaitableUiHandler {
    return false;
  }
}
