import { globalScene } from "#app/global-scene";
import { getFrameMs, isNullOrUndefined } from "#app/utils";
import { AnimBlendType } from "#enums/anim-blend-type";
import { AnimFocus } from "#enums/anim-focus";
import { AnimFrameTargets, type AnimFrameTarget } from "#enums/anim-frame-target";
import type Phaser from "phaser";
import { type BattleAnim } from "./battle-anims";
import { type MoveAnim } from "./move-anim";

export class AnimConfig {
  public id: number;
  public graphic: string;
  public frames: AnimFrame[][];
  public frameTimedEvents: Map<number, AnimTimedEvent[]>;
  public position: number;
  public hue: number;

  constructor(source?: any) {
    this.frameTimedEvents = new Map<number, AnimTimedEvent[]>();

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
        const timedEvents: AnimTimedEvent[] = [];
        for (const te of frameTimedEvents[fte]) {
          let timedEvent: AnimTimedEvent | undefined;
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
        this.frameTimedEvents.set(parseInt(fte), timedEvents);
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
    this.x = !init ? ((x || 0) - 128) * 0.5 : x;
    this.y = !init ? ((y || 0) - 224) * 0.5 : y;
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
      let target: AnimFrameTarget = AnimFrameTargets.IMAGE;
      switch (pattern) {
        case -2:
          target = AnimFrameTargets.TARGET;
          break;
        case -1:
          target = AnimFrameTargets.SOURCE;
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
export abstract class AnimTimedEvent {
  public frameIndex: number;
  public resourceName: string;

  constructor(frameIndex: number, resourceName: string) {
    this.frameIndex = frameIndex;
    this.resourceName = resourceName;
  }

  abstract execute(battleAnim: BattleAnim, priority?: number): number;

  abstract getEventType(): string;
}

export class AnimTimedSoundEvent extends AnimTimedEvent {
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
    } else if (battleAnim.user) {
      return Math.ceil((battleAnim.user.cry(soundConfig).totalDuration * 1000) / 33.33);
    } else {
      throw new Error("battleAnim.user is null!");
    }
  }

  getEventType(): string {
    return "AnimTimedSoundEvent";
  }
}

abstract class AnimTimedBgEvent extends AnimTimedEvent {
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
  constructor(frameIndex: number, resourceName: string, source: any) {
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
  constructor(frameIndex: number, resourceName: string, source?: any) {
    super(frameIndex, resourceName, source);
  }

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
      globalScene.tweens.add(
        Object.assign(
          {
            targets: moveAnim.bgSprite,
            duration: getFrameMs(this.duration * 3),
          },
          tweenProps,
        ),
      );
    }
    return this.duration * 2;
  }

  getEventType(): string {
    return "AnimTimedUpdateBgEvent";
  }
}
export class AnimTimedAddBgEvent extends AnimTimedBgEvent {
  constructor(frameIndex: number, resourceName: string, source?: any) {
    super(frameIndex, resourceName, source);
  }

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
    if (!isNullOrUndefined(priority)) {
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
