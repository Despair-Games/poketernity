import type { Move } from "#app/data/moves/move";

export type SubMove = new (...args: any[]) => Move;
