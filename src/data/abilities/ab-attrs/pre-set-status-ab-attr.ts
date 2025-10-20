import { AbAttr } from "#abilities/ab-attr";
import type { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export abstract class PreSetStatusAbAttr extends AbAttr {
  /**
   * Applies an effect before the source is afflicted with a status condition.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param effect The {@linkcode StatusEffect} being set
   * @param cancelled A {@linkcode BooleanHolder} which, if true, cancels
   * the effect being set
   */
  public abstract override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _effect: StatusEffect | undefined,
    _cancelled: ValueHolder<boolean>,
  ): void;
}
