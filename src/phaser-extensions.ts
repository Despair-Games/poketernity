import Phaser from "phaser";

// #region Types

// biome-ignore format: The formatter is bugged here
type GuideObject = Phaser.GameObjects.Components.Origin
  & Phaser.GameObjects.Components.Size
  & Phaser.GameObjects.Components.Transform;

// #endregion
// #region Original Functions

const originalPlay = Phaser.GameObjects.Sprite.prototype.play;
const originalStop = Phaser.GameObjects.Sprite.prototype.stop;

// #endregion
// #region Extensions

Phaser.GameObjects.Container.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Container>;
Phaser.GameObjects.Sprite.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Sprite>;
Phaser.GameObjects.Image.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Image>;
Phaser.GameObjects.NineSlice.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.NineSlice>;
Phaser.GameObjects.Text.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Text>;
Phaser.GameObjects.Rectangle.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Rectangle>;

Phaser.GameObjects.Container.prototype.getByType = getByType;

Phaser.GameObjects.Sprite.prototype.play = play;
Phaser.GameObjects.Sprite.prototype.stop = stop;

// #endregion
// #region Utility Functions

/**
 * Positions this object relative to the {@linkcode guideObject}.
 * @param guideObject - The {@linkcode GuideObject} to base the position off of.
 * @param x - The relative x position
 * @param y - The relative y position
 * @returns The positioned instance of {@linkcode T}
 */
function setPositionRelative<T extends Phaser.GameObjects.Components.Transform>(
  this: T,
  guideObject: GuideObject,
  x: number,
  y: number,
): T {
  const offsetX = guideObject.width * (-0.5 + (0.5 - guideObject.originX));
  const offsetY = guideObject.height * (-0.5 + (0.5 - guideObject.originY));
  this.setPosition(guideObject.x + offsetX + x, guideObject.y + offsetY + y);

  return this;
}

/**
 * Searches for the first instance of a child with its `type` property matching the given argument.
 * Should more than one child have the same type only the first is returned.
 * @param type - The type to search for
 * @returns The first instance with the given type, or `null`
 */
function getByType<T extends Phaser.GameObjects.GameObject>(
  this: Phaser.GameObjects.Container,
  type: string,
): T | null {
  return (Phaser.Utils.Array.GetFirst(this.list, "type", type) as T) ?? null;
}

function play<T extends Phaser.GameObjects.Sprite>(
  this: T,
  key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig,
  ignoreIfPlaying?: boolean,
): Phaser.GameObjects.Sprite {
  try {
    return originalPlay.apply(this, [key, ignoreIfPlaying]);
  } catch (err: unknown) {
    console.error(`Failed to play animation for ${key}!`, err);
    return this;
  }
}

function stop<T extends Phaser.GameObjects.Sprite>(this: T): Phaser.GameObjects.Sprite {
  try {
    return originalStop.apply(this);
  } catch (err: unknown) {
    console.error("Failed to stop animation!", err);
    return this;
  }
}

// #endregion
