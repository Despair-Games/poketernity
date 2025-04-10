// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AnimConfig, AnimTimedSoundEvent, AnimTimedAddBgEvent } from "#app/data/animations/anim-config";
import { easeFunctions } from "#app/data/animations/ease-functions";
import type { MoveAnim } from "#app/data/animations/move-anim";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

import { AnimBlendType } from "#enums/anim-blend-type";
import { AnimFrameTargets } from "#enums/anim-frame-target";
import { MoveId } from "#enums/move-id";
import type { Schema } from "ajv";

/**
 * Schema for a single keyframe of an animated object.
 * All properties in this schema are optional; if a property is
 * not included in a keyframe, the property is assumed to be the same as
 * the previous keyframe's matching property.
 */
const keyFrameSchema: Schema = {
  type: "object",
  properties: {
    /**
     * For battle animations, the origin point for keyframes is defined
     * along the line connecting the start point ("source") and end point ("target").
     * The `u`-value is the fraction of the distance between the start and end point
     * the origin point is away from the source. If `u = 0`, then the origin point is
     * the source; if `u = 1`, then the origin point is the target.
     */
    u: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },

    /**
     * The horizontal coordinate relative to the keyframe's origin point. An ease function can
     * also be specified for horizontal movement, e.g.
     * ```
     * x: {
     *  value: 100,
     *  ease: "Sine.easeIn"
     * }
     * ```
     */
    x: {
      type: ["number", "object"],
      properties: {
        value: { type: "number" },
        ease: { enum: easeFunctions },
      },
    },

    /**
     * The vertical coordinate relative to the keyframe's origin point.
     * An increase in `y` will move the sprite downward.
     * An ease function can also be specified for vertical movement, e.g.
     * ```
     * y: {
     *  value: 100,
     *  ease: "Sine.easeIn"
     * }
     * ```
     */
    y: {
      type: ["number", "object"],
      properties: {
        value: { type: "number" },
        ease: { enum: easeFunctions },
      },
    },

    /** Horizontal scale factor (%) */
    scaleX: {
      type: "number",
      minimum: 0,
    },

    /** Vertical scale factor (%) */
    scaleY: {
      type: "number",
      minimum: 0,
    },

    /**
     * The rotation angle of the sprite in degrees.
     * Phaser uses a right-hand clockwise rotation system, where 0 is right,
     * 90 is down, and -90 is up. The value of this should be in the interval
     * [-180, 180].
     */
    angle: {
      type: "number",
      minimum: -180,
      maximum: 180,
    },

    /** If `true`, flips the sprite horizontally */
    mirror: { type: "boolean" },

    /** If `false`, hides the sprite */
    visible: { type: "boolean" },

    /**
     * The blend mode to specify how the sprite is rendered on the canvas
     * @see {@link https://docs.phaser.io/api-documentation/constant/blendmodes}
     */
    blendType: { enum: Object.values(AnimBlendType) },

    /**
     * If this keyframe is for a graphic, specifies the tile index used
     * for the graphic during the tween
     * @todo Should this be decoupled from keyframes?
     */
    graphicFrame: { type: "number" },

    /** The alpha value for the animated sprite, in the range [0, 255] */
    alpha: {
      type: "number",
      minimum: 0,
      maximum: 255,
    },

    /** A tone to pipeline over the animated sprite (RGBA) */
    tone: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 255,
      },
      minItems: 3,
      maxItems: 4,
    },

    /**
     * The z-depth of the animated sprite during the tween
     * - 0 is behind all other sprites (except BG)
     * - 1 is on top of player field
     * - 3 is on top of both fields
     * - 5 is on top of player sprite
     */
    priority: {
      enum: [0, 1, 3, 5],
    },

    /** The duration of the tween for this keyframe (ms) */
    duration: { type: "number" },

    /** The delay (ms) before playing the tween for this keyframe */
    delay: { type: "number" },

    /**
     * The ease function applied to the tween for this keyframe.
     * @see {@link https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ease-function/#get-ease-function-via-string | Ease Functions}
     */
    ease: {
      enum: easeFunctions,
      default: "Linear",
    },
  },
};

/**
 * Schema for the animation properties of an object.
 * This specifies the property's {@linkcode AnimFrameTargets | focus}
 * and contains the {@linkcode keyFrameSchema | keyframes} applied
 * to the focus.
 */
const animPropSchema: Schema = {
  type: "object",
  properties: {
    /**
     * The type of sprite affected by the animation
     * @see {@linkcode AnimFrameTargets}
     */
    focus: { enum: Object.values(AnimFrameTargets) },

    /**
     * The keyframes used to animate the sprite.
     * The first keyframe is treated as the initial location
     * for the affected sprite.
     * @see {@linkcode keyFrameSchema}
     */
    keyFrames: {
      type: "array",
      items: keyFrameSchema,
      minItems: 1,
    },
  },
  required: ["focus", "keyframes"],
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
  },
  required: ["time", "resourceName"],
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
     * Contains all properties applied during the animation.
     * @see {@linkcode animPropSchema}
     */
    props: {
      type: "array",
      items: animPropSchema,
      minItems: 1,
    },

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
