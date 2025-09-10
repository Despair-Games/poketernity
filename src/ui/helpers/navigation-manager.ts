import { globalScene } from "#app/global-scene";
import { Button } from "#enums/button";
import type { UiMode } from "#enums/ui-mode";
import type { GeneralSettingsUiHandler } from "#ui/general-settings-ui-handler";
import { NavigationMenu } from "#ui/navigation-menu";

interface TabOptions {
  mode: UiMode;
  label: string;
}

/**
 * Manage navigation between various {@linkcode UiMode}s through tabs.
 * A single NavigationManager can handle a number of {@linkcode NavigationMenu}s
 * that will be kept in sync with each other to allow using it accross different ui handlers.
 *
 * Each ui handler that is to be part of the NavigationManager's responsibility should:
 * - register a new NavigationMenu by calling {@linkcode addMenu}.
 * - handler the navigation and updating of the menu, call {@linkcode processInput}.
 *
 * Note: Adding the `NavigationMenu` to the ui as well as clearing and destroying
 * it is the responsibility of the individual handlers.
 * As such, children classes should be careful about not allowing multiple instances,
 * preferrably through a singleton pattern.
 */
export abstract class NavigationManager {
  private readonly tabs: TabOptions[];
  private cursor: number;
  private navigationMenus: NavigationMenu[];

  /**
   * Creates an instance of NavigationManager which handles a number of NavigationMenus accross different ui modes.
   * To create a new NavigationMenu to track, call {@linkcode addMenu}
   * @example this.navigationContainer = manager.addMenu(0, 0);
   */
  constructor(tabs: TabOptions[]) {
    this.tabs = tabs;
    this.cursor = 0;
    this.navigationMenus = [];
  }

  public getSelectedIndex(): number {
    return this.cursor;
  }

  public addMenu(x: number, y: number): NavigationMenu {
    const tabsMap = this.tabs.map((tab) => tab.label);
    const menu = new NavigationMenu(x, y, tabsMap);
    menu.setSelected(this.cursor);
    this.navigationMenus.push(menu);
    return menu;
  }

  /**
   * Clear all references to {@linkcode NavigationMenu}s, allowing them to be destroyed and garbage collected.
   */
  public clearMenus(): void {
    this.navigationMenus = [];
  }

  public reset() {
    this.setCursor(0);
  }

  /**
   * Handles navigation based on the button pressed.
   * @param button The button pressed for navigation.
   * @returns A boolean indicating if the navigation was handled.
   */
  public processInput(button: Button): boolean {
    switch (button) {
      case Button.CYCLE_FORM: // LEFT
        if (this.cursor === 0) {
          return this.setCursor(this.tabs.length - 1);
        }
        return this.setCursor(this.cursor - 1);
      case Button.CYCLE_SHINY: // RIGHT
        if (this.cursor === this.tabs.length - 1) {
          return this.setCursor(0);
        }
        return this.setCursor(this.cursor + 1);
    }
    return false;
  }

  protected setCursor(cursor: number): boolean {
    if (cursor === this.cursor) {
      return false;
    }
    this.cursor = cursor;
    for (const menu of this.navigationMenus) {
      menu.setSelected(this.cursor);
    }
    globalScene.ui.setMode<GeneralSettingsUiHandler>(this.tabs[this.cursor].mode);
    return true;
  }

  /**
   * Updates icons for all navigation menus.
   */
  public updateIcons() {
    for (const instance of this.navigationMenus) {
      instance.updateIcons();
    }
  }
}
