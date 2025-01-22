/** Alias for all {@linkcode BattleScene} events */
export enum BattleSceneEventType {
  /**
   * Triggers when a move is successfully used
   * @see {@linkcode MoveUsedEvent}
   */
  MOVE_USED = "onMoveUsed",
  /**
   * Triggers when a berry gets successfully used
   * @see {@linkcode BerryUsedEvent}
   */
  BERRY_USED = "onBerryUsed",

  /**
   * Triggers at the start of each new encounter
   * @see {@linkcode EncounterPhaseEvent}
   */
  ENCOUNTER_PHASE = "onEncounterPhase",
  /**
   * Triggers on the first turn of a new battle
   * @see {@linkcode TurnInitEvent}
   */
  TURN_INIT = "onTurnInit",
  /**
   * Triggers after a turn ends in battle
   * @see {@linkcode TurnEndEvent}
   */
  TURN_END = "onTurnEnd",

  /**
   * Triggers when a new {@linkcode Arena} is created during initialization
   * @see {@linkcode NewArenaEvent}
   */
  NEW_ARENA = "onNewArena",
}
