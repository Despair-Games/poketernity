import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-condition-func";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to change the target's type to a set type.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Soak_(move) | Soak}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Magic_Powder_(move) | Magic Powder}.
 */
export class ChangeTypeAttr extends MoveEffectAttr {
  private type: ElementalType;

  constructor(type: ElementalType) {
    super(false);

    this.type = type;
  }

  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    target.setTemporaryTypes(this.type);
    target.updateInfo();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(target),
        typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, this.type)}`),
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) =>
      !target.isTerastallized
      && !target.hasAbility(AbilityId.MULTITYPE)
      && !target.hasAbility(AbilityId.RKS_SYSTEM)
      && !(target.getTypes().length === 1 && target.getTypes()[0] === this.type);
  }
}
