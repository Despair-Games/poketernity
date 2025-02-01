import { BattleSceneEventType } from "#enums/battle-scene-event-type";
import type { Move } from "../data/move";
import type { BerryModifier } from "../modifier/modifier";

/**
 * Container class for {@linkcode BattleSceneEventType.MOVE_USED} events
 * @extends Event
 */
export class MoveUsedEvent extends Event {
  /** The ID of the {@linkcode Pokemon} that used the {@linkcode Move} */
  public pokemonId: number;
  /** The {@linkcode Move} used */
  public move: Move;
  /** The amount of PP used on the {@linkcode Move} this turn */
  public ppUsed: number;
  constructor(userId: number, move: Move, ppUsed: number) {
    super(BattleSceneEventType.MOVE_USED);

    this.pokemonId = userId;
    this.move = move;
    this.ppUsed = ppUsed;
  }
}
/**
 * Container class for {@linkcode BattleSceneEventType.BERRY_USED} events
 * @extends Event
 */
export class BerryUsedEvent extends Event {
  /** The {@linkcode BerryModifier} being used */
  public berryModifier: BerryModifier;
  constructor(berry: BerryModifier) {
    super(BattleSceneEventType.BERRY_USED);

    this.berryModifier = berry;
  }
}

/**
 * Container class for {@linkcode BattleSceneEventType.ENCOUNTER_PHASE} events
 * @extends Event
 */
export class EncounterPhaseEvent extends Event {
  constructor() {
    super(BattleSceneEventType.ENCOUNTER_PHASE);
  }
}
/**
 * Container class for {@linkcode BattleSceneEventType.TURN_INIT} events
 * @extends Event
 */
export class TurnInitEvent extends Event {
  constructor() {
    super(BattleSceneEventType.TURN_INIT);
  }
}
/**
 * Container class for {@linkcode BattleSceneEventType.TURN_END} events
 * @extends Event
 */
export class TurnEndEvent extends Event {
  /** The amount of turns in the current battle */
  public turnCount: number;
  constructor(turnCount: number) {
    super(BattleSceneEventType.TURN_END);

    this.turnCount = turnCount;
  }
}
/**
 * Container class for {@linkcode BattleSceneEventType.NEW_ARENA} events
 * @extends Event
 */
export class NewArenaEvent extends Event {
  constructor() {
    super(BattleSceneEventType.NEW_ARENA);
  }
}
