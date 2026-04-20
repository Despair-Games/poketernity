import { globalScene } from "#app/global-scene";
import { GAME_HEIGHT, GAME_WIDTH } from "#constants/ui-constants";
import { TextStyle } from "#enums/text-style";
import { addTextObject } from "#ui/text-utils";

/**
 * Semi-transparent overlay that appears during multiplayer sync waits.
 * Shown when waiting for the partner's decision (modifier, biome, ME)
 * or during turn sync. Sits on top of all UI without disrupting it.
 */

let overlay: Phaser.GameObjects.Container | null = null;
let backdrop: Phaser.GameObjects.Rectangle | null = null;
let label: Phaser.GameObjects.Text | null = null;
let dotTween: Phaser.Tweens.Tween | null = null;
let dotCount = 0;
let baseText = "Waiting for partner";

function ensureOverlay(): void {
  if (overlay) {
    return;
  }

  const scene = globalScene;

  overlay = scene.add.container(0, 0);
  overlay.setName("mp-waiting-overlay");
  overlay.setDepth(1000);
  overlay.setVisible(false);

  // Semi-transparent dark backdrop covering the full screen
  backdrop = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.45);
  backdrop.setOrigin(0.5, 0.5);
  overlay.add(backdrop);

  // Centered text label
  label = addTextObject(GAME_WIDTH / 2, GAME_HEIGHT / 2, "", TextStyle.WINDOW, { align: "center" });
  label.setOrigin(0.5, 0.5);
  overlay.add(label);
}

function animateDots(): void {
  if (dotTween) {
    dotTween.destroy();
  }

  dotCount = 0;
  updateDotText();

  dotTween = globalScene.tweens.addCounter({
    from: 0,
    to: 3,
    duration: 1500,
    repeat: -1,
    onUpdate: (tween) => {
      const val = tween.getValue();
      if (val == null) {
        return;
      }
      const newCount = Math.floor(val) + 1;
      if (newCount !== dotCount) {
        dotCount = newCount;
        updateDotText();
      }
    },
    onRepeat: () => {
      dotCount = 0;
      updateDotText();
    },
  });
}

function updateDotText(): void {
  if (label) {
    label.setText(`${baseText}${".".repeat(dotCount)}`);
  }
}

/**
 * Show the waiting overlay with an animated "Waiting for partner..." message.
 * @param message - Optional custom message (defaults to "Waiting for partner")
 */
export function showWaitingOverlay(message?: string): void {
  ensureOverlay();
  baseText = message ?? "Waiting for partner";
  overlay!.setVisible(true);
  animateDots();
}

/**
 * Hide the waiting overlay.
 */
export function hideWaitingOverlay(): void {
  if (!overlay) {
    return;
  }
  overlay.setVisible(false);
  if (dotTween) {
    dotTween.destroy();
    dotTween = null;
  }
}

/**
 * Destroy the overlay entirely (call on scene teardown / reset).
 */
export function destroyWaitingOverlay(): void {
  hideWaitingOverlay();
  if (overlay) {
    overlay.destroy();
    overlay = null;
    backdrop = null;
    label = null;
  }
}
