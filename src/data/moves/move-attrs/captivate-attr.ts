import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { AbilityId } from "#enums/ability-id";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute used for captivate where all opponents that do not have the {@linkcode AbilityId.OBLIVIOUS} ability
 * and are of opposite gender from the user has their SPATK stat dropped by 2 stages
 */
export class CaptivateAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    // TODO: Should show oblivious ability flyout if target has oblivious
    if (!target.hasAbility(AbilityId.OBLIVIOUS) && target.isOppositeGender(user)) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "StatStageChangePhase",
        target.getBattlerIndex(),
        user,
        [Stat.SPATK],
        -2,
      );
      return true;
    }
    // It doesn't affect pokemonNameWithAffix!
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:moveImmunity", {
        pokemonNameWithAffix: getPokemonNameWithAffix(target),
      }),
    );
    return false;
  }
}
