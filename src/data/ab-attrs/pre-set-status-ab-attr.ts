import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

export abstract class PreSetStatusAbAttr extends AbAttr {
  /**
   * Applies an effect before the source is afflicted with a status condition.
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param effect The {@linkcode StatusEffect} being set
   * @param cancelled A {@linkcode BooleanHolder} which, if true, cancels
   * the effect being set
   * @returns `true` if the ability applies successfully
   */
  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    _effect: StatusEffect | undefined,
    _cancelled: BooleanHolder,
  ): boolean {
    return false;
  }
}
