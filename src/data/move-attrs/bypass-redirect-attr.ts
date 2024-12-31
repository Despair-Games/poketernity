import { MoveAttr } from "#app/data/move-attrs/move-attr";

/**
 * Attribute used for moves which ignore redirection effects, and always target their original target, i.e. Snipe Shot
 * Bypasses Storm Drain, Follow Me, Ally Switch, and the like.
 */
export class BypassRedirectAttr extends MoveAttr {
  /** `true` if this move only bypasses redirection from Abilities */
  public readonly abilitiesOnly: boolean;

  constructor(abilitiesOnly: boolean = false) {
    super();
    this.abilitiesOnly = abilitiesOnly;
  }
}
