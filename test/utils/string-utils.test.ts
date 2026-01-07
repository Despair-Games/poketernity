import { stringifyEnumArray } from "#test/test-utils/string-utils";
import type { EnumOrObject } from "#types/utility-types";
import { __INTERNAL_TEST_EXPORTS, leftPad, toCamelCase } from "#utils/string-utils";
import { describe, expect, it } from "vitest";

const { splitWords } = __INTERNAL_TEST_EXPORTS;

describe("Utils - String Utils", () => {
  describe("leftPad", () => {
    it("should return a string", () => {
      const result = leftPad(1, 10);
      expect(typeof result).toBe("string");
    });

    it("should return a padded result with default padWith", () => {
      const result = leftPad(1, 3);
      expect(result).toBe("001");
    });

    it("should return a padded result using a custom padWith", () => {
      const result = leftPad(1, 10, "yes");
      expect(result).toBe("yesyesyes1");
    });

    it("should return inputted value when zero length is entered", () => {
      const result = leftPad(1, 0);
      expect(result).toBe("1");
    });
  });
});

describe("Utils - Strings", () => {
  describe("Casing", () => {
    describe("splitWords", () => {
      interface TestCase {
        input: string;
        words: string[];
      }

      const testCases: TestCase[] = [
        {
          input: "Lorem ipsum dolor sit amet",
          words: ["Lorem", "ipsum", "dolor", "sit", "amet"],
        },
        {
          input: "consectetur-adipiscing-elit",
          words: ["consectetur", "adipiscing", "elit"],
        },
        {
          input: "sed_do_eiusmod_tempor_incididunt_ut_labore",
          words: ["sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore"],
        },
        {
          input: "Et Dolore Magna Aliqua",
          words: ["Et", "Dolore", "Magna", "Aliqua"],
        },
        {
          input: "BIG_ANGRY_TRAINER",
          words: ["BIG", "ANGRY", "TRAINER"],
        },
        {
          input: "ApplesBananasOrangesAndAPear",
          words: ["Apples", "Bananas", "Oranges", "And", "A", "Pear"],
        },
        {
          input: "mysteryEncounters/anOfferYouCantRefuse",
          words: ["mystery", "Encounters/an", "Offer", "You", "Cant", "Refuse"],
        },
      ];

      it.each(testCases)("should split a string into its constituent words - $input", ({ input, words }) => {
        const ret = splitWords(input);
        expect(ret).toEqual(words);
      });
    });

    describe("toCamelCase", () => {
      const testCases: { input: string; output: string }[] = [
        {
          input: "Lorem ipsum dolor sit amet",
          output: "loremIpsumDolorSitAmet",
        },
        {
          input: "consectetur-adipiscing-elit",
          output: "consecteturAdipiscingElit",
        },
        {
          input: "sed_do_eiusmod_tempor_incididunt_ut_labore",
          output: "sedDoEiusmodTemporIncididuntUtLabore",
        },
        {
          input: "Et Dolore Magna Aliqua",
          output: "etDoloreMagnaAliqua",
        },
        {
          input: "BIG_ANGRY_TRAINER",
          output: "bigAngryTrainer",
        },
        {
          input: "ApplesBananasOrangesAndAPear",
          output: "applesBananasOrangesAndAPear",
        },
        {
          input: "mysteryEncounters/anOfferYouCantRefuse",
          output: "mysteryEncounters/anOfferYouCantRefuse",
        },
      ];

      it.each(testCases)("should convert a string to camelCase - $input", ({ input, output }) => {
        const ret = toCamelCase(input);
        expect(ret).toEqual(output);
      });
    });
  });

  describe("Utils - Enums", () => {
    enum testEnumNum {
      testN1 = 1,
      testN2 = 2,
    }

    enum testEnumString {
      testS1 = "apple",
      testS2 = "banana",
    }

    const testObjNum = { testON1: 3, testON2: 4 } as const;

    const testObjString = { testOS1: "pear", testOS2: "orange" } as const;

    const testHexObj = {
      XA1: 0x00a1,
      ABCD: 0xabcd,
      FFFD: 0xfffd,
    } as const;

    describe("stringifyEnumArray", () => {
      const cases = [
        {
          obj: testEnumNum,
          values: [testEnumNum.testN1, testEnumNum.testN2],
          output: "[testN1, testN2] (=[1, 2])",
          type: "numeric enum",
        },
        {
          obj: testEnumString,
          values: [testEnumString.testS1, testEnumString.testS2],
          output: "[testS1, testS2] (=[apple, banana])",
          type: "string enum",
        },
        {
          obj: testObjNum,
          values: [testObjNum.testON1, testObjNum.testON2],
          output: "[testON1, testON2] (=[3, 4])",
          type: "numeric const object",
        },
        {
          obj: testObjString,
          values: [testObjString.testOS1, testObjString.testOS2],
          output: "[testOS1, testOS2] (=[pear, orange])",
          type: "string const object",
        },
      ] as { obj: EnumOrObject; values: (string | number)[]; output: string; type: string }[];
      it.each(cases)("should stringify an array of enums or const objects - $type", ({ obj, values, output }) => {
        const ret = stringifyEnumArray(obj, values, { excludeValues: false });
        expect(ret).toEqual(output);
      });

      it("should work if no values provided", () => {
        const ret = stringifyEnumArray(testEnumNum, []);
        expect(ret).toEqual("[]");
      });

      it("should allow excluding values from result, defaulting to doing so for string enums", () => {
        const num = stringifyEnumArray(testEnumNum, [testEnumNum.testN1, testEnumNum.testN2], { excludeValues: true });
        expect(num).toEqual("[testN1, testN2]");

        const str = stringifyEnumArray(testEnumString, [testEnumString.testS1, testEnumString.testS2]);
        expect(str).toEqual("[testS1, testS2]");
      });

      it("should support custon formatting args", () => {
        const ret = stringifyEnumArray(testHexObj, [testHexObj.ABCD, testHexObj.FFFD, testHexObj.XA1], {
          base: 16,
          casing: "Title",
          prefix: "testHexObj.",
          suffix: " blah",
          padding: 5,
        });
        expect(ret).toEqual(
          "[testHexObj.Abcd blah, testHexObj.Fffd blah, testHexObj.Xa1 blah] (=[0x0ABCD, 0x0FFFD, 0x000A1])",
        );
      });

      it("should type correctly", () => {
        // @ts-expect-error - value props should not be providable if values aren't being included
        stringifyEnumArray(testEnumNum, [testEnumNum.testN1], { excludeValues: true, base: 10 });
        stringifyEnumArray(testEnumNum, [testEnumNum.testN1], { base: 10 });
        stringifyEnumArray(testEnumNum, [testEnumNum.testN1], { excludeValues: true, prefix: "12" });

        // @ts-expect-error - value props should not be providable if values aren't being included
        stringifyEnumArray(testEnumString, [testEnumString.testS1], { excludeValues: true, base: 10 });
        // @ts-expect-error - should not be able to specify base on string enum
        stringifyEnumArray(testEnumString, [testEnumString.testS1], { excludeValues: false, base: 10 });
        stringifyEnumArray(testEnumString, [testEnumString.testS1], { excludeValues: true, suffix: "23" });
      });
    });
  });
});
