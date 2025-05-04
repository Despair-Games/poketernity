import { globalScene } from "#app/global-scene";
import { coerceArray, fixedNumber } from "#app/utils/common-utils";
import { PokemonIconAnimMode } from "#enums/pokemon-icon-anim-mode";

type PokemonIcon = Phaser.GameObjects.Container | Phaser.GameObjects.Sprite;

/**
 * Helper class that handles up and down / jumping animation of Pokemon icons.
 */
export class PokemonIconAnimHelper {
  private icons: Map<PokemonIcon, PokemonIconAnimMode>;
  private toggled: boolean;
  private counterTween: Phaser.Tweens.Tween | undefined;

  constructor() {
    this.icons = new Map();
    this.toggled = false;
  }

  /**
   * Start the loop updating the animation for the tracked icons.
   * When no longer needed {@linkcode destroy} should be called to stop the loop.
   */
  public setup(): void {
    if (this.counterTween) {
      return;
    }

    const onAlternate = (tween: Phaser.Tweens.Tween) => {
      const value = tween.getValue();
      this.toggled = !!value;
      for (const i of this.icons.keys()) {
        const icon = this.icons.get(i);
        const delta = icon ? this.getModeYDelta(icon) : 0;
        i.y += delta * (this.toggled ? 1 : -1);
      }
    };
    this.counterTween = globalScene.tweens.addCounter({
      duration: fixedNumber(200),
      from: 0,
      to: 1,
      yoyo: true,
      repeat: -1,
      onRepeat: onAlternate,
      onYoyo: onAlternate,
    });
  }

  private getModeYDelta(mode: PokemonIconAnimMode): number {
    switch (mode) {
      case PokemonIconAnimMode.NONE:
        return 0;
      case PokemonIconAnimMode.PASSIVE:
        return -1;
      case PokemonIconAnimMode.ACTIVE:
        return -2;
    }
  }

  /**
   * Add one or more Pokemon icons to the list of icons to animate, synchronizing them with
   * the current animation state of the existing icons.
   * If the icon(s) were already added but used a different animation mode, switches their mode
   * and updates their position accordingly.
   *
   * @param icons - A single or array of {@linkcode PokemonIcon} ({@linkcode Sprite} or {@linkcode Container})
   * @param mode - The {@linkcode PokemonIconAnimMode} to use for the icon(s).
   */
  public addOrUpdate(icons: PokemonIcon | PokemonIcon[], mode: PokemonIconAnimMode): void {
    icons = coerceArray(icons);
    for (const i of icons) {
      if (this.icons.has(i) && this.icons.get(i) === mode) {
        continue;
      }
      if (this.toggled) {
        const lastYDelta = this.icons.has(i) ? this.icons.get(i)! : 0;
        const yDelta = this.getModeYDelta(mode);
        i.y += yDelta + lastYDelta;
      }
      this.icons.set(i, mode);
    }
  }

  /**
   * Removes one or more icons from the handler. Resets their position to the default.
   *
   * @param icons - The {@linkcode PokemonIcon}(s) to remove.
   */
  public remove(icons: PokemonIcon | PokemonIcon[]): void {
    icons = coerceArray(icons);
    for (const i of icons) {
      if (this.toggled) {
        const icon = this.icons.get(i);
        const delta = icon ? this.getModeYDelta(icon) : 0;
        i.y -= delta;
      }
      this.icons.delete(i);
    }
  }

  /**
   * Removes all icons being animated by the handler. Resets their position to the default.
   */
  public removeAll(): void {
    for (const i of this.icons.keys()) {
      if (this.toggled) {
        const icon = this.icons.get(i);
        const delta = icon ? this.getModeYDelta(icon) : 0;
        i.y -= delta;
      }
      this.icons.delete(i);
    }
  }

  /**
   * Prepares this element for garbage collection.
   * Removes references to all tracked icons and stops the animation loop.
   */
  public destroy(): void {
    this.removeAll();
    if (this.counterTween) {
      this.counterTween.destroy();
      this.counterTween = undefined;
    }
  }
}
