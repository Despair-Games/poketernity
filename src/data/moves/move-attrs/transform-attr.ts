import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import i18next from "i18next";

/**
 * Attribute to transform the user into the target,
 * copying its species, form, ability, moveset, and stats (except for HP).
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Transform_(move) | Transform}.
 * @see {@linkcode PokemonTransformPhase}
 */
export class TransformAttr extends MoveEffectAttr {
  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    globalScene.phaseManager.createAndUnshiftPhase(
      "PokemonTransformPhase",
      user.getBattlerIndex(),
      target.getBattlerIndex(),
    );

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("moveTriggers:transformedIntoTarget", {
        pokemonName: getPokemonNameWithAffix(user),
        targetName: getPokemonNameWithAffix(target),
      }),
    );

    return true;
  }
}
