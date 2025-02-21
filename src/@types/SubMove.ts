import type { Move } from "#app/data/move";

export type SubMove = new (...args: any[]) => Move;
