import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";
import { enumValueToKey } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Attribute to add a set type to the target.
 * Note that this doesn't overwrite any of the target's base types;
 * it only overwrites types added by other moves with this attribute.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Forest%27s_Curse_(move) | Forest's Curse}
 * and {@linkcode https://bulbapedia.bulbagarden.net/wiki/Trick-or-Treat_(move) | Trick-or-Treat}.
 */
export class AddTypeAttr extends MoveEffectAttr {
  private type: ElementalType;

  constructor(type: ElementalType) {
    super(false);

    this.type = type;
  }

  override applyEffect(_user: Pokemon, target: Pokemon, _move: Move): boolean {
    target.summonData.addedType = this.type;
    target.updateInfo();

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:addType", {
        typeName: i18next.t(`pokemonInfo:Type.${enumValueToKey(ElementalType, this.type)}`),
        pokemonName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (_user, target, _move) => !target.isTerastallized && !target.getTypes().includes(this.type);
  }
}
