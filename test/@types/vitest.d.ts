import type { MoveResult } from "#enums/move-result";
import "vitest";

declare module "vitest" {
  interface Assertion {
    toHaveMoveResult(expected: MoveResult, index?: number): void;
  }
}
