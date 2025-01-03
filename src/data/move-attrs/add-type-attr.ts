import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to add a set type to the target.
 * Note that this doesn't overwrite any of the target's base types;
 * it only overwrites types added by other moves with this attribute.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Forest%27s_Curse_(move) Forest's Curse}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Trick-or-Treat_(move) Trick-or-Treat}.
 * @extends MoveEffectAttr
 */
export class AddTypeAttr extends MoveEffectAttr {
  private type: Type;

  constructor(type: Type) {
    super(false);

    this.type = type;
  }

  override apply(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    target.summonData.addedType = this.type;
    target.updateInfo();

    globalScene.queueMessage(
      i18next.t("moveTriggers:addType", {
        typeName: i18next.t(`pokemonInfo:Type.${Type[this.type]}`),
        pokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => !target.isTerastallized() && !target.getTypes().includes(this.type);
  }
}
