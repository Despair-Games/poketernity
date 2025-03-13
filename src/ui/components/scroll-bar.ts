import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";

/**
 * A vertical scrollbar element that resizes dynamically based on the current scrolling
 * and number of elements that can be shown on screen
 */
export class ScrollBar extends Phaser.GameObjects.Container {
  /** The current row we have scrolled down to. */
  private currentRow: number;
  /** The total number of rows in the list/grid gettings displayed. */
  private totalRows: number;
  /** The maximum number of rows shown at once on screen. */
  private maxRows: number;

  private bg: Phaser.GameObjects.NineSlice;
  private handle: Phaser.GameObjects.NineSlice;
  private scrollHeight: number;
  private maxHandleY: number;

  /**
   * @param x the scrollbar's x position (origin: top left)
   * @param y the scrollbar's y position (origin: top left)
   * @param width the scrollbar's width (minimum of 4)
   * @param height the scrollbar's height
   * @param maxRows the maximum number of rows that can be shown at once
   */
  constructor(x: number, y: number, width: number, height: number, maxRows: number) {
    super(globalScene, x, y);

    width = Math.max(width, 4);

    this.bg = globalScene.add.nineslice(0, 0, "scroll_bar", settings.display.uiWindowStyle, width, height, 2, 2, 2, 2);
    this.bg.setOrigin(0, 0);
    this.add(this.bg);

    this.handle = globalScene.add.nineslice(
      0,
      0,
      "scroll_bar_handle",
      settings.display.uiWindowStyle,
      width,
      2,
      2,
      2,
      2,
      2,
    );
    this.handle.setOrigin(0, 0);
    this.add(this.handle);

    this.maxRows = maxRows;
    this.currentRow = 0;
    this.setTotalRows(maxRows);
  }

  /**
   * Set the current row that is displayed
   * Moves the bar handle up or down accordingly
   * @param scrollCursor how many times the view was scrolled down
   */
  setScrollCursor(scrollCursor: number): void {
    this.currentRow = scrollCursor;
    this.updateHandlePosition();
  }

  /**
   * Set the total number of rows to display
   * If it's smaller than the maximum number of rows on screen the bar will get hidden
   * Otherwise the scrollbar handle gets resized based on the ratio to the maximum number of rows
   * @param rows how many rows of data there are in total
   */
  setTotalRows(rows: number): void {
    this.totalRows = rows;

    const handleHeight = Math.max(4, Math.round((this.bg.displayHeight * this.maxRows) / this.totalRows));
    this.maxHandleY = this.bg.displayHeight - handleHeight;
    this.scrollHeight = this.maxHandleY / (this.totalRows - this.maxRows);

    this.handle.setSize(this.handle.displayWidth, handleHeight);
    this.updateHandlePosition();

    this.setVisible(this.totalRows > this.maxRows);
  }

  private updateHandlePosition(): void {
    this.handle.y = Math.min(this.maxHandleY, Math.round(this.scrollHeight * this.currentRow));
  }

  override destroy(fromScene?: boolean): void {
    this.removeAll(true);
    super.destroy(fromScene);
  }
}
