// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AnimConfig } from "#app/data/animations/anim-config";
// -- end tsdoc imports --

import { AnimBlendType } from "#enums/anim-blend-type";
import { AnimFrameTarget } from "#enums/anim-frame-target";
import { MoveId } from "#enums/move-id";
import { type Schema } from "jsonschema";

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
        ease: { type: "string" }, // TODO: can this be more specific to Phaser's ease functions?
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
        ease: { type: "string" }, // TODO: can this be more specific to Phaser's ease functions?
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
      minLength: 3,
      maxLength: 4,
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
      type: "string",
      default: "Linear",
    },
  },
};

const animPropSchema: Schema = {
  type: "object",
  properties: {
    /**
     * The type of sprite affected by the animation
     * @see {@linkcode AnimFrameTarget}
     */
    focus: { enum: Object.values(AnimFrameTarget) },
    /**
     * The keyframes used to animate the sprite
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

const animTimedEventSchema: Schema = {};

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
    id: { enum: Object.values(MoveId) },
    graphic: { type: "string" },
    props: {
      type: "array",
      items: animPropSchema,
      minLength: 1,
    },
    timedEvents: {
      type: "array",
      items: animTimedEventSchema,
      minLength: 1,
    },
  },
  required: ["props"],
};
