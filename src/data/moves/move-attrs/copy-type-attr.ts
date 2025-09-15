/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { ChangeTypeAttr } from "#moves/change-type-attr";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
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

  public override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    const targetTypes = target.getTypes(true, true);
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
  public override getCondition(): MoveConditionFunc {
    return (_user, target, _move) =>
      target.getTypes()[0] !== ElementalType.UNKNOWN || target.summonData.addedType !== null;
  }

  /**
   * @returns An Effect Score modifier depending on how much the user benefits from this effect's type change.
   * @see {@linkcode ChangeTypeAttr.getTypeChangeScore}
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const opponents = user.getOpponents();
    const defEffectiveness = opponents.map((opp) =>
      Math.max(...opp.getTypes(true).map((t) => user.getAttackTypeEffectiveness(t, undefined, false, true))),
    );
    const modDefEffectiveness = opponents.map((opp) =>
      Math.max(...opp.getTypes(true).map((t) => target.getAttackTypeEffectiveness(t, undefined, false, true))),
    );
    const avgDefEffectiveness = defEffectiveness.reduce((total, eff) => total + eff) / defEffectiveness.length;
    const avgModDefEffectiveness = modDefEffectiveness.reduce((total, eff) => total + eff) / modDefEffectiveness.length;

    if (avgModDefEffectiveness >= avgDefEffectiveness) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }

    const userOutspeeds = opponents.every((opp) => user.outspeeds(opp, true));
    return userOutspeeds ? MINOR_EFFECT_SCORE_BONUS : 0;
  }
}
