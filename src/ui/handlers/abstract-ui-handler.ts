import { globalScene } from "#app/global-scene";
import type { UiMode } from "#enums/ui-mode";
import type { Button } from "#enums/buttons";
import type { AwaitableUiHandler } from "#app/ui/handlers/awaitable-ui-handler";

/**
 * A basic abstract class to act as a holder and processor for UI elements.
 *
 * Subclasses should override the following functions of a handler's lifecycle:
 *  - {@linkcode setup}, called once to initiliaze basic elements of the handler.
 *  - {@linkcode show}, called whenever the handler is to be shown.
 *  - {@linkcode clear}, called when the handler should no longer be shown. Elements created in `show` get destroyed here.
 *  - {@linkcode destroy}, called when the handler will never be of use again. Any remaining element should get destroyed.
 */
export abstract class UiHandler {
  protected mode: number | null;
  protected cursor: number = 0;

  /** `true` if the handler is ready to be displayed through calling `handler.show`. */
  protected ready: boolean = false;
  /** `true` if the handler is currently in use. */
  public active: boolean = false;

  /**
   * @param mode The mode of the UI element. These should be unique.
   */
  constructor(mode: UiMode | null = null) {
    this.mode = mode;
  }

  /**
   * Prepares the handler for display.
   * Should not be overridden. Calls {@linkcode setup}, which subclasses should override.
   */
  initialize(): void {
    this.setup();
    this.ready = true;
  }

  /**
   * Teardown the handler.
   * Should not be overridden. Calls {@linkcode tearDown}, which subclasses should override.
   */
  destroy(): void {
    this.tearDown();
    this.ready = false;
  }

  /**
   * Displays the handler.
   * Should not be overridden. Calls {@linkcode show}, which subclasses should override.
   * @param args the arguments needed by this handler for display.
   * @returns `true` if the handler was setup successfully, `false` otherwise.
   */
  start(...args: unknown[]): boolean {
    this.active = true;

    return this.show(...args);
  }

  /**
   * Ends display of the handler.
   * Should not be overridden. Calls {@linkcode clear}, which subclasses should override.
   */
  stop(): void {
    this.clear();

    this.active = false;
  }

  /**
   * Create the basic building blocks of the ui handlers that will stay as long as it's meant to be used.
   * In general, we create a main container here that gets added to `this.getUi()`.
   * Elements (containers, listeners, ...) created here should be destroyed in {@linkcode destroy}.
   */
  protected abstract setup(): void;

  /**
   * Called when the handler will never be used again.
   *
   * Subclasses should destroy any element initialized in {@linkcode setup} here.
   * For most handlers, calling `mainContainer.destroy()` and removing any listeners
   * created by the handler should be enough.
   */
  protected abstract tearDown(): void;

  /**
   * Called when the mode corresponding this handler is shown, and it should
   * Prepare the handler for display, based on the arguments provided.
   * Elements (containers, gameObjects, listeners, ...) created here should be destroyed in {@linkcode clear}.
   *
   * @param _args the arguments needed by this handler for display.
   * @returns `true` if the handler was setup successfully, `false` otherwise.
   */
  public abstract show(..._args: unknown[]): boolean;

  /**
   * Called when the mode associated with this handler is finished, to clear up its contents.
   *
   * Subclasses should destroy any element initialized in {@linkcode show} here.
   * This can include, but is not limited to:
   *  - calling `container.removeAll(true)` to destroy all objects in a container without destroying the container
   *  - calling `gameObject.destroy()` to destroy any individual game object
   *  - calling `gameObject.setVisible(false)` on non destroyed objects or containers
   *  - calling `getUi().hideTooltip()` if the handler displays any sort of tooltip
   *  - removing any event listener that is no longer relevant
   *  - emptying arrays or other attributes needed for the handler to function
   *  - stopping any ongoing animation or timed event/callback
   */
  protected abstract clear(): void;

  public abstract processInput(button: Button): boolean;

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

  isAwaitableUiHandler(): this is AwaitableUiHandler {
    return false;
  }
}
