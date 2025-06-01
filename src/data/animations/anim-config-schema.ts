import type { AnimConfig, AnimKeyFrame, AnimProp, AnimTimedEvent } from "#animations/anim-config";
import { easeFunctions } from "#animations/ease-functions";
import { AnimBlendType } from "#enums/anim-blend-type";
import { AnimTimedEventType } from "#enums/anim-timed-event-type";
import { MoveId } from "#enums/move-id";
import { getTSEnumValues } from "#utils/common-utils";
import type { JSONSchemaType } from "ajv";

/** JSON Schema properties applicable to keyframes for any animation property. */
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
} as const;

/**
 * JSON Schema property for the easing specification available for most
 * number-based animation properties.
 */
const easeOption = {
  /**
   * The easing function used to interpolate intermediate values during the tween.
   * @see {@linkcode easeFunctions}
   */
  ease: {
    type: "string",
    enum: easeFunctions,
    nullable: true,
  },
} as const;

/**
 * Generates a JSON Schema for an array of keyframes with number values.
 * @param valueSpec The JSON Schema specification for the "value" property, e.g.
 * ```
 * {
 *   type: "number",
 *   minimum: 0,
 * }
 * ```
 * @returns the {@linkcode JSONSchemaType | Schema} object for the keyframe set
 */
function getNumberKeyFrameSetSchema(valueSpec: JSONSchemaType<number>): JSONSchemaType<AnimKeyFrame<number>[]> {
  return {
    type: "array",
    items: {
      type: "object",
      properties: { value: valueSpec, ...keyframeOptions, ...easeOption },
      additionalProperties: false,
      required: ["value"],
    },
    minItems: 1,
  } as const;
}

/**
 * Generates a JSON Schema for an array of keyframes with boolean values.
 * @param valueSpec The JSON Schema specification for the "value" property, e.g.
 * ```
 * {
 *   type: "boolean",
 * }
 * ```
 * @returns the {@linkcode JSONSchemaType | Schema} object for the keyframe set
 */
function getBooleanKeyFrameSetSchema(valueSpec: JSONSchemaType<boolean>): JSONSchemaType<AnimKeyFrame<boolean>[]> {
  return {
    type: "array",
    items: {
      type: "object",
      /** @todo Remove `easeOption` from this */
      properties: { value: valueSpec, ...keyframeOptions, ...easeOption },
      additionalProperties: false,
      required: ["value"],
    },
    minItems: 1,
  } as const;
}

/**
 * Generates a JSON Schema for an array of keyframes with number array values.
 * @param valueSpec The JSON Schema specification for the "value" property, e.g.
 * ```
 * {
 *   type: "array",
 *   items: { type: "number" },
 *   minItems: 1,
 * }
 * ```
 * @returns the {@linkcode JSONSchemaType | Schema} object for the keyframe set
 */
function getNumberArrayKeyFrameSetSchema(
  valueSpec: JSONSchemaType<number[]>,
): JSONSchemaType<AnimKeyFrame<number[]>[]> {
  return {
    type: "array",
    items: {
      type: "object",
      properties: { value: valueSpec, ...keyframeOptions, ...easeOption },
      additionalProperties: false,
      required: ["value"],
    },
  };
}

/**
 * Schema containing the properties of an asset in an animation.
 * Each individual property is defined with a {@linkcode getKeyFrameSetSchema | set of keyframes}.
 */
const animPropSchema: JSONSchemaType<AnimProp> = {
  type: "object",
  properties: {
    u: getNumberKeyFrameSetSchema({
      type: "number",
      minimum: 0,
      maximum: 1,
    }),

    x: getNumberKeyFrameSetSchema({
      type: "number",
    }),

    y: getNumberKeyFrameSetSchema({
      type: "number",
    }),

    scaleX: {
      ...getNumberKeyFrameSetSchema({
        type: "number",
        minimum: 0,
      }),
      nullable: true,
    },

    scaleY: {
      ...getNumberKeyFrameSetSchema({
        type: "number",
        minimum: 0,
      }),
      nullable: true,
    },

    alpha: {
      ...getNumberKeyFrameSetSchema({
        type: "number",
        minimum: 0,
        maximum: 255,
      }),
      nullable: true,
    },

    angle: {
      ...getNumberKeyFrameSetSchema({
        type: "number",
        minimum: -180,
        maximum: 180,
      }),
      nullable: true,
    },

    mirror: {
      ...getBooleanKeyFrameSetSchema({ type: "boolean" }),
      nullable: true,
    },

    visible: {
      ...getBooleanKeyFrameSetSchema({ type: "boolean" }),
      nullable: true,
    },

    blendType: {
      ...getNumberKeyFrameSetSchema({
        type: "integer",
        enum: Object.values(AnimBlendType),
      }),
      nullable: true,
    },

    graphicFrame: {
      ...getNumberKeyFrameSetSchema({ type: "integer" }),
      nullable: true,
    },

    tone: {
      ...getNumberArrayKeyFrameSetSchema({
        type: "array",
        items: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        minItems: 3,
        maxItems: 4,
      }),
      nullable: true,
    },

    priority: {
      ...getNumberKeyFrameSetSchema({
        type: "integer",
        enum: [0, 1, 3, 5],
      }),
      nullable: true,
    },
  },
  required: ["u", "x", "y"],
  additionalProperties: false,
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

    eventType: {
      type: "string",
      enum: Object.values(AnimTimedEventType),
    },

    time: {
      type: "number",
      minimum: 0,
    },

    resourceName: { type: "string" },

    // Timed Sound Event fields

    volume: {
      type: "number",
      default: 100,
      minimum: 0,
      nullable: true,
    },

    pitch: {
      type: "number",
      default: 100,
      minimum: 0,
      nullable: true,
    },

    // Background Image Event fields

    bgX: {
      type: "number",
      default: 0,
      nullable: true,
    },

    bgY: {
      type: "number",
      default: 0,
      nullable: true,
    },

    duration: {
      type: "number",
      nullable: true,
    },

    scale: {
      type: "number",
      default: 100,
      nullable: true,
    },
  },
  nullable: true,
  additionalProperties: false,
  required: ["eventType", "time", "resourceName"],
  if: { properties: { eventType: { const: "AnimTimedSoundEvent" } } },
  // biome-ignore lint/suspicious/noThenProperty: `then` is a JSON Schema keyword - https://ajv.js.org/json-schema.html#if-then-else
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
    moveId: {
      type: "integer",
      enum: getTSEnumValues(MoveId),
      nullable: true,
    },

    // The name of the tileset used for the animation.
    graphic: { type: "string", nullable: true },

    sourceProperties: { ...animPropSchema, nullable: true },

    targetProperties: { ...animPropSchema, nullable: true },

    vfxProperties: { ...animPropSchema, nullable: true },

    timedEvents: {
      type: "array",
      items: animTimedEventSchema,
      minItems: 1,
      nullable: true,
    },
  },
  additionalProperties: false,
  required: [],
} as const;
