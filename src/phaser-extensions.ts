//#region Extensions

Phaser.GameObjects.Container.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Container>;
Phaser.GameObjects.Sprite.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Sprite>;
Phaser.GameObjects.Image.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Image>;
Phaser.GameObjects.NineSlice.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.NineSlice>;
Phaser.GameObjects.Text.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Text>;
Phaser.GameObjects.Rectangle.prototype.setPositionRelative = setPositionRelative<Phaser.GameObjects.Rectangle>;

//#endregion
//#region Utility Functions

/**
 * Positions this object relative to the {@linkcode guideObject}.
 * @param guideObject - The object to base the position off of
 * @param x - The relative x position
 * @param y - The relative y position
 * @returns The positioned instance of {@linkcode T}
 */
function setPositionRelative<T extends Phaser.GameObjects.GameObject>(
  guideObject: Phaser.GameObjects.GameObject,
  x: number,
  y: number,
): T {
  const offsetX = guideObject.width * (-0.5 + (0.5 - guideObject.originX));
  const offsetY = guideObject.height * (-0.5 + (0.5 - guideObject.originY));
  this.setPosition(guideObject.x + offsetX + x, guideObject.y + offsetY + y);

  return this;
}

//#endregion

export default {};
