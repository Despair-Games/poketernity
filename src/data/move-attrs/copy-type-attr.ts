import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to change the user's type to match the target's type(s).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Reflect_Type_(move) Reflect Type}.
 * @extends MoveEffectAttr
 */
export class CopyTypeAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    const targetTypes = target.getTypes(true);
    if (targetTypes.includes(Type.UNKNOWN) && targetTypes.indexOf(Type.UNKNOWN) > -1) {
      targetTypes[targetTypes.indexOf(Type.UNKNOWN)] = Type.NORMAL;
    }
    user.summonData.types = targetTypes;
    user.updateInfo();

    globalScene.queueMessage(
      i18next.t("moveTriggers:copyType", {
        pokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }

  /**
   * Moves with this attribute fail if
   * - The target is {@linkcode Type.UNKNOWN typeless}
   * - The target has an added type (e.g. from Forest's Curse).
   */
  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => target.getTypes()[0] !== Type.UNKNOWN || target.summonData.addedType !== null;
  }
}
