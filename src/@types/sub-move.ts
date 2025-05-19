import type { Move } from "#moves/move";

export type SubMove = new (...args: any[]) => Move;
