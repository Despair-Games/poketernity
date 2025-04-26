import type { AnimConfig, AnimKeyFrame, AnimProp, AnimTimedEvent } from "#app/data/animations/anim-config";
import { easeFunctions } from "#app/data/animations/ease-functions";
import { getEnumValues } from "#app/utils";
import { AnimBlendType } from "#enums/anim-blend-type";
import { MoveId } from "#enums/move-id";
import type { JSONSchemaType } from "ajv";

/**
 * Constructs a {@linkcode JSONSchemaType | Schema} for an array of keyframes
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
function getKeyFrameSetSchema<ValueType>(
  valueSpec: JSONSchemaType<ValueType>,
  easeable: boolean = true,
): JSONSchemaType<AnimKeyFrame<ValueType>[]> {
  const keyframeOptions = {
    /** The duration (in frames) of the tween played for this keyframe */
    duration: {
      type: "integer",
      minimum: 0,
      nullable: true,
    },

    /**
     * The time (in frames) between when the previous keyframe's tween
     * ends and this keyframe's tween begins
     */
    delay: {
      type: "integer",
      minimum: 0,
      nullable: true,
    },

    /**
     * The easing function used to interpolate intermediate values during the tween.
     * @see {@linkcode easeFunctions}
     */
    ease: easeable
      ? {
          type: "string",
          enum: easeFunctions,
          nullable: true,
        }
      : {
          type: "null",
        },
  } as const;

  return {
    type: "array",
    items: {
      type: "object",
      properties: { value: valueSpec, ...keyframeOptions },
      additionalProperties: false,
      required: ["value"],
    },
    minItems: 1,
    nullable: true,
  } as const;
}

/**
 * Schema containing the properties of an asset in an animation.
 * Each individual property is defined with a {@linkcode getKeyFrameSetSchema | set of keyframes}.
 */
const animPropSchema: JSONSchemaType<AnimProp> = {
  type: "object",
  properties: {
    /**
     * For battle animations, the origin point for keyframes is defined
     * along the line connecting the start point ("source") and end point ("target").
     * The `u`-value is the fraction of the distance between the start and end point
     * the origin point is away from the source. If `u = 0`, then the origin point is
     * the source; if `u = 1`, then the origin point is the target.
     */
    u: getKeyFrameSetSchema<number>({
      type: "number",
      minimum: 0,
      maximum: 1,
    }),

    /** The horizontal coordinate relative to the keyframe's origin point. */
    x: getKeyFrameSetSchema<number>({
      type: "number",
    }),

    /**
     * The vertical coordinate relative to the keyframe's origin point.
     * An increase in `y` will move the sprite downward.
     */
    y: getKeyFrameSetSchema<number>({
      type: "number",
    }),

    /** Horizontal scale factor (%) */
    scaleX: getKeyFrameSetSchema<number>({
      type: "number",
      minimum: 0,
    }),

    /** Vertical scale factor (%) */
    scaleY: getKeyFrameSetSchema<number>({
      type: "number",
      minimum: 0,
    }),

    /** The alpha value for the animated sprite, in the range [0, 255] */
    alpha: getKeyFrameSetSchema<number>({
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
    angle: getKeyFrameSetSchema<number>({
      type: "number",
      minimum: -180,
      maximum: 180,
    }),

    /** If `true`, flips the sprite horizontally */
    mirror: getKeyFrameSetSchema<boolean>({ type: "boolean" }, false),

    /** If `false`, hides the sprite */
    visible: getKeyFrameSetSchema<boolean>({ type: "boolean" }, false),

    /**
     * The blend mode to specify how the sprite is rendered on the canvas
     * @see {@link https://docs.phaser.io/api-documentation/constant/blendmodes}
     * @todo
     * - Is this still required?
     * - Should it be a keyframe property?
     */
    blendType: getKeyFrameSetSchema<number>(
      {
        type: "integer",
        enum: getEnumValues(AnimBlendType),
      },
      false,
    ),

    /**
     * If this keyframe is for a graphic, specifies the tile index used
     * for the graphic during the tween. This is only relevant for VFX
     * properties.
     */
    graphicFrame: getKeyFrameSetSchema<number>({ type: "integer" }, false),

    /** A tone to pipeline over the animated sprite (RGBA) */
    tone: getKeyFrameSetSchema<number[]>(
      {
        type: "array",
        items: {
          type: "integer",
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
    priority: getKeyFrameSetSchema<number>(
      {
        type: "integer",
        enum: [0, 1, 3, 5],
      },
      false,
    ),
  },
  required: [],
  additionalProperties: false,
  readonly: true,
  nullable: true,
} as const;

/**
 * Schema for a timed event to play during an animation.
 * This may include a {@linkcode AnimTimedSoundEvent | sound effect}
 * or an {@linkcode AnimTimedAddBgEvent | update to the background image}
 */
const animTimedEventSchema: JSONSchemaType<AnimTimedEvent> = {
  type: "object",
  properties: {
    // Required fields

    /** The type of event to execute. */
    eventType: {
      type: "string",
      enum: ["AnimTimedSoundEvent", "AnimTimedAddBgEvent", "AnimTimedUpdateBgEvent"],
    },

    /** The delay from the start of the animation to the given event (in frames) */
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
      nullable: true,
    },

    /**
     * The pitch of the played sound effect
     * @default 100
     */
    pitch: {
      type: "number",
      default: 100,
      nullable: true,
    },

    // Background Image Event fields

    /** The x-coordinate of the background image */
    bgX: {
      type: "number",
      default: 0,
      nullable: true,
    },

    /** The y-coordinate of the background image */
    bgY: {
      type: "number",
      default: 0,
      nullable: true,
    },

    /** The amount of time the image is displayed (in frames) */
    duration: {
      type: "number",
      /** @todo Should this default be kept? */
      default: 0,
      nullable: true,
    },

    /** Scale factor (%) for the background image */
    scale: {
      type: "number",
      default: 100,
      nullable: true,
    },
  },
  readonly: true,
  nullable: true,
  additionalProperties: false,
  required: ["eventType", "time", "resourceName"],
  if: { properties: { eventType: { const: "AnimTimedSoundEvent" } } },
  then: { required: ["volume", "pitch"] },
  else: { required: ["bgX", "bgY", "duration", "scale"] },
} as const;

/**
 * Schema for the config of a battle animation.
 * {@linkcode animPropSchema | Props} for each asset in the animation
 * are played within a chain of tweens based on
 * the given set of {@linkcode keyFrameSchema | keyframes}.
 * @see {@linkcode AnimConfig}
 */
export const animConfigSchema: JSONSchemaType<AnimConfig> = {
  type: "object",
  properties: {
    /**
     * The {@linkcode MoveId | identifier} for the move
     * associated with the anim (if applicable).
     * This is required for all {@linkcode MoveAnim | MoveAnims}.
     */
    id: {
      type: "integer",
      enum: getEnumValues(MoveId),
      nullable: true,
    },

    /** The name of the tileset used for the animation. */
    graphic: { type: "string", nullable: true },

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
      nullable: true,
    },
  },
  readonly: true,
  additionalProperties: false,
  required: [],
} as const;
