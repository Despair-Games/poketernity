import { globalScene } from "#app/global-scene";
import { type NonNullTrainerSlot, TrainerSlot } from "#enums/trainer-slot";
import type { TrainerSlotMap } from "#trainers/trainer-config";
import type { TrainerData, TrainerDataSet } from "#trainers/trainer-data";
import { playTween } from "#utils/anim-utils";

interface InitSpriteOptions {
  hasShadow?: boolean;
  visible?: boolean;
}

interface TintOptions {
  color?: number;
  alpha?: number;
  duration?: number;
  ease?: string;
}

interface UntintOptions {
  duration?: number;
  ease?: string;
}

const TRAINER_SPRITE_DOUBLE_BATTLE_X_POSITIONS: TrainerSlotMap<number> = {
  [TrainerSlot.TRAINER]: -4,
  [TrainerSlot.TRAINER_PARTNER]: 28,
};

class TrainerSprite extends Phaser.GameObjects.Container {
  constructor(spriteKey: string) {
    super(globalScene, -72, 80);
    this.type = "TrainerSprite";

    // Main sprite
    this.initSprite(spriteKey, { hasShadow: true });
    // Tint sprite
    this.initSprite(spriteKey, { visible: false });
  }

  /**
   * Initializes a Sprite and adds it to this container
   * @param spriteKey - The texture of the added sprite
   * @param hasShadow - (Default `false`) If `true`, adds a shadow to the sprite
   * @param visible - (Default `true`) Whether to show the sprite after adding it
   * @returns The added {@linkcode Phaser.GameObjects.Sprite | Sprite}
   */
  private initSprite(
    spriteKey: string,
    { hasShadow = false, visible = true }: InitSpriteOptions = {},
  ): Phaser.GameObjects.Sprite {
    const sprite = globalScene
      .addFieldSprite(0, 0, spriteKey)
      .setOrigin(0.5, 1)
      .setPipeline(globalScene.spritePipeline, {
        tone: [0.0, 0.0, 0.0, 0.0],
        hasShadow,
      })
      .setVisible(visible);

    this.add(sprite);

    return sprite;
  }

  /** @returns The Trainer's sprite list (i.e. `[sprite, tintSprite]`) */
  public get sprites(): Phaser.GameObjects.Sprite[] {
    return this.list.filter((gameObj) => gameObj instanceof Phaser.GameObjects.Sprite);
  }

  public get sprite(): Phaser.GameObjects.Sprite {
    return this.sprites[0];
  }

  public get tintSprite(): Phaser.GameObjects.Sprite {
    return this.sprites[1];
  }

  /**
   * Applies a "tint fill" to the main sprite by layering the filled tint sprite
   * over it.
   * @param color - (Default `0xffffff` (white)) The color of the tint sprite
   * @param alpha - (Default 1) The final opacity of the tint sprite
   * @param duration - (Default 0) The time (ms) to apply the tint. If set to 0,
   * the tint is applied instantly.
   * @param ease - (Default "Linear") The easing function for interpolation
   * @async
   */
  public async tint({ color = 0xffffff, alpha = 1, duration = 0, ease = "Linear" }: TintOptions = {}): Promise<void> {
    const [, tintSprite] = this.sprites;

    tintSprite.setTintFill(color);
    tintSprite.setVisible(true);
    if (duration > 0) {
      tintSprite.setAlpha(0);

      await playTween({
        targets: tintSprite,
        alpha,
        duration,
        ease,
      });
    } else {
      tintSprite.setAlpha(alpha);
    }
  }

  /**
   * If visible, hides the tint sprite.
   * @param duration - (Default 0) The time (ms) to fade out the tint. If set to 0,
   * the tint is hidden instantly.
   * @param ease - (Default "Linear") The easing function for interpolation
   * @async
   */
  public async untint({ duration = 0, ease = "Linear" }: UntintOptions = {}): Promise<void> {
    const [, tintSprite] = this.sprites;
    if (!tintSprite.visible) {
      tintSprite.clearTint();
      return;
    }

    if (duration > 0) {
      await playTween({
        targets: tintSprite,
        alpha: 0,
        duration,
        ease,
      });
    }

    tintSprite.setVisible(false);
    tintSprite.setAlpha(1);
    tintSprite.clearTint();
  }

  public playAnim(): void {
    this.sprites.forEach((sprite) => this.tryPlaySprite(sprite));
  }

  /**
   * Plays an individual sprite's animation (if it has one).
   * @param sprite - The {@linkcode Phaser.GameObjects.Sprite | Sprite} to animate
   * @returns `true` if the sprite animated correctly
   */
  private tryPlaySprite(sprite: Phaser.GameObjects.Sprite): boolean {
    const animConfig = {
      key: sprite.texture.key,
      repeat: 0,
      startFrame: 0,
    };

    // Show an error in the console if there isn't a texture loaded
    if (sprite.texture.key === "__MISSING") {
      console.error(`No texture found for '${animConfig.key}'!`);

      return false;
    }

    // Don't try to play an animation when there isn't one
    if (sprite.texture.frameTotal <= 1) {
      console.warn(`No animation found for '${animConfig.key}'. Is this intentional?`);

      return false;
    }

    sprite.play(animConfig);
    return true;
  }
}

/**
 * A container for one or more {@linkcode TrainerSprite}s to be displayed during a battle.
 * @see {@linkcode TrainerSpriteSet.create}
 */
export class TrainerSpriteSet extends Phaser.GameObjects.Container {
  public trainerSprites: Partial<TrainerSlotMap<TrainerSprite>>;

  /**
   * Loads all assets for a {@linkcode TrainerSpriteSet}, then creates it.
   * @param source - The {@linkcode TrainerDataSet} used to create the sprite set.
   * @returns The created {@linkcode TrainerSpriteSet}.
   * @async
   */
  public static async create(source: TrainerDataSet): Promise<TrainerSpriteSet> {
    await Promise.all(Object.values(source.trainers).map(({ spriteKey }) => loadTrainerSpriteAssets(spriteKey)));

    return new TrainerSpriteSet(source);
  }

  private constructor(source: TrainerDataSet) {
    super(globalScene, -72, 80);
    this.type = "TrainerSpriteSet";

    this.trainerSprites = Object.fromEntries(
      Object.entries(source.trainers).map(([key, td]) => [key, new TrainerSprite(td.spriteKey)]),
    );

    const entries = Object.entries(this.trainerSprites);
    for (const [key, trainerSprite] of entries) {
      this.add(trainerSprite);

      if (entries.length === 2) {
        const trainerSlot = Number(key) as NonNullTrainerSlot;
        trainerSprite.x += TRAINER_SPRITE_DOUBLE_BATTLE_X_POSITIONS[trainerSlot];
      }
    }
  }

  public async show(trainerSlot: TrainerSlot = TrainerSlot.NONE): Promise<void> {
    this.setAlpha(0);
    this.setVisible(true);

    for (const [slot, trainerSprite] of Object.entries(this.trainerSprites)) {
      await trainerSprite.untint();
      trainerSprite.setVisible(trainerSlot === TrainerSlot.NONE || trainerSlot === Number(slot));
    }

    await playTween({
      targets: this,
      x: "-=16",
      y: "+=16",
      alpha: 1,
      ease: "Sine.easeInOut",
      duration: 750,
    });
  }

  public async hide(): Promise<void> {
    await playTween({
      targets: this,
      x: "+=16",
      y: "-=16",
      alpha: 0,
      ease: "Sine.easeInOut",
      duration: 750,
    });

    this.setVisible(false);
  }

  /**
   * Tints the {@linkcode TrainerSprite} for the Trainer at the given slot.
   * @param trainerSlot - The {@linkcode TrainerSlot} of the Trainer sprite to tint
   * @param options - (Optional) The {@link TintOptions | properties} of the tinting effect
   * @async
   * @see {@linkcode TrainerSprite.tint}
   */
  public async tint(trainerSlot: NonNullTrainerSlot, options: TintOptions = {}): Promise<void> {
    const sprite = this.trainerSprites[trainerSlot];

    if (sprite == null) {
      console.warn(`tint: Trainer slot ${trainerSlot} does not have a defined Trainer!`);
      return;
    }

    await sprite.tint(options);
  }

  /**
   * Tints all {@linkcode TrainerSprite}s in this set simultaneously.
   * @param options - (Optional) The {@link TintOptions | properties} of the tinting effect
   * @async
   * @see {@linkcode TrainerSprite.tint}
   */
  public async tintAll(options: TintOptions = {}): Promise<void> {
    await Promise.all(Object.values(this.trainerSprites).map((ts) => ts.tint(options)));
  }

  /**
   * Untints the {@linkcode TrainerSprite} for the Trainer at the given slot.
   * @param trainerSlot - The {@linkcode TrainerSlot} of the Trainer sprite to untint
   * @param options - (Optional) The {@link UntintOptions | properties} of the untinting effect
   * @async
   * @see {@linkcode TrainerSprite.untint}
   */
  public async untint(trainerSlot: NonNullTrainerSlot, options: UntintOptions = {}) {
    const sprite = this.trainerSprites[trainerSlot];

    if (sprite == null) {
      return;
    }

    await sprite.untint(options);
  }

  /**
   * Untints all {@linkcode TrainerSprite}s in this set simultaneously.
   * @param options - (Optional) The {@link UntintOptions | properties} of the untinting effect
   * @async
   * @see {@linkcode TrainerSprite.untint}
   */
  public async untintAll(options: UntintOptions = {}): Promise<void> {
    await Promise.all(Object.values(this.trainerSprites).map((ts) => ts.untint(options)));
  }

  public playAnim(trainerSlots?: NonNullTrainerSlot[]): void {
    const spritesToPlay = trainerSlots?.map((slot) => this.trainerSprites[slot]) ?? Object.values(this.trainerSprites);

    spritesToPlay.forEach((trainerSprite) => trainerSprite?.playAnim());
  }
}

/**
 * Loads a `TrainerSprite`'s asset(s) onto {@linkcode globalScene} from a given key.
 * @param spriteKey - The key for this sprite's assets. This should be derived
 * from a {@linkcode TrainerData} instance.
 * @async
 */
export async function loadTrainerSpriteAssets(spriteKey: string): Promise<void> {
  await new Promise<void>((resolve) => {
    globalScene.loadAtlas(spriteKey);
    globalScene.load.once(Phaser.Loader.Events.COMPLETE, () => {
      const originalWarn = console.warn;
      // Ignore warnings for missing frames, because there will be a lot
      console.warn = () => {};
      const frameNames = globalScene.anims.generateFrameNames(spriteKey, {
        zeroPad: 4,
        suffix: ".png",
        start: 1,
        end: 128,
      });
      console.warn = originalWarn;
      if (!globalScene.anims.exists(spriteKey)) {
        globalScene.anims.create({
          key: spriteKey,
          frames: frameNames,
          frameRate: 24,
          repeat: -1,
        });
      }
      resolve();
    });

    if (!globalScene.load.isLoading()) {
      globalScene.load.start();
    }
  });
}
