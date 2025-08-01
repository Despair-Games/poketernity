import { globalScene } from "#app/global-scene";
import { GAME_WIDTH } from "#constants/ui-constants";
import { TextStyle } from "#enums/text-style";
import type { InputSettings } from "#types/inputs-types";
import { addTextObject, setTextColor } from "#ui/text-utils";
import { addWindow } from "#ui/ui-theme";

/**
 * Container composed of a horizontal window panning the game's width
 * with a series of text labels corresponding to tabs
 * and button icons for navigating between the tabs.
 */
export class NavigationMenu extends Phaser.GameObjects.Container {
  private cursor: number;
  private navigationIcons: Partial<Record<InputSettings, Phaser.GameObjects.Sprite>>;
  private headerTitles: Phaser.GameObjects.Text[] = [];

  /**
   * Creates an instance of NavigationMenu.
   * @param x The x position of the NavigationMenu.
   * @param y The y position of the NavigationMenu.
   */
  constructor(x: number, y: number, labels: string[]) {
    super(globalScene, x, y);

    this.cursor = -1;
    this.setup(labels);
  }

  /**
   * Sets up the NavigationMenu by adding windows, icons, and labels.
   */
  private setup(labels: string[]): void {
    const headerBg = addWindow(0, 0, GAME_WIDTH - 2, 24);
    headerBg.setOrigin(0, 0);
    this.add(headerBg);
    this.width = headerBg.width;
    this.height = headerBg.height;

    this.navigationIcons = {};

    const iconPreviousTab = globalScene.add.sprite(0, 0, "keyboard");
    iconPreviousTab.setOrigin(0, 0.5);
    iconPreviousTab.setPositionRelative(headerBg, 8, Math.floor(headerBg.height / 2));
    this.navigationIcons["BUTTON_CYCLE_FORM"] = iconPreviousTab;

    const iconNextTab = globalScene.add.sprite(0, 0, "keyboard");
    iconNextTab.setOrigin(1, 0.5);
    iconNextTab.setPositionRelative(headerBg, headerBg.width - 8, Math.floor(headerBg.height / 2));
    this.navigationIcons["BUTTON_CYCLE_SHINY"] = iconNextTab;

    this.add(iconPreviousTab);
    this.add(iconNextTab);

    let totalLabelWidth = 0;
    for (const label of labels) {
      const labelText = addTextObject(0, 0, label, TextStyle.SETTINGS_LABEL);
      labelText.setOrigin(0, 0.5);
      totalLabelWidth += labelText.displayWidth;
      this.add(labelText);
      this.headerTitles.push(labelText);
    }

    const spacing = Math.floor(
      (headerBg.width - totalLabelWidth - iconPreviousTab.displayWidth * 3) / (labels.length + 1),
    );
    let previousObject: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text = iconPreviousTab;
    for (const label of this.headerTitles) {
      label.setPosition(previousObject.x + previousObject.displayWidth + spacing, previousObject.y);
      previousObject = label;
    }
  }

  /**
   * Mark the given tab as selected, updating its text color.
   * @param cursor index of the selected tab.
   * @returns `true` if the selection was updated, `false` otherwise
   */
  public setSelected(cursor: number): boolean {
    if (cursor === this.cursor) {
      return false;
    }
    if (this.cursor >= 0) {
      setTextColor(this.headerTitles[this.cursor], TextStyle.SETTINGS_LABEL);
    }
    setTextColor(this.headerTitles[cursor], TextStyle.SETTINGS_SELECTED);
    this.cursor = cursor;
    return true;
  }

  /**
   * Updates the icons in the NavigationMenu based on the latest input device used.
   */
  public updateIcons(): void {
    for (const settingName of Object.keys(this.navigationIcons)) {
      const icon = this.navigationIcons[settingName];
      const frame = globalScene.inputController?.getIconForLatestInputRecorded(settingName as InputSettings);
      const type = globalScene.inputController?.getLastSourceType();
      if (frame && type) {
        icon.setTexture(type, frame);
        icon.alpha = 1;
      } else {
        icon.alpha = 0;
      }
    }
  }
}
