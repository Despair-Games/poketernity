/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { BattleScene } from "#app/battle-scene";
import type {
  BerryUsedEvent,
  EncounterPhaseEvent,
  GameOverEvent,
  MoveUsedEvent,
  NewArenaEvent,
  TurnEndEvent,
  TurnInitEvent,
} from "#events/battle-scene";
import type { Arena } from "#field/arena";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { ObjectValues } from "#types/utility-types";

/** Alias for all {@linkcode BattleScene} events */
export const BattleSceneEventType = {
  /**
   * Triggers when a move is successfully used
   * @see {@linkcode MoveUsedEvent}
   */
  MOVE_USED: "onMoveUsed",
  /**
   * Triggers when a berry gets successfully used
   * @see {@linkcode BerryUsedEvent}
   */
  BERRY_USED: "onBerryUsed",

  /**
   * Triggers after a run completes via winning or losing (but not through "Save & Quit").
   * @see {@linkcode GameOverEvent}
   */
  POST_GAME_OVER: "onGameOver",

  /**
   * Triggers at the start of each new encounter
   * @see {@linkcode EncounterPhaseEvent}
   */
  ENCOUNTER_PHASE: "onEncounterPhase",
  /**
   * Triggers on the first turn of a new battle
   * @see {@linkcode TurnInitEvent}
   */
  TURN_INIT: "onTurnInit",
  /**
   * Triggers after a turn ends in battle
   * @see {@linkcode TurnEndEvent}
   */
  TURN_END: "onTurnEnd",

  /**
   * Triggers when a new {@linkcode Arena} is created during initialization
   * @see {@linkcode NewArenaEvent}
   */
  NEW_ARENA: "onNewArena",
} as const;

export type BattleSceneEventType = ObjectValues<typeof BattleSceneEventType>;
