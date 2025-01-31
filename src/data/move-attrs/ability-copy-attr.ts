import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import i18next from "i18next";
import { allAbilities } from "#app/data/ability";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import type { MoveConditionFunc } from "../move-conditions";
import { AbAttrId } from "#enums/ab-attr-id";

/**
 * Attribute to copy the target's ability onto the user (and, optionally, the user's ally).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Role_Play_(move) | Role Play}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Doodle_(move) | Doodle}.
 * @extends MoveEffectAttr
 */
export class AbilityCopyAttr extends MoveEffectAttr {
  public copyToPartner: boolean;

  constructor(copyToPartner: boolean = false) {
    super(false);

    this.copyToPartner = copyToPartner;
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    user.summonData.ability = target.getAbility().id;

    globalScene.queueMessage(
      i18next.t("moveTriggers:copiedTargetAbility", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
        abilityName: allAbilities[target.getAbility().id].name,
      }),
    );

    if (this.copyToPartner && globalScene.currentBattle?.double && user.getAlly().hp) {
      user.getAlly().summonData.ability = target.getAbility().id;
      globalScene.queueMessage(
        i18next.t("moveTriggers:copiedTargetAbility", {
          pokemonName: getPokemonNameWithAffix(user.getAlly()),
          targetName: getPokemonNameWithAffix(target),
          abilityName: allAbilities[target.getAbility().id].name,
        }),
      );
    }

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      let ret =
        !target.getAbility().hasAttr(AbAttrId.UNCOPIABLE_ABILITY)
        && !user.getAbility().hasAttr(AbAttrId.UNSUPPRESSABLE_ABILITY);
      if (this.copyToPartner && globalScene.currentBattle?.double) {
        ret = ret && (!user.getAlly().hp || !user.getAlly().getAbility().hasAttr(AbAttrId.UNSUPPRESSABLE_ABILITY));
      } else {
        ret = ret && user.getAbility().id !== target.getAbility().id;
      }
      return ret;
    };
  }
}
