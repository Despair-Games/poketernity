// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type AnimConfig,
  type AnimTimedSoundEvent,
  type AnimTimedAddBgEvent,
  AnimFrame,
} from "#app/data/animations/anim-config";
import { easeFunctions } from "#app/data/animations/ease-functions";
import type { MoveAnim } from "#app/data/animations/move-anim";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { AnimBlendType } from "#enums/anim-blend-type";
import { MoveId } from "#enums/move-id";
import type { Schema } from "ajv";

/**
 * Constructs a {@linkcode Schema} for an array of keyframes
 * with the provided specification for `value`
 * @param valueSpec - An object containing the JSON Schema specification for a
 * `value` property, e.g.
 * ```ts
 * {
 *   type: "number",
 *   minimum: 0
 * }
 * ```
 * @param easeable - Does this property have intermediate values that are interpolated
 * with an {@linkcode easeFunctions | ease function}? (default `true`)
 */
function getKeyFrameSetSchema(valueSpec: Schema, easeable: boolean = true): Schema {
  const keyframeOptions = {
    /** The duration (in frames) of the tween played for this keyframe */
    duration: {
      type: "integer",
      minimum: 0,
    },

    /**
     * The time (in frames) between when the previous keyframe's tween
     * ends and this keyframe's tween begins
     */
    delay: {
      type: "integer",
      minimum: 0,
    },
  };

  const easeOption = {
    /**
     * The easing function used to interpolate intermediate values during the tween.
     * @see {@linkcode easeFunctions}
     */
    ease: { enum: easeFunctions },
  };
  const ease = easeable ? easeOption : {};

  return {
    type: "array",
    items: {
      type: "object",
      properties: { value: valueSpec, ...keyframeOptions, ...ease },
      required: ["value"],
    },
    nullable: true,
  };
}

/**
 * Schema for a single property of an animated object.
 * This specifies the property's {@linkcode AnimFrameTargets | focus}
 * and contains the {@linkcode keyFrameSchema | keyframes} applied
 * to the focus.
 */
const animPropSchema: Schema = {
  type: "object",
  properties: {
    /**
     * For battle animations, the origin point for keyframes is defined
     * along the line connecting the start point ("source") and end point ("target").
     * The `u`-value is the fraction of the distance between the start and end point
     * the origin point is away from the source. If `u = 0`, then the origin point is
     * the source; if `u = 1`, then the origin point is the target.
     */
    u: getKeyFrameSetSchema({
      type: "number",
      minimum: 0,
      maximum: 1,
    }),

    /** The horizontal coordinate relative to the keyframe's origin point. */
    x: getKeyFrameSetSchema({
      type: "number",
    }),

    /**
     * The vertical coordinate relative to the keyframe's origin point.
     * An increase in `y` will move the sprite downward.
     */
    y: getKeyFrameSetSchema({
      type: "number",
    }),

    /** Horizontal scale factor (%) */
    scaleX: getKeyFrameSetSchema({
      type: "number",
      minimum: 0,
    }),

    /** Vertical scale factor (%) */
    scaleY: getKeyFrameSetSchema({
      type: "number",
      minimum: 0,
    }),

    /** The alpha value for the animated sprite, in the range [0, 255] */
    alpha: getKeyFrameSetSchema({
      type: "number",
      minimum: 0,
      maximum: 255,
    }),

    /**
     * The rotation angle of the sprite in degrees.
     * Phaser uses a right-hand clockwise rotation system, where 0 is right,
     * 90 is down, and -90 is up. The value of this should be in the interval
     * [-180, 180].
     */
    angle: getKeyFrameSetSchema({
      type: "number",
      minimum: -180,
      maximum: 180,
    }),

    /** If `true`, flips the sprite horizontally */
    mirror: getKeyFrameSetSchema({ type: "boolean" }, false),

    /** If `false`, hides the sprite */
    visible: getKeyFrameSetSchema({ type: "boolean" }, false),

    /**
     * The blend mode to specify how the sprite is rendered on the canvas
     * @see {@link https://docs.phaser.io/api-documentation/constant/blendmodes}
     * @todo
     * - Is this still required?
     * - Should it be a keyframe property?
     */
    blendType: getKeyFrameSetSchema({ enum: Object.values(AnimBlendType) }, false),

    /**
     * If this keyframe is for a graphic, specifies the tile index used
     * for the graphic during the tween. This is only relevant for VFX
     * properties.
     */
    graphicFrame: getKeyFrameSetSchema({ type: "integer" }, false),

    /** A tone to pipeline over the animated sprite (RGBA) */
    tone: getKeyFrameSetSchema(
      {
        type: "array",
        items: {
          type: "number",
          minimum: 0,
          maximum: 255,
        },
        minItems: 3,
        maxItems: 4,
      },
      false,
    ),

    /**
     * The z-depth of the animated sprite during the tween
     * - 0 is behind all other sprites (except BG)
     * - 1 is on top of player field
     * - 3 is on top of both fields
     * - 5 is on top of player sprite
     */
    priority: getKeyFrameSetSchema({ enum: [0, 1, 3, 5] }, false),
  },
};

/**
 * Schema for a timed event to play during an animation.
 * This may include a {@linkcode AnimTimedSoundEvent | sound effect}
 * or an {@linkcode AnimTimedAddBgEvent | update to the background image}
 */
const animTimedEventSchema: Schema = {
  type: "object",
  properties: {
    // Required fields

    /** The type of event to execute. */
    eventType: {
      enum: ["AnimTimedSoundEvent", "AnimTimedAddBgEvent", "AnimTimedUpdateBgEvent"],
    },

    /** The delay from the start of the animation to the given event (ms) */
    time: {
      type: "number",
      minimum: 0,
    },

    resourceName: { type: "string" },

    // Timed Sound Event fields

    /**
     * The volume of the played sound effect
     * @default 100
     */
    volume: {
      type: "number",
      default: 100,
    },

    /**
     * The pitch of the played sound effect
     * @default 100
     */
    pitch: {
      type: "number",
      default: 100,
    },

    // Background Image Event fields

    /** The x-coordinate of the background image */
    bgX: {
      type: "number",
      default: 0,
    },

    /** The y-coordinate of the background image */
    bgY: {
      type: "number",
      default: 0,
    },

    /** The amount of time the image is displayed (ms) */
    duration: {
      type: "number",
      /** @todo Should this default be kept? */
      default: 0,
    },

    /** Scale factor (%) for the background image */
    scale: {
      type: "number",
      default: 100,
    },
  },
  required: ["time", "resourceName"],
  if: { properties: { eventType: { enum: ["AnimTimedSoundEvent"] } } },
  then: { required: ["volume", "pitch"] },
  else: { required: ["bgX", "bgY", "duration", "scale"] },
};

/**
 * Schema for the config of a battle animation.
 * {@linkcode animPropSchema | Props} for each asset in the animation
 * are played within a chain of tweens based on
 * the given set of {@linkcode keyFrameSchema | keyframes}.
 * @see {@linkcode AnimConfig}
 */
export const animConfigSchema: Schema = {
  type: "object",
  properties: {
    /**
     * The {@linkcode MoveId | identifier} for the move
     * associated with the anim (if applicable).
     * This is required for all {@linkcode MoveAnim | MoveAnims}.
     */
    id: { enum: Object.values(MoveId) },

    /**
     * The name of the tileset used for the animation.
     * @todo Should this be required?
     */
    graphic: { type: "string" },

    /**
     * Contains all properties applied to the sprite of the
     * "source" object (e.g. the {@linkcode Pokemon} using a move)
     * @see {@linkcode animPropSchema}
     */
    sourceProperties: animPropSchema,

    /**
     * Contains all properties applied to the sprite of the
     * "target" object (e.g. the {@linkcode Pokemon} attacked by a move)
     * @see {@linkcode animPropSchema}
     */
    targetProperties: animPropSchema,

    /**
     * Contains all properties applied to the animation's VFX
     * @see {@linkcode animPropSchema}
     */
    vfxProperties: animPropSchema,

    /**
     * Contains all timed events played during the animation.
     * @see {@linkcode animTimedEventSchema}
     */
    timedEvents: {
      type: "array",
      items: animTimedEventSchema,
      minItems: 1,
    },
  },
  required: ["props"],
};
