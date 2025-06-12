import { globalScene } from "#app/global-scene";
import { GAME_WIDTH } from "#constants/ui-constants";
import { TextStyle } from "#enums/text-style";
import type { InputsIcons } from "#ui/controls-settings-ui-handler";
import { addTextObject, setTextColor } from "#ui/text-utils";
import { addWindow } from "#ui/ui-theme";

export class NavigationMenu extends Phaser.GameObjects.Container {
  private cursor: number;
  private navigationIcons: InputsIcons;
  protected headerTitles: Phaser.GameObjects.Text[] = [];

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
  private setup(labels: string[]) {
    const headerBg = addWindow(0, 0, GAME_WIDTH - 2, 24);
    headerBg.setOrigin(0, 0);
    this.add(headerBg);
    this.width = headerBg.width;
    this.height = headerBg.height;

    this.navigationIcons = {};

    const iconPreviousTab = globalScene.add.sprite(8, 4, "keyboard");
    iconPreviousTab.setOrigin(0, -0.1);
    iconPreviousTab.setPositionRelative(headerBg, 8, 4);
    this.navigationIcons["BUTTON_CYCLE_FORM"] = iconPreviousTab;

    const iconNextTab = globalScene.add.sprite(0, 0, "keyboard");
    iconNextTab.setOrigin(0, -0.1);
    iconNextTab.setPositionRelative(headerBg, headerBg.width - 20, 4);
    this.navigationIcons["BUTTON_CYCLE_SHINY"] = iconNextTab;

    let relative: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text = iconPreviousTab;
    let relativeWidth: number = iconPreviousTab.displayWidth;
    for (const label of labels) {
      const labelText = addTextObject(0, 0, label, TextStyle.SETTINGS_LABEL);
      labelText.setOrigin(0, 0);
      labelText.setPositionRelative(relative, 6 + relativeWidth, 0);
      this.add(labelText);
      this.headerTitles.push(labelText);
      relative = labelText;
      relativeWidth = labelText.displayWidth;
    }

    this.add(iconPreviousTab);
    this.add(iconNextTab);
  }

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
   * Updates the icons in the NavigationMenu based on the latest input recorded.
   */
  public updateIcons() {
    const specialIcons = {
      BUTTON_HOME: "HOME.png",
      BUTTON_DELETE: "DEL.png",
    };
    for (const settingName of Object.keys(this.navigationIcons)) {
      if (Object.keys(specialIcons).includes(settingName)) {
        this.navigationIcons[settingName].setTexture("keyboard");
        this.navigationIcons[settingName].setFrame(specialIcons[settingName]);
        this.navigationIcons[settingName].alpha = 1;
        continue;
      }
      const icon = globalScene.inputController?.getIconForLatestInputRecorded(settingName);
      if (icon) {
        const type = globalScene.inputController?.getLastSourceType();
        this.navigationIcons[settingName].setTexture(type);
        this.navigationIcons[settingName].setFrame(icon);
        this.navigationIcons[settingName].alpha = 1;
      } else {
        this.navigationIcons[settingName].alpha = 0;
      }
    }
  }
}
