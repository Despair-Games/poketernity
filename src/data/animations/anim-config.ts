/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Pokemon } from "#field/pokemon";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { BattleAnim } from "#animations/battle-anims";
import type { easeFunctions } from "#animations/ease-functions";
import type { MoveAnim } from "#animations/move-anim";
import { globalScene } from "#app/global-scene";
import { AnimBlendType } from "#enums/anim-blend-type";
import { AnimFocus } from "#enums/anim-focus";
import { AnimFrameTarget } from "#enums/anim-frame-target";
import type { AnimTimedEventType } from "#enums/anim-timed-event-type";
import type { MoveId } from "#enums/move-id";
import { getFrameMs } from "#utils/common-utils";
import type Phaser from "phaser";

export interface AnimConfig {
  /**
   * If this is for a {@linkcode MoveAnim}, this specifies the {@linkcode MoveId}
   * associated with the animation.
   *
   * This is required for all {@linkcode MoveAnim | MoveAnims}.
   */
  readonly moveId?: MoveId;

  /** The file name for VFX assets used in this animation */
  readonly graphic?: string;

  /**
   * Contains all {@linkcode AnimProp | properties} applied to the sprite
   * of the "source" object (e.g. the {@linkcode Pokemon} using the move)
   */
  readonly sourceProperties?: AnimProp;

  /**
   * Contains all {@linkcode AnimProp | properties} applied to the sprite
   * of the "target" object (e.g. the {@linkcode Pokemon} targeted by a move)
   */
  readonly targetProperties?: AnimProp;

  /**
   * Contains all {@linkcode AnimProp | properties} applied to the
   * animation's VFX element
   */
  readonly vfxProperties?: AnimProp;

  /**
   * Contains all {@linkcode AnimTimedEvent | timed events} played
   * during the animation
   */
  readonly timedEvents?: AnimTimedEvent[];
}

export interface AnimProp {
  /**
   * For battle animations, the origin point for keyframes is defined
   * along the line connecting the start point ("source") and end point ("target").
   *
   * The `u`-value is the fraction of the distance between the start and end point
   * the origin point is away from the source.
   *
   * If `u = 0`, then the origin point is the source; if `u = 1`, then the origin point is the target.
   */
  readonly u: AnimKeyFrame<number>[];

  /** The horizontal coordinate relative to the keyframe's origin point. */
  readonly x: AnimKeyFrame<number>[];

  /**
   * The vertical coordinate relative to the keyframe's origin point.
   * An increase in `y` will move the sprite downward.
   */
  readonly y: AnimKeyFrame<number>[];

  /** Horizontal scale factor (%) */
  readonly scaleX?: AnimKeyFrame<number>[];

  /** Vertical scale factor (%) */
  readonly scaleY?: AnimKeyFrame<number>[];

  /** The alpha value for the sprite, in the range `[0, 255]` */
  readonly alpha?: AnimKeyFrame<number>[];

  /**
   * The rotation angle of the sprite in degrees.
   *
   * Phaser uses a right-hand clockwise rotation system, where `0` is right,
   * `90` is down, and `-90` is up.
   *
   * The value of this should be in the interval `[-180, 180]`.
   */
  readonly angle?: AnimKeyFrame<number>[];

  /** When `true`, the sprite is flipped horizontally */
  readonly mirror?: AnimKeyFrame<boolean>[];

  /** When `false`, the sprite is hidden */
  readonly visible?: AnimKeyFrame<boolean>[];

  /**
   * The blend mode to specify how the sprite is rendered on the canvas
   * @see {@link https://docs.phaser.io/api-documentation/constant/blendmodes}
   */
  readonly blendType?: AnimKeyFrame<AnimBlendType>[];

  /**
   * If this keyframe is for a graphic, specifies the tile index used for the graphic during the tween.
   *
   * This is only relevant for VFX properties.
   */
  readonly graphicFrame?: AnimKeyFrame<number>[];

  /** A tone to pipeline over the animated sprite (normalized RGBA, A is optional) */
  readonly tone?: AnimKeyFrame<number[]>[];

  /**
   * The z-depth of the animated sprite during the tween
   * - `0` is behind all other sprites (except BG)
   * - `1` is on top of player field
   * - `3` is on top of both fields
   * - `5` is on top of player sprite
   * @todo define the allowed priority values as an enum
   */
  readonly priority?: AnimKeyFrame<0 | 1 | 3 | 5>[];
}

export interface AnimKeyFrame<ValueType> {
  /** The end value for the keyframe */
  readonly value: ValueType;
  /**
   * The duration (in frames) of the tween played for this keyframe.
   * This is ignored if the keyframe's `ValueType` is `boolean`.
   */
  readonly duration?: number;
  /**
   * The time (in frames) between the start of this keyframe and the
   * end of the last keyframe (or t=0)
   */
  readonly delay?: number;
  /**
   * The easing function used to interpolate intermediate values.
   * This is ignored if the keyframe's `ValueType` is `boolean`.
   */
  readonly ease?: (typeof easeFunctions)[number];
}

export interface AnimTimedEvent {
  /**
   * The type of timed event. Currently supported events include:
   * - "AnimTimedSoundEvent": for SFX
   * - "AnimTimedAddBgEvent": for initializing a background image
   * - "AnimTimedUpdateBgEvent": for updating the background image
   */
  readonly eventType: AnimTimedEventType;

  /** The delay from the start of the animation to the given event (in frames) */
  readonly time: number;

  /** The name of the file containing assets used in the event */
  readonly resourceName: string;

  // Timed Sound Event fields

  /**
   * The volume of the played sound effect (%).
   * @defaultValue `100`
   */
  readonly volume?: number;

  /**
   * The pitch of the played sound effect (%).
   * @defaultValue `100`
   */
  readonly pitch?: number;

  // Background Image Event fields

  /** The x-coordinate of the background image */
  readonly bgX?: number;

  /** The y-coordinate of the background image */
  readonly bgY?: number;

  /** The amount of time the image is displayed (in frames) */
  readonly duration?: number;

  /**
   * Scale factor (%) for the background image.
   * @defaultValue `100`
   */
  readonly scale?: number;
}

/** @deprecated to be replaced by {@linkcode AnimConfig} */
export class LegacyAnimConfig {
  public id: number;
  public graphic: string;
  public frames: AnimFrame[][];
  public frameTimedEvents: Map<number, LegacyAnimTimedEvent[]>;
  public position: number;
  public hue: number;

  constructor(source?: any) {
    this.frameTimedEvents = new Map<number, LegacyAnimTimedEvent[]>();

    if (source) {
      this.id = source.id;
      this.graphic = source.graphic;
      const frames: any[][] = source.frames;
      frames.map((animFrames) => {
        for (let f = 0; f < animFrames.length; f++) {
          animFrames[f] = new ImportedAnimFrame(animFrames[f]);
        }
      });
      this.frames = frames;

      const frameTimedEvents = source.frameTimedEvents;
      for (const fte of Object.keys(frameTimedEvents)) {
        const timedEvents: LegacyAnimTimedEvent[] = [];
        for (const te of frameTimedEvents[fte]) {
          let timedEvent: LegacyAnimTimedEvent | undefined;
          switch (te.eventType) {
            case "AnimTimedSoundEvent":
              timedEvent = new AnimTimedSoundEvent(te.frameIndex, te.resourceName, te);
              break;
            case "AnimTimedAddBgEvent":
              timedEvent = new AnimTimedAddBgEvent(te.frameIndex, te.resourceName, te);
              break;
            case "AnimTimedUpdateBgEvent":
              timedEvent = new AnimTimedUpdateBgEvent(te.frameIndex, te.resourceName, te);
              break;
          }

          timedEvent && timedEvents.push(timedEvent);
        }
        this.frameTimedEvents.set(Number.parseInt(fte), timedEvents);
      }

      this.position = source.position;
      this.hue = source.hue;
    } else {
      this.frames = [];
    }
  }

  getSoundResourceNames(): string[] {
    const sounds = new Set<string>();

    for (const ftes of this.frameTimedEvents.values()) {
      for (const fte of ftes) {
        if (fte instanceof AnimTimedSoundEvent && fte.resourceName) {
          sounds.add(fte.resourceName);
        }
      }
    }

    return Array.from(sounds.values());
  }

  getBackgroundResourceNames(): string[] {
    const backgrounds = new Set<string>();

    for (const ftes of this.frameTimedEvents.values()) {
      for (const fte of ftes) {
        if (fte instanceof AnimTimedAddBgEvent && fte.resourceName) {
          backgrounds.add(fte.resourceName);
        }
      }
    }

    return Array.from(backgrounds.values());
  }
}

/**
 * Contains data for a single frame of an asset in a battle animation
 * @see {@linkcode BattleAnim}
 */
export class AnimFrame {
  /**
   * The *x*-position of the sprite, relative
   * to the frame's {@linkcode AnimFocus | focal point}.
   * The sprite will move to the right as *x* increases.
   */
  public x: number;
  /**
   * The *y*-position of the sprite, relative
   * to the frame's {@linkcode AnimFocus | focal point}.
   * The sprite will move downward as *y* increases.
   */
  public y: number;
  /** Horizontal scale factor (%) */
  public zoomX: number;
  /** Vertical scale factor (%) */
  public zoomY: number;
  /** Rotation angle (degrees, right-hand clockwise) */
  public angle: number;
  /** If `true`, inverts the sprite horizontally */
  public mirror: boolean;
  /** Whether or not the sprite is visible */
  public visible: boolean;
  /**
   * The blend mode to specify how the sprite is rendered on the canvas
   * @see {@link https://docs.phaser.io/api-documentation/constant/blendmodes}
   */
  public blendType: AnimBlendType;
  /**
   * The type of sprite affected by this frame
   * @see {@linkcode AnimFrameTarget}
   */
  public target: AnimFrameTarget;
  /** If {@linkcode target} is "graphic", specifies the sprite index for the frame */
  public graphicFrame: number;
  /** The alpha value for the animated sprite */
  public opacity: number;
  /** @deprecated */
  public color: number[];
  /** The animated sprite's tone (RGBA) */
  public tone: number[];
  /** @deprecated */
  public flash: number[];
  /**
   * If the item (or "graphic") list for a frame is smaller than previous frames,
   * graphics are automatically destroyed in reverse item order.
   * This, if `true`, prevents the associated graphic from being destroyed by
   * that process in future frames.
   */
  public locked: boolean;
  /**
   * The depth or z-position of the animated sprite
   * - 0 is behind all other sprites (except BG)
   * - 1 is on top of player field
   * - 3 is on top of both fields
   * - 5 is on top of player sprite
   */
  public priority: number;
  /**
   * The {@linkcode AnimFocus} specifying the point of origin for
   * this animation's x- and y-position.
   */
  public focus: AnimFocus;

  constructor(
    x: number,
    y: number,
    zoomX: number,
    zoomY: number,
    angle: number,
    mirror: boolean,
    visible: boolean,
    blendType: AnimBlendType,
    pattern: number,
    opacity: number,
    colorR: number,
    colorG: number,
    colorB: number,
    colorA: number,
    toneR: number,
    toneG: number,
    toneB: number,
    toneA: number,
    flashR: number,
    flashG: number,
    flashB: number,
    flashA: number,
    locked: boolean,
    priority: number,
    focus: AnimFocus,
    init?: boolean,
  ) {
    this.x = init ? x : ((x || 0) - 128) * 0.5;
    this.y = init ? y : ((y || 0) - 224) * 0.5;
    if (zoomX) {
      this.zoomX = zoomX;
    } else if (init) {
      this.zoomX = 0;
    }
    if (zoomY) {
      this.zoomY = zoomY;
    } else if (init) {
      this.zoomY = 0;
    }
    if (angle) {
      this.angle = angle;
    } else if (init) {
      this.angle = 0;
    }
    if (mirror) {
      this.mirror = mirror;
    } else if (init) {
      this.mirror = false;
    }
    if (visible) {
      this.visible = visible;
    } else if (init) {
      this.visible = false;
    }
    if (blendType) {
      this.blendType = blendType;
    } else if (init) {
      this.blendType = AnimBlendType.NORMAL;
    }
    if (!init) {
      let target: AnimFrameTarget = AnimFrameTarget.IMAGE;
      switch (pattern) {
        case -2:
          target = AnimFrameTarget.TARGET;
          break;
        case -1:
          target = AnimFrameTarget.SOURCE;
          break;
      }
      this.target = target;
      this.graphicFrame = pattern >= 0 ? pattern : 0;
    }
    if (opacity) {
      this.opacity = opacity;
    } else if (init) {
      this.opacity = 0;
    }
    if (colorR || colorG || colorB || colorA) {
      this.color = [colorR || 0, colorG || 0, colorB || 0, colorA || 0];
    } else if (init) {
      this.color = [0, 0, 0, 0];
    }
    if (toneR || toneG || toneB || toneA) {
      this.tone = [toneR || 0, toneG || 0, toneB || 0, toneA || 0];
    } else if (init) {
      this.tone = [0, 0, 0, 0];
    }
    if (flashR || flashG || flashB || flashA) {
      this.flash = [flashR || 0, flashG || 0, flashB || 0, flashA || 0];
    } else if (init) {
      this.flash = [0, 0, 0, 0];
    }
    if (locked) {
      this.locked = locked;
    } else if (init) {
      this.locked = false;
    }
    if (priority) {
      this.priority = priority;
    } else if (init) {
      this.priority = 0;
    }
    this.focus = focus || AnimFocus.TARGET;
  }
}
class ImportedAnimFrame extends AnimFrame {
  constructor(source: any) {
    const color: number[] = source.color || [0, 0, 0, 0];
    const tone: number[] = source.tone || [0, 0, 0, 0];
    const flash: number[] = source.flash || [0, 0, 0, 0];
    super(
      source.x,
      source.y,
      source.zoomX,
      source.zoomY,
      source.angle,
      source.mirror,
      source.visible,
      source.blendType,
      source.graphicFrame,
      source.opacity,
      color[0],
      color[1],
      color[2],
      color[3],
      tone[0],
      tone[1],
      tone[2],
      tone[3],
      flash[0],
      flash[1],
      flash[2],
      flash[3],
      source.locked,
      source.priority,
      source.focus,
      true,
    );
    this.target = source.target;
    this.graphicFrame = source.graphicFrame;
  }
}

/** @deprecated to be replaced by {@linkcode AnimTimedEvent} */
export abstract class LegacyAnimTimedEvent {
  public frameIndex: number;
  public resourceName: string;

  constructor(frameIndex: number, resourceName: string) {
    this.frameIndex = frameIndex;
    this.resourceName = resourceName;
  }

  abstract execute(battleAnim: BattleAnim, priority?: number): number;

  abstract getEventType(): string;
}

export class AnimTimedSoundEvent extends LegacyAnimTimedEvent {
  public volume: number = 100;
  public pitch: number = 100;

  constructor(frameIndex: number, resourceName: string, source?: any) {
    super(frameIndex, resourceName);

    if (source) {
      this.volume = source.volume;
      this.pitch = source.pitch;
    }
  }

  execute(battleAnim: BattleAnim, _priority?: number): number | never {
    const soundConfig = { rate: this.pitch * 0.01, volume: this.volume * 0.01 };
    if (this.resourceName) {
      try {
        globalScene.audioManager.playSound(`battle_anims/${this.resourceName}`, soundConfig);
      } catch (err) {
        console.error(err);
      }
      return Math.ceil((globalScene.sound.get(`battle_anims/${this.resourceName}`).totalDuration * 1000) / 33.33);
    }
    if (battleAnim.user) {
      return Math.ceil((battleAnim.user.cry(soundConfig).totalDuration * 1000) / 33.33);
    }
    throw new Error("battleAnim.user is null!");
  }

  getEventType(): string {
    return "AnimTimedSoundEvent";
  }
}

abstract class AnimTimedBgEvent extends LegacyAnimTimedEvent {
  public bgX: number = 0;
  public bgY: number = 0;
  public opacity: number = 0;
  /*public colorRed: number = 0;
    public colorGreen: number = 0;
    public colorBlue: number = 0;
    public colorAlpha: number = 0;*/
  public duration: number = 0;
  /*public flashScope: number = 0;
    public flashRed: number = 0;
    public flashGreen: number = 0;
    public flashBlue: number = 0;
    public flashAlpha: number = 0;
    public flashDuration: number = 0;*/
  constructor(frameIndex: number, resourceName: string, source?: any) {
    super(frameIndex, resourceName);

    if (source) {
      this.bgX = source.bgX;
      this.bgY = source.bgY;
      this.opacity = source.opacity;
      /*this.colorRed = source.colorRed;
        this.colorGreen = source.colorGreen;
        this.colorBlue = source.colorBlue;
        this.colorAlpha = source.colorAlpha;*/
      this.duration = source.duration;
      /*this.flashScope = source.flashScope;
        this.flashRed = source.flashRed;
        this.flashGreen = source.flashGreen;
        this.flashBlue = source.flashBlue;
        this.flashAlpha = source.flashAlpha;
        this.flashDuration = source.flashDuration;*/
    }
  }
}
export class AnimTimedUpdateBgEvent extends AnimTimedBgEvent {
  execute(moveAnim: MoveAnim, _priority?: number): number {
    const tweenProps = {};
    if (this.bgX !== undefined) {
      tweenProps["x"] = this.bgX * 0.5 - 320;
    }
    if (this.bgY !== undefined) {
      tweenProps["y"] = this.bgY * 0.5 - 284;
    }
    if (this.opacity !== undefined) {
      tweenProps["alpha"] = (this.opacity || 0) / 255;
    }
    if (Object.keys(tweenProps).length) {
      globalScene.tweens.add({
        targets: moveAnim.bgSprite,
        duration: getFrameMs(this.duration * 3),
        ...tweenProps,
      });
    }
    return this.duration * 2;
  }

  getEventType(): string {
    return "AnimTimedUpdateBgEvent";
  }
}
export class AnimTimedAddBgEvent extends AnimTimedBgEvent {
  execute(moveAnim: MoveAnim, priority?: number): number {
    if (moveAnim.bgSprite) {
      moveAnim.bgSprite.destroy();
    }
    moveAnim.bgSprite = this.resourceName
      ? globalScene.add.tileSprite(this.bgX - 320, this.bgY - 284, 896, 576, this.resourceName)
      : globalScene.add.rectangle(this.bgX - 320, this.bgY - 284, 896, 576, 0);
    moveAnim.bgSprite.setOrigin(0, 0);
    moveAnim.bgSprite.setScale(1.25);
    moveAnim.bgSprite.setAlpha(this.opacity / 255);
    globalScene.field.add(moveAnim.bgSprite);
    const fieldPokemon = globalScene.getEnemyPokemon(false) ?? globalScene.getPlayerPokemon(false);
    if (priority != null) {
      globalScene.field.moveTo(moveAnim.bgSprite as Phaser.GameObjects.GameObject, priority);
    } else if (fieldPokemon?.isOnField()) {
      globalScene.field.moveBelow(moveAnim.bgSprite as Phaser.GameObjects.GameObject, fieldPokemon);
    }

    globalScene.tweens.add({
      targets: moveAnim.bgSprite,
      duration: getFrameMs(this.duration * 3),
    });

    return this.duration * 2;
  }

  getEventType(): string {
    return "AnimTimedAddBgEvent";
  }
}
