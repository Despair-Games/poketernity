import { Abilities } from "#enums/abilities";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import type { Move, MoveConditionFunc } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

export class ChangeTypeAttr extends MoveEffectAttr {
  private type: Type;

  constructor(type: Type) {
    super(false);

    this.type = type;
  }

  override apply(_user: Pokemon, target: Pokemon, _move: Move, _args: any[]): boolean {
    target.summonData.types = [this.type];
    target.updateInfo();

    globalScene.queueMessage(
      i18next.t("moveTriggers:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(target),
        typeName: i18next.t(`pokemonInfo:Type.${Type[this.type]}`),
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) =>
      !target.isTerastallized()
      && !target.hasAbility(Abilities.MULTITYPE)
      && !target.hasAbility(Abilities.RKS_SYSTEM)
      && !(target.getTypes().length === 1 && target.getTypes()[0] === this.type);
  }
}
