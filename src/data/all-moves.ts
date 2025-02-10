import { type Move } from "#app/data/move";
import { type MoveId } from "#enums/move-id";

//#region Type

export type AllMoves = {
  [moveId in MoveId]: Move;
};

// Initialized as being empty; it will be filled during `initMoves()`
export const allMoves: AllMoves = {} as AllMoves;
