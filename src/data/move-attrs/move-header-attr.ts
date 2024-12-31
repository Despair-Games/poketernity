import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Base class defining all Move Header attributes.
 * Move Header effects apply at the beginning of a turn before any moves are resolved.
 * They can be used to apply effects to the field (e.g. queueing a message) or to the user
 * (e.g. adding a battler tag).
 */
export class MoveHeaderAttr extends MoveAttr {
  constructor() {
    super(true);
  }
}
