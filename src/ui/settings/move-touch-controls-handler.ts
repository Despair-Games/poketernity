import { LS_PREFIX } from "#app/constants";
import { eventBus } from "#app/event-bus";
import { globalScene } from "#app/global-scene";
import type TouchControl from "#app/touch-controls";
import { GAME_HEIGHT, GAME_WIDTH } from "#app/ui-constants";
import type { UI } from "#app/ui/ui";
import { t } from "i18next";

//#region Types

type ControlPosition = { id: string; x: number; y: number };

type ConfigurationEventListeners = {
  touchstart: EventListener[];
  touchmove: EventListener[];
  touchend: EventListener[];
};

//#endregion

/**
 * Handles the dragging of touch controls around the screen.
 */
export class MoveTouchControlsHandler {
  /** The element that is currently being dragged */
  private draggingElement: HTMLElement | null = null;

  /**
   * Whether the user is currently configuring the touch controls.
   * When this is true, the touch controls can be dragged around the screen and the controls of the game are disabled.
   */
  private inConfigurationMode: boolean;

  /**
   * The event listeners for the configuration mode.
   * These are used to remove the event listeners when the configuration mode is disabled.
   */
  private configurationEventListeners: ConfigurationEventListeners = {
    touchstart: [],
    touchmove: [],
    touchend: [],
  };

  private overlay: Phaser.GameObjects.Container;

  private touchControls: TouchControl;

  private currentOrientation: Phaser.Scale.Orientation = globalScene.scale.orientation;

  constructor(touchControls: TouchControl) {
    this.touchControls = touchControls;
    this.inConfigurationMode = false;
    this.setPositions(this.getSavedPositionsOfCurrentOrientation() ?? []);
    this.initListeners();
  }

  //#region Getter/Setter

  public get screenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  public get orientation() {
    return globalScene.scale.orientation;
  }

  public get isLandscape() {
    return this.orientation === Phaser.Scale.Orientation.LANDSCAPE;
  }

  public get localstorageKey() {
    return `${LS_PREFIX}/touchControl/positions/${this.orientation}`;
  }

  public get touchControlsEl() {
    return document.getElementById("touchControls");
  }

  public get orientationEl() {
    return document.getElementById("orientation");
  }

  public get controlGroupEls(): HTMLElement[] {
    return [...(this.touchControlsEl?.querySelectorAll<HTMLElement>(".control-group") ?? [])];
  }

  public get configToolbarEl() {
    return document.getElementById("configToolbar") as HTMLDivElement;
  }

  public get saveBtn() {
    return document.getElementById("saveButton") as HTMLButtonElement;
  }

  public get resetBtn() {
    return document.getElementById("resetButton") as HTMLButtonElement;
  }

  public get cancelBtn() {
    return document.getElementById("cancelButton") as HTMLButtonElement;
  }

  public get leftTouchControlsEl() {
    return this.touchControlsEl?.querySelector<HTMLElement>(".left") ?? null;
  }

  //#endregion

  public initListeners() {
    globalScene.scale.on("orientationchange", () => {
      this.updateOrientation();
    });

    eventBus.on("touchControls/move/start", () => {
      this.enableConfigurationMode(globalScene.ui);
    });
  }

  /**
   * Allows the user to configure the touch controls by dragging buttons around the screen.
   * @param ui The UI of the game.
   */
  public enableConfigurationMode(ui: UI) {
    if (this.inConfigurationMode) {
      return;
    }
    this.inConfigurationMode = true;
    this.touchControls.disable();
    this.createOverlay(ui);
    this.createToolbar();
    // Create event listeners with a delay to prevent the touchstart event from being triggered immediately.
    setTimeout(() => {
      // Remember the event listeners so they can be removed later.
      this.configurationEventListeners = this.createConfigurationEventListeners(this.controlGroupEls);
    }, 500);
  }

  /**
   * Disables the configuration mode.
   */
  public disableConfigurationMode() {
    this.inConfigurationMode = false;
    this.draggingElement = null;

    // Remove event listeners
    const { touchstart, touchmove, touchend } = this.configurationEventListeners;
    this.controlGroupEls.forEach((element, index) => element.removeEventListener("touchstart", touchstart[index]));
    touchmove.forEach((listener) => window.removeEventListener("touchmove", listener));
    touchend.forEach((listener) => window.removeEventListener("touchend", listener));

    // Remove configuration toolbar
    this.configToolbarEl?.remove();

    // Remove overlay
    this.overlay?.destroy();
    if (this.touchControlsEl) {
      delete this.touchControlsEl.dataset.configuring;
    }
    this.touchControls.enable();
  }

  /**
   * Checks for updated orientation and updates the positions of the touch controls if necessary.
   */
  private updateOrientation() {
    if (this.inConfigurationMode) {
      if (this.orientationEl) {
        this.orientationEl.textContent = t(`settings:${this.isLandscape ? "landscape" : "portrait"}`);
      }
    }
    const positions = this.getSavedPositionsOfCurrentOrientation() ?? [];
    this.setPositions(positions);
  }

  /**
   * Creates the toolbar element for the configuration mode.
   * @returns A new div element that contains the toolbar for the configuration mode.
   */
  private createToolbarElement(): HTMLDivElement {
    const toolbar = document.createElement("div");
    toolbar.id = "configToolbar";
    toolbar.innerHTML = `
      <div class="column">
        <div class="button-row">
          <div id="resetButton" class="button">${t("settings:reset")}</div>
          <div id="saveButton" class="button">${t("settings:saveAndClose")}</div>
          <div id="cancelButton" class="button">${t("settings:buttonCancel")}</div>
        </div>
        <div class="info-row">
          <div class="orientation-label"> 
            ${t("settings:orientation")}: <span id="orientation">${t(`settings:${this.isLandscape ? "landscape" : "portrait"}`)}</span>
          </div>
        </div>
      </div>
    `;
    return toolbar;
  }

  /**
   * Initializes the toolbar of the configuration mode.
   * Places its elements at the top of the touch controls and adds event listeners to them.
   */
  private createToolbar() {
    this.touchControlsEl?.prepend(this.createToolbarElement());

    if (!this.configToolbarEl) return;

    this.saveBtn.addEventListener("click", () => {
      this.saveCurrentPositions();
      this.disableConfigurationMode();
      eventBus.emit("touchControls/move/save");
      eventBus.emit("touchControls/move/end");
    });
    this.resetBtn.addEventListener("click", () => {
      this.resetPositions();
      eventBus.emit("touchControls/move/reset");
    });
    this.cancelBtn.addEventListener("click", () => {
      const positions = this.getSavedPositionsOfCurrentOrientation();
      this.setPositions(positions);
      this.disableConfigurationMode();
      eventBus.emit("touchControls/move/cancel");
      eventBus.emit("touchControls/move/end");
    });
  }

  /**
   * Elements that are inside the left div are anchored to the left boundary of the screen.
   * The x value of the positions are considered offsets to their respective boundaries.
   * @param element Either an element in the left div or the right div.
   * @returns Whether the given element is inside the left div.
   */
  private isLeft = (element: HTMLElement) => this.leftTouchControlsEl?.contains(element);

  /**
   * Start dragging the given button.
   * @param controlGroup The button that is being dragged.
   * @param touch The touch event that started the drag.
   */
  private startDrag = (controlGroup: HTMLElement): void => {
    this.draggingElement = controlGroup;
  };

  /**
   * Drags the currently dragged element to the given touch position.
   * @param touch The touch event that is currently happening.
   * @param isLeft Whether the dragged element is a left button.
   */
  private drag = (touch: Touch): void => {
    if (!this.draggingElement) {
      return;
    }
    const rect = this.draggingElement.getBoundingClientRect();
    // Map the touch position to the center of the dragged element.
    const xOffset = this.isLeft(this.draggingElement)
      ? touch.clientX - rect.width / 2
      : window.innerWidth - touch.clientX - rect.width / 2;
    const yOffset = window.innerHeight - touch.clientY - rect.height / 2;
    this.setPosition(this.draggingElement, xOffset, yOffset);
  };

  /**
   * Stops dragging the currently dragged element.
   */
  private stopDrag = () => {
    this.draggingElement = null;
  };

  /**
   * Returns the current positions of all touch controls that have moved from their default positions of this orientation.
   * @returns The current positions of all touch controls that have moved from their default positions of this orientation
   */
  private getModifiedCurrentPositions(): ControlPosition[] {
    return this.controlGroupEls
      .filter((controlGroupEl) => controlGroupEl.style.right || controlGroupEl.style.left)
      .map((controlGroupEl) => {
        return {
          id: controlGroupEl.id,
          x: parseFloat(this.isLeft(controlGroupEl) ? controlGroupEl.style.left : controlGroupEl.style.right),
          y: parseFloat(controlGroupEl.style.bottom),
        };
      });
  }

  /**
   * Returns the saved positions of the touch controls.
   * Filters result by the given orientation.
   * @returns The saved positions of the touch controls of this orientation
   */
  private getSavedPositionsOfCurrentOrientation(): ControlPosition[] {
    const positions = localStorage.getItem(this.localstorageKey);
    if (!positions) {
      return [];
    }
    return JSON.parse(positions) as ControlPosition[];
  }

  /**
   * Saves the current positions of the touch controls to the local storage.
   */
  private saveCurrentPositions() {
    const pos = this.getModifiedCurrentPositions();
    localStorage.setItem(this.localstorageKey, JSON.stringify(pos));
  }

  /**
   * Updates the positions of the touch controls.
   * @param positions The new positions of the touch controls.
   */
  private setPositions(positions: ControlPosition[]) {
    this.resetPositions();
    return positions.forEach((pos: ControlPosition) => {
      const controlGroup = document.querySelector(`#${pos.id}`) as HTMLElement;
      this.setPosition(controlGroup, pos.x, pos.y);
    });
  }

  /**
   * Sets a control element to the given position.
   * The x values are either offsets to the left or right boundary of the screen, depending on the side of the element.
   * E.g. For left elements, (0, 0) is the bottom left corner of the screen and
   * for right elements, (0, 0) is the bottom right corner of the screen.
   * @param controlElement
   * @param x Either an offset to the left or right boundary of the screen.
   * @param y An offset to the bottom boundary of the screen.
   */
  private setPosition(controlElement: HTMLElement, x: number, y: number) {
    const rect = controlElement.getBoundingClientRect();
    const checkBound = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    const { height, width } = this.screenSize;
    x = checkBound(x, 0, width - rect.width);
    y = checkBound(y, 0, height - rect.height);
    if (this.isLeft(controlElement)) {
      controlElement.style.left = `${x}px`;
    } else {
      controlElement.style.right = `${x}px`;
    }
    controlElement.style.bottom = `${y}px`;
  }

  /**
   * Resets the positions of the touch controls to their default positions and clears the saved positions.
   * Does not save the changes.
   */
  private resetPositions() {
    this.controlGroupEls.forEach((controlGroup: HTMLDivElement) => {
      controlGroup.style.removeProperty("left");
      controlGroup.style.removeProperty("right");
      controlGroup.style.removeProperty("bottom");
    });
  }

  /**
   * Creates the event listeners for the configuration mode.
   * @param controlGroups The elements that can be dragged around the screen.
   * @returns The event listeners for the configuration mode.
   */
  private createConfigurationEventListeners(controlGroups: HTMLElement[]): ConfigurationEventListeners {
    return {
      touchstart: controlGroups.map((element) => {
        const startDrag = () => this.startDrag(element);
        element.addEventListener("touchstart", startDrag, { passive: true });
        return startDrag;
      }),
      touchmove: controlGroups.map(() => {
        const drag = (event: TouchEvent) => this.drag(event.touches[0]);
        window.addEventListener("touchmove", drag, { passive: true });
        return drag;
      }),
      touchend: controlGroups.map(() => {
        const stopDrag = () => this.stopDrag();
        window.addEventListener("touchend", stopDrag, { passive: true });
        return stopDrag;
      }),
    };
  }

  /**
   * Creates an overlay that covers the screen and allows the user to drag the touch controls around.
   * Also enables the toolbar for saving, resetting, and canceling the changes.
   * @param ui The UI of the game.
   */
  private createOverlay(ui: UI) {
    const container = new Phaser.GameObjects.Container(globalScene, 0, 0);
    const overlay = new Phaser.GameObjects.Rectangle(globalScene, 0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5);
    overlay.setOrigin(0, 1);
    container.add(overlay);
    ui.add(container);
    this.overlay = container;

    // Display toolbar
    if (this.touchControlsEl) {
      this.touchControlsEl.dataset.configuring = "configuring";
    }
  }
}
