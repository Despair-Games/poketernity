export class GameSprite extends Phaser.GameObjects.Sprite {
  public override play(
    key: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig,
    ignoreIfPlaying?: boolean,
  ): this {
    try {
      return super.play(key, ignoreIfPlaying);
    } catch (err: unknown) {
      console.error(`Failed to play animation for ${key}`, err);
      return this;
    }
  }
}
