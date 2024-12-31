import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { UncopiableAbilityAbAttr } from "#app/data/ab-attrs/uncopiable-ability-ab-attr";
import { UnsuppressableAbilityAbAttr } from "#app/data/ab-attrs/unsuppressable-ability-ab-attr";
import { allAbilities } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";

export class AbilityGiveAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  /** Gives the user's ability to the given target */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    target.summonData.ability = user.getAbility().id;

    globalScene.queueMessage(
      i18next.t("moveTriggers:acquiredAbility", {
        pokemonName: getPokemonNameWithAffix(target),
        abilityName: allAbilities[user.getAbility().id].name,
      }),
    );

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) =>
      !user.getAbility().hasAttr(UncopiableAbilityAbAttr)
      && !target.getAbility().hasAttr(UnsuppressableAbilityAbAttr)
      && user.getAbility().id !== target.getAbility().id;
  }
}
