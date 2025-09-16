import { globalScene } from "#app/global-scene";
import { TextStyle } from "#enums/text-style";
import type { UiMode } from "#enums/ui-mode";
import type { ShowTextOptions } from "#types/ui-types";
import type { AnyFn } from "#types/utility-types";
import { AwaitableUiHandler } from "#ui/awaitable-ui-handler";
import { addTextObject } from "#ui/text-utils";
import { getFrameMs } from "#utils/common-utils";

export abstract class MessageUiHandler extends AwaitableUiHandler {
  protected textTimer: Phaser.Time.TimerEvent | null;
  protected textCallbackTimer: Phaser.Time.TimerEvent | null;
  public pendingPrompt: boolean;

  public message: Phaser.GameObjects.Text;
  public prompt: Phaser.GameObjects.Sprite;

  constructor(mode: UiMode | null = null) {
    super(mode);

    this.pendingPrompt = false;
  }

  /**
   * Add the sprite to be displayed at the end of messages with prompts
   * @param container the container to add the sprite to
   */
  protected initPromptSprite(container: Phaser.GameObjects.Container) {
    if (!this.prompt) {
      const promptSprite = globalScene.add.sprite(0, 0, "prompt");
      promptSprite.setVisible(false);
      promptSprite.setOrigin(0, 0);
      this.prompt = promptSprite;
    }

    if (container) {
      container.add(this.prompt);
    }
  }

  /**
   * Displays a dialogue message on the UI with optional delay and speaker name.
   *
   * @param text - The dialogue message to display.
   * @see {@linkcode ShowTextOptions} for optional params
   */
  public showText(text: string, { delay, callback, callbackDelay, prompt, promptDelay }: ShowTextOptions = {}) {
    if (text == null) {
      console.error(`Missing text parameter in "${this.constructor.name}#showText()"!`);
    }
    this.showTextInternal(text, { delay, callback, callbackDelay, prompt, promptDelay });
  }

  /**
   * Displays a dialogue with the given text and optional parameters.
   *
   * @param text - The dialogue text to display.
   * @param _name - (Optional) The name of the character speaking the dialogue.
   * @param delay - (Optional) The delay in milliseconds before the dialogue is displayed.
   * @param callback - (Optional) A function to execute after the dialogue is displayed.
   * @param callbackDelay - (Optional) The delay in milliseconds before the callback is executed.
   * @param prompt - (Optional) Whether to display the prompt icon at the end of the textbox.
   * @param promptDelay - (Optional) The delay in milliseconds before the prompt is displayed.
   */
  public showDialogue(
    text: string,
    _name?: string,
    callback?: VoidFunction,
    delay?: number,
    callbackDelay?: number,
    prompt?: boolean,
    promptDelay?: number,
  ) {
    this.showTextInternal(text, { delay, callback, callbackDelay, prompt, promptDelay });
  }

  private showTextInternal(
    text: string,
    { delay = 20, callback, callbackDelay = 0, prompt = false, promptDelay = 0 }: ShowTextOptions = {},
  ) {
    // Pattern matching regex that checks for @c{}, @f{}, @s{}, and @f{} patterns within message text and parses them to their respective behaviors.
    const charVarMap = new Map<number, string>();
    const delayMap = new Map<number, number>();
    const soundMap = new Map<number, string>();
    const fadeMap = new Map<number, number>();
    const actionPattern = /@(c|d|s|f)\{(.*?)\}/;
    let actionMatch: RegExpExecArray | null = actionPattern.exec(text);
    while (actionMatch) {
      switch (actionMatch[1]) {
        case "c":
          charVarMap.set(actionMatch.index, actionMatch[2]);
          break;
        case "d":
          delayMap.set(actionMatch.index, Number.parseInt(actionMatch[2]));
          break;
        case "s":
          soundMap.set(actionMatch.index, actionMatch[2]);
          break;
        case "f":
          fadeMap.set(actionMatch.index, Number.parseInt(actionMatch[2]));
          break;
      }
      text = text.slice(0, actionMatch.index) + text.slice(actionMatch.index + actionMatch[2].length + 4);
      actionMatch = actionPattern.exec(text);
    }

    if (text) {
      // Predetermine overflow line breaks to avoid words breaking while displaying
      const textWords = text.split(" ");
      let lastLineCount = 1;
      let newText = "";
      for (const textWord of textWords) {
        const nextWordText = newText ? `${newText} ${textWord}` : textWord;

        if (textWord.includes("\n")) {
          newText = nextWordText;
          lastLineCount++;
        } else {
          const lineCount = this.message.runWordWrap(nextWordText).split(/\n/g).length;
          if (lineCount > lastLineCount) {
            lastLineCount = lineCount;
            newText = `${newText}\n${textWord}`;
          } else {
            newText = nextWordText;
          }
        }
      }

      text = newText;
    }

    if (this.textTimer) {
      this.textTimer.remove();
      if (this.textCallbackTimer) {
        this.textCallbackTimer.callback();
      }
    }
    if (prompt) {
      const originalCallback = callback;
      callback = () => {
        const showPrompt = () => this.showPrompt(originalCallback, callbackDelay);
        if (promptDelay > 0) {
          globalScene.time.delayedCall(promptDelay, showPrompt);
        } else {
          showPrompt();
        }
      };
    }
    if (delay > 0) {
      this.clearText();
      if (prompt) {
        this.pendingPrompt = true;
      }
      this.textTimer = globalScene.time.addEvent({
        delay,
        callback: () => {
          const charIndex = text.length - this.textTimer!.repeatCount;
          const charVar = charVarMap.get(charIndex);
          const charSound = soundMap.get(charIndex);
          const charDelay = delayMap.get(charIndex);
          const charFade = fadeMap.get(charIndex);
          this.message.setText(text.slice(0, charIndex));
          const advance = () => {
            if (charVar) {
              globalScene.charSprite.setVariant(charVar);
            }
            if (charSound) {
              globalScene.audioManager.playSound(charSound);
            }
            if (callback && !this.textTimer?.repeatCount) {
              if (callbackDelay > 0 && !prompt) {
                this.textCallbackTimer = globalScene.time.delayedCall(callbackDelay, () => {
                  if (this.textCallbackTimer) {
                    this.textCallbackTimer.destroy();
                    this.textCallbackTimer = null;
                  }
                  callback();
                });
              } else {
                callback();
              }
            }
          };
          if (charDelay) {
            this.textTimer!.paused = true;
            globalScene.tweens.addCounter({
              duration: getFrameMs(charDelay),
              onComplete: () => {
                this.textTimer!.paused = false;
                advance();
              },
            });
          } else if (charFade) {
            this.textTimer!.paused = true;
            globalScene.time.delayedCall(150, () => {
              globalScene.ui.fadeOut(750).then(() => {
                const charFadeDelay = getFrameMs(charFade);
                globalScene.time.delayedCall(charFadeDelay, () => {
                  globalScene.ui.fadeIn(500).then(() => {
                    this.textTimer!.paused = false;
                    advance();
                  });
                });
              });
            });
          } else {
            advance();
          }
        },
        repeat: text.length,
      });
    } else {
      this.message.setText(text);
      if (prompt) {
        this.pendingPrompt = true;
      }
      if (callback) {
        callback();
      }
    }
  }

  private showPrompt(callback?: AnyFn | null, callbackDelay?: number | null) {
    const wrappedTextLines = this.message.runWordWrap(this.message.text).split(/\n/g);
    const textLinesCount = wrappedTextLines.length;
    const lastTextLine = wrappedTextLines[textLinesCount - 1];
    const lastLineTextObject = addTextObject(0, 0, lastTextLine, TextStyle.MESSAGE);
    const lastLineWidth = lastLineTextObject.displayWidth;
    lastLineTextObject.destroy();
    if (this.prompt) {
      this.prompt.setPosition(this.message.x + lastLineWidth + 2, this.message.y + (textLinesCount - 1) * 18 + 2);
      this.prompt.play("prompt");
    }
    this.pendingPrompt = false;
    this.awaitingActionInput = true;
    this.onActionInput = () => {
      if (this.prompt) {
        this.prompt.anims.stop();
        this.prompt.setVisible(false);
      }
      if (callback) {
        if (callbackDelay) {
          this.textCallbackTimer = globalScene.time.delayedCall(callbackDelay, () => {
            if (this.textCallbackTimer) {
              this.textCallbackTimer.destroy();
              this.textCallbackTimer = null;
            }
            callback();
          });
        } else {
          callback();
        }
      }
    };
  }

  /**
   * Checks if the text animation is currently in progress.
   *
   * @returns `true` if the text animation is active and the timer has remaining repetitions; otherwise, `false`.
   *
   * The method evaluates the state of the `textTimer` property to determine whether the text animation is still ongoing.
   * If `textTimer` is defined and its `repeatCount` is less than its `repeat` value, the animation is considered in progress.
   * Otherwise, it returns `false`.
   */
  public isTextAnimationInProgress(): boolean {
    if (this.textTimer) {
      return this.textTimer.repeatCount < this.textTimer.repeat;
    }

    return false;
  }

  /**
   * Clears the currently displayed text from the UI.
   *
   * This method sets the message text to an empty string and resets the `pendingPrompt` state.
   * It ensures that the text is only cleared if the `ready` state is `true` and the `message` object is active.
   */
  public clearText(): void {
    if (this.ready && this.message?.active) {
      this.message.setText("");
    }

    this.textTimer?.remove();
    this.textTimer = null;
    this.textCallbackTimer?.remove();
    this.textCallbackTimer = null;

    this.pendingPrompt = false;
  }
}
