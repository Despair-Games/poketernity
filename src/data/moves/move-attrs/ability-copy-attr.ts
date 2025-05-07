import type { MoveConditionFunc } from "#app/@types/MoveConditionFunc";
import { allAbilities } from "#app/data/data-lists";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";
import type { EnemyPokemon } from "#app/field/enemy-pokemon";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { detrimentalAbilities } from "#app/utils/ability-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import i18next from "i18next";

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

    globalScene.phaseManager.queueMessagePhase(
      i18next.t("moveTriggers:copiedTargetAbility", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
        abilityName: allAbilities[target.getAbility().id].name,
      }),
    );

    const allyPokemon = user.getAlly();
    if (this.copyToPartner && globalScene.currentBattle?.double && allyPokemon?.isActive(true)) {
      allyPokemon.summonData.ability = target.getAbility().id;
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("moveTriggers:copiedTargetAbility", {
          pokemonName: getPokemonNameWithAffix(allyPokemon),
          targetName: getPokemonNameWithAffix(target),
          abilityName: target.getAbility().name,
        }),
      );
    }

    return true;
  }

  override getCondition(): MoveConditionFunc {
    return (user, target, _move) => {
      let ret =
        !target.getAbility().hasAttrFlag(AbAttrFlag.UNCOPIABLE_ABILITY)
        && !user.getAbility().hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY);
      if (this.copyToPartner && globalScene.currentBattle?.double) {
        ret =
          ret
          && (user.getAlly()?.hp === 0 || !user.getAlly()?.getAbility().hasAttrFlag(AbAttrFlag.UNSUPPRESSABLE_ABILITY));
      } else {
        ret = ret && user.getAbility().id !== target.getAbility().id;
      }
      return ret;
    };
  }

  /**
   * If the target's ability is detrimental, grants a (-5) penalty.
   * Otherwise, grants (+2) effect score if one Pokemon's detrimental ability is overridden
   * by this effect, and (+3) if more than one Pokemon's detrimental ability is overridden.
   * @see {@linkcode detrimentalAbilities}
   */
  override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const targetRevealedAbilityId = target.getAbilities({ revealedOnly: true }).find((ab) => !ab.passive)?.ability.id;

    if (!targetRevealedAbilityId || detrimentalAbilities.includes(targetRevealedAbilityId)) {
      return -5;
    }

    const affectedPokemon: Pokemon[] = [user];
    const ally = user.getAlly();
    if (this.copyToPartner && ally?.isActive(true)) {
      affectedPokemon.push(ally);
    }

    const numBenefit = affectedPokemon.filter((p) => detrimentalAbilities.includes(p.getAbility().id)).length;
    return Math.min(numBenefit * 2, 3);
  }
}
