import { globalScene } from "#app/global-scene";
import { allMoves } from "#app/data/all-moves";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import { getFrameMs, getEnumKeys, getEnumValues, isNullOrUndefined } from "#app/utils";
import { BattlerIndex } from "#enums/battler-index";
import { Moves } from "#enums/moves";
import { type SubstituteTag } from "#app/data/battler-tags";
import Phaser from "phaser";
import { type EncounterAnim } from "#enums/encounter-anims";
import { settings } from "#app/system/settings/settings-manager";
import { AnimFrameTarget } from "#enums/anim-frame-target";
import { ChargeAnim } from "#enums/charge-anim";
import { CommonAnim } from "#enums/common-anim";
import { BattlerTagType } from "#enums/battler-tag-type";
import { loadAnimAssets } from "#app/utils/move-anim-utils";
import {
  AnimConfig,
  AnimFrame,
  type AnimTimedEvent,
  AnimTimedSoundEvent,
  AnimTimedAddBgEvent,
  AnimTimedUpdateBgEvent,
} from "#app/data/anim-config";
import { AnimBlendType } from "#enums/anim-blend-type";
import { AnimFocus } from "#enums/anim-focus";

export const moveAnims = new Map<Moves, AnimConfig | [AnimConfig, AnimConfig] | null>();
export const chargeAnims = new Map<ChargeAnim, AnimConfig | [AnimConfig, AnimConfig] | null>();
export const commonAnims = new Map<CommonAnim, AnimConfig>();
export const encounterAnims = new Map<EncounterAnim, AnimConfig>();

export function loadCommonAnimAssets(startLoad?: boolean): Promise<void> {
  return new Promise((resolve) => {
    loadAnimAssets(Array.from(commonAnims.values()), startLoad).then(() => resolve());
  });
}

/**
 * Loads encounter animation assets to scene
 * MUST be called after {@linkcode initEncounterAnims()} to load all required animations properly
 * @param startLoad
 */
export async function loadEncounterAnimAssets(startLoad?: boolean): Promise<void> {
  await loadAnimAssets(Array.from(encounterAnims.values()), startLoad);
}

interface GraphicFrameData {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  angle: number;
}

const userFocusX = 106;
const userFocusY = 148 - 32;
const targetFocusX = 234;
const targetFocusY = 84 - 32;

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

interface SpriteCache {
  [key: number]: Phaser.GameObjects.Sprite[];
}

export abstract class BattleAnim {
  public user: Pokemon | null;
  public target: Pokemon | null;
  public sprites: Phaser.GameObjects.Sprite[];
  public bgSprite: Phaser.GameObjects.TileSprite | Phaser.GameObjects.Rectangle;
  /**
   * Will attempt to play as much of an animation as possible, even if not all targets are on the field.
   * Will also play the animation, even if the user has selected "Move Animations" OFF in Settings.
   * Exclusively used by MEs atm, for visual animations at the start of an encounter.
   */
  public playRegardlessOfIssues: boolean;

  private srcLine: number[];
  private dstLine: number[];

  constructor(user?: Pokemon, target?: Pokemon, playRegardlessOfIssues: boolean = false) {
    this.user = user ?? null;
    this.target = target ?? null;
    this.sprites = [];
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

  private getGraphicFrameData(
    frames: AnimFrame[],
    onSubstitute?: boolean,
  ): Map<number, Map<AnimFrameTarget, GraphicFrameData>> {
    const ret: Map<number, Map<AnimFrameTarget, GraphicFrameData>> = new Map([
      [AnimFrameTarget.GRAPHIC, new Map<AnimFrameTarget, GraphicFrameData>()],
      [AnimFrameTarget.USER, new Map<AnimFrameTarget, GraphicFrameData>()],
      [AnimFrameTarget.TARGET, new Map<AnimFrameTarget, GraphicFrameData>()],
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
      let x = frame.x + 106;
      let y = frame.y + 116;
      let scaleX = (frame.zoomX / 100) * (!frame.mirror ? 1 : -1);
      const scaleY = frame.zoomY / 100;
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
          const point = transformPoint(
            this.srcLine[0],
            this.srcLine[1],
            this.srcLine[2],
            this.srcLine[3],
            this.dstLine[0],
            this.dstLine[1] - userHalfHeight,
            this.dstLine[2],
            this.dstLine[3] - targetHalfHeight,
            x,
            y,
          );
          x = point[0];
          y = point[1];
          if (
            frame.target === AnimFrameTarget.GRAPHIC
            && isReversed(this.srcLine[0], this.srcLine[2], this.dstLine[0], this.dstLine[2])
          ) {
            scaleX = scaleX * -1;
          }
          break;
      }
      const angle = -frame.angle;
      const key = frame.target === AnimFrameTarget.GRAPHIC ? g++ : frame.target === AnimFrameTarget.USER ? u++ : t++;
      ret.get(frame.target)!.set(key, { x: x, y: y, scaleX: scaleX, scaleY: scaleY, angle: angle }); // TODO: is the bang correct?
    }

    return ret;
  }

  play(onSubstitute?: boolean, callback?: Function) {
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
      !!onSubstitute && user !== target ? target.getTag<SubstituteTag>(BattlerTagType.SUBSTITUTE) : null;

    const userSprite = user.getSprite();
    const targetSprite = targetSubstitute?.sprite ?? target.getSprite();

    const spriteCache: SpriteCache = {
      [AnimFrameTarget.GRAPHIC]: [],
      [AnimFrameTarget.USER]: [],
      [AnimFrameTarget.TARGET]: [],
    };
    const spritePriorities: number[] = [];

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

    globalScene.tweens.addCounter({
      duration: getFrameMs(3),
      repeat: anim?.frames.length ?? 0,
      onRepeat: () => {
        if (!f) {
          userSprite.setVisible(false);
          targetSprite.setVisible(false);
        }

        const spriteFrames = anim!.frames[f]; // TODO: is the bang correcT?
        const frameData = this.getGraphicFrameData(anim!.frames[f], onSubstitute); // TODO: is the bang correct?
        let u = 0;
        let t = 0;
        let g = 0;
        for (const frame of spriteFrames) {
          if (frame.target !== AnimFrameTarget.GRAPHIC) {
            const isUser = frame.target === AnimFrameTarget.USER;
            if (isUser && target === user) {
              continue;
            } else if (this.playRegardlessOfIssues && frame.target === AnimFrameTarget.TARGET && !target.isOnField()) {
              continue;
            }
            const sprites = spriteCache[isUser ? AnimFrameTarget.USER : AnimFrameTarget.TARGET];
            const spriteSource = isUser ? userSprite : targetSprite;
            if ((isUser ? u : t) === sprites.length) {
              if (isUser || !targetSubstitute) {
                const sprite = globalScene.addPokemonSprite(
                  isUser ? user! : target,
                  0,
                  0,
                  spriteSource!.texture,
                  spriteSource!.frame.name,
                  true,
                ); // TODO: are those bangs correct?
                ["spriteColors", "fusionSpriteColors"].map(
                  (k) => (sprite.pipelineData[k] = (isUser ? user! : target).getSprite().pipelineData[k]),
                ); // TODO: are those bangs correct?
                sprite.setPipelineData("spriteKey", (isUser ? user! : target).getBattleSpriteKey());
                sprite.setPipelineData("ignoreFieldPos", true);
                spriteSource.on("animationupdate", (_anim, frame) => sprite.setFrame(frame.textureFrame));
                globalScene.field.add(sprite);
                sprites.push(sprite);
              } else {
                const sprite = globalScene.addFieldSprite(spriteSource.x, spriteSource.y, spriteSource.texture);
                spriteSource.on("animationupdate", (_anim, frame) => sprite.setFrame(frame.textureFrame));
                globalScene.field.add(sprite);
                sprites.push(sprite);
              }
            }

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
              graphicFrameData.scaleX * spriteSourceScale,
              graphicFrameData.scaleY * spriteSourceScale,
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
            const sprites = spriteCache[AnimFrameTarget.GRAPHIC];
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
            moveSprite.setScale(graphicFrameData.scaleX, graphicFrameData.scaleY);

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
        const targets = getEnumValues(AnimFrameTarget);
        for (const i of targets) {
          const count = i === AnimFrameTarget.GRAPHIC ? g : i === AnimFrameTarget.USER ? u : t;
          if (count < spriteCache[i].length) {
            const spritesToRemove = spriteCache[i].slice(count, spriteCache[i].length);
            for (const rs of spritesToRemove) {
              if (!rs.getData("locked") as boolean) {
                const spriteCacheIndex = spriteCache[i].indexOf(rs);
                spriteCache[i].splice(spriteCacheIndex, 1);
                if (i === AnimFrameTarget.GRAPHIC) {
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
  ): Map<number, Map<AnimFrameTarget, GraphicFrameData>> {
    const ret: Map<number, Map<AnimFrameTarget, GraphicFrameData>> = new Map([
      [AnimFrameTarget.GRAPHIC, new Map<AnimFrameTarget, GraphicFrameData>()],
      [AnimFrameTarget.USER, new Map<AnimFrameTarget, GraphicFrameData>()],
      [AnimFrameTarget.TARGET, new Map<AnimFrameTarget, GraphicFrameData>()],
    ]);

    let g = 0;
    let u = 0;
    let t = 0;

    for (const frame of frames) {
      let { x, y } = frame;
      const scaleX = (frame.zoomX / 100) * (!frame.mirror ? 1 : -1);
      const scaleY = frame.zoomY / 100;
      x += targetInitialX;
      y += targetInitialY;
      const angle = -frame.angle;
      const key = frame.target === AnimFrameTarget.GRAPHIC ? g++ : frame.target === AnimFrameTarget.USER ? u++ : t++;
      ret.get(frame.target)?.set(key, { x: x, y: y, scaleX: scaleX, scaleY: scaleY, angle: angle });
    }

    return ret;
  }

  /**
   * @param targetInitialX
   * @param targetInitialY
   * @param frameTimeMult
   * @param frameTimedEventPriority
   * - 0 is behind all other sprites (except BG)
   * - 1 on top of player field
   * - 3 is on top of both fields
   * - 5 is on top of player sprite
   * @param callback
   */
  playWithoutTargets(
    targetInitialX: number,
    targetInitialY: number,
    frameTimeMult: number,
    frameTimedEventPriority?: 0 | 1 | 3 | 5,
    callback?: Function,
  ) {
    const spriteCache: SpriteCache = {
      [AnimFrameTarget.GRAPHIC]: [],
      [AnimFrameTarget.USER]: [],
      [AnimFrameTarget.TARGET]: [],
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
          if (frame.target !== AnimFrameTarget.GRAPHIC) {
            console.log("Encounter animations do not support targets");
            continue;
          }

          const sprites = spriteCache[AnimFrameTarget.GRAPHIC];
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
            moveSprite.setScale(graphicFrameData.scaleX, graphicFrameData.scaleY);

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
        const targets = getEnumValues(AnimFrameTarget);
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

export class CommonBattleAnim extends BattleAnim {
  public commonAnim: CommonAnim | null;

  constructor(commonAnim: CommonAnim | null, user: Pokemon, target?: Pokemon, playOnEmptyField: boolean = false) {
    super(user, target || user, playOnEmptyField);

    this.commonAnim = commonAnim;
  }

  getAnim(): AnimConfig | null {
    return this.commonAnim ? (commonAnims.get(this.commonAnim) ?? null) : null;
  }

  isOppAnim(): boolean {
    return false;
  }
}

export class MoveAnim extends BattleAnim {
  public move: Moves;

  constructor(move: Moves, user: Pokemon, targetIndex: BattlerIndex, playOnEmptyField: boolean = false) {
    super(user, globalScene.getFieldPokemonByBattlerIndex(targetIndex), playOnEmptyField);

    this.move = move;
  }

  getAnim(): AnimConfig {
    return moveAnims.get(this.move) instanceof AnimConfig
      ? (moveAnims.get(this.move) as AnimConfig)
      : (moveAnims.get(this.move)?.[this.user?.isPlayer() ? 0 : 1] as AnimConfig);
  }

  isOppAnim(): boolean {
    return !this.user?.isPlayer() && Array.isArray(moveAnims.get(this.move));
  }

  protected override isHideUser(): boolean {
    return allMoves[this.move].hasFlag(MoveFlags.HIDE_USER);
  }

  protected override isHideTarget(): boolean {
    return allMoves[this.move].hasFlag(MoveFlags.HIDE_TARGET);
  }
}

export class MoveChargeAnim extends MoveAnim {
  private chargeAnim: ChargeAnim;

  /**
   * **Note:** The default for {@linkcode targetIndex} being {@linkcode BattlerIndex.PLAYER} is due to `MoveChargeAnim` originally not supporting a target argument.
   */
  constructor(chargeAnim: ChargeAnim, move: Moves, user: Pokemon, targetIndex: BattlerIndex = BattlerIndex.PLAYER) {
    super(move, user, targetIndex);

    this.chargeAnim = chargeAnim;
  }

  override isOppAnim(): boolean {
    return !this.user?.isPlayer() && Array.isArray(chargeAnims.get(this.chargeAnim));
  }

  override getAnim(): AnimConfig {
    return chargeAnims.get(this.chargeAnim) instanceof AnimConfig
      ? (chargeAnims.get(this.chargeAnim) as AnimConfig)
      : (chargeAnims.get(this.chargeAnim)?.[this.user?.isPlayer() ? 0 : 1] as AnimConfig);
  }
}

export class EncounterBattleAnim extends BattleAnim {
  public encounterAnim: EncounterAnim;
  public oppAnim: boolean;

  constructor(encounterAnim: EncounterAnim, user: Pokemon, target?: Pokemon, oppAnim?: boolean) {
    super(user, target ?? user, true);

    this.encounterAnim = encounterAnim;
    this.oppAnim = oppAnim ?? false;
  }

  getAnim(): AnimConfig | null {
    return encounterAnims.get(this.encounterAnim) ?? null;
  }

  isOppAnim(): boolean {
    return this.oppAnim;
  }
}

export async function populateAnims() {
  const commonAnimNames = getEnumKeys(CommonAnim).map((k) => k.toLowerCase());
  const commonAnimMatchNames = commonAnimNames.map((k) => k.replace(/\_/g, ""));
  const commonAnimIds = getEnumValues(CommonAnim) as CommonAnim[];
  const chargeAnimNames = getEnumKeys(ChargeAnim).map((k) => k.toLowerCase());
  const chargeAnimMatchNames = chargeAnimNames.map((k) => k.replace(/\_/g, " "));
  const chargeAnimIds = getEnumValues(ChargeAnim) as ChargeAnim[];
  const commonNamePattern = /name: (?:Common:)?(Opp )?(.*)/;
  const moveNameToId = {};
  for (const move of getEnumValues(Moves).slice(1)) {
    const moveName = Moves[move].toUpperCase().replace(/\_/g, "");
    moveNameToId[moveName] = move;
  }

  const seNames: string[] = []; //(await fs.readdir('./public/audio/se/battle_anims/')).map(se => se.toString());

  const animsData: any[] = []; //battleAnimRawData.split('!ruby/array:PBAnimation').slice(1); // TODO: add a proper type
  for (let a = 0; a < animsData.length; a++) {
    const fields = animsData[a].split("@").slice(1);

    const nameField = fields.find((f) => f.startsWith("name: "));

    let isOppMove: boolean | undefined;
    let commonAnimId: CommonAnim | undefined;
    let chargeAnimId: ChargeAnim | undefined;
    if (!nameField.startsWith("name: Move:") && !(isOppMove = nameField.startsWith("name: OppMove:"))) {
      const nameMatch = commonNamePattern.exec(nameField)!; // TODO: is this bang correct?
      const name = nameMatch[2].toLowerCase();
      if (commonAnimMatchNames.indexOf(name) > -1) {
        commonAnimId = commonAnimIds[commonAnimMatchNames.indexOf(name)];
      } else if (chargeAnimMatchNames.indexOf(name) > -1) {
        isOppMove = nameField.startsWith("name: Opp ");
        chargeAnimId = chargeAnimIds[chargeAnimMatchNames.indexOf(name)];
      }
    }
    const nameIndex = nameField.indexOf(":", 5) + 1;
    const animName = nameField.slice(nameIndex, nameField.indexOf("\n", nameIndex));
    if (!moveNameToId.hasOwnProperty(animName) && !commonAnimId && !chargeAnimId) {
      continue;
    }
    const anim = commonAnimId || chargeAnimId ? new AnimConfig() : new AnimConfig();
    if (anim instanceof AnimConfig) {
      (anim as AnimConfig).id = moveNameToId[animName];
    }
    if (commonAnimId) {
      commonAnims.set(commonAnimId, anim);
    } else if (chargeAnimId) {
      chargeAnims.set(chargeAnimId, !isOppMove ? anim : [chargeAnims.get(chargeAnimId) as AnimConfig, anim]);
    } else {
      moveAnims.set(
        moveNameToId[animName],
        !isOppMove ? (anim as AnimConfig) : [moveAnims.get(moveNameToId[animName]) as AnimConfig, anim as AnimConfig],
      );
    }
    for (let f = 0; f < fields.length; f++) {
      const field = fields[f];
      const fieldName = field.slice(0, field.indexOf(":"));
      const fieldData = field.slice(fieldName.length + 1, field.lastIndexOf("\n")).trim();
      switch (fieldName) {
        case "array":
          const framesData = fieldData.split("  - - - ").slice(1);
          for (let fd = 0; fd < framesData.length; fd++) {
            anim.frames.push([]);
            const frameData = framesData[fd];
            const focusFramesData = frameData.split("    - - ");
            for (let tf = 0; tf < focusFramesData.length; tf++) {
              const values = focusFramesData[tf].replace(/      \- /g, "").split("\n");
              const targetFrame = new AnimFrame(
                parseFloat(values[0]),
                parseFloat(values[1]),
                parseFloat(values[2]),
                parseFloat(values[11]),
                parseFloat(values[3]),
                parseInt(values[4]) === 1,
                parseInt(values[6]) === 1,
                parseInt(values[5]),
                parseInt(values[7]),
                parseInt(values[8]),
                parseInt(values[12]),
                parseInt(values[13]),
                parseInt(values[14]),
                parseInt(values[15]),
                parseInt(values[16]),
                parseInt(values[17]),
                parseInt(values[18]),
                parseInt(values[19]),
                parseInt(values[21]),
                parseInt(values[22]),
                parseInt(values[23]),
                parseInt(values[24]),
                parseInt(values[20]) === 1,
                parseInt(values[25]),
                parseInt(values[26]) as AnimFocus,
              );
              anim.frames[fd].push(targetFrame);
            }
          }
          break;
        case "graphic":
          const graphic = fieldData !== "''" ? fieldData : "";
          anim.graphic = graphic.indexOf(".") > -1 ? graphic.slice(0, fieldData.indexOf(".")) : graphic;
          break;
        case "timing":
          const timingEntries = fieldData.split("- !ruby/object:PBAnimTiming ").slice(1);
          for (let t = 0; t < timingEntries.length; t++) {
            const timingData = timingEntries[t]
              .replace(/\n/g, " ")
              .replace(/[ ]{2,}/g, " ")
              .replace(/[a-z]+: ! '', /gi, "")
              .replace(/name: (.*?),/, 'name: "$1",')
              .replace(
                /flashColor: !ruby\/object:Color { alpha: ([\d\.]+), blue: ([\d\.]+), green: ([\d\.]+), red: ([\d\.]+)}/,
                "flashRed: $4, flashGreen: $3, flashBlue: $2, flashAlpha: $1",
              );
            const frameIndex = parseInt(/frame: (\d+)/.exec(timingData)![1]); // TODO: is the bang correct?
            let resourceName = /name: "(.*?)"/.exec(timingData)![1].replace("''", ""); // TODO: is the bang correct?
            const timingType = parseInt(/timingType: (\d)/.exec(timingData)![1]); // TODO: is the bang correct?
            let timedEvent: AnimTimedEvent | undefined;
            switch (timingType) {
              case 0:
                if (resourceName && resourceName.indexOf(".") === -1) {
                  let ext: string | undefined;
                  ["wav", "mp3", "m4a"].every((e) => {
                    if (seNames.indexOf(`${resourceName}.${e}`) > -1) {
                      ext = e;
                      return false;
                    }
                    return true;
                  });
                  if (!ext) {
                    ext = ".wav";
                  }
                  resourceName += `.${ext}`;
                }
                timedEvent = new AnimTimedSoundEvent(frameIndex, resourceName);
                break;
              case 1:
                timedEvent = new AnimTimedAddBgEvent(frameIndex, resourceName.slice(0, resourceName.indexOf(".")));
                break;
              case 2:
                timedEvent = new AnimTimedUpdateBgEvent(frameIndex, resourceName.slice(0, resourceName.indexOf(".")));
                break;
            }
            if (!timedEvent) {
              continue;
            }
            const propPattern = /([a-z]+): (.*?)(?:,|\})/gi;
            let propMatch: RegExpExecArray;
            while ((propMatch = propPattern.exec(timingData)!)) {
              // TODO: is this bang correct?
              const prop = propMatch[1];
              let value: any = propMatch[2];
              switch (prop) {
                case "bgX":
                case "bgY":
                  value = parseFloat(value);
                  break;
                case "volume":
                case "pitch":
                case "opacity":
                case "colorRed":
                case "colorGreen":
                case "colorBlue":
                case "colorAlpha":
                case "duration":
                case "flashScope":
                case "flashRed":
                case "flashGreen":
                case "flashBlue":
                case "flashAlpha":
                case "flashDuration":
                  value = parseInt(value);
                  break;
              }
              if (timedEvent.hasOwnProperty(prop)) {
                timedEvent[prop] = value;
              }
            }
            if (!anim.frameTimedEvents.has(frameIndex)) {
              anim.frameTimedEvents.set(frameIndex, []);
            }
            anim.frameTimedEvents.get(frameIndex)!.push(timedEvent); // TODO: is this bang correct?
          }
          break;
        case "position":
          anim.position = parseInt(fieldData);
          break;
        case "hue":
          anim.hue = parseInt(fieldData);
          break;
      }
    }
  }
}
