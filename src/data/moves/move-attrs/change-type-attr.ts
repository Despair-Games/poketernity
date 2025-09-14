import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Abstract attribute to change a Pokemon's type to a single type.
 * This effect may apply to the move's user or target.
 * @abstract
 */
export abstract class ChangeTypeAttr extends MoveEffectAttr {
  public override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    const pokemon = this.selfTarget ? user : target;
    const targetType = this.getType(user, target, move);

    pokemon.setTemporaryTypes(targetType);
    pokemon.updateInfo();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:transformedIntoType", {
        pokemonName: getPokemonNameWithAffix(pokemon),
        typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, targetType)}`),
      }),
    );

    return true;
  }

  protected abstract getType(_user: Pokemon, _target: Pokemon, _move: Move): ElementalType;

  /**
   * All moves that change type fail if the effect's target
   * is Terastallized or has Multitype or RKS System as an ability
   */
  public override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      const pokemon = this.selfTarget ? user : target;
      return (
        !pokemon.isTerastallized
        && !pokemon.hasAbility(AbilityId.MULTITYPE)
        && !pokemon.hasAbility(AbilityId.RKS_SYSTEM)
      );
    };
  }
}
