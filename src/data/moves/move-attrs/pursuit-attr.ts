import type { TurnCommandManager } from "#app/turn-command-manager";
import type { PursuingTag } from "#battler-tags/pursuing-battler-tag";
import { MoveAttr } from "#moves/move-attr";

/**
 * Attribute for moves that allow the user to attack an opposing Pokemon before it
 * switches out, i.e. {@link https://bulbapedia.bulbagarden.net/wiki/Pursuit_(move) | Pursuit}. \
 * When attacking a retreating target, moves with this attribute double in power.
 * @see {@linkcode TurnCommandManager.tryPursueTarget}
 * @see {@linkcode PursuingTag}
 */
export class PursuitAttr extends MoveAttr {}
