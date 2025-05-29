import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH, TEXT_SCALE } from "#constants/ui-constants";
import { Button } from "#enums/button";
import { PlayerGender } from "#enums/player-gender";
import { TextStyle } from "#enums/text-style";
import { UiMode } from "#enums/ui-mode";
import type { Achievement } from "#system/achievements";
import { achvs } from "#system/achievements";
import { settings } from "#system/settings-manager";
import type { Voucher } from "#system/voucher";
import { getVoucherTypeIcon, getVoucherTypeName, vouchers } from "#system/voucher";
import { MessageUiHandler } from "#ui/message-ui-handler";
import { ScrollBar } from "#ui/scroll-bar";
import { ScrollableGridController } from "#ui/scrollable-grid-controller";
import { addTextObject } from "#ui/text-utils";
import { addWindow } from "#ui/ui-theme";
import i18next from "i18next";

const Page = {
  ACHIEVEMENTS: 1,
  VOUCHERS: 2,
} as const;

type Page = (typeof Page)[keyof typeof Page];

export class AchievementsUiHandler extends MessageUiHandler {
  private readonly ROWS = 4;
  private readonly COLS = 17;

  private mainContainer: Phaser.GameObjects.Container;
  private iconsContainer: Phaser.GameObjects.Container;

  private headerBg: Phaser.GameObjects.NineSlice;
  private headerText: Phaser.GameObjects.Text;
  private headerActionText: Phaser.GameObjects.Text;
  private headerActionButton: Phaser.GameObjects.Sprite;
  private headerBgX: number;
  private iconsBg: Phaser.GameObjects.NineSlice;
  private icons: Phaser.GameObjects.Sprite[];

  private titleText: Phaser.GameObjects.Text;
  private unlockText: Phaser.GameObjects.Text;

  private achvsName: string;
  private achvsTotal: number;
  private vouchersName: string;
  private vouchersTotal: number;
  private currentTotal: number;

  private scrollGridHandler: ScrollableGridController;
  private scrollBar: ScrollBar;

  private cursorObj: Phaser.GameObjects.NineSlice | null;
  private currentPage: Page;

  constructor() {
    super(UiMode.ACHIEVEMENTS);

    this.achvsTotal = Object.keys(achvs).length;
    this.vouchersTotal = Object.keys(vouchers).length;
  }

  protected override setup() {
    const ui = this.getUi();

    this.mainContainer = globalScene.add.container(1, -GAME_HEIGHT + 1);

    this.headerBg = addWindow(0, 0, GAME_WIDTH - 2, 24);
    this.headerBg.setOrigin(0, 0);

    this.headerText = addTextObject(0, 0, "", TextStyle.SETTINGS_LABEL);
    this.headerText.setOrigin(0, 0);
    this.headerText.setPositionRelative(this.headerBg, 8, 4);
    this.headerActionButton = new Phaser.GameObjects.Sprite(globalScene, 0, 0, "keyboard", "ACTION.png");
    this.headerActionButton.setOrigin(0, 0);
    this.headerActionButton.setPositionRelative(this.headerBg, 236, 6);
    this.headerActionText = addTextObject(GAME_WIDTH - 10, 12, "", TextStyle.TOOLTIP_CONTENT);
    this.headerActionText.setOrigin(1, 0.5);

    // We need to get the player gender from the game data to add the correct prefix to the achievement name
    const genderIndex = settings.display.playerGender ?? PlayerGender.MALE;
    const genderStr = PlayerGender[genderIndex].toLowerCase();

    this.achvsName = i18next.t("achv:Achievements.name", { context: genderStr });
    this.vouchersName = i18next.t("voucher:vouchers");

    this.iconsBg = addWindow(0, this.headerBg.height, GAME_WIDTH - 2, GAME_HEIGHT - this.headerBg.height - 68);
    this.iconsBg.setOrigin(0, 0);

    const yOffset = 6;
    this.scrollBar = new ScrollBar(
      this.iconsBg.width - 9,
      this.iconsBg.y + yOffset,
      4,
      this.iconsBg.height - yOffset * 2,
      this.ROWS,
    );

    this.scrollGridHandler = new ScrollableGridController(this, this.ROWS, this.COLS)
      .withScrollBar(this.scrollBar)
      .withUpdateGridCallBack(() =>
        this.currentPage === Page.ACHIEVEMENTS ? this.updateAchvIcons() : this.updateVoucherIcons(),
      )
      .withUpdateSingleElementCallback((i: number) => this.showDetails(i));

    this.iconsContainer = globalScene.add.container(5, this.headerBg.height + 8);

    this.icons = [];

    for (let a = 0; a < this.ROWS * this.COLS; a++) {
      const x = (a % this.COLS) * 18;
      const y = Math.floor(a / this.COLS) * 18;

      const icon = globalScene.add.sprite(x, y, "items", "unknown");
      icon.setOrigin(0, 0);
      icon.setScale(0.5);

      this.icons.push(icon);
      this.iconsContainer.add(icon);
    }

    const titleBg = addWindow(0, this.headerBg.height + this.iconsBg.height, 220, 24);
    titleBg.setOrigin(0, 0);

    this.titleText = addTextObject(0, 0, "", TextStyle.STATS_VALUE);
    const titleBgCenterX = titleBg.x + titleBg.width / 2;
    const titleBgCenterY = titleBg.y + titleBg.height / 2;
    this.titleText.setOrigin(0.5, 0.5);
    this.titleText.setPosition(titleBgCenterX, titleBgCenterY);

    const unlockBg = addWindow(titleBg.x + titleBg.width, titleBg.y, 98, 24);
    unlockBg.setOrigin(0, 0);

    this.unlockText = addTextObject(0, 0, "", TextStyle.WINDOW);
    this.unlockText.setOrigin(0.5, 0.5);
    this.unlockText.setPositionRelative(unlockBg, unlockBg.width / 2, unlockBg.height / 2);

    const descriptionBg = addWindow(0, titleBg.y + titleBg.height, GAME_WIDTH - 2, 42);
    descriptionBg.setOrigin(0, 0);

    const descriptionText = addTextObject(0, 0, "", TextStyle.WINDOW, { maxLines: 2 });
    descriptionText.setWordWrapWidth((GAME_WIDTH - 16) * TEXT_SCALE);
    descriptionText.setOrigin(0, 0);
    descriptionText.setPositionRelative(descriptionBg, 8, 4);

    this.message = descriptionText;

    this.mainContainer.add(this.headerBg);
    this.mainContainer.add(this.headerActionButton);
    this.mainContainer.add(this.headerText);
    this.mainContainer.add(this.headerActionText);
    this.mainContainer.add(this.iconsBg);
    this.mainContainer.add(this.scrollBar);
    this.mainContainer.add(this.iconsContainer);
    this.mainContainer.add(titleBg);
    this.mainContainer.add(this.titleText);
    this.mainContainer.add(unlockBg);
    this.mainContainer.add(this.unlockText);
    this.mainContainer.add(descriptionBg);
    this.mainContainer.add(descriptionText);

    ui.add(this.mainContainer);

    this.mainContainer.setVisible(false);
  }

  protected override tearDown(): void {
    this.mainContainer.destroy();
  }

  public override show(): boolean {
    this.headerBgX = this.headerBg.getTopRight().x;

    this.mainContainer.setVisible(true);

    if (this.currentPage !== Page.ACHIEVEMENTS) {
      this.switchPage();
    }
    this.scrollGridHandler.reset();

    this.getUi().moveTo(this.mainContainer, this.getUi().length - 1);

    this.getUi().hideTooltip();

    return true;
  }

  /**
   * Display the details of the achievement or voucher at the given index, depending on the current page.
   * @param index - The index of the element in the full list of achievements or vouchers.
   */
  private showDetails(index: number) {
    if (this.currentPage === Page.ACHIEVEMENTS) {
      this.showAchv(achvs[Object.keys(achvs)[index]]);
    } else {
      this.showVoucher(vouchers[Object.keys(vouchers)[index]]);
    }
  }

  private showAchv(achv: Achievement) {
    const achvUnlocks = globalScene.gameData.achvUnlocks;
    const unlocked = Object.hasOwn(achvUnlocks, achv.id);
    const hidden = !unlocked && achv.secret && (!achv.parentId || !Object.hasOwn(achvUnlocks, achv.parentId));
    this.titleText.setText(unlocked ? achv.name : "???");
    this.showText(!hidden ? achv.description : "");
    this.unlockText.setText(
      unlocked ? new Date(achvUnlocks[achv.id]).toLocaleDateString() : i18next.t("achv:Locked.name"),
    );
  }

  private showVoucher(voucher: Voucher) {
    const voucherUnlocks = globalScene.gameData.voucherUnlocks;
    const unlocked = Object.hasOwn(voucherUnlocks, voucher.id);

    this.titleText.setText(getVoucherTypeName(voucher.voucherType));
    this.showText(voucher.description);
    this.unlockText.setText(
      unlocked ? new Date(voucherUnlocks[voucher.id]).toLocaleDateString() : i18next.t("voucher:locked"),
    );
  }

  public override processInput(button: Button): boolean {
    const ui = this.getUi();

    let success = false;

    if (button === Button.ACTION) {
      // Switch from achievements to vouchers page or the other way around
      this.switchPage();
      success = true;
    } else if (button === Button.CANCEL) {
      success = true;
      globalScene.ui.revertMode();
    } else {
      success = this.scrollGridHandler.processInput(button);
    }

    if (success) {
      ui.playSelect();
    }

    return success;
  }

  /**
   * Switch from the Achievements page to the Vouchers page, or the other way around, depending on the current page.
   */
  private switchPage() {
    if (this.currentPage === Page.ACHIEVEMENTS) {
      this.currentPage = Page.VOUCHERS;
      this.currentTotal = this.vouchersTotal;
      this.updateVoucherIcons();
    } else {
      this.currentPage = Page.ACHIEVEMENTS;
      this.currentTotal = this.achvsTotal;
      this.updateAchvIcons();
    }
    this.scrollGridHandler.setTotalElements(this.currentTotal);
    this.scrollGridHandler.reset();
  }

  public override setCursor(cursor: number): boolean {
    const changed = super.setCursor(cursor);

    if (!this.cursorObj) {
      this.cursorObj = globalScene.add.nineslice(0, 0, "select_cursor_highlight", undefined, 16, 16, 1, 1, 1, 1);
      this.cursorObj.setOrigin(0, 0);
      this.iconsContainer.add(this.cursorObj);
    }
    this.cursorObj.setPositionRelative(this.icons[this.cursor], 0, 0);

    this.showDetails(cursor + this.scrollGridHandler.getItemOffset());

    return changed;
  }

  /**
   * Updates the grid of icons for achievements based on the current scrolling.
   */
  private updateAchvIcons(): void {
    this.headerText.text = this.achvsName;
    this.headerActionText.text = this.vouchersName;
    const textPosition = this.headerBgX - this.headerActionText.displayWidth - 8;
    this.headerActionButton.setX(textPosition - this.headerActionButton.displayWidth - 2);

    const achvUnlocks = globalScene.gameData.achvUnlocks;

    const itemOffset = this.scrollGridHandler.getItemOffset();
    const itemLimit = this.ROWS * this.COLS;

    const achvRange = Object.values(achvs).slice(itemOffset, itemLimit + itemOffset);

    achvRange.forEach((achv: Achievement, i: number) => {
      const icon = this.icons[i];
      const unlocked = Object.hasOwn(achvUnlocks, achv.id);
      const hidden = !unlocked && achv.secret && (!achv.parentId || !Object.hasOwn(achvUnlocks, achv.parentId));
      const tinted = !hidden && !unlocked;

      icon.setFrame(!hidden ? achv.iconImage : "unknown");
      icon.setVisible(true);
      if (tinted) {
        icon.setTintFill(0);
      } else {
        icon.clearTint();
      }
    });

    if (achvRange.length < this.icons.length) {
      this.icons.slice(achvRange.length).map((i) => i.setVisible(false));
    }
  }

  /**
   * Updates the grid of icons for vouchers based on the current scrolling.
   */
  private updateVoucherIcons(): void {
    this.headerText.text = this.vouchersName;
    this.headerActionText.text = this.achvsName;
    const textPosition = this.headerBgX - this.headerActionText.displayWidth - 8;
    this.headerActionButton.setX(textPosition - this.headerActionButton.displayWidth - 2);

    const voucherUnlocks = globalScene.gameData.voucherUnlocks;

    const itemOffset = this.scrollGridHandler.getItemOffset();
    const itemLimit = this.ROWS * this.COLS;

    const voucherRange = Object.values(vouchers).slice(itemOffset, itemLimit + itemOffset);

    voucherRange.forEach((voucher: Voucher, i: number) => {
      const icon = this.icons[i];
      const unlocked = Object.hasOwn(voucherUnlocks, voucher.id);

      icon.setFrame(getVoucherTypeIcon(voucher.voucherType));
      icon.setVisible(true);
      if (!unlocked) {
        icon.setTintFill(0);
      } else {
        icon.clearTint();
      }
    });

    if (voucherRange.length < this.icons.length) {
      this.icons.slice(voucherRange.length).map((i) => i.setVisible(false));
    }
  }

  protected override clear() {
    this.scrollGridHandler.reset();
    this.eraseCursor();
    this.clearText();
    this.mainContainer.setVisible(false);
  }

  private eraseCursor() {
    if (this.cursorObj) {
      this.cursorObj.destroy();
    }
    this.cursorObj = null;
  }
}
