import { globalScene } from "#app/global-scene";
import type { Button } from "#enums/button";
import type { UiMode } from "#enums/ui-mode";
import type { AwaitableUiHandler } from "#ui/awaitable-ui-handler";

/**
 * A basic abstract class to act as a holder and processor for UI elements.
 *
 * Subclasses should override the following functions of a handler's lifecycle:
 *  - {@linkcode setup}, called once to initiliaze basic elements of the handler. Will be marked as `ready` once done.
 *  - {@linkcode show}, called whenever the handler is to be shown. Will be marked as `active` once done.
 *  - {@linkcode clear}, called when the handler should no longer be shown.
 *     Will be marked as no longer `active` once done. Elements created in `show` should get destroyed here.
 *  - {@linkcode tearDown}, called when the handler will never be of use again.
 *     Will be marked as no longer `ready` once done. Any remaining element should get destroyed here.
 */
export abstract class UiHandler {
  protected mode: number | null;
  protected cursor: number = 0;

  /**
   * Whether the handler is setup and ready to be displayed through calling {@linkcode start}.
   * note: not relevant for now since all handlers are ready at all times.
   */
  private _ready: boolean = false;

  /**
   * Whether the handler is currently active. Can be made inactive by calling {@linkcode stop}.
   */
  private _active: boolean = false;

  /**
   * @param mode - The mode of the UI element. These should be unique.
   */
  constructor(mode: UiMode | null = null) {
    this.mode = mode;
  }

  public get active(): boolean {
    return this._active;
  }

  public get ready(): boolean {
    return this._ready;
  }

  /**
   * Prepares the handler for display.
   * Should not be overridden. Calls {@linkcode setup}, which subclasses should override.
   */
  public initialize(): void {
    if (this.ready) {
      console.warn("Attempting to initialize an already ready handler. Aborting.");
      return;
    }

    this.setup();
    this._ready = true;
  }

  /**
   * Destroys the handler and makes it no longer usable.
   * Should not be overridden. Calls {@linkcode tearDown}, which subclasses should override.
   */
  public destroy(): void {
    if (!this.ready) {
      console.warn("Attempting to destroy a non initialized handler. Aborting.");
      return;
    }

    // If the handler is active, stop it first.
    if (this.active) {
      this.stop();
    }

    this.tearDown();
    this._ready = false;
  }

  /**
   * Displays the handler.
   * Should not be overridden. Calls {@linkcode show}, which subclasses should override.
   *
   * @param args - The arguments needed by this handler for display.
   * @returns `true` if the handler was setup successfully, `false` otherwise.
   */
  public start(...args: unknown[]): boolean {
    if (!this.ready) {
      console.warn("Attempting to start a non ready handler. Aborting.");
      return false;
    }

    const success = this.show(...args);
    this._active = true;
    return success;
  }

  /**
   * Ends display of the handler.
   * Should not be overridden. Calls {@linkcode clear}, which subclasses should override.
   */
  public stop(): void {
    if (!this.active) {
      console.warn("Attempting to stop a non active handler. Aborting.");
      return;
    }

    this.clear();
    this._active = false;
  }

  /**
   * Create the basic building blocks of the ui handlers that will stay as long as it's meant to be used.
   * In general, we add basic containers or elements to `this.getUi()` here.
   *
   * Elements (containers, listeners, ...) created here should be destroyed in {@linkcode tearDown}.
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
   * Called when the mode corresponding this handler is set, and it should
   * prepare the handler for display, based on the arguments provided.
   *
   * Elements (containers, gameObjects, listeners, ...) created here should be destroyed in {@linkcode clear}.
   *
   * @param _args - The arguments needed by this handler for display.
   * @returns `true` if the handler was setup successfully, `false` otherwise.
   */
  public abstract show(..._args: unknown[]): boolean;

  /**
   * Called when the mode associated with this handler is finished, to clear up its contents.
   *
   * Subclasses should destroy any element initialized in {@linkcode show} here.
   * This can include, but is not limited to:
   *  - calling `container.removeAll(true)` to destroy all objects in a container without destroying the container
   *  - calling `gameObject.destroy()` to destroy any individual game object or container
   *  - calling `gameObject.setVisible(false)` on non destroyed objects or containers, like those created in {@linkcode setup}
   *  - calling `getUi().hideTooltip()` if the handler displays any sort of tooltip
   *  - removing any event listener related to destroyed objects
   *  - stopping any ongoing animation or timed event/callback
   *  - emptying arrays or other attributes containing destroyed objects
   */
  protected abstract clear(): void;

  public abstract processInput(button: Button): boolean;

  /** @deprecated */
  public getUi() {
    return globalScene.ui;
  }

  public getCursor(): number {
    return this.cursor;
  }

  public setCursor(cursor: number): boolean {
    const changed = this.cursor !== cursor;
    if (changed) {
      this.cursor = cursor;
    }

    return changed;
  }

  /**
   * Changes the style of the mouse cursor.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor}
   * @param cursorStyle - The cursor style to apply
   */
  protected setMouseCursorStyle(cursorStyle: "pointer" | "default") {
    globalScene.input.manager.canvas.style.cursor = cursorStyle;
  }

  public isAwaitableUiHandler(): this is AwaitableUiHandler {
    return false;
  }
}
