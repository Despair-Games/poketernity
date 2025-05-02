import { animConfigSchema } from "#app/data/animations/anim-config-schema";
import { AnimBlendType } from "#enums/anim-blend-type";
import { MoveId } from "#enums/move-id";
import Ajv from "ajv";
import { describe, expect, it } from "vitest";

describe("Animations - Schema", () => {
  const ajv = new Ajv({
    allErrors: true,
    allowUnionTypes: true,
  });

  const validate = ajv.compile(animConfigSchema);

  it("should accept configs with a fully defined source property", async () => {
    const validConfig = {
      moveId: MoveId.TACKLE,
      graphic: "003-Attack01.png",
      sourceProperties: {
        u: [
          {
            value: 0,
            duration: 0,
            delay: 0,
            ease: "Linear",
          },
          {
            value: 1,
            duration: 10,
            delay: 0,
            ease: "Sine.easeInOut",
          },
        ],

        x: [
          {
            value: 10,
            duration: 0,
            delay: 0,
            ease: "Linear",
          },
        ],

        y: [
          {
            value: 20,
            duration: 0,
            delay: 10,
            ease: "Linear",
          },
        ],

        scaleX: [
          {
            value: 100,
            duration: 10,
            delay: 0,
            ease: "Linear",
          },
        ],

        scaleY: [
          {
            value: 1,
            duration: 0,
            delay: 0,
            ease: "Stepped",
          },
        ],

        alpha: [
          {
            value: 255,
            duration: 0,
            delay: 0,
            ease: "Circ.easeIn",
          },
        ],

        angle: [
          {
            value: 90,
            duration: 0,
            delay: 0,
            ease: "Linear",
          },
        ],

        mirror: [
          {
            value: true,
            duration: 0,
            delay: 10,
            // Normally ease is ignored for boolean and enum properties,
            // but this is just included for completeness.
            ease: "Linear",
          },
        ],

        visible: [
          {
            value: true,
            duration: 0,
            delay: 0,
            ease: "Stepped",
          },
        ],

        blendType: [
          {
            value: AnimBlendType.NORMAL,
            duration: 0,
            delay: 0,
            ease: "Stepped",
          },
        ],

        graphicFrame: [
          {
            value: 1,
            duration: 0,
            delay: 10,
            // This is also normally ignored
            ease: "Linear",
          },
        ],

        tone: [
          {
            value: [1, 0, 0, 1],
            duration: 100,
            delay: 0,
            ease: "Sine.easeIn",
          },
        ],

        priority: [
          {
            value: 1,
            duration: 0,
            delay: 100,
            // This is also normally ignored
            ease: "Stepped",
          },
        ],
      },
      /**
       * `targetProperties` and `vfxProperties` are omitted, but the config
       * should still be valid since all prop sets are optional.
       * Similarly, `timedEvents` should not be required.
       */
    };

    const result = validate(validConfig);
    expect(result, `${validate.errors?.map((err) => err.message)}`).toBeTruthy();
  });

  it("should accept configs with partially defined properties", async () => {
    const validPartialConfig = {
      moveId: MoveId.TACKLE,
      graphic: "003-Attack01.png",

      sourceProperties: {
        u: [
          {
            value: 0.5,
            duration: 100,
            // delay, ease omitted
          },
        ],

        x: [
          {
            value: 10,
            duration: 100,
            ease: "Sine.easeInOut",
          },
          {
            value: 20,
            duration: 50,
            delay: 10,
            ease: "Linear",
          },
        ],

        y: [
          {
            value: 1,
            duration: 1,
            delay: 1,
          },
        ],

        scaleX: [
          {
            value: 50,
            delay: 50,
          },
        ],
      },

      timedEvents: [
        {
          eventType: "AnimTimedSoundEvent",
          time: 10,
          resourceName: "PRSFX- Tackle.wav",
          volume: 50,
          pitch: 100,
        },
      ],
    };

    const result = validate(validPartialConfig);
    expect(result, `${validate.errors?.map((err) => err.message)}`).toBeTruthy();
  });

  it("should not accept configs with unrecognized fields", async () => {
    const invalidConfig = {
      moveId: MoveId.TACKLE,
      graphic: "003-Attack01.png",

      // This is intentionally misspelled
      sorceProperties: {
        u: [
          {
            value: 1,
            duration: 0,
          },
        ],

        x: [{ value: 0 }],

        y: [{ value: 1 }],
      },
    };

    const result = validate(invalidConfig);
    expect(result).toBeFalsy();
  });

  it("should not accept configs with invalid property values", async () => {
    const invalidConfig = {
      moveId: MoveId.TACKLE,
      graphic: "003-Attack01.png",

      sourceProperties: {
        u: [
          {
            // U-value must be in the range [0, 1]
            value: 2,
            duration: 100,
            ease: "Linear",
          },
        ],

        x: [{ value: 0 }],

        y: [{ value: 0 }],
      },
    };

    const result = validate(invalidConfig);
    expect(result).toBeFalsy();
  });
});
