import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Applies {@linkcode BattlerTagType.DESTINY_BOND} to the user.
 *
 * @extends MoveEffectAttr
 */
export class DestinyBondAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
  }

  /**
   * Applies {@linkcode BattlerTagType.DESTINY_BOND} to the user.
   * @param user {@linkcode Pokemon} that is having the tag applied to.
   * @param _target {@linkcode Pokemon} N/A
   * @param move {@linkcode Move} {@linkcode Move.DESTINY_BOND}
   * @param _args N/A
   * @returns true
   */
  override apply(user: Pokemon, _target: Pokemon, move: Move, _args: any[]): boolean {
    globalScene.queueMessage(
      `${i18next.t("moveTriggers:tryingToTakeFoeDown", { pokemonName: getPokemonNameWithAffix(user) })}`,
    );
    user.addTag(BattlerTagType.DESTINY_BOND, undefined, move.id, user.id);
    return true;
  }
}
