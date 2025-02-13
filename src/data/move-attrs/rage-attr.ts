import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Rage_(move) | Rage}.
 * If the user is attacked while rage is active they will gain +1 atk boost.
 * @extends MoveEffectAttr
 */
export class RageAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
  }

  override applyEffect(user: Pokemon, _target: Pokemon, move: Move): boolean {
    globalScene.queueMessage(
      `${i18next.t("moveTriggers:rageIsBuilding", { pokemonName: getPokemonNameWithAffix(user) })}`,
    );
    user.addTag(BattlerTagType.RAGE, undefined, move.id, user.id);
    return true;
  }
}
