import { type AnimConfig, type AnimFrame } from "#app/data/animations/anim-config";
import type { SubstituteTag } from "#app/data/battler-tags/substitute-tag";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { settings } from "#app/system/settings/settings-manager";
import { getEnumValues, getFrameMs, isNullOrUndefined } from "#app/utils";
import { AnimBlendType } from "#enums/anim-blend-type";
import { AnimFocus } from "#enums/anim-focus";
import { AnimFrameTargets, type AnimFrameTarget } from "#enums/anim-frame-target";
import { BattlerTagType } from "#enums/battler-tag-type";
import Phaser from "phaser";

interface GraphicFrameData {
  readonly x: number;
  readonly y: number;
  readonly zoomX: number;
  readonly zoomY: number;
  readonly angle: number;
}

interface SpriteCache {
  [key: string]: Phaser.GameObjects.Sprite[];
}

//#endregion
//#region Constants

const userFocusX = 106;
const userFocusY = 148 - 32;
const targetFocusX = 234;
const targetFocusY = 84 - 32;

//#endregion
//#region Export

export abstract class BattleAnim {
  /** The {@linkcode Pokemon} from which the effect of this animation originated */
  public user?: Pokemon;
  /** The {@linkcode Pokemon} targeted by the effect of this animation */
  public target?: Pokemon;
  /** The background sprite to show during the animation */
  public bgSprite: Phaser.GameObjects.TileSprite | Phaser.GameObjects.Rectangle;
  /**
   * If `true`, allows the animation to show its {@linkcode AnimFrameTargets.IMAGE | graphic} components
   * without requiring a user or target to be defined. This also causes the animation to play regardless
   * of whether the player has "Move Animations" enabled or disabled in Settings.
   */
  public playRegardlessOfIssues: boolean;

  /**
   * When playing the animation, this stores the endpoints of a line
   * between the user and target's "focal points", i.e.
   * ({@linkcode userFocusX}, {@linkcode userFocusY}) and
   * ({@linkcode targetFocusX}, {@linkcode targetFocusY})
   * @todo this seems unnecessary, everything in this is a const
   */
  private srcLine: number[];
  /**
   * When playing the animation, this stores the endpoints of a line
   * between the user and target's sprite positions in the format
   * `[ux, uy, tx, ty]`
   */
  private dstLine: number[];

  constructor(user?: Pokemon, target?: Pokemon, playRegardlessOfIssues: boolean = false) {
    this.user = user;
    this.target = target;
    this.playRegardlessOfIssues = playRegardlessOfIssues;
  }

  abstract getAnim(): AnimConfig | null;

  abstract isOppAnim(): boolean;

  protected isHideUser(): boolean {
    return false;
  }

  protected isHideTarget(): boolean {
    return false;
  }

  /**
   * Creates a 2D data table from the animation frames specified in this animation's
   * corresponding JSON, organized by frame target, then frame number.
   * @param frames - The {@linkcode AnimFrame | animation frames} collected from the animation's
   * JSON data
   * @param onSubstitute - If `true`, and the "target" of the animation has an active substitute,
   * the substitute's sprite is treated as the animation's target instead of its source {@linkcode Pokemon}
   * @returns a Map of Maps containing the animation's frame data. The first dimension's key
   * is an {@linkcode AnimFrameTarget}, and the second dimension's key corresponds with the
   * frame's index in animation order.
   * @todo The returned data structure is overly complex
   */
  private getGraphicFrameData(
    frames: AnimFrame[],
    onSubstitute: boolean = false,
  ): Map<AnimFrameTarget, Map<number, GraphicFrameData>> {
    const ret: Map<AnimFrameTarget, Map<number, GraphicFrameData>> = new Map([
      [AnimFrameTargets.IMAGE, new Map<number, GraphicFrameData>()],
      [AnimFrameTargets.SOURCE, new Map<number, GraphicFrameData>()],
      [AnimFrameTargets.TARGET, new Map<number, GraphicFrameData>()],
    ]);

    const isOppAnim = this.isOppAnim();
    const user = !isOppAnim ? this.user : this.target;
    const target = !isOppAnim ? this.target : this.user;

    const targetSubstitute =
      onSubstitute && user !== target ? target!.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE) : null;

    const userInitialX = user!.x; // TODO: is this bang correct?
    const userInitialY = user!.y; // TODO: is this bang correct?
    const userHalfHeight = user!.getSprite().displayHeight! / 2; // TODO: is this bang correct?

    const targetInitialX = targetSubstitute?.sprite?.x ?? target!.x; // TODO: is this bang correct?
    const targetInitialY = targetSubstitute?.sprite?.y ?? target!.y; // TODO: is this bang correct?
    const targetHalfHeight = (targetSubstitute?.sprite ?? target!.getSprite()).displayHeight! / 2; // TODO: is this bang correct?

    let g = 0;
    let u = 0;
    let t = 0;

    for (const frame of frames) {
      /**
       * The frame's position (x, y) is initially assumed to be relative to
       * the player's focal point, then updated based on the frame's "focus" value
       */
      let x = frame.x + userFocusX;
      let y = frame.y + userFocusY;
      let zoomX = (frame.zoomX / 100) * (!frame.mirror ? 1 : -1);
      const zoomY = frame.zoomY / 100;
      switch (frame.focus) {
        case AnimFocus.TARGET:
          x += targetInitialX - targetFocusX;
          y += targetInitialY - targetHalfHeight - targetFocusY;
          break;
        case AnimFocus.USER:
          x += userInitialX - userFocusX;
          y += userInitialY - userHalfHeight - userFocusY;
          break;
        case AnimFocus.USER_TARGET:
          /** Comments are based on the values set during {@linkcode play} */
          const point = transformPoint(
            this.srcLine[0], // userFocusX
            this.srcLine[1], // userFocusY
            this.srcLine[2], // targetFocusX
            this.srcLine[3], // targetFocusY
            this.dstLine[0], // userInitialX
            this.dstLine[1] - userHalfHeight, // userInitialY - userHalfHeight
            this.dstLine[2], // targetInitialX
            this.dstLine[3] - targetHalfHeight, // targetInitialY - targetHalfHeight
            x,
            y,
          );
          x = point[0];
          y = point[1];
          if (
            frame.target === AnimFrameTargets.IMAGE
            && isReversed(this.srcLine[0], this.srcLine[2], this.dstLine[0], this.dstLine[2])
          ) {
            zoomX = zoomX * -1;
          }
          break;
      }
      const angle = -frame.angle;
      const key = frame.target === AnimFrameTargets.IMAGE ? g++ : frame.target === AnimFrameTargets.SOURCE ? u++ : t++;
      ret.get(frame.target)!.set(key, { x, y, zoomX, zoomY, angle }); // TODO: is the bang correct?
    }

    return ret;
  }

  /**
   * Plays the animation between the defined {@linkcode user}
   * and {@linkcode target}.
   *
   * **Note**: This assumes the user and target are defined, and will
   * likely crash the game otherwise unless {@linkcode playRegardlessOfIssues}
   * is enabled. If `playRegardlessOfIssues` is enabled, animation frames
   * targeting an undefined user or target are not played.
   * @param onSubstitute - If `true`, and the target {@linkcode Pokemon} has
   * an active {@linkcode SubstituteTag | substitute}, the animation will treat
   * the substitute's sprite
   * @param callback - If defined, is executed immediately after
   * the animation completes.
   */
  play(onSubstitute?: boolean, callback?: () => void): void {
    const isOppAnim = this.isOppAnim();
    const user = !isOppAnim ? this.user! : this.target!; // TODO: are those bangs correct?
    const target = !isOppAnim ? this.target! : this.user!;

    if (!target?.isOnField() && !this.playRegardlessOfIssues) {
      if (callback) {
        callback();
      }
      return;
    }

    const targetSubstitute =
      onSubstitute && user !== target ? target.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE) : null;

    const userSprite = user.getSprite();
    const targetSprite = targetSubstitute?.sprite ?? target.getSprite();

    const spriteCache: SpriteCache = {
      [AnimFrameTargets.IMAGE]: [],
      [AnimFrameTargets.SOURCE]: [],
      [AnimFrameTargets.TARGET]: [],
    };
    const spritePriorities: number[] = [];

    /**
     * Destroys all sprites generated during the animation and resets
     * the visibility of the user and target's sprites (if the animation
     * isn't meant to hide the user/target). Once animation assets are
     * cleaned, this calls the given {@linkcode callback} with no arguments.
     */
    const cleanUpAndComplete = () => {
      userSprite.setPosition(0, 0);
      userSprite.setScale(1);
      userSprite.setAlpha(1);
      userSprite.pipelineData["tone"] = [0.0, 0.0, 0.0, 0.0];
      userSprite.setAngle(0);
      if (!targetSubstitute) {
        targetSprite.setPosition(0, 0);
        targetSprite.setScale(1);
        targetSprite.setAlpha(1);
      } else {
        targetSprite.setPosition(
          target.x - target.getSubstituteOffset()[0],
          target.y - target.getSubstituteOffset()[1],
        );
        targetSprite.setScale(target.getSpriteScale() * (target.isPlayer() ? 0.5 : 1));
        targetSprite.setAlpha(1);
      }
      targetSprite.pipelineData["tone"] = [0.0, 0.0, 0.0, 0.0];
      targetSprite.setAngle(0);

      /**
       * This and `targetSpriteToShow` are used to restore context lost
       * from the `isOppAnim` swap. Using these references instead of `this.user`
       * and `this.target` prevent the target's Substitute doll from disappearing
       * after being the target of an animation.
       */
      const userSpriteToShow = !isOppAnim ? userSprite : targetSprite;
      const targetSpriteToShow = !isOppAnim ? targetSprite : userSprite;
      if (!this.isHideUser() && userSpriteToShow) {
        userSpriteToShow.setVisible(true);
      }
      if (!this.isHideTarget() && (targetSpriteToShow !== userSpriteToShow || !this.isHideUser())) {
        targetSpriteToShow.setVisible(true);
      }
      for (const ms of Object.values(spriteCache).flat()) {
        if (ms) {
          ms.destroy();
        }
      }
      if (this.bgSprite) {
        this.bgSprite.destroy();
      }
      if (callback) {
        callback();
      }
    };

    if (!settings.display.enableMoveAnimations && !this.playRegardlessOfIssues) {
      return cleanUpAndComplete();
    }

    const anim = this.getAnim();

    const userInitialX = user.x;
    const userInitialY = user.y;
    const targetInitialX = targetSubstitute?.sprite?.x ?? target.x;
    const targetInitialY = targetSubstitute?.sprite?.y ?? target.y;

    this.srcLine = [userFocusX, userFocusY, targetFocusX, targetFocusY];
    this.dstLine = [userInitialX, userInitialY, targetInitialX, targetInitialY];

    let r = anim?.frames.length ?? 0;
    let f = 0;

    /**
     * Frames are set for each asset of the animation
     * every 50 ms. This includes the user, target, and all graphics.
     */
    globalScene.tweens.addCounter({
      duration: getFrameMs(3),
      repeat: anim?.frames.length ?? 0,
      onRepeat: () => {
        /**
         * Animations hide the user and target's
         * base sprites, instead playing on copies of their
         * sprites under the same pipeline
         */
        if (f === 0) {
          userSprite.setVisible(false);
          targetSprite.setVisible(false);
        }

        /** The properties of all assets for the current frame */
        const spriteFrames = anim!.frames[f]; // TODO: is the bang correct?
        const frameData = this.getGraphicFrameData(anim!.frames[f], onSubstitute); // TODO: is the bang correct?
        let u = 0;
        let t = 0;
        let g = 0;
        for (const frame of spriteFrames) {
          if (frame.target !== AnimFrameTargets.IMAGE) {
            const isUser = frame.target === AnimFrameTargets.SOURCE;
            if (isUser && target === user) {
              continue;
            } else if (this.playRegardlessOfIssues && frame.target === AnimFrameTargets.TARGET && !target.isOnField()) {
              continue;
            }
            const sprites = spriteCache[isUser ? AnimFrameTargets.SOURCE : AnimFrameTargets.TARGET];
            const spriteSource = isUser ? userSprite : targetSprite;
            if ((isUser ? u : t) === sprites.length) {
              if (isUser || !targetSubstitute) {
                /** Create (and pipeline) a duplicate Pokemon sprite to animate on */
                const sprite = globalScene.addPokemonSprite(
                  isUser ? user : target,
                  0,
                  0,
                  spriteSource.texture,
                  spriteSource.frame.name,
                  true,
                );
                sprite.pipelineData["spriteColors"] = (isUser ? user : target).getSprite().pipelineData["spriteColors"];
                sprite.setPipelineData("spriteKey", (isUser ? user : target).getBattleSpriteKey());
                sprite.setPipelineData("ignoreFieldPos", true);
                spriteSource.on("animationupdate", (_anim, frame) => sprite.setFrame(frame.textureFrame));
                globalScene.field.add(sprite);
                sprites.push(sprite);
              } else {
                /** Create a duplicate Substitute sprite to animate on */
                const sprite = globalScene.addFieldSprite(spriteSource.x, spriteSource.y, spriteSource.texture);
                spriteSource.on("animationupdate", (_anim, frame) => sprite.setFrame(frame.textureFrame));
                globalScene.field.add(sprite);
                sprites.push(sprite);
              }
            }

            /** Set the Pokemon (or substitute) sprite's properties to match frame data */
            const spriteIndex = isUser ? u++ : t++;
            const pokemonSprite = sprites[spriteIndex];
            const graphicFrameData = frameData.get(frame.target)!.get(spriteIndex)!; // TODO: are the bangs correct?
            const spriteSourceScale =
              isUser || !targetSubstitute
                ? spriteSource.parentContainer.scale
                : target.getSpriteScale() * (target.isPlayer() ? 0.5 : 1);
            pokemonSprite.setPosition(
              graphicFrameData.x,
              graphicFrameData.y - (spriteSource.height / 2) * (spriteSourceScale - 1),
            );

            pokemonSprite.setAngle(graphicFrameData.angle);
            pokemonSprite.setScale(
              graphicFrameData.zoomX * spriteSourceScale,
              graphicFrameData.zoomY * spriteSourceScale,
            );

            pokemonSprite.setData("locked", frame.locked);

            pokemonSprite.setAlpha(frame.opacity / 255);
            pokemonSprite.pipelineData["tone"] = frame.tone;
            pokemonSprite.setVisible(frame.visible && (isUser ? user.visible : target.visible));
            pokemonSprite.setBlendMode(
              frame.blendType === AnimBlendType.NORMAL
                ? Phaser.BlendModes.NORMAL
                : frame.blendType === AnimBlendType.ADD
                  ? Phaser.BlendModes.ADD
                  : Phaser.BlendModes.DIFFERENCE,
            );
          } else {
            const sprites = spriteCache[AnimFrameTargets.IMAGE];
            if (g === sprites.length) {
              const newSprite: Phaser.GameObjects.Sprite = globalScene.addFieldSprite(0, 0, anim!.graphic, 1); // TODO: is the bang correct?
              sprites.push(newSprite);
              globalScene.field.add(newSprite);
              spritePriorities.push(1);
            }

            const graphicIndex = g++;
            const moveSprite = sprites[graphicIndex];
            if (spritePriorities[graphicIndex] !== frame.priority) {
              spritePriorities[graphicIndex] = frame.priority;
              const setSpritePriority = (priority: number) => {
                switch (priority) {
                  case 0:
                    globalScene.field.moveBelow(
                      moveSprite as Phaser.GameObjects.GameObject,
                      globalScene.getEnemyPokemon(false) ?? globalScene.getPlayerPokemon(false)!,
                    ); // TODO: is this bang correct?
                    break;
                  case 1:
                    globalScene.field.moveTo(moveSprite, globalScene.field.getAll().length - 1);
                    break;
                  case 2:
                    switch (frame.focus) {
                      case AnimFocus.USER:
                        if (this.bgSprite) {
                          globalScene.field.moveAbove(moveSprite as Phaser.GameObjects.GameObject, this.bgSprite);
                        } else {
                          globalScene.field.moveBelow(moveSprite as Phaser.GameObjects.GameObject, this.user!); // TODO: is this bang correct?
                        }
                        break;
                      case AnimFocus.TARGET:
                        globalScene.field.moveBelow(moveSprite as Phaser.GameObjects.GameObject, this.target!); // TODO: is this bang correct?
                        break;
                      default:
                        setSpritePriority(1);
                        break;
                    }
                    break;
                  case 3:
                    switch (frame.focus) {
                      case AnimFocus.USER:
                        globalScene.field.moveAbove(moveSprite as Phaser.GameObjects.GameObject, this.user!); // TODO: is this bang correct?
                        break;
                      case AnimFocus.TARGET:
                        globalScene.field.moveAbove(moveSprite as Phaser.GameObjects.GameObject, this.target!); // TODO: is this bang correct?
                        break;
                      default:
                        setSpritePriority(1);
                        break;
                    }
                    break;
                  default:
                    setSpritePriority(1);
                }
              };
              setSpritePriority(frame.priority);
            }
            moveSprite.setFrame(frame.graphicFrame);
            //console.log(AnimFocus[frame.focus]);

            const graphicFrameData = frameData.get(frame.target)!.get(graphicIndex)!; // TODO: are those bangs correct?
            moveSprite.setPosition(graphicFrameData.x, graphicFrameData.y);
            moveSprite.setAngle(graphicFrameData.angle);
            moveSprite.setScale(graphicFrameData.zoomX, graphicFrameData.zoomY);

            moveSprite.setAlpha(frame.opacity / 255);
            moveSprite.setVisible(frame.visible);
            moveSprite.setBlendMode(
              frame.blendType === AnimBlendType.NORMAL
                ? Phaser.BlendModes.NORMAL
                : frame.blendType === AnimBlendType.ADD
                  ? Phaser.BlendModes.ADD
                  : Phaser.BlendModes.DIFFERENCE,
            );
          }
        }
        if (anim?.frameTimedEvents.has(f)) {
          for (const event of anim.frameTimedEvents.get(f)!) {
            // TODO: is this bang correct?
            r = Math.max(anim.frames.length - f + event.execute(this), r);
          }
        }
        const targets = Object.values(AnimFrameTargets);
        for (const i of targets) {
          const count = i === AnimFrameTargets.IMAGE ? g : i === AnimFrameTargets.SOURCE ? u : t;
          if (count < spriteCache[i].length) {
            const spritesToRemove = spriteCache[i].slice(count, spriteCache[i].length);
            for (const rs of spritesToRemove) {
              if (!rs.getData("locked") as boolean) {
                const spriteCacheIndex = spriteCache[i].indexOf(rs);
                spriteCache[i].splice(spriteCacheIndex, 1);
                if (i === AnimFrameTargets.IMAGE) {
                  spritePriorities.splice(spriteCacheIndex, 1);
                }
                rs.destroy();
              }
            }
          }
        }
        f++;
        r--;
      },
      onComplete: () => {
        for (const ms of Object.values(spriteCache).flat()) {
          if (ms && !ms.getData("locked")) {
            ms.destroy();
          }
        }
        if (r) {
          globalScene.tweens.addCounter({
            duration: getFrameMs(r),
            onComplete: () => cleanUpAndComplete(),
          });
        } else {
          cleanUpAndComplete();
        }
      },
    });
  }

  private getGraphicFrameDataWithoutTarget(
    frames: AnimFrame[],
    targetInitialX: number,
    targetInitialY: number,
  ): Map<AnimFrameTarget, Map<number, GraphicFrameData>> {
    const ret: Map<AnimFrameTarget, Map<number, GraphicFrameData>> = new Map([
      [AnimFrameTargets.IMAGE, new Map<number, GraphicFrameData>()],
      [AnimFrameTargets.SOURCE, new Map<number, GraphicFrameData>()],
      [AnimFrameTargets.TARGET, new Map<number, GraphicFrameData>()],
    ]);

    let g = 0;
    let u = 0;
    let t = 0;

    for (const frame of frames) {
      let { x, y } = frame;
      const { mirror } = frame;
      const zoomX = (frame.zoomX / 100) * (mirror ? -1 : 1);
      const zoomY = frame.zoomY / 100;
      x += targetInitialX;
      y += targetInitialY;
      const angle = -frame.angle;
      const key = frame.target === AnimFrameTargets.IMAGE ? g++ : frame.target === AnimFrameTargets.SOURCE ? u++ : t++;
      ret.get(frame.target)?.set(key, { x, y, zoomX, zoomY, angle });
    }

    return ret;
  }

  /**
   * Plays this animation ignoring frame data for "user" or
   * "target" Pokemon. This only plays the {@linkcode AnimFrameTargets.IMAGE | graphic}
   * components of the animation.
   * @param targetInitialX - The x-coordinate of the animation's start point,
   * relative to {@linkcode userFocusX}
   * @param targetInitialY - The y-coordinate of the animation's start point,
   * relative to {@linkcode userFocusY}
   * @param frameTimeMult - A multiplier for the delay between graphic frames
   * @param frameTimedEventPriority - The depth (or z-coordinate) of animated graphics:
   * - 0 is behind all other sprites (except BG)
   * - 1 is on top of player field
   * - 3 is on top of both fields
   * - 5 is on top of player sprite
   * @param callback - A function invoked immediately after the animation completes
   */
  playWithoutTargets(
    targetInitialX: number,
    targetInitialY: number,
    frameTimeMult: number,
    frameTimedEventPriority?: 0 | 1 | 3 | 5,
    callback?: () => void,
  ) {
    const spriteCache: SpriteCache = {
      [AnimFrameTargets.IMAGE]: [],
      [AnimFrameTargets.SOURCE]: [],
      [AnimFrameTargets.TARGET]: [],
    };

    const cleanUpAndComplete = () => {
      for (const ms of Object.values(spriteCache).flat()) {
        if (ms) {
          ms.destroy();
        }
      }
      if (this.bgSprite) {
        this.bgSprite.destroy();
      }
      if (callback) {
        callback();
      }
    };

    if (!settings.display.enableMoveAnimations && !this.playRegardlessOfIssues) {
      return cleanUpAndComplete();
    }

    const anim = this.getAnim();

    this.srcLine = [userFocusX, userFocusY, targetFocusX, targetFocusY];
    this.dstLine = [150, 75, targetInitialX, targetInitialY];

    let totalFrames = anim!.frames.length;
    let frameCount = 0;

    let existingFieldSprites = globalScene.field.getAll().slice(0);

    globalScene.tweens.addCounter({
      duration: getFrameMs(3) * frameTimeMult,
      repeat: anim!.frames.length,
      onRepeat: () => {
        existingFieldSprites = globalScene.field.getAll().slice(0);
        const spriteFrames = anim!.frames[frameCount];
        const frameData = this.getGraphicFrameDataWithoutTarget(
          anim!.frames[frameCount],
          targetInitialX,
          targetInitialY,
        );
        let graphicFrameCount = 0;
        for (const frame of spriteFrames) {
          if (frame.target !== AnimFrameTargets.IMAGE) {
            console.log("Encounter animations do not support targets");
            continue;
          }

          const sprites = spriteCache[AnimFrameTargets.IMAGE];
          if (graphicFrameCount === sprites.length) {
            const newSprite: Phaser.GameObjects.Sprite = globalScene.addFieldSprite(0, 0, anim!.graphic, 1);
            sprites.push(newSprite);
            globalScene.field.add(newSprite);
          }

          const graphicIndex = graphicFrameCount++;
          const moveSprite = sprites[graphicIndex];
          if (!isNullOrUndefined(frame.priority)) {
            const setSpritePriority = (priority: number) => {
              if (existingFieldSprites.length > priority) {
                // Move to specified priority index
                const index = globalScene.field.getIndex(existingFieldSprites[priority]);
                globalScene.field.moveTo(moveSprite, index);
              } else {
                // Move to top of scene
                globalScene.field.moveTo(moveSprite, globalScene.field.getAll().length - 1);
              }
            };
            setSpritePriority(frame.priority);
          }
          moveSprite.setFrame(frame.graphicFrame);

          const graphicFrameData = frameData.get(frame.target)?.get(graphicIndex);
          if (graphicFrameData) {
            moveSprite.setPosition(graphicFrameData.x, graphicFrameData.y);
            moveSprite.setAngle(graphicFrameData.angle);
            moveSprite.setScale(graphicFrameData.zoomX, graphicFrameData.zoomY);

            moveSprite.setAlpha(frame.opacity / 255);
            moveSprite.setVisible(frame.visible);
            moveSprite.setBlendMode(
              frame.blendType === AnimBlendType.NORMAL
                ? Phaser.BlendModes.NORMAL
                : frame.blendType === AnimBlendType.ADD
                  ? Phaser.BlendModes.ADD
                  : Phaser.BlendModes.DIFFERENCE,
            );
          }
        }
        if (anim?.frameTimedEvents.get(frameCount)) {
          for (const event of anim.frameTimedEvents.get(frameCount)!) {
            totalFrames = Math.max(
              anim.frames.length - frameCount + event.execute(this, frameTimedEventPriority),
              totalFrames,
            );
          }
        }
        const targets = getEnumValues(AnimFrameTargets);
        for (const i of targets) {
          const count = graphicFrameCount;
          if (count < spriteCache[i].length) {
            const spritesToRemove = spriteCache[i].slice(count, spriteCache[i].length);
            for (const sprite of spritesToRemove) {
              if (!sprite.getData("locked") as boolean) {
                const spriteCacheIndex = spriteCache[i].indexOf(sprite);
                spriteCache[i].splice(spriteCacheIndex, 1);
                sprite.destroy();
              }
            }
          }
        }
        frameCount++;
        totalFrames--;
      },
      onComplete: () => {
        for (const sprite of Object.values(spriteCache).flat()) {
          if (sprite && !sprite.getData("locked")) {
            sprite.destroy();
          }
        }
        if (totalFrames) {
          globalScene.tweens.addCounter({
            duration: getFrameMs(totalFrames),
            onComplete: () => cleanUpAndComplete(),
          });
        } else {
          cleanUpAndComplete();
        }
      },
    });
  }
}

//#endregion
//#region Helpers

/** @todo Review and simplify this and other geometric helper functions */
function transformPoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  px: number,
  py: number,
): [x: number, y: number] {
  const yIntersect = yAxisIntersect(x1, y1, x2, y2, px, py);
  return repositionY(x3, y3, x4, y4, yIntersect[0], yIntersect[1]);
}

function yAxisIntersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  px: number,
  py: number,
): [x: number, y: number] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const x = dx === 0 ? 0 : (px - x1) / dx;
  const y = dy === 0 ? 0 : (py - y1) / dy;
  return [x, y];
}

function repositionY(x1: number, y1: number, x2: number, y2: number, tx: number, ty: number): [x: number, y: number] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const x = x1 + tx * dx;
  const y = y1 + ty * dy;
  return [x, y];
}

function isReversed(src1: number, src2: number, dst1: number, dst2: number) {
  if (src1 === src2) {
    return false;
  }
  if (src1 < src2) {
    return dst1 > dst2;
  }
  return dst1 < dst2;
}

//#endregion
