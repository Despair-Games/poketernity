import { MockText } from "#test/test-utils/mocks/mocks-container/mock-text";

export class MockBBCodeText extends MockText {
  setWrapMode(_mode: 0 | 1 | 2 | 3 | "none" | "word" | "char" | "character" | "mix") {}
}
