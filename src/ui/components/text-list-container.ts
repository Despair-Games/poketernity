import { globalScene } from "#app/global-scene";
import type { TextStyle } from "#enums/text-style";
import { addBBCodeTextObject, addTextObject } from "#ui/text-utils";
import type BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";

interface TextListContainerOptions {
  /**
   * Whether to use a {@linkcode BBCodeText} object instead of a basic {@linkcode TextObject}.
   * You should only set this to `true` if BBCode is needed. The BBCode should be part of the provided strings.
   */
  useBBCode?: boolean;
  /**
   * Optional alignment for the text.
   * The x origin of the textObject will be placed on the left, center or right of the text based on this.
   * @defaultValue `left`
   */
  textAlign?: "left" | "center" | "right";
}

/**
 * A container to display lines of text above each other, based on an array of strings.
 * Limits the number of lines shown at once and handles showing elements further down the list through a cursor.
 * This should be used whenever single-line text elements using the same TextStyle should be disposed vertically.
 * It concatenates the text into a single TextObject (or BBCodeTextObject) to save on resources.
 *
 * Call {@linkcode setList} to pass it the array of strings to display (by reference).
 * Call {@linkcode setCursor} to change the index of the first line to display.
 * Call {@linkcode updateList} to update the text without changing the cursor.
 */
export class TextListContainer extends Phaser.GameObjects.Container {
  /** The array of strings to display. */
  private lines: string[] = [];
  /** The index of the first line to display. */
  private currentLine: number = -1;
  /** The maximum number of lines shown at once on screen. */
  private maxLines: number;

  private readonly textObject: Phaser.GameObjects.Text | BBCodeText;

  /**
   * @param x - The x position of the TextObject in its parent container.
   * @param y - The y position of the TextObject in its parent container.
   * @param textStyle - The {@linkcode TextStyle} to use.
   * @param maxLines - The maximum number of lines to show at one.
   * @param options - (Optional) Extra text styling options {@linkcode TextListContainerOptions}.
   */
  constructor(x: number, y: number, textStyle: TextStyle, maxLines: number, options?: TextListContainerOptions) {
    super(globalScene, x, y);

    this.maxLines = maxLines;

    const align = options?.textAlign ?? "left";

    if (options?.useBBCode) {
      this.textObject = addBBCodeTextObject(0, 0, "", textStyle, { align });
    } else {
      this.textObject = addTextObject(0, 0, "", textStyle, { align });
    }

    // Place origin of the text object based on its alignment.
    let xOrigin = 0;
    if (align === "center") {
      xOrigin = 0.5;
    } else if (align === "right") {
      xOrigin = 1;
    }
    this.textObject.setOrigin(xOrigin, 0);

    this.add(this.textObject);
  }

  /**
   * Set the full array of strings to be displayed in the list.
   * The array will be kept as reference, so any future update to it will impact the list.
   * Call {@linkcode updateList} to refresh the text after any array update.
   *
   * @param content - Array of strings to be displayed.
   * @param show - Optional. Set to `true` to immediately display the content of the array.
   */
  public setList(content: string[], show: boolean = false): void {
    this.lines = content;
    if (show) {
      this.updateList();
    }
  }

  /**
   * Update the maximum amount of lines to show.
   * Call {@linkcode updateList} to refresh the text.
   *
   * @param maxLines - How many lines to cut the text at.
   * @param show - Optional. Set to `true` to immediately display the content of the array.
   */
  public setMaxLines(maxLines: number, show: boolean = false): void {
    this.maxLines = maxLines;
    this.textObject.setMaxLines(maxLines);
    if (show) {
      this.updateList();
    }
  }

  /**
   * Change the index of the first element in the list that should be displayed
   * and redraw the list if it changed.
   *
   * @param cursor - The index of the first element in the list that should be displayed.
   * @returns `true` if the cursor changed and the list was updated, `false` otherwise.
   */
  public setCursor(cursor: number): boolean {
    if (cursor === this.currentLine) {
      return false;
    }
    this.currentLine = cursor;
    this.showText();
    return true;
  }

  /**
   * Update the text based on the list registered through {@linkcode setList} and the current cursor.
   */
  public updateList() {
    if (this.currentLine === -1) {
      this.currentLine = 0;
    }
    this.showText();
  }

  /**
   * Reset the array and text content.
   */
  public reset() {
    this.currentLine = -1;
    this.textObject.setText("");
    this.lines = [];
  }

  private showText() {
    const subList = this.lines.slice(this.currentLine, this.currentLine + this.maxLines);
    this.textObject.setText(subList.join("\n"));
  }
}
