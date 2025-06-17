import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveEffectTrigger } from "#enums/move-effect-trigger";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to apply the effects of {@link https://bulbapedia.bulbagarden.net/wiki/Rage_(move) | Rage}.
 * If the user is attacked while rage is active they will gain +1 atk boost.
 */
export class RageAttr extends MoveEffectAttr {
  constructor() {
    super(true, { trigger: MoveEffectTrigger.PRE_APPLY });
  }

  override applyEffect(user: Pokemon, _target: Pokemon, move: Move): boolean {
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      `${i18next.t("moveTriggers:rageIsBuilding", { pokemonName: getPokemonNameWithAffix(user) })}`,
    );
    user.addTag(BattlerTagType.RAGE, undefined, move.id, user.id);
    return true;
  }
}
