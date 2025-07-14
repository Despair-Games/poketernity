import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import i18next from "i18next";

/**
 * Attribute to change the user's type to match the target's type(s).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Reflect_Type_(move) | Reflect Type}.
 */
export class CopyTypeAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const targetTypes = target.getTypes(true);
    if (targetTypes.includes(ElementalType.UNKNOWN) && targetTypes.indexOf(ElementalType.UNKNOWN) > -1) {
      targetTypes[targetTypes.indexOf(ElementalType.UNKNOWN)] = ElementalType.NORMAL;
    }
    user.setTemporaryTypes(targetTypes);
    user.updateInfo();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:copyType", {
        pokemonName: getPokemonNameWithAffix(user),
        targetPokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }

  /**
   * Moves with this attribute fail if
   * - The target is {@linkcode ElementalType.UNKNOWN | typeless}
   * - The target has an added type (e.g. from Forest's Curse).
   */
  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) =>
      target.getTypes()[0] !== ElementalType.UNKNOWN || target.summonData.addedType !== null;
  }
}
