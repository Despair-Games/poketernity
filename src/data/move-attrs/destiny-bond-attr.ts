import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Destiny_Bond_(move) Destiny Bond}.
 * If the user faints while Destiny Bond is in effect, the user
 * takes the attacker down with it.
 * @extends MoveEffectAttr
 */
export class DestinyBondAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
  }

  override apply(user: Pokemon, _target: Pokemon, move: Move): boolean {
    globalScene.queueMessage(
      `${i18next.t("moveTriggers:tryingToTakeFoeDown", { pokemonName: getPokemonNameWithAffix(user) })}`,
    );
    user.addTag(BattlerTagType.DESTINY_BOND, undefined, move.id, user.id);
    return true;
  }
}
